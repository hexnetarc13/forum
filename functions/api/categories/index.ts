export const runtime = 'edge';
export const onRequestGet = async ({ env }: any) => {
  const cats = await env.DB.prepare(`
    SELECT c.*,
      (SELECT COUNT(*) FROM threads t WHERE t.category_id = c.id) as thread_count,
      (SELECT MAX(t.last_reply_at) FROM threads t WHERE t.category_id = c.id) as last_post
    FROM categories c
    ORDER BY c.display_order ASC
  `).all();
  return Response.json(cats.results);
};
