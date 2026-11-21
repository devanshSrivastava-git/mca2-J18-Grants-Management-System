package gov.in.grants.controller;

import gov.in.grants.dto.EligibilityCheckRequest;
import gov.in.grants.dto.EligibilityCheckResponse;
import gov.in.grants.service.EligibilityEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityEngine eligibilityEngine;

    public EligibilityController(EligibilityEngine eligibilityEngine) {
        this.eligibilityEngine = eligibilityEngine;
    }

    @PostMapping("/check")
    public ResponseEntity<EligibilityCheckResponse> checkEligibility(@RequestBody EligibilityCheckRequest request) {
        EligibilityCheckResponse response = eligibilityEngine.evaluate(request);
        return ResponseEntity.ok(response);
    }
}
