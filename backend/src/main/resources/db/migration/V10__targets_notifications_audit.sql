-- ═══════════════════════════════════════════════════════════════
-- V10: Targets, Notifications & Audit Logs
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE target_period AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');
CREATE TYPE target_type AS ENUM ('REVENUE', 'LEADS', 'MEETINGS', 'CLOSURES', 'CUSTOM');
CREATE TYPE notification_type AS ENUM (
    'LEAD_ASSIGNED', 'MEETING_REMINDER', 'FOLLOWUP_REMINDER',
    'COMMISSION_APPROVED', 'COMMISSION_PAID', 'COMMISSION_REJECTED',
    'TARGET_ACHIEVED', 'TARGET_WARNING', 'DEAL_CLOSED',
    'TASK_ASSIGNED', 'TASK_DUE', 'SYSTEM', 'OTHER'
);

-- ─────────────────────────────────────────────────────────────
-- Targets
-- ─────────────────────────────────────────────────────────────
CREATE TABLE targets (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID            NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    type            target_type     NOT NULL DEFAULT 'REVENUE',
    period          target_period   NOT NULL DEFAULT 'MONTHLY',
    period_start    DATE            NOT NULL,
    period_end      DATE            NOT NULL,
    target_value    NUMERIC(15,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'INR',
    achieved_value  NUMERIC(15,2)   NOT NULL DEFAULT 0,
    achievement_pct NUMERIC(5,2)    GENERATED ALWAYS AS (
        CASE WHEN target_value > 0
             THEN ROUND((achieved_value / target_value * 100), 2)
             ELSE 0 END
    ) STORED,
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Notifications
-- ─────────────────────────────────────────────────────────────
CREATE TABLE notifications (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type   NOT NULL,
    title           VARCHAR(255)        NOT NULL,
    message         TEXT                NOT NULL,
    action_url      VARCHAR(500),
    is_read         BOOLEAN             NOT NULL DEFAULT false,
    read_at         TIMESTAMPTZ,
    metadata        JSONB,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Audit Logs
-- ─────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        REFERENCES users(id) ON DELETE SET NULL,
    employee_id     UUID        REFERENCES employees(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(100),
    entity_id       VARCHAR(100),
    old_value       JSONB,
    new_value       JSONB,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    request_id      VARCHAR(100),
    status          VARCHAR(20)  NOT NULL DEFAULT 'SUCCESS',
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
