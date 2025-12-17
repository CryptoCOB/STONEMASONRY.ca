import { pool } from '../db/pool.js';

interface AuditEvent {
  accountId: string | null;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  meta?: Record<string, any>;
}

export async function logAudit(event: AuditEvent) {
  const { accountId, actorId, action, entityType, entityId, meta } = event;
  if (!accountId) return;

  await pool.query(
    'INSERT INTO audit_logs (account_id, actor_id, action, entity_type, entity_id, meta) VALUES ($1, $2, $3, $4, $5, $6)',
    [accountId, actorId || null, action, entityType, entityId || null, meta || {}]
  );
}
