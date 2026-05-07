'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { C, S } from '@/lib/styles';

interface GifItem {
  id: string;
  title: string;
  url: string;
  category: string;
  added_by: string;
  created_at: string;
}

export default function GifsPage() {
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCat, setNewCat] = useState('reaction');
  const [error, setError] = useState('');

  const categories = ['reaction', 'progress', 'fitness', 'humor', 'general'];

  function load() {
    fetch('/api/gifs').then(r => r.json()).then(d => setGifs(d.gifs || [])).catch(() => {});
  }

  useEffect(() => {
    const stored = localStorage.getItem('forum_user');
    if (stored) setUser(JSON.parse(stored));
    load();
  }, []);

  async function addGif() {
    setError('');
    if (!newTitle.trim() || !newUrl.trim()) { setError('Title and URL required'); return; }
    const token = localStorage.getItem('forum_token');
    const res = await fetch('/api/gifs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: newTitle, url: newUrl, category: newCat }),
    });
    if (res.ok) {
      setNewTitle(''); setNewUrl(''); setShowAdd(false);
      load();
    } else {
      const d = await res.json();
      setError(d.error || 'Failed to add gif');
    }
  }

  const filtered = filter === 'all' ? gifs : gifs.filter(g => g.category === filter);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 12px' }}>

        {/* Header bar */}
        <div style={{
          background: '#1a1a20', border: `1px solid ${C.border}`,
          padding: '8px 12px', marginBottom: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: '13px', letterSpacing: '1px', color: C.white, textTransform: 'uppercase',
          }}>GIF Gallery</span>
          {user?.is_admin && (
            <button onClick={() => setShowAdd(!showAdd)} style={S.btn}>
              {showAdd ? 'Cancel' : '+ Add GIF'}
            </button>
          )}
        </div>

        {/* Admin add form */}
        {showAdd && user?.is_admin && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '14px', marginBottom: '12px' }}>
            <div style={{ color: C.muted, fontSize: '11px', marginBottom: '8px' }}>Add New GIF (admin only)</div>
            {error && <div style={{ color: C.red, fontSize: '12px', marginBottom: '8px' }}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <div style={{ color: C.muted, fontSize: '11px', marginBottom: '3px' }}>Title</div>
                <input style={S.input} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. When the gains hit" />
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: '11px', marginBottom: '3px' }}>Category</div>
                <select style={S.input} value={newCat} onChange={e => setNewCat(e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: C.muted, fontSize: '11px', marginBottom: '3px' }}>GIF URL</div>
              <input style={S.input} value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://media.giphy.com/..." />
            </div>
            <button style={S.btn} onClick={addGif}>Add GIF</button>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {['all', ...categories].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: '3px 10px', fontSize: '11px', cursor: 'pointer', borderRadius: '2px',
              background: filter === cat ? C.purple : 'transparent',
              color: filter === cat ? C.white : C.muted,
              border: `1px solid ${filter === cat ? C.purple : C.border}`,
            }}>{cat}</button>
          ))}
        </div>

        {/* GIF grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: '40px', border: `1px solid ${C.border}` }}>
            No GIFs yet.{user?.is_admin ? ' Add the first one above.' : ''}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {filtered.map(gif => (
              <div key={gif.id} style={{
                background: C.panel, border: `1px solid ${C.border}`,
                overflow: 'hidden',
              }}>
                <img
                  src={gif.url} alt={gif.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div style={{ padding: '6px 8px' }}>
                  <div style={{ color: C.text, fontSize: '11px', fontWeight: 'bold' }}>{gif.title}</div>
                  <div style={{ color: C.muted, fontSize: '10px', marginTop: '2px' }}>
                    {gif.category} · {gif.added_by}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
