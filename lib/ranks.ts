export interface Rank {
  label: string;
  min_posts: number;
  color: string;
}

// Fallback ranks if DB is unavailable
export const DEFAULT_RANKS: Rank[] = [
  { label: 'Lurker',        min_posts: 0,    color: '#3f3f46' },
  { label: 'Newcomer',      min_posts: 5,    color: '#52525b' },
  { label: 'Regular',       min_posts: 20,   color: '#71717a' },
  { label: 'Contributor',   min_posts: 50,   color: '#a1a1aa' },
  { label: 'Dedicated',     min_posts: 100,  color: '#7c5cff' },
  { label: 'Veteran',       min_posts: 250,  color: '#a855f7' },
  { label: 'Senior Member', min_posts: 500,  color: '#ff6b35' },
  { label: 'Elite',         min_posts: 1000, color: '#cc2222' },
  { label: 'Legend',        min_posts: 2500, color: '#f59e0b' },
];

export function getRankFromList(postCount: number, ranks: Rank[]): Rank {
  const sorted = [...ranks].sort((a, b) => b.min_posts - a.min_posts);
  return sorted.find(r => postCount >= r.min_posts) ?? sorted[sorted.length - 1];
}

export function getRank(postCount: number): string {
  return getRankFromList(postCount, DEFAULT_RANKS).label;
}

export function getRankColor(postCount: number): string {
  return getRankFromList(postCount, DEFAULT_RANKS).color;
}
