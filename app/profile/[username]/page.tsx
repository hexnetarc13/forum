'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { C, S } from '@/lib/styles';

export default function Profile({ params }: { params: { username: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Add a timestamp to kill the cache
    fetch(`/api/users/${params.username}?t=${Date.now()}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'User not found');
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.username]);

  if (loading) return (
    <div style={{ background: C.bg, minHeight: '100vh', color: '#fff' }}>
      <Header /><div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>
    </div>
  );

  if (error) return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.red }}>
      <Header /><div style={{ padding: '40px', textAlign: 'center' }}>Error: {error}</div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '900px', margin: '20px auto', display: 'flex', gap: '20px', padding: '0 15px' }}>
        {/* Left Sidebar */}
        <div style={{ width: '250px', background: C.panel, padding: '20px', border: `1px solid ${C.border}` }}>
          <img 
            src={data.user.avatar_url || 'https://via.placeholder.com/150'} 
            style={{ width: '100%', borderRadius: '4px', border: `1px solid ${C.border}` }} 
          />
          <h2 style={{ marginTop: '15px', color: '#fff', textTransform: 'uppercase', fontFamily: 'Impact' }}>
            {data.user.username}
          </h2>
          <div style={{ fontSize: '11px', color: C.muted, marginBottom: '10px' }}>Joined: {new Date(data.user.created_at).toLocaleDateString()}</div>
          <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.4' }}>{data.user.bio || 'This user has no bio.'}</p>
        </div>

        {/* Right Side: Threads */}
        <div style={{ flex: 1, background: C.panel, border: `1px solid ${C.border}` }}>
          <div style={S.sectionHead}>Recent Posts by {data.user.username}</div>
          {data.posts.length === 0 ? (
            <div style={{ padding: '20px', color: C.muted }}>No posts found.</div>
          ) : (
            data.posts.map((post: any) => (
              <div key={post.id} style={{ padding: '15px', borderBottom: `1px solid ${C.border}` }}>
                <a href={`/thread/${post.id}`} style={{ fontWeight: 'bold', color: C.text, fontSize: '14px' }}>{post.title}</a>
                <div style={{ fontSize: '11px', color: C.muted, marginTop: '4px' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}