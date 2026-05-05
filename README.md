# Baduru on Finance

A personal blog for posting weekly notes on markets, macro, politics, and the
finance concepts behind them.

## Stack

- **Next.js 16** App Router (Turbopack) on **Vercel** Hobby
- **TypeScript** + **Tailwind v4** with custom design tokens
- **MDX** content via **Velite** (type-safe frontmatter, Zod-validated)
- **Fraunces** (display) + **Geist Sans** (body) + **Geist Mono** (numerals)
- **Recharts** for finance charts, **KaTeX** for formulas, **Shiki** for code
- **next-themes** for light/dark mode

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

The `dev` script runs Velite in watch mode alongside Next.js, so editing any
file in `content/` regenerates types and triggers HMR.

## Writing a post

1. Create `content/posts/YYYY-MM-slug.mdx`
2. Add frontmatter (validated by Velite at build time):
   ```yaml
   ---
   title: Your post title
   summary: One-or-two-line summary used in cards and OG images
   date: 2026-05-04
   tags: [macro, fed, rates]
   concepts: [fed-funds-rate, dot-plot]   # slugs from content/concepts/
   status: published
   ---
   ```
3. Reference a concept inline using `<ConceptBox term="...">...</ConceptBox>`,
   `<Callout variant="insight">...</Callout>`, or `<MiniChart data={[...]} />`
4. `npm run build` validates everything; `git push` deploys.

## Adding a concept

Create `content/concepts/<slug>.mdx`:

```yaml
---
term: Yield curve
shortDef: A line plotting Treasury yields across maturities.
category: rates
---

Long-form explanation of the concept goes here.
```

Concepts auto-populate the per-post **Concepts in this post** sidebar (right rail
on desktop, collapsible block on mobile) whenever a post lists their slug in
`concepts: []`.

## Design system

Key tokens live in `app/globals.css`:

- Light: warm paper `#FAF7F2` / ink `#0E0E10` / rust accent `#B7410E`
- Dark: deep ink `#0E0E10` / cream `#F5F1EA` / orange accent `#F97316`
- Type scale: `text-display` / `text-h1` / `text-h2` / `text-h3` / `text-lead` / `text-body` / `text-meta`
- All numerics use `font-variant-numeric: tabular-nums` site-wide

## Routes

| Path | Purpose |
|---|---|
| `/` | Home — hero + 6 latest posts |
| `/posts` | All posts, with tag filter |
| `/posts/[slug]` | Single post with concepts sidebar rail |
| `/concepts` | Glossary, A–Z |
| `/tags/[tag]` | Posts filtered by tag |
| `/about` | Bio |
| `/feed.xml` | RSS feed |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots |
| `/og/[slug]` | Dynamic OG image (1200×630) |

## Deploying to Vercel

1. Push this repo to GitHub:
   ```bash
   git remote add origin git@github.com:<you>/fin-blog.git
   git push -u origin main
   ```
2. On <https://vercel.com/new> import the repo. Defaults are correct
   (framework: Next.js, build command: `npm run build`).
3. After the first deploy, set `NEXT_PUBLIC_SITE_URL` in
   *Project → Settings → Environment Variables* to the production URL
   (e.g. `https://baduru-finance.vercel.app`) so RSS / sitemap / OG links
   point at the right host.
4. Toggle on Web Analytics in *Project → Analytics*.

## Phase 2 — automated posting (planned)

The repo is structured so a Vercel Cron Job can drop a fully-formed `.mdx`
file into `content/posts/` via the GitHub API on a schedule, opening a PR
for review. Phase 1 already enforces the schema, so a draft either validates
or doesn't — no broken builds. See `.claude/plans/i-want-to-run-shimmying-thimble.md`
for details.
