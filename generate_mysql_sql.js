const fs = require('fs');
const path = require('path');

const bCryptHash = '$2a$10$7EqJtq98hPqEX7fNZaFWoOinYmEvb.8fV8Ea5rWkJyF3GZ6iLh0/a'; // 'password123'

let sql = `-- ============================================================================
-- GRANTS MANAGEMENT SYSTEM (Government & Public Sector)
-- Relational Database Script for MySQL 8.0 / 8.4 / 9.0 & MySQL Workbench
-- Normalized Relational Schema (3NF) + Complete Indian Public Sector Dataset
-- ============================================================================

-- 1. Create and Switch to Database
CREATE DATABASE IF NOT EXISTS grants_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE grants_db;

-- 2. Drop existing tables safely (reverse dependency order)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS progress_reports;
DROP TABLE IF EXISTS disbursements;
DROP TABLE IF EXISTS review_scores;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS application_documents;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS program_eligibility_criteria;
DROP TABLE IF EXISTS grant_programs;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- TABLE DDL (3NF Schema with Constraints and Foreign Keys)
-- ============================================================================

-- Table 1: ROLES (Master Table)
CREATE TABLE roles (
    role_id        BIGINT NOT NULL AUTO_INCREMENT,
    role_code      VARCHAR(30) NOT NULL,
    role_name      VARCHAR(100) NOT NULL,
    description    VARCHAR(255) NULL,
    PRIMARY KEY (role_id),
    UNIQUE KEY uk_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: ORGANIZATIONS (Applicant Entities: NGOs, Startups, Academic Labs)
CREATE TABLE organizations (
    org_id               BIGINT NOT NULL AUTO_INCREMENT,
    org_name             VARCHAR(200) NOT NULL,
    org_type             VARCHAR(50) NOT NULL,
    registration_number  VARCHAR(50) NOT NULL,
    pan_number           VARCHAR(10) NOT NULL,
    gstin                VARCHAR(15) NULL,
    darpan_id            VARCHAR(50) NULL,
    address_line1        VARCHAR(255) NOT NULL,
    address_line2        VARCHAR(255) NULL,
    city                 VARCHAR(100) NOT NULL,
    state                VARCHAR(100) NOT NULL,
    pincode              VARCHAR(10) NOT NULL,
    bank_name            VARCHAR(100) NOT NULL,
    bank_account_number  VARCHAR(30) NOT NULL,
    ifsc_code            VARCHAR(15) NOT NULL,
    annual_turnover_inr  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    established_year     INT NOT NULL,
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (org_id),
    UNIQUE KEY uk_org_reg (registration_number),
    UNIQUE KEY uk_org_pan (pan_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: USERS (Portal Actors: Admins, Managers, Reviewers, Applicants, Finance)
CREATE TABLE users (
    user_id          BIGINT NOT NULL AUTO_INCREMENT,
    username         VARCHAR(60) NOT NULL,
    email            VARCHAR(120) NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    full_name        VARCHAR(120) NOT NULL,
    phone            VARCHAR(20) NULL,
    designation      VARCHAR(100) NULL,
    organization_id  BIGINT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_user_username (username),
    UNIQUE KEY uk_user_email (email),
    KEY idx_users_org (organization_id),
    CONSTRAINT fk_users_org FOREIGN KEY (organization_id) REFERENCES organizations(org_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 4: USER_ROLES (Junction: Many-to-Many Users and Roles)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    KEY idx_ur_role (role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 5: GRANT_PROGRAMS (Master Schemes & Budget Configurations)
CREATE TABLE grant_programs (
    program_id            BIGINT NOT NULL AUTO_INCREMENT,
    program_code          VARCHAR(50) NOT NULL,
    program_name          VARCHAR(200) NOT NULL,
    category              VARCHAR(100) NOT NULL,
    description           TEXT NOT NULL,
    total_budget_inr      DECIMAL(15,2) NOT NULL,
    allocated_budget_inr  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    disbursed_budget_inr  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    min_award_inr         DECIMAL(15,2) NOT NULL,
    max_award_inr         DECIMAL(15,2) NOT NULL,
    opens_at              DATE NOT NULL,
    closes_at             DATE NOT NULL,
    status                VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_by_user_id    BIGINT NOT NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (program_id),
    UNIQUE KEY uk_prog_code (program_code),
    KEY idx_prog_status (status),
    KEY idx_prog_creator (created_by_user_id),
    CONSTRAINT fk_prog_user FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 6: PROGRAM_ELIGIBILITY_CRITERIA (Rule Configuration Engine)
CREATE TABLE program_eligibility_criteria (
    criteria_id       BIGINT NOT NULL AUTO_INCREMENT,
    program_id        BIGINT NOT NULL,
    criterion_type    VARCHAR(50) NOT NULL,
    criterion_name    VARCHAR(200) NOT NULL,
    criterion_value   VARCHAR(255) NOT NULL,
    is_mandatory      TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (criteria_id),
    KEY idx_pec_program (program_id),
    CONSTRAINT fk_pec_program FOREIGN KEY (program_id) REFERENCES grant_programs(program_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 7: APPLICATIONS (Transaction Table: Proposals & Submissions)
CREATE TABLE applications (
    application_id           BIGINT NOT NULL AUTO_INCREMENT,
    application_number       VARCHAR(50) NOT NULL,
    program_id               BIGINT NOT NULL,
    applicant_user_id        BIGINT NOT NULL,
    org_id                   BIGINT NOT NULL,
    project_title            VARCHAR(255) NOT NULL,
    executive_summary        TEXT NOT NULL,
    requested_amount_inr     DECIMAL(15,2) NOT NULL,
    approved_amount_inr      DECIMAL(15,2) NULL,
    project_duration_months  INT NOT NULL,
    eligibility_status       VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    eligibility_remarks      VARCHAR(500) NULL,
    application_status       VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    submission_date          DATETIME NULL,
    approval_date            DATETIME NULL,
    created_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (application_id),
    UNIQUE KEY uk_app_number (application_number),
    KEY idx_app_prog (program_id),
    KEY idx_app_user (applicant_user_id),
    KEY idx_app_org (org_id),
    KEY idx_app_status (application_status),
    CONSTRAINT fk_app_prog FOREIGN KEY (program_id) REFERENCES grant_programs(program_id),
    CONSTRAINT fk_app_user FOREIGN KEY (applicant_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_app_org FOREIGN KEY (org_id) REFERENCES organizations(org_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 8: APPLICATION_DOCUMENTS (Supporting Attachments)
CREATE TABLE application_documents (
    doc_id               BIGINT NOT NULL AUTO_INCREMENT,
    application_id       BIGINT NOT NULL,
    document_type        VARCHAR(60) NOT NULL,
    file_name            VARCHAR(255) NOT NULL,
    file_size_bytes      BIGINT NOT NULL,
    verification_status  VARCHAR(30) NOT NULL DEFAULT 'VERIFIED',
    uploaded_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (doc_id),
    KEY idx_doc_app (application_id),
    CONSTRAINT fk_doc_app FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 9: REVIEWS (Evaluator Assignments & Scored Criteria)
CREATE TABLE reviews (
    review_id         BIGINT NOT NULL AUTO_INCREMENT,
    application_id    BIGINT NOT NULL,
    reviewer_user_id  BIGINT NOT NULL,
    assigned_date     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_date    DATETIME NULL,
    total_score       DECIMAL(5,2) NULL,
    recommendation    VARCHAR(30) NULL,
    comments          TEXT NULL,
    review_status     VARCHAR(30) NOT NULL DEFAULT 'ASSIGNED',
    PRIMARY KEY (review_id),
    UNIQUE KEY uk_app_reviewer (application_id, reviewer_user_id),
    KEY idx_rev_user (reviewer_user_id),
    CONSTRAINT fk_rev_app FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE,
    CONSTRAINT fk_rev_user FOREIGN KEY (reviewer_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 10: REVIEW_SCORES (Detailed Criterion Score Breakdown)
CREATE TABLE review_scores (
    score_id        BIGINT NOT NULL AUTO_INCREMENT,
    review_id       BIGINT NOT NULL,
    criterion_name  VARCHAR(100) NOT NULL,
    max_score       INT NOT NULL,
    assigned_score  DECIMAL(5,2) NOT NULL,
    remarks         VARCHAR(500) NULL,
    PRIMARY KEY (score_id),
    KEY idx_score_rev (review_id),
    CONSTRAINT fk_score_rev FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 11: DISBURSEMENTS (Payment Tranches & Bank UTR Tracking)
CREATE TABLE disbursements (
    disbursement_id       BIGINT NOT NULL AUTO_INCREMENT,
    application_id        BIGINT NOT NULL,
    tranche_number        INT NOT NULL,
    amount_inr            DECIMAL(15,2) NOT NULL,
    milestone_description VARCHAR(255) NOT NULL,
    scheduled_date        DATE NOT NULL,
    disbursed_date        DATE NULL,
    payment_status        VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    utr_number            VARCHAR(50) NULL,
    disbursed_by_user_id  BIGINT NULL,
    remarks               VARCHAR(500) NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (disbursement_id),
    UNIQUE KEY uk_app_tranche (application_id, tranche_number),
    KEY idx_disb_user (disbursed_by_user_id),
    KEY idx_disb_status (payment_status),
    CONSTRAINT fk_disb_app FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE,
    CONSTRAINT fk_disb_user FOREIGN KEY (disbursed_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 12: PROGRESS_REPORTS (Milestone & Fund Utilization)
CREATE TABLE progress_reports (
    report_id           BIGINT NOT NULL AUTO_INCREMENT,
    application_id      BIGINT NOT NULL,
    report_title        VARCHAR(200) NOT NULL,
    milestone_achieved  TEXT NOT NULL,
    funds_utilized_inr  DECIMAL(15,2) NOT NULL,
    submission_date     DATE NOT NULL,
    status              VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    remarks             VARCHAR(500) NULL,
    PRIMARY KEY (report_id),
    KEY idx_rep_app (application_id),
    CONSTRAINT fk_rep_app FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 13: AUDIT_LOGS (Security Governance & Activity Feed)
CREATE TABLE audit_logs (
    log_id                BIGINT NOT NULL AUTO_INCREMENT,
    entity_name           VARCHAR(50) NOT NULL,
    entity_id             BIGINT NOT NULL,
    action                VARCHAR(50) NOT NULL,
    performed_by_user_id  BIGINT NOT NULL,
    old_state             VARCHAR(255) NULL,
    new_state             VARCHAR(255) NULL,
    details               TEXT NULL,
    action_timestamp      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (log_id),
    KEY idx_audit_user (performed_by_user_id),
    KEY idx_audit_entity (entity_name, entity_id),
    CONSTRAINT fk_audit_user FOREIGN KEY (performed_by_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA (Indian Public Sector Context, Parents before Children)
-- ============================================================================
`;

