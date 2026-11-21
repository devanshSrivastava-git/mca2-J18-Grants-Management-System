package gov.in.grants.service;

import gov.in.grants.dto.GrantProgramRequest;
import gov.in.grants.entity.GrantProgram;
import gov.in.grants.entity.ProgramEligibilityCriterion;
import gov.in.grants.entity.User;
import gov.in.grants.repository.GrantProgramRepository;
import gov.in.grants.repository.ProgramEligibilityCriterionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GrantProgramService {

    private final GrantProgramRepository grantProgramRepository;
    private final ProgramEligibilityCriterionRepository criterionRepository;

    public GrantProgramService(GrantProgramRepository grantProgramRepository, ProgramEligibilityCriterionRepository criterionRepository) {
        this.grantProgramRepository = grantProgramRepository;
        this.criterionRepository = criterionRepository;
    }

    public List<GrantProgram> getAllPrograms(String status) {
        if (status != null && !status.trim().isEmpty()) {
            return grantProgramRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }
        return grantProgramRepository.findAllByOrderByCreatedAtDesc();
    }

    public GrantProgram getProgramById(Long programId) {
        return grantProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Grant Program not found with ID: " + programId));
    }

    @Transactional
    public GrantProgram createProgram(GrantProgramRequest request, User currentUser) {
        GrantProgram program = new GrantProgram();
        String code = request.getProgramCode();
        if (code == null || code.trim().isEmpty()) {
            code = "GMS-" + LocalDate.now().getYear() + "-PRG-" + (System.currentTimeMillis() % 10000);
        }
        program.setProgramCode(code);
        program.setProgramName(request.getProgramName());
        program.setCategory(request.getCategory() != null ? request.getCategory() : "General Development");
        program.setDescription(request.getDescription());
        program.setTotalBudgetInr(request.getTotalBudgetInr());
        program.setMinAwardInr(request.getMinAwardInr());
        program.setMaxAwardInr(request.getMaxAwardInr());
        program.setOpensAt(request.getOpensAt() != null ? request.getOpensAt() : LocalDate.now());
        program.setClosesAt(request.getClosesAt() != null ? request.getClosesAt() : LocalDate.now().plusMonths(3));
        program.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "DRAFT");
        program.setCreatedBy(currentUser);
        program.setCreatedAt(LocalDateTime.now());
        program.setUpdatedAt(LocalDateTime.now());

        GrantProgram savedProgram = grantProgramRepository.save(program);

        if (request.getCriteria() != null && !request.getCriteria().isEmpty()) {
            for (GrantProgramRequest.CriterionDto dto : request.getCriteria()) {
                ProgramEligibilityCriterion crit = new ProgramEligibilityCriterion();
                crit.setProgram(savedProgram);
                crit.setCriterionType(dto.getCriterionType());
                crit.setCriterionName(dto.getCriterionName());
                crit.setCriterionValue(dto.getCriterionValue());
                crit.setIsMandatory(dto.getIsMandatory() != null ? dto.getIsMandatory() : 1);
                criterionRepository.save(crit);
            }
        }

        return grantProgramRepository.findById(savedProgram.getProgramId()).orElse(savedProgram);
    }

    @Transactional
    public GrantProgram updateStatus(Long programId, String newStatus) {
        GrantProgram program = getProgramById(programId);
        program.setStatus(newStatus.toUpperCase());
        program.setUpdatedAt(LocalDateTime.now());
        return grantProgramRepository.save(program);
    }
}
