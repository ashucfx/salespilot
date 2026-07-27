-- ═══════════════════════════════════════════════════════════════
-- V29: Restore Test Team, Verify All KYC, & Assign Roles
-- All demo/test account passwords are: Demo@123
-- ═══════════════════════════════════════════════════════════════

-- 1. Ensure required departments exist
INSERT INTO departments (id, name, description, created_at, updated_at)
VALUES 
    ('11111111-1000-0000-0000-000000000001', 'Management', 'Executive Management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1000-0000-0000-000000000002', 'Sales', 'Global Sales Team', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- 2. Ensure all required roles exist
INSERT INTO roles (id, name, description, is_system, created_at, updated_at)
VALUES 
    ('33333333-1000-0000-0000-000000000001', 'ADMIN', 'Administrator with full system access', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-1000-0000-0000-000000000002', 'SALES_MANAGER', 'Sales Manager with team oversight', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-1000-0000-0000-000000000003', 'SALES_EXEC', 'Sales Executive managing assigned leads', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-1000-0000-0000-000000000004', 'SALES_EMPLOYEE', 'Legacy sales employee role', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- 3. Create or restore users (Password: Demo@123 -> $2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.)
INSERT INTO users (id, email, password_hash, is_active, is_email_verified, created_at, updated_at)
VALUES
    ('22222222-1000-0000-0000-000000000001', 'priya.singh@theripplenexus.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('22222222-1000-0000-0000-000000000002', 'rahul.verma@theripplenexus.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('22222222-1000-0000-0000-000000000003', 'ankit.kumar@theripplenexus.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE SET 
    is_active = true,
    is_email_verified = true,
    password_hash = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    updated_at = CURRENT_TIMESTAMP;

-- 4. Assign Roles to users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'priya.singh@theripplenexus.com' AND r.name IN ('SALES_MANAGER', 'SALES_EXEC')
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'rahul.verma@theripplenexus.com' AND r.name IN ('SALES_EXEC', 'SALES_EMPLOYEE')
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'ankit.kumar@theripplenexus.com' AND r.name IN ('SALES_EXEC', 'SALES_EMPLOYEE')
ON CONFLICT DO NOTHING;

-- 5. Create or update employee profiles
INSERT INTO employees (id, user_id, employee_number, first_name, last_name, work_email, joining_date, status, kyc_status, department_id, designation, created_at, updated_at)
SELECT 
    '44444444-1000-0000-0000-000000000001', u.id, 'RN-002', 'Priya', 'Singh', 'priya.singh@theripplenexus.com', '2026-01-15', 'ACTIVE', 'VERIFIED',
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1), 'Sales Manager', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'priya.singh@theripplenexus.com'
ON CONFLICT (work_email) DO UPDATE SET 
    status = 'ACTIVE', kyc_status = 'VERIFIED', designation = 'Sales Manager',
    department_id = (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1), updated_at = CURRENT_TIMESTAMP;

INSERT INTO employees (id, user_id, employee_number, first_name, last_name, work_email, joining_date, status, kyc_status, department_id, designation, created_at, updated_at)
SELECT 
    '44444444-1000-0000-0000-000000000002', u.id, 'RN-003', 'Rahul', 'Verma', 'rahul.verma@theripplenexus.com', '2026-02-01', 'ACTIVE', 'VERIFIED',
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1), 'Senior Sales Executive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'rahul.verma@theripplenexus.com'
ON CONFLICT (work_email) DO UPDATE SET 
    status = 'ACTIVE', kyc_status = 'VERIFIED', designation = 'Senior Sales Executive',
    department_id = (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1), updated_at = CURRENT_TIMESTAMP;

INSERT INTO employees (id, user_id, employee_number, first_name, last_name, work_email, joining_date, status, kyc_status, department_id, designation, created_at, updated_at)
SELECT 
    '44444444-1000-0000-0000-000000000003', u.id, 'RN-004', 'Ankit', 'Kumar', 'ankit.kumar@theripplenexus.com', '2026-03-10', 'ACTIVE', 'VERIFIED',
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1), 'Sales Executive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ankit.kumar@theripplenexus.com'
ON CONFLICT (work_email) DO UPDATE SET 
    status = 'ACTIVE', kyc_status = 'VERIFIED', designation = 'Senior Sales Executive',
    department_id = (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1), updated_at = CURRENT_TIMESTAMP;

-- 6. Guarantee ALL employees in the system are KYC Verified and Active for seamless frontend/backend testing
UPDATE employees 
SET kyc_status = 'VERIFIED',
    status = 'ACTIVE',
    updated_at = CURRENT_TIMESTAMP
WHERE kyc_status IS DISTINCT FROM 'VERIFIED' OR status IS DISTINCT FROM 'ACTIVE';

-- 7. Ensure all users in system have active status and verified email
UPDATE users 
SET is_active = true,
    is_email_verified = true,
    updated_at = CURRENT_TIMESTAMP
WHERE is_active IS DISTINCT FROM true OR is_email_verified IS DISTINCT FROM true;
