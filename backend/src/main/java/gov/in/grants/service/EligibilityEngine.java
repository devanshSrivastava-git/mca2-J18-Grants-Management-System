package gov.in.grants.service;

import gov.in.grants.dto.EligibilityCheckRequest;
import gov.in.grants.dto.EligibilityCheckResponse;
import gov.in.grants.entity.GrantProgram;
import gov.in.grants.entity.Organization;
import gov.in.grants.entity.ProgramEligibilityCriterion;
import gov.in.grants.repository.GrantProgramRepository;
import gov.in.grants.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Year;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityEngine {

    private final GrantProgramRepository grantProgramRepository;
    private final OrganizationRepository organizationRepository;

    public EligibilityEngine(GrantProgramRepository grantProgramRepository, OrganizationRepository organizationRepository) {
        this.grantProgramRepository = grantProgramRepository;
        this.organizationRepository = organizationRepository;
    }

    public EligibilityCheckResponse evaluate(EligibilityCheckRequest request) {
        GrantProgram program = grantProgramRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Grant program not found: " + request.getProgramId()));

        Organization org = null;
        if (request.getOrgId() != null) {
            org = organizationRepository.findById(request.getOrgId()).orElse(null);
        }

        String orgType = request.getOrgType() != null ? request.getOrgType() : (org != null ? org.getOrgType() : "NGO");
        int estYear = request.getEstablishedYear() != null ? request.getEstablishedYear() : (org != null ? org.getEstablishedYear() : 2020);
        BigDecimal turnover = request.getAnnualTurnoverInr() != null ? request.getAnnualTurnoverInr() : (org != null ? org.getAnnualTurnoverInr() : BigDecimal.ZERO);
        BigDecimal reqAmt = request.getRequestedAmountInr() != null ? request.getRequestedAmountInr() : program.getMinAwardInr();

        List<EligibilityCheckResponse.CriterionResult> results = new ArrayList<>();
        boolean overallEligible = true;

        // 1. Award Range check
        if (reqAmt.compareTo(program.getMinAwardInr()) < 0 || reqAmt.compareTo(program.getMaxAwardInr()) > 0) {
            overallEligible = false;
            results.add(new EligibilityCheckResponse.CriterionResult(
                    "Requested Award Range",
                    false,
                    String.format("Requested INR %s is outside permissible range (INR %s - INR %s)",
                            reqAmt, program.getMinAwardInr(), program.getMaxAwardInr())
            ));
        } else {
            results.add(new EligibilityCheckResponse.CriterionResult(
                    "Requested Award Range",
                    true,
                    String.format("Requested INR %s is within award range", reqAmt)
            ));
        }

        // 2. Program Criteria validation
        List<ProgramEligibilityCriterion> criteria = program.getCriteria();
        int currentYear = Year.now().getValue();
        int experienceYears = currentYear - estYear;

        for (ProgramEligibilityCriterion crit : criteria) {
            String type = crit.getCriterionType();
            String val = crit.getCriterionValue();

            if ("ORG_TYPE".equalsIgnoreCase(type)) {
                List<String> allowedTypes = Arrays.stream(val.split(","))
                        .map(String::trim)
                        .map(String::toUpperCase)
                        .toList();

                if (!allowedTypes.contains(orgType.toUpperCase())) {
                    if (crit.getIsMandatory() == 1) overallEligible = false;
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            false,
                            String.format("Organization type %s is not in eligible list: %s", orgType, val)
                    ));
                } else {
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            true,
                            String.format("Organization type %s matches eligible categories", orgType)
                    ));
                }
            } else if ("MIN_EXPERIENCE_YEARS".equalsIgnoreCase(type)) {
                int minYears = Integer.parseInt(val.trim());
                if (experienceYears < minYears) {
                    if (crit.getIsMandatory() == 1) overallEligible = false;
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            false,
                            String.format("Operating experience (%d yrs) is below mandatory minimum of %d yrs", experienceYears, minYears)
                    ));
                } else {
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            true,
                            String.format("Organization has %d years of operational standing (meets >= %d yrs)", experienceYears, minYears)
                    ));
                }
            } else if ("MAX_TURNOVER_INR".equalsIgnoreCase(type)) {
                BigDecimal maxTurnover = new BigDecimal(val.trim());
                if (turnover.compareTo(maxTurnover) > 0) {
                    if (crit.getIsMandatory() == 1) overallEligible = false;
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            false,
                            String.format("Annual turnover INR %s exceeds scheme ceiling of INR %s", turnover, maxTurnover)
                    ));
                } else {
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            true,
                            String.format("Turnover INR %s is compliant with ceiling", turnover)
                    ));
                }
            } else if ("REQUIRED_DOC".equalsIgnoreCase(type)) {
                boolean hasDoc = request.isHasRegistrationDoc() || (org != null && org.getRegistrationNumber() != null);
                if (!hasDoc) {
                    if (crit.getIsMandatory() == 1) overallEligible = false;
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            false,
                            "Mandatory statutory certificates or documents not provided"
                    ));
                } else {
                    results.add(new EligibilityCheckResponse.CriterionResult(
                            crit.getCriterionName(),
                            true,
                            "Statutory registrations and required documents verified"
                    ));
                }
            }
        }

        EligibilityCheckResponse response = new EligibilityCheckResponse();
        response.setEligible(overallEligible);
        response.setStatus(overallEligible ? "ELIGIBLE" : "INELIGIBLE");
        response.setSummary(overallEligible ?
                "All mandatory scheme eligibility criteria have been satisfied. Applicant is eligible to submit." :
                "One or more mandatory eligibility requirements were not met. Review details below.");
        response.setDetails(results);
        return response;
    }
}
