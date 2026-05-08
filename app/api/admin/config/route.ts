export const runtime = 'edge';

// GET: Loads the settings into the Admin Panel boxes
export async function GET() {
  try {
    const db = (process.env as any).DB;
    const { results } = await db.prepare('SELECT * FROM site_config').all();
    // Turn the list into an object { title: '...', accent: '...' }
    const config = results.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    return Response.json(config);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST: Saves the settings when you hit the red button
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = (process.env as any).DB;
    for (const [key, value] of Object.entries(body)) {
      await db.prepare('INSERT OR REPLACE INTO site_config (key, value) VALUES (?, ?)')
        .bind(key, value).run();
    }
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}