# Getting started

Five minutes from `git clone` to a running Filmlog at `http://localhost:3000`.

## Prerequisites

- **Node.js 20.18+** or **22+** — check with `node --version`. If you don't have it, grab the LTS from <https://nodejs.org>.
- **npm** — ships with Node.
- **Git** — check with `git --version`.
- A text editor — VS Code or Cursor recommended.

## 1. Clone

```bash
git clone https://github.com/snotani/filmlog-nextjs.git
cd filmlog-nextjs
```

## 2. Install dependencies

```bash
npm install
```

This installs Next.js, React, Tailwind, Prisma, shadcn primitives, and everything in `package.json`. Expect ~30 seconds and a few harmless `npm warn` messages.

## 3. Set up your environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and fill in:

- `DATABASE_URL` — already set to `"file:./dev.db"`. Leave it.
- `TMDB_API_KEY` — get a free one in 30 seconds:
  1. Create an account at <https://www.themoviedb.org/signup>
  2. Go to <https://www.themoviedb.org/settings/api>
  3. Request a key (developer / personal use)
  4. Copy the **API Read Access Token** (the long one, starts with `eyJ...`) — *not* the short v3 API key
- `AUTH_SECRET` — only needed from Phase 2. When you get there, run `npx auth secret` and it'll write one in for you.
- Everything else — leave blank until the phase that needs it.

> `.env.local` is gitignored. Don't share it. The `.env.example` template is what gets committed.

## 4. Generate the Prisma client

```bash
npm run db:generate
```

This reads `prisma/schema.prisma` and produces a typed client at `lib/generated/prisma/` (also gitignored). You'll re-run this every time you change the schema.

## 5. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>. You should see the Filmlog placeholder home page.

## Verify everything is healthy

```bash
npm run lint     # eslint, should pass with no errors
npm run build    # full production build, should pass
```

## Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload at `http://localhost:3000` |
| `npm run build` | Production build (also catches type errors) |
| `npm run start` | Run the production build locally |
| `npm run lint` | ESLint with Next.js + TypeScript rules |
| `npm run db:generate` | Regenerate the Prisma client after a schema change |
| `npm run db:push` | Sync `schema.prisma` to your local SQLite file |
| `npm run db:studio` | Open Prisma Studio — a GUI to inspect your DB |

## Troubleshooting

**`Error: Cannot find module '@/lib/generated/prisma/client'`**
You haven't run `npm run db:generate` yet (or you ran it before changing the schema). Run it.

**`Error: TMDB request failed: 401`**
Your `TMDB_API_KEY` is missing or wrong. Make sure you copied the **API Read Access Token**, not the v3 short key. Restart the dev server after editing `.env.local`.

**`EADDRINUSE: address already in use :::3000`**
Something else is on port 3000. Either kill it (`lsof -ti:3000 | xargs kill`) or run `PORT=3001 npm run dev`.

**Changes to `.env.local` aren't taking effect.**
Next.js reads env vars once at startup. Stop the dev server (`Ctrl+C`) and run `npm run dev` again.

**Tailwind classes aren't applying.**
Make sure the file is imported (the page or layout must somewhere reach `app/globals.css`, which `app/layout.tsx` already does). If you wrote a class like `text-primary` and got nothing, check `app/globals.css` to see whether the token is defined.

**`npm install` complains about engine versions.**
You're probably on an old Node. Run `nvm install 22 && nvm use 22` or grab the latest LTS from nodejs.org.
