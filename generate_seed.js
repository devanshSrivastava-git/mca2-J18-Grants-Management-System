const fs = require('fs');
const path = require('path');

const bCryptHash = '$2a$10$7EqJtq98hPqEX7fNZaFWoOinYmEvb.8fV8Ea5rWkJyF3GZ6iLh0/a'; // 'password123'

// 1. ROLES (5 rows)
const roles = [
  { id: 1, code: 'ROLE_ADMIN', name: 'System Administrator', desc: 'Full administrative access and user management' },
  { id: 2, code: 'ROLE_PROGRAM_MANAGER', name: 'Grant Program Manager', desc: 'Designs grant schemes, sets criteria, oversees review and approvals' },
  { id: 3, code: 'ROLE_REVIEWER', name: 'Technical & Subject Reviewer', desc: 'Evaluates project proposals and submits scored criteria' },
  { id: 4, code: 'ROLE_APPLICANT', name: 'Grant Applicant', desc: 'Submits proposals, checks eligibility, and reports milestones' },
  { id: 5, code: 'ROLE_FINANCE_OFFICER', name: 'Public Finance Officer', desc: 'Validates bank details, authorizes tranches, and issues UTR records' }
];

// 2. ORGANIZATIONS (15 rows: includes edge cases)
const orgs = [
  { id: 1, name: 'Aarogya Health Development Society', type: 'NGO', reg: 'NGO-DL-2015-8821', pan: 'AAATA1122A', gstin: '07AAATA1122A1Z5', darpan: 'DL/2016/0102938', addr1: '42 institutional Area', addr2: 'Sector 4, RK Puram', city: 'New Delhi', state: 'Delhi', pin: '110022', bank: 'State Bank of India', acc: '10982347101', ifsc: 'SBIN0001234', turnover: 45000000, est: 2015 },
  { id: 2, name: 'Krishi Vikas Grameen Sansthan', type: 'NGO', reg: 'NGO-MH-2012-3341', pan: 'AAATK3344B', gstin: '27AAATK3344B1Z2', darpan: 'MH/2014/0074612', addr1: '15 Kisan Bhavan', addr2: 'Shivaji Road', city: 'Pune', state: 'Maharashtra', pin: '411005', bank: 'Bank of Baroda', acc: '20491823902', ifsc: 'BARB0SHIVAJ', turnover: 32000000, est: 2012 },
  { id: 3, name: 'Vidyasagar Research & Tech Foundation', type: 'ACADEMIC_INSTITUTION', reg: 'ACA-KA-2008-0091', pan: 'AAATV5566C', gstin: '29AAATV5566C1Z8', darpan: 'KA/2010/0038192', addr1: '12 Science College Road', addr2: 'Malleshwaram', city: 'Bengaluru', state: 'Karnataka', pin: '560003', bank: 'Canara Bank', acc: '04821039481', ifsc: 'CNRB0000482', turnover: 120000000, est: 2008 },
  { id: 4, name: 'Urja Green CleanTech Innovations', type: 'STARTUP', reg: 'STU-TS-2021-9923', pan: 'AAATU7788D', gstin: '36AAATU7788D1Z4', darpan: 'TS/2022/0192837', addr1: 'T-Hub 2.0, Raidurg', addr2: 'Knowledge City', city: 'Hyderabad', state: 'Telangana', pin: '500081', bank: 'HDFC Bank', acc: '50100492817263', ifsc: 'HDFC0000123', turnover: 18000000, est: 2021 },
  { id: 5, name: 'Jal Samrakshan Trust', type: 'NGO', reg: 'NGO-RJ-2017-4412', pan: 'AAATJ9900E', gstin: '08AAATJ9900E1Z9', darpan: 'RJ/2018/0081293', addr1: '8 Jal Marg', addr2: 'C-Scheme', city: 'Jaipur', state: 'Rajasthan', pin: '302001', bank: 'Punjab National Bank', acc: '18290021003948', ifsc: 'PUNB0182900', turnover: 25000000, est: 2017 },
  { id: 6, name: 'National Institute of BioSciences', type: 'RESEARCH_LAB', reg: 'RES-TN-2005-1102', pan: 'AAATN2233F', gstin: '33AAATN2233F1Z1', darpan: 'TN/2007/0019283', addr1: '88 Biotechnology corridor', addr2: 'Taramani', city: 'Chennai', state: 'Tamil Nadu', pin: '600113', bank: 'Indian Bank', acc: '60192837461', ifsc: 'IDIB000T012', turnover: 280000000, est: 2005 },
  { id: 7, name: 'Samriddhi Rural Empowerment Society', type: 'NGO', reg: 'NGO-UP-2016-7781', pan: 'AAATS4455G', gstin: '09AAATS4455G1Z7', darpan: 'UP/2017/0119284', addr1: '24 Vikas Nagar', addr2: 'Alambagh', city: 'Lucknow', state: 'Uttar Pradesh', pin: '226005', bank: 'State Bank of India', acc: '38192039481', ifsc: 'SBIN0005521', turnover: 15000000, est: 2016 },
  { id: 8, name: 'Prakriti Himalayan Conservation Centre', type: 'NGO', reg: 'NGO-UK-2014-6621', pan: 'AAATP6677H', gstin: '05AAATP6677H1Z3', darpan: 'UA/2015/0049281', addr1: '14 Mall Avenue', addr2: 'Near Clock Tower', city: 'Dehradun', state: 'Uttarakhand', pin: '248001', bank: 'Union Bank of India', acc: '49182736451', ifsc: 'UBIN0549182', turnover: 21000000, est: 2014 },
  { id: 9, name: 'Sankalp Shiksha Foundation', type: 'NGO', reg: 'NGO-WB-2013-2289', pan: 'AAATS8899I', gstin: '19AAATS8899I1Z0', darpan: 'WB/2014/0061928', addr1: '102 Salt Lake Sector V', addr2: 'Bidhannagar', city: 'Kolkata', state: 'West Bengal', pin: '700091', bank: 'Axis Bank', acc: '918029384756', ifsc: 'UTIB0000293', turnover: 38000000, est: 2013 },
  { id: 10, name: 'Navodaya Community Welfare Council', type: 'NGO', reg: 'NGO-GJ-2018-9901', pan: 'AAATN1133J', gstin: '24AAATN1133J1Z6', darpan: 'GJ/2019/0129384', addr1: '45 Ashram Road', addr2: 'Navrangpura', city: 'Ahmedabad', state: 'Gujarat', pin: '380009', bank: 'ICICI Bank', acc: '002401928374', ifsc: 'ICIC0000024', turnover: 42000000, est: 2018 },
  { id: 11, name: 'Malabar Coastal Development Agency', type: 'GOVERNMENT_BODY', reg: 'GOV-KL-2002-0012', pan: 'AAATM3355K', gstin: '32AAATM3355K1Z2', darpan: 'KL/2004/0001298', addr1: 'Government Marine Complex', addr2: 'Willingdon Island', city: 'Kochi', state: 'Kerala', pin: '682003', bank: 'State Bank of India', acc: '58192039481', ifsc: 'SBIN0000845', turnover: 195000000, est: 2002 },
  { id: 12, name: 'Deshbandhu Technical Solutions Pvt Ltd', type: 'PRIVATE_ENTERPRISE', reg: 'PVT-MP-2020-5512', pan: 'AAATD5577L', gstin: '23AAATD5577L1Z8', darpan: 'MP/2021/0091827', addr1: '17 MP Nagar Zone II', addr2: 'Behind City Center', city: 'Bhopal', state: 'Madhya Pradesh', pin: '462011', bank: 'Kotak Mahindra Bank', acc: '2918273645', ifsc: 'KKBK0000512', turnover: 55000000, est: 2020 },
  // Edge Case 2: Empty optional fields (gstin, darpan, addr2 null)
  { id: 13, name: 'Gramin Vikas Sahayata Sangam', type: 'NGO', reg: 'NGO-BR-2019-1002', pan: 'AAATG7799M', gstin: null, darpan: null, addr1: 'Main Market Road, Daudnagar', addr2: null, city: 'Patna', state: 'Bihar', pin: '800001', bank: 'Central Bank of India', acc: '3829102938', ifsc: 'CBIN0281928', turnover: 8500000, est: 2019 },
  // Edge Case 3: Duplicate-looking names in same city
  { id: 14, name: 'Seva Rural Foundation', type: 'NGO', reg: 'NGO-GJ-2011-8841', pan: 'AAATS9911N', gstin: '24AAATS9911N1Z5', darpan: 'GJ/2012/0048192', addr1: '32 Station Road', addr2: 'Opposite Town Hall', city: 'Surat', state: 'Gujarat', pin: '395003', bank: 'Bank of India', acc: '19283746501', ifsc: 'BKID0001928', turnover: 29000000, est: 2011 },
  { id: 15, name: 'Seva Rural Foundation Trust', type: 'NGO', reg: 'NGO-GJ-2016-1192', pan: 'AAATS9922O', gstin: '24AAATS9922O1Z1', darpan: 'GJ/2017/0091823', addr1: '78 Ring Road Complex', addr2: 'Majura Gate', city: 'Surat', state: 'Gujarat', pin: '395002', bank: 'HDFC Bank', acc: '50100293847581', ifsc: 'HDFC0000293', turnover: 22000000, est: 2016 }
];

