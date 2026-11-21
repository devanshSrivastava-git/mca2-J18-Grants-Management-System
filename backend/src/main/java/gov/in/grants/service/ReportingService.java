package gov.in.grants.service;

import gov.in.grants.dto.DashboardMetricsDto;
import gov.in.grants.entity.Application;
import gov.in.grants.entity.GrantProgram;
import gov.in.grants.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportingService {

    private final GrantProgramRepository grantProgramRepository;
    private final ApplicationRepository applicationRepository;
    private final DisbursementRepository disbursementRepository;

    public ReportingService(
            GrantProgramRepository grantProgramRepository,
            ApplicationRepository applicationRepository,
            DisbursementRepository disbursementRepository) {
        this.grantProgramRepository = grantProgramRepository;
        this.applicationRepository = applicationRepository;
        this.disbursementRepository = disbursementRepository;
    }

    public DashboardMetricsDto getDashboardMetrics() {
        DashboardMetricsDto metrics = new DashboardMetricsDto();

        List<GrantProgram> programs = grantProgramRepository.findAll();
        List<Application> applications = applicationRepository.findAll();

        metrics.setTotalPrograms(programs.size());
        metrics.setActivePrograms(programs.stream().filter(p -> "PUBLISHED".equalsIgnoreCase(p.getStatus())).count());

        metrics.setTotalApplications(applications.size());
        metrics.setSubmittedApplications(applications.stream().filter(a -> "SUBMITTED".equalsIgnoreCase(a.getApplicationStatus())).count());
        metrics.setUnderReviewApplications(applications.stream().filter(a -> "UNDER_REVIEW".equalsIgnoreCase(a.getApplicationStatus())).count());
        metrics.setApprovedApplications(applications.stream().filter(a -> "APPROVED".equalsIgnoreCase(a.getApplicationStatus())).count());
        metrics.setRejectedApplications(applications.stream().filter(a -> "REJECTED".equalsIgnoreCase(a.getApplicationStatus())).count());
        metrics.setDisbursedApplications(applications.stream().filter(a -> "DISBURSED".equalsIgnoreCase(a.getApplicationStatus())).count());

        BigDecimal totalBudget = programs.stream()
                .map(GrantProgram::getTotalBudgetInr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalAllocated = programs.stream()
                .map(GrantProgram::getAllocatedBudgetInr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDisbursed = disbursementRepository.sumTotalDisbursed();

        metrics.setTotalBudgetPoolInr(totalBudget);
        metrics.setTotalAllocatedInr(totalAllocated);
        metrics.setTotalDisbursedInr(totalDisbursed);

        // Group by category
        Map<String, Long> byCategory = new HashMap<>();
        for (Application app : applications) {
            String cat = app.getProgram() != null ? app.getProgram().getCategory() : "General";
            byCategory.put(cat, byCategory.getOrDefault(cat, 0L) + 1);
        }
        metrics.setApplicationsByCategory(byCategory);

        // Group by status
        Map<String, Long> byStatus = new HashMap<>();
        for (Application app : applications) {
            byStatus.put(app.getApplicationStatus(), byStatus.getOrDefault(app.getApplicationStatus(), 0L) + 1);
        }
        metrics.setApplicationsByStatus(byStatus);

        return metrics;
    }
}
