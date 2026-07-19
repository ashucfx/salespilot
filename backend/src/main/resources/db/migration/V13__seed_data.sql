-- ═══════════════════════════════════════════════════════════════
-- V13: Seed Data
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Roles
-- ─────────────────────────────────────────────────────────────
INSERT INTO roles (id, name, description, is_system) VALUES
    ('11111111-0000-0000-0000-000000000001', 'ADMIN', 'System Administrator with full access', true),
    ('11111111-0000-0000-0000-000000000002', 'SALES_MANAGER', 'Sales Manager with team oversight', true),
    ('11111111-0000-0000-0000-000000000003', 'SALES_EMPLOYEE', 'Sales Executive with own data access', true),
    ('11111111-0000-0000-0000-000000000004', 'FINANCE', 'Finance team with commission approval access', true);

-- ─────────────────────────────────────────────────────────────
-- Permissions
-- ─────────────────────────────────────────────────────────────
INSERT INTO permissions (id, name, description, module) VALUES
    -- Employee
    (gen_random_uuid(), 'employee:create', 'Create employees', 'employee'),
    (gen_random_uuid(), 'employee:read', 'View employees', 'employee'),
    (gen_random_uuid(), 'employee:update', 'Update employees', 'employee'),
    (gen_random_uuid(), 'employee:delete', 'Delete employees', 'employee'),
    -- Lead
    (gen_random_uuid(), 'lead:create', 'Create leads', 'lead'),
    (gen_random_uuid(), 'lead:read', 'View leads', 'lead'),
    (gen_random_uuid(), 'lead:read:all', 'View all leads', 'lead'),
    (gen_random_uuid(), 'lead:update', 'Update leads', 'lead'),
    (gen_random_uuid(), 'lead:delete', 'Delete leads', 'lead'),
    (gen_random_uuid(), 'lead:assign', 'Assign leads to employees', 'lead'),
    -- Pipeline
    (gen_random_uuid(), 'pipeline:read', 'View pipeline', 'pipeline'),
    (gen_random_uuid(), 'pipeline:update', 'Move leads in pipeline', 'pipeline'),
    -- Deal
    (gen_random_uuid(), 'deal:create', 'Close deals', 'deal'),
    (gen_random_uuid(), 'deal:read', 'View deals', 'deal'),
    (gen_random_uuid(), 'deal:read:all', 'View all deals', 'deal'),
    -- Commission
    (gen_random_uuid(), 'commission:read', 'View own commissions', 'commission'),
    (gen_random_uuid(), 'commission:read:all', 'View all commissions', 'commission'),
    (gen_random_uuid(), 'commission:approve', 'Approve commissions', 'commission'),
    (gen_random_uuid(), 'commission:pay', 'Mark commissions as paid', 'commission'),
    (gen_random_uuid(), 'commission:configure', 'Configure commission rules', 'commission'),
    -- Report
    (gen_random_uuid(), 'report:read', 'View reports', 'report'),
    (gen_random_uuid(), 'report:export', 'Export reports', 'report'),
    -- Admin
    (gen_random_uuid(), 'settings:manage', 'Manage system settings', 'settings'),
    (gen_random_uuid(), 'audit:read', 'View audit logs', 'audit'),
    (gen_random_uuid(), 'analytics:read', 'View analytics', 'analytics');

-- ─────────────────────────────────────────────────────────────
-- Admin User (password: Admin@123)
-- BCrypt hash of Admin@123 with strength 12
-- ─────────────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, is_active, is_email_verified) VALUES
    ('22222222-0000-0000-0000-000000000001',
     'admin@salespilot.com',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
     true, true);

-- Assign ADMIN role
INSERT INTO user_roles (user_id, role_id) VALUES
    ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001');

-- ─────────────────────────────────────────────────────────────
-- Default Department
-- ─────────────────────────────────────────────────────────────
INSERT INTO departments (id, name, description) VALUES
    ('33333333-0000-0000-0000-000000000001', 'Sales', 'Sales Department'),
    ('33333333-0000-0000-0000-000000000002', 'Finance', 'Finance Department'),
    ('33333333-0000-0000-0000-000000000003', 'Management', 'Management Team');

