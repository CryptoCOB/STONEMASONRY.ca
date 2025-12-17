# API Integration for Lead Capture

Netlify form posts have been replaced with authenticated API calls to the new platform service (`platform-api`).

## Frontend behavior
- `ContactForm` now calls `POST /api/quote-requests` with JSON payloads.
- `Estimate` routes all submissions to the same endpoint, attaching timeline, budget, and emergency context inside the description field.
- Requests include the optional `REACT_APP_PUBLIC_API_KEY` header and target `REACT_APP_API_BASE_URL` (defaults to `/api`).

## Required environment variables
Add a `.env` file next to `package.json` in `simcoe-stone-frontend`:

```
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_PUBLIC_API_KEY=public-ingest-or-gateway-key
```

## Server alignment
- The `platform-api` service exposes `/api/quote-requests`, `/api/leads`, `/api/properties`, and downstream routes for jobs, invoices, payments, and reviews.
- Use the `DEFAULT_ACCOUNT_ID` environment variable on the server to associate unauthenticated submissions to the correct account while JWT/RBAC protects operational endpoints.
