import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../db/pool.js';
import { verifyPassword } from '../utils/passwords.js';

export interface AuthUser {
  id: string;
  account_id: string | null;
  email: string;
  role: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void> | void;
    requireRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void> | void;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  if (!header) {
    return reply.status(401).send({ message: 'Missing authorization header' });
  }
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    request.user = payload;
  } catch (err) {
    return reply.status(401).send({ message: 'Invalid token' });
  }
}

function requireRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({ message: 'Forbidden' });
    }
  };
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate('authenticate', authenticate);
  fastify.decorate('requireRole', requireRole);

  fastify.post('/api/auth/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT id, account_id, email, password_hash, role FROM users WHERE email=$1', [email]);
      if (!res.rows[0]) {
        return reply.status(401).send({ message: 'Invalid credentials' });
      }
      const { password_hash, ...user } = res.rows[0];
      const valid = verifyPassword(password, password_hash);
      if (!valid) {
        return reply.status(401).send({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, account_id: user.account_id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
      return { token, user };
    } finally {
      client.release();
    }
  });
}

export default fp(authPlugin);