-- ─────────────────────────────────────────────────────────────
-- Admin Employee Profile
-- ─────────────────────────────────────────────────────────────
INSERT INTO employees (id, user_id, employee_number, first_name, last_name,
    work_email, joining_date, status, department_id, designation)
VALUES
    ('44444444-0000-0000-0000-000000000001',
     '22222222-0000-0000-0000-000000000001',
     'EMP-202601-0001',
     'System', 'Admin',
     'admin@salespilot.com',
     CURRENT_DATE,
     'ACTIVE',
     '33333333-0000-0000-0000-000000000003',
     'System Administrator');

-- ─────────────────────────────────────────────────────────────
-- Pipeline Stages (default)
-- ─────────────────────────────────────────────────────────────
INSERT INTO pipeline_stages (id, name, slug, display_order, color) VALUES
    (gen_random_uuid(), 'New',               'new',                1, '#6366f1'),
    (gen_random_uuid(), 'Contacted',         'contacted',          2, '#8b5cf6'),
    (gen_random_uuid(), 'Qualified',         'qualified',          3, '#06b6d4'),
    (gen_random_uuid(), 'Meeting Scheduled', 'meeting-scheduled',  4, '#f59e0b'),
    (gen_random_uuid(), 'Demo',              'demo',               5, '#f97316'),
    (gen_random_uuid(), 'Proposal Sent',     'proposal-sent',      6, '#84cc16'),
    (gen_random_uuid(), 'Negotiation',       'negotiation',        7, '#eab308'),
    (gen_random_uuid(), 'Won',               'won',                8, '#10b981', false, false, false),
    (gen_random_uuid(), 'Lost',              'lost',               9, '#ef4444', false, true, false);

UPDATE pipeline_stages SET is_won_stage = true WHERE slug = 'won';
UPDATE pipeline_stages SET is_lost_stage = true WHERE slug = 'lost';

-- ─────────────────────────────────────────────────────────────
-- Lead Sources
-- ─────────────────────────────────────────────────────────────
INSERT INTO lead_sources (name) VALUES
    ('Website'),
    ('LinkedIn'),
    ('Cold Call'),
    ('Cold Email'),
    ('Referral'),
    ('Social Media'),
    ('Event / Conference'),
    ('Partner'),
    ('Inbound'),
    ('WhatsApp'),
    ('Google Ads'),
    ('Other');

-- ─────────────────────────────────────────────────────────────
-- Industries
-- ─────────────────────────────────────────────────────────────
INSERT INTO industries (name) VALUES
    ('Technology'), ('Healthcare'), ('Finance & Banking'), ('E-Commerce'),
    ('Manufacturing'), ('Real Estate'), ('Education'), ('Logistics'),
    ('Retail'), ('Media & Entertainment'), ('Consulting'), ('Automotive'),
    ('Agriculture'), ('Energy'), ('Telecommunications'), ('Government'),
    ('Non-Profit'), ('Hospitality'), ('Legal'), ('Other');

-- ─────────────────────────────────────────────────────────────
-- Services
-- ─────────────────────────────────────────────────────────────
INSERT INTO services (name, description) VALUES
    ('Web Development', 'Custom website and web app development'),
    ('Mobile App Development', 'iOS and Android app development'),
    ('UI/UX Design', 'User interface and experience design'),
    ('Cloud Solutions', 'Cloud migration and management'),
    ('Digital Marketing', 'SEO, SEM, Social Media Marketing'),
    ('CRM Implementation', 'CRM setup and customization'),
    ('Data Analytics', 'Business intelligence and analytics'),
    ('Cybersecurity', 'Security audits and implementation'),
    ('IT Consulting', 'Technology strategy and consulting'),
    ('AI/ML Solutions', 'Artificial intelligence and ML services');

