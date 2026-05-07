'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { C, S } from '@/lib/styles';

type Tab = 'ranks' | 'flair' | 'site' | 'categories' | 'users';

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('site');
  const [user, setUser] = useState<any>(null);

  // Site config
  const [siteTitle, setSiteTitle] = useState('MAXXFORUM');
  const [siteSub, setSiteSub] = useState('self improvement. no filters.');
  const [logoUrl, setLogoUrl] = useState('');
  const [accentColor, setAccentColor] = useState('#cc2222');
  const [saved, setSaved] = useState('');

  // Ranks
  const [ranks, setRanks] = useState<any[]>([]);
  const [newRankLabel, setNewRankLabel] = useState('');
  const [newRankMin, setNewRankMin] = useState('');
  const [newRankColor, setNewRankColor] = useState('#7c5cff');

  // Flair
  const [flairs, setFlairs] = useState<any[]>([]);
  const [newFlairLabel, setNewFlairLabel] = useState('');
  const [newFlairColor, setNewFlairColor] = useState('#22c55e');
  const [newFlairReq, setNewFlairReq] = useState('');

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('forum_user');
    if (!stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    if (!u.is_admin) { router.push('/'); return; }
    setUser(u);
    loadAll();
  }, []);

  function loadAll() {
    const token = localStorage.getItem('forum_token');
    const h = { Authorization: `Bearer ${token}` };
    fetch('/api/admin/config', { headers: h }).then(r => r.json()).then(d => {
      if (d.site_title) setSiteTitle(d.site_title);
      if (d.site_subtitle) setSiteSub(d.site_subtitle);
      if (d.logo_url !== undefined) setLogoUrl(d.logo_url);
      if (d.accent_color) setAccentColor(d.accent_color);
    });
    fetch('/api/admin/ranks', { headers: h }).then(r => r.json()).then(d => setRanks(d.ranks || []));
    fetch('/api/admin/flair', { headers: h }).then(r => r.json()).then(d => setFlairs(d.flair || []));
    fetch('/api/admin/users', { headers: h }).then(r => r.json()).then(d => setUsers(d.users || []));
  }

  async function saveSiteConfig() {
    const token = localStorage.getItem('forum_token');
    await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ site_title: siteTitle, site_subtitle: siteSub, logo_url: logoUrl, accent_color: accentColor }),
    });
    setSaved('Saved!');
    setTimeout(() => setSaved(''), 2000);
  }

  async function addRank() {
    if (!newRankLabel || !newRankMin) return;
    const token = localStorage.getItem('forum_token');
    await fetch('/api/admin/ranks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ label: newRankLabel, min_posts: parseInt(newRankMin), color: newRankColor }),
    });
    setNewRankLabel(''); setNewRankMin('');
    loadAll();
  }

  async function deleteRank(id: number) {
    const token = localStorage.getItem('forum_token');
    await fetch(`/api/admin/ranks?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadAll();
  }

  async function addFlair() {
    if (!newFlairLabel || !newFlairReq) return;
    const token = localStorage.getItem('forum_token');
    await fetch('/api/admin/flair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ label: newFlairLabel, color: newFlairColor, requirement: newFlairReq }),
    });
    setNewFlairLabel(''); setNewFlairReq('');
    loadAll();
  }

  async function deleteFlair(id: number) {
    const token = localStorage.getItem('forum_token');
    await fetch(`/api/admin/flair?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadAll();
  }

  async function toggleAdmin(userId: string, current: number) {
    const token = localStorage.getItem('forum_token');
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ user_id: userId, is_admin: current ? 0 : 1 }),
    });
    loadAll();
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'site', label: 'Site Config' },
    { key: 'ranks', label: 'Ranks' },
    { key: 'flair', label: 'Flair Tags' },
    { key: 'users', label: 'Users' },
  ];

  const inp = { ...S.input, marginBottom: '0' };

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px 12px' }}>

        {/* Admin header */}
        <div style={{
          background: '#1a1a10', border: `1px solid ${C.amber}`,
          padding: '8px 14px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ color: C.amber, fontWeight: 'bold', fontSize: '13px' }}>⚙ ADMIN PANEL</span>
          <span style={{ color: C.muted, fontSize: '11px' }}>Only visible to admins. Changes are live immediately.</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${C.border}`, marginBottom: '14px' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '6px 16px', fontSize: '12px', cursor: 'pointer',
              background: tab === t.key ? C.panel : 'transparent',
              color: tab === t.key ? C.white : C.muted,
              border: 'none', borderBottom: tab === t.key ? `2px solid ${C.purple}` : '2px solid transparent',
              fontFamily: 'Tahoma, Verdana, sans-serif',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── SITE CONFIG ── */}
        {tab === 'site' && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Forum Title</div>
                <input style={inp} value={siteTitle} onChange={e => setSiteTitle(e.target.value)} placeholder="MAXXFORUM" />
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Subtitle / Tagline</div>
                <input style={inp} value={siteSub} onChange={e => setSiteSub(e.target.value)} placeholder="self improvement. no filters." />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Logo URL (leave blank for placeholder)</div>
              <input style={inp} value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://your-domain.com/logo.png" />
              <div style={{ color: C.muted, fontSize: '10px', marginTop: '4px' }}>
                Upload your logo to Cloudflare R2 or any CDN, paste the URL here.
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Accent Color</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                  style={{ width: '40px', height: '32px', background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer' }} />
                <input style={{ ...inp, width: '120px' }} value={accentColor} onChange={e => setAccentColor(e.target.value)} />
                <div style={{ width: '60px', height: '24px', background: accentColor, border: `1px solid ${C.border}` }} />
              </div>
            </div>
            <button onClick={saveSiteConfig} style={S.btn}>Save Config</button>
            {saved && <span style={{ color: '#22c55e', fontSize: '12px', marginLeft: '10px' }}>{saved}</span>}
          </div>
        )}

        {/* ── RANKS ── */}
        {tab === 'ranks' && (
          <div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '14px', marginBottom: '10px' }}>
              <div style={{ color: C.muted, fontSize: '11px', marginBottom: '8px' }}>Add New Rank</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 50px auto', gap: '8px', alignItems: 'end' }}>
                <div>
                  <div style={{ color: C.muted, fontSize: '10px', marginBottom: '3px' }}>Label</div>
                  <input style={inp} value={newRankLabel} onChange={e => setNewRankLabel(e.target.value)} placeholder="e.g. Grinder" />
                </div>
                <div>
                  <div style={{ color: C.muted, fontSize: '10px', marginBottom: '3px' }}>Min Posts</div>
                  <input style={inp} type="number" value={newRankMin} onChange={e => setNewRankMin(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <div style={{ color: C.muted, fontSize: '10px', marginBottom: '3px' }}>Color</div>
                  <input type="color" value={newRankColor} onChange={e => setNewRankColor(e.target.value)}
                    style={{ width: '40px', height: '32px', background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer' }} />
                </div>
                <button onClick={addRank} style={{ ...S.btn, height: '32px' }}>Add</button>
              </div>
            </div>
            <div style={{ border: `1px solid ${C.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#111115', borderBottom: `1px solid ${C.border}` }}>
                    {['Label', 'Min Posts', 'Color', 'Preview', 'Delete'].map(h => (
                      <th key={h} style={{ padding: '5px 10px', textAlign: 'left', color: C.muted, fontSize: '11px', fontWeight: 'normal' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...ranks].sort((a, b) => a.min_posts - b.min_posts).map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.panel : '#0f0f12' }}>
                      <td style={{ padding: '7px 10px', color: C.text }}>{r.label}</td>
                      <td style={{ padding: '7px 10px', color: C.muted }}>{r.min_posts}+</td>
                      <td style={{ padding: '7px 10px', color: C.muted, fontSize: '11px' }}>{r.color}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{ color: r.color, fontSize: '12px', fontWeight: 'bold' }}>{r.label}</span>
                      </td>
                      <td style={{ padding: '7px 10px' }}>
                        <button onClick={() => deleteRank(r.id)} style={{
                          background: 'none', border: `1px solid ${C.border}`, color: C.red,
                          fontSize: '11px', padding: '2px 8px', cursor: 'pointer', borderRadius: '2px',
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FLAIR TAGS ── */}
        {tab === 'flair' && (
          <div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '14px', marginBottom: '10px' }}>
              <div style={{ color: C.muted, fontSize: '11px', marginBottom: '8px' }}>Add New Flair Tag</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 50px auto', gap: '8px', alignItems: 'end' }}>
                <div>
                  <div style={{ color: C.muted, fontSize: '10px', marginBottom: '3px' }}>Label</div>
                  <input style={inp} value={newFlairLabel} onChange={e => setNewFlairLabel(e.target.value)} placeholder="e.g. Gym Regular" />
                </div>
                <div>
                  <div style={{ color: C.muted, fontSize: '10px', marginBottom: '3px' }}>Requirement</div>
                  <input style={inp} value={newFlairReq} onChange={e => setNewFlairReq(e.target.value)} placeholder="e.g. 100+ posts in Gym" />
                </div>
                <div>
                  <div style={{ color: C.muted, fontSize: '10px', marginBottom: '3px' }}>Color</div>
                  <input type="color" value={newFlairColor} onChange={e => setNewFlairColor(e.target.value)}
                    style={{ width: '40px', height: '32px', background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer' }} />
                </div>
                <button onClick={addFlair} style={{ ...S.btn, height: '32px' }}>Add</button>
              </div>
            </div>
            <div style={{ border: `1px solid ${C.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#111115', borderBottom: `1px solid ${C.border}` }}>
                    {['Label', 'Requirement', 'Preview', 'Delete'].map(h => (
                      <th key={h} style={{ padding: '5px 10px', textAlign: 'left', color: C.muted, fontSize: '11px', fontWeight: 'normal' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flairs.map((f, i) => (
                    <tr key={f.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.panel : '#0f0f12' }}>
                      <td style={{ padding: '7px 10px', color: C.text }}>{f.label}</td>
                      <td style={{ padding: '7px 10px', color: C.muted, fontSize: '11px' }}>{f.requirement}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{
                          background: f.color + '22', color: f.color,
                          border: `1px solid ${f.color}66`, padding: '1px 6px',
                          fontSize: '10px', borderRadius: '2px',
                        }}>{f.label}</span>
                      </td>
                      <td style={{ padding: '7px 10px' }}>
                        <button onClick={() => deleteFlair(f.id)} style={{
                          background: 'none', border: `1px solid ${C.border}`, color: C.red,
                          fontSize: '11px', padding: '2px 8px', cursor: 'pointer', borderRadius: '2px',
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <input style={{ ...S.input, maxWidth: '300px' }} value={userSearch}
                onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." />
            </div>
            <div style={{ border: `1px solid ${C.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#111115', borderBottom: `1px solid ${C.border}` }}>
                    {['Username', 'Posts', 'Rep', 'Joined', 'Admin'].map(h => (
                      <th key={h} style={{ padding: '5px 10px', textAlign: 'left', color: C.muted, fontSize: '11px', fontWeight: 'normal' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase())).map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.panel : '#0f0f12' }}>
                      <td style={{ padding: '7px 10px' }}>
                        <a href={`/profile/${u.username}`} style={{ color: C.purple }}>{u.username}</a>
                      </td>
                      <td style={{ padding: '7px 10px', color: C.muted }}>{u.post_count}</td>
                      <td style={{ padding: '7px 10px', color: C.muted }}>{u.rep_score}</td>
                      <td style={{ padding: '7px 10px', color: C.muted, fontSize: '11px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <button onClick={() => toggleAdmin(u.id, u.is_admin)} style={{
                          padding: '2px 8px', fontSize: '11px', cursor: 'pointer', borderRadius: '2px',
                          background: u.is_admin ? C.amber + '22' : 'transparent',
                          color: u.is_admin ? C.amber : C.muted,
                          border: `1px solid ${u.is_admin ? C.amber : C.border}`,
                        }}>{u.is_admin ? 'Admin ✓' : 'Make Admin'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
