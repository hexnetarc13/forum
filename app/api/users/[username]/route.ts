export const runtime = 'edge';

export async function GET(req: Request, { params }: { params: { username: string } }) {
  const db = (process.env as any).DB;
  const { username } = params;

  try {
    const user = await db.prepare('SELECT username, bio, avatar_url, created_at FROM users WHERE username = ?')
      .bind(username).first();

    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const { results: posts } = await db.prepare('SELECT id, title, created_at FROM threads WHERE username = ? ORDER BY created_at DESC')
      .bind(username).all();

    return Response.json({ user, posts });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}