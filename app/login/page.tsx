'use client';
export const runtime = 'edge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { C, S } from '@/lib/styles';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    localStorage.setItem('forum_token', data.token);
    localStorage.setItem('forum_user', JSON.stringify({ username: data.username, id: data.id, is_admin: data.is_admin }));
    router.push('/');
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '400px', margin: '40px auto', padding: '0 12px' }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div style={S.sectionHead}>Login</div>
          <div style={{ padding: '20px' }}>
            {error && <div style={{ color: C.red, fontSize: '12px', marginBottom: '10px' }}>{error}</div>}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Username</div>
              <input style={S.input} value={username} onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Password</div>
              <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>
            <button style={S.btn} onClick={submit}>Login</button>
            <span style={{ color: C.muted, fontSize: '12px', marginLeft: '12px' }}>
              No account? <a href="/register" style={{ color: C.purple }}>Register</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
