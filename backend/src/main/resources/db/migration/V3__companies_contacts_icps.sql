-- ═══════════════════════════════════════════════════════════════
-- V3: Companies, Contacts & ICPs
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Companies
-- ─────────────────────────────────────────────────────────────
CREATE TABLE companies (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    industry        VARCHAR(100),
    website         VARCHAR(500),
    country         VARCHAR(100),
    city            VARCHAR(100),
    address         TEXT,
    annual_revenue  NUMERIC(15,2),
    employee_count  INTEGER,
    gst_number      VARCHAR(50),
    tax_number      VARCHAR(50),
    linkedin_url    VARCHAR(500),
    description     TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Contacts
-- ─────────────────────────────────────────────────────────────
CREATE TABLE contacts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id      UUID        REFERENCES companies(id) ON DELETE SET NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100),
    designation     VARCHAR(150),
    email           VARCHAR(255),
    phone           VARCHAR(20),
    whatsapp        VARCHAR(20),
    linkedin_url    VARCHAR(500),
    country         VARCHAR(100),
    city            VARCHAR(100),
    is_decision_maker BOOLEAN   NOT NULL DEFAULT false,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- ICPs (Ideal Customer Profiles)
-- ─────────────────────────────────────────────────────────────
CREATE TYPE icp_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TABLE icps (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    industry        VARCHAR(100),
    company_size_min INTEGER,
    company_size_max INTEGER,
    revenue_min     NUMERIC(15,2),
    revenue_max     NUMERIC(15,2),
    decision_makers TEXT[],
    pain_points     TEXT[],
    interested_services TEXT[],
    priority        icp_priority NOT NULL DEFAULT 'MEDIUM',
    description     TEXT,
    is_active       BOOLEAN     NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- ICP Countries
-- ─────────────────────────────────────────────────────────────
CREATE TABLE icp_countries (
    icp_id  UUID NOT NULL REFERENCES icps(id) ON DELETE CASCADE,
    country VARCHAR(100) NOT NULL,
    PRIMARY KEY (icp_id, country)
);
