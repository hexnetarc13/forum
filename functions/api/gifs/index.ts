export const runtime = 'edge';
import { verifyToken, getTokenFromRequest } from '../../../lib/auth';

export const onRequestGet = async ({ env }: any) => {
  const gifs = await env.DB.prepare(
    'SELECT g.*, u.username as added_by FROM gifs g LEFT JOIN users u ON g.added_by = u.id ORDER BY g.created_at DESC'
  ).all();
  return Response.json({ gifs: gifs.results });
};

export const onRequestPost = async ({ request, env }: any) => {
  const token = getTokenFromRequest(request);
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await verifyToken(token, env.JWT_SECRET);
  if (!user) return Response.json({ error: 'Invalid token' }, { status: 401 });

  const dbUser = await env.DB.prepare('SELECT is_admin FROM users WHERE id = ?').bind(user.sub).first();
  if (!dbUser?.is_admin) return Response.json({ error: 'Admin only' }, { status: 403 });

  const { title, url, category } = await request.json();
  if (!title?.trim() || !url?.trim())
    return Response.json({ error: 'Title and URL required' }, { status: 400 });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    'INSERT INTO gifs (id, title, url, category, added_by, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, title.trim(), url.trim(), category || 'general', user.sub, now).run();

  return Response.json({ id }, { status: 201 });
};

export const onRequestDelete = async ({ request, env }: any) => {
  const token = getTokenFromRequest(request);
  const user = await verifyToken(token || '', env.JWT_SECRET);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await env.DB.prepare('SELECT is_admin FROM users WHERE id = ?').bind(user.sub).first();
  if (!dbUser?.is_admin) return Response.json({ error: 'Admin only' }, { status: 403 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  await env.DB.prepare('DELETE FROM gifs WHERE id = ?').bind(id).run();
  return Response.json({ success: true });
};
