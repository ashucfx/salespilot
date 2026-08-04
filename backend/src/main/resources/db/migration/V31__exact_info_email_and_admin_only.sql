-- ═══════════════════════════════════════════════════════════════
-- V31: Enforce Sole Admin and Exact Test Account Email (info@theripplenexus.com)
-- 1. Remove extra test accounts (info+rahul, info+ankit, etc.)
-- 2. Update remaining test account to exactly info@theripplenexus.com
-- 3. Ensure only ashutosh.shukla@theripplenexus.com has Admin rights
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
    target_user_id UUID;
    target_emp_id UUID;
    extra_email TEXT;
BEGIN
    -- Loop through any users/employees that are not our primary admin and not our primary test employee
    FOR extra_email IN 
        SELECT DISTINCT email FROM users 
        WHERE email NOT IN ('ashutosh.shukla@theripplenexus.com', 'info@theripplenexus.com', 'info+priya@theripplenexus.com', 'priya.singh@theripplenexus.com')
        UNION
        SELECT DISTINCT work_email FROM employees 
        WHERE work_email NOT IN ('ashutosh.shukla@theripplenexus.com', 'info@theripplenexus.com', 'info+priya@theripplenexus.com', 'priya.singh@theripplenexus.com')
    LOOP
        SELECT id INTO target_user_id FROM users WHERE email = extra_email LIMIT 1;
        SELECT id INTO target_emp_id FROM employees WHERE work_email = extra_email OR (target_user_id IS NOT NULL AND user_id = target_user_id) LIMIT 1;

        IF target_emp_id IS NOT NULL THEN
            DELETE FROM activity_attachments WHERE activity_id IN (SELECT id FROM activities WHERE performed_by = target_emp_id);
            DELETE FROM activities WHERE performed_by = target_emp_id;
            DELETE FROM payments WHERE deal_id IN (SELECT id FROM deals WHERE employee_id = target_emp_id);
            DELETE FROM commissions WHERE employee_id = target_emp_id OR approved_by = target_emp_id OR paid_by = target_emp_id;
            DELETE FROM payouts WHERE employee_id = target_emp_id;
            DELETE FROM employee_commission_plans WHERE employee_id = target_emp_id;
            DELETE FROM employee_incentives WHERE employee_id = target_emp_id;
            DELETE FROM deals WHERE employee_id = target_emp_id;
            DELETE FROM lead_attachments WHERE uploaded_by = target_emp_id;
            DELETE FROM lead_status_history WHERE changed_by = target_emp_id;
            DELETE FROM leads WHERE assigned_to = target_emp_id;
            DELETE FROM task_comments WHERE author_id = target_emp_id;
            DELETE FROM task_attachments WHERE task_id IN (SELECT id FROM tasks WHERE assigned_by = target_emp_id OR assigned_to = target_emp_id);
            DELETE FROM tasks WHERE assigned_by = target_emp_id OR assigned_to = target_emp_id;
            DELETE FROM meetings WHERE organizer_id = target_emp_id;
            DELETE FROM pipeline_stage_history WHERE moved_by = target_emp_id;
            DELETE FROM proposals WHERE uploaded_by = target_emp_id OR approved_by = target_emp_id;
            UPDATE employees SET manager_id = NULL WHERE manager_id = target_emp_id;
            DELETE FROM employees WHERE id = target_emp_id;
        END IF;

        IF target_user_id IS NOT NULL THEN
            DELETE FROM user_roles WHERE user_id = target_user_id;
            DELETE FROM refresh_tokens WHERE user_id = target_user_id;
            DELETE FROM device_sessions WHERE user_id = target_user_id;
            DELETE FROM users WHERE id = target_user_id;
        END IF;
    END LOOP;
END $$;

-- Update remaining test employee to EXACTLY info@theripplenexus.com
UPDATE users SET email = 'info@theripplenexus.com' WHERE email IN ('info+priya@theripplenexus.com', 'priya.singh@theripplenexus.com');
UPDATE employees SET work_email = 'info@theripplenexus.com', personal_email = 'info@theripplenexus.com' WHERE work_email IN ('info+priya@theripplenexus.com', 'priya.singh@theripplenexus.com') OR personal_email IN ('info+priya@theripplenexus.com', 'priya.singh@theripplenexus.com');

-- Enforce ONLY ashutosh.shukla@theripplenexus.com has ROLE_ADMIN
DELETE FROM user_roles 
WHERE role_id IN (SELECT id FROM roles WHERE name = 'ROLE_ADMIN') 
  AND user_id NOT IN (SELECT id FROM users WHERE email = 'ashutosh.shukla@theripplenexus.com');
