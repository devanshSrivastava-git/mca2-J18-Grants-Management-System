package gov.in.grants.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardMetricsDto {
    private long totalPrograms;
    private long activePrograms;
    private long totalApplications;
    private long submittedApplications;
    private long underReviewApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long disbursedApplications;
    private BigDecimal totalBudgetPoolInr;
    private BigDecimal totalAllocatedInr;
    private BigDecimal totalDisbursedInr;
    private Map<String, Long> applicationsByCategory;
    private Map<String, Long> applicationsByStatus;

    public DashboardMetricsDto() {}

    public long getTotalPrograms() { return totalPrograms; }
    public void setTotalPrograms(long totalPrograms) { this.totalPrograms = totalPrograms; }

    public long getActivePrograms() { return activePrograms; }
    public void setActivePrograms(long activePrograms) { this.activePrograms = activePrograms; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getSubmittedApplications() { return submittedApplications; }
    public void setSubmittedApplications(long submittedApplications) { this.submittedApplications = submittedApplications; }

    public long getUnderReviewApplications() { return underReviewApplications; }
    public void setUnderReviewApplications(long underReviewApplications) { this.underReviewApplications = underReviewApplications; }

    public long getApprovedApplications() { return approvedApplications; }
    public void setApprovedApplications(long approvedApplications) { this.approvedApplications = approvedApplications; }

    public long getRejectedApplications() { return rejectedApplications; }
    public void setRejectedApplications(long rejectedApplications) { this.rejectedApplications = rejectedApplications; }

    public long getDisbursedApplications() { return disbursedApplications; }
    public void setDisbursedApplications(long disbursedApplications) { this.disbursedApplications = disbursedApplications; }

    public BigDecimal getTotalBudgetPoolInr() { return totalBudgetPoolInr; }
    public void setTotalBudgetPoolInr(BigDecimal totalBudgetPoolInr) { this.totalBudgetPoolInr = totalBudgetPoolInr; }

    public BigDecimal getTotalAllocatedInr() { return totalAllocatedInr; }
    public void setTotalAllocatedInr(BigDecimal totalAllocatedInr) { this.totalAllocatedInr = totalAllocatedInr; }

    public BigDecimal getTotalDisbursedInr() { return totalDisbursedInr; }
    public void setTotalDisbursedInr(BigDecimal totalDisbursedInr) { this.totalDisbursedInr = totalDisbursedInr; }

    public Map<String, Long> getApplicationsByCategory() { return applicationsByCategory; }
    public void setApplicationsByCategory(Map<String, Long> applicationsByCategory) { this.applicationsByCategory = applicationsByCategory; }

    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }
}
