export const runtime = 'edge';
export const onRequestGet = async ({ params, env }: any) => {
  const { id } = params;

  const thread = await env.DB.prepare(`
    SELECT t.*, u.username, u.post_count, u.avatar_url, u.created_at as user_joined
    FROM threads t JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
  `).bind(id).first();

  if (!thread) return Response.json({ error: 'Not found' }, { status: 404 });

  await env.DB.prepare('UPDATE threads SET views = views + 1 WHERE id = ?').bind(id).run();

  const replies = await env.DB.prepare(`
    SELECT r.*, u.username, u.post_count, u.avatar_url, u.created_at as user_joined
    FROM replies r JOIN users u ON r.user_id = u.id
    WHERE r.thread_id = ?
    ORDER BY r.created_at ASC
  `).bind(id).all();

  return Response.json({ thread, replies: replies.results });
};
