package gov.in.grants.repository;

import gov.in.grants.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByApplicationNumber(String applicationNumber);
    List<Application> findByProgram_ProgramId(Long programId);
    List<Application> findByApplicantUser_UserId(Long userId);
    List<Application> findByOrganization_OrgId(Long orgId);
    List<Application> findByApplicationStatus(String status);
    List<Application> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(a) FROM Application a WHERE a.applicationStatus = :status")
    long countByStatus(String status);
}
