export const runtime = 'edge';

export async function GET(req: Request, { params }: { params: { username: string } }) {
  const db = (process.env as any).DB;
  const username = params.username;

  try {
    // 1. Get User
    const user = await db.prepare('SELECT username, bio, avatar_url, created_at FROM users WHERE username = ?')
      .bind(username).first();

    if (!user) {
      return Response.json({ error: 'User does not exist in FoidHate database.' }, { status: 404 });
    }

    // 2. Get User's Threads
    const { results: posts } = await db.prepare('SELECT id, title, created_at FROM threads WHERE username = ? ORDER BY created_at DESC LIMIT 20')
      .bind(username).all();

    return Response.json({ user, posts });
  } catch (e: any) {
    return Response.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
