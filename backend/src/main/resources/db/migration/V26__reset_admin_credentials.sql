-- ═══════════════════════════════════════════════════════════════
-- V26: Explicit Admin Credentials & Password Sync
-- Reset ashutosh.shukla@theripplenexus.com password to RippleNexus2024$
-- ═══════════════════════════════════════════════════════════════

UPDATE users
SET password_hash      = '$2a$12$1iHSCemc4S9CT3ek6MojX.YD1/60IDNg0Fz55ThmLnHMsreEk.kX2', -- RippleNexus2024$
    is_active          = true,
    is_email_verified  = true,
    updated_at         = CURRENT_TIMESTAMP
WHERE email = 'ashutosh.shukla@theripplenexus.com';