// 3. USERS (15 rows: includes admin, managers, reviewers, applicants, finance)
const users = [
  { id: 1, user: 'admin', email: 'admin@grants.gov.in', name: 'Dr. Rajeshwar Sharma', phone: '+91-9811001122', desig: 'Chief Grant Director', orgId: null, status: 'ACTIVE' },
  { id: 2, user: 'pm_rajesh', email: 'rajesh.sharma@grants.gov.in', name: 'Rajesh Sharma', phone: '+91-9822112233', desig: 'Senior Program Manager', orgId: null, status: 'ACTIVE' },
  { id: 3, user: 'pm_sunita', email: 'sunita.deshmukh@grants.gov.in', name: 'Dr. Sunita Deshmukh', phone: '+91-9833223344', desig: 'Program Manager - Clean Energy', orgId: null, status: 'ACTIVE' },
  { id: 4, user: 'rev_ananya', email: 'ananya.sengupta@iitd.ac.in', name: 'Prof. Ananya Sengupta', phone: '+91-9844334455', desig: 'Lead Evaluator & Professor', orgId: null, status: 'ACTIVE' },
  { id: 5, user: 'rev_suresh', email: 'suresh.menon@iisconline.org', name: 'Dr. Suresh Menon', phone: '+91-9855445566', desig: 'Senior Scientific Advisor', orgId: null, status: 'ACTIVE' },
  { id: 6, user: 'rev_deepa', email: 'deepa.raman@tiss.edu', name: 'Dr. Deepa Raman', phone: '+91-9866556677', desig: 'Social Impact Assessor', orgId: null, status: 'ACTIVE' },
  { id: 7, user: 'fin_neha', email: 'neha.verma@finance.gov.in', name: 'Neha Verma', phone: '+91-9877667788', desig: 'Joint Controller of Accounts', orgId: null, status: 'ACTIVE' },
  { id: 8, user: 'fin_arun', email: 'arun.pillai@finance.gov.in', name: 'Arun Pillai', phone: '+91-9888778899', desig: 'Public Fund Disbursement Officer', orgId: null, status: 'ACTIVE' },
  { id: 9, user: 'app_vikram', email: 'vikram.seth@aarogyahealth.org', name: 'Vikram Seth', phone: '+91-9899889900', desig: 'Executive Director', orgId: 1, status: 'ACTIVE' },
  { id: 10, user: 'app_priya', email: 'priya.patel@krishivikas.org', name: 'Priya Patel', phone: '+91-9810101010', desig: 'Project Coordinator', orgId: 2, status: 'ACTIVE' },
  { id: 11, user: 'app_amitabha', email: 'amitabha.bose@vidyasagar.edu.in', name: 'Prof. Amitabha Bose', phone: '+91-9820202020', desig: 'Principal Investigator', orgId: 3, status: 'ACTIVE' },
  { id: 12, user: 'app_kavita', email: 'kavita.reddy@urjaclean.com', name: 'Kavita Reddy', phone: '+91-9830303030', desig: 'CTO & Co-Founder', orgId: 4, status: 'ACTIVE' },
  { id: 13, user: 'app_harpreet', email: 'harpreet.singh@jalsamrakshan.org', name: 'Harpreet Singh', phone: '+91-9840404040', desig: 'Managing Trustee', orgId: 5, status: 'ACTIVE' },
  { id: 14, user: 'app_manoj', email: 'manoj.tiwari@samriddhi.org', name: 'Manoj Tiwari', phone: '+91-9850505050', desig: 'Secretary', orgId: 7, status: 'ACTIVE' },
  { id: 15, user: 'app_fatima', email: 'fatima.begum@sevarural.org', name: 'Fatima Begum', phone: '+91-9860606060', desig: 'Program Head', orgId: 14, status: 'ACTIVE' }
];

