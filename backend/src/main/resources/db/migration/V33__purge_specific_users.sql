-- Purge specific duplicate testing emails
-- Must delete employees first due to FK constraint employees_user_id_fkey -> users
UPDATE employees
SET deleted_at = NOW()
WHERE email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com')
   OR work_email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com');

UPDATE users
SET deleted_at = NOW()
WHERE email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com');

