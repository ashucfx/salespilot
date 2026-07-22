-- Flyway Migration V23: Employee Incentive System

CREATE TABLE IF NOT EXISTS incentives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_type VARCHAR(50) NOT NULL, -- DEAL_REVENUE, DEALS_CLOSED, LEADS_CONVERTED
    target_value NUMERIC(12,2) NOT NULL,
    reward_amount NUMERIC(12,2) NOT NULL,
    badge_name VARCHAR(100),
    badge_icon VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_incentives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    incentive_id UUID NOT NULL REFERENCES incentives(id) ON DELETE CASCADE,
    current_progress NUMERIC(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, CLAIMABLE, CLAIMED
    claimed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT uk_employee_incentive UNIQUE(employee_id, incentive_id)
);

-- Seed default sales milestone incentive challenges
INSERT INTO incentives (id, title, description, target_type, target_value, reward_amount, badge_name, badge_icon, status)
VALUES
(gen_random_uuid(), 'Monthly Revenue Crusher', 'Generate ₹1,000,000+ in closed deal revenue within a month.', 'DEAL_REVENUE', 1000000.00, 25000.00, 'Revenue Crusher', 'trophy', 'ACTIVE'),
(gen_random_uuid(), 'Deals Speed Demon', 'Close 5 Won Deals in a single month.', 'DEALS_CLOSED', 5.00, 10000.00, 'Speed Demon', 'zap', 'ACTIVE'),
(gen_random_uuid(), 'Lead Conversion Master', 'Successfully convert 10 leads into active pipeline deals.', 'LEADS_CONVERTED', 10.00, 7500.00, 'Conversion Star', 'star', 'ACTIVE'),
(gen_random_uuid(), 'High-Roller Deal Maker', 'Close a single high-value deal worth over ₹500,000.', 'DEAL_REVENUE', 500000.00, 15000.00, 'High Roller', 'crown', 'ACTIVE')
ON CONFLICT DO NOTHING;
