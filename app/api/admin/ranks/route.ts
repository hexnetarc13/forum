export const runtime = 'edge';

export async function GET() {
  const db = (process.env as any).DB;
  const { results } = await db.prepare('SELECT * FROM ranks ORDER BY min_posts ASC').all();
  return Response.json(results);
}

export async function POST(request: Request) {
  try {
    const { label, min_posts, color } = await request.json();
    const db = (process.env as any).DB;
    const id = crypto.randomUUID();

    await db.prepare('INSERT INTO ranks (id, label, min_posts, color) VALUES (?, ?, ?, ?)')
      .bind(id, label, min_posts, color)
      .run();

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}