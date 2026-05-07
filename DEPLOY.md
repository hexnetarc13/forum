# MAXXFORUM — Deploy Guide

## Your D1 Database
Already created and seeded:
- Name: forum-db
- ID: 487b16be-d5b1-4509-a07a-52f8940d9a80
- Already has: all tables, categories, ranks, flair tags, site config

---

## Step 1 — Install dependencies

```bash
cd forum
npm install
```

---

## Step 2 — Set your JWT secret in wrangler.toml

Open `wrangler.toml` and change:
```
JWT_SECRET = "CHANGE_THIS_TO_A_LONG_RANDOM_STRING_AT_LEAST_32_CHARS"
```
to a real random string like: `xK9#mP2$vL8@nQ5!wR3&jT6^yU1*oH4`

---

## Step 3 — Local dev (optional, to test before deploy)

```bash
# Terminal 1
npm run dev

# Terminal 2
npx wrangler pages dev .next --d1=DB:487b16be-d5b1-4509-a07a-52f8940d9a80
```

Visit http://localhost:3000

---

## Step 4 — Build and deploy to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy .next --project-name=forum
```

---

## Step 5 — Set env vars in Cloudflare Pages dashboard

Go to: Cloudflare Dashboard → Pages → forum → Settings → Environment Variables

Add:
- `JWT_SECRET` = your random secret string (same as wrangler.toml)

---

## Step 6 — First login = auto admin

The FIRST account you register on the live site is automatically made admin.
After registering, you'll see an [ADMIN] button in the header → full admin panel.

---

## Adding your logo

1. Upload your logo image to Cloudflare R2 or any CDN/image host
2. Go to /admin → Site Config tab
3. Paste the logo URL into "Logo URL"
4. Hit Save — logo appears immediately in the header

---

## Changing the forum title

Go to /admin → Site Config → change "Forum Title" and "Subtitle"

---

## Admin panel features at /admin

- **Site Config**: Title, subtitle, logo URL, accent color
- **Ranks**: Add/delete rank tiers with custom names, post thresholds, colors
- **Flair Tags**: Add/delete user flair badges with labels, colors, requirements
- **Users**: View all users, grant/revoke admin status

---

## GIF Gallery

- Visible to everyone at /gifs
- Only admins can add GIFs (paste any direct .gif URL)
- Supports categories: reaction, progress, fitness, humor, general
- Filter by category with one click
