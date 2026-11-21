package gov.in.grants.dto;

import java.util.ArrayList;
import java.util.List;

public class EligibilityCheckResponse {
    private boolean eligible;
    private String status; // ELIGIBLE or INELIGIBLE
    private String summary;
    private List<CriterionResult> details = new ArrayList<>();

    public static class CriterionResult {
        private String criterionName;
        private boolean passed;
        private String message;

        public CriterionResult() {}
        public CriterionResult(String criterionName, boolean passed, String message) {
            this.criterionName = criterionName;
            this.passed = passed;
            this.message = message;
        }

        public String getCriterionName() { return criterionName; }
        public void setCriterionName(String criterionName) { this.criterionName = criterionName; }

        public boolean isPassed() { return passed; }
        public void setPassed(boolean passed) { this.passed = passed; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public EligibilityCheckResponse() {}

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<CriterionResult> getDetails() { return details; }
    public void setDetails(List<CriterionResult> details) { this.details = details; }
}
