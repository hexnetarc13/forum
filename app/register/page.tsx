'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { C, S } from '@/lib/styles';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    const res = await fetch('/api/auth/register', {
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
          <div style={S.sectionHead}>Register</div>
          <div style={{ padding: '20px' }}>
            {error && <div style={{ color: C.red, fontSize: '12px', marginBottom: '10px' }}>{error}</div>}
            {['Username', 'Password', 'Confirm Password'].map((label, i) => (
              <div key={label} style={{ marginBottom: '10px' }}>
                <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>{label}</div>
                <input style={S.input} type={i > 0 ? 'password' : 'text'}
                  value={i === 0 ? username : i === 1 ? password : confirm}
                  onChange={e => { if (i === 0) setUsername(e.target.value); else if (i === 1) setPassword(e.target.value); else setConfirm(e.target.value); }} />
              </div>
            ))}
            <button style={{ ...S.btn, marginTop: '6px' }} onClick={submit}>Create Account</button>
            <span style={{ color: C.muted, fontSize: '12px', marginLeft: '12px' }}>
              Have an account? <a href="/login" style={{ color: C.purple }}>Login</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
