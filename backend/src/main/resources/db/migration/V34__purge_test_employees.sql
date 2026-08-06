-- Soft delete any employees that appear to be test accounts
UPDATE employees 
SET deleted_at = CURRENT_TIMESTAMP 
WHERE (first_name ILIKE '%test%' 
   OR last_name ILIKE '%test%' 
   OR work_email ILIKE '%test%'
   OR work_email ILIKE '%demo%')
  AND deleted_at IS NULL;

-- Soft delete corresponding users
UPDATE users
SET deleted_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT user_id FROM employees 
    WHERE (first_name ILIKE '%test%' 
       OR last_name ILIKE '%test%' 
       OR work_email ILIKE '%test%'
       OR work_email ILIKE '%demo%')
)
AND deleted_at IS NULL;
