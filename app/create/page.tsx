'use client';

export const runtime = 'edge';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { C, S } from '@/lib/styles';

function CreateThreadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Added a timestamp to the URL to bypass any Cloudflare/Next.js caching
    fetch(`/api/categories?t=${Date.now()}`)
      .then(r => r.json())
      .then(cats => {
        if (Array.isArray(cats)) {
          setCategories(cats);
          // Set default category if one exists
          if (cats.length > 0) setCategoryId(cats[0].id);

          // Handle slug from URL
          const catSlug = searchParams.get('cat');
          if (catSlug) {
            const match = cats.find((c: any) => c.slug === catSlug);
            if (match) setCategoryId(match.id);
          }
        } else {
          console.error("Categories API did not return an array:", cats);
          setError("Failed to load categories. Please check D1 database.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Network error loading categories.");
        setLoading(false);
      });

    const token = localStorage.getItem('forum_token');
    if (!token) router.push('/login');
  }, [router, searchParams]);

  async function submit() {
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required.');
      return;
    }

    const token = localStorage.getItem('forum_token');
    if (!token) { router.push('/login'); return; }

    const res = await fetch('/api/threads', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ title, content, category_id: categoryId }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed to post thread'); return; }
    
    // Success! Redirect to the new thread
    router.push(`/thread/${data.id}`);
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: C.muted }}>Loading forum data...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '0 12px' }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div style={S.sectionHead}>New Thread</div>
        <div style={{ padding: '20px' }}>
          {error && (
            <div style={{ 
              background: 'rgba(255,0,0,0.1)', 
              border: `1px solid ${C.red}`, 
              color: C.red, 
              padding: '10px', 
              fontSize: '13px', 
              marginBottom: '15px' 
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Category</div>
            <select 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)} 
              style={{ ...S.input, appearance: 'none' }}
            >
              {categories.length === 0 && <option>No categories found</option>}
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Title</div>
            <input 
              style={S.input} 
              placeholder="Give your thread a clear title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Content</div>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)}
              style={{ ...S.input, height: '220px', resize: 'vertical', lineHeight: '1.5' }}
              placeholder="What's on your mind?" 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={submit} style={S.btn}>Post Thread</button>
            <button 
              onClick={() => router.back()} 
              style={{ ...S.btnSecondary, marginLeft: '12px', background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Create() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '40px', color: C.muted }}>
          Initializing editor...
        </div>
      }>
        <CreateThreadForm />
      </Suspense>
    </div>
  );
}
