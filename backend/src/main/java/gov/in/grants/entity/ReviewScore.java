package gov.in.grants.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "REVIEW_SCORES")
public class ReviewScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")
    private Long scoreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @JsonIgnore
    private Review review;

    @Column(name = "criterion_name", nullable = false, length = 100)
    private String criterionName;

    @Column(name = "max_score", nullable = false)
    private Integer maxScore;

    @Column(name = "assigned_score", nullable = false)
    private BigDecimal assignedScore;

    @Column(name = "remarks", length = 500)
    private String remarks;

    public ReviewScore() {}

    public ReviewScore(Review review, String criterionName, Integer maxScore, BigDecimal assignedScore, String remarks) {
        this.review = review;
        this.criterionName = criterionName;
        this.maxScore = maxScore;
        this.assignedScore = assignedScore;
        this.remarks = remarks;
    }

    public Long getScoreId() { return scoreId; }
    public void setScoreId(Long scoreId) { this.scoreId = scoreId; }

    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }

    public String getCriterionName() { return criterionName; }
    public void setCriterionName(String criterionName) { this.criterionName = criterionName; }

    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }

    public BigDecimal getAssignedScore() { return assignedScore; }
    public void setAssignedScore(BigDecimal assignedScore) { this.assignedScore = assignedScore; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
