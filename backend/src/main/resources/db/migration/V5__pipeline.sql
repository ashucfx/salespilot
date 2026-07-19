-- ═══════════════════════════════════════════════════════════════
-- V5: Pipeline
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Pipeline Stages (configurable by admin)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE pipeline_stages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(50)  NOT NULL UNIQUE,
    display_order   INTEGER     NOT NULL,
    color           VARCHAR(20)  NOT NULL DEFAULT '#6366f1',
    description     TEXT,
    is_won_stage    BOOLEAN     NOT NULL DEFAULT false,
    is_lost_stage   BOOLEAN     NOT NULL DEFAULT false,
    is_active       BOOLEAN     NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Pipeline Entries (Lead ↔ Stage)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE pipeline_entries (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id         UUID        NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
    stage_id        UUID        NOT NULL REFERENCES pipeline_stages(id),
    position        INTEGER     NOT NULL DEFAULT 0,
    entered_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_moved_at   TIMESTAMPTZ,
    days_in_stage   INTEGER     GENERATED ALWAYS AS (
        EXTRACT(DAY FROM NOW() - entered_at)::INTEGER
    ) STORED,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Pipeline Stage History
-- ─────────────────────────────────────────────────────────────
CREATE TABLE pipeline_stage_history (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id         UUID        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    from_stage_id   UUID        REFERENCES pipeline_stages(id),
    to_stage_id     UUID        NOT NULL REFERENCES pipeline_stages(id),
    moved_by        UUID        REFERENCES employees(id),
    moved_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes           TEXT
);
