# Filmlog

A Letterboxd-lite movie diary app you'll build phase by phase to learn Next.js end to end.

> This is a teaching project. The full app pitch, requirements, and per-phase briefs live in [`docs/`](docs/).

## Quick start

1. Clone the repo.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values.
4. `npm run dev`

Detailed setup instructions: [`docs/getting-started.md`](docs/getting-started.md) _(coming soon)_.

## What you'll build

A small but real movie-tracking app:

- Browse trending films from TMDB
- Sign up, log films you've watched, rate and review them
- Follow other users and see a feed of their activity
- Public profile, public lists, and shareable OG images
- Deployed to Vercel

## Lesson roadmap

Each phase ships a visible feature and introduces a cluster of Next.js concepts.

- Phase 0 — Setup & App Router foundations
- Phase 1 — Browsing films (RSC, dynamic routes, ISR, metadata)
- Phase 2 — Search & loading/error states (Route Handlers)
- Phase 3 — Auth & profiles (Auth.js v5, middleware)
- Phase 4 — The diary (Server Actions, mutations)
- Phase 5 — Ratings & reviews (client/server boundary)
- Phase 6 — Lists & OG images (Prisma relations, `next/og`)
- Phase 7 — Follow & feed (caching, revalidation)
- Phase 8 — Polish & deploy (Suspense streaming, SEO, Vercel)

Per-phase briefs land in [`docs/phases/`](docs/phases/) as we go.

## Stack

Next.js 15 (App Router) - TypeScript - Tailwind CSS - shadcn/ui - Prisma - Auth.js v5 - Zod - Resend - TMDB - Vercel.

Full rationale: [`docs/tech-stack.md`](docs/tech-stack.md) _(coming soon)_.
