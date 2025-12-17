-- Seed data for CRM + marketplace operational pipeline
-- Using fixed UUIDs to simplify joins in API/UI scaffolding

-- Contractors
INSERT INTO contractors (id, name, contact_email, contact_phone, license_number, license_state, license_expiration,
                         insurance_provider, insurance_policy_number, insurance_expiration)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Simcoe Stoneworks', 'hello@simcoe.stone', '+1-705-555-1010', 'STN-4431', 'ON', '2026-12-31',
     'Northern Mutual', 'POL-99001', '2025-06-30'),
    ('22222222-2222-2222-2222-222222222222', 'Georgian Bay Masonry', 'contact@gbmasonry.ca', '+1-705-555-2020', 'GBM-8712', 'ON', '2025-10-01',
     'Shield Insurance', 'POL-88002', '2024-12-31');

-- Service areas
INSERT INTO service_areas (id, contractor_id, name, country, postal_codes, geometry)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Barrie + Innisfil', 'CA', ARRAY['L4N', 'L9S'], NULL),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Orillia Corridor', 'CA', ARRAY['L3V', 'L3V0'], NULL);

-- Properties
INSERT INTO properties (id, service_area_id, owner_name, address_line1, city, province, postal_code, country, latitude, longitude, location)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jamie Calder', '12 Maple Ridge', 'Barrie', 'ON', 'L4N0A1', 'CA', 44.389000, -79.690000, ST_GeogFromText('POINT(-79.69 44.389)')),
    ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nia Thomason', '88 Front Street', 'Orillia', 'ON', 'L3V4R5', 'CA', 44.608900, -79.420000, ST_GeogFromText('POINT(-79.42 44.6089)'));

