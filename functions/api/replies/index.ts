import { verifyToken, getTokenFromRequest } from '../../../lib/auth';

export const onRequestPost = async ({ request, env }: any) => {
  const token = getTokenFromRequest(request);
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await verifyToken(token, env.JWT_SECRET);
  if (!user) return Response.json({ error: 'Invalid token' }, { status: 401 });

  const { thread_id, content } = await request.json();
  if (!thread_id || !content?.trim())
    return Response.json({ error: 'Thread ID and content required' }, { status: 400 });

  const thread = await env.DB.prepare('SELECT id, is_locked FROM threads WHERE id = ?').bind(thread_id).first();
  if (!thread) return Response.json({ error: 'Thread not found' }, { status: 404 });
  if (thread.is_locked) return Response.json({ error: 'Thread is locked' }, { status: 403 });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    'INSERT INTO replies (id, thread_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, thread_id, user.sub, content.trim(), now).run();

  await env.DB.prepare(
    'UPDATE threads SET reply_count = reply_count + 1, last_reply_at = ? WHERE id = ?'
  ).bind(now, thread_id).run();

  await env.DB.prepare('UPDATE users SET post_count = post_count + 1 WHERE id = ?').bind(user.sub).run();

  return Response.json({ id }, { status: 201 });
};
