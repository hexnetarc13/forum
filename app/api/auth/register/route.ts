export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = (process.env as any).DB;

    if (!username || !password) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Check if this is the FIRST user ever
    const userCountResult = await db.prepare('SELECT COUNT(*) as count FROM users').first();
    const isFirstUser = userCountResult.count === 0;

    // 2. Check if username is taken
    const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
    if (existing) {
      return Response.json({ error: 'Username taken' }, { status: 400 });
    }

    // 3. Simple Hash logic
    const id = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt_it_good');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashedPassword = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // 4. Insert into D1 (is_admin is 1 for the first user, 0 for everyone else)
    const isAdmin = isFirstUser ? 1 : 0;
    
    await db.prepare('INSERT INTO users (id, username, password, is_admin) VALUES (?, ?, ?, ?)')
      .bind(id, username, hashedPassword, isAdmin)
      .run();

    return Response.json({ 
      success: true, 
      username, 
      id, 
      is_admin: isAdmin === 1 
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
