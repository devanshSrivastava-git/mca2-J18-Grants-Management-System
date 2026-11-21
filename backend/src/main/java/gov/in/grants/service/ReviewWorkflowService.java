package gov.in.grants.service;

import gov.in.grants.dto.ReviewSubmissionRequest;
import gov.in.grants.entity.*;
import gov.in.grants.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewWorkflowService {

    private final ReviewRepository reviewRepository;
    private final ReviewScoreRepository reviewScoreRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public ReviewWorkflowService(
            ReviewRepository reviewRepository,
            ReviewScoreRepository reviewScoreRepository,
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            AuditLogRepository auditLogRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewScoreRepository = reviewScoreRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsForReviewer(User reviewer) {
        return reviewRepository.findByReviewerUser_UserId(reviewer.getUserId());
    }

    public List<Review> getReviewsForApplication(Long applicationId) {
        return reviewRepository.findByApplication_ApplicationId(applicationId);
    }

    @Transactional
    public Review assignReviewer(Long applicationId, Long reviewerUserId, User assignedBy) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        User reviewer = userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new RuntimeException("Reviewer user not found: " + reviewerUserId));

        // Check if already assigned
        Review review = reviewRepository.findByApplication_ApplicationIdAndReviewerUser_UserId(applicationId, reviewerUserId)
                .orElse(null);

        if (review == null) {
            review = new Review();
            review.setApplication(application);
            review.setReviewerUser(reviewer);
            review.setAssignedDate(LocalDateTime.now());
            review.setReviewStatus("ASSIGNED");
            review = reviewRepository.save(review);
        }

        // Transition application status to UNDER_REVIEW
        if ("SUBMITTED".equals(application.getApplicationStatus())) {
            application.setApplicationStatus("UNDER_REVIEW");
            application.setUpdatedAt(LocalDateTime.now());
            applicationRepository.save(application);

            auditLogRepository.save(new AuditLog("APPLICATION", applicationId, "REVIEW_ASSIGNMENT",
                    assignedBy, "SUBMITTED", "UNDER_REVIEW",
                    "Assigned to reviewer: " + reviewer.getFullName()));
        }

        return review;
    }

    @Transactional
    public Review submitReview(Long reviewId, ReviewSubmissionRequest request, User reviewer) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        review.setTotalScore(request.getTotalScore());
        review.setRecommendation(request.getRecommendation());
        review.setComments(request.getComments());
        review.setCompletedDate(LocalDateTime.now());
        review.setReviewStatus("COMPLETED");

        Review saved = reviewRepository.save(review);

        // Save detailed criterion sub-scores
        if (request.getScores() != null && !request.getScores().isEmpty()) {
            for (ReviewSubmissionRequest.ScoreDto dto : request.getScores()) {
                ReviewScore score = new ReviewScore();
                score.setReview(saved);
                score.setCriterionName(dto.getCriterionName());
                score.setMaxScore(dto.getMaxScore());
                score.setAssignedScore(dto.getAssignedScore());
                score.setRemarks(dto.getRemarks());
                reviewScoreRepository.save(score);
            }
        }

        auditLogRepository.save(new AuditLog("REVIEW", reviewId, "REVIEW_COMPLETED",
                reviewer, "ASSIGNED", "COMPLETED",
                "Evaluation completed with score " + request.getTotalScore() + "/100 and recommendation: " + request.getRecommendation()));

        return saved;
    }
}
