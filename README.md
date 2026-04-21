# NextBound — Marketing intelligence MVP

Dummy-data dashboard: **funnel + revenue**, **cohort retention / revenue**, **CAC vs LTV** scatter. Built with Vite, React, TypeScript, Tailwind, Recharts.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default [http://localhost:5174](http://localhost:5174)).

## Deploy

- **Vercel / Netlify / Cloudflare Pages:** set root to this repo, build `npm run build`, output `dist`.
- **GitHub Pages:** set `MARKETING_MVP_BASE=/<repo>/` at build time for project pages, or `/` for a custom domain at root.

See `netlify.toml` and `vercel.json` for hints.
