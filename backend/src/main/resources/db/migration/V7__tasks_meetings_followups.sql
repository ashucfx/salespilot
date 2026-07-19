-- ═══════════════════════════════════════════════════════════════
-- V7: Tasks, Meetings & Follow-ups
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE meeting_type AS ENUM ('ONLINE', 'OFFLINE', 'PHONE_CALL');
CREATE TYPE meeting_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');
CREATE TYPE followup_type AS ENUM ('CALL', 'EMAIL', 'MEETING', 'WHATSAPP', 'OTHER');

-- ─────────────────────────────────────────────────────────────
-- Tasks
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tasks (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255)    NOT NULL,
    description     TEXT,
    lead_id         UUID            REFERENCES leads(id) ON DELETE SET NULL,
    company_id      UUID            REFERENCES companies(id) ON DELETE SET NULL,
    assigned_to     UUID            REFERENCES employees(id) ON DELETE SET NULL,
    assigned_by     UUID            REFERENCES employees(id),
    priority        task_priority   NOT NULL DEFAULT 'MEDIUM',
    status          task_status     NOT NULL DEFAULT 'TODO',
    due_date        TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Task Comments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE task_comments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id     UUID        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    comment     TEXT        NOT NULL,
    author_id   UUID        REFERENCES employees(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Task Attachments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE task_attachments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id     UUID        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    file_name   VARCHAR(255) NOT NULL,
    file_path   VARCHAR(500) NOT NULL,
    file_size   BIGINT,
    mime_type   VARCHAR(100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Meetings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE meetings (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255)    NOT NULL,
    lead_id         UUID            REFERENCES leads(id) ON DELETE SET NULL,
    company_id      UUID            REFERENCES companies(id) ON DELETE SET NULL,
    contact_id      UUID            REFERENCES contacts(id) ON DELETE SET NULL,
    organizer_id    UUID            REFERENCES employees(id),
    type            meeting_type    NOT NULL DEFAULT 'ONLINE',
    status          meeting_status  NOT NULL DEFAULT 'SCHEDULED',
    scheduled_at    TIMESTAMPTZ     NOT NULL,
    duration_minutes INTEGER        NOT NULL DEFAULT 60,
    location        VARCHAR(500),
    meeting_url     VARCHAR(500),
    agenda          TEXT,
    notes           TEXT,
    outcome         TEXT,
    next_action     TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Meeting Attendees
-- ─────────────────────────────────────────────────────────────
CREATE TABLE meeting_attendees (
    meeting_id  UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    PRIMARY KEY (meeting_id, employee_id)
);

-- ─────────────────────────────────────────────────────────────
-- Follow-ups
-- ─────────────────────────────────────────────────────────────
CREATE TABLE followups (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id         UUID            REFERENCES leads(id) ON DELETE SET NULL,
    company_id      UUID            REFERENCES companies(id) ON DELETE SET NULL,
    contact_id      UUID            REFERENCES contacts(id) ON DELETE SET NULL,
    assigned_to     UUID            REFERENCES employees(id) ON DELETE SET NULL,
    type            followup_type   NOT NULL DEFAULT 'CALL',
    title           VARCHAR(255)    NOT NULL,
    notes           TEXT,
    scheduled_at    TIMESTAMPTZ     NOT NULL,
    completed_at    TIMESTAMPTZ,
    is_completed    BOOLEAN         NOT NULL DEFAULT false,
    is_overdue      BOOLEAN         NOT NULL DEFAULT false,
    is_recurring    BOOLEAN         NOT NULL DEFAULT false,
    recurrence_rule VARCHAR(100),
    next_followup_id UUID           REFERENCES followups(id),
    reminder_sent   BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);
