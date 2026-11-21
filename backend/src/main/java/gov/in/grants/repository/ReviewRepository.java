package gov.in.grants.repository;

import gov.in.grants.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByApplication_ApplicationId(Long applicationId);
    List<Review> findByReviewerUser_UserId(Long userId);
    Optional<Review> findByApplication_ApplicationIdAndReviewerUser_UserId(Long applicationId, Long userId);
    List<Review> findByReviewStatus(String reviewStatus);
}
