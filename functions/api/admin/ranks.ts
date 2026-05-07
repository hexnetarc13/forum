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
  const ranks = await env.DB.prepare('SELECT * FROM ranks ORDER BY min_posts ASC').all();
  return Response.json({ ranks: ranks.results });
};

export const onRequestPost = async ({ request, env }: any) => {
  if (!await requireAdmin(request, env)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { label, min_posts, color } = await request.json();
  if (!label || min_posts === undefined || !color)
    return Response.json({ error: 'label, min_posts, color required' }, { status: 400 });
  const count = await env.DB.prepare('SELECT COUNT(*) as c FROM ranks').first();
  await env.DB.prepare('INSERT INTO ranks (label, min_posts, color, display_order) VALUES (?, ?, ?, ?)')
    .bind(label, min_posts, color, (count?.c as number || 0) + 1).run();
  return Response.json({ success: true }, { status: 201 });
};

export const onRequestDelete = async ({ request, env }: any) => {
  if (!await requireAdmin(request, env)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  await env.DB.prepare('DELETE FROM ranks WHERE id = ?').bind(id).run();
  return Response.json({ success: true });
};
