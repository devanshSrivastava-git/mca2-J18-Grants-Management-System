package gov.in.grants.repository;

import gov.in.grants.entity.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DisbursementRepository extends JpaRepository<Disbursement, Long> {
    List<Disbursement> findByApplication_ApplicationId(Long applicationId);
    Optional<Disbursement> findByApplication_ApplicationIdAndTrancheNumber(Long applicationId, Integer trancheNumber);
    List<Disbursement> findByPaymentStatus(String paymentStatus);
    List<Disbursement> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(d.amountInr), 0) FROM Disbursement d WHERE d.paymentStatus = 'DISBURSED'")
    BigDecimal sumTotalDisbursed();
}
