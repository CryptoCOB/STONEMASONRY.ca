-- Operational pipeline schema for CRM + marketplace flows
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS citext;

-- Enum types
CREATE TYPE lead_status AS ENUM ('new','contacted','qualified','estimate_sent','won','lost','inactive');
CREATE TYPE quote_request_status AS ENUM ('requested','in_review','responded','accepted','declined','expired');
CREATE TYPE bid_status AS ENUM ('pending','accepted','rejected','withdrawn','expired');
CREATE TYPE estimate_status AS ENUM ('draft','sent','approved','rejected','expired');
CREATE TYPE job_status AS ENUM ('scheduled','in_progress','on_hold','completed','cancelled');
CREATE TYPE task_status AS ENUM ('pending','in_progress','blocked','done');
CREATE TYPE invoice_status AS ENUM ('draft','issued','paid','void','overdue','refunded');
CREATE TYPE payment_status AS ENUM ('pending','completed','failed','refunded');
CREATE TYPE ticket_status AS ENUM ('open','scheduled','in_progress','resolved','closed');
CREATE TYPE dispute_status AS ENUM ('open','under_review','resolved','escalated','closed');

-- Core marketplace/CRM entities
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_email CITEXT UNIQUE,
    contact_phone TEXT,
    license_number TEXT,
    license_state TEXT,
    license_expiration DATE,
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    insurance_expiration DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'CA',
    postal_codes TEXT[] DEFAULT '{}',
    geometry GEOGRAPHY(MultiPolygon, 4326),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_area_id UUID REFERENCES service_areas(id),
    owner_name TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'CA',
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    source TEXT NOT NULL,
    status lead_status NOT NULL DEFAULT 'new',
    tags TEXT[] DEFAULT '{}',
    contact_name TEXT,
    contact_email CITEXT,
    contact_phone TEXT,
    notes TEXT,
    contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    requested_service TEXT NOT NULL,
    details TEXT,
    budget_range TEXT,
    status quote_request_status NOT NULL DEFAULT 'requested',
    desired_start_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bid_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_request_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    status bid_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    expires_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Estimates with versioning and materials
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_cost NUMERIC(12,2),
    supplier_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE estimates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
    status estimate_status NOT NULL DEFAULT 'draft',
    accepted_version_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Note: estimate_versions referenced in estimates needs forward declaration; define table next.
CREATE TABLE estimate_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    status estimate_status NOT NULL DEFAULT 'draft',
    total_amount NUMERIC(12,2),
    valid_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (estimate_id, version_number)
);

ALTER TABLE estimates
    ADD CONSTRAINT fk_estimate_accepted_version
    FOREIGN KEY (accepted_version_id)
    REFERENCES estimate_versions(id)
    DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE estimate_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_version_id UUID REFERENCES estimate_versions(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1
);

-- Jobs and production tracking
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    estimate_version_id UUID REFERENCES estimate_versions(id) ON DELETE SET NULL,
    contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
    status job_status NOT NULL DEFAULT 'scheduled',
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    crew_lead TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE job_crew_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    role TEXT,
    phone TEXT
);

CREATE TABLE job_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status task_status NOT NULL DEFAULT 'pending',
    scheduled_for DATE,
    completed_at TIMESTAMPTZ,
    assigned_to TEXT,
    sort_order INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE job_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Billing and payments
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    estimate_version_id UUID REFERENCES estimate_versions(id) ON DELETE SET NULL,
    stripe_invoice_id TEXT UNIQUE,
    status invoice_status NOT NULL DEFAULT 'draft',
    total_amount NUMERIC(12,2) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date DATE,
    currency TEXT NOT NULL DEFAULT 'CAD'
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    status payment_status NOT NULL DEFAULT 'pending',
    amount NUMERIC(12,2) NOT NULL,
    method TEXT,
    received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Warranties and service tickets
CREATE TABLE warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    coverage_description TEXT NOT NULL,
    coverage_end DATE NOT NULL,
    contact_phone TEXT,
    contact_email CITEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE service_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warranty_id UUID REFERENCES warranties(id) ON DELETE SET NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'open',
    priority TEXT,
    scheduled_for DATE,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews, moderation, disputes
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    reviewer_name TEXT,
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE moderation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    action TEXT NOT NULL,
    reason TEXT,
    moderator TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    opened_by UUID REFERENCES contractors(id) ON DELETE SET NULL,
    status dispute_status NOT NULL DEFAULT 'open',
    issue_summary TEXT NOT NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for geo/service search and tagging
CREATE INDEX idx_properties_location_gix ON properties USING GIST (location);
CREATE INDEX idx_properties_postal_code ON properties (postal_code);
CREATE INDEX idx_service_areas_geometry_gix ON service_areas USING GIST (geometry);
CREATE INDEX idx_service_areas_postal_codes_gin ON service_areas USING GIN (postal_codes);
CREATE INDEX idx_leads_tags_gin ON leads USING GIN (tags);
CREATE INDEX idx_jobs_schedule ON jobs (scheduled_start, scheduled_end);
CREATE INDEX idx_quote_requests_status ON quote_requests (status);
CREATE INDEX idx_bid_responses_status ON bid_responses (status);
CREATE INDEX idx_estimate_versions_status ON estimate_versions (status);
CREATE INDEX idx_invoices_status ON invoices (status);
CREATE INDEX idx_payments_status ON payments (status);
