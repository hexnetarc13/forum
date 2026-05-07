import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MAXXFORUM — self improvement. no filters.',
  description: 'Looksmaxxing, fitness, skincare, and self-improvement community.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          a { color: #7c5cff; text-decoration: none; }
          a:hover { text-decoration: underline; color: #9d7fff; }
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
