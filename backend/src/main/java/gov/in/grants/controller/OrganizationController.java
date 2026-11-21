package gov.in.grants.controller;

import gov.in.grants.entity.Organization;
import gov.in.grants.entity.User;
import gov.in.grants.repository.OrganizationRepository;
import gov.in.grants.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public OrganizationController(OrganizationRepository organizationRepository, UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        return ResponseEntity.ok(organizationRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable Long id) {
        return organizationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reviewers")
    public ResponseEntity<List<User>> getReviewerUsers() {
        return ResponseEntity.ok(userRepository.findByRoles_RoleCode("ROLE_REVIEWER"));
    }
}
