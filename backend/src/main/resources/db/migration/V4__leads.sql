-- ═══════════════════════════════════════════════════════════════
-- V4: Leads
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE lead_status AS ENUM (
    'NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_SCHEDULED',
    'DEMO', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ON_HOLD'
);

CREATE TYPE lead_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- ─────────────────────────────────────────────────────────────
-- Lead Sources (configurable)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE lead_sources (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    is_active   BOOLEAN     NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Leads
-- ─────────────────────────────────────────────────────────────
CREATE TABLE leads (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_number         VARCHAR(30) NOT NULL UNIQUE,
    company_id          UUID        REFERENCES companies(id) ON DELETE SET NULL,
    contact_id          UUID        REFERENCES contacts(id) ON DELETE SET NULL,

    -- Lead contact info (denormalized for quick access)
    contact_name        VARCHAR(255),
    contact_designation VARCHAR(150),
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(20),
    contact_whatsapp    VARCHAR(20),
    contact_linkedin    VARCHAR(500),
    company_name        VARCHAR(255),
    company_website     VARCHAR(500),

    industry            VARCHAR(100),
    country             VARCHAR(100),
    budget              NUMERIC(15,2),
    currency            VARCHAR(10)  NOT NULL DEFAULT 'INR',
    interested_services TEXT[],
    priority            lead_priority NOT NULL DEFAULT 'MEDIUM',
    source_id           UUID         REFERENCES lead_sources(id) ON DELETE SET NULL,
    assigned_to         UUID         REFERENCES employees(id) ON DELETE SET NULL,
    icp_id              UUID         REFERENCES icps(id) ON DELETE SET NULL,
    status              lead_status  NOT NULL DEFAULT 'NEW',
    expected_close_date DATE,
    probability         INTEGER      CHECK (probability BETWEEN 0 AND 100),
    deal_value          NUMERIC(15,2),
    notes               TEXT,

    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ,
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Lead Attachments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE lead_attachments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id     UUID        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    file_name   VARCHAR(255) NOT NULL,
    file_path   VARCHAR(500) NOT NULL,
    file_size   BIGINT,
    mime_type   VARCHAR(100),
    uploaded_by UUID        REFERENCES employees(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Lead Status History (for audit trail)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE lead_status_history (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id     UUID        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    old_status  lead_status,
    new_status  lead_status NOT NULL,
    changed_by  UUID        REFERENCES employees(id),
    reason      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
