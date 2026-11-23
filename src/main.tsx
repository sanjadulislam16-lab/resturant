// Temporary placeholder entry point. The original app source (src/) was not included in the
// repository upload; replace this file by uploading the real src/ folder.
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

type Status = {
  connected: boolean;
  mode: 'mock' | 'supabase';
  message: string;
  database: string | null;
  serverVersion?: string | null;
  tables: string[];
  error?: string;
};

function SupabaseStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/supabase-status')
      .then((res) => res.json())
      .then(setStatus)
      .catch((err) => setFailed(String(err)));
  }, []);

  const tone = status?.connected ? '#1f7a4d' : status?.mode === 'mock' ? '#9a6b00' : '#9E2A2B';
  const label = status?.connected ? 'Connected' : status?.mode === 'mock' ? 'Not configured (mock)' : 'Connection failed';

  return (
    <main style={{ maxWidth: 640, margin: '64px auto', padding: '0 24px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 36, margin: '0 0 8px' }}>Saffron &amp; Ember</h1>
      <p style={{ margin: '0 0 32px', opacity: 0.75 }}>Supabase database connection status</p>

      {!status && !failed && <p>Checking connection…</p>}
      {failed && <p style={{ color: '#9E2A2B' }}>Could not reach the status endpoint: {failed}</p>}

      {status && (
        <section style={{ border: `1px solid ${tone}40`, borderRadius: 12, padding: 24, background: '#fff' }}>
          <p style={{ margin: 0, fontWeight: 700, color: tone }}>● {label}</p>
          <p style={{ margin: '12px 0 0' }}>{status.message}</p>
          {status.error && (
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#9E2A2B' }}>{status.error}</pre>
          )}
          {status.connected && (
            <dl style={{ margin: '16px 0 0', fontSize: 14 }}>
              <dt style={{ fontWeight: 600 }}>Database</dt>
              <dd style={{ margin: '0 0 8px' }}>{status.database} {status.serverVersion && `(${status.serverVersion})`}</dd>
              <dt style={{ fontWeight: 600 }}>Tables in public schema ({status.tables.length})</dt>
              <dd style={{ margin: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                {status.tables.length ? status.tables.join(', ') : 'None yet — run the migration SQL in the Supabase SQL Editor.'}
              </dd>
            </dl>
          )}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseStatus />
  </StrictMode>,
);
