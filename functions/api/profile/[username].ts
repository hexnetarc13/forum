export const runtime = 'edge';
export const onRequestGet = async ({ params, env }: any) => {
  const { username } = params;
  const user = await env.DB.prepare(
    'SELECT id, username, avatar_url, post_count, rep_score, created_at, last_seen FROM users WHERE username = ?'
  ).bind(username).first();

  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const threads = await env.DB.prepare(
    'SELECT id, title, created_at FROM threads WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).bind(user.id).all();

  return Response.json({ user, threads: threads.results });
};
