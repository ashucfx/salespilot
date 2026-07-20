-- ═══════════════════════════════════════════════════════════════
-- V15: International KYC
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

-- Rename columns to be generic for international users
ALTER TABLE employees RENAME COLUMN pan_number TO national_id;

-- Drop Aadhaar as we are using a generic national_id
ALTER TABLE employees DROP COLUMN IF EXISTS aadhar_number;

-- Add new columns for International KYC and Retry Logic
ALTER TABLE employees ADD COLUMN country_of_id VARCHAR(100);
ALTER TABLE employees ADD COLUMN kyc_document_path VARCHAR(500);
ALTER TABLE employees ADD COLUMN kyc_attempts INT DEFAULT 0;

-- We need to update the kyc_status ENUM, but PostgreSQL ENUM types cannot have values removed.
-- We can just rely on the VARCHAR column we used in V14, but wait...
-- In V14 we added `kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'`.
-- Wait! In V2__employees.sql there was NO kyc_status! BUT there might be `Employee.KycStatus` enum mapped.
-- Since `kyc_status` in V14 is a VARCHAR, we can easily store 'FROZEN', 'CLARIFICATION_NEEDED', 'VERIFIED' without DDL changes for the column itself.
