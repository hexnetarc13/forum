export const runtime = 'edge';

import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';

export const onRequestPost = async ({ request, env }: any) => {
  const { username, password } = await request.json();
  if (!username || !password)
    return Response.json({ error: 'Username and password required' }, { status: 400 });

  const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!user) return Response.json({ error: 'Invalid username or password' }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) return Response.json({ error: 'Invalid username or password' }, { status: 401 });

  await env.DB.prepare('UPDATE users SET last_seen = ? WHERE id = ?')
    .bind(new Date().toISOString(), user.id).run();

  const token = await signToken(
    { sub: user.id as string, username: user.username as string, is_admin: String(user.is_admin) },
    env.JWT_SECRET
  );
  return Response.json({ token, username: user.username, id: user.id, is_admin: Boolean(user.is_admin) });
};
