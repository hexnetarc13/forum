export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = (process.env as any).DB;
    const secret = process.env.JWT_SECRET;

    // 1. Get user
    const user = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 401 });
    }

    // 2. Verify Password (Match the hashing logic from register)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt_it_good');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashedPassword = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (user.password !== hashedPassword) {
      return Response.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 3. Return user data (The frontend will store this)
    return Response.json({ 
      token: 'fake-jwt-token', // You'll swap this for a real JWT later
      id: user.id,
      username: user.username,
      is_admin: user.is_admin === 1 
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}