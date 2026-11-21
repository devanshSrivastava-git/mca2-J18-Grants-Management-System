package gov.in.grants.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "REVIEWS", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"application_id", "reviewer_user_id"})
})
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_user_id", nullable = false)
    private User reviewerUser;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate = LocalDateTime.now();

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    @Column(name = "total_score")
    private BigDecimal totalScore;

    @Column(name = "recommendation", length = 30)
    private String recommendation; // RECOMMENDED, NOT_RECOMMENDED, RECOMMENDED_WITH_REVISIONS, PENDING

    @Column(name = "comments", length = 2000)
    private String comments;

    @Column(name = "review_status", nullable = false, length = 30)
    private String reviewStatus = "ASSIGNED"; // ASSIGNED, IN_PROGRESS, COMPLETED

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ReviewScore> scores = new ArrayList<>();

    public Review() {}

    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public User getReviewerUser() { return reviewerUser; }
    public void setReviewerUser(User reviewerUser) { this.reviewerUser = reviewerUser; }

    public LocalDateTime getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }

    public BigDecimal getTotalScore() { return totalScore; }
    public void setTotalScore(BigDecimal totalScore) { this.totalScore = totalScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }

    public List<ReviewScore> getScores() { return scores; }
    public void setScores(List<ReviewScore> scores) { this.scores = scores; }
}
