export const onRequestGet = async ({ env }: any) => {
  const rows = await env.DB.prepare('SELECT key, value FROM site_config').all();
  const config: Record<string, string> = {};
  for (const row of rows.results as { key: string; value: string }[]) {
    config[row.key] = row.value;
  }
  return Response.json(config);
};
