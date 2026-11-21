package gov.in.grants.dto;

import java.math.BigDecimal;

public class ApprovalDecisionRequest {
    private String decision; // APPROVED or REJECTED
    private BigDecimal approvedAmountInr;
    private String remarks;

    public ApprovalDecisionRequest() {}

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

    public BigDecimal getApprovedAmountInr() { return approvedAmountInr; }
    public void setApprovedAmountInr(BigDecimal approvedAmountInr) { this.approvedAmountInr = approvedAmountInr; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