-- Leads
INSERT INTO leads (id, property_id, source, status, tags, contact_name, contact_email, contact_phone, notes, contractor_id)
VALUES
    ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'website_form', 'qualified', ARRAY['stonework','patio'], 'Jamie Calder', 'jamie@example.com', '+1-705-555-3030', 'Interested in spring start', '11111111-1111-1111-1111-111111111111'),
    ('66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'referral', 'contacted', ARRAY['repair'], 'Nia Thomason', 'nia@example.com', '+1-705-555-4040', 'Existing customer referral', '22222222-2222-2222-2222-222222222222');

-- Quote requests
INSERT INTO quote_requests (id, lead_id, property_id, requested_service, details, budget_range, status, desired_start_date)
VALUES
    ('77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Patio install', '450 sqft limestone patio with lighting', '$12k-$15k', 'in_review', '2024-05-15'),
    ('88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'Wall repair', 'Repointing + cap replacement', '$2k-$4k', 'requested', '2024-04-10');

-- Bid responses
INSERT INTO bid_responses (id, quote_request_id, contractor_id, amount, status, notes, expires_at)
VALUES
    ('99999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 13000.00, 'pending', 'Includes lighting trenching', '2024-04-30');

-- Materials
INSERT INTO materials (id, name, unit, unit_cost, supplier_name)
VALUES
    ('aaaaaaaa-bbbb-cccc-dddd-eeeeffff0001', 'Limestone paver', 'sqft', 9.50, 'Northern Aggregates'),
    ('aaaaaaaa-bbbb-cccc-dddd-eeeeffff0002', 'Polymeric sand', 'bag', 29.99, 'Pro Mason Supply');

-- Estimates & versions
INSERT INTO estimates (id, lead_id, property_id, contractor_id, status)
VALUES
    ('bbbbbbbb-cccc-dddd-eeee-ffffffff0001', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'sent');

INSERT INTO estimate_versions (id, estimate_id, version_number, status, total_amount, valid_until)
VALUES
    ('cccccccc-dddd-eeee-ffff-000000000001', 'bbbbbbbb-cccc-dddd-eeee-ffffffff0001', 1, 'sent', 14250.00, '2024-05-01');

UPDATE estimates SET accepted_version_id = 'cccccccc-dddd-eeee-ffff-000000000001' WHERE id = 'bbbbbbbb-cccc-dddd-eeee-ffffffff0001';

INSERT INTO estimate_line_items (id, estimate_version_id, material_id, description, quantity, unit_price, sort_order)
VALUES
    ('dddddddd-eeee-ffff-0000-111111111111', 'cccccccc-dddd-eeee-ffff-000000000001', 'aaaaaaaa-bbbb-cccc-dddd-eeeeffff0001', 'Limestone supply & install', 450, 9.50, 1),
    ('eeeeeeee-ffff-0000-1111-222222222222', 'cccccccc-dddd-eeee-ffff-000000000001', 'aaaaaaaa-bbbb-cccc-dddd-eeeeffff0002', 'Polymeric sand & compaction', 15, 29.99, 2),
    ('ffffffff-0000-1111-2222-333333333333', 'cccccccc-dddd-eeee-ffff-000000000001', NULL, 'Labour & equipment', 1, 4200.00, 3);

-- Jobs
INSERT INTO jobs (id, property_id, estimate_version_id, contractor_id, status, scheduled_start, scheduled_end, crew_lead, notes)
VALUES
    ('12121212-1212-1212-1212-121212121212', '33333333-3333-3333-3333-333333333333', 'cccccccc-dddd-eeee-ffff-000000000001', '11111111-1111-1111-1111-111111111111', 'scheduled', '2024-05-20', '2024-05-27', 'Alex Rivera', 'Coordinate with lighting subcontractor');

INSERT INTO job_crew_members (id, job_id, member_name, role, phone)
VALUES
    ('13131313-1313-1313-1313-131313131313', '12121212-1212-1212-1212-121212121212', 'Dev Patel', 'Mason', '+1-705-555-5050'),
    ('14141414-1414-1414-1414-141414141414', '12121212-1212-1212-1212-121212121212', 'Morgan Lee', 'Labourer', '+1-705-555-6060');

INSERT INTO job_tasks (id, job_id, name, status, scheduled_for, sort_order)
VALUES
    ('15151515-1515-1515-1515-151515151515', '12121212-1212-1212-1212-121212121212', 'Excavation', 'in_progress', '2024-05-20', 1),
    ('16161616-1616-1616-1616-161616161616', '12121212-1212-1212-1212-121212121212', 'Base prep & compaction', 'pending', '2024-05-21', 2),
    ('17171717-1717-1717-1717-171717171717', '12121212-1212-1212-1212-121212121212', 'Set pavers', 'pending', '2024-05-23', 3);

INSERT INTO job_photos (id, job_id, url, caption, uploaded_by)
VALUES
    ('18181818-1818-1818-1818-181818181818', '12121212-1212-1212-1212-121212121212', 'https://cdn.simcoe.stone/jobs/1212/excavation.jpg', 'Excavation complete', 'Alex Rivera');

-- Billing
INSERT INTO invoices (id, job_id, estimate_version_id, stripe_invoice_id, status, total_amount, issued_at, due_date, currency)
VALUES
    ('19191919-1919-1919-1919-191919191919', '12121212-1212-1212-1212-121212121212', 'cccccccc-dddd-eeee-ffff-000000000001', 'in_1PExample', 'issued', 14250.00, '2024-04-15', '2024-05-15', 'CAD');

INSERT INTO payments (id, invoice_id, stripe_payment_intent_id, status, amount, method, received_at)
VALUES
    ('20202020-2020-2020-2020-202020202020', '19191919-1919-1919-1919-191919191919', 'pi_1PExample', 'completed', 5000.00, 'card', '2024-04-18');

-- Warranty + service
INSERT INTO warranties (id, job_id, property_id, coverage_description, coverage_end, contact_phone, contact_email)
VALUES
    ('21212121-2121-2121-2121-212121212121', '12121212-1212-1212-1212-121212121212', '33333333-3333-3333-3333-333333333333', '3-year settling + workmanship warranty', '2027-05-27', '+1-705-555-3030', 'jamie@example.com');

INSERT INTO service_tickets (id, warranty_id, job_id, property_id, summary, status, priority, scheduled_for)
VALUES
    ('22222222-aaaa-bbbb-cccc-ddddeeeeffff', '21212121-2121-2121-2121-212121212121', '12121212-1212-1212-1212-121212121212', '33333333-3333-3333-3333-333333333333', 'Inspect minor settling near steps', 'scheduled', 'medium', '2024-07-10');

-- Reviews, moderation, disputes
INSERT INTO reviews (id, contractor_id, job_id, rating, comments, reviewer_name, source)
VALUES
    ('23232323-2323-2323-2323-232323232323', '11111111-1111-1111-1111-111111111111', '12121212-1212-1212-1212-121212121212', 5, 'Crew was tidy and on schedule.', 'Jamie C.', 'post-job');

INSERT INTO moderation_logs (id, target_type, target_id, action, reason, moderator)
VALUES
    ('24242424-2424-2424-2424-242424242424', 'review', '23232323-2323-2323-2323-232323232323', 'approved', 'Verified homeowner identity', 'Ops Bot');

INSERT INTO disputes (id, invoice_id, job_id, opened_by, status, issue_summary)
VALUES
    ('25252525-2525-2525-2525-252525252525', '19191919-1919-1919-1919-191919191919', '12121212-1212-1212-1212-121212121212', '11111111-1111-1111-1111-111111111111', 'resolved', 'Clarified lighting allowance vs extras');
