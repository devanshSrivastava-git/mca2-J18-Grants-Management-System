package gov.in.grants.controller;

import gov.in.grants.dto.DisbursementActionRequest;
import gov.in.grants.entity.Disbursement;
import gov.in.grants.entity.ProgressReport;
import gov.in.grants.entity.User;
import gov.in.grants.repository.UserRepository;
import gov.in.grants.service.DisbursementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disbursements")
public class DisbursementController {

    private final DisbursementService disbursementService;
    private final UserRepository userRepository;

    public DisbursementController(DisbursementService disbursementService, UserRepository userRepository) {
        this.disbursementService = disbursementService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Disbursement>> getAllDisbursements(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(disbursementService.getAllDisbursements(status));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<Disbursement>> getDisbursementsByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(disbursementService.getDisbursementsForApplication(applicationId));
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<?> processDisbursement(
            @PathVariable Long id,
            @RequestBody DisbursementActionRequest request,
            Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            user = userRepository.findByUsername("fin_neha").orElseGet(() -> userRepository.findAll().get(0));
        }

        try {
            Disbursement processed = disbursementService.processDisbursement(id, request, user);
            return ResponseEntity.ok(processed);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ProgressReport>> getAllProgressReports() {
        return ResponseEntity.ok(disbursementService.getAllProgressReports());
    }

    @GetMapping("/reports/application/{applicationId}")
    public ResponseEntity<List<ProgressReport>> getProgressReportsByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(disbursementService.getProgressReportsForApplication(applicationId));
    }
}
