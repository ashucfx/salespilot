-- ═══════════════════════════════════════════════════════════════
-- V12: Performance Indexes
-- Sales Pilot | Ripple Nexus
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Users
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_device_sessions_user ON device_sessions(user_id);

-- ─────────────────────────────────────────────────────────────
-- Employees
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_number ON employees(employee_number);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_work_email ON employees(work_email) WHERE deleted_at IS NULL;

-- Full-text search on employee names
CREATE INDEX idx_employees_name_fts ON employees
    USING gin(to_tsvector('english', first_name || ' ' || last_name));

-- ─────────────────────────────────────────────────────────────
-- Companies
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_companies_name ON companies(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_industry ON companies(industry) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_country ON companies(country) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_name_fts ON companies USING gin(to_tsvector('english', name));

-- ─────────────────────────────────────────────────────────────
-- Contacts
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_fts ON contacts
    USING gin(to_tsvector('english', first_name || ' ' || COALESCE(last_name, '')));

-- ─────────────────────────────────────────────────────────────
-- Leads
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_leads_number ON leads(lead_number);
CREATE INDEX idx_leads_assigned ON leads(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_status ON leads(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_company ON leads(company_id);
CREATE INDEX idx_leads_contact ON leads(contact_id);
CREATE INDEX idx_leads_source ON leads(source_id);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_expected_close ON leads(expected_close_date);
CREATE INDEX idx_leads_search_fts ON leads
    USING gin(to_tsvector('english',
        COALESCE(contact_name, '') || ' ' ||
        COALESCE(company_name, '') || ' ' ||
        COALESCE(contact_email, '')
    ));

-- ─────────────────────────────────────────────────────────────
-- Pipeline
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_pipeline_entries_lead ON pipeline_entries(lead_id);
CREATE INDEX idx_pipeline_entries_stage ON pipeline_entries(stage_id);
CREATE INDEX idx_pipeline_history_lead ON pipeline_stage_history(lead_id);

-- ─────────────────────────────────────────────────────────────
-- Activities
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_activities_lead ON activities(lead_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_company ON activities(company_id);
CREATE INDEX idx_activities_employee ON activities(performed_by);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_performed_at ON activities(performed_at DESC);

-- ─────────────────────────────────────────────────────────────
-- Tasks
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_lead ON tasks(lead_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due ON tasks(due_date);

-- ─────────────────────────────────────────────────────────────
-- Meetings
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_meetings_organizer ON meetings(organizer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_meetings_lead ON meetings(lead_id);
CREATE INDEX idx_meetings_scheduled ON meetings(scheduled_at);
CREATE INDEX idx_meetings_status ON meetings(status);

-- ─────────────────────────────────────────────────────────────
-- Follow-ups
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_followups_assigned ON followups(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_followups_lead ON followups(lead_id);
CREATE INDEX idx_followups_scheduled ON followups(scheduled_at);
CREATE INDEX idx_followups_completed ON followups(is_completed);

-- ─────────────────────────────────────────────────────────────
-- Deals
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_deals_employee ON deals(employee_id);
CREATE INDEX idx_deals_lead ON deals(lead_id);
CREATE INDEX idx_deals_closed ON deals(closed_at DESC);

-- ─────────────────────────────────────────────────────────────
-- Commissions
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_commissions_employee ON commissions(employee_id);
CREATE INDEX idx_commissions_deal ON commissions(deal_id);
CREATE INDEX idx_commissions_status ON commissions(status);

-- ─────────────────────────────────────────────────────────────
-- Targets
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_targets_employee ON targets(employee_id);
CREATE INDEX idx_targets_period ON targets(period_start, period_end);

-- ─────────────────────────────────────────────────────────────
-- Notifications
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- Audit Logs
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
