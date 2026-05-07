export const runtime = 'edge';

'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import PostBlock from '@/components/PostBlock';
import { C, S } from '@/lib/styles';

export default function ThreadPage() {
  const { id } = useParams();
  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetch(`/api/threads/${id}`).then(r => r.json()).then(d => {
      setThread(d.thread);
      setReplies(d.replies || []);
    }).catch(() => {});
  }

  useEffect(() => {
    const stored = localStorage.getItem('forum_user');
    if (stored) setUser(JSON.parse(stored));
    load();
  }, [id]);

  async function sendReply() {
    const token = localStorage.getItem('forum_token');
    if (!token || !reply.trim() || submitting) return;
    setSubmitting(true);
    await fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ thread_id: id, content: reply }),
    });
    setReply('');
    setSubmitting(false);
    load();
  }

  if (!thread) return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '40px', textAlign: 'center', color: C.muted }}>loading...</div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 12px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', color: C.muted, marginBottom: '10px' }}>
          <a href="/" style={{ color: C.muted }}>Home</a>
          <span style={{ margin: '0 5px' }}>›</span>
          <span style={{ color: C.text }}>{thread.title}</span>
        </div>

        {/* Thread title */}
        <div style={{
          background: '#1a1a20', border: `1px solid ${C.border}`,
          borderBottom: 'none', padding: '8px 12px',
          fontFamily: 'Impact, Arial Black, sans-serif',
          fontSize: '14px', letterSpacing: '0.5px', color: C.white,
        }}>
          {thread.title}
        </div>

        {/* Posts */}
        <div style={{ border: `1px solid ${C.border}` }}>
          <PostBlock post={thread} isOP={true} />
          {replies.map(r => <PostBlock key={r.id} post={r} isOP={false} />)}
        </div>

        {/* Reply box */}
        <div style={{ marginTop: '10px' }}>
          {user ? (
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '10px' }}>
              <div style={{ fontSize: '11px', color: C.muted, marginBottom: '5px' }}>
                Reply as <span style={{ color: C.purple }}>{user.username}</span>
              </div>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                style={{ ...S.input, height: '100px', resize: 'vertical' }}
                placeholder="Write your reply..."
              />
              <button
                onClick={sendReply}
                disabled={submitting}
                style={{ ...S.btn, marginTop: '6px', opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '12px', textAlign: 'center', color: C.muted, fontSize: '12px', border: `1px solid ${C.border}`, background: C.panel }}>
              <a href="/login" style={{ color: C.purple }}>Login</a> or <a href="/register" style={{ color: C.purple }}>register</a> to reply.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
