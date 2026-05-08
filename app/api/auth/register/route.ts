export const runtime = 'edge';

import { Buffer } from 'node:buffer';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = (process.env as any).DB; // Accessing the D1 binding

    if (!username || !password) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Check if user exists
    const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
    if (existing) {
      return Response.json({ error: 'Username taken' }, { status: 400 });
    }

    // 2. Simple Hash (In production, use a library like @tsndr/cloudflare-worker-jwt for proper handling)
    const id = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt_it_good');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashedPassword = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // 3. Insert into D1
    await db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)')
      .bind(id, username, hashedPassword)
      .run();

    return Response.json({ success: true, username, id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}