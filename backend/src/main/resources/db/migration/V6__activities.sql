-- ═══════════════════════════════════════════════════════════════
-- V6: Activities (Timeline)
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE activity_type AS ENUM (
    'NOTE', 'CALL', 'EMAIL', 'MEETING', 'TASK', 'FILE',
    'STATUS_CHANGE', 'ASSIGNMENT', 'FOLLOW_UP', 'DEAL_CLOSED',
    'PROPOSAL_SENT', 'QUOTATION_SENT', 'COMMENT', 'OTHER'
);

-- ─────────────────────────────────────────────────────────────
-- Activities
-- ─────────────────────────────────────────────────────────────
CREATE TABLE activities (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id         UUID            REFERENCES leads(id) ON DELETE CASCADE,
    company_id      UUID            REFERENCES companies(id) ON DELETE CASCADE,
    contact_id      UUID            REFERENCES contacts(id) ON DELETE CASCADE,
    type            activity_type   NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    description     TEXT,
    outcome         TEXT,
    performed_by    UUID            REFERENCES employees(id),
    performed_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    metadata        JSONB,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Activity Attachments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE activity_attachments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID        NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    file_name   VARCHAR(255) NOT NULL,
    file_path   VARCHAR(500) NOT NULL,
    file_size   BIGINT,
    mime_type   VARCHAR(100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
