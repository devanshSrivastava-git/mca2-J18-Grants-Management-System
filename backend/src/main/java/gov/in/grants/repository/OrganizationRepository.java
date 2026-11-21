package gov.in.grants.repository;

import gov.in.grants.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByRegistrationNumber(String registrationNumber);
    Optional<Organization> findByPanNumber(String panNumber);
}
