package gov.in.grants.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "PROGRESS_REPORTS")
public class ProgressReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "report_title", nullable = false, length = 200)
    private String reportTitle;

    @Column(name = "milestone_achieved", nullable = false, length = 2000)
    private String milestoneAchieved;

    @Column(name = "funds_utilized_inr", nullable = false)
    private BigDecimal fundsUtilizedInr;

    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate = LocalDate.now();

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SUBMITTED"; // SUBMITTED, VERIFIED, NEEDS_CLARIFICATION

    @Column(name = "remarks", length = 500)
    private String remarks;

    public ProgressReport() {}

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public String getReportTitle() { return reportTitle; }
    public void setReportTitle(String reportTitle) { this.reportTitle = reportTitle; }

    public String getMilestoneAchieved() { return milestoneAchieved; }
    public void setMilestoneAchieved(String milestoneAchieved) { this.milestoneAchieved = milestoneAchieved; }

    public BigDecimal getFundsUtilizedInr() { return fundsUtilizedInr; }
    public void setFundsUtilizedInr(BigDecimal fundsUtilizedInr) { this.fundsUtilizedInr = fundsUtilizedInr; }

    public LocalDate getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDate submissionDate) { this.submissionDate = submissionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
