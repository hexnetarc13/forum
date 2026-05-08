'use client';
import { useEffect, useState } from 'react';
import { C } from '@/lib/styles';

export default function Header() {
  const [user, setUser] = useState<{ username: string; is_admin?: boolean } | null>(null);

  useEffect(() => {
    // 1. Initial check on load
    const checkUser = () => {
      const stored = localStorage.getItem('forum_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem('forum_user');
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // 2. Listen for login/logout events in other tabs
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  function logout() {
    localStorage.removeItem('forum_user');
    localStorage.removeItem('forum_token');
    setUser(null);
    window.location.href = '/';
  }

  return (
    <div style={{ background: '#0a0a0c', borderBottom: `2px solid ${C.red}` }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 12px' }}>
        
        {/* ... Logo/Title section stays the same ... */}

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: `1px solid ${C.border}`, padding: '4px 0',
        }}>
          {/* Left Side: Nav Links */}
          <div style={{ display: 'flex' }}>
            <a href="/" style={{ padding: '4px 12px', fontSize: '12px', color: C.text, borderRight: `1px solid ${C.border}` }}>Home</a>
            <a href="/category/looksmaxxing" style={{ padding: '4px 12px', fontSize: '12px', color: C.text, borderRight: `1px solid ${C.border}` }}>Looksmaxxing</a>
          </div>

          {/* Right Side: Account Actions */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px' }}>
            {user ? (
              /* ONLY SHOWN WHEN LOGGED IN */
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
                  cursor: 'pointer', fontSize: '11px'
                }}>LOGOUT</button>
              </>
            ) : (
              /* ONLY SHOWN WHEN LOGGED OUT */
              <>
                <a href="/login" style={{ color: C.text }}>Login</a>
                <a href="/register" style={{
                  background: C.red, color: '#fff',
                  padding: '3px 12px', fontSize: '11px', fontWeight: 'bold'
                }}>Register</a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
