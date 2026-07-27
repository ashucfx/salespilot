-- ═══════════════════════════════════════════════════════════════
-- V28: Fix Founder Admin Employee Profile & Cleanup Demo Data
-- 1. Create employee record for ashutosh.shukla@theripplenexus.com if missing
-- 2. Delete demo sales team accounts and any sample deals/leads
-- ═══════════════════════════════════════════════════════════════

-- 1. Ensure Founder Admin has an Employee profile
DO $$
DECLARE
    admin_user_id UUID;
    admin_emp_id UUID := gen_random_uuid();
    mgmt_dept_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE email = 'ashutosh.shukla@theripplenexus.com' LIMIT 1;
    SELECT id INTO mgmt_dept_id FROM departments WHERE name = 'Management' LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM employees WHERE user_id = admin_user_id OR work_email = 'ashutosh.shukla@theripplenexus.com') THEN
            INSERT INTO employees (
                id, user_id, employee_number, first_name, last_name, 
                work_email, designation, status, kyc_status, joining_date, created_at, updated_at,
                department_id
            ) VALUES (
                admin_emp_id,
                admin_user_id,
                'RN-001',
                'Ashutosh',
                'Shukla',
                'ashutosh.shukla@theripplenexus.com',
                'Founder & CEO',
                'ACTIVE',
                'VERIFIED',
                CURRENT_DATE,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                mgmt_dept_id
            );
        ELSE
            UPDATE employees
            SET user_id = admin_user_id,
                designation = 'Founder & CEO',
                status = 'ACTIVE',
                kyc_status = 'VERIFIED',
                department_id = mgmt_dept_id,
                updated_at = CURRENT_TIMESTAMP
            WHERE work_email = 'ashutosh.shukla@theripplenexus.com' OR user_id = admin_user_id;
        END IF;
    END IF;
END $$;

-- 2. Cleanup demo accounts and associated data
DO $$
DECLARE
    demo_emails TEXT[] := ARRAY['priya.singh@theripplenexus.com', 'rahul.verma@theripplenexus.com', 'ankit.kumar@theripplenexus.com', 'demo@theripplenexus.com'];
BEGIN
    -- Delete commission plans
    DELETE FROM employee_commission_plans WHERE employee_id IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    -- Delete collections
    DELETE FROM employee_territories WHERE employee_id IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    DELETE FROM employee_industries WHERE employee_id IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    DELETE FROM employee_services WHERE employee_id IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    -- Delete deals & leads associated with demo employees
    DELETE FROM deals WHERE employee_id IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    DELETE FROM lead_attachments WHERE lead_id IN (
        SELECT id FROM leads WHERE assigned_to IN (
            SELECT id FROM employees WHERE work_email = ANY(demo_emails)
        )
    );
    DELETE FROM lead_interested_services WHERE lead_id IN (
        SELECT id FROM leads WHERE assigned_to IN (
            SELECT id FROM employees WHERE work_email = ANY(demo_emails)
        )
    );
    DELETE FROM leads WHERE assigned_to IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    DELETE FROM meetings WHERE organizer_id IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    -- Unset manager_id references
    UPDATE employees SET manager_id = NULL WHERE manager_id IN (
        SELECT id FROM employees WHERE work_email = ANY(demo_emails)
    );
    -- Delete demo employees and users
    DELETE FROM employees WHERE work_email = ANY(demo_emails);
    DELETE FROM user_roles WHERE user_id IN (
        SELECT id FROM users WHERE email = ANY(demo_emails)
    );
    DELETE FROM users WHERE email = ANY(demo_emails);
END $$;
