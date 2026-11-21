package gov.in.grants.dto;

import java.math.BigDecimal;
import java.util.List;

public class EligibilityCheckRequest {
    private Long programId;
    private Long orgId;
    private BigDecimal requestedAmountInr;
    private String orgType;
    private Integer establishedYear;
    private BigDecimal annualTurnoverInr;
    private boolean hasRegistrationDoc;
    private boolean hasDarpanId;
    private boolean hasAuditedFinancials;

    public EligibilityCheckRequest() {}

    public Long getProgramId() { return programId; }
    public void setProgramId(Long programId) { this.programId = programId; }

    public Long getOrgId() { return orgId; }
    public void setOrgId(Long orgId) { this.orgId = orgId; }

    public BigDecimal getRequestedAmountInr() { return requestedAmountInr; }
    public void setRequestedAmountInr(BigDecimal requestedAmountInr) { this.requestedAmountInr = requestedAmountInr; }

    public String getOrgType() { return orgType; }
    public void setOrgType(String orgType) { this.orgType = orgType; }

    public Integer getEstablishedYear() { return establishedYear; }
    public void setEstablishedYear(Integer establishedYear) { this.establishedYear = establishedYear; }

    public BigDecimal getAnnualTurnoverInr() { return annualTurnoverInr; }
    public void setAnnualTurnoverInr(BigDecimal annualTurnoverInr) { this.annualTurnoverInr = annualTurnoverInr; }

    public boolean isHasRegistrationDoc() { return hasRegistrationDoc; }
    public void setHasRegistrationDoc(boolean hasRegistrationDoc) { this.hasRegistrationDoc = hasRegistrationDoc; }

    public boolean isHasDarpanId() { return hasDarpanId; }
    public void setHasDarpanId(boolean hasDarpanId) { this.hasDarpanId = hasDarpanId; }

    public boolean isHasAuditedFinancials() { return hasAuditedFinancials; }
    public void setHasAuditedFinancials(boolean hasAuditedFinancials) { this.hasAuditedFinancials = hasAuditedFinancials; }
}
