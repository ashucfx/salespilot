-- ═══════════════════════════════════════════════════════════════
-- V2: Employees
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE employment_status AS ENUM (
    'ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION'
);

CREATE TYPE gender_type AS ENUM (
    'MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'
);

-- ─────────────────────────────────────────────────────────────
-- Departments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE departments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ,
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Employees
-- ─────────────────────────────────────────────────────────────
CREATE TABLE employees (
    id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID              NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    employee_number VARCHAR(20)       NOT NULL UNIQUE,
    first_name      VARCHAR(100)      NOT NULL,
    last_name       VARCHAR(100)      NOT NULL,
    display_name    VARCHAR(255)      GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    personal_email  VARCHAR(255),
    work_email      VARCHAR(255)      NOT NULL UNIQUE,
    phone           VARCHAR(20),
    whatsapp        VARCHAR(20),
    gender          gender_type,
    date_of_birth   DATE,
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100),
    pincode         VARCHAR(20),
    profile_picture VARCHAR(500),
    department_id   UUID              REFERENCES departments(id),
    designation     VARCHAR(100),
    manager_id      UUID              REFERENCES employees(id),
    joining_date    DATE              NOT NULL,
    status          employment_status NOT NULL DEFAULT 'ACTIVE',
    salary          NUMERIC(12,2),
    bank_name       VARCHAR(100),
    bank_account    VARCHAR(50),
    bank_ifsc       VARCHAR(20),
    emergency_name  VARCHAR(200),
    emergency_phone VARCHAR(20),
    emergency_rel   VARCHAR(50),
    performance_rating NUMERIC(3,1) CHECK (performance_rating BETWEEN 0 AND 5),
    notes           TEXT,
    created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- Employee Territories
-- ─────────────────────────────────────────────────────────────
CREATE TABLE employee_territories (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    country     VARCHAR(100) NOT NULL,
    region      VARCHAR(100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Employee Industries
-- ─────────────────────────────────────────────────────────────
CREATE TABLE employee_industries (
    employee_id UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    industry    VARCHAR(100) NOT NULL,
    PRIMARY KEY (employee_id, industry)
);

-- ─────────────────────────────────────────────────────────────
-- Employee Services
-- ─────────────────────────────────────────────────────────────
CREATE TABLE employee_services (
    employee_id UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    service     VARCHAR(100) NOT NULL,
    PRIMARY KEY (employee_id, service)
);
