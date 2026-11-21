package gov.in.grants.controller;

import gov.in.grants.dto.AuthRequest;
import gov.in.grants.dto.AuthResponse;
import gov.in.grants.entity.Role;
import gov.in.grants.entity.User;
import gov.in.grants.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        User user = (User) authentication.getPrincipal();
        List<String> roleCodes = user.getRoles().stream()
                .map(Role::getRoleCode)
                .collect(Collectors.toList());

        Long orgId = user.getOrganization() != null ? user.getOrganization().getOrgId() : null;
        String orgName = user.getOrganization() != null ? user.getOrganization().getOrgName() : null;

        return ResponseEntity.ok(new AuthResponse(
                null,
                user.getUserId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getDesignation(),
                orgId,
                orgName,
                roleCodes
        ));
    }
}