// USER_ROLES junction
const userRoles = [
  { userId: 1, roleId: 1 }, // admin -> ROLE_ADMIN
  { userId: 1, roleId: 2 }, // admin -> ROLE_PROGRAM_MANAGER
  { userId: 2, roleId: 2 }, // pm_rajesh -> ROLE_PROGRAM_MANAGER
  { userId: 3, roleId: 2 }, // pm_sunita -> ROLE_PROGRAM_MANAGER
  { userId: 4, roleId: 3 }, // rev_ananya -> ROLE_REVIEWER
  { userId: 5, roleId: 3 }, // rev_suresh -> ROLE_REVIEWER
  { userId: 6, roleId: 3 }, // rev_deepa -> ROLE_REVIEWER
  { userId: 7, roleId: 5 }, // fin_neha -> ROLE_FINANCE_OFFICER
  { userId: 8, roleId: 5 }, // fin_arun -> ROLE_FINANCE_OFFICER
  { userId: 9, roleId: 4 }, // app_vikram -> ROLE_APPLICANT
  { userId: 10, roleId: 4 },
  { userId: 11, roleId: 4 },
  { userId: 12, roleId: 4 },
  { userId: 13, roleId: 4 },
  { userId: 14, roleId: 4 },
  { userId: 15, roleId: 4 }
];

