-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_users_account ON users(account_id);
CREATE INDEX IF NOT EXISTS idx_roles_account ON roles(account_id);
CREATE INDEX IF NOT EXISTS idx_contractor_profiles_account ON contractor_profiles(account_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_account ON service_areas(account_id);
CREATE INDEX IF NOT EXISTS idx_properties_account ON properties(account_id);
CREATE INDEX IF NOT EXISTS idx_leads_account ON leads(account_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_bid_responses_quote ON bid_responses(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_estimates_quote ON estimates(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_jobs_estimate ON jobs(estimate_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job ON invoices(job_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_reviews_job ON reviews(job_id);
CREATE INDEX IF NOT EXISTS idx_files_account ON file_assets(account_id);
CREATE INDEX IF NOT EXISTS idx_moderation_status ON moderation_queue(status);

-- RBAC helpers
ALTER TABLE roles ADD CONSTRAINT roles_unique_name_per_account UNIQUE (account_id, name);
ALTER TABLE permissions ADD CONSTRAINT permissions_name_unique UNIQUE (name);

-- Soft enforcement of status domains
ALTER TABLE quote_requests ADD CONSTRAINT quote_requests_status_check CHECK (status IN ('new','pending_bid','awarded','closed'));
ALTER TABLE bid_responses ADD CONSTRAINT bid_responses_status_check CHECK (status IN ('submitted','accepted','rejected'));
ALTER TABLE estimates ADD CONSTRAINT estimates_status_check CHECK (status IN ('draft','sent','accepted','declined'));
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check CHECK (status IN ('scheduled','in_progress','completed','cancelled'));
ALTER TABLE invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('draft','open','paid','void'));
ALTER TABLE payments ADD CONSTRAINT payments_status_check CHECK (status IN ('initiated','confirmed','failed','refunded'));
ALTER TABLE reviews ADD CONSTRAINT reviews_status_check CHECK (status IN ('pending','approved','rejected'));

-- Foreign key added after estimates->jobs relationship
ALTER TABLE estimates
  ADD CONSTRAINT estimates_job_fk FOREIGN KEY (job_id)
  REFERENCES jobs(id) ON DELETE SET NULL;

-- Audit helper to insert moderation tasks for reviews
CREATE OR REPLACE FUNCTION enqueue_review_moderation() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO moderation_queue(type, target_id, status, reason)
  VALUES('review', NEW.id, 'pending', 'auto-enqueued on review submit');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_enqueue_moderation
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE PROCEDURE enqueue_review_moderation();
