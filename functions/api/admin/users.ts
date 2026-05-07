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
  const users = await env.DB.prepare(
    'SELECT id, username, post_count, rep_score, created_at, last_seen, is_admin FROM users ORDER BY created_at DESC LIMIT 200'
  ).all();
  return Response.json({ users: users.results });
};

export const onRequestPatch = async ({ request, env }: any) => {
  const admin = await requireAdmin(request, env);
  if (!admin) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { user_id, is_admin } = await request.json();
  if (!user_id) return Response.json({ error: 'user_id required' }, { status: 400 });
  // Prevent removing own admin
  if (user_id === admin.sub && is_admin === 0)
    return Response.json({ error: 'Cannot remove your own admin status' }, { status: 400 });
  await env.DB.prepare('UPDATE users SET is_admin = ? WHERE id = ?').bind(is_admin, user_id).run();
  return Response.json({ success: true });
};
