-- Create the Founder Admin User (Production Ready)
DO $$
DECLARE
    founder_user_id UUID := gen_random_uuid();
    founder_employee_id UUID := gen_random_uuid();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'ashutosh.shukla@theripplenexus.com') THEN
        
        -- 1. Insert into Users
        INSERT INTO users (id, email, password_hash, is_active, created_at, updated_at)
        VALUES (
            founder_user_id,
            'ashutosh.shukla@theripplenexus.com',
            '$2a$12$1iHSCemc4S9CT3ek6MojX.YD1/60IDNg0Fz55ThmLnHMsreEk.kX2', -- RippleNexus2024$
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );

        -- 2. Assign ADMIN role
        INSERT INTO user_roles (user_id, role_id)
        SELECT founder_user_id, id FROM roles WHERE name = 'ADMIN';

        -- 3. Create Employee profile
        INSERT INTO employees (
            id, user_id, employee_number, first_name, last_name, 
            work_email, designation, status, kyc_status, joining_date, created_at, updated_at
        ) VALUES (
            founder_employee_id,
            founder_user_id,
            'RN-001',
            'Ashutosh',
            'Shukla',
            'ashutosh.shukla@theripplenexus.com',
            'Founder & CEO',
            'ACTIVE',
            'VERIFIED',
            CURRENT_DATE,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
        
    END IF;
END $$;
