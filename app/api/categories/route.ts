export const runtime = 'edge';

export async function GET() {
  try {
    const db = (process.env as any).DB;
    
    // Fetch categories ordered by your display_order
    const { results } = await db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();
    
    return Response.json(results);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}