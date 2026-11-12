export function config() {
  const { SUPABASE_URL: url, SUPABASE_ANON_KEY: anon, SUPABASE_SERVICE_ROLE_KEY: secret } = process.env;
  if (!url || !anon || !secret) throw Object.assign(new Error('Configure Supabase environment variables on the server.'), { status: 503 });
  return { url: url.replace(/\/$/, ''), anon, secret };
}
export async function supabase(path, { method = 'GET', body, token, publicKey = false, prefer } = {}) {
  const c = config();
  const key = publicKey ? c.anon : c.secret;
  const response = await fetch(c.url + path, { method, headers: {
    apikey: key, Authorization: `Bearer ${token || key}`, 'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const value = await response.json().catch(() => null);
  if (!response.ok) throw Object.assign(new Error(path.startsWith('/auth/') ? 'Authentication failed. Check your email and password or sign in again.' : 'Supabase operation failed. Check server configuration and database migration.'), { status: path.startsWith('/auth/') ? 401 : 503 });
  return value;
}
export async function readWorkspace({ summary = false } = {}) {
  const select = summary ? 'revision,members:snapshot->collections->members' : 'revision,snapshot';
  const rows = await supabase('/rest/v1/qa_workspace?id=eq.default&select=' + select);
  if (!rows?.[0]) throw Object.assign(new Error('The shared workspace has not been seeded.'), { status: 503 });
  return rows[0];
}
export async function saveWorkspace(revision, changes) {
  const saved = await supabase('/rest/v1/rpc/qa_commit_workspace', {
    method: 'POST', body: { p_expected_revision: revision, p_changes: changes },
  });
  if (!saved) throw Object.assign(new Error('Another teammate saved first. Refresh and retry your change.'), { status: 409 });
}