// 4. GRANT_PROGRAMS (12 rows: includes Community Impact 2026 wireframe match + edge cases)
const programs = [
  {
    id: 1,
    code: 'GMS-2026-CIP-001',
    name: 'Community Impact 2026',
    category: 'Healthcare & Sanitation',
    desc: 'Empowering community-driven healthcare initiatives, primary wellness centers, and decentralized sanitation across underserved tier-2 and rural districts in India.',
    totalBudget: 50000000,
    allocatedBudget: 28500000,
    disbursedBudget: 14200000,
    minAward: 1000000,
    maxAward: 5000000,
    opensAt: '2026-04-01',
    closesAt: '2026-06-30',
    status: 'PUBLISHED',
    createdBy: 2
  },
  {
    id: 2,
    code: 'GMS-2025-AGR-002',
    name: 'National AgriTech Innovation Fund',
    category: 'AgriTech & Rural',
    desc: 'Support for smart IoT-based irrigation, solar cold storages, drone crop assessment, and decentralized post-harvest processing for smallholder farmer groups.',
    totalBudget: 80000000,
    allocatedBudget: 52000000,
    disbursedBudget: 34000000,
    minAward: 2000000,
    maxAward: 8000000,
    opensAt: '2025-01-15',
    closesAt: '2025-05-31',
    status: 'PUBLISHED',
    createdBy: 2
  },
  {
    id: 3,
    code: 'GMS-2025-CLN-003',
    name: 'Clean Energy & Decarbonization Accelerator',
    category: 'Clean Energy & Climate',
    desc: 'Grants to deploy pilot renewable mini-grids, industrial energy efficiency prototypes, biomass energy conversion, and rooftop solar micro-installations.',
    totalBudget: 100000000,
    allocatedBudget: 65000000,
    disbursedBudget: 42000000,
    minAward: 3000000,
    maxAward: 10000000,
    opensAt: '2025-02-01',
    closesAt: '2025-07-31',
    status: 'PUBLISHED',
    createdBy: 3
  },
  {
    id: 4,
    code: 'GMS-2026-EDU-004',
    name: 'STEM Rural School Laboratory Scheme',
    category: 'STEM Education',
    desc: 'Setting up experiential science, robotics, and digital computer learning labs in government and aided secondary schools across aspirational districts.',
    totalBudget: 40000000,
    allocatedBudget: 18000000,
    disbursedBudget: 9000000,
    minAward: 1000000,
    maxAward: 3500000,
    opensAt: '2026-03-01',
    closesAt: '2026-08-31',
    status: 'PUBLISHED',
    createdBy: 2
  },
  {
    id: 5,
    code: 'GMS-2024-WAT-005',
    name: 'Jal Samrakshan Watershed Mission 2024',
    category: 'Water Conservation',
    desc: 'Community rain-water harvesting structures, rejuvenation of traditional step-wells and percolation ponds in arid and semi-arid talukas.',
    totalBudget: 60000000,
    allocatedBudget: 60000000,
    disbursedBudget: 58000000,
    minAward: 2000000,
    maxAward: 6000000,
    opensAt: '2024-03-01',
    closesAt: '2024-09-30',
    status: 'CLOSED',
    createdBy: 2
  },
  {
    id: 6,
    code: 'GMS-2026-BIO-006',
    name: 'Indigenous BioTech & Vaccine Research',
    category: 'Healthcare & Sanitation',
    desc: 'Translational biotechnology grants for academic institutions and research labs working on affordable diagnostic point-of-care devices and therapeutics.',
    totalBudget: 120000000,
    allocatedBudget: 45000000,
    disbursedBudget: 20000000,
    minAward: 5000000,
    maxAward: 20000000,
    opensAt: '2026-01-10',
    closesAt: '2026-06-15',
    status: 'PUBLISHED',
    createdBy: 3
  },
  {
    id: 7,
    code: 'GMS-2026-GOV-007',
    name: 'Digital Governance & Citizen Service Innovation',
    category: 'Digital Governance',
    desc: 'Open-source software, multilingual AI bots, and vernacular digital interfaces to streamline public service delivery at block and panchayat levels.',
    totalBudget: 45000000,
    allocatedBudget: 15000000,
    disbursedBudget: 5000000,
    minAward: 1500000,
    maxAward: 5000000,
    opensAt: '2026-02-15',
    closesAt: '2026-07-15',
    status: 'PUBLISHED',
    createdBy: 2
  },
  {
    id: 8,
    code: 'GMS-2026-WAS-008',
    name: 'Urban Solid Waste & Circular Economy Grant',
    category: 'Environment',
    desc: 'Segregation-at-source mechanisms, material recovery facilities, and wet-waste biomethanation plants operated by cooperative societies.',
    totalBudget: 50000000,
    allocatedBudget: 0,
    disbursedBudget: 0,
    minAward: 2000000,
    maxAward: 7500000,
    opensAt: '2026-05-01',
    closesAt: '2026-10-31',
    status: 'DRAFT',
    createdBy: 3
  },
  {
    id: 9,
    code: 'GMS-2026-WOM-009',
    name: 'Women Enterprise & Micro-Livelihood Scheme',
    category: 'Livelihood',
    desc: 'Capacity building, revolving corpus, and machinery grants for women self-help groups (SHG federations) engaged in food processing and handicrafts.',
    totalBudget: 70000000,
    allocatedBudget: 35000000,
    disbursedBudget: 21000000,
    minAward: 1000000,
    maxAward: 4000000,
    opensAt: '2026-01-01',
    closesAt: '2026-06-30',
    status: 'PUBLISHED',
    createdBy: 2
  },
  {
    id: 10,
    code: 'GMS-2024-TRI-010',
    name: 'Tribal Area Forest Produce Value Addition',
    category: 'AgriTech & Rural',
    desc: 'Support for collection, primary processing, testing and branding of minor forest produce in scheduled areas.',
    totalBudget: 35000000,
    allocatedBudget: 35000000,
    disbursedBudget: 35000000,
    minAward: 1000000,
    maxAward: 3500000,
    opensAt: '2024-04-01',
    closesAt: '2024-11-30',
    status: 'CLOSED',
    createdBy: 2
  },
  // Edge Case 1: Max length program name (close to 200 chars) and max length description (close to 2000 chars)
  {
    id: 11,
    code: 'GMS-2026-MAX-011',
    name: 'National Inter-Disciplinary Mega-Consortium for Advanced Deep-Tech Infrastructure and High-Performance Resilience Systems across Urban and Rural Ecosystems Scheme of the Government of India Phase IV',
    category: 'Deep Tech & Infrastructure',
    desc: 'This apex national strategic initiative represents a comprehensive, multi-tiered framework specifically architected to provide substantial non-dilutive financial assistance, capital equipment subventions, and technical enablement grants to collaborative consortia comprising accredited academic universities, premier state-funded scientific research laboratories, certified social impact nongovernmental entities, and registered high-technology early-stage commercial ventures. Participating applicant entities must furnish rigorous documentation establishing proven organizational track records of not less than five consecutive fiscal years, substantiated audited financial balance sheets demonstrating compliant statutory accounting adherence under Indian regulatory standards, verified GST and Darpan registration credentials, and detailed project execution milestone roadmaps outlining quantifiable operational deliverables. Priority evaluation weightage is explicitly allocated towards sustainable low-carbon technological methodologies, indigenous intellectual property generation under Make in India guidelines, verifiable socioeconomic empowerment indices for marginalized demographics, scalable decentralized infrastructure deployment architectures, robust data privacy safeguards conforming to digital governance protocols, and verifiable co-financing commitments from accredited industry partners. All grant allocations under this flagship scheme remain subject to stringent tri-annual technical review inspections, third-party performance audit evaluations, and real-time electronic fund tracking via automated public financial management gateways.'.slice(0, 1990),
    totalBudget: 250000000,
    allocatedBudget: 0,
    disbursedBudget: 0,
    minAward: 10000000,
    maxAward: 50000000,
    opensAt: '2026-06-01',
    closesAt: '2026-12-31',
    status: 'DRAFT',
    createdBy: 1
  },
  {
    id: 12,
    code: 'GMS-2023-ARC-012',
    name: 'Heritage Crafts & Artisans Support Archive',
    category: 'Livelihood',
    desc: 'Archived historical grant round for traditional handloom revival.',
    totalBudget: 20000000,
    allocatedBudget: 20000000,
    disbursedBudget: 20000000,
    minAward: 500000,
    maxAward: 2000000,
    opensAt: '2023-01-01',
    closesAt: '2023-08-31',
    status: 'ARCHIVED',
    createdBy: 2
  }
];

// 5. PROGRAM_ELIGIBILITY_CRITERIA (15 rows)
const criteria = [
  { id: 1, progId: 1, type: 'ORG_TYPE', name: 'Eligible Organization Types', val: 'NGO, ACADEMIC_INSTITUTION', mand: 1 },
  { id: 2, progId: 1, type: 'MIN_EXPERIENCE_YEARS', name: 'Minimum Operational Experience', val: '3', mand: 1 },
  { id: 3, progId: 1, type: 'MAX_TURNOVER_INR', name: 'Maximum Annual Turnover Allowed', val: '100000000', mand: 0 },
  { id: 4, progId: 1, type: 'REQUIRED_DOC', name: 'NGO Darpan ID & Registration', val: 'DARPAN_AND_SOCIETY_REG', mand: 1 },
  { id: 5, progId: 2, type: 'ORG_TYPE', name: 'Eligible Organization Types', val: 'STARTUP, NGO, RESEARCH_LAB', mand: 1 },
  { id: 6, progId: 2, type: 'MIN_EXPERIENCE_YEARS', name: 'Minimum Operational Experience', val: '2', mand: 1 },
  { id: 7, progId: 2, type: 'REQUIRED_DOC', name: 'Audited Balance Sheets 2 Years', val: 'AUDITED_FINANCIALS', mand: 1 },
  { id: 8, progId: 3, type: 'ORG_TYPE', name: 'Eligible Organization Types', val: 'STARTUP, PRIVATE_ENTERPRISE, RESEARCH_LAB', mand: 1 },
  { id: 9, progId: 3, type: 'MIN_EXPERIENCE_YEARS', name: 'Minimum Operational Experience', val: '2', mand: 1 },
  { id: 10, progId: 4, type: 'ORG_TYPE', name: 'Eligible Organization Types', val: 'NGO, ACADEMIC_INSTITUTION', mand: 1 },
  { id: 11, progId: 4, type: 'REQUIRED_DOC', name: 'School MoUs or Consent Letters', val: 'CONSENT_LETTERS', mand: 1 },
  { id: 12, progId: 6, type: 'ORG_TYPE', name: 'Eligible Organization Types', val: 'ACADEMIC_INSTITUTION, RESEARCH_LAB', mand: 1 },
  { id: 13, progId: 7, type: 'ORG_TYPE', name: 'Eligible Organization Types', val: 'STARTUP, NGO, ACADEMIC_INSTITUTION', mand: 1 },
  { id: 14, progId: 9, type: 'ORG_TYPE', name: 'Eligible Organization Types', val: 'NGO', mand: 1 },
  { id: 15, progId: 11, type: 'MIN_EXPERIENCE_YEARS', name: 'Minimum Operational Experience', val: '5', mand: 1 }
];

