package gov.in.grants.config;

import gov.in.grants.entity.*;
import gov.in.grants.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final GrantProgramRepository grantProgramRepository;
    private final ProgramEligibilityCriterionRepository criterionRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository documentRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewScoreRepository reviewScoreRepository;
    private final DisbursementRepository disbursementRepository;
    private final ProgressReportRepository progressReportRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            GrantProgramRepository grantProgramRepository,
            ProgramEligibilityCriterionRepository criterionRepository,
            ApplicationRepository applicationRepository,
            ApplicationDocumentRepository documentRepository,
            ReviewRepository reviewRepository,
            ReviewScoreRepository reviewScoreRepository,
            DisbursementRepository disbursementRepository,
            ProgressReportRepository progressReportRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.grantProgramRepository = grantProgramRepository;
        this.criterionRepository = criterionRepository;
        this.applicationRepository = applicationRepository;
        this.documentRepository = documentRepository;
        this.reviewRepository = reviewRepository;
        this.reviewScoreRepository = reviewScoreRepository;
        this.disbursementRepository = disbursementRepository;
        this.progressReportRepository = progressReportRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            return; // Data already exists
        }

        System.out.println(">>> Initializing Grants Management System Data (Indian Public Sector)...");

        // 1. ROLES
        Role roleAdmin = roleRepository.save(new Role("ROLE_ADMIN", "System Administrator", "Full system governance and administration"));
        Role rolePM = roleRepository.save(new Role("ROLE_PROGRAM_MANAGER", "Grant Program Manager", "Designs programs, sets eligibility criteria, oversees reviews"));
        Role roleRev = roleRepository.save(new Role("ROLE_REVIEWER", "Technical Reviewer", "Assigned proposal scoring and technical recommendations"));
        Role roleApp = roleRepository.save(new Role("ROLE_APPLICANT", "Grant Applicant", "Submits project applications and progress milestone reports"));
        Role roleFin = roleRepository.save(new Role("ROLE_FINANCE_OFFICER", "Public Finance Officer", "Manages fund disbursements and bank UTR tracking"));

        // 2. ORGANIZATIONS
        List<Organization> orgs = new ArrayList<>();
        orgs.add(createOrg("Aarogya Health Development Society", "NGO", "NGO-DL-2015-8821", "AAATA1122A", "07AAATA1122A1Z5", "DL/2016/0102938", "42 Institutional Area", "Sector 4, RK Puram", "New Delhi", "Delhi", "110022", "State Bank of India", "10982347101", "SBIN0001234", new BigDecimal("45000000"), 2015));
        orgs.add(createOrg("Krishi Vikas Grameen Sansthan", "NGO", "NGO-MH-2012-3341", "AAATK3344B", "27AAATK3344B1Z2", "MH/2014/0074612", "15 Kisan Bhavan", "Shivaji Road", "Pune", "Maharashtra", "411005", "Bank of Baroda", "20491823902", "BARB0SHIVAJ", new BigDecimal("32000000"), 2012));
        orgs.add(createOrg("Vidyasagar Research & Tech Foundation", "ACADEMIC_INSTITUTION", "ACA-KA-2008-0091", "AAATV5566C", "29AAATV5566C1Z8", "KA/2010/0038192", "12 Science College Road", "Malleshwaram", "Bengaluru", "Karnataka", "560003", "Canara Bank", "04821039481", "CNRB0000482", new BigDecimal("120000000"), 2008));
        orgs.add(createOrg("Urja Green CleanTech Innovations", "STARTUP", "STU-TS-2021-9923", "AAATU7788D", "36AAATU7788D1Z4", "TS/2022/0192837", "T-Hub 2.0, Raidurg", "Knowledge City", "Hyderabad", "Telangana", "500081", "HDFC Bank", "50100492817263", "HDFC0000123", new BigDecimal("18000000"), 2021));
        orgs.add(createOrg("Jal Samrakshan Trust", "NGO", "NGO-RJ-2017-4412", "AAATJ9900E", "08AAATJ9900E1Z9", "RJ/2018/0081293", "8 Jal Marg", "C-Scheme", "Jaipur", "Rajasthan", "302001", "Punjab National Bank", "18290021003948", "PUNB0182900", new BigDecimal("25000000"), 2017));
        orgs.add(createOrg("National Institute of BioSciences", "RESEARCH_LAB", "RES-TN-2005-1102", "AAATN2233F", "33AAATN2233F1Z1", "TN/2007/0019283", "88 Biotechnology Corridor", "Taramani", "Chennai", "Tamil Nadu", "600113", "Indian Bank", "60192837461", "IDIB000T012", new BigDecimal("280000000"), 2005));
        orgs.add(createOrg("Samriddhi Rural Empowerment Society", "NGO", "NGO-UP-2016-7781", "AAATS4455G", "09AAATS4455G1Z7", "UP/2017/0119284", "24 Vikas Nagar", "Alambagh", "Lucknow", "Uttar Pradesh", "226005", "State Bank of India", "38192039481", "SBIN0005521", new BigDecimal("15000000"), 2016));
        orgs.add(createOrg("Prakriti Himalayan Conservation Centre", "NGO", "NGO-UK-2014-6621", "AAATP6677H", "05AAATP6677H1Z3", "UA/2015/0049281", "14 Mall Avenue", "Near Clock Tower", "Dehradun", "Uttarakhand", "248001", "Union Bank of India", "49182736451", "UBIN0549182", new BigDecimal("21000000"), 2014));
        orgs.add(createOrg("Sankalp Shiksha Foundation", "NGO", "NGO-WB-2013-2289", "AAATS8899I", "19AAATS8899I1Z0", "WB/2014/0061928", "102 Salt Lake Sector V", "Bidhannagar", "Kolkata", "West Bengal", "700091", "Axis Bank", "918029384756", "UTIB0000293", new BigDecimal("38000000"), 2013));
        orgs.add(createOrg("Navodaya Community Welfare Council", "NGO", "NGO-GJ-2018-9901", "AAATN1133J", "24AAATN1133J1Z6", "GJ/2019/0129384", "45 Ashram Road", "Navrangpura", "Ahmedabad", "Gujarat", "380009", "ICICI Bank", "002401928374", "ICIC0000024", new BigDecimal("42000000"), 2018));
        orgs.add(createOrg("Malabar Coastal Development Agency", "GOVERNMENT_BODY", "GOV-KL-2002-0012", "AAATM3355K", "32AAATM3355K1Z2", "KL/2004/0001298", "Govt Marine Complex", "Willingdon Island", "Kochi", "Kerala", "682003", "State Bank of India", "58192039481", "SBIN0000845", new BigDecimal("195000000"), 2002));
        orgs.add(createOrg("Deshbandhu Technical Solutions Pvt Ltd", "PRIVATE_ENTERPRISE", "PVT-MP-2020-5512", "AAATD5577L", "23AAATD5577L1Z8", "MP/2021/0091827", "17 MP Nagar Zone II", "City Center", "Bhopal", "Madhya Pradesh", "462011", "Kotak Bank", "2918273645", "KKBK0000512", new BigDecimal("55000000"), 2020));
        // Edge Case 2: Empty optional fields
        orgs.add(createOrg("Gramin Vikas Sahayata Sangam", "NGO", "NGO-BR-2019-1002", "AAATG7799M", null, null, "Main Market Road", null, "Patna", "Bihar", "800001", "Central Bank of India", "3829102938", "CBIN0281928", new BigDecimal("8500000"), 2019));
        // Edge Case 3: Duplicate-looking names in same city
        orgs.add(createOrg("Seva Rural Foundation", "NGO", "NGO-GJ-2011-8841", "AAATS9911N", "24AAATS9911N1Z5", "GJ/2012/0048192", "32 Station Road", "Town Hall", "Surat", "Gujarat", "395003", "Bank of India", "19283746501", "BKID0001928", new BigDecimal("29000000"), 2011));
        orgs.add(createOrg("Seva Rural Foundation Trust", "NGO", "NGO-GJ-2016-1192", "AAATS9922O", "24AAATS9922O1Z1", "GJ/2017/0091823", "78 Ring Road", "Majura Gate", "Surat", "Gujarat", "395002", "HDFC Bank", "50100293847581", "HDFC0000293", new BigDecimal("22000000"), 2016));
        orgs = organizationRepository.saveAll(orgs);

        // 3. USERS
        String defaultPwHash = passwordEncoder.encode("password123");
        User adminUser = createUser("admin", "admin@grants.gov.in", defaultPwHash, "Dr. Rajeshwar Sharma", "+91-9811001122", "Chief Grant Director", null, Set.of(roleAdmin, rolePM));
        User pmRajesh = createUser("pm_rajesh", "rajesh.sharma@grants.gov.in", defaultPwHash, "Rajesh Sharma", "+91-9822112233", "Senior Program Manager", null, Set.of(rolePM));
        User pmSunita = createUser("pm_sunita", "sunita.deshmukh@grants.gov.in", defaultPwHash, "Dr. Sunita Deshmukh", "+91-9833223344", "Program Manager - Clean Energy", null, Set.of(rolePM));
        User revAnanya = createUser("rev_ananya", "ananya.sengupta@iitd.ac.in", defaultPwHash, "Prof. Ananya Sengupta", "+91-9844334455", "Lead Evaluator & Professor", null, Set.of(roleRev));
        User revSuresh = createUser("rev_suresh", "suresh.menon@iisconline.org", defaultPwHash, "Dr. Suresh Menon", "+91-9855445566", "Senior Scientific Advisor", null, Set.of(roleRev));
        User revDeepa = createUser("rev_deepa", "deepa.raman@tiss.edu", defaultPwHash, "Dr. Deepa Raman", "+91-9866556677", "Social Impact Assessor", null, Set.of(roleRev));
        User finNeha = createUser("fin_neha", "neha.verma@finance.gov.in", defaultPwHash, "Neha Verma", "+91-9877667788", "Joint Controller of Accounts", null, Set.of(roleFin));
        User finArun = createUser("fin_arun", "arun.pillai@finance.gov.in", defaultPwHash, "Arun Pillai", "+91-9888778899", "Public Fund Disbursement Officer", null, Set.of(roleFin));
        User appVikram = createUser("app_vikram", "vikram.seth@aarogyahealth.org", defaultPwHash, "Vikram Seth", "+91-9899889900", "Executive Director", orgs.get(0), Set.of(roleApp));
        User appPriya = createUser("app_priya", "priya.patel@krishivikas.org", defaultPwHash, "Priya Patel", "+91-9810101010", "Project Coordinator", orgs.get(1), Set.of(roleApp));
        User appAmitabha = createUser("app_amitabha", "amitabha.bose@vidyasagar.edu.in", defaultPwHash, "Prof. Amitabha Bose", "+91-9820202020", "Principal Investigator", orgs.get(2), Set.of(roleApp));
        User appKavita = createUser("app_kavita", "kavita.reddy@urjaclean.com", defaultPwHash, "Kavita Reddy", "+91-9830303030", "CTO & Co-Founder", orgs.get(3), Set.of(roleApp));
        User appHarpreet = createUser("app_harpreet", "harpreet.singh@jalsamrakshan.org", defaultPwHash, "Harpreet Singh", "+91-9840404040", "Managing Trustee", orgs.get(4), Set.of(roleApp));
        User appManoj = createUser("app_manoj", "manoj.tiwari@samriddhi.org", defaultPwHash, "Manoj Tiwari", "+91-9850505050", "Secretary", orgs.get(6), Set.of(roleApp));
        User appFatima = createUser("app_fatima", "fatima.begum@sevarural.org", defaultPwHash, "Fatima Begum", "+91-9860606060", "Program Head", orgs.get(13), Set.of(roleApp));

        List<User> reviewers = List.of(revAnanya, revSuresh, revDeepa);
        List<User> applicants = List.of(appVikram, appPriya, appAmitabha, appKavita, appHarpreet, appManoj, appFatima);

        // 4. GRANT_PROGRAMS
        List<GrantProgram> progs = new ArrayList<>();
        // Program 1 (Exact wireframe: Community Impact 2026)
        GrantProgram p1 = createProgram("GMS-2026-CIP-001", "Community Impact 2026", "Healthcare & Sanitation",
                "Empowering community-driven healthcare initiatives, primary wellness centers, and decentralized sanitation across underserved tier-2 and rural districts in India.",
                new BigDecimal("50000000"), new BigDecimal("28500000"), new BigDecimal("14200000"),
                new BigDecimal("1000000"), new BigDecimal("5000000"),
                LocalDate.of(2026, 4, 1), LocalDate.of(2026, 6, 30), "PUBLISHED", pmRajesh);
        progs.add(p1);

        progs.add(createProgram("GMS-2025-AGR-002", "National AgriTech Innovation Fund", "AgriTech & Rural",
                "Support for smart IoT-based irrigation, solar cold storages, drone crop assessment, and decentralized post-harvest processing for smallholder farmer groups.",
                new BigDecimal("80000000"), new BigDecimal("52000000"), new BigDecimal("34000000"),
                new BigDecimal("2000000"), new BigDecimal("8000000"),
                LocalDate.of(2025, 1, 15), LocalDate.of(2025, 5, 31), "PUBLISHED", pmRajesh));

        progs.add(createProgram("GMS-2025-CLN-003", "Clean Energy & Decarbonization Accelerator", "Clean Energy & Climate",
                "Grants to deploy pilot renewable mini-grids, industrial energy efficiency prototypes, biomass energy conversion, and rooftop solar micro-installations.",
                new BigDecimal("100000000"), new BigDecimal("65000000"), new BigDecimal("42000000"),
                new BigDecimal("3000000"), new BigDecimal("10000000"),
                LocalDate.of(2025, 2, 1), LocalDate.of(2025, 7, 31), "PUBLISHED", pmSunita));

        progs.add(createProgram("GMS-2026-EDU-004", "STEM Rural School Laboratory Scheme", "STEM Education",
                "Setting up experiential science, robotics, and digital computer learning labs in government and aided secondary schools across aspirational districts.",
                new BigDecimal("40000000"), new BigDecimal("18000000"), new BigDecimal("9000000"),
                new BigDecimal("1000000"), new BigDecimal("3500000"),
                LocalDate.of(2026, 3, 1), LocalDate.of(2026, 8, 31), "PUBLISHED", pmRajesh));

        progs.add(createProgram("GMS-2024-WAT-005", "Jal Samrakshan Watershed Mission 2024", "Water Conservation",
                "Community rain-water harvesting structures, rejuvenation of traditional step-wells and percolation ponds in arid and semi-arid talukas.",
                new BigDecimal("60000000"), new BigDecimal("60000000"), new BigDecimal("58000000"),
                new BigDecimal("2000000"), new BigDecimal("6000000"),
                LocalDate.of(2024, 3, 1), LocalDate.of(2024, 9, 30), "CLOSED", pmRajesh));

        progs.add(createProgram("GMS-2026-BIO-006", "Indigenous BioTech & Vaccine Research", "Healthcare & Sanitation",
                "Translational biotechnology grants for academic institutions and research labs working on affordable diagnostic point-of-care devices.",
                new BigDecimal("120000000"), new BigDecimal("45000000"), new BigDecimal("20000000"),
                new BigDecimal("5000000"), new BigDecimal("20000000"),
                LocalDate.of(2026, 1, 10), LocalDate.of(2026, 6, 15), "PUBLISHED", pmSunita));

        progs.add(createProgram("GMS-2026-GOV-007", "Digital Governance & Citizen Service Innovation", "Digital Governance",
                "Open-source software, multilingual AI bots, and vernacular digital interfaces to streamline public service delivery at block and panchayat levels.",
                new BigDecimal("45000000"), new BigDecimal("15000000"), new BigDecimal("5000000"),
                new BigDecimal("1500000"), new BigDecimal("5000000"),
                LocalDate.of(2026, 2, 15), LocalDate.of(2026, 7, 15), "PUBLISHED", pmRajesh));

        progs.add(createProgram("GMS-2026-WAS-008", "Urban Solid Waste & Circular Economy Grant", "Environment",
                "Segregation-at-source mechanisms, material recovery facilities, and wet-waste biomethanation plants operated by cooperative societies.",
                new BigDecimal("50000000"), BigDecimal.ZERO, BigDecimal.ZERO,
                new BigDecimal("2000000"), new BigDecimal("7500000"),
                LocalDate.of(2026, 5, 1), LocalDate.of(2026, 10, 31), "DRAFT", pmSunita));

        progs.add(createProgram("GMS-2026-WOM-009", "Women Enterprise & Micro-Livelihood Scheme", "Livelihood",
                "Capacity building, revolving corpus, and machinery grants for women self-help groups engaged in food processing and handicrafts.",
                new BigDecimal("70000000"), new BigDecimal("35000000"), new BigDecimal("21000000"),
                new BigDecimal("1000000"), new BigDecimal("4000000"),
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 6, 30), "PUBLISHED", pmRajesh));

        progs.add(createProgram("GMS-2024-TRI-010", "Tribal Area Forest Produce Value Addition", "AgriTech & Rural",
                "Support for collection, primary processing, testing and branding of minor forest produce in scheduled areas.",
                new BigDecimal("35000000"), new BigDecimal("35000000"), new BigDecimal("35000000"),
                new BigDecimal("1000000"), new BigDecimal("3500000"),
                LocalDate.of(2024, 4, 1), LocalDate.of(2024, 11, 30), "CLOSED", pmRajesh));

        // Edge Case 1: Max-length text
        progs.add(createProgram("GMS-2026-MAX-011",
                "National Inter-Disciplinary Mega-Consortium for Advanced Deep-Tech Infrastructure and High-Performance Resilience Systems across Urban and Rural Ecosystems Scheme of the Government of India Phase IV",
                "Deep Tech & Infrastructure",
                "This apex national strategic initiative represents a comprehensive, multi-tiered framework specifically architected to provide substantial non-dilutive financial assistance, capital equipment subventions, and technical enablement grants to collaborative consortia comprising accredited academic universities, premier state-funded scientific research laboratories, certified social impact nongovernmental entities, and registered high-technology early-stage commercial ventures.",
                new BigDecimal("250000000"), BigDecimal.ZERO, BigDecimal.ZERO,
                new BigDecimal("10000000"), new BigDecimal("50000000"),
                LocalDate.of(2026, 6, 1), LocalDate.of(2026, 12, 31), "DRAFT", adminUser));

        progs.add(createProgram("GMS-2023-ARC-012", "Heritage Crafts & Artisans Support Archive", "Livelihood",
                "Archived historical grant round for traditional handloom revival.",
                new BigDecimal("20000000"), new BigDecimal("20000000"), new BigDecimal("20000000"),
                new BigDecimal("500000"), new BigDecimal("2000000"),
                LocalDate.of(2023, 1, 1), LocalDate.of(2023, 8, 31), "ARCHIVED", pmRajesh));

        progs = grantProgramRepository.saveAll(progs);

        // 5. CRITERIA for programs
        List<ProgramEligibilityCriterion> criteriaList = new ArrayList<>();
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(0), "ORG_TYPE", "Eligible Organization Types", "NGO, ACADEMIC_INSTITUTION", 1));
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(0), "MIN_EXPERIENCE_YEARS", "Minimum Operational Experience", "3", 1));
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(0), "MAX_TURNOVER_INR", "Maximum Annual Turnover Allowed", "100000000", 0));
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(0), "REQUIRED_DOC", "NGO Darpan ID & Registration", "DARPAN_AND_SOCIETY_REG", 1));

        criteriaList.add(new ProgramEligibilityCriterion(progs.get(1), "ORG_TYPE", "Eligible Organization Types", "STARTUP, NGO, RESEARCH_LAB", 1));
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(1), "MIN_EXPERIENCE_YEARS", "Minimum Operational Experience", "2", 1));
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(1), "REQUIRED_DOC", "Audited Balance Sheets 2 Years", "AUDITED_FINANCIALS", 1));

        criteriaList.add(new ProgramEligibilityCriterion(progs.get(2), "ORG_TYPE", "Eligible Organization Types", "STARTUP, PRIVATE_ENTERPRISE, RESEARCH_LAB", 1));
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(2), "MIN_EXPERIENCE_YEARS", "Minimum Operational Experience", "2", 1));

        criteriaList.add(new ProgramEligibilityCriterion(progs.get(3), "ORG_TYPE", "Eligible Organization Types", "NGO, ACADEMIC_INSTITUTION", 1));
        criteriaList.add(new ProgramEligibilityCriterion(progs.get(3), "REQUIRED_DOC", "School MoUs or Consent Letters", "CONSENT_LETTERS", 1));
        criterionRepository.saveAll(criteriaList);

        // 6. APPLICATIONS (Generate 60 realistic records)
        List<String> projectTitles = List.of(
                "Mobile Primary Healthcare Clinics for Tribal Talukas",
                "Solar-Powered IoT Drip Irrigation and Soil Moisture Analytics",
                "Decentralized Biomass Gasifier Microgrid for Off-grid Villages",
                "STEM Tinkering Labs and Robotics Curriculum for 50 Rural Schools",
                "Community Rainwater Recharge Wells in Drought Prone Blocks",
                "Point-of-Care Microfluidic Diagnostic Kit for Dengue & Malaria",
                "Citizen Voice: Multilingual Speech-to-Text Grievance App",
                "Solar Cold Storage Micro-Hubs for Small Vegetable Growers",
                "Women Artisan Loom Digitization and E-Commerce Linkage",
                "Greywater Recycling and Bio-Remediation Wetland Pilot"
        );

        List<Application> apps = new ArrayList<>();
        for (int i = 1; i <= 60; i++) {
            GrantProgram prog = progs.get(i % 6);
            Organization org = orgs.get(i % orgs.size());
            User applicant = applicants.get(i % applicants.size());

            String status = i <= 25 ? "DISBURSED" : (i <= 40 ? "APPROVED" : (i <= 50 ? "UNDER_REVIEW" : (i <= 55 ? "SUBMITTED" : "REJECTED")));
            String elig = (status.equals("REJECTED") && i % 2 == 0) ? "INELIGIBLE" : "ELIGIBLE";

            BigDecimal reqAmt = prog.getMinAwardInr().add(BigDecimal.valueOf(((long) i * 350000) % 2500000));
            if (reqAmt.compareTo(prog.getMinAwardInr()) < 0) reqAmt = prog.getMinAwardInr();
            if (reqAmt.compareTo(prog.getMaxAwardInr()) > 0) reqAmt = prog.getMaxAwardInr();

            // Edge Case 4: Application with Minimum boundary request
            if (i == 1) reqAmt = prog.getMinAwardInr();
            // Edge Case 5: Application with Maximum boundary request
            if (i == 2) reqAmt = prog.getMaxAwardInr();

            BigDecimal appvAmt = (status.equals("APPROVED") || status.equals("DISBURSED")) ? reqAmt : null;

            Application app = new Application();
            app.setApplicationNumber("GMS-2026-APP-" + (1000 + i));
            app.setProgram(prog);
            app.setApplicantUser(applicant);
            app.setOrganization(org);
            app.setProjectTitle(projectTitles.get(i % projectTitles.size()) + " - Phase " + ((i / 10) + 1));
            app.setExecutiveSummary("Comprehensive sustainable development project delivering high verifiable socioeconomic and technical impact across target talukas and blocks.");
            app.setRequestedAmountInr(reqAmt);
            app.setApprovedAmountInr(appvAmt);
            app.setProjectDurationMonths(12 + ((i * 3) % 24));
            app.setEligibilityStatus(elig);
            app.setEligibilityRemarks(elig.equals("ELIGIBLE") ? "Meets mandatory eligibility requirements" : "Turnover exceeds maximum allowable limit");
            app.setApplicationStatus(status);
            app.setSubmissionDate(LocalDateTime.now().minusDays(120 - i));
            if (status.equals("APPROVED") || status.equals("DISBURSED")) {
                app.setApprovalDate(LocalDateTime.now().minusDays(60 - (i % 30)));
            }
            apps.add(app);
        }
        apps = applicationRepository.saveAll(apps);

        // 7. APPLICATION DOCUMENTS & REVIEWS & DISBURSEMENTS
        List<ApplicationDocument> docs = new ArrayList<>();
        List<Review> revs = new ArrayList<>();
        List<Disbursement> disbs = new ArrayList<>();
        List<ProgressReport> reps = new ArrayList<>();
        List<AuditLog> audits = new ArrayList<>();

        for (int i = 0; i < apps.size(); i++) {
            Application a = apps.get(i);

            // Document
            ApplicationDocument doc = new ApplicationDocument();
            doc.setApplication(a);
            doc.setDocumentType("DETAILED_PROJECT_REPORT");
            doc.setFileName(a.getApplicationNumber() + "_project_report.pdf");
            doc.setFileSizeBytes(1850000L + (i * 25000L));
            doc.setVerificationStatus("VERIFIED");
            docs.add(doc);

            // Review
            if (a.getApplicationStatus().equals("UNDER_REVIEW") || a.getApplicationStatus().equals("APPROVED") ||
                a.getApplicationStatus().equals("DISBURSED") || a.getApplicationStatus().equals("REJECTED")) {
                User revUser = reviewers.get(i % reviewers.size());
                Review rev = new Review();
                rev.setApplication(a);
                rev.setReviewerUser(revUser);
                rev.setAssignedDate(LocalDateTime.now().minusDays(90));
                rev.setCompletedDate(LocalDateTime.now().minusDays(70));
                double scoreVal = a.getApplicationStatus().equals("REJECTED") ? (45.0 + (i % 15)) : (75.0 + (i % 22));
                rev.setTotalScore(BigDecimal.valueOf(scoreVal));
                rev.setRecommendation(a.getApplicationStatus().equals("REJECTED") ? "NOT_RECOMMENDED" : "RECOMMENDED");
                rev.setComments("Proposal exhibits strong technical methodology, clear deliverables, and high public impact value.");
                rev.setReviewStatus("COMPLETED");

                // Sub-scores
                ReviewScore sc1 = new ReviewScore(rev, "Technical Feasibility", 30, BigDecimal.valueOf(Math.round(scoreVal * 0.3)), "Robust approach");
                ReviewScore sc2 = new ReviewScore(rev, "Social & Public Impact", 30, BigDecimal.valueOf(Math.round(scoreVal * 0.3)), "Direct community benefit");
                ReviewScore sc3 = new ReviewScore(rev, "Financial Justification", 20, BigDecimal.valueOf(Math.round(scoreVal * 0.2)), "Realistic line items");
                ReviewScore sc4 = new ReviewScore(rev, "Organizational Capacity", 20, BigDecimal.valueOf(Math.round(scoreVal * 0.2)), "Proven field pedigree");
                rev.setScores(List.of(sc1, sc2, sc3, sc4));
                revs.add(rev);
            }

            // Disbursements for approved/disbursed apps
            if (a.getApplicationStatus().equals("APPROVED") || a.getApplicationStatus().equals("DISBURSED")) {
                BigDecimal grantAmt = a.getApprovedAmountInr() != null ? a.getApprovedAmountInr() : a.getRequestedAmountInr();
                BigDecimal t1Amt = grantAmt.multiply(new BigDecimal("0.40"));
                BigDecimal t2Amt = grantAmt.multiply(new BigDecimal("0.40"));

                // Tranche 1
                Disbursement d1 = new Disbursement();
                d1.setApplication(a);
                d1.setTrancheNumber(1);
                d1.setAmountInr(t1Amt);
                d1.setMilestoneDescription("Advance Mobilization & Equipment Procurement");
                d1.setScheduledDate(LocalDate.now().minusDays(45));
                d1.setDisbursedDate(LocalDate.now().minusDays(40));
                d1.setPaymentStatus("DISBURSED");
                d1.setUtrNumber("SBIN2025" + (100000 + i));
                d1.setDisbursedByUser(finNeha);
                d1.setRemarks("Electronic transfer authorized via PFMS gateway");
                disbs.add(d1);

                // Tranche 2
                Disbursement d2 = new Disbursement();
                d2.setApplication(a);
                d2.setTrancheNumber(2);
                d2.setAmountInr(t2Amt);
                d2.setMilestoneDescription("Mid-term Deployment & District Field Validation");
                d2.setScheduledDate(LocalDate.now().plusDays(30));
                if (a.getApplicationStatus().equals("DISBURSED") && i % 2 == 0) {
                    d2.setDisbursedDate(LocalDate.now().minusDays(5));
                    d2.setPaymentStatus("DISBURSED");
                    d2.setUtrNumber("HDFC2026" + (200000 + i));
                    d2.setDisbursedByUser(finArun);
                    d2.setRemarks("Mid-term audit cleared and verified");
                } else {
                    d2.setPaymentStatus("PENDING");
                    d2.setRemarks("Awaiting mid-term milestone review");
                }
                disbs.add(d2);
            }

            // Progress report
            if (a.getApplicationStatus().equals("DISBURSED") && reps.size() < 50) {
                ProgressReport rep = new ProgressReport();
                rep.setApplication(a);
                rep.setReportTitle("Quarterly Project Progress Report Q" + ((i % 4) + 1));
                rep.setMilestoneAchieved("Procured core hardware, established community outreach centers, and completed baseline survey.");
                rep.setFundsUtilizedInr(a.getRequestedAmountInr().multiply(new BigDecimal("0.35")));
                rep.setSubmissionDate(LocalDate.now().minusDays(15));
                rep.setStatus("VERIFIED");
                rep.setRemarks("Inspected and verified by district nodal officers");
                reps.add(rep);
            }

            // Audit log
            if (audits.size() < 60) {
                audits.add(new AuditLog("APPLICATION", a.getApplicationId(), "STATUS_UPDATE", pmRajesh, "SUBMITTED", a.getApplicationStatus(), "Application processed in workflow stage"));
            }
        }

        documentRepository.saveAll(docs);
        reviewRepository.saveAll(revs);
        disbursementRepository.saveAll(disbs);
        progressReportRepository.saveAll(reps);
        auditLogRepository.saveAll(audits);

        System.out.println(">>> Grants Management System seed data initialized successfully! Total Applications: " + apps.size() + ", Programs: " + progs.size() + ", Disbursements: " + disbs.size());
    }

    private Organization createOrg(String name, String type, String reg, String pan, String gstin, String darpan,
                                  String a1, String a2, String city, String state, String pin,
                                  String bank, String acc, String ifsc, BigDecimal turnover, int est) {
        Organization o = new Organization();
        o.setOrgName(name);
        o.setOrgType(type);
        o.setRegistrationNumber(reg);
        o.setPanNumber(pan);
        o.setGstin(gstin);
        o.setDarpanId(darpan);
        o.setAddressLine1(a1);
        o.setAddressLine2(a2);
        o.setCity(city);
        o.setState(state);
        o.setPincode(pin);
        o.setBankName(bank);
        o.setBankAccountNumber(acc);
        o.setIfscCode(ifsc);
        o.setAnnualTurnoverInr(turnover);
        o.setEstablishedYear(est);
        return o;
    }

    private User createUser(String user, String email, String pw, String name, String phone, String desig, Organization org, Set<Role> roles) {
        User u = new User();
        u.setUsername(user);
        u.setEmail(email);
        u.setPasswordHash(pw);
        u.setFullName(name);
        u.setPhone(phone);
        u.setDesignation(desig);
        u.setOrganization(org);
        u.setRoles(roles);
        u.setStatus("ACTIVE");
        return userRepository.save(u);
    }

    private GrantProgram createProgram(String code, String name, String category, String desc,
                                      BigDecimal total, BigDecimal alloc, BigDecimal disb,
                                      BigDecimal minAward, BigDecimal maxAward,
                                      LocalDate opens, LocalDate closes, String status, User createdBy) {
        GrantProgram p = new GrantProgram();
        p.setProgramCode(code);
        p.setProgramName(name);
        p.setCategory(category);
        p.setDescription(desc);
        p.setTotalBudgetInr(total);
        p.setAllocatedBudgetInr(alloc);
        p.setDisbursedBudgetInr(disb);
        p.setMinAwardInr(minAward);
        p.setMaxAwardInr(maxAward);
        p.setOpensAt(opens);
        p.setClosesAt(closes);
        p.setStatus(status);
        p.setCreatedBy(createdBy);
        return p;
    }
}
