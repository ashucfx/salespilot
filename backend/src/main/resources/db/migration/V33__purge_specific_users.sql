-- Purge specific duplicate testing emails
-- Must delete employees first due to FK constraint employees_user_id_fkey -> users
-- employees table uses work_email and personal_email (no 'email' column)
UPDATE employees
SET deleted_at = NOW()
WHERE work_email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com')
   OR personal_email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com');

-- users table has 'email' column
UPDATE users
SET deleted_at = NOW()
WHERE email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com');


