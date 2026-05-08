import { revalidatePath } from 'next/cache';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = (process.env as any).DB;

    // 1. Save every setting to D1
    for (const [key, value] of Object.entries(body)) {
      await db.prepare('INSERT OR REPLACE INTO site_config (key, value) VALUES (?, ?)')
        .bind(key, value)
        .run();
    }

    // 2. THIS IS THE FIX: Tell Next.js to refresh the whole site
    revalidatePath('/', 'layout'); 

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}