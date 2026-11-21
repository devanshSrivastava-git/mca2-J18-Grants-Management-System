package gov.in.grants.dto;

import java.math.BigDecimal;
import java.util.List;

public class ApplicationSubmissionRequest {
    private Long programId;
    private Long orgId;
    private String projectTitle;
    private String executiveSummary;
    private BigDecimal requestedAmountInr;
    private Integer projectDurationMonths;
    private List<DocumentDto> documents;

    public static class DocumentDto {
        private String documentType;
        private String fileName;
        private Long fileSizeBytes;

        public DocumentDto() {}

        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public Long getFileSizeBytes() { return fileSizeBytes; }
        public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }
    }

    public ApplicationSubmissionRequest() {}

    public Long getProgramId() { return programId; }
    public void setProgramId(Long programId) { this.programId = programId; }

    public Long getOrgId() { return orgId; }
    public void setOrgId(Long orgId) { this.orgId = orgId; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public BigDecimal getRequestedAmountInr() { return requestedAmountInr; }
    public void setRequestedAmountInr(BigDecimal requestedAmountInr) { this.requestedAmountInr = requestedAmountInr; }

    public Integer getProjectDurationMonths() { return projectDurationMonths; }
    public void setProjectDurationMonths(Integer projectDurationMonths) { this.projectDurationMonths = projectDurationMonths; }

    public List<DocumentDto> getDocuments() { return documents; }
    public void setDocuments(List<DocumentDto> documents) { this.documents = documents; }
}
