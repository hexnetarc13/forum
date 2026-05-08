'use client';
import { useEffect, useState } from 'react';
import { C } from '@/lib/styles';

export default function Header() {
  const [user, setUser] = useState<{ username: string; is_admin?: boolean } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('forum_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function logout() {
    localStorage.removeItem('forum_user');
    localStorage.removeItem('forum_token');
    window.location.href = '/';
  }

  return (
    <div style={{ background: '#0a0a0c', borderBottom: `2px solid ${C.red}` }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 12px' }}>

        {/* Logo + Styled Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0 10px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', background: C.panel,
              border: `1px solid ${C.red}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', color: C.red, fontWeight: 'bold'
            }}>
              FH
            </div>
            <div>
              <div style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                fontSize: '28px', letterSpacing: '1px',
                color: '#fff', lineHeight: 1, textTransform: 'uppercase'
              }}>
                FOID<span style={{ color: C.red }}>HATE</span>
              </div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>
                self improvement. no filters.
              </div>
            </div>
          </a>
        </div>

        {/* Nav bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: `1px solid ${C.border}`, padding: '4px 0',
        }}>
          <div style={{ display: 'flex' }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/category/looksmaxxing', label: 'Looksmaxxing' },
              { href: '/category/gymmaxxing', label: 'Gymmaxxing' },
              { href: '/category/progress', label: 'Progress' },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                padding: '4px 12px', fontSize: '12px', color: C.text,
                borderRight: `1px solid ${C.border}`, display: 'block',
              }}>{link.label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px' }}>
            {user ? (
              <>
                <a href={`/profile/${user.username}`} style={{ color: C.purple, fontWeight: 'bold' }}>
                  {user.username.toUpperCase()}
                </a>
                {user.is_admin && (
                  <a href="/admin" style={{
                    color: C.amber, padding: '1px 6px',
                    border: `1px solid ${C.amber}`, fontSize: '10px',
                  }}>ADMIN</a>
                )}
                <button onClick={logout} style={{
                  background: 'none', border: 'none', color: C.muted,
                  cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase'
                }}>logout</button>
              </>
            ) : (
              <>
                <a href="/login" style={{ color: C.text }}>Login</a>
                <a href="/register" style={{
                  background: C.red, color: '#fff',
                  padding: '3px 12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase'
                }}>Register</a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
