'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { C } from '@/lib/styles';

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  thread_count?: number;
  last_post?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 12px' }}>

        {/* Welcome banner */}
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          padding: '10px 14px', marginBottom: '12px',
          borderLeft: `3px solid ${C.purple}`,
        }}>
          <span style={{ color: C.white, fontWeight: 'bold' }}>Welcome to MAXXFORUM.</span>
          <span style={{ color: C.muted, marginLeft: '8px' }}>
            Self-improvement. Looksmaxxing. Gymmaxxing. Real talk, no filters.
          </span>
          <span style={{ marginLeft: '8px' }}>
            <a href="/register" style={{ color: C.red }}>Register</a>
            <span style={{ color: C.muted }}> or </span>
            <a href="/login" style={{ color: C.muted }}>login</a>
            <span style={{ color: C.muted }}> to post.</span>
          </span>
        </div>

        {/* Category table */}
        <div style={{ border: `1px solid ${C.border}` }}>
          <div style={{
            background: '#1a1a20', borderBottom: `1px solid ${C.border}`,
            padding: '6px 10px',
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: '12px', letterSpacing: '1px', color: C.white,
            textTransform: 'uppercase',
          }}>
            Forum Categories
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#111115', borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: '5px 10px', textAlign: 'left', color: C.muted, fontSize: '11px', fontWeight: 'normal' }}>Category</th>
                <th style={{ padding: '5px 10px', textAlign: 'center', color: C.muted, fontSize: '11px', fontWeight: 'normal', width: '70px' }}>Threads</th>
                <th style={{ padding: '5px 10px', textAlign: 'left', color: C.muted, fontSize: '11px', fontWeight: 'normal', width: '180px' }}>Last Post</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} style={{
                  borderBottom: `1px solid ${C.border}`,
                  background: i % 2 === 0 ? C.panel : '#0f0f12',
                }}>
                  <td style={{ padding: '9px 10px' }}>
                    <a href={`/category/${cat.slug}`} style={{
                      color: C.white, fontWeight: 'bold', fontSize: '13px',
                    }}>{cat.name}</a>
                    <div style={{ color: C.muted, fontSize: '11px', marginTop: '2px' }}>{cat.description}</div>
                  </td>
                  <td style={{ padding: '9px 10px', textAlign: 'center', color: C.muted, fontSize: '12px' }}>
                    {cat.thread_count ?? 0}
                  </td>
                  <td style={{ padding: '9px 10px', color: C.muted, fontSize: '11px' }}>
                    {cat.last_post ? new Date(cat.last_post).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: C.muted }}>Loading...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <a href="/create" style={{
            background: C.red, color: C.white, padding: '6px 16px',
            fontSize: '12px', fontWeight: 'bold', borderRadius: '2px',
          }}>+ New Thread</a>
        </div>

      </div>
    </div>
  );
}
