'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { C, S } from '@/lib/styles';

// 1. Isolate the component that uses `useSearchParams`
function CreateThreadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(cats => {
      setCategories(cats);
      const catSlug = searchParams.get('cat');
      if (catSlug) {
        const match = cats.find((c: any) => c.slug === catSlug);
        if (match) setCategoryId(match.id);
      }
    });
    const token = localStorage.getItem('forum_token');
    if (!token) router.push('/login');
  }, [router, searchParams]); // Added dependencies to satisfy React Hook rules

  async function submit() {
    setError('');
    const token = localStorage.getItem('forum_token');
    if (!token) { router.push('/login'); return; }
    const res = await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content, category_id: categoryId }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    router.push(`/thread/${data.id}`);
  }

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '0 12px' }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div style={S.sectionHead}>New Thread</div>
        <div style={{ padding: '20px' }}>
          {error && <div style={{ color: C.red, fontSize: '12px', marginBottom: '10px' }}>{error}</div>}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Category</div>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ ...S.input }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Title</div>
            <input style={S.input} placeholder="Thread title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: C.muted, fontSize: '11px', marginBottom: '4px' }}>Content</div>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              style={{ ...S.input, height: '180px', resize: 'vertical' }}
              placeholder="Write your post..." />
          </div>
          <button onClick={submit} style={S.btn}>Post Thread</button>
          <button onClick={() => router.back()} style={{ ...S.btnSecondary, marginLeft: '8px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// 2. Wrap the form in Suspense in the main page component
export default function Create() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      {/* Suspense will render the fallback text on the server during `npm run build`,
        allowing Next.js to successfully compile the page. 
      */}
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '40px', color: C.muted }}>
          Loading editor...
        </div>
      }>
        <CreateThreadForm />
      </Suspense>
    </div>
  );
}