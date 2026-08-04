-- ═══════════════════════════════════════════════════════════════
-- V14: Fix Unique Constraints for Soft Deletes
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

-- Users table: Drop the original UNIQUE constraint on email
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Add a partial unique index that only applies to non-deleted records
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE deleted_at IS NULL;

-- Employees table: Drop the original UNIQUE constraint on work_email and employee_number
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_work_email_key;
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_employee_number_key;

-- Add partial unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_work_email_unique ON employees(work_email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_employee_number_unique ON employees(employee_number) WHERE deleted_at IS NULL;

-- Leads table: Drop original UNIQUE constraint on lead_number
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_lead_number_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_lead_number_unique ON leads(lead_number) WHERE deleted_at IS NULL;
