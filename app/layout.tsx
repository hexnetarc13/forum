export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Forces Next.js to check the DB every time
export const revalidate = 0;           // Prevents Cloudflare from caching old titles

import type { Metadata } from 'next';

// This function makes your Browser Tab Title update from the Admin Panel
export async function generateMetadata(): Promise<Metadata> {
  const db = (process.env as any).DB;
  let title = 'MAXXFORUM';
  let subtitle = 'self improvement. no filters.';

  try {
    if (db) {
      const titleRow = await db.prepare('SELECT value FROM site_config WHERE key = ?').bind('title').first();
      const subRow = await db.prepare('SELECT value FROM site_config WHERE key = ?').bind('subtitle').first();
      if (titleRow) title = titleRow.value;
      if (subRow) subtitle = subRow.value;
    }
  } catch (e) {
    // Falls back to defaults if DB is sleeping
  }

  return {
    title: `${title} — ${subtitle}`,
    description: 'Looksmaxxing, fitness, skincare, and self-improvement community.',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const db = (process.env as any).DB;
  let accent = '#7c5cff'; // Fallback color

  try {
    if (db) {
      const res = await db.prepare('SELECT value FROM site_config WHERE key = ?').bind('accent_color').first();
      if (res) accent = res.value;
    }
  } catch (e) {}

  return (
    <html lang="en">
      <head>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #0d0d0f;
            color: #d4d4d8;
            font-family: Tahoma, Verdana, sans-serif;
            font-size: 13px;
          }
          /* DYNAMIC ACCENT COLOR: This makes your color picker work live */
          a { color: ${accent}; text-decoration: none; }
          a:hover { text-decoration: underline; color: ${accent}; filter: brightness(1.2); }
          
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #0d0d0f; }
          ::-webkit-scrollbar-thumb { background: #222228; }
          input, textarea, select, button {
            font-family: Tahoma, Verdana, sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
