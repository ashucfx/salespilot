-- Flyway Migration V24: Add missing audit columns (created_by, updated_by)
-- to tables created in V23 that extend BaseEntity but were missing these columns.
-- These are required by Spring Data JPA @CreatedBy / @LastModifiedBy auditing.

ALTER TABLE incentives
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
    ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);

ALTER TABLE employee_incentives
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(255),
    ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255);
