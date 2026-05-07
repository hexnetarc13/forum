export const runtime = 'edge';

import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';

export const onRequestPost = async ({ request, env }: any) => {
  const { username, password } = await request.json();

  if (!username || username.length < 3)
    return Response.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
  if (!password || password.length < 6)
    return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  if (!/^[a-zA-Z0-9_-]+$/.test(username))
    return Response.json({ error: 'Username can only contain letters, numbers, _ and -' }, { status: 400 });

  const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (existing) return Response.json({ error: 'Username already taken' }, { status: 409 });

  const hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // First user is auto-admin
  const count = await env.DB.prepare('SELECT COUNT(*) as c FROM users').first();
  const is_admin = (count?.c === 0 || count?.c === '0') ? 1 : 0;

  await env.DB.prepare(
    'INSERT INTO users (id, username, password_hash, post_count, rep_score, created_at, last_seen, is_admin) VALUES (?, ?, ?, 0, 0, ?, ?, ?)'
  ).bind(id, username, hash, now, now, is_admin).run();

  const token = await signToken({ sub: id, username, is_admin: String(is_admin) }, env.JWT_SECRET);
  return Response.json({ token, username, id, is_admin: Boolean(is_admin) });
};
