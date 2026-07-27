-- ═══════════════════════════════════════════════════════════════
-- V30: Cleanup Demo Accounts, Set Professional Alphanumeric IDs & Contract End Date
-- 1. Remove demo sales team accounts (admin@salespilot.com, manager@salespilot.com, alice, bob)
-- 2. Update test accounts to info@theripplenexus.com (using plus addressing for database uniqueness)
-- 3. Assign professional alphanumeric employee numbers (e.g. SP-8K2A9M)
-- 4. Add contract_end_date column to employees table for minimum lock-in periods
-- ═══════════════════════════════════════════════════════════════

-- 1. Add contract_end_date to employees table if not exists
ALTER TABLE employees ADD COLUMN IF NOT EXISTS contract_end_date DATE;

-- 2. Delete demo accounts and any associated leads/deals/commissions
DO $$
DECLARE
    demo_emails TEXT[] := ARRAY[
        'admin@salespilot.com', 
        'manager@salespilot.com', 
        'alice@salespilot.com', 
        'bob@salespilot.com'
    ];
    demo_email TEXT;
    target_user_id UUID;
    target_emp_id UUID;
BEGIN
    FOREACH demo_email IN ARRAY demo_emails
    LOOP
        SELECT id INTO target_user_id FROM users WHERE email = demo_email;
        SELECT id INTO target_emp_id FROM employees WHERE work_email = demo_email OR user_id = target_user_id;

        IF target_emp_id IS NOT NULL THEN
            DELETE FROM lead_activities WHERE created_by = target_user_id;
            DELETE FROM deal_activities WHERE created_by = target_user_id;
            DELETE FROM commissions WHERE employee_id = target_emp_id;
            DELETE FROM payouts WHERE employee_id = target_emp_id;
            DELETE FROM employee_commission_plans WHERE employee_id = target_emp_id;
            DELETE FROM employee_incentives WHERE employee_id = target_emp_id;
            DELETE FROM deals WHERE assigned_to = target_emp_id;
            DELETE FROM leads WHERE assigned_to = target_emp_id;
            DELETE FROM employees WHERE id = target_emp_id;
        END IF;

        IF target_user_id IS NOT NULL THEN
            DELETE FROM user_roles WHERE user_id = target_user_id;
            DELETE FROM users WHERE id = target_user_id;
        END IF;
    END LOOP;
END $$;

-- 3. Update test accounts emails to info@theripplenexus.com (using plus addressing to satisfy UNIQUE constraints)
UPDATE users SET email = 'info+priya@theripplenexus.com' WHERE email = 'priya.singh@theripplenexus.com';
UPDATE employees SET work_email = 'info+priya@theripplenexus.com', personal_email = 'info+priya@theripplenexus.com' WHERE work_email = 'priya.singh@theripplenexus.com' OR personal_email = 'priya.singh@theripplenexus.com';

UPDATE users SET email = 'info+rahul@theripplenexus.com' WHERE email = 'rahul.verma@theripplenexus.com';
UPDATE employees SET work_email = 'info+rahul@theripplenexus.com', personal_email = 'info+rahul@theripplenexus.com' WHERE work_email = 'rahul.verma@theripplenexus.com' OR personal_email = 'rahul.verma@theripplenexus.com';

UPDATE users SET email = 'info+ankit@theripplenexus.com' WHERE email = 'ankit.kumar@theripplenexus.com';
UPDATE employees SET work_email = 'info+ankit@theripplenexus.com', personal_email = 'info+ankit@theripplenexus.com' WHERE work_email = 'ankit.kumar@theripplenexus.com' OR personal_email = 'ankit.kumar@theripplenexus.com';

-- 4. Update employee numbers to professional alphanumeric IDs
UPDATE employees SET employee_number = 'SP-100CEO' WHERE work_email = 'ashutosh.shukla@theripplenexus.com' OR employee_number = 'RN-001';
UPDATE employees SET employee_number = 'SP-8K2A9M' WHERE work_email LIKE '%priya@theripplenexus.com%' OR employee_number = 'EMP-202601-0003';
UPDATE employees SET employee_number = 'SP-7X4B2L' WHERE work_email LIKE '%rahul@theripplenexus.com%' OR employee_number = 'EMP-202601-0004';
UPDATE employees SET employee_number = 'SP-9V5C1R' WHERE work_email LIKE '%ankit@theripplenexus.com%' OR employee_number = 'EMP-202602-0003';
