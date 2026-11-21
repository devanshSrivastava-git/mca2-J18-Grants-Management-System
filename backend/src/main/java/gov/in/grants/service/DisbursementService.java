package gov.in.grants.service;

import gov.in.grants.dto.DisbursementActionRequest;
import gov.in.grants.entity.*;
import gov.in.grants.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DisbursementService {

    private final DisbursementRepository disbursementRepository;
    private final GrantProgramRepository grantProgramRepository;
    private final ApplicationRepository applicationRepository;
    private final ProgressReportRepository progressReportRepository;
    private final AuditLogRepository auditLogRepository;

    public DisbursementService(
            DisbursementRepository disbursementRepository,
            GrantProgramRepository grantProgramRepository,
            ApplicationRepository applicationRepository,
            ProgressReportRepository progressReportRepository,
            AuditLogRepository auditLogRepository) {
        this.disbursementRepository = disbursementRepository;
        this.grantProgramRepository = grantProgramRepository;
        this.applicationRepository = applicationRepository;
        this.progressReportRepository = progressReportRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<Disbursement> getAllDisbursements(String status) {
        if (status != null && !status.trim().isEmpty()) {
            return disbursementRepository.findByPaymentStatus(status.toUpperCase());
        }
        return disbursementRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Disbursement> getDisbursementsForApplication(Long applicationId) {
        return disbursementRepository.findByApplication_ApplicationId(applicationId);
    }

    @Transactional
    public Disbursement processDisbursement(Long disbursementId, DisbursementActionRequest request, User financeOfficer) {
        Disbursement disb = disbursementRepository.findById(disbursementId)
                .orElseThrow(() -> new RuntimeException("Disbursement not found with ID: " + disbursementId));

        String oldStatus = disb.getPaymentStatus();
        String newStatus = request.getPaymentStatus().toUpperCase(); // DISBURSED, ON_HOLD, FAILED

        disb.setPaymentStatus(newStatus);
        if ("DISBURSED".equals(newStatus)) {
            disb.setDisbursedDate(request.getDisbursedDate() != null ? request.getDisbursedDate() : LocalDate.now());
            disb.setUtrNumber(request.getUtrNumber() != null ? request.getUtrNumber() : "PFMS" + System.currentTimeMillis());
            disb.setDisbursedByUser(financeOfficer);

            // Update program disbursed budget
            GrantProgram program = disb.getApplication().getProgram();
            program.setDisbursedBudgetInr(program.getDisbursedBudgetInr().add(disb.getAmountInr()));
            grantProgramRepository.save(program);

            // Update application status to DISBURSED
            Application app = disb.getApplication();
            if (!"DISBURSED".equals(app.getApplicationStatus())) {
                app.setApplicationStatus("DISBURSED");
                applicationRepository.save(app);
            }
        }

        if (request.getRemarks() != null) {
            disb.setRemarks(request.getRemarks());
        }

        Disbursement saved = disbursementRepository.save(disb);

        auditLogRepository.save(new AuditLog("DISBURSEMENT", disbursementId, "PAYMENT_STATUS_UPDATE",
                financeOfficer, oldStatus, newStatus,
                "Tranche #" + disb.getTrancheNumber() + " INR " + disb.getAmountInr() + " status updated to " + newStatus + ". UTR: " + disb.getUtrNumber()));

        return saved;
    }

    public List<ProgressReport> getAllProgressReports() {
        return progressReportRepository.findAllByOrderBySubmissionDateDesc();
    }

    public List<ProgressReport> getProgressReportsForApplication(Long applicationId) {
        return progressReportRepository.findByApplication_ApplicationId(applicationId);
    }
}
