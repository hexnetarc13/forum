export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category_id, username } = body;
    const db = (process.env as any).DB;

    // 1. Validation
    if (!title || !content || !category_id) {
      return Response.json({ error: 'Missing title, content, or category' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    
    // 2. Insert with the username passed from the frontend
    // We default to 0 for is_pinned so new posts aren't accidentally pinned
    await db.prepare(
      'INSERT INTO threads (id, title, content, category_id, username, is_pinned) VALUES (?, ?, ?, ?, ?, 0)'
    ).bind(id, title, content, category_id, username || "Anonymous").run();

    return Response.json({ success: true, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = (process.env as any).DB;
    
    // This SQL query ensures pinned threads stay at the top (1 > 0)
    // Then it sorts the rest by the newest date
    const { results } = await db.prepare(
      'SELECT * FROM threads ORDER BY is_pinned DESC, created_at DESC'
    ).all();
    
    return Response.json(results);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
