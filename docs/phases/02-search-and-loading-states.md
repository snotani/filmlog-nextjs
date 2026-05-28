# Phase 2 — Search & UX states

## Goal

Add film search, build a public JSON API endpoint, and wire in the three sibling-file conventions Next.js uses to handle loading, errors, and 404s automatically.

## What you'll build

- A `/search` page that reads `?q=...` from the URL and shows matching films from TMDB.
- A search box in the site header that submits to `/search` with zero JavaScript.
- A `/api/search` JSON Route Handler that other code (or third-party callers) can hit.
- Loading skeletons that show automatically while a slow page is fetching data.
- Error and not-found pages that take over when something goes wrong.

## Acceptance criteria

- [ ] Typing a query in the header search box and pressing enter navigates to `/search?q=...` and shows results.
- [ ] `/search` works with JavaScript disabled in DevTools (form posts normally).
- [ ] `curl http://localhost:3000/api/search?q=blade` returns JSON with `query` and `results`.
- [ ] Visiting `/film/0` or any nonexistent film ID renders your `not-found.tsx`, not a stack trace.
- [ ] Visiting `/foo` renders your root `not-found.tsx`.
- [ ] Throwing an error inside the film page Server Component (temporarily, to test) renders your `error.tsx` with a working "Try again" button.
- [ ] Throttling your network to "Slow 3G" in DevTools shows skeleton placeholders before the film grid or detail.

## Task list

1. In `lib/tmdb.ts`, add a `searchFilms(query, limit)` function that hits `/search/movie?query=...`. Cache for 10 minutes (`revalidate: 600`). Return an empty array on failure.
2. Create `app/api/search/route.ts` exporting `async function GET(request)`. Read `request.nextUrl.searchParams.get("q")`, call `searchFilms`, and return `NextResponse.json({ query, results })`. Add `export const dynamic = "force-dynamic"`.
3. Create `app/search/page.tsx` as an `async` Server Component. Its prop is `{ searchParams: Promise<{ q?: string }> }`. Await it, call `searchFilms` if `q` is present, and render results.
4. Inside `app/search/page.tsx`, add a plain `<form action="/search">` with a search input and submit button.
5. Add `generateMetadata` to `app/search/page.tsx` that includes the query in the page title.
6. Create `components/film-card-skeleton.tsx` — a pulsing placeholder shaped like a film card.
7. Create `app/search/loading.tsx` rendering a grid of skeletons.
8. Create `app/film/[id]/loading.tsx` matching the film detail layout with skeletons.
9. Create `app/film/[id]/error.tsx` as a Client Component (`"use client"`) with `{ error, reset }` props. Render a friendly message, a "Try again" button calling `reset()`, and a back-to-home link.
10. Create `app/film/[id]/not-found.tsx` for film IDs TMDB doesn't recognize.
11. Create `app/not-found.tsx` as the root 404 page.
12. Update `components/site-header.tsx` to include a `<form action="/search">` search input.
13. Test each of the acceptance criteria above.

## New concepts you'll meet

- Route Handlers (`app/**/route.ts`) with `GET`, `POST`, etc.
- `NextRequest` and `NextResponse`
- `request.nextUrl.searchParams`
- `export const dynamic = "force-dynamic"`
- `searchParams: Promise<...>` in pages
- Plain HTML forms as navigation
- `loading.tsx` and how Next.js wraps it in Suspense
- `error.tsx` (Client Component) with `{ error, reset }`
- `notFound()` from `next/navigation`
- `not-found.tsx` at segment and root levels

## Suggested reading

- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)
- [`loading.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [`error.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [`not-found.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [`notFound()` function](https://nextjs.org/docs/app/api-reference/functions/not-found)

## Stretch goals

- Add `app/search/error.tsx`.
- Convert the header search into a live autocomplete: a Client Component that calls `/api/search` on a debounced keystroke and shows a dropdown of top results. Now the Route Handler has a real reason to exist.
- Add pagination to `/search` using `searchParams.page`.
- Add a global `app/loading.tsx` that shows during *any* page transition.
