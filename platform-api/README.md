# Platform API (Fastify + Postgres)

Service architecture designed for authenticated workflows, RBAC, file storage metadata, and CRM-style entities for Simcoe Stone operations.

## Stack
- **Fastify** with Zod validation for typed request/response schemas
- **Postgres** for relational data (see `src/db/migrations/001_initial.sql`)
- **JWT** auth with role-based guards (`plugins/auth.ts`)
- **API key** or default account support via `PUBLIC_API_KEY` + `DEFAULT_ACCOUNT_ID` for unauthenticated capture flows
- **File metadata** table for referencing object storage (S3/Backblaze/etc.)

## Running locally
1. Create a Postgres database and set `DATABASE_URL` in a `.env` file. Include `PUBLIC_API_KEY` for intake endpoints and `DEFAULT_ACCOUNT_ID` to attribute unauthenticated requests.
2. Install dependencies and run migrations:
   ```bash
   npm install
   npm run migrate
   ```
3. Start the API:
   ```bash
   npm run dev
   ```

## Auth & RBAC
- `POST /api/auth/login` issues JWTs for valid user credentials.
- Protected routes use `fastify.requireRole([...])` to enforce roles (e.g., `admin` for billing, `member` for operations).
- Public capture routes (quote requests and reviews) can rely on `DEFAULT_ACCOUNT_ID` for associating inbound data to an account while still supporting authenticated calls when tokens are present.

## Key endpoints
- Accounts/Users: `/api/accounts`, `/api/users`, `/api/auth/login`
- Territory & workforce: `/api/service-areas`, `/api/contractor-profiles`
- Core CRM: `/api/leads`, `/api/properties`, `/api/quote-requests`, `/api/bid-responses`
- Delivery: `/api/estimates`, `/api/jobs`, `/api/invoices`, `/api/payments`
- Reputation & trust: `/api/reviews`, `/api/moderation/decision`

See `src/routes/index.ts` for the full contract. Migrations establish the data model, including moderation queues and file metadata to support downstream storage adapters.
