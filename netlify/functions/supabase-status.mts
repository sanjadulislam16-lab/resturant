import type { Config } from '@netlify/functions';
import pg from 'pg';

// Reports whether the site can reach the Supabase Postgres database configured in DATABASE_URL.
// When DATABASE_URL is not set yet, it returns a clearly labelled mock response instead of failing.

let pool: pg.Pool | null = null;

function getPool(connectionString: string): pg.Pool {
  if (pool) return pool;
  // Supabase's pooler certificate is not in Node's default CA bundle, so pg's strict
  // "sslmode=require" handling would reject it. Keep the connection encrypted, but skip CA verification.
  const url = new URL(connectionString);
  url.searchParams.delete('sslmode');
  pool = new pg.Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 10000,
  });
  return pool;
}

export default async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return Response.json({
      connected: false,
      mode: 'mock',
      message:
        'DATABASE_URL is not set. Add your Supabase Transaction pooler connection string as the DATABASE_URL environment variable and redeploy.',
      database: null,
      tables: [],
    });
  }

  try {
    const client = getPool(connectionString);
    const info = await client.query<{ database: string; version: string }>(
      'select current_database() as database, version() as version',
    );
    const tables = await client.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
    );
    return Response.json({
      connected: true,
      mode: 'supabase',
      message: 'Connected to Supabase Postgres.',
      database: info.rows[0]?.database ?? null,
      serverVersion: info.rows[0]?.version?.split(' ').slice(0, 2).join(' ') ?? null,
      tables: tables.rows.map((r) => r.table_name),
    });
  } catch (error) {
    console.error('Supabase connection failed', error);
    pool = null;
    return Response.json(
      {
        connected: false,
        mode: 'supabase',
        message:
          'DATABASE_URL is set but the connection failed. Check that it is the Transaction pooler URI (port 6543) with the correct password.',
        error: error instanceof Error ? error.message : String(error),
        database: null,
        tables: [],
      },
      { status: 503 },
    );
  }
};

export const config: Config = {
  path: '/api/supabase-status',
};
