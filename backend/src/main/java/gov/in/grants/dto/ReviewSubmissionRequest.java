package gov.in.grants.dto;

import java.math.BigDecimal;
import java.util.List;

public class ReviewSubmissionRequest {
    private BigDecimal totalScore;
    private String recommendation; // RECOMMENDED, NOT_RECOMMENDED, RECOMMENDED_WITH_REVISIONS
    private String comments;
    private List<ScoreDto> scores;

    public static class ScoreDto {
        private String criterionName;
        private Integer maxScore;
        private BigDecimal assignedScore;
        private String remarks;

        public ScoreDto() {}

        public String getCriterionName() { return criterionName; }
        public void setCriterionName(String criterionName) { this.criterionName = criterionName; }

        public Integer getMaxScore() { return maxScore; }
        public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }

        public BigDecimal getAssignedScore() { return assignedScore; }
        public void setAssignedScore(BigDecimal assignedScore) { this.assignedScore = assignedScore; }

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }

    public ReviewSubmissionRequest() {}

    public BigDecimal getTotalScore() { return totalScore; }
    public void setTotalScore(BigDecimal totalScore) { this.totalScore = totalScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public List<ScoreDto> getScores() { return scores; }
    public void setScores(List<ScoreDto> scores) { this.scores = scores; }
}
