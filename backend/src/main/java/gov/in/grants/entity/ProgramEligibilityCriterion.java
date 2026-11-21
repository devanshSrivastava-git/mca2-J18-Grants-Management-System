package gov.in.grants.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "PROGRAM_ELIGIBILITY_CRITERIA")
public class ProgramEligibilityCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "criteria_id")
    private Long criteriaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    @JsonIgnore
    private GrantProgram program;

    @Column(name = "criterion_type", nullable = false, length = 50)
    private String criterionType; // ORG_TYPE, MIN_EXPERIENCE_YEARS, MAX_TURNOVER_INR, REQUIRED_DOC

    @Column(name = "criterion_name", nullable = false, length = 200)
    private String criterionName;

    @Column(name = "criterion_value", nullable = false, length = 255)
    private String criterionValue;

    @Column(name = "is_mandatory", nullable = false)
    private Integer isMandatory = 1;

    public ProgramEligibilityCriterion() {}

    public ProgramEligibilityCriterion(GrantProgram program, String criterionType, String criterionName, String criterionValue, Integer isMandatory) {
        this.program = program;
        this.criterionType = criterionType;
        this.criterionName = criterionName;
        this.criterionValue = criterionValue;
        this.isMandatory = isMandatory;
    }

    public Long getCriteriaId() { return criteriaId; }
    public void setCriteriaId(Long criteriaId) { this.criteriaId = criteriaId; }

    public GrantProgram getProgram() { return program; }
    public void setProgram(GrantProgram program) { this.program = program; }

    public String getCriterionType() { return criterionType; }
    public void setCriterionType(String criterionType) { this.criterionType = criterionType; }

    public String getCriterionName() { return criterionName; }
    public void setCriterionName(String criterionName) { this.criterionName = criterionName; }

    public String getCriterionValue() { return criterionValue; }
    public void setCriterionValue(String criterionValue) { this.criterionValue = criterionValue; }

    public Integer getIsMandatory() { return isMandatory; }
    public void setIsMandatory(Integer isMandatory) { this.isMandatory = isMandatory; }
}
