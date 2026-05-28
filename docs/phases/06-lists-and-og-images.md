# Phase 6 — Lists & OG images

## Goal

Let members save films to a watchlist and curate themed lists. Generate dynamic Open Graph images so film pages and list pages look great when shared.

## What you'll build

- "Add to watchlist" button on every film page (optimistic toggle).
- A watchlist preview on each profile.
- "Create a list" page that takes a title, description, and a bunch of TMDB film IDs.
- `/u/[username]/lists` showing all of someone's public lists.
- `/u/[username]/list/[slug]` showing a single list with poster grid.
- A dynamic OG image for film pages and list pages, generated with `next/og`.

## Acceptance criteria

- [ ] On a film page while signed in, clicking the bookmark adds it to your watchlist instantly. Refresh — still there.
- [ ] Clicking it again removes it. Your profile's "Watchlist" strip updates next time you visit.
- [ ] `/lists/new` is gated by middleware — signed-out visitors are redirected to `/sign-in?from=/lists/new`.
- [ ] Submitting the create-list form takes you to `/u/yourusername/list/your-slug`. Subsequent lists with the same title get `-2`, `-3` slugs.
- [ ] Visiting `/api/og/film/[some-id]` in the browser returns a 1200×630 PNG with backdrop + poster + title.
- [ ] Visiting `/api/og/list/[your-list-id]` returns a PNG with a 2×2 poster mosaic + list title.
- [ ] Pasting a deployed film URL into <https://www.opengraph.xyz> shows the dynamic image (works after Phase 8 deploy).

## Task list

1. Add `Watchlist`, `List`, and `ListItem` to `prisma/schema.prisma`. Composite primary keys, `@@unique([userId, slug])` on `List`. Run `npm run db:push` and `npm run db:generate`.
2. Create `lib/watchlist.ts` with `isOnWatchlist(userId, filmId)` and `getUserWatchlist(userId)`.
3. Create `lib/lists.ts` with `getUserLists(userId)`, `getListBySlug(username, slug)`, `getListById(id)`, and a `slugify(title)` helper.
4. Create `app/film/[id]/watchlist-actions.ts` with `toggleWatchlistAction(filmId)`. Add a check for missing session, find-or-delete-or-create, revalidate the film page and the user's profile.
5. Create `app/film/[id]/watchlist-button.tsx` as a Client Component. Use `useOptimistic` to toggle the saved state instantly.
6. Update `app/film/[id]/page.tsx` to fetch `isOnWatchlist` in parallel and render both the log button and the watchlist button.
7. Add `/lists/new` to `PROTECTED_PATHS` in `middleware.ts`.
8. Create `app/lists/actions.ts` with `createListAction`. Validate with Zod, generate a unique slug (looping with `-2`, `-3`, …), `ensureFilm` each id, create the list + items, then `redirect(...)`.
9. Create `app/lists/new/page.tsx` (Server Component) and `app/lists/new/create-list-form.tsx` (Client). Form accepts title, description, and a textarea of TMDB film IDs (comma- or whitespace-separated).
10. Create `app/u/[username]/lists/page.tsx` — a grid of public lists, each with a 4-poster preview.
11. Create `app/u/[username]/list/[slug]/page.tsx` — full list page with poster grid. Include `generateMetadata` with `openGraph.images` pointing at `/api/og/list/[id]`.
12. Create `app/api/og/film/[id]/route.tsx` using `ImageResponse` from `next/og`. Include backdrop (with overlay), poster, title, year. Use inline `style` props only.
13. Create `app/api/og/list/[id]/route.tsx` rendering a 2×2 poster mosaic + title + author.
14. Update `app/film/[id]/page.tsx` `generateMetadata` to point at `/api/og/film/[id]` instead of the raw TMDB poster.
15. Update `app/u/[username]/page.tsx` to show the watchlist preview and a list preview alongside the recent watched strip.

## New concepts you'll meet

- Many-to-many in Prisma with explicit join tables
- Composite primary keys (`@@id`) and the `userId_filmId` query shape
- Unique constraints per scope (`@@unique([userId, slug])`)
- `prisma.select` for narrow result types + the `Awaited<ReturnType<...>>` pattern
- `useOptimistic` with a boolean (not a list)
- `next/og` and the `ImageResponse` API
- The `inline style only` constraint of Satori
- Edge vs Node runtime, and when to pick which
- Dynamic OG images linked via `generateMetadata`

## Suggested reading

- [Prisma relations: many-to-many](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations)
- [`next/og` ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Satori (the engine inside next/og)](https://github.com/vercel/satori)
- [Edge runtime](https://nextjs.org/docs/app/api-reference/edge)
- [Open Graph protocol](https://ogp.me/)
- [opengraph.xyz preview tool](https://www.opengraph.xyz/)

## Stretch goals

- Add a "remove from list" button on the list page (renumber `order` afterwards).
- Drag-and-drop reordering with [@dnd-kit/sortable](https://docs.dndkit.com/).
- Edit a list (title, description, isPublic) via a Server Action.
- Pass a custom Google Font to `ImageResponse` so the OG images look like the site.
- Add a "popular lists" section to the home page.
- Generate per-user OG images (`/api/og/u/[username]`) for profile shares.
