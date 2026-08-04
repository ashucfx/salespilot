-- Purge specific duplicate testing emails
DELETE FROM users WHERE email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com');
DELETE FROM employees WHERE email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com') OR work_email IN ('ashutosh6471@gmail.com', 'ashutoshshukla05432@gmail.com');