// Reuse the generated seed data from generate_seed.js
const seedGenerator = require('./generate_seed.js');

// Read generated seed_data.sql and adapt Oracle syntax to MySQL
const oracleSql = fs.readFileSync(path.join(__dirname, 'database', 'seed_data.sql'), 'utf8');

// Replace Oracle-specific functions:
// TO_DATE('YYYY-MM-DD', 'YYYY-MM-DD') -> 'YYYY-MM-DD'
// TO_TIMESTAMP('YYYY-MM-DD HH:MI:SS', 'YYYY-MM-DD HH24:MI:SS') -> 'YYYY-MM-DD HH:MI:SS'
// Lowercase table names for MySQL standard compatibility
let mysqlInserts = oracleSql
  .replace(/^SET DEFINE OFF;/m, '')
  .replace(/TO_DATE\('([^']+)',\s*'YYYY-MM-DD'\)/g, "'$1'")
  .replace(/TO_TIMESTAMP\('([^']+)',\s*'YYYY-MM-DD HH24:MI:SS'\)/g, "'$1'")
  .replace(/INSERT INTO ROLES/g, "INSERT INTO roles")
  .replace(/INSERT INTO ORGANIZATIONS/g, "INSERT INTO organizations")
  .replace(/INSERT INTO USERS/g, "INSERT INTO users")
  .replace(/INSERT INTO USER_ROLES/g, "INSERT INTO user_roles")
  .replace(/INSERT INTO GRANT_PROGRAMS/g, "INSERT INTO grant_programs")
  .replace(/INSERT INTO PROGRAM_ELIGIBILITY_CRITERIA/g, "INSERT INTO program_eligibility_criteria")
  .replace(/INSERT INTO APPLICATIONS/g, "INSERT INTO applications")
  .replace(/INSERT INTO APPLICATION_DOCUMENTS/g, "INSERT INTO application_documents")
  .replace(/INSERT INTO REVIEWS/g, "INSERT INTO reviews")
  .replace(/INSERT INTO REVIEW_SCORES/g, "INSERT INTO review_scores")
  .replace(/INSERT INTO DISBURSEMENTS/g, "INSERT INTO disbursements")
  .replace(/INSERT INTO PROGRESS_REPORTS/g, "INSERT INTO progress_reports")
  .replace(/INSERT INTO AUDIT_LOGS/g, "INSERT INTO audit_logs");

sql += mysqlInserts;

fs.writeFileSync(path.join(__dirname, 'database', 'grants_management_mysql.sql'), sql, 'utf8');
console.log('MySQL script database/grants_management_mysql.sql generated successfully.');
