-- ═══════════════════════════════════════════════════════════════
-- V25: Production Configuration
-- - Update company settings to Ripple Nexus
-- - Ensure founder admin (ashutosh.shukla@theripplenexus.com) has ADMIN role
-- - Add demo sales team for immediate exploration
--   All demo passwords: Demo@123
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Update company settings to Ripple Nexus
-- ─────────────────────────────────────────────────────────────
UPDATE settings SET value = 'Ripple Nexus'               WHERE key = 'company.name';
UPDATE settings SET value = 'https://theripplenexus.com' WHERE key = 'company.website';
UPDATE settings SET value = 'ashutosh.shukla@theripplenexus.com' WHERE key = 'company.email';
UPDATE settings SET value = 'A-116, Urbtech Trade Centre, Sector-132, Noida, UP 201304' WHERE key = 'company.address';
UPDATE settings SET value = '+91 75997 56826' WHERE key = 'company.phone';

-- ─────────────────────────────────────────────────────────────
-- Ensure founder admin has is_email_verified = true
-- (In case V18 ran before the column existed)
-- ─────────────────────────────────────────────────────────────
UPDATE users
SET is_email_verified = true,
    is_active         = true,
    updated_at        = CURRENT_TIMESTAMP
WHERE email = 'ashutosh.shukla@theripplenexus.com';

-- ─────────────────────────────────────────────────────────────
-- Ensure founder admin has ADMIN role
-- (Idempotent - INSERT ... ON CONFLICT DO NOTHING)
-- ─────────────────────────────────────────────────────────────
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'ashutosh.shukla@theripplenexus.com'
  AND r.name  = 'ADMIN'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- Ensure founder employee profile is linked to the Management dept
-- ─────────────────────────────────────────────────────────────
UPDATE employees
SET department_id = (SELECT id FROM departments WHERE name = 'Management' LIMIT 1),
    designation   = 'Founder & CEO',
    status        = 'ACTIVE',
    kyc_status    = 'VERIFIED',
    updated_at    = CURRENT_TIMESTAMP
WHERE work_email = 'ashutosh.shukla@theripplenexus.com';

-- ─────────────────────────────────────────────────────────────
-- Sample Ripple Nexus sales team (demo accounts)
-- Password for all: Demo@123
-- BCrypt hash of Demo@123 (strength 12):
-- $2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
-- ─────────────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, is_active, is_email_verified)
VALUES
    ('22222222-1000-0000-0000-000000000001',
     'priya.singh@theripplenexus.com',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
     true, true),
    ('22222222-1000-0000-0000-000000000002',
     'rahul.verma@theripplenexus.com',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
     true, true),
    ('22222222-1000-0000-0000-000000000003',
     'ankit.kumar@theripplenexus.com',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
     true, true)
ON CONFLICT (email) DO NOTHING;

-- Assign roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'priya.singh@theripplenexus.com' AND r.name = 'SALES_MANAGER'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'rahul.verma@theripplenexus.com' AND r.name = 'SALES_EMPLOYEE'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'ankit.kumar@theripplenexus.com' AND r.name = 'SALES_EMPLOYEE'
ON CONFLICT DO NOTHING;

-- Create employee profiles
INSERT INTO employees (id, user_id, employee_number, first_name, last_name,
    work_email, joining_date, status, kyc_status, department_id, designation)
SELECT
    '44444444-1000-0000-0000-000000000001',
    u.id,
    'RN-002', 'Priya', 'Singh',
    'priya.singh@theripplenexus.com',
    '2026-01-15', 'ACTIVE', 'VERIFIED',
    (SELECT id FROM departments WHERE name = 'Management' LIMIT 1),
    'Sales Manager'
FROM users u WHERE u.email = 'priya.singh@theripplenexus.com'
ON CONFLICT (employee_number) DO NOTHING;

INSERT INTO employees (id, user_id, employee_number, first_name, last_name,
    work_email, joining_date, status, kyc_status, department_id, designation)
SELECT
    '44444444-1000-0000-0000-000000000002',
    u.id,
    'RN-003', 'Rahul', 'Verma',
    'rahul.verma@theripplenexus.com',
    '2026-02-01', 'ACTIVE', 'VERIFIED',
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    'Senior Sales Executive'
FROM users u WHERE u.email = 'rahul.verma@theripplenexus.com'
ON CONFLICT (employee_number) DO NOTHING;

INSERT INTO employees (id, user_id, employee_number, first_name, last_name,
    work_email, joining_date, status, kyc_status, department_id, designation)
SELECT
    '44444444-1000-0000-0000-000000000003',
    u.id,
    'RN-004', 'Ankit', 'Kumar',
    'ankit.kumar@theripplenexus.com',
    '2026-03-01', 'ACTIVE', 'PENDING',
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    'Sales Executive'
FROM users u WHERE u.email = 'ankit.kumar@theripplenexus.com'
ON CONFLICT (employee_number) DO NOTHING;

-- Set Priya as manager of Rahul and Ankit
UPDATE employees
SET manager_id = '44444444-1000-0000-0000-000000000001'
WHERE employee_number IN ('RN-003', 'RN-004');

-- Assign standard commission plan to new sales employees
INSERT INTO employee_commission_plans (employee_id, rule_id, effective_from, is_active)
SELECT '44444444-1000-0000-0000-000000000002', id, '2026-01-01', true
FROM commission_rules WHERE name = 'Standard 10%'
ON CONFLICT DO NOTHING;

INSERT INTO employee_commission_plans (employee_id, rule_id, effective_from, is_active)
SELECT '44444444-1000-0000-0000-000000000003', id, '2026-01-01', true
FROM commission_rules WHERE name = 'Standard 10%'
ON CONFLICT DO NOTHING;
