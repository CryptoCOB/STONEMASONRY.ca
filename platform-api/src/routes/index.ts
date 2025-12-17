import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { pool } from '../db/pool.js';
import { hashPassword } from '../utils/passwords.js';

const accountIdFromRequest = (request: any) => request.user?.account_id || process.env.DEFAULT_ACCOUNT_ID || null;
const publicIngestKey = process.env.PUBLIC_API_KEY;

const ingestGuard = async (request: any, reply: any) => {
  if (!publicIngestKey) return;
  const headerKey = request.headers['x-api-key'];
  if (headerKey !== publicIngestKey) {
    return reply.status(401).send({ message: 'Invalid ingest key' });
  }
};

export async function registerRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>();

  fastify.post('/api/accounts', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ name: z.string(), status: z.string().optional() }) }
  }, async (request) => {
    const { name, status } = request.body as { name: string; status?: string };
    const res = await pool.query('INSERT INTO accounts (name, status) VALUES ($1, $2) RETURNING *', [name, status || 'active']);
    return res.rows[0];
  });

  fastify.post('/api/users', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ account_id: z.string(), email: z.string().email(), password: z.string(), first_name: z.string().optional(), last_name: z.string().optional(), role: z.string().default('member') }) }
  }, async (request) => {
    const { account_id, email, password, first_name, last_name, role } = request.body as any;
    const passwordHash = hashPassword(password);
    const res = await pool.query(
      'INSERT INTO users (account_id, email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, account_id, email, first_name, last_name, role',
      [account_id, email, passwordHash, first_name || null, last_name || null, role]
    );
    return res.rows[0];
  });

  fastify.get('/api/users', { preHandler: fastify.requireRole(['admin']) }, async () => {
    const res = await pool.query('SELECT id, account_id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC');
    return res.rows;
  });

  fastify.post('/api/service-areas', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ name: z.string(), region: z.string().optional(), postal_codes: z.array(z.string()).optional() }) }
  }, async (request) => {
    const { name, region, postal_codes } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const res = await pool.query('INSERT INTO service_areas (account_id, name, region, postal_codes) VALUES ($1, $2, $3, $4) RETURNING *', [accountId, name, region || null, postal_codes || null]);
    return res.rows[0];
  });

  fastify.post('/api/properties', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ owner_name: z.string().optional(), address_line1: z.string(), address_line2: z.string().optional(), city: z.string(), province: z.string(), postal_code: z.string(), service_area_id: z.string().optional() }) }
  }, async (request) => {
    const { owner_name, address_line1, address_line2, city, province, postal_code, service_area_id } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const res = await pool.query(
      'INSERT INTO properties (account_id, owner_name, address_line1, address_line2, city, province, postal_code, service_area_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [accountId, owner_name || null, address_line1, address_line2 || null, city, province, postal_code, service_area_id || null]
    );
    return res.rows[0];
  });

  fastify.post('/api/contractor-profiles', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ user_id: z.string().optional(), bio: z.string().optional(), capabilities: z.array(z.string()).optional(), service_area_id: z.string().optional(), insurance_verified: z.boolean().optional() }) }
  }, async (request) => {
    const { user_id, bio, capabilities, service_area_id, insurance_verified } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const res = await pool.query(
      'INSERT INTO contractor_profiles (account_id, user_id, bio, capabilities, service_area_id, insurance_verified) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [accountId, user_id || null, bio || null, capabilities || null, service_area_id || null, insurance_verified ?? false]
    );
    return res.rows[0];
  });

  fastify.post('/api/leads', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ source: z.string().optional(), contact_name: z.string(), contact_email: z.string().email(), contact_phone: z.string().optional(), service_area_id: z.string().optional(), property_id: z.string().optional(), notes: z.string().optional() }) }
  }, async (request) => {
    const { source, contact_name, contact_email, contact_phone, service_area_id, property_id, notes } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const res = await pool.query(
      'INSERT INTO leads (account_id, source, contact_name, contact_email, contact_phone, service_area_id, property_id, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [accountId, source || null, contact_name, contact_email, contact_phone || null, service_area_id || null, property_id || null, notes || null]
    );
    return res.rows[0];
  });

  fastify.post('/api/quote-requests', {
    preHandler: ingestGuard,
    schema: { body: z.object({ contact_name: z.string(), contact_email: z.string().email(), contact_phone: z.string().optional(), project_type: z.string(), description: z.string(), budget: z.number().optional(), service_area_id: z.string().optional() }) }
  }, async (request) => {
    const { contact_name, contact_email, contact_phone, project_type, description, budget, service_area_id } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const property = await client.query(
        'INSERT INTO properties (account_id, owner_name, address_line1, city, province, postal_code, service_area_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
        [accountId, contact_name, 'TBD', 'TBD', 'ON', 'TBD', service_area_id || null]
      );
      const lead = await client.query(
        'INSERT INTO leads (account_id, source, contact_name, contact_email, contact_phone, service_area_id, property_id, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
        [accountId, 'website', contact_name, contact_email, contact_phone || null, service_area_id || null, property.rows[0].id, 'new']
      );
      const quote = await client.query(
        'INSERT INTO quote_requests (account_id, property_id, lead_id, project_type, description, budget, submitted_by, submitted_email, submitted_phone, source) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
        [accountId, property.rows[0].id, lead.rows[0].id, project_type, description, budget || null, contact_name, contact_email, contact_phone || null, 'website']
      );
      await client.query('COMMIT');
      return { quote_request: quote.rows[0] };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  });

  fastify.get('/api/quote-requests', { preHandler: fastify.requireRole(['admin', 'member']) }, async () => {
    const res = await pool.query('SELECT * FROM quote_requests ORDER BY created_at DESC');
    return res.rows;
  });

  fastify.post('/api/bid-responses', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ quote_request_id: z.string(), contractor_profile_id: z.string().optional(), amount: z.number(), notes: z.string().optional(), status: z.string().optional() }) }
  }, async (request) => {
    const { quote_request_id, contractor_profile_id, amount, notes, status } = request.body as any;
    const res = await pool.query(
      'INSERT INTO bid_responses (quote_request_id, contractor_profile_id, amount, notes, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [quote_request_id, contractor_profile_id || null, amount, notes || null, status || 'draft']
    );
    return res.rows[0];
  });

  fastify.post('/api/estimates', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ quote_request_id: z.string().optional(), property_id: z.string().optional(), total_amount: z.number(), prepared_by: z.string().optional(), details: z.record(z.any()).optional(), status: z.string().optional() }) }
  }, async (request) => {
    const { quote_request_id, property_id, total_amount, prepared_by, details, status } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const res = await pool.query(
      'INSERT INTO estimates (account_id, quote_request_id, property_id, total_amount, prepared_by, details, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [accountId, quote_request_id || null, property_id || null, total_amount, prepared_by || null, details || {}, status || 'draft']
    );
    return res.rows[0];
  });

  fastify.post('/api/jobs', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ estimate_id: z.string().optional(), property_id: z.string().optional(), status: z.string().optional(), start_date: z.string().optional(), end_date: z.string().optional(), supervisor_id: z.string().optional() }) }
  }, async (request) => {
    const { estimate_id, property_id, status, start_date, end_date, supervisor_id } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const res = await pool.query(
      'INSERT INTO jobs (account_id, estimate_id, property_id, status, start_date, end_date, supervisor_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [accountId, estimate_id || null, property_id || null, status || 'scheduled', start_date || null, end_date || null, supervisor_id || null]
    );
    return res.rows[0];
  });

  fastify.post('/api/invoices', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ job_id: z.string(), amount: z.number(), due_date: z.string().optional(), status: z.string().optional() }) }
  }, async (request) => {
    const { job_id, amount, due_date, status } = request.body as any;
    const res = await pool.query('INSERT INTO invoices (job_id, amount, due_date, status) VALUES ($1,$2,$3,$4) RETURNING *', [job_id, amount, due_date || null, status || 'draft']);
    return res.rows[0];
  });

  fastify.post('/api/payments', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ invoice_id: z.string(), amount: z.number(), paid_at: z.string().optional(), method: z.string().optional(), reference: z.string().optional(), status: z.string().optional() }) }
  }, async (request) => {
    const { invoice_id, amount, paid_at, method, reference, status } = request.body as any;
    const res = await pool.query('INSERT INTO payments (invoice_id, amount, paid_at, method, reference, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [invoice_id, amount, paid_at || null, method || null, reference || null, status || 'pending']);
    return res.rows[0];
  });

  fastify.post('/api/reviews', {
    preHandler: ingestGuard,
    schema: { body: z.object({ job_id: z.string().optional(), rating: z.number().min(1).max(5), comments: z.string().optional(), submitted_by: z.string().optional(), submitted_email: z.string().email().optional() }) }
  }, async (request) => {
    const { job_id, rating, comments, submitted_by, submitted_email } = request.body as any;
    const res = await pool.query(
      'INSERT INTO reviews (job_id, rating, comments, submitted_by, submitted_email) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [job_id || null, rating, comments || null, submitted_by || null, submitted_email || null]
    );
    await pool.query('INSERT INTO moderation_queue (entity_type, entity_id, reason, status) VALUES ($1,$2,$3,$4)', ['review', res.rows[0].id, 'auto-moderation', 'pending']);
    return res.rows[0];
  });

  fastify.post('/api/moderation/decision', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ entity_id: z.string(), status: z.string(), reviewer_id: z.string().optional() }) }
  }, async (request) => {
    const { entity_id, status, reviewer_id } = request.body as any;
    await pool.query('UPDATE moderation_queue SET status=$1, reviewer_id=$2 WHERE entity_id=$3', [status, reviewer_id || null, entity_id]);
    return { updated: true };
  });
}
