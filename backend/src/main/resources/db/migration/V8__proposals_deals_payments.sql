-- ═══════════════════════════════════════════════════════════════
-- V8: Proposals, Deals & Payments
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE proposal_type AS ENUM ('PROPOSAL', 'QUOTATION', 'CONTRACT', 'OTHER');
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED');
CREATE TYPE payment_method AS ENUM (
    'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CASH', 'CREDIT_CARD',
    'DEBIT_CARD', 'PAYPAL', 'STRIPE', 'RAZORPAY', 'OTHER'
);

-- ─────────────────────────────────────────────────────────────
-- Proposals
-- ─────────────────────────────────────────────────────────────
CREATE TABLE proposals (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id         UUID            NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    type            proposal_type   NOT NULL DEFAULT 'PROPOSAL',
    title           VARCHAR(255)    NOT NULL,
    file_name       VARCHAR(255)    NOT NULL,
    file_path       VARCHAR(500)    NOT NULL,
    file_size       BIGINT,
    mime_type       VARCHAR(100),
    version         INTEGER         NOT NULL DEFAULT 1,
    amount          NUMERIC(15,2),
    currency        VARCHAR(10)     NOT NULL DEFAULT 'INR',
    valid_until     DATE,
    approval_status approval_status NOT NULL DEFAULT 'PENDING',
    notes           TEXT,
    uploaded_by     UUID            REFERENCES employees(id),
    approved_by     UUID            REFERENCES employees(id),
    approved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Deals (Won Leads)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE deals (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id         UUID        NOT NULL UNIQUE REFERENCES leads(id) ON DELETE RESTRICT,
    deal_number     VARCHAR(30) NOT NULL UNIQUE,
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    deal_value      NUMERIC(15,2) NOT NULL,
    currency        VARCHAR(10)  NOT NULL DEFAULT 'INR',
    invoice_number  VARCHAR(100),
    closed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Payments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE payments (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id         UUID            NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    amount          NUMERIC(15,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'INR',
    payment_method  payment_method,
    payment_date    DATE            NOT NULL,
    transaction_ref VARCHAR(200),
    is_received     BOOLEAN         NOT NULL DEFAULT true,
    remarks         TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);
