package gov.in.grants.service;

import gov.in.grants.config.JwtTokenProvider;
import gov.in.grants.dto.AuthRequest;
import gov.in.grants.dto.AuthResponse;
import gov.in.grants.entity.Role;
import gov.in.grants.entity.User;
import gov.in.grants.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        List<String> roleCodes = user.getRoles().stream()
                .map(Role::getRoleCode)
                .collect(Collectors.toList());

        String token = tokenProvider.generateToken(user.getUsername(), roleCodes);

        Long orgId = user.getOrganization() != null ? user.getOrganization().getOrgId() : null;
        String orgName = user.getOrganization() != null ? user.getOrganization().getOrgName() : null;

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getDesignation(),
                orgId,
                orgName,
                roleCodes
        );
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
