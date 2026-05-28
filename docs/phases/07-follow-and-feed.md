# Phase 7 — Follow & feed

## Goal

Follow other members and read a feed of their recent activity. Along the way, get familiar with surgical cache invalidation and cursor pagination.

## What you'll build

- A `Follow` table (self-relation on `User`).
- A follow/unfollow button on profile pages with optimistic state.
- Follower and following counts on every profile.
- A `/feed` page that shows recent entries from people you follow, paginated by cursor.
- Cache tags so toggling follow invalidates only the right things.

## Acceptance criteria

- [ ] Visiting someone else's profile while signed in shows a "Follow" button. Clicking it switches to "Following" instantly.
- [ ] The follower count on that profile updates immediately after toggling.
- [ ] Trying to follow yourself returns an error (server-side check).
- [ ] `/feed` shows recent entries from people you follow, newest first.
- [ ] When there are more than 15 entries, a "Load more" link appears that navigates to `/feed?cursor=...`.
- [ ] Visiting `/feed` while signed out redirects to `/sign-in?from=/feed`.
- [ ] The feed link in the user menu works.

## Task list

1. Add `Follow` to `prisma/schema.prisma`. Self-relation with named `@relation("Follower")` and `@relation("Following")` on both ends. Composite PK `[followerId, followingId]`. Index `[followingId, createdAt]`. Run `npm run db:push` and `npm run db:generate`.
2. Create `lib/follows.ts` with:
   - `isFollowing(followerId, followingId)` — uncached.
   - `getFollowCounts(userId)` — wrap in `unstable_cache` with tag `user-stats:${userId}`.
   - `getFollowingIds(userId)` — wrap in `unstable_cache` with tag `following:${userId}`.
3. Create `lib/feed.ts` with `getFeedPage(userId, cursorISO?)`. Use `prisma.entry.findMany({ where: { userId: { in: followingIds }, createdAt: { lt: cursor } }, take: PAGE_SIZE + 1, orderBy: { createdAt: "desc" } })`. Compute `nextCursor` from the +1 trick.
4. Create `app/u/[username]/follow-actions.ts` with `toggleFollowAction(targetUserId)`. Auth + self-check + toggle. Call `updateTag` (not `revalidateTag`) for `user-stats:${session.user.id}`, `user-stats:${targetUserId}`, and `following:${session.user.id}`. Also `revalidatePath` the target profile and `/feed`.
5. Create `app/u/[username]/follow-button.tsx` (Client). Use `useOptimistic` to toggle the label. Hide the button if `signedIn` is false.
6. Update `app/u/[username]/page.tsx` to fetch `getFollowCounts` + `isFollowing` in parallel, show the counts in the header, and render the follow button (unless it's the owner's own profile).
7. Create `app/feed/page.tsx`. Server Component. Redirect to `/sign-in?from=/feed` if no session. Read `?cursor=...` from `searchParams`, call `getFeedPage`, render the entries + a "Load more" link to `/feed?cursor=${nextCursor}` when there's more.
8. Add a "Feed" link to `components/user-menu.tsx`.

## New concepts you'll meet

- Self-relations in Prisma (`@relation("Name")` on both ends)
- Named relation labels and the follower/following mnemonic
- `unstable_cache(fn, keys, opts)` + cache tags
- Next.js 16's `updateTag(tag)` vs `revalidateTag(tag, profile)`
- Cursor pagination + the `take: N + 1` trick
- `prisma.findMany({ where: { id: { in: [...] } } })` for IN-clause queries

## Suggested reading

- [Prisma self-relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/self-relations)
- [`unstable_cache`](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)
- [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag)
- [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Next.js 16 caching blog post](https://nextjs.org/blog/next-16)
- [Prisma cursor-based pagination](https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination)

## Stretch goals

- Invalidate followers' feed caches when a user logs a new entry.
- Convert the feed to infinite scroll with `IntersectionObserver` calling a Route Handler that returns the next page's JSON.
- Add a "X new entries" banner that appears when newer entries land while you're viewing.
- Add a "remove follower" Server Action symmetric with follow.
- List recent followers on each profile (use the `@@index([followingId, createdAt])` we added).
