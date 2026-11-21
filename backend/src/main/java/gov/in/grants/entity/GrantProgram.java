package gov.in.grants.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "GRANT_PROGRAMS")
public class GrantProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long programId;

    @Column(name = "program_code", nullable = false, unique = true, length = 50)
    private String programCode;

    @Column(name = "program_name", nullable = false, length = 200)
    private String programName;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "description", nullable = false, length = 2000)
    private String description;

    @Column(name = "total_budget_inr", nullable = false)
    private BigDecimal totalBudgetInr;

    @Column(name = "allocated_budget_inr", nullable = false)
    private BigDecimal allocatedBudgetInr = BigDecimal.ZERO;

    @Column(name = "disbursed_budget_inr", nullable = false)
    private BigDecimal disbursedBudgetInr = BigDecimal.ZERO;

    @Column(name = "min_award_inr", nullable = false)
    private BigDecimal minAwardInr;

    @Column(name = "max_award_inr", nullable = false)
    private BigDecimal maxAwardInr;

    @Column(name = "opens_at", nullable = false)
    private LocalDate opensAt;

    @Column(name = "closes_at", nullable = false)
    private LocalDate closesAt;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "DRAFT"; // DRAFT, PUBLISHED, CLOSED, ARCHIVED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProgramEligibilityCriterion> criteria = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public GrantProgram() {}

    public Long getProgramId() { return programId; }
    public void setProgramId(Long programId) { this.programId = programId; }

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

    public BigDecimal getAllocatedBudgetInr() { return allocatedBudgetInr; }
    public void setAllocatedBudgetInr(BigDecimal allocatedBudgetInr) { this.allocatedBudgetInr = allocatedBudgetInr; }

    public BigDecimal getDisbursedBudgetInr() { return disbursedBudgetInr; }
    public void setDisbursedBudgetInr(BigDecimal disbursedBudgetInr) { this.disbursedBudgetInr = disbursedBudgetInr; }

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

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public List<ProgramEligibilityCriterion> getCriteria() { return criteria; }
    public void setCriteria(List<ProgramEligibilityCriterion> criteria) { this.criteria = criteria; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