// Helper for generating applications (60 applications)
const projectTitles = [
  'Mobile Primary Healthcare Clinics for Tribal Talukas',
  'Solar-Powered IoT Drip Irrigation and Soil Moisture Analytics',
  'Decentralized Biomass Gasifier Microgrid for Off-grid Villages',
  'STEM Tinkering Labs and Robotics Curriculum for 50 Rural Schools',
  'Community Rainwater Recharge Wells in Drought Prone Blocks',
  'Point-of-Care Microfluidic Diagnostic Kit for Dengue & Malaria',
  'Citizen Voice: Multilingual Speech-to-Text Grievance App',
  'Solar Cold Storage Micro-Hubs for Small Vegetable Growers',
  'Women Artisan Loom Digitization and E-Commerce Linkage',
  'Greywater Recycling and Bio-Remediation Wetland Pilot',
  'Affordable Portable Ultrasound Machine for Sub-District Hospitals',
  'AI-Driven Pest Forecasting System for Cotton Farmers',
  'Smart Electric Waste Collection Vehicles for Tier-3 Municipalities',
  'Interactive Augmented Reality Science Modules for High Schools',
  'Springshed Management and Check-Dam Rejuvenation',
  'Low-Cost Tuberculosis Breathalyzer Screening Sensor',
  'Panchayat Digital Land Record Verification Kiosks',
  'Farm-to-School Nutri-Cereal Processing Infrastructure',
  'Zero-Waste Banana Fiber Textile Processing Cluster',
  'Off-Grid Solar Chillers for Fisherfolk Self-Help Groups'
];

const summaries = [
  'This project deploys modern, cost-effective technologies and direct field interventions to deliver high measurable impact, measurable baseline metrics, and sustainable capacity development across regional target communities.',
  'A rigorous 24-month structured initiative designed to address persistent public health disparities through mobile diagnostic deployment, community health worker empowerment, and digital health tracking.',
  'An indigenous technological solution integrating cloud telemetry, low-power edge computing sensors, and localized agronomic advisories to reduce water usage by 40% and increase crop yields.',
  'Empowering underprivileged students with hands-on computational thinking, robotics hardware kits, and certified STEM educators to bridge the rural-urban digital education divide.',
  'Recharging depleted aquifers through community-driven civil check-dams, rooftop collection units, and participatory groundwater monitoring groups.'
];

const statuses = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED'];
const eligStatuses = ['ELIGIBLE', 'ELIGIBLE', 'ELIGIBLE', 'PENDING', 'INELIGIBLE'];

const applications = [];
let appCounter = 1;

// Generate 60 realistic applications
for (let i = 1; i <= 60; i++) {
  const prog = programs[(i % 6)]; // link to programs 1-6
  const org = orgs[(i % 15)];
  const user = users.find(u => u.orgId === org.id) || users[8 + (i % 7)];
  const status = i <= 25 ? 'DISBURSED' : (i <= 40 ? 'APPROVED' : (i <= 50 ? 'UNDER_REVIEW' : (i <= 55 ? 'SUBMITTED' : 'REJECTED')));
  const elig = (status === 'REJECTED' && i % 2 === 0) ? 'INELIGIBLE' : 'ELIGIBLE';
  
  // Amounts
  let reqAmt = prog.minAward + ((i * 350000) % (prog.maxAward - prog.minAward + 100000));
  reqAmt = Math.round(reqAmt / 50000) * 50000;
  if (reqAmt < prog.minAward) reqAmt = prog.minAward;
  if (reqAmt > prog.maxAward) reqAmt = prog.maxAward;

  let appvAmt = null;
  if (status === 'APPROVED' || status === 'DISBURSED') {
    appvAmt = reqAmt;
  }

  const appNumber = `GMS-2026-APP-${String(1000 + i)}`;
  const title = `${projectTitles[i % projectTitles.length]} - Phase ${Math.floor(i / 10) + 1}`;
  const summary = summaries[i % summaries.length];
  const duration = 12 + ((i * 3) % 24);
  const subDate = `2025-0${(i % 5) + 1}-15 10:30:00`;
  const appvDate = (status === 'APPROVED' || status === 'DISBURSED') ? `2025-08-20 14:00:00` : null;

  applications.push({
    id: i,
    appNumber,
    progId: prog.id,
    userId: user.id,
    orgId: org.id,
    title,
    summary,
    reqAmt,
    appvAmt,
    duration,
    elig,
    eligRemarks: elig === 'ELIGIBLE' ? 'Meets all mandatory criteria including turnover, years active, and documentation' : 'Turnover exceeds ceiling limit for scheme',
    status,
    subDate,
    appvDate
  });
}

// Edge Case 4: Application with Minimum boundary request
applications[0].reqAmt = programs[0].minAward; // exact ₹10,00,000

// Edge Case 5: Application with Maximum boundary request
applications[1].reqAmt = programs[1].maxAward; // exact ₹80,00,000
applications[1].appvAmt = programs[1].maxAward;
applications[1].status = 'DISBURSED';

