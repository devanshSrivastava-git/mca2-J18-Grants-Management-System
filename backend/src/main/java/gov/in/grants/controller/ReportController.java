package gov.in.grants.controller;

import gov.in.grants.dto.DashboardMetricsDto;
import gov.in.grants.entity.AuditLog;
import gov.in.grants.repository.AuditLogRepository;
import gov.in.grants.service.ReportingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportingService reportingService;
    private final AuditLogRepository auditLogRepository;

    public ReportController(ReportingService reportingService, AuditLogRepository auditLogRepository) {
        this.reportingService = reportingService;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardMetricsDto> getDashboardMetrics() {
        return ResponseEntity.ok(reportingService.getDashboardMetrics());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getRecentAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findTop20ByOrderByActionTimestampDesc());
    }
}
