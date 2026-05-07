export const runtime = 'edge';

import { verifyToken, getTokenFromRequest } from '../../../lib/auth';

export const onRequestGet = async ({ request, env }: any) => {
  const url = new URL(request.url);
  const catSlug = url.searchParams.get('category');

  let sql = `
    SELECT t.*, u.username, u.post_count,
           cat.name as category_name, cat.slug as category_slug
    FROM threads t
    JOIN users u ON t.user_id = u.id
    JOIN categories cat ON t.category_id = cat.id
  `;
  const params: string[] = [];

  if (catSlug) {
    sql += ' WHERE cat.slug = ?';
    params.push(catSlug);
  }
  sql += ' ORDER BY t.is_pinned DESC, COALESCE(t.last_reply_at, t.created_at) DESC LIMIT 50';

  const result = await env.DB.prepare(sql).bind(...params).all();
  const catName = result.results?.[0]?.category_name ?? catSlug ?? '';
  return Response.json({ threads: result.results, category_name: catName });
};

export const onRequestPost = async ({ request, env }: any) => {
  const token = getTokenFromRequest(request);
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await verifyToken(token, env.JWT_SECRET);
  if (!user) return Response.json({ error: 'Invalid token' }, { status: 401 });

  const { title, content, category_id } = await request.json();
  if (!title?.trim() || !content?.trim() || !category_id)
    return Response.json({ error: 'Title, content and category required' }, { status: 400 });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    'INSERT INTO threads (id, category_id, user_id, title, content, views, reply_count, created_at, last_reply_at) VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)'
  ).bind(id, category_id, user.sub, title.trim(), content.trim(), now, now).run();

  await env.DB.prepare('UPDATE users SET post_count = post_count + 1 WHERE id = ?').bind(user.sub).run();

  return Response.json({ id }, { status: 201 });
};
