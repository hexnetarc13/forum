export const runtime = 'edge';

import { verifyToken, getTokenFromRequest } from '../../../lib/auth';

async function requireAdmin(request: Request, env: any) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  const user = await verifyToken(token, env.JWT_SECRET);
  if (!user) return null;
  const dbUser = await env.DB.prepare('SELECT is_admin FROM users WHERE id = ?').bind(user.sub).first();
  return dbUser?.is_admin ? user : null;
}

export const onRequestGet = async ({ request, env }: any) => {
  if (!await requireAdmin(request, env)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const rows = await env.DB.prepare('SELECT key, value FROM site_config').all();
  const config: Record<string, string> = {};
  for (const row of rows.results as { key: string; value: string }[]) config[row.key] = row.value;
  return Response.json(config);
};

export const onRequestPost = async ({ request, env }: any) => {
  if (!await requireAdmin(request, env)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const keys = ['site_title', 'site_subtitle', 'logo_url', 'accent_color', 'secondary_color'];
  for (const key of keys) {
    if (body[key] !== undefined) {
      await env.DB.prepare('INSERT OR REPLACE INTO site_config (key, value) VALUES (?, ?)')
        .bind(key, body[key]).run();
    }
  }
  return Response.json({ success: true });
};
