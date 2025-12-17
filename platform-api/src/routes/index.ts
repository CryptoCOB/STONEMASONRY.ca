import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { pool } from '../db/pool.js';
import { logAudit } from '../utils/audit.js';
import { hashPassword } from '../utils/passwords.js';

const accountIdFromRequest = (request: any) => request.user?.account_id || process.env.DEFAULT_ACCOUNT_ID || null;
const actorIdFromRequest = (request: any) => request.user?.id || null;
const publicIngestKey = process.env.PUBLIC_API_KEY;
const leadStatuses = ['new', 'contacted', 'site_visit', 'estimate_sent', 'won', 'lost'] as const;
const followUpStatuses = ['pending', 'done'] as const;
const jobTaskStatuses = ['pending', 'in_progress', 'done'] as const;
const invoiceStatuses = ['draft', 'sent', 'paid', 'overdue', 'void'] as const;

const requireAccountContext = (request: any, reply: any) => {
  const accountId = accountIdFromRequest(request);

  if (!accountId) {
    reply.status(400).send({ message: 'Account context required' });
    return null;
  }

  return accountId;
};

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
    await logAudit({
      accountId: res.rows[0].id,
      actorId: actorIdFromRequest(request),
      action: 'account:create',
      entityType: 'account',
      entityId: res.rows[0].id,
      meta: { name, status: status || 'active' }
    });
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
    await logAudit({
      accountId: account_id,
      actorId: actorIdFromRequest(request),
      action: 'user:create',
      entityType: 'user',
      entityId: res.rows[0].id,
      meta: { email, role, first_name: first_name || null, last_name: last_name || null }
    });
    return res.rows[0];
  });

  fastify.get('/api/users', { preHandler: fastify.requireRole(['admin']) }, async (request, reply) => {
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const res = await pool.query(
      'SELECT id, account_id, email, first_name, last_name, role, created_at FROM users WHERE account_id=$1 ORDER BY created_at DESC',
      [accountId]
    );
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
    schema: {
      body: z.object({
        source: z.string().optional(),
        contact_name: z.string(),
        contact_email: z.string().email(),
        contact_phone: z.string().optional(),
        service_area_id: z.string().optional(),
        property_id: z.string().optional(),
        notes: z.string().optional(),
        tags: z.array(z.string()).optional()
      })
    }
  }, async (request) => {
    const { source, contact_name, contact_email, contact_phone, service_area_id, property_id, notes, tags } = request.body as any;
    const accountId = accountIdFromRequest(request);
    const res = await pool.query(
      'INSERT INTO leads (account_id, source, contact_name, contact_email, contact_phone, service_area_id, property_id, notes, tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [accountId, source || null, contact_name, contact_email, contact_phone || null, service_area_id || null, property_id || null, notes || null, tags || []]
    );
    await logAudit({
      accountId,
      actorId: actorIdFromRequest(request),
      action: 'lead:create',
      entityType: 'lead',
      entityId: res.rows[0].id,
      meta: { source: source || null, tags: tags || [] }
    });
    return res.rows[0];
  });

  fastify.patch('/api/leads/:id/status', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        status: z.enum(leadStatuses as [string, ...string[]]),
        notes: z.string().optional(),
        tags: z.array(z.string()).optional(),
        reason: z.string().optional()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, notes, tags, reason } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const lead = await pool.query('SELECT * FROM leads WHERE id=$1', [id]);
    if (!lead.rows[0]) {
      return reply.status(404).send({ message: 'Lead not found' });
    }

    if (lead.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Lead not in account scope' });
    }

    const existing = lead.rows[0];
    const nextNotes = typeof notes === 'undefined' ? existing.notes : notes;
    const nextTags = typeof tags === 'undefined' ? existing.tags || [] : tags;
    const nextReason = typeof reason === 'undefined' ? existing.status_reason : reason;

    const updated = await pool.query(
      'UPDATE leads SET status=$1, notes=$2, tags=$3, status_reason=$4 WHERE id=$5 RETURNING *',
      [status, nextNotes || null, nextTags, nextReason || null, id]
    );

    await logAudit({
      accountId: existing.account_id,
      actorId: actorIdFromRequest(request),
      action: 'lead:status_update',
      entityType: 'lead',
      entityId: id,
      meta: { previous_status: existing.status, status, reason: nextReason || null }
    });

    return updated.rows[0];
  });

  fastify.post('/api/leads/:id/follow-ups', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { params: z.object({ id: z.string() }), body: z.object({ due_at: z.string(), note: z.string().optional() }) }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { due_at, note } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const lead = await pool.query('SELECT account_id FROM leads WHERE id=$1', [id]);

    if (!lead.rows[0]) {
      return reply.status(404).send({ message: 'Lead not found' });
    }

    if (lead.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Lead not in account scope' });
    }

    const res = await pool.query(
      'INSERT INTO lead_followups (lead_id, due_at, note) VALUES ($1, $2, $3) RETURNING *',
      [id, due_at, note || null]
    );

    await logAudit({
      accountId: lead.rows[0].account_id,
      actorId: actorIdFromRequest(request),
      action: 'lead_followup:create',
      entityType: 'lead_followup',
      entityId: res.rows[0].id,
      meta: { lead_id: id, due_at }
    });

    return res.rows[0];
  });

  fastify.get('/api/leads/:id/follow-ups', { preHandler: fastify.requireRole(['admin', 'member']), schema: { params: z.object({ id: z.string() }) } }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const lead = await pool.query('SELECT account_id FROM leads WHERE id=$1', [id]);

    if (!lead.rows[0]) {
      return reply.status(404).send({ message: 'Lead not found' });
    }

    if (lead.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Lead not in account scope' });
    }

    const res = await pool.query('SELECT * FROM lead_followups WHERE lead_id=$1 ORDER BY due_at', [id]);
    return res.rows;
  });

  fastify.patch('/api/leads/:leadId/follow-ups/:followUpId', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: {
      params: z.object({ leadId: z.string(), followUpId: z.string() }),
      body: z.object({ status: z.enum(followUpStatuses as [string, ...string[]]), note: z.string().optional() })
    }
  }, async (request, reply) => {
    const { leadId, followUpId } = request.params as { leadId: string; followUpId: string };
    const { status, note } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const lead = await pool.query('SELECT account_id FROM leads WHERE id=$1', [leadId]);

    if (!lead.rows[0]) {
      return reply.status(404).send({ message: 'Lead not found' });
    }

    if (lead.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Lead not in account scope' });
    }

    const res = await pool.query(
      'UPDATE lead_followups SET status=$1, note=COALESCE($2, note), completed_at=CASE WHEN $1=$3 THEN now() ELSE NULL END WHERE id=$4 AND lead_id=$5 RETURNING *',
      [status, note || null, 'done', followUpId, leadId]
    );

    if (!res.rows[0]) {
      return reply.status(404).send({ message: 'Follow-up not found' });
    }

    await logAudit({
      accountId: lead.rows[0].account_id,
      actorId: actorIdFromRequest(request),
      action: 'lead_followup:update',
      entityType: 'lead_followup',
      entityId: followUpId,
      meta: { lead_id: leadId, status }
    });

    return res.rows[0];
  });

  fastify.post('/api/quote-requests', {
    preHandler: ingestGuard,
    schema: {
      body: z.object({
        contact_name: z.string(),
        contact_email: z.string().email(),
        contact_phone: z.string().optional(),
        project_type: z.string(),
        description: z.string(),
        budget: z.number().optional(),
        service_area_id: z.string().optional(),
        idempotency_key: z.string().optional()
      })
    }
  }, async (request) => {
    const { contact_name, contact_email, contact_phone, project_type, description, budget, service_area_id, idempotency_key } = request.body as any;
    const accountId = accountIdFromRequest(request);

    if (idempotency_key) {
      const existing = await pool.query('SELECT * FROM quote_requests WHERE account_id=$1 AND idempotency_key=$2', [accountId, idempotency_key]);
      if (existing.rows[0]) {
        return { quote_request: existing.rows[0], idempotent: true };
      }
    }

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
        'INSERT INTO quote_requests (account_id, property_id, lead_id, project_type, description, budget, submitted_by, submitted_email, submitted_phone, source, idempotency_key) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
        [accountId, property.rows[0].id, lead.rows[0].id, project_type, description, budget || null, contact_name, contact_email, contact_phone || null, 'website', idempotency_key || null]
      );
      await client.query('COMMIT');
      const leadId = lead.rows[0].id;
      const quoteId = quote.rows[0].id;

      await logAudit({
        accountId,
        actorId: actorIdFromRequest(request),
        action: 'lead:create',
        entityType: 'lead',
        entityId: leadId,
        meta: { source: 'website', quote_request_id: quoteId }
      });

      await logAudit({
        accountId,
        actorId: actorIdFromRequest(request),
        action: 'quote_request:intake',
        entityType: 'quote_request',
        entityId: quoteId,
        meta: { idempotency_key: idempotency_key || null, project_type }
      });

      return { quote_request: quote.rows[0] };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  });

  fastify.get('/api/quote-requests', { preHandler: fastify.requireRole(['admin', 'member']) }, async (request, reply) => {
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const res = await pool.query('SELECT * FROM quote_requests WHERE account_id=$1 ORDER BY created_at DESC', [accountId]);
    return res.rows;
  });

  fastify.post('/api/bid-responses', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ quote_request_id: z.string(), contractor_profile_id: z.string().optional(), amount: z.number(), notes: z.string().optional(), status: z.string().optional() }) }
  }, async (request, reply) => {
    const { quote_request_id, contractor_profile_id, amount, notes, status } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const quoteRequest = await pool.query('SELECT account_id FROM quote_requests WHERE id=$1', [quote_request_id]);

    if (!quoteRequest.rows[0]) {
      return reply.status(404).send({ message: 'Quote request not found' });
    }

    if (quoteRequest.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Quote request not in account scope' });
    }

    const res = await pool.query(
      'INSERT INTO bid_responses (quote_request_id, contractor_profile_id, amount, notes, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [quote_request_id, contractor_profile_id || null, amount, notes || null, status || 'draft']
    );
    return res.rows[0];
  });

  fastify.post('/api/estimates', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ quote_request_id: z.string().optional(), property_id: z.string().optional(), total_amount: z.number(), prepared_by: z.string().optional(), details: z.record(z.any()).optional(), status: z.string().optional() }) }
  }, async (request, reply) => {
    const { quote_request_id, property_id, total_amount, prepared_by, details, status } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    if (quote_request_id) {
      const quote = await pool.query('SELECT account_id FROM quote_requests WHERE id=$1', [quote_request_id]);
      if (!quote.rows[0]) {
        return reply.status(404).send({ message: 'Quote request not found' });
      }
      if (quote.rows[0].account_id !== accountId) {
        return reply.status(403).send({ message: 'Quote request not in account scope' });
      }
    }

    if (property_id) {
      const property = await pool.query('SELECT account_id FROM properties WHERE id=$1', [property_id]);
      if (!property.rows[0]) {
        return reply.status(404).send({ message: 'Property not found' });
      }
      if (property.rows[0].account_id !== accountId) {
        return reply.status(403).send({ message: 'Property not in account scope' });
      }
    }
    const res = await pool.query(
      'INSERT INTO estimates (account_id, quote_request_id, property_id, total_amount, prepared_by, details, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [accountId, quote_request_id || null, property_id || null, total_amount, prepared_by || null, details || {}, status || 'draft']
    );
    return res.rows[0];
  });

  fastify.post('/api/jobs', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { body: z.object({ estimate_id: z.string().optional(), property_id: z.string().optional(), status: z.string().optional(), start_date: z.string().optional(), end_date: z.string().optional(), supervisor_id: z.string().optional() }) }
  }, async (request, reply) => {
    const { estimate_id, property_id, status, start_date, end_date, supervisor_id } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    if (estimate_id) {
      const estimate = await pool.query('SELECT account_id FROM estimates WHERE id=$1', [estimate_id]);
      if (!estimate.rows[0]) {
        return reply.status(404).send({ message: 'Estimate not found' });
      }
      if (estimate.rows[0].account_id !== accountId) {
        return reply.status(403).send({ message: 'Estimate not in account scope' });
      }
    }

    if (property_id) {
      const property = await pool.query('SELECT account_id FROM properties WHERE id=$1', [property_id]);
      if (!property.rows[0]) {
        return reply.status(404).send({ message: 'Property not found' });
      }
      if (property.rows[0].account_id !== accountId) {
        return reply.status(403).send({ message: 'Property not in account scope' });
      }
    }
    const res = await pool.query(
      'INSERT INTO jobs (account_id, estimate_id, property_id, status, start_date, end_date, supervisor_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [accountId, estimate_id || null, property_id || null, status || 'scheduled', start_date || null, end_date || null, supervisor_id || null]
    );
    return res.rows[0];
  });

  fastify.get('/api/dashboard/summary', { preHandler: fastify.requireRole(['admin', 'member']) }, async (request, reply) => {
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const [pendingLeads, todaysJobs, overdueInvoices] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM leads WHERE account_id=$1 AND status IN ('new','contacted')", [accountId]),
      pool.query(
        "SELECT COUNT(*)::int AS count FROM jobs WHERE account_id=$1 AND start_date <= CURRENT_DATE AND (end_date IS NULL OR end_date >= CURRENT_DATE)",
        [accountId]
      ),
      pool.query(
        "SELECT COUNT(*)::int AS count FROM invoices JOIN jobs ON invoices.job_id = jobs.id WHERE jobs.account_id=$1 AND invoices.due_date < CURRENT_DATE AND invoices.status NOT IN ('paid','void')",
        [accountId]
      )
    ]);

    return {
      pending_leads: pendingLeads.rows[0]?.count || 0,
      todays_jobs: todaysJobs.rows[0]?.count || 0,
      overdue_invoices: overdueInvoices.rows[0]?.count || 0
    };
  });

  fastify.post('/api/jobs/:jobId/tasks', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: {
      params: z.object({ jobId: z.string() }),
      body: z.object({
        description: z.string(),
        due_date: z.string().optional(),
        assigned_to: z.string().optional(),
        status: z.enum(jobTaskStatuses as [string, ...string[]]).optional()
      })
    }
  }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const { description, due_date, assigned_to, status } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const job = await pool.query('SELECT account_id FROM jobs WHERE id=$1', [jobId]);

    if (!job.rows[0]) {
      return reply.status(404).send({ message: 'Job not found' });
    }

    if (job.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Job not in account scope' });
    }

    const res = await pool.query(
      'INSERT INTO job_tasks (account_id, job_id, description, due_date, assigned_to, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [job.rows[0].account_id, jobId, description, due_date || null, assigned_to || null, status || 'pending']
    );

    await logAudit({
      accountId: job.rows[0].account_id,
      actorId: actorIdFromRequest(request),
      action: 'job_task:create',
      entityType: 'job_task',
      entityId: res.rows[0].id,
      meta: { job_id: jobId, status: status || 'pending' }
    });

    return res.rows[0];
  });

  fastify.get('/api/jobs/:jobId/tasks', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: { params: z.object({ jobId: z.string() }) }
  }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const job = await pool.query('SELECT account_id FROM jobs WHERE id=$1', [jobId]);

    if (!job.rows[0]) {
      return reply.status(404).send({ message: 'Job not found' });
    }

    if (job.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Job not in account scope' });
    }

    const res = await pool.query('SELECT * FROM job_tasks WHERE job_id=$1 ORDER BY due_date NULLS LAST, created_at', [jobId]);
    return res.rows;
  });

  fastify.patch('/api/jobs/:jobId/tasks/:taskId', {
    preHandler: fastify.requireRole(['admin', 'member']),
    schema: {
      params: z.object({ jobId: z.string(), taskId: z.string() }),
      body: z.object({
        description: z.string().optional(),
        due_date: z.string().optional(),
        assigned_to: z.string().optional(),
        status: z.enum(jobTaskStatuses as [string, ...string[]]).optional()
      })
    }
  }, async (request, reply) => {
    const { jobId, taskId } = request.params as { jobId: string; taskId: string };
    const { description, due_date, assigned_to, status } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const job = await pool.query('SELECT account_id FROM jobs WHERE id=$1', [jobId]);

    if (!job.rows[0]) {
      return reply.status(404).send({ message: 'Job not found' });
    }

    if (job.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Job not in account scope' });
    }

    const existing = await pool.query('SELECT * FROM job_tasks WHERE id=$1 AND job_id=$2', [taskId, jobId]);

    if (!existing.rows[0]) {
      return reply.status(404).send({ message: 'Task not found' });
    }

    const nextDescription = typeof description === 'undefined' ? existing.rows[0].description : description;
    const nextDueDate = typeof due_date === 'undefined' ? existing.rows[0].due_date : due_date || null;
    const nextAssignedTo = typeof assigned_to === 'undefined' ? existing.rows[0].assigned_to : assigned_to || null;
    const nextStatus = typeof status === 'undefined' ? existing.rows[0].status : status;

    const res = await pool.query(
      'UPDATE job_tasks SET description=$1, due_date=$2, assigned_to=$3, status=$4 WHERE id=$5 AND job_id=$6 RETURNING *',
      [nextDescription, nextDueDate, nextAssignedTo, nextStatus, taskId, jobId]
    );

    await logAudit({
      accountId: job.rows[0].account_id,
      actorId: actorIdFromRequest(request),
      action: 'job_task:update',
      entityType: 'job_task',
      entityId: taskId,
      meta: { job_id: jobId, status: res.rows[0].status }
    });

    return res.rows[0];
  });

  fastify.post('/api/invoices', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ job_id: z.string(), amount: z.number(), due_date: z.string().optional(), status: z.enum(invoiceStatuses as [string, ...string[]]).optional() }) }
  }, async (request, reply) => {
    const { job_id, amount, due_date, status } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const job = await pool.query('SELECT account_id FROM jobs WHERE id=$1', [job_id]);

    if (!job.rows[0]) {
      return reply.status(404).send({ message: 'Job not found' });
    }

    if (job.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Job not in account scope' });
    }

    const res = await pool.query('INSERT INTO invoices (job_id, amount, due_date, status) VALUES ($1,$2,$3,$4) RETURNING *', [job_id, amount, due_date || null, status || 'draft']);

    await logAudit({
      accountId: job.rows[0].account_id,
      actorId: actorIdFromRequest(request),
      action: 'invoice:create',
      entityType: 'invoice',
      entityId: res.rows[0].id,
      meta: { job_id, amount, status: status || 'draft', due_date: due_date || null }
    });

    return res.rows[0];
  });

  fastify.post('/api/payments', {
    preHandler: fastify.requireRole(['admin']),
    schema: { body: z.object({ invoice_id: z.string(), amount: z.number(), paid_at: z.string().optional(), method: z.string().optional(), reference: z.string().optional(), status: z.string().optional() }) }
  }, async (request, reply) => {
    const { invoice_id, amount, paid_at, method, reference, status } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const invoice = await pool.query(
      'SELECT invoices.id, jobs.account_id FROM invoices JOIN jobs ON invoices.job_id = jobs.id WHERE invoices.id=$1',
      [invoice_id]
    );

    if (!invoice.rows[0]) {
      return reply.status(404).send({ message: 'Invoice not found' });
    }

    if (invoice.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Invoice not in account scope' });
    }

    const res = await pool.query(
      'INSERT INTO payments (account_id, invoice_id, amount, paid_at, method, reference, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [invoice.rows[0].account_id, invoice_id, amount, paid_at || null, method || null, reference || null, status || 'pending']
    );

    await logAudit({
      accountId: invoice.rows[0].account_id,
      actorId: actorIdFromRequest(request),
      action: 'payment:create',
      entityType: 'payment',
      entityId: res.rows[0].id,
      meta: { invoice_id, amount, method: method || null, status: status || 'pending' }
    });

    return res.rows[0];
  });

  fastify.patch('/api/invoices/:id/status', {
    preHandler: fastify.requireRole(['admin']),
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({ status: z.enum(invoiceStatuses as [string, ...string[]]), due_date: z.string().optional() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, due_date } = request.body as any;
    const accountId = requireAccountContext(request, reply);

    if (!accountId) return;

    const invoice = await pool.query(
      'SELECT invoices.*, jobs.account_id FROM invoices JOIN jobs ON invoices.job_id = jobs.id WHERE invoices.id=$1',
      [id]
    );

    if (!invoice.rows[0]) {
      return reply.status(404).send({ message: 'Invoice not found' });
    }

    if (invoice.rows[0].account_id !== accountId) {
      return reply.status(403).send({ message: 'Invoice not in account scope' });
    }

    const nextDueDate = typeof due_date === 'undefined' ? invoice.rows[0].due_date : due_date || null;
    const res = await pool.query('UPDATE invoices SET status=$1, due_date=$2 WHERE id=$3 RETURNING *', [status, nextDueDate, id]);

    await logAudit({
      accountId: invoice.rows[0].account_id,
      actorId: actorIdFromRequest(request),
      action: 'invoice:status_update',
      entityType: 'invoice',
      entityId: id,
      meta: { status, due_date: nextDueDate }
    });

    return res.rows[0];
  });

  fastify.get('/api/audit-logs', {
    preHandler: fastify.requireRole(['admin']),
    schema: { querystring: z.object({ entity_type: z.string().optional(), entity_id: z.string().optional(), limit: z.number().int().min(1).max(200).default(50) }) }
  }, async (request, reply) => {
    const { entity_type, entity_id, limit } = request.query as { entity_type?: string; entity_id?: string; limit: number };
    const accountId = accountIdFromRequest(request);

    if (!accountId) {
      return reply.status(400).send({ message: 'Account context required' });
    }

    const conditions = ['account_id = $1'];
    const params: Array<string | number> = [accountId];

    if (entity_type) {
      conditions.push('entity_type = $' + (params.length + 1));
      params.push(entity_type);
    }

    if (entity_id) {
      conditions.push('entity_id = $' + (params.length + 1));
      params.push(entity_id);
    }

    params.push(limit);
    const sql = `SELECT * FROM audit_logs WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT $${params.length}`;
    const res = await pool.query(sql, params);
    return res.rows;
  });

  fastify.post('/api/reviews', {
    preHandler: ingestGuard,
    schema: { body: z.object({ job_id: z.string().optional(), rating: z.number().min(1).max(5), comments: z.string().optional(), submitted_by: z.string().optional(), submitted_email: z.string().email().optional() }) }
  }, async (request, reply) => {
    const { job_id, rating, comments, submitted_by, submitted_email } = request.body as any;
    const requestAccountId = accountIdFromRequest(request);

    if (!requestAccountId && !job_id) {
      return reply.status(400).send({ message: 'Account context or job_id is required to submit a review' });
    }

    let accountId = requestAccountId;

    if (job_id) {
      const job = await pool.query('SELECT account_id FROM jobs WHERE id=$1', [job_id]);

      if (!job.rows[0]) {
        return reply.status(404).send({ message: 'Job not found' });
      }

      if (requestAccountId && requestAccountId !== job.rows[0].account_id) {
        return reply.status(403).send({ message: 'Job not in account scope' });
      }

      accountId = job.rows[0].account_id;
    }

    if (!accountId) {
      return reply.status(400).send({ message: 'Account context required' });
    }

    const res = await pool.query(
      'INSERT INTO reviews (account_id, job_id, rating, comments, submitted_by, submitted_email) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [accountId, job_id || null, rating, comments || null, submitted_by || null, submitted_email || null]
    );
    await pool.query('INSERT INTO moderation_queue (entity_type, entity_id, reason, status) VALUES ($1,$2,$3,$4)', ['review', res.rows[0].id, 'auto-moderation', 'pending']);

    await logAudit({
      accountId,
      actorId: actorIdFromRequest(request),
      action: 'review:create',
      entityType: 'review',
      entityId: res.rows[0].id,
      meta: { job_id: job_id || null, rating }
    });

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
