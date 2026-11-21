package gov.in.grants.repository;

import gov.in.grants.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityNameAndEntityIdOrderByActionTimestampDesc(String entityName, Long entityId);
    List<AuditLog> findTop20ByOrderByActionTimestampDesc();
}
