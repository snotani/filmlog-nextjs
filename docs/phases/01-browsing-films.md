# Phase 1 — Browsing films

## Goal

Replace the placeholder home page with a real grid of trending films from TMDB, and add a film detail page at `/film/[id]` that's pre-built at deploy time and cached for 24 hours.

## What you'll build

- A home page that shows a responsive grid of films TMDB says are trending this week.
- A film detail page with the backdrop, poster, title, year, runtime, overview, and top cast.
- Per-page SEO metadata so links to a film page show a proper preview when pasted in Discord/Twitter/iMessage.
- Posters loaded through `next/image` with automatic resizing and lazy loading.

## Acceptance criteria

- [ ] The home page at `/` shows a grid of at least 12 films pulled from TMDB. No spinner, no flash.
- [ ] Clicking any film navigates to `/film/[id]` and shows the detail layout. Refresh works.
- [ ] `/film/9999999` (a nonsense id) renders the not-found page.
- [ ] View source on `/film/[some-id]` shows `<title>` and `<meta name="description">` derived from the film, and OG image tags pointing at the poster.
- [ ] `npm run build` finishes successfully and the route table shows `● /film/[id]  (SSG)` with prerendered IDs listed.
- [ ] All TMDB API calls happen on the server — `view source` and the Network tab show no requests to `api.themoviedb.org` from the browser.

## Task list

1. Get a free TMDB API key (the v4 **Read Access Token**, *not* the v3 short key). Set it as `TMDB_API_KEY` in `.env.local` and restart `npm run dev`.
2. Install the `server-only` package — it lets you mark a file so it can never be imported into a Client Component.
3. Create `lib/tmdb.ts` with three exported async functions: `getTrendingFilms()`, `getFilm(id)`, `getFilmCast(id)`. They should call TMDB with the Bearer token in the `Authorization` header. Cache each response with the `next: { revalidate }` option on `fetch`. Map TMDB's raw fields (`poster_path`, `release_date`) to a tidy `Film` type for your app.
4. Update `next.config.ts` to allow `image.tmdb.org` in `images.remotePatterns`.
5. Build `components/film-poster.tsx` — a wrapper around `next/image` that handles the "no poster" case. Use `fill` mode inside a relatively-positioned div.
6. Build `components/film-card.tsx` — a `<Link>` to `/film/[id]` wrapping the poster + title + year.
7. Rewrite `app/page.tsx` as an `async function`. Fetch trending films and render them in a responsive grid. Export `const revalidate = 21600` (six hours).
8. Create `app/film/[id]/page.tsx`. It receives `params: Promise<{ id: string }>`. Inside, `await` params, fetch the film and cast in parallel with `Promise.all`, and render the detail layout. If the film is null, call `notFound()`.
9. In `app/film/[id]/page.tsx`, export `generateStaticParams` that returns the first 20 trending film IDs so they're pre-built.
10. In `app/film/[id]/page.tsx`, export `generateMetadata` that returns title, description, and OG image based on the film.
11. Run `npm run build` and study the route table.

## New concepts you'll meet

- `async` Server Components and `await`-ing data in JSX
- Dynamic route segments — `[param]`
- `params` as a Promise (Next.js 15+)
- `generateStaticParams` and `dynamicParams`
- ISR via `export const revalidate`
- `fetch` caching with `{ next: { revalidate } }`
- `generateMetadata` and the metadata template
- `next/image` with `fill` + `sizes` for external CDNs
- `notFound()` and the `not-found.tsx` convention
- `import "server-only"`

## Suggested reading

- [Fetching data on the server with the `fetch` API](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Dynamic routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Caching: `revalidate`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate)
- [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [`next/image`](https://nextjs.org/docs/app/api-reference/components/image)
- [TMDB API getting started](https://developer.themoviedb.org/docs/getting-started)

## Stretch goals

- Add a "Released this year" section to the home page using TMDB's `/discover/movie?year=...` endpoint.
- Add a "More like this" carousel on the film detail page using `/movie/{id}/similar`.
- Paste your deployed film URL into <https://www.opengraph.xyz> and verify the OG card looks right.
- Read about [`<Link prefetch>`](https://nextjs.org/docs/app/api-reference/components/link#prefetch) and explain to your pair what happens when you hover a film card.
