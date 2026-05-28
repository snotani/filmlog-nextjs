# Phase 4 — The diary

## Goal

Wire up real database writes: "I watched this" on a film page creates a diary entry, and the user's diary page lists everything they've logged.

## What you'll build

- `Film` and `Entry` Prisma models, with `Film` populated on demand from TMDB the first time someone logs a movie.
- An "I watched this" button on the film detail page that creates an entry for the signed-in user.
- A `/u/[username]/diary` page that lists the user's entries grouped by month.
- Delete-with-optimistic-removal on the owner's own entries.
- A "Recently watched" strip on the public profile.

## Acceptance criteria

- [ ] On a film page while signed in, clicking "I watched this" creates an `Entry` row (verify in `npm run db:studio`) and the button switches to "In your diary".
- [ ] Visiting `/u/yourusername/diary` shows the entry, grouped under the current month.
- [ ] Clicking delete on your own entry removes it from the list **immediately** (optimistic UI) and from the DB.
- [ ] Visiting someone else's `/u/[username]/diary` shows their entries but no delete buttons.
- [ ] The "I watched this" button is replaced by a "Sign in to log" disabled button when signed out.
- [ ] Your public profile shows the latest 8 posters as a "Recently watched" strip linking to the full diary.

## Task list

1. Add `Film` and `Entry` to `prisma/schema.prisma`. `Film.id` is `Int` (it's the TMDB id). `Entry` has `userId`, `filmId`, `watchedOn`, and (already-nullable for Phase 5) `rating` and `reviewMd`. Add an index on `[userId, watchedOn]`. Run `npm run db:push` and `npm run db:generate`.
2. Create `lib/films.ts` with `ensureFilm(id)` — find the film locally; if missing, fetch from TMDB and `upsert`.
3. Create `lib/diary.ts` with `getUserDiary(userId)` and `getEntryForFilm(userId, filmId)`. Use Prisma's `select` to only pull the fields you need.
4. **Server/client boundary work**: create `lib/tmdb-images.ts` with `posterUrl`, `backdropUrl`, `profileUrl`. Move these out of `lib/tmdb.ts` (which has `import "server-only"`). Update Client Components (`components/film-poster.tsx`) to import from `lib/tmdb-images` instead.
5. Create `app/film/[id]/actions.ts` with `"use server"` and two Server Actions: `logFilmAction(filmId)` and `deleteEntryAction(entryId)`. Both must check the session and (for delete) ownership. Both must call `revalidatePath` so the diary refreshes.
6. Create `app/film/[id]/log-button.tsx` as a Client Component that renders one of three states (signed-out / not-logged / already-logged) and uses `useTransition` for pending state.
7. Update `app/film/[id]/page.tsx` to fetch `getEntryForFilm` in parallel with the TMDB calls and pass `initialLogged` + `signedIn` into the log button.
8. Create `app/u/[username]/diary/page.tsx`. Server Component. Fetch the user (404 if missing), fetch their entries, decide whether the viewer is the owner, hand off to a client list.
9. Create `app/u/[username]/diary/diary-list.tsx` as a Client Component. Use `useOptimistic` to remove entries instantly when delete is clicked, then call the action. Group entries by month.
10. Update `app/u/[username]/page.tsx` to fetch the latest 8 entries and render a poster strip with a "See all" link to the diary.

## New concepts you'll meet

- Server Actions for database writes (with the auth check pattern)
- `revalidatePath` after a mutation
- Owner checks on mutations
- `useOptimistic` from React
- `useTransition` for pending state on button clicks
- The architectural pattern of "cache external data into our DB lazily"
- Splitting server-only modules from helpers safe for Client Components
- `prisma.upsert`, tight `prisma.select`

## Suggested reading

- [Server Actions](https://nextjs.org/docs/app/getting-started/updating-data)
- [`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [`useOptimistic`](https://react.dev/reference/react/useOptimistic)
- [`useTransition`](https://react.dev/reference/react/useTransition)
- [Prisma `upsert`](https://www.prisma.io/docs/orm/reference/prisma-client-reference#upsert)

## Stretch goals

- Replace `alert(...)` with [sonner](https://sonner.emilkowal.ski) toast notifications.
- Add an "Edit" button on each entry to change the `watchedOn` date.
- Support logging the same film multiple times (e.g. rewatches).
- Add a "Log again" button on the film page even when an entry already exists.
- Confirm-before-delete with a small modal.
