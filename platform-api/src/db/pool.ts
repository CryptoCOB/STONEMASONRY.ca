import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/stonemasonry';

export const pool = new Pool({
  connectionString,
  max: 10
});

export type DbClient = typeof pool extends { connect: (...args: any) => infer T } ? Awaited<ReturnType<typeof pool.connect>> : never;
