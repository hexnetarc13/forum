'use client';
import { useEffect, useState } from 'react';
import { C } from '@/lib/styles';

export default function Header() {
  const [user, setUser] = useState<{ username: string; is_admin?: boolean } | null>(null);
  const [config, setConfig] = useState<{ site_title: string; site_subtitle: string; logo_url: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('forum_user');
    if (stored) setUser(JSON.parse(stored));
    fetch('/api/config').then(r => r.json()).then(setConfig).catch(() => {});
  }, []);

  const title = config?.site_title || 'MAXXFORUM';
  const subtitle = config?.site_subtitle || 'self improvement. no filters.';
  const logoUrl = config?.logo_url || '';

  function logout() {
    localStorage.removeItem('forum_user');
    localStorage.removeItem('forum_token');
    window.location.href = '/';
  }

  return (
    <div style={{ background: '#0a0a0c', borderBottom: `2px solid ${C.red}` }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 12px' }}>

        {/* Logo + title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0 10px' }}>
          {logoUrl ? (
            <img src={logoUrl} alt="logo" style={{ height: '48px', width: 'auto' }} />
          ) : (
            <div style={{
              width: '48px', height: '48px', background: C.panel,
              border: `1px dashed ${C.border}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', color: C.muted, textAlign: 'center', lineHeight: '1.3',
            }}>
              LOGO
            </div>
          )}
          <div>
            <div style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              fontSize: '26px', letterSpacing: '2px',
              color: C.white, lineHeight: 1,
            }}>
              {title}
            </div>
            <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{subtitle}</div>
          </div>
        </div>

        {/* Nav bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: `1px solid ${C.border}`, padding: '4px 0',
        }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/gifs', label: 'GIFs' },
              { href: '/category/looksmaxxing', label: 'Looksmaxxing' },
              { href: '/category/gymmaxxing', label: 'Gymmaxxing' },
              { href: '/category/progress', label: 'Progress' },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                padding: '4px 10px', fontSize: '12px', color: C.text,
                borderRight: `1px solid ${C.border}`, display: 'block',
              }}>{link.label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px' }}>
            {user ? (
              <>
                <a href={`/profile/${user.username}`} style={{ color: C.purple }}>{user.username}</a>
                {user.is_admin && (
                  <a href="/admin" style={{
                    color: C.amber, padding: '2px 8px',
                    border: `1px solid ${C.amber}`, fontSize: '11px',
                  }}>ADMIN</a>
                )}
                <button onClick={logout} style={{
                  background: 'none', border: 'none', color: C.muted,
                  cursor: 'pointer', fontSize: '12px',
                }}>logout</button>
              </>
            ) : (
              <>
                <a href="/login" style={{ color: C.text }}>Login</a>
                <a href="/register" style={{
                  background: C.red, color: C.white,
                  padding: '3px 10px', fontSize: '12px', borderRadius: '2px',
                }}>Register</a>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
