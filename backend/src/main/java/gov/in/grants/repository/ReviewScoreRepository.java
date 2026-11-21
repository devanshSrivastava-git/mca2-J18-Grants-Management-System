package gov.in.grants.repository;

import gov.in.grants.entity.ReviewScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewScoreRepository extends JpaRepository<ReviewScore, Long> {
    List<ReviewScore> findByReview_ReviewId(Long reviewId);
}
