package gov.in.grants.repository;

import gov.in.grants.entity.ProgramEligibilityCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgramEligibilityCriterionRepository extends JpaRepository<ProgramEligibilityCriterion, Long> {
    List<ProgramEligibilityCriterion> findByProgram_ProgramId(Long programId);
}