// 6. APPLICATION_DOCUMENTS (60 rows)
const docTypes = ['REGISTRATION_CERT', 'PAN_CARD', 'DETAILED_PROJECT_REPORT', 'AUDITED_FINANCIALS', 'DARPAN_CERT'];
const appDocs = [];
let docId = 1;
applications.forEach(app => {
  const docType = docTypes[app.id % docTypes.length];
  appDocs.push({
    id: docId++,
    appId: app.id,
    type: docType,
    fileName: `${app.appNumber}_${docType.toLowerCase()}.pdf`,
    size: 1540000 + (app.id * 123456) % 3000000,
    status: 'VERIFIED',
    uploadedAt: app.subDate
  });
});

// 7. REVIEWS (60 rows)
const reviews = [];
const reviewScores = [];
let revId = 1;
let scoreId = 1;

applications.forEach(app => {
  if (app.status === 'UNDER_REVIEW' || app.status === 'APPROVED' || app.status === 'DISBURSED' || app.status === 'REJECTED') {
    const reviewer = users[3 + (app.id % 3)]; // rev_ananya, rev_suresh, rev_deepa
    const score = app.status === 'REJECTED' ? (42.0 + (app.id % 15)) : (72.0 + (app.id % 24));
    const rec = app.status === 'REJECTED' ? 'NOT_RECOMMENDED' : (score > 85 ? 'RECOMMENDED' : 'RECOMMENDED_WITH_REVISIONS');
    const revStatus = 'COMPLETED';
    
    reviews.push({
      id: revId,
      appId: app.id,
      reviewerId: reviewer.id,
      assignedDate: '2025-06-01 09:00:00',
      completedDate: '2025-06-25 17:30:00',
      totalScore: score,
      rec,
      comments: `Comprehensive technical evaluation conducted. Feasibility rating: ${score}/100. Proposal demonstrates solid implementation capabilities and high socioeconomic alignment.`,
      status: revStatus
    });

    // Sub-scores (4 criteria = 4 rows per review)
    const s1 = Math.round((score * 0.3) * 10) / 10;
    const s2 = Math.round((score * 0.3) * 10) / 10;
    const s3 = Math.round((score * 0.2) * 10) / 10;
    const s4 = Math.round((score - s1 - s2 - s3) * 10) / 10;

    reviewScores.push({ id: scoreId++, revId, name: 'Technical Feasibility', max: 30, score: s1, remarks: 'Robust architectural blueprint' });
    reviewScores.push({ id: scoreId++, revId, name: 'Social & Public Impact', max: 30, score: s2, remarks: 'Clear impact on marginalized groups' });
    reviewScores.push({ id: scoreId++, revId, name: 'Financial Justification', max: 20, score: s3, remarks: 'Line-item costs are reasonable' });
    reviewScores.push({ id: scoreId++, revId, name: 'Organizational Capacity', max: 20, score: s4, remarks: 'Demonstrated execution pedigree' });

    revId++;
  }
});

// 8. DISBURSEMENTS (60 rows)
const disbursements = [];
let disbId = 1;

// Add tranches for approved & disbursed applications
const eligibleForDisb = applications.filter(a => a.status === 'APPROVED' || a.status === 'DISBURSED');
eligibleForDisb.forEach((app, idx) => {
  const approvedAmt = app.appvAmt || app.reqAmt;
  const t1Amt = Math.round(approvedAmt * 0.40);
  const t2Amt = Math.round(approvedAmt * 0.40);
  const t3Amt = approvedAmt - t1Amt - t2Amt;

  // Tranche 1: Advance
  disbursements.push({
    id: disbId++,
    appId: app.id,
    tranche: 1,
    amt: t1Amt,
    milestone: 'Advance Signing & Initial Mobilization',
    schedDate: '2025-09-01',
    disbDate: '2025-09-05',
    status: 'DISBURSED',
    utr: `SBIN2025090500${String(100 + disbId)}`,
    userId: 7,
    remarks: 'Disbursed via PFMS electronic fund transfer gateway'
  });

  if (disbId <= 60) {
    // Tranche 2: Mid-term
    const isDisbursed = app.status === 'DISBURSED' && idx % 2 === 0;
    disbursements.push({
      id: disbId++,
      appId: app.id,
      tranche: 2,
      amt: t2Amt,
      milestone: 'Mid-term Prototype / Field Verification Audit',
      schedDate: '2026-01-15',
      disbDate: isDisbursed ? '2026-01-20' : null,
      status: isDisbursed ? 'DISBURSED' : 'PENDING',
      utr: isDisbursed ? `SBIN2026012000${String(200 + disbId)}` : null,
      userId: isDisbursed ? 7 : null,
      remarks: isDisbursed ? 'Mid-term milestone verified and cleared' : 'Awaiting progress audit verification'
    });
  }

  if (disbId <= 60 && app.status === 'DISBURSED' && idx % 3 === 0) {
    // Tranche 3: Final
    disbursements.push({
      id: disbId++,
      appId: app.id,
      tranche: 3,
      amt: t3Amt,
      milestone: 'Final Project Report & Utilization Certification',
      schedDate: '2026-05-30',
      disbDate: null,
      status: 'PENDING',
      utr: null,
      userId: null,
      remarks: 'Scheduled upon submission of statutory CA certificate'
    });
  }
});

// 9. PROGRESS_REPORTS (50 rows)
const progressReports = [];
let repId = 1;
applications.filter(a => a.status === 'DISBURSED').forEach((app, idx) => {
  if (repId <= 50) {
    progressReports.push({
      id: repId++,
      appId: app.id,
      title: `Quarterly Milestone Progress Report Q${(idx % 4) + 1}`,
      milestoneAchieved: 'Successfully deployed infrastructure, procured core sensor equipment, and completed baseline survey across 14 target village clusters.',
      fundsUtilized: Math.round((app.appvAmt || app.reqAmt) * 0.35),
      subDate: '2025-11-30',
      status: 'VERIFIED',
      remarks: 'Inspected by District Nodal Officer; physical progress verified against milestones.'
    });
  }
  if (repId <= 50) {
    progressReports.push({
      id: repId++,
      appId: app.id,
      title: `Mid-term Operational Status Report`,
      milestoneAchieved: 'Commissioned local training centers, enrolled 450 beneficiaries, and commenced digitized feedback monitoring.',
      fundsUtilized: Math.round((app.appvAmt || app.reqAmt) * 0.30),
      subDate: '2026-02-15',
      status: 'VERIFIED',
      remarks: 'Audit compliance certificate furnished and approved.'
    });
  }
});

