-- ═══════════════════════════════════════════════════════════════
-- V11: Settings
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- App Settings (key-value store)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE settings (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT,
    description TEXT,
    category    VARCHAR(50)  NOT NULL DEFAULT 'general',
    is_public   BOOLEAN      NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_by  VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Industries (configurable master data)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE industries (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    is_active   BOOLEAN     NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Services (configurable master data)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE services (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