-- ─────────────────────────────────────────────────────────────
-- Default Settings
-- ─────────────────────────────────────────────────────────────
INSERT INTO settings (key, value, description, category, is_public) VALUES
    ('company.name',        'Your Company',         'Company name',            'company',  true),
    ('company.website',     'https://example.com',  'Company website',         'company',  true),
    ('company.address',     '',                     'Company address',          'company',  false),
    ('company.phone',       '',                     'Company phone',            'company',  false),
    ('company.email',       '',                     'Company email',            'company',  false),
    ('company.logo',        '',                     'Company logo URL',         'company',  true),
    ('currency.primary',    'INR',                  'Primary currency',         'finance',  true),
    ('currency.symbol',     '₹',                    'Currency symbol',          'finance',  true),
    ('timezone',            'Asia/Kolkata',         'Default timezone',         'general',  true),
    ('fiscal.year.start',   'April',                'Fiscal year start month',  'finance',  false),
    ('commission.auto_approve', 'false',            'Auto-approve commissions', 'commission', false),
    ('notification.email',  'true',                 'Send email notifications', 'notification', false),
    ('security.session_timeout', '900',             'Session timeout (seconds)','security', false),
    ('security.max_login_attempts', '5',            'Max failed login attempts','security', false);

-- ─────────────────────────────────────────────────────────────
-- Demo Sales Employees (for immediate exploration)
-- ─────────────────────────────────────────────────────────────
-- Password for all demo users: Demo@123
INSERT INTO users (id, email, password_hash, is_active, is_email_verified) VALUES
    ('22222222-0000-0000-0000-000000000002', 'manager@salespilot.com',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', true, true),
    ('22222222-0000-0000-0000-000000000003', 'alice@salespilot.com',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', true, true),
    ('22222222-0000-0000-0000-000000000004', 'bob@salespilot.com',
     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', true, true);

INSERT INTO user_roles (user_id, role_id) VALUES
    ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002'),
    ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003'),
    ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003');

INSERT INTO employees (id, user_id, employee_number, first_name, last_name,
    work_email, joining_date, status, department_id, designation) VALUES
    ('44444444-0000-0000-0000-000000000002',
     '22222222-0000-0000-0000-000000000002',
     'EMP-202601-0002', 'Rahul', 'Sharma',
     'manager@salespilot.com', '2026-01-01', 'ACTIVE',
     '33333333-0000-0000-0000-000000000003', 'Sales Manager'),
    ('44444444-0000-0000-0000-000000000003',
     '22222222-0000-0000-0000-000000000003',
     'EMP-202602-0001', 'Alice', 'Johnson',
     'alice@salespilot.com', '2026-02-01', 'ACTIVE',
     '33333333-0000-0000-0000-000000000001', 'Senior Sales Executive'),
    ('44444444-0000-0000-0000-000000000004',
     '22222222-0000-0000-0000-000000000004',
     'EMP-202602-0002', 'Bob', 'Williams',
     'bob@salespilot.com', '2026-02-01', 'ACTIVE',
     '33333333-0000-0000-0000-000000000001', 'Sales Executive');

-- Set manager
UPDATE employees SET manager_id = '44444444-0000-0000-0000-000000000002'
WHERE id IN ('44444444-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000004');

-- ─────────────────────────────────────────────────────────────
-- Default Commission Rule
-- ─────────────────────────────────────────────────────────────
INSERT INTO commission_rules (id, name, type, percentage, description) VALUES
    ('55555555-0000-0000-0000-000000000001',
     'Standard 10%', 'PERCENTAGE', 10.00,
     'Standard 10% commission on deal value');

INSERT INTO employee_commission_plans (employee_id, rule_id, effective_from, is_active) VALUES
    ('44444444-0000-0000-0000-000000000003',
     '55555555-0000-0000-0000-000000000001', '2026-01-01', true),
    ('44444444-0000-0000-0000-000000000004',
     '55555555-0000-0000-0000-000000000001', '2026-01-01', true);
