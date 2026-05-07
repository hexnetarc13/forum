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
  const flair = await env.DB.prepare('SELECT * FROM flair_tags ORDER BY id ASC').all();
  return Response.json({ flair: flair.results });
};

export const onRequestPost = async ({ request, env }: any) => {
  if (!await requireAdmin(request, env)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { label, color, requirement } = await request.json();
  if (!label || !color || !requirement)
    return Response.json({ error: 'label, color, requirement required' }, { status: 400 });
  await env.DB.prepare('INSERT INTO flair_tags (label, color, requirement) VALUES (?, ?, ?)')
    .bind(label, color, requirement).run();
  return Response.json({ success: true }, { status: 201 });
};

export const onRequestDelete = async ({ request, env }: any) => {
  if (!await requireAdmin(request, env)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  await env.DB.prepare('DELETE FROM flair_tags WHERE id = ?').bind(id).run();
  return Response.json({ success: true });
};
