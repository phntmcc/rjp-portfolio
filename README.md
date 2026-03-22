# RJP Portfolio

Modern portfolio site built with Next.js App Router, Tailwind CSS v4, and Supabase-backed photography management.

## Highlights

- Fast, responsive portfolio UI for projects and creative work
- Photography gallery with metadata-aware rendering
- Admin photography workflows backed by Supabase
- CI checks for linting, type safety, and production build validation

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Supabase
- Biome + ESLint
- GitHub Actions (CI)

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy `.env.example` into `.env.local` and fill in the values:

```bash
# macOS / Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ADMIN_EMAILS`
- `NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS`

Optional variables:

- `SUPABASE_PHOTOS_BUCKET` (default: `photos`)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 3) Run the app

```bash
npm run dev
```

## Quality Checks

Run all pre-deploy checks:

```bash
npm run predeploy
```

Or run them individually:

```bash
npm run lint
npm run typecheck
npm run build
```

## Supabase Setup

Run SQL migration(s):

- `supabase/sql/001_photos.sql`

## Deployment

This project is designed to deploy on Vercel. Once the GitHub repo is connected to Vercel, pushes to `main` can deploy automatically.

Recommended branch workflow:

- Pull requests run CI (`lint`, `typecheck`, `build`)
- Merge into `main`
- Vercel auto-deploys `main`

## Security Notes

- Never commit `.env.local` or any secret-bearing `.env*` file
- `SUPABASE_SERVICE_ROLE_KEY` must only be set in secure server-side environments (Vercel project settings), never exposed client-side
- If a secret is ever committed, rotate it immediately in the provider dashboard
