import { getRank, getRankColor } from '@/lib/ranks';
import { C } from '@/lib/styles';

interface Post {
  id: string;
  username: string;
  post_count?: number;
  avatar_url?: string;
  user_joined?: string;
  created_at: string;
  content: string;
}

export default function PostBlock({ post, isOP }: { post: Post; isOP: boolean }) {
  const rank = getRank(post.post_count || 0);
  const rankColor = getRankColor(post.post_count || 0);

  return (
    <div style={{
      display: 'flex', borderBottom: `1px solid ${C.border}`,
      background: isOP ? '#131317' : '#0f0f12',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '90px', minWidth: '90px', borderRight: `1px solid ${C.border}`,
        padding: '10px 8px', textAlign: 'center',
      }}>
        <div style={{
          width: '44px', height: '44px', margin: '0 auto 6px',
          border: `1px solid ${C.border}`, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.border, fontSize: '16px', background: '#1a1a20',
        }}>
          {post.avatar_url
            ? <img src={post.avatar_url} width={44} height={44} alt="" style={{ objectFit: 'cover' }} />
            : '👤'}
        </div>
        <a href={`/profile/${post.username}`} style={{
          color: C.purple, fontWeight: 'bold', fontSize: '12px',
          display: 'block', marginBottom: '2px', wordBreak: 'break-all',
        }}>{post.username}</a>
        <div style={{ color: rankColor, fontSize: '10px', marginBottom: '2px' }}>{rank}</div>
        <div style={{ color: '#3f3f46', fontSize: '10px' }}>Posts: {post.post_count || 0}</div>
        <div style={{ color: '#3f3f46', fontSize: '10px' }}>
          Since: {new Date(post.user_joined || post.created_at).getFullYear()}
        </div>
        {isOP && (
          <div style={{ color: C.red, fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>OP</div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '10px 14px' }}>
        <div style={{
          fontSize: '10px', color: '#3f3f46',
          marginBottom: '8px', borderBottom: `1px solid #1a1a1f`,
          paddingBottom: '5px',
        }}>
          {new Date(post.created_at).toLocaleString()}
        </div>
        <div style={{ fontSize: '13px', lineHeight: '1.65', color: C.text, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>
      </div>
    </div>
  );
}
