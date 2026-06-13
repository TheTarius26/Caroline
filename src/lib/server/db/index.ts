import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new pg.Client({
	connectionString: env.DATABASE_URL
});

await pool.connect();
export const db = drizzle(pool, { schema });
