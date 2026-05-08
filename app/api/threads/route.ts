export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { title, content, category_id } = await request.json();
    const db = (process.env as any).DB;
    
    // Replace this with your actual user logic later
    const username = "Admin"; 
    const id = crypto.randomUUID();

    await db.prepare(
      'INSERT INTO threads (id, title, content, category_id, username) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, title, content, category_id, username).run();

    return Response.json({ success: true, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// Add a GET method so the home page can actually see the threads
export async function GET() {
  const db = (process.env as any).DB;
  const { results } = await db.prepare('SELECT * FROM threads ORDER BY created_at DESC').all();
  return Response.json(results);
}