// 10. AUDIT_LOGS (60 rows)
const auditLogs = [];
let logId = 1;
applications.slice(0, 30).forEach((app, idx) => {
  auditLogs.push({
    id: logId++,
    entityName: 'APPLICATION',
    entityId: app.id,
    action: 'STATUS_TRANSITION',
    userId: 2,
    oldState: 'SUBMITTED',
    newState: 'UNDER_REVIEW',
    details: `Application ${app.appNumber} screened and assigned to technical review panel`,
    ts: '2025-05-20 11:15:00'
  });
  auditLogs.push({
    id: logId++,
    entityName: 'APPLICATION',
    entityId: app.id,
    action: 'APPROVAL_DECISION',
    userId: 1,
    oldState: 'UNDER_REVIEW',
    newState: app.status,
    details: `Executive Grant Committee formalized decision: ${app.status} with allocation INR ${app.appvAmt || 0}`,
    ts: '2025-08-20 14:00:00'
  });
});

console.log(`Generated:
Roles: ${roles.length}
Organizations: ${orgs.length}
Users: ${users.length}
UserRoles: ${userRoles.length}
Programs: ${programs.length}
Criteria: ${criteria.length}
Applications: ${applications.length}
AppDocs: ${appDocs.length}
Reviews: ${reviews.length}
ReviewScores: ${reviewScores.length}
Disbursements: ${disbursements.length}
ProgressReports: ${progressReports.length}
AuditLogs: ${auditLogs.length}
`);

// Write seed_data.sql
let sql = `-- ============================================================================
-- GRANTS MANAGEMENT SYSTEM
-- Oracle 21c XE Seed Data Script
-- Indian Public Sector Context (INR currency, realistic dates 2024-2026)
-- Parent tables inserted before child tables to satisfy Foreign Keys
-- ============================================================================

SET DEFINE OFF;

-- 1. ROLES
`;

roles.forEach(r => {
  sql += `INSERT INTO ROLES (role_id, role_code, role_name, description) VALUES (${r.id}, '${r.code}', '${r.name}', '${r.desc}');\n`;
});

sql += `\n-- 2. ORGANIZATIONS\n`;
orgs.forEach(o => {
  const gstinVal = o.gstin ? `'${o.gstin}'` : 'NULL';
  const darpanVal = o.darpan ? `'${o.darpan}'` : 'NULL';
  const addr2Val = o.addr2 ? `'${o.addr2}'` : 'NULL';
  sql += `INSERT INTO ORGANIZATIONS (org_id, org_name, org_type, registration_number, pan_number, gstin, darpan_id, address_line1, address_line2, city, state, pincode, bank_name, bank_account_number, ifsc_code, annual_turnover_inr, established_year) VALUES (${o.id}, '${o.name}', '${o.type}', '${o.reg}', '${o.pan}', ${gstinVal}, ${darpanVal}, '${o.addr1}', ${addr2Val}, '${o.city}', '${o.state}', '${o.pin}', '${o.bank}', '${o.acc}', '${o.ifsc}', ${o.turnover}, ${o.est});\n`;
});

sql += `\n-- 3. USERS\n`;
users.forEach(u => {
  const orgVal = u.orgId ? u.orgId : 'NULL';
  sql += `INSERT INTO USERS (user_id, username, email, password_hash, full_name, phone, designation, organization_id, status) VALUES (${u.id}, '${u.user}', '${u.email}', '${bCryptHash}', '${u.name}', '${u.phone}', '${u.desig}', ${orgVal}, '${u.status}');\n`;
});

sql += `\n-- 4. USER_ROLES\n`;
userRoles.forEach(ur => {
  sql += `INSERT INTO USER_ROLES (user_id, role_id) VALUES (${ur.userId}, ${ur.roleId});\n`;
});

