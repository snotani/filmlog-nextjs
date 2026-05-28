# Tech stack

Why each piece is here, in plain English.

## Next.js 16 (App Router)

The framework. We use the **App Router** (the `app/` directory), which is the modern Next.js paradigm. It gives us:

- File-system routing (every folder is a URL segment)
- Server Components by default (most of our React runs on the server)
- Server Actions for form mutations without writing API endpoints
- Built-in support for `loading.tsx`, `error.tsx`, metadata, and OG image generation

Docs: <https://nextjs.org/docs>

## TypeScript

Catches bugs at build time, gives autocompletion everywhere, and is the lingua franca of modern Next.js tutorials and libraries. If you've never written TS, don't worry — we use it lightly and most types are inferred.

Docs: <https://www.typescriptlang.org/docs>

## Tailwind CSS v4

Utility-first CSS. Instead of writing `.button { padding: ...; background: ... }` in a separate stylesheet, you compose classes like `px-4 py-2 bg-primary` directly on the element. Faster to iterate, no naming things, no dead CSS.

v4 is CSS-first — there's no `tailwind.config.ts`. Theme tokens live in `app/globals.css`.

Docs: <https://tailwindcss.com/docs>

## shadcn/ui

A collection of accessible, copy-pasteable React components built on Tailwind. **It's not a library** — when you "add" a component, the code lands in your `components/ui/` folder and you own it. Style it, fork it, delete what you don't need.

We initialized it with the `base-nova` preset and `neutral` palette.

Docs: <https://ui.shadcn.com/docs>

## Prisma ORM

Talks to the database with full TypeScript types. You describe your tables in `prisma/schema.prisma`, run a command, and you get a typed client with autocomplete for every model and field.

Locally we use **SQLite** (a single file at `prisma/dev.db`, zero setup). In production we'll switch to **Postgres** on Neon — the schema and queries stay the same.

Docs: <https://www.prisma.io/docs>

## Auth.js v5 (NextAuth)

Authentication library purpose-built for Next.js. We use it with the **Credentials** provider (email + password) and **Google** OAuth in later phases. It plays nicely with Server Components, middleware, and Prisma.

Docs: <https://authjs.dev>

## Zod

Runtime schema validation for TypeScript. Every Server Action that accepts form input runs the data through a Zod schema first. If validation fails, you get a typed error to render back to the user.

Docs: <https://zod.dev>

## Resend

Transactional email API with first-class Next.js support. We use it in Phase 8 to send a weekly "your week in film" digest via a Vercel cron job. You can build and read emails as React components.

Docs: <https://resend.com/docs>

## TMDB (The Movie Database)

Free movie data API. We use it to fetch trending films, film details (cast, runtime, posters, backdrops), and search results. You'll need an API key (free, instant) — see `docs/getting-started.md`.

Docs: <https://developer.themoviedb.org/docs>

## Vercel

We deploy to Vercel because it's built by the Next.js team and "just works": preview deploys per branch, environment variable management, cron jobs, OG image generation, Postgres database (via Neon partnership), and edge functions. Free tier is generous enough for a teaching project.

Docs: <https://vercel.com/docs>

---

## What we deliberately *don't* use

- **No state management library** (Redux, Zustand). Server Components + Server Actions cover most of what you'd normally reach for.
- **No CSS-in-JS** (styled-components, emotion). Tailwind covers our styling and renders cleanly in Server Components without runtime overhead.
- **No separate API server.** Next.js Route Handlers and Server Actions are our backend.
- **No tRPC** (yet). Server Actions handle the same job for our scale.
