package gov.in.grants.controller;

import gov.in.grants.dto.ApplicationSubmissionRequest;
import gov.in.grants.dto.ApprovalDecisionRequest;
import gov.in.grants.entity.Application;
import gov.in.grants.entity.User;
import gov.in.grants.repository.UserRepository;
import gov.in.grants.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public ApplicationController(ApplicationService applicationService, UserRepository userRepository) {
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications(
            @RequestParam(required = false) Long programId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(applicationService.getAllApplications(programId, status));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            user = userRepository.findByUsername("app_vikram").orElseGet(() -> userRepository.findAll().get(0));
        }
        return ResponseEntity.ok(applicationService.getMyApplications(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PostMapping
    public ResponseEntity<?> submitApplication(
            @RequestBody ApplicationSubmissionRequest request,
            Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            user = userRepository.findByUsername("app_vikram").orElseGet(() -> userRepository.findAll().get(0));
        }

        try {
            Application submitted = applicationService.submitApplication(request, user);
            return ResponseEntity.ok(submitted);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/{id}/decision")
    public ResponseEntity<?> decideApproval(
            @PathVariable Long id,
            @RequestBody ApprovalDecisionRequest decisionRequest,
            Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            user = userRepository.findByUsername("pm_rajesh").orElseGet(() -> userRepository.findAll().get(0));
        }

        try {
            Application decided = applicationService.decideApproval(id, decisionRequest, user);
            return ResponseEntity.ok(decided);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
