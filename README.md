# TrendPulse v2 — AI Content Idea Generator

Light, airy redesign with Supabase auth + server-side Claude API.

## Quick Start

### 1. Install Node.js
Download from https://nodejs.org (LTS version)

### 2. Set up Supabase
1. Create a free project at https://supabase.com
2. In the SQL Editor, run the contents of `supabase/schema.sql`
3. Copy your Project URL and anon key from Settings → API

### 3. Configure environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-api03-your-key
```

### 4. Run the app
```bash
npm install
npm run dev
```
Open http://localhost:3000

## What's included

| Feature | Details |
|---|---|
| Auth | Email + password via Supabase Auth |
| Usage tracking | 10 free AI generations/month, resets automatically |
| Usage counter | Header pill showing X/10 used with a progress bar |
| Limit message | Friendly "paid plans coming soon" banner at 10/10 |
| AI generation | Claude Haiku via server-side API route (key never exposed to browser) |
| Trend browsing | 16 trends across 9 categories with heat scores |
| Category filters | Horizontal chip filter bar |
| Bookmarks | Persisted to Supabase per user with RLS |
| Search | Live search across title, description, category, tags |
| Sort | By heat score, name, or newest |
| Design | Light airy palette, soft warm tones, rounded edges |
| RLS security | All Supabase tables protected with Row Level Security |

## Architecture

```
app/
  auth/page.js        → Login / signup UI
  dashboard/page.js   → Main trend browser + bookmarks
  api/generate/route.js → Server-side Claude API call
lib/
  supabase.js         → Browser Supabase client
  supabaseServer.js   → Server Supabase client (for API routes)
  trends.js           → Trend data + category colours
supabase/
  schema.sql          → Tables, RLS policies, trigger
```

## Security notes
- `ANTHROPIC_API_KEY` lives only in `.env.local` and is used exclusively in the server-side API route — never sent to the browser.
- All database access goes through Supabase RLS: users can only read/write their own profile and bookmarks.
- Usage is tracked and enforced server-side so the limit cannot be bypassed from the browser.
