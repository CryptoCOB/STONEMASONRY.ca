# CRM + Marketplace Deep Scan TODOs

## Current coverage snapshot

| Area | What exists | Gaps vs target spine |
| --- | --- | --- |
| Data model | `platform-api` provides basic accounts/users, lead→quote→estimate→job→invoice tables with moderation queue for reviews【F:platform-api/src/db/migrations/001_initial.sql†L3-L178】. Operational ERD + seed data in `db/` models the fuller contractor marketplace loop with PostGIS geodata, versioned estimates, jobs, billing, warranties, and disputes【F:docs/erd-operational-pipeline.md†L1-L63】. | No audit log, task checklists, photo timeline, service tickets, or taxonomy/aliases. Multi-tenant boundaries in `platform-api` rely on `account_id` but lack enforcement/indices across all tables. |
| API layer | Fastify routes cover auth, service areas, properties, leads, quote intake, bids, estimates, jobs, invoices, payments, reviews, and moderation decisions with Zod validation【F:platform-api/src/routes/index.ts†L7-L200】 and JWT role guards【F:platform-api/README.md†L24-L34】. | No versioned estimates, checklist endpoints, messaging, notifications, Stripe links, idempotency keys, or audit logging. Public ingest only guards quote/review creation and assumes `DEFAULT_ACCOUNT_ID`. |
| Frontend | Current React app is a marketing site (home/services/contact) without CRM/marketplace UI; CRA README confirms static site focus【F:simcoe-stone-frontend/README.md†L1-L34】. Lead dashboard doc references Streamlit prototype but no integrated UI components【F:simcoe-stone-frontend/LEAD_ENGINE_DASHBOARD.md†L1-L40】. | Need CRM dashboards (kanban, detail pages, estimate builder, job board, photo timeline) and later marketplace surfaces (contractor directory/profile, quote wizard, messaging). |
| Ops/Seeds | Operational seed data captures end-to-end patio job with bids, estimate version, job tasks, billing, warranty, review, and dispute【F:db/seeds/seed_operational_pipeline.sql†L1-L120】. | CI/CD, migrations pipeline, and background job queue not wired; no observability hooks. |

## Milestone-aligned TODOs

### Milestone 1 – CRM MVP (internal)
- **Finalize canonical schema:** Promote the `db/migrations/001_operational_pipeline.sql` structure (contractors, PostGIS locations, versioned estimates, job tasks/photos, invoices/payments, warranties, disputes) and align `platform-api` migrations accordingly. Add audit log table and RBAC scopes per company.
- **API contracts for Flow A/B:**
  - Public quote intake → lead normalization with idempotency keys and notification stubs.
  - Lead pipeline transitions (status enum), notes, tags, and follow-up reminders.
  - Estimate builder: versioned line items, tax rules, PDF export placeholder, acceptance + deposit intent creation.
  - Job creation from accepted estimate version; endpoints for schedule, checklist items, crew assignments, and photo uploads (metadata + storage adapter hooks).
  - Invoice milestones tied to job/estimate version; payment capture webhooks placeholder; automated review request trigger + warranty start.
- **CRM UI/UX:**
  - Dashboard showing today’s jobs, pending leads, overdue invoices.
  - Leads kanban (New → Contacted → Site Visit → Estimate Sent → Won/Lost) with detail page for notes, photos, property map, call log, and follow-ups.
  - Estimate builder UI with templates, line items, versions, and acceptance flow (Stripe link). Include PDF/export CTA.
  - Job board calendar with crew assignments, task checklist, and photo timeline (before/during/after tags).
  - Invoices list/detail with payment status and receipt links; hook to payment intent or external Stripe link field.
- **Ops:** wire migration runner for new schema, seed loader, and `.env.example` covering DB/JWT/API keys.

### Milestone 2 – Multi-company support
- Enforce tenant boundary via `account_id`/`contractor_id` on all tables, row-level filters in queries, and JWT claims. Add roles (owner/admin/estimator/crew) with policy matrix and guards.
- Admin UI for company settings, roles, and service areas; per-company document library using `files` table.
- Audit log surfaces (who/what/when) for all CRUD in CRM screens.

### Milestone 3 – Marketplace MVP
- **Onboarding & directory:** Contractor signup, profile builder (bio, badges, insurance/licensing), service areas map, portfolio media references.
- **Quote routing:** Public wizard (project type, photos, location) mapping to canonical taxonomy; route to eligible contractors and create quote_request + bid_responses records.
- **Messaging:** Thread model tied to quote/job; real-time-ish polling or SSE; notification hooks (email/SMS) for new messages and bid updates.
- **Discovery UI:** Directory cards with filters (service type/location/rating), contractor profile page with portfolio, badges, reviews, and service map.

### Milestone 4 – Reviews + Trust & Safety
- Verified review flow tied to completed jobs/payments; moderation queue UI for approve/hold/reject.
- Contractor verification workflow (document uploads, manual approval screen, decision log).
- Report/dispute pipeline with admin decision capture; review spam controls.

### Cross-cutting “misnomers” + taxonomy
- Create canonical service catalog + aliases table; update search/forms to accept synonyms and store canonical category.
- Add validation to enforce canonical categories on quote/estimate items.

### Ops + Observability
- Background jobs queue for notifications, PDF generation, reminders, review requests.
- Metrics: lead→estimate→win conversion, response time SLA, job cycle time; expose to dashboard.
- Error reporting, structured request logs, healthchecks; CI pipeline with lint/test/migration checks; secrets hygiene (.env ignored, key rotation guidance).

## Completion table (snapshot)

| Workstream | Status | Confidence | Notes |
| --- | --- | --- | --- |
| Schema foundation (Postgres/PostGIS, audit) | 45% | Medium | Two schemas exist; need merge + audit log + taxonomy/aliases + RLS/tenant indices. |
| API contracts (CRM) | 35% | Medium | Core CRUD exists without versioning, checklist, messaging, idempotency, or notifications. |
| CRM UI/UX | 10% | Low | Marketing site only; all CRM screens must be built. |
| Marketplace UX/UX | 0% | Low | No directory/onboarding/messaging implemented. |
| Trust & Safety | 15% | Medium | Moderation table + review ingestion exist; need UI, verification, disputes. |
| Ops/Observability/CI | 10% | Low | Seeds available; pipelines/queue/metrics/logging not wired. |

## Newly completed items

- Added audit log table and helper to capture account/user/lead/quote events for CRM traceability.
- Added lead pipeline controls: status updates with reasons and tags, plus follow-up reminders with completion tracking.
- Added quote intake idempotency key to prevent duplicate submissions on public capture flows.
- Added `.env.example` for the platform API to document required connection/auth settings.
