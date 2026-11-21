package gov.in.grants.service;

import gov.in.grants.dto.ApplicationSubmissionRequest;
import gov.in.grants.dto.ApprovalDecisionRequest;
import gov.in.grants.dto.EligibilityCheckRequest;
import gov.in.grants.dto.EligibilityCheckResponse;
import gov.in.grants.entity.*;
import gov.in.grants.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final GrantProgramRepository grantProgramRepository;
    private final OrganizationRepository organizationRepository;
    private final ApplicationDocumentRepository documentRepository;
    private final AuditLogRepository auditLogRepository;
    private final EligibilityEngine eligibilityEngine;
    private final DisbursementRepository disbursementRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            GrantProgramRepository grantProgramRepository,
            OrganizationRepository organizationRepository,
            ApplicationDocumentRepository documentRepository,
            AuditLogRepository auditLogRepository,
            EligibilityEngine eligibilityEngine,
            DisbursementRepository disbursementRepository) {
        this.applicationRepository = applicationRepository;
        this.grantProgramRepository = grantProgramRepository;
        this.organizationRepository = organizationRepository;
        this.documentRepository = documentRepository;
        this.auditLogRepository = auditLogRepository;
        this.eligibilityEngine = eligibilityEngine;
        this.disbursementRepository = disbursementRepository;
    }

    public List<Application> getAllApplications(Long programId, String status) {
        if (programId != null) {
            return applicationRepository.findByProgram_ProgramId(programId);
        }
        if (status != null && !status.trim().isEmpty()) {
            return applicationRepository.findByApplicationStatus(status.toUpperCase());
        }
        return applicationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Application> getMyApplications(User user) {
        return applicationRepository.findByApplicantUser_UserId(user.getUserId());
    }

    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
    }

    @Transactional
    public Application submitApplication(ApplicationSubmissionRequest request, User currentUser) {
        GrantProgram program = grantProgramRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Grant program not found: " + request.getProgramId()));

        Organization org = null;
        if (request.getOrgId() != null) {
            org = organizationRepository.findById(request.getOrgId()).orElse(null);
        }
        if (org == null) {
            org = currentUser.getOrganization();
        }
        if (org == null) {
            // Default to first organization for self-contained testing if user is direct individual
            org = organizationRepository.findAll().stream().findFirst().orElseThrow();
        }

        // Run automated eligibility verification
        EligibilityCheckRequest eligReq = new EligibilityCheckRequest();
        eligReq.setProgramId(program.getProgramId());
        eligReq.setOrgId(org.getOrgId());
        eligReq.setRequestedAmountInr(request.getRequestedAmountInr());
        eligReq.setOrgType(org.getOrgType());
        eligReq.setEstablishedYear(org.getEstablishedYear());
        eligReq.setAnnualTurnoverInr(org.getAnnualTurnoverInr());
        eligReq.setHasRegistrationDoc(true);

        EligibilityCheckResponse eligRes = eligibilityEngine.evaluate(eligReq);

        Application application = new Application();
        long count = applicationRepository.count();
        application.setApplicationNumber("GMS-" + LocalDate.now().getYear() + "-APP-" + (2000 + count + 1));
        application.setProgram(program);
        application.setApplicantUser(currentUser);
        application.setOrganization(org);
        application.setProjectTitle(request.getProjectTitle());
        application.setExecutiveSummary(request.getExecutiveSummary());
        application.setRequestedAmountInr(request.getRequestedAmountInr());
        application.setProjectDurationMonths(request.getProjectDurationMonths() != null ? request.getProjectDurationMonths() : 12);
        application.setEligibilityStatus(eligRes.isEligible() ? "ELIGIBLE" : "INELIGIBLE");
        application.setEligibilityRemarks(eligRes.getSummary());
        application.setApplicationStatus("SUBMITTED");
        application.setSubmissionDate(LocalDateTime.now());
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        // Save documents
        if (request.getDocuments() != null && !request.getDocuments().isEmpty()) {
            for (ApplicationSubmissionRequest.DocumentDto docDto : request.getDocuments()) {
                ApplicationDocument doc = new ApplicationDocument();
                doc.setApplication(saved);
                doc.setDocumentType(docDto.getDocumentType() != null ? docDto.getDocumentType() : "DETAILED_PROJECT_REPORT");
                doc.setFileName(docDto.getFileName() != null ? docDto.getFileName() : "proposal_document.pdf");
                doc.setFileSizeBytes(docDto.getFileSizeBytes() != null ? docDto.getFileSizeBytes() : 1024000L);
                doc.setVerificationStatus("VERIFIED");
                doc.setUploadedAt(LocalDateTime.now());
                documentRepository.save(doc);
            }
        } else {
            // Add mandatory proposal document by default
            ApplicationDocument doc = new ApplicationDocument();
            doc.setApplication(saved);
            doc.setDocumentType("DETAILED_PROJECT_REPORT");
            doc.setFileName(saved.getApplicationNumber() + "_project_proposal.pdf");
            doc.setFileSizeBytes(1450000L);
            doc.setVerificationStatus("VERIFIED");
            doc.setUploadedAt(LocalDateTime.now());
            documentRepository.save(doc);
        }

        // Audit log
        AuditLog log = new AuditLog("APPLICATION", saved.getApplicationId(), "APPLICATION_SUBMISSION",
                currentUser, "DRAFT", "SUBMITTED",
                "New application submitted for program " + program.getProgramName() + " with requested INR " + saved.getRequestedAmountInr());
        auditLogRepository.save(log);

        return saved;
    }

    @Transactional
    public Application decideApproval(Long applicationId, ApprovalDecisionRequest decisionRequest, User currentUser) {
        Application application = getApplicationById(applicationId);
        String oldStatus = application.getApplicationStatus();
        String decision = decisionRequest.getDecision().toUpperCase(); // APPROVED or REJECTED

        application.setApplicationStatus(decision);
        if ("APPROVED".equals(decision)) {
            BigDecimal approvedAmt = decisionRequest.getApprovedAmountInr() != null ?
                    decisionRequest.getApprovedAmountInr() : application.getRequestedAmountInr();
            application.setApprovedAmountInr(approvedAmt);
            application.setApprovalDate(LocalDateTime.now());

            // Update program allocated budget
            GrantProgram program = application.getProgram();
            program.setAllocatedBudgetInr(program.getAllocatedBudgetInr().add(approvedAmt));
            grantProgramRepository.save(program);

            // Auto-generate 2 disbursement tranches (40% advance, 60% completion milestone)
            Disbursement t1 = new Disbursement();
            t1.setApplication(application);
            t1.setTrancheNumber(1);
            t1.setAmountInr(approvedAmt.multiply(new BigDecimal("0.40")));
            t1.setMilestoneDescription("Advance Mobilization & Initial Setup");
            t1.setScheduledDate(LocalDate.now().plusDays(10));
            t1.setPaymentStatus("PENDING");
            t1.setRemarks("Scheduled upon formal grant award agreement");
            disbursementRepository.save(t1);

            Disbursement t2 = new Disbursement();
            t2.setApplication(application);
            t2.setTrancheNumber(2);
            t2.setAmountInr(approvedAmt.multiply(new BigDecimal("0.60")));
            t2.setMilestoneDescription("Project Execution Milestone & Final Report Verification");
            t2.setScheduledDate(LocalDate.now().plusMonths(application.getProjectDurationMonths()));
            t2.setPaymentStatus("PENDING");
            t2.setRemarks("Scheduled upon verification of physical milestones");
            disbursementRepository.save(t2);
        }

        application.setUpdatedAt(LocalDateTime.now());
        Application updated = applicationRepository.save(application);

        AuditLog log = new AuditLog("APPLICATION", applicationId, "APPROVAL_DECISION",
                currentUser, oldStatus, decision,
                "Application " + decision.toLowerCase() + " by " + currentUser.getFullName() + ". Remarks: " + decisionRequest.getRemarks());
        auditLogRepository.save(log);

        return updated;
    }
}
