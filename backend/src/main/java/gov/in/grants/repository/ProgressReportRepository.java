package gov.in.grants.repository;

import gov.in.grants.entity.ProgressReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgressReportRepository extends JpaRepository<ProgressReport, Long> {
    List<ProgressReport> findByApplication_ApplicationId(Long applicationId);
    List<ProgressReport> findAllByOrderBySubmissionDateDesc();
}
