-- Add tenant scoping to payments and reviews for faster filters
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;

-- Backfill using existing relationships
UPDATE payments p
SET account_id = j.account_id
FROM invoices i
JOIN jobs j ON i.job_id = j.id
WHERE p.invoice_id = i.id AND p.account_id IS NULL;

UPDATE reviews r
SET account_id = j.account_id
FROM jobs j
WHERE r.job_id = j.id AND r.account_id IS NULL;

-- Enforce presence after backfill
ALTER TABLE payments ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN account_id SET NOT NULL;

-- Helpful indexes for tenant queries
CREATE INDEX IF NOT EXISTS idx_payments_account ON payments(account_id);
CREATE INDEX IF NOT EXISTS idx_reviews_account ON reviews(account_id);
