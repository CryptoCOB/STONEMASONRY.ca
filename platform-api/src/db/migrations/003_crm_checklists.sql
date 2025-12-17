CREATE TABLE IF NOT EXISTS job_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    due_date DATE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_tasks_job ON job_tasks(job_id);
CREATE INDEX IF NOT EXISTS idx_job_tasks_account_status ON job_tasks(account_id, status);

CREATE INDEX IF NOT EXISTS idx_invoices_due_status ON invoices(due_date, status);
