package gov.in.grants.repository;

import gov.in.grants.entity.GrantProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrantProgramRepository extends JpaRepository<GrantProgram, Long> {
    Optional<GrantProgram> findByProgramCode(String programCode);
    List<GrantProgram> findByStatus(String status);
    List<GrantProgram> findByStatusOrderByCreatedAtDesc(String status);
    List<GrantProgram> findAllByOrderByCreatedAtDesc();
}
