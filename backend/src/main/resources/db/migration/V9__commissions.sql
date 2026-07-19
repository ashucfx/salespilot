-- ═══════════════════════════════════════════════════════════════
-- V9: Commission Engine
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE commission_type AS ENUM ('PERCENTAGE', 'FIXED', 'HYBRID', 'TIERED');
CREATE TYPE commission_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED');

-- ─────────────────────────────────────────────────────────────
-- Commission Rules
-- ─────────────────────────────────────────────────────────────
CREATE TABLE commission_rules (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    type            commission_type NOT NULL,
    percentage      NUMERIC(5,2),
    fixed_amount    NUMERIC(12,2),
    description     TEXT,
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Commission Tiers (for TIERED type)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE commission_tiers (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id         UUID        NOT NULL REFERENCES commission_rules(id) ON DELETE CASCADE,
    min_amount      NUMERIC(15,2) NOT NULL,
    max_amount      NUMERIC(15,2),
    percentage      NUMERIC(5,2),
    fixed_amount    NUMERIC(12,2),
    tier_order      INTEGER     NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Employee Commission Plans (which rule applies to which employee)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE employee_commission_plans (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    rule_id         UUID        NOT NULL REFERENCES commission_rules(id),
    effective_from  DATE        NOT NULL,
    effective_to    DATE,
    is_active       BOOLEAN     NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Commissions (per deal)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE commissions (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id         UUID                NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    employee_id     UUID                NOT NULL REFERENCES employees(id),
    rule_id         UUID                REFERENCES commission_rules(id),
    deal_value      NUMERIC(15,2)       NOT NULL,
    commission_amount NUMERIC(12,2)     NOT NULL,
    currency        VARCHAR(10)         NOT NULL DEFAULT 'INR',
    status          commission_status   NOT NULL DEFAULT 'PENDING',
    approved_by     UUID                REFERENCES employees(id),
    approved_at     TIMESTAMPTZ,
    rejection_reason TEXT,
    paid_by         UUID                REFERENCES employees(id),
    paid_at         TIMESTAMPTZ,
    payment_ref     VARCHAR(200),
    notes           TEXT,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);
