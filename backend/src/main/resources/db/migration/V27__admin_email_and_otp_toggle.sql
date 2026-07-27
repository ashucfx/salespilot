-- ═══════════════════════════════════════════════════════════════
-- V27: Add per-user OTP toggle + set real admin email
-- ═══════════════════════════════════════════════════════════════

-- 1. Add otp_enabled flag (default true for security, can be disabled per user)
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_enabled BOOLEAN NOT NULL DEFAULT true;

-- 2. Disable OTP for the founder/admin account so they can log in directly
--    OTP is bypassed; JWT is still required — security is maintained
UPDATE users
SET otp_enabled = false,
    is_active   = true,
    is_email_verified = true,
    updated_at  = CURRENT_TIMESTAMP
WHERE email = 'ashutosh.shukla@theripplenexus.com';

-- 3. Also ensure the old seed admin has OTP disabled for convenience
UPDATE users
SET otp_enabled = false,
    updated_at  = CURRENT_TIMESTAMP
WHERE email = 'admin@salespilot.com';
