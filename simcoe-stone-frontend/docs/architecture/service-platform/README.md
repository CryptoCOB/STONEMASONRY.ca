# Service Architecture Plan

This document defines a pragmatic service architecture for the STONEMASONRY platform using **Next.js (app router) for the web client** and **NestJS + PostgreSQL** for APIs. It covers authentication/RBAC, file storage, the core domain models, and how the frontend replaces Netlify forms with authenticated API calls.

## Core stack
- **Frontend**: Next.js 15 with React Server Components, server actions for authenticated mutations, SWR/React Query for data fetching, Tailwind CSS for styling.
- **API**: NestJS monorepo with modular feature packages (Accounts, Users, Leads, Properties, Estimates, Jobs, Invoices/Payments, Contractor Profiles, Service Areas, Quote Requests, Bid Responses, Reviews, Moderation). OpenAPI-driven controllers map to Prisma/TypeORM services.
- **Database**: PostgreSQL 15 with the schema defined in `migrations/001_core_tables.sql` and `migrations/002_indexes_and_constraints.sql`.
- **AuthN/AuthZ**: JWT-based auth via NestJS `@nestjs/passport` with refresh tokens; roles and fine-grained permissions enforced via guards. Admin and contractor portal traffic is proxied through an API gateway that injects tenant/account context.
- **File storage**: S3-compatible bucket (e.g., Cloudflare R2) accessed through a media service that signs upload URLs and stores references in `file_assets`. Virus scanning performed asynchronously via a moderation queue.
- **Queues**: BullMQ + Redis for moderation (anti-abuse scans, review approvals), notifications (email/SMS via Resend/Twilio), and billing webhooks.
- **Observability**: OpenTelemetry tracing with logs shipped to the preferred APM (Datadog/OTel collector). Feature modules emit structured audit events for access to sensitive tables.

## Module responsibilities
- **Accounts & Users**: Manage tenants, roles, permissions, invites, and audit trails. All feature tables reference `account_id`.
- **Leads & Quote Requests**: Capture inbound marketing leads and formal quote requests, link them to `properties` and `service_areas`, and surface to contractors according to RBAC and service coverage rules.
- **Properties**: Normalize property metadata (location, geocode, ownership) with file attachments for photos/blueprints.
- **Estimates & Jobs**: Draft estimates, revision history, acceptance workflow; promote accepted estimates into jobs with scheduling and change orders.
- **Invoices & Payments**: Create invoices from jobs, track payment intents/receipts from Stripe, and lock invoices after reconciliation.
- **Contractor Profiles & Service Areas**: Publish contractor capabilities, compliance documents, insurance files, and availability. Service areas store geofences/zips for routing leads.
- **Bid Responses & Reviews**: Contractors respond to quote requests; reviewers post ratings/comments that route through moderation. Auto-detect unsafe content before publishing.
- **Moderation**: Handles review vetting, suspicious lead detection, file scanning, and RBAC-sensitive events (admin-only actions, escalations).

## API and client integration
- **OpenAPI contract**: `openapi.yaml` enumerates REST routes. NestJS controllers should implement the contract and surface typed DTOs to the Next.js client via generated SDKs.
- **Authentication**: Client obtains tokens through `/auth/login` or `/auth/refresh` and stores them in `httpOnly` cookies. Client SDK sends bearer tokens; server actions use the session cookie.
- **Form submission replacement**: Netlify forms are removed. The React app posts to `POST /quote-requests` and `POST /estimates` using the authenticated API client (see `src/utils/apiClient.ts`). Responses return created records and IDs for further workflows (e.g., scheduling callbacks).
- **Files**: Upload flows request a signed URL from `POST /files/sign-upload`, upload directly to storage, then finalize with `POST /files` referencing the created asset ID. Records like `properties`, `estimates`, and `reviews` link to these assets.

## Multi-environment deployment
- **Local**: Docker Compose (Postgres, Redis, MinIO, Mailpit). NestJS runs on port 4000; Next.js on 3000. Seed data uses the migrations in this folder.
- **Preview**: GitHub Actions builds containers, applies migrations, and seeds RBAC fixtures. Feature flags enable/disable moderation rules.
- **Production**: Render/Fly.io for the API and Edge CDN for Next.js static assets. Automated rollbacks on failed health checks. Secrets stored in Vault/SOPS.

## Data protection
- PII is scoped to accounts and encrypted at rest (Postgres TDE or column-level encryption for phone/email fields). Access to leads, bids, invoices, and reviews is audited.
- Background jobs redact payloads in logs and only store IDs when possible.

## Migration notes
- Run `001_core_tables.sql` followed by `002_indexes_and_constraints.sql` to apply the baseline schema.
- Use a migration tool such as Prisma Migrate or TypeORM migrations to manage future changes; mirror the SQL definitions provided here to maintain parity.

## Moderation queues
- **Review moderation**: triggered on `reviews` insert/update; stores tasks in `moderation_queue` with status tracking.
- **File scanning**: `file_assets` uploads enqueue a scan job. If flagged, the asset is quarantined and linked records are soft-blocked until cleared.

## Testing strategy
- API contract tests derived from `openapi.yaml` via Dredd/Newman.
- RBAC guard tests ensuring least-privilege access on all controllers.
- E2E flows: authenticated user submits quote request → contractor bid → homeowner accepts → job → invoice → payment → review with moderation.
