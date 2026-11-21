package gov.in.grants.controller;

import gov.in.grants.dto.ReviewSubmissionRequest;
import gov.in.grants.entity.Review;
import gov.in.grants.entity.User;
import gov.in.grants.repository.UserRepository;
import gov.in.grants.service.ReviewWorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewWorkflowService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewWorkflowService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Review>> getMyReviews(Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            user = userRepository.findByUsername("rev_ananya").orElseGet(() -> userRepository.findAll().get(0));
        }
        return ResponseEntity.ok(reviewService.getReviewsForReviewer(user));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<Review>> getReviewsForApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(reviewService.getReviewsForApplication(applicationId));
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignReviewer(
            @RequestBody Map<String, Long> payload,
            Authentication authentication) {
        Long applicationId = payload.get("applicationId");
        Long reviewerUserId = payload.get("reviewerUserId");

        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            user = userRepository.findByUsername("pm_rajesh").orElseGet(() -> userRepository.findAll().get(0));
        }

        try {
            Review review = reviewService.assignReviewer(applicationId, reviewerUserId, user);
            return ResponseEntity.ok(review);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/{reviewId}/submit")
    public ResponseEntity<?> submitReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewSubmissionRequest request,
            Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            user = (User) authentication.getPrincipal();
        } else {
            user = userRepository.findByUsername("rev_ananya").orElseGet(() -> userRepository.findAll().get(0));
        }

        try {
            Review submitted = reviewService.submitReview(reviewId, request, user);
            return ResponseEntity.ok(submitted);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
