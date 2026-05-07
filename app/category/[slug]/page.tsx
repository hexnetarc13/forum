export const runtime = 'edge';

'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { C } from '@/lib/styles';

interface Thread {
  id: string;
  title: string;
  username: string;
  reply_count: number;
  views: number;
  created_at: string;
  last_reply_at: string;
  is_pinned: number;
  is_locked: number;
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [catName, setCatName] = useState('');

  useEffect(() => {
    fetch(`/api/threads?category=${slug}`)
      .then(r => r.json())
      .then(d => { setThreads(d.threads || []); setCatName(d.category_name || String(slug)); })
      .catch(() => {});
  }, [slug]);

  return (
    <div style={{ background: '#0d0d0f', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 12px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', color: C.muted, marginBottom: '10px' }}>
          <a href="/" style={{ color: C.muted }}>Home</a>
          <span style={{ margin: '0 5px' }}>›</span>
          <span style={{ color: C.text }}>{catName}</span>
        </div>

        <div style={{ border: `1px solid ${C.border}` }}>
          <div style={{
            background: '#1a1a20', borderBottom: `1px solid ${C.border}`,
            padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              fontSize: '12px', letterSpacing: '1px', color: C.white, textTransform: 'uppercase',
            }}>{catName}</span>
            <a href={`/create?cat=${slug}`} style={{
              background: C.red, color: C.white, padding: '3px 10px',
              fontSize: '11px', fontWeight: 'bold', borderRadius: '2px',
            }}>+ New Thread</a>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#111115', borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: '5px 10px', textAlign: 'left', color: C.muted, fontSize: '11px', fontWeight: 'normal' }}>Thread</th>
                <th style={{ padding: '5px 10px', textAlign: 'center', color: C.muted, fontSize: '11px', fontWeight: 'normal', width: '55px' }}>Replies</th>
                <th style={{ padding: '5px 10px', textAlign: 'center', color: C.muted, fontSize: '11px', fontWeight: 'normal', width: '55px' }}>Views</th>
                <th style={{ padding: '5px 10px', textAlign: 'left', color: C.muted, fontSize: '11px', fontWeight: 'normal', width: '150px' }}>Last Post</th>
              </tr>
            </thead>
            <tbody>
              {threads.map((t, i) => (
                <tr key={t.id} style={{
                  borderBottom: `1px solid ${C.border}`,
                  background: i % 2 === 0 ? C.panel : '#0f0f12',
                }}>
                  <td style={{ padding: '8px 10px' }}>
                    {t.is_pinned === 1 && (
                      <span style={{ color: C.amber, fontSize: '10px', marginRight: '6px' }}>[PIN]</span>
                    )}
                    {t.is_locked === 1 && (
                      <span style={{ color: C.muted, fontSize: '10px', marginRight: '6px' }}>[LOCKED]</span>
                    )}
                    <a href={`/thread/${t.id}`} style={{ color: C.white, fontWeight: 'bold', fontSize: '13px' }}>{t.title}</a>
                    <span style={{ color: C.muted, fontSize: '11px', marginLeft: '8px' }}>by {t.username}</span>
                    <div style={{ color: C.muted, fontSize: '10px', marginTop: '2px' }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: C.muted, fontSize: '12px' }}>{t.reply_count}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: C.muted, fontSize: '12px' }}>{t.views}</td>
                  <td style={{ padding: '8px 10px', color: C.muted, fontSize: '11px' }}>
                    {t.last_reply_at ? new Date(t.last_reply_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
              {threads.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: C.muted }}>
                  No threads yet. <a href={`/create?cat=${slug}`} style={{ color: C.purple }}>Be the first.</a>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
