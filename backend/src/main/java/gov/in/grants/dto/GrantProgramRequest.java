package gov.in.grants.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class GrantProgramRequest {
    private String programCode;
    private String programName;
    private String category;
    private String description;
    private BigDecimal totalBudgetInr;
    private BigDecimal minAwardInr;
    private BigDecimal maxAwardInr;
    private LocalDate opensAt;
    private LocalDate closesAt;
    private String status; // DRAFT or PUBLISHED
    private List<CriterionDto> criteria;

    public static class CriterionDto {
        private String criterionType;
        private String criterionName;
        private String criterionValue;
        private Integer isMandatory;

        public CriterionDto() {}

        public String getCriterionType() { return criterionType; }
        public void setCriterionType(String criterionType) { this.criterionType = criterionType; }

        public String getCriterionName() { return criterionName; }
        public void setCriterionName(String criterionName) { this.criterionName = criterionName; }

        public String getCriterionValue() { return criterionValue; }
        public void setCriterionValue(String criterionValue) { this.criterionValue = criterionValue; }

        public Integer getIsMandatory() { return isMandatory; }
        public void setIsMandatory(Integer isMandatory) { this.isMandatory = isMandatory; }
    }

    public GrantProgramRequest() {}

    public String getProgramCode() { return programCode; }
    public void setProgramCode(String programCode) { this.programCode = programCode; }

    public String getProgramName() { return programName; }
    public void setProgramName(String programName) { this.programName = programName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getTotalBudgetInr() { return totalBudgetInr; }
    public void setTotalBudgetInr(BigDecimal totalBudgetInr) { this.totalBudgetInr = totalBudgetInr; }

    public BigDecimal getMinAwardInr() { return minAwardInr; }
    public void setMinAwardInr(BigDecimal minAwardInr) { this.minAwardInr = minAwardInr; }

    public BigDecimal getMaxAwardInr() { return maxAwardInr; }
    public void setMaxAwardInr(BigDecimal maxAwardInr) { this.maxAwardInr = maxAwardInr; }

    public LocalDate getOpensAt() { return opensAt; }
    public void setOpensAt(LocalDate opensAt) { this.opensAt = opensAt; }

    public LocalDate getClosesAt() { return closesAt; }
    public void setClosesAt(LocalDate closesAt) { this.closesAt = closesAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<CriterionDto> getCriteria() { return criteria; }
    public void setCriteria(List<CriterionDto> criteria) { this.criteria = criteria; }
}
