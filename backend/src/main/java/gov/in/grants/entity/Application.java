package gov.in.grants.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "APPLICATIONS")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "application_number", nullable = false, unique = true, length = 50)
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "program_id", nullable = false)
    private GrantProgram program;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "applicant_user_id", nullable = false)
    private User applicantUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "project_title", nullable = false, length = 255)
    private String projectTitle;

    @Column(name = "executive_summary", nullable = false, length = 2000)
    private String executiveSummary;

    @Column(name = "requested_amount_inr", nullable = false)
    private BigDecimal requestedAmountInr;

    @Column(name = "approved_amount_inr")
    private BigDecimal approvedAmountInr;

    @Column(name = "project_duration_months", nullable = false)
    private Integer projectDurationMonths;

    @Column(name = "eligibility_status", nullable = false, length = 30)
    private String eligibilityStatus = "PENDING"; // PENDING, ELIGIBLE, INELIGIBLE

    @Column(name = "eligibility_remarks", length = 500)
    private String eligibilityRemarks;

    @Column(name = "application_status", nullable = false, length = 30)
    private String applicationStatus = "DRAFT"; // DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED, CLOSED

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApplicationDocument> documents = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Application() {}

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public GrantProgram getProgram() { return program; }
    public void setProgram(GrantProgram program) { this.program = program; }

    public User getApplicantUser() { return applicantUser; }
    public void setApplicantUser(User applicantUser) { this.applicantUser = applicantUser; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public BigDecimal getRequestedAmountInr() { return requestedAmountInr; }
    public void setRequestedAmountInr(BigDecimal requestedAmountInr) { this.requestedAmountInr = requestedAmountInr; }

    public BigDecimal getApprovedAmountInr() { return approvedAmountInr; }
    public void setApprovedAmountInr(BigDecimal approvedAmountInr) { this.approvedAmountInr = approvedAmountInr; }

    public Integer getProjectDurationMonths() { return projectDurationMonths; }
    public void setProjectDurationMonths(Integer projectDurationMonths) { this.projectDurationMonths = projectDurationMonths; }

    public String getEligibilityStatus() { return eligibilityStatus; }
    public void setEligibilityStatus(String eligibilityStatus) { this.eligibilityStatus = eligibilityStatus; }

    public String getEligibilityRemarks() { return eligibilityRemarks; }
    public void setEligibilityRemarks(String eligibilityRemarks) { this.eligibilityRemarks = eligibilityRemarks; }

    public String getApplicationStatus() { return applicationStatus; }
    public void setApplicationStatus(String applicationStatus) { this.applicationStatus = applicationStatus; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public List<ApplicationDocument> getDocuments() { return documents; }
    public void setDocuments(List<ApplicationDocument> documents) { this.documents = documents; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
