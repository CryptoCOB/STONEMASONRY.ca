-- Enforce account ownership and speed up tenant-scoped queries

ALTER TABLE users ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE files ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE service_areas ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE contractor_profiles ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE properties ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE leads ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE quote_requests ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE estimates ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE jobs ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE job_tasks ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE audit_logs ALTER COLUMN account_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_account ON users(account_id);
CREATE INDEX IF NOT EXISTS idx_files_account ON files(account_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_account ON service_areas(account_id);
CREATE INDEX IF NOT EXISTS idx_contractor_profiles_account ON contractor_profiles(account_id);
CREATE INDEX IF NOT EXISTS idx_properties_account ON properties(account_id);
CREATE INDEX IF NOT EXISTS idx_leads_account_status ON leads(account_id, status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_account ON quote_requests(account_id);
CREATE INDEX IF NOT EXISTS idx_estimates_account ON estimates(account_id);
CREATE INDEX IF NOT EXISTS idx_jobs_account ON jobs(account_id);
CREATE INDEX IF NOT EXISTS idx_job_tasks_account ON job_tasks(account_id);
