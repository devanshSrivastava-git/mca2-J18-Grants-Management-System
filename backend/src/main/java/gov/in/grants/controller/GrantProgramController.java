package gov.in.grants.controller;

import gov.in.grants.dto.GrantProgramRequest;
import gov.in.grants.entity.GrantProgram;
import gov.in.grants.entity.User;
import gov.in.grants.repository.UserRepository;
import gov.in.grants.service.GrantProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/programs")
public class GrantProgramController {

    private final GrantProgramService programService;
    private final UserRepository userRepository;

    public GrantProgramController(GrantProgramService programService, UserRepository userRepository) {
        this.programService = programService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<GrantProgram>> listPrograms(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(programService.getAllPrograms(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrantProgram> getProgram(@PathVariable Long id) {
        return ResponseEntity.ok(programService.getProgramById(id));
    }

    @PostMapping
    public ResponseEntity<?> createProgram(@RequestBody GrantProgramRequest request, Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            // Default to program manager for demo if unauthenticated
            user = userRepository.findByUsername("pm_rajesh").orElseGet(() -> userRepository.findAll().get(0));
        }

        GrantProgram created = programService.createProgram(request, user);
        return ResponseEntity.ok(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
        }
        return ResponseEntity.ok(programService.updateStatus(id, status));
    }
}
