-- ═══════════════════════════════════════════════════════════════
-- V16: Resignations and Payouts
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE resignation_status AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'WITHDRAWN');

ALTER TABLE employees 
ADD COLUMN end_date DATE,
ADD COLUMN resignation_status resignation_status,
ADD COLUMN resignation_reason TEXT,
ADD COLUMN resignation_submitted_at TIMESTAMPTZ;

-- ─────────────────────────────────────────────────────────────
-- Payouts
-- ─────────────────────────────────────────────────────────────
CREATE TABLE payouts (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID                NOT NULL REFERENCES employees(id),
    amount          NUMERIC(12,2)       NOT NULL,
    base_salary     NUMERIC(12,2)       DEFAULT 0,
    total_commission NUMERIC(12,2)      DEFAULT 0,
    payout_period   VARCHAR(50)         NOT NULL, -- e.g., "July 2026"
    payout_date     DATE                NOT NULL, -- The scheduled end of month date
    status          commission_status   NOT NULL DEFAULT 'PENDING',
    bank_name       VARCHAR(100),
    bank_account    VARCHAR(50),
    bank_ifsc       VARCHAR(20),
    paid_at         TIMESTAMPTZ,
    payment_ref     VARCHAR(200),
    notes           TEXT,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255),
    deleted_at      TIMESTAMPTZ
);

ALTER TABLE commissions
ADD COLUMN payout_id UUID REFERENCES payouts(id);