sql += `\n-- 5. GRANT_PROGRAMS\n`;
programs.forEach(p => {
  const descEscaped = p.desc.replace(/'/g, "''");
  sql += `INSERT INTO GRANT_PROGRAMS (program_id, program_code, program_name, category, description, total_budget_inr, allocated_budget_inr, disbursed_budget_inr, min_award_inr, max_award_inr, opens_at, closes_at, status, created_by_user_id) VALUES (${p.id}, '${p.code}', '${p.name.replace(/'/g, "''")}', '${p.category}', '${descEscaped}', ${p.totalBudget}, ${p.allocatedBudget}, ${p.disbursedBudget}, ${p.minAward}, ${p.maxAward}, TO_DATE('${p.opensAt}', 'YYYY-MM-DD'), TO_DATE('${p.closesAt}', 'YYYY-MM-DD'), '${p.status}', ${p.createdBy});\n`;
});

sql += `\n-- 6. PROGRAM_ELIGIBILITY_CRITERIA\n`;
criteria.forEach(c => {
  sql += `INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA (criteria_id, program_id, criterion_type, criterion_name, criterion_value, is_mandatory) VALUES (${c.id}, ${c.progId}, '${c.type}', '${c.name}', '${c.val}', ${c.mand});\n`;
});

sql += `\n-- 7. APPLICATIONS\n`;
applications.forEach(a => {
  const appvVal = a.appvAmt ? a.appvAmt : 'NULL';
  const subDateVal = a.subDate ? `TO_TIMESTAMP('${a.subDate}', 'YYYY-MM-DD HH24:MI:SS')` : 'NULL';
  const appvDateVal = a.appvDate ? `TO_TIMESTAMP('${a.appvDate}', 'YYYY-MM-DD HH24:MI:SS')` : 'NULL';
  sql += `INSERT INTO APPLICATIONS (application_id, application_number, program_id, applicant_user_id, org_id, project_title, executive_summary, requested_amount_inr, approved_amount_inr, project_duration_months, eligibility_status, eligibility_remarks, application_status, submission_date, approval_date) VALUES (${a.id}, '${a.appNumber}', ${a.progId}, ${a.userId}, ${a.orgId}, '${a.title.replace(/'/g, "''")}', '${a.summary.replace(/'/g, "''")}', ${a.reqAmt}, ${appvVal}, ${a.duration}, '${a.elig}', '${a.eligRemarks}', '${a.status}', ${subDateVal}, ${appvDateVal});\n`;
});

sql += `\n-- 8. APPLICATION_DOCUMENTS\n`;
appDocs.forEach(d => {
  sql += `INSERT INTO APPLICATION_DOCUMENTS (doc_id, application_id, document_type, file_name, file_size_bytes, verification_status, uploaded_at) VALUES (${d.id}, ${d.appId}, '${d.type}', '${d.fileName}', ${d.size}, '${d.status}', TO_TIMESTAMP('${d.uploadedAt}', 'YYYY-MM-DD HH24:MI:SS'));\n`;
});

sql += `\n-- 9. REVIEWS\n`;
reviews.forEach(r => {
  sql += `INSERT INTO REVIEWS (review_id, application_id, reviewer_user_id, assigned_date, completed_date, total_score, recommendation, comments, review_status) VALUES (${r.id}, ${r.appId}, ${r.reviewerId}, TO_TIMESTAMP('${r.assignedDate}', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('${r.completedDate}', 'YYYY-MM-DD HH24:MI:SS'), ${r.totalScore}, '${r.rec}', '${r.comments}', '${r.status}');\n`;
});

sql += `\n-- 10. REVIEW_SCORES\n`;
reviewScores.forEach(s => {
  sql += `INSERT INTO REVIEW_SCORES (score_id, review_id, criterion_name, max_score, assigned_score, remarks) VALUES (${s.id}, ${s.revId}, '${s.name}', ${s.max}, ${s.score}, '${s.remarks}');\n`;
});

sql += `\n-- 11. DISBURSEMENTS\n`;
disbursements.forEach(d => {
  const disbDateVal = d.disbDate ? `TO_DATE('${d.disbDate}', 'YYYY-MM-DD')` : 'NULL';
  const utrVal = d.utr ? `'${d.utr}'` : 'NULL';
  const userVal = d.userId ? d.userId : 'NULL';
  sql += `INSERT INTO DISBURSEMENTS (disbursement_id, application_id, tranche_number, amount_inr, milestone_description, scheduled_date, disbursed_date, payment_status, utr_number, disbursed_by_user_id, remarks) VALUES (${d.id}, ${d.appId}, ${d.tranche}, ${d.amt}, '${d.milestone}', TO_DATE('${d.schedDate}', 'YYYY-MM-DD'), ${disbDateVal}, '${d.status}', ${utrVal}, ${userVal}, '${d.remarks}');\n`;
});

sql += `\n-- 12. PROGRESS_REPORTS\n`;
progressReports.forEach(pr => {
  sql += `INSERT INTO PROGRESS_REPORTS (report_id, application_id, report_title, milestone_achieved, funds_utilized_inr, submission_date, status, remarks) VALUES (${pr.id}, ${pr.appId}, '${pr.title}', '${pr.milestoneAchieved}', ${pr.fundsUtilized}, TO_DATE('${pr.subDate}', 'YYYY-MM-DD'), '${pr.status}', '${pr.remarks}');\n`;
});

sql += `\n-- 13. AUDIT_LOGS\n`;
auditLogs.forEach(al => {
  sql += `INSERT INTO AUDIT_LOGS (log_id, entity_name, entity_id, action, performed_by_user_id, old_state, new_state, details, action_timestamp) VALUES (${al.id}, '${al.entityName}', ${al.entityId}, '${al.action}', ${al.userId}, '${al.oldState}', '${al.newState}', '${al.details}', TO_TIMESTAMP('${al.ts}', 'YYYY-MM-DD HH24:MI:SS'));\n`;
});

sql += `\nCOMMIT;\n`;

fs.writeFileSync(path.join(__dirname, 'database', 'seed_data.sql'), sql, 'utf8');

// Function to generate CSV
function writeCsv(filename, headers, rows) {
  const lines = [headers.join(',')];
  rows.forEach(row => {
    const vals = headers.map(h => {
      let v = row[h];
      if (v === null || v === undefined) return '';
      if (typeof v === 'string') {
        return `"${v.replace(/"/g, '""')}"`;
      }
      return v;
    });
    lines.push(vals.join(','));
  });
  fs.writeFileSync(path.join(__dirname, 'database', 'csv', filename), lines.join('\n'), 'utf8');
}

writeCsv('roles.csv', ['id', 'code', 'name', 'desc'], roles);
writeCsv('organizations.csv', ['id', 'name', 'type', 'reg', 'pan', 'gstin', 'darpan', 'addr1', 'addr2', 'city', 'state', 'pin', 'bank', 'acc', 'ifsc', 'turnover', 'est'], orgs);
writeCsv('users.csv', ['id', 'user', 'email', 'name', 'phone', 'desig', 'orgId', 'status'], users);
writeCsv('grant_programs.csv', ['id', 'code', 'name', 'category', 'totalBudget', 'allocatedBudget', 'disbursedBudget', 'minAward', 'maxAward', 'opensAt', 'closesAt', 'status', 'createdBy'], programs);
writeCsv('applications.csv', ['id', 'appNumber', 'progId', 'userId', 'orgId', 'title', 'reqAmt', 'appvAmt', 'duration', 'elig', 'status', 'subDate', 'appvDate'], applications);
writeCsv('reviews.csv', ['id', 'appId', 'reviewerId', 'assignedDate', 'completedDate', 'totalScore', 'rec', 'status'], reviews);
writeCsv('disbursements.csv', ['id', 'appId', 'tranche', 'amt', 'milestone', 'schedDate', 'disbDate', 'status', 'utr', 'userId'], disbursements);
writeCsv('progress_reports.csv', ['id', 'appId', 'title', 'milestoneAchieved', 'fundsUtilized', 'subDate', 'status'], progressReports);

console.log('Seed SQL and CSV files generated successfully.');
