'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { getRank, getRankColor } from '@/lib/ranks';
import { C } from '@/lib/styles';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/profile/${username}`)
      .then(r => r.json())
      .then(d => { setProfile(d.user); setThreads(d.threads || []); })
      .catch(() => {});
  }, [username]);

  if (!profile) return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '40px', textAlign: 'center', color: C.muted }}>loading...</div>
    </div>
  );

  const rank = getRank(profile.post_count || 0);
  const rankColor = getRankColor(profile.post_count || 0);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '16px 12px' }}>

        {/* Profile card */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, marginBottom: '12px' }}>
          <div style={{
            background: '#1a1a20', borderBottom: `1px solid ${C.border}`,
            padding: '6px 10px', fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: '12px', letterSpacing: '1px', color: C.white, textTransform: 'uppercase',
          }}>User Profile</div>
          <div style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '64px', height: '64px', border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#1a1a20', fontSize: '24px', flexShrink: 0,
            }}>
              {profile.avatar_url ? <img src={profile.avatar_url} width={64} height={64} alt="" style={{ objectFit: 'cover' }} /> : '👤'}
            </div>
            <div>
              <div style={{ color: C.white, fontWeight: 'bold', fontSize: '16px' }}>{profile.username}</div>
              <div style={{ color: rankColor, fontSize: '12px', margin: '3px 0' }}>{rank}</div>
              <div style={{ color: C.muted, fontSize: '11px' }}>Posts: {profile.post_count || 0}</div>
              <div style={{ color: C.muted, fontSize: '11px' }}>Joined: {new Date(profile.created_at).toLocaleDateString()}</div>
              <div style={{ color: C.muted, fontSize: '11px' }}>Rep: {profile.rep_score || 0}</div>
            </div>
          </div>
        </div>

        {/* Recent threads */}
        <div style={{ border: `1px solid ${C.border}` }}>
          <div style={{
            background: '#1a1a20', borderBottom: `1px solid ${C.border}`,
            padding: '6px 10px', fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: '12px', letterSpacing: '1px', color: C.white, textTransform: 'uppercase',
          }}>Recent Threads</div>
          {threads.length === 0
            ? <div style={{ padding: '20px', textAlign: 'center', color: C.muted }}>No threads yet.</div>
            : threads.map((t: any, i: number) => (
              <div key={t.id} style={{
                padding: '8px 10px', borderBottom: `1px solid ${C.border}`,
                background: i % 2 === 0 ? C.panel : '#0f0f12',
              }}>
                <a href={`/thread/${t.id}`} style={{ color: C.white, fontWeight: 'bold' }}>{t.title}</a>
                <span style={{ color: C.muted, fontSize: '11px', marginLeft: '8px' }}>
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}
