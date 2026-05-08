export const runtime = 'edge';

export async function GET() {
  const db = (process.env as any).DB;
  const { results } = await db.prepare('SELECT * FROM flair_tags').all();
  return Response.json(results);
}

export async function POST(request: Request) {
  try {
    const { text, color } = await request.json();
    const db = (process.env as any).DB;
    const id = crypto.randomUUID();

    await db.prepare('INSERT INTO flair_tags (id, text, color) VALUES (?, ?, ?)')
      .bind(id, text, color)
      .run();

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}