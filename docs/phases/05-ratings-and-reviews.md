# Phase 5 — Ratings & reviews

## Goal

Let members rate films 1–10 and write a short review. Show all reviews on the film page, and the user's rating on each diary entry.

## What you'll build

- A reusable star rating component (5 stars on a 1–10 scale).
- A "review" form on the film page that appears once you've logged the film. It edits the existing entry's rating and review text.
- A reviews section on the film page listing everyone's reviews.
- The rating shown next to each entry on the diary page.

## Acceptance criteria

- [ ] Log a film, then click the stars under "Your rating". The star fills on hover and click.
- [ ] Save the form. Refresh the page. The rating and review text are still there.
- [ ] The reviews section at the bottom of the film page shows your review with your rating, username, and link to your profile.
- [ ] Try to save a 5001-character review. The server rejects it with a Zod error rendered above the submit button.
- [ ] Your rating shows next to the entry on `/u/yourusername/diary`.
- [ ] Open another browser and view the film as a different user. Their review form is empty; the reviews list shows your saved review.

## Task list

1. Create `components/star-rating.tsx`. It's a Client Component. Props: `value: number | null`, `onChange?: (v: number) => void`, `readOnly?: boolean`, `size?`, `name?` (for the hidden form input). Use Lucide's `<Star>` icon. 5 stars total, each step is 2 points.
2. In `app/film/[id]/actions.ts`, add `updateEntryAction(state, formData)`. Define a Zod schema for `{ entryId, rating, reviewMd }`. Auth-check + owner-check. Update via Prisma. Call `revalidatePath` for the film page and the user's diary.
3. Create `app/film/[id]/review-form.tsx`. Client Component. Use `useActionState` with the new action. Compose the `<StarRating>` with `useState` for the rating value. Include a `<textarea name="reviewMd">`. Hidden inputs for `entryId` and `rating`. Show pending state and success/error messages.
4. In `lib/diary.ts`, add `getFilmReviews(filmId, { page, perPage })`. Return `{ reviews, total, page, perPage }`.
5. Update `app/film/[id]/page.tsx`:
   - Fetch `getFilmReviews` in parallel with the existing TMDB calls.
   - If `existingEntry` is truthy, render `<ReviewForm entry={existingEntry} />` below the log button.
   - Render a "N reviews" section above the cast list. Each review shows the author (linked to their profile), their rating, the review text, and the watched date.
6. Update `app/u/[username]/diary/diary-list.tsx` to show the rating next to each entry using the `<StarRating>` in `readOnly` mode.

## New concepts you'll meet

- Naming the client/server boundary as a design surface
- Hidden inputs to bridge JS-driven UI into a `<form>`
- `useActionState` with a Zod-validated Server Action
- `z.coerce.number()` and nullable schemas for form data
- "Defense in depth": browser-level `maxLength` + server-level `.max()`
- Pagination shape (`{ items, total, page, perPage }`)

## Suggested reading

- [Composing Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#composition-patterns-for-server-and-client-components)
- [`useActionState`](https://react.dev/reference/react/useActionState)
- [Zod: parsing form data](https://zod.dev/?id=preprocess)
- [Forms in the App Router](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms)

## Stretch goals

- Render reviews as markdown: `npm install react-markdown` and swap the `<p>` for `<ReactMarkdown>`. Add `rehype-sanitize` to scrub any embedded HTML.
- Paginate the reviews list using `searchParams.page`.
- Add a "delete review" button that sets `reviewMd` to null (entry stays).
- Add an average rating + a tiny distribution histogram to the film page header.
- Server-side rate-limit updates (5 per minute per user) using a simple in-memory `Map`. Note where you'd swap in Upstash / Redis for production.
