# Filmlog

A Letterboxd-lite movie diary app you'll build phase by phase to learn Next.js end to end.

> This is a teaching project. The full app pitch, requirements, and per-phase briefs live in [`docs/`](docs/).

## Quick start

1. Clone the repo.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values.
4. `npm run db:generate`
5. `npm run dev`

Detailed setup, troubleshooting, and useful scripts: [`docs/getting-started.md`](docs/getting-started.md).

## What you'll build

A small but real movie-tracking app:

- Browse trending films from TMDB
- Sign up, log films you've watched, rate and review them
- Follow other users and see a feed of their activity
- Public profile, public lists, and shareable OG images
- Deployed to Vercel

## Lesson roadmap

Each phase ships a visible feature and introduces a cluster of Next.js concepts. Open the per-phase brief for goals, acceptance criteria, and task list.

- Phase 0 — [Setup & App Router foundations](docs/phases/00-setup.md)
- Phase 1 — [Browsing films](docs/phases/01-browsing-films.md) (RSC, dynamic routes, ISR, metadata)
- Phase 2 — [Search & loading/error states](docs/phases/02-search-and-loading-states.md) (Route Handlers)
- Phase 3 — [Auth & profiles](docs/phases/03-auth-and-profiles.md) (Auth.js v5, middleware)
- Phase 4 — [The diary](docs/phases/04-the-diary.md) (Server Actions, mutations)
- Phase 5 — [Ratings & reviews](docs/phases/05-ratings-and-reviews.md) (client/server boundary)
- Phase 6 — [Lists & OG images](docs/phases/06-lists-and-og-images.md) (Prisma relations, `next/og`)
- Phase 7 — [Follow & feed](docs/phases/07-follow-and-feed.md) (caching, revalidation)
- Phase 8 — [Polish & deploy](docs/phases/08-polish-and-deploy.md) (Suspense streaming, SEO, Vercel)

## Stack

Next.js 16 (App Router) - TypeScript - Tailwind CSS - shadcn/ui - Prisma - Auth.js v5 - Zod - Resend - TMDB - Vercel.

Full rationale: [`docs/tech-stack.md`](docs/tech-stack.md).

## Product brief

Full feature inventory, route map, and data model: [`docs/requirements.md`](docs/requirements.md).
