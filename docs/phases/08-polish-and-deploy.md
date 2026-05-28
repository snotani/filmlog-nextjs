# Phase 8 — Polish & deploy

## Goal

Make the app feel fast, discoverable, and production-ready. Then ship it to Vercel with Postgres and a weekly digest email.

## What you'll build

- Suspense streaming so the film reviews don't block the rest of the page.
- A real `sitemap.xml` and `robots.txt`.
- A Vercel-cron-triggered route that prepares a weekly digest email.
- (Optional) Resend integration to actually send the digest.
- A live deploy at `your-app.vercel.app` with previews on every branch.

## Acceptance criteria

- [ ] Throttle DevTools to "Slow 3G". Open a film page. The page shell + log button render before the reviews list appears (skeleton in between).
- [ ] Visit `/sitemap.xml` and `/robots.txt` — both return valid content.
- [ ] `curl -H "Authorization: Bearer test" http://localhost:3000/api/cron/weekly-digest` returns JSON with `sent`/`skipped` counts (with `CRON_SECRET=test` in `.env.local`).
- [ ] Without the bearer header, the same URL returns 401.
- [ ] The app is deployed to Vercel on a public URL.
- [ ] At least one branch push has created a preview deploy.
- [ ] Pasting a film URL from your deployed site into <https://www.opengraph.xyz> renders the dynamic OG card.

## Task list

1. Refactor `app/film/[id]/page.tsx` to wrap the reviews section in `<Suspense>`. Extract the reviews into `app/film/[id]/film-reviews.tsx` (`<FilmReviews filmId={id} />` + `<FilmReviewsSkeleton />`). Remove the reviews query from the page's `Promise.all`.
2. Create `app/sitemap.ts` that returns a sitemap with the home page, search page, every user profile, every film page, and every public list page. Cap the DB queries at sensible numbers. Wrap in a try/catch fallback so build doesn't break if DB isn't reachable. `export const revalidate = 3600`.
3. Create `app/robots.ts` that disallows `/api/`, `/settings`, `/feed`, `/lists/new` and links to the sitemap.
4. Create `app/api/cron/weekly-digest/route.ts`. Verify `Authorization: Bearer ${CRON_SECRET}`. Query users with entries in the past 7 days. For now, `console.log` the digest contents — leave the Resend snippet as a comment.
5. Create `vercel.json` with a cron schedule `0 9 * * 1` for `/api/cron/weekly-digest`.
6. Add `CRON_SECRET` to `.env.example` and `.env.local`.
7. **Postgres migration**:
   - Sign up at [Neon](https://neon.tech) (free), create a project, copy the connection string.
   - Edit `prisma/schema.prisma`: change `provider = "postgresql"`.
   - Update `DATABASE_URL` in `.env.local`.
   - Run `npx prisma migrate dev --name init` to create the migrations folder. Commit it.
8. **Deploy**:
   - Push to GitHub.
   - At [vercel.com/new](https://vercel.com/new), import the repo.
   - Set env vars in the Vercel dashboard. **Important**: `AUTH_URL` must match your deployed URL exactly.
   - Add `"postinstall": "prisma generate"` to `package.json` if not already there.
   - Set the build command to `prisma migrate deploy && next build`.
   - Deploy.
9. (Optional) Install Resend, wire up actual email sending in the cron route.
10. Test the full flow on production: sign up, log a film, write a review, follow another user, see them in your feed.

## New concepts you'll meet

- `<Suspense>` for in-page streaming (different from `loading.tsx`)
- Async Server Components as Suspense children
- `app/sitemap.ts` and `app/robots.ts` file conventions
- `MetadataRoute.Sitemap` and `MetadataRoute.Robots` types
- Vercel Cron and the `Authorization: Bearer` pattern
- Prisma migrations vs `db push`
- Vercel env vars and preview deploys
- Why `AUTH_URL` matters in production

## Suggested reading

- [Suspense](https://nextjs.org/docs/app/getting-started/linking-and-navigating#streaming) and [Loading UI](https://nextjs.org/docs/app/getting-started/error-handling#handling-loading-ui)
- [`sitemap.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [`robots.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Resend Next.js guide](https://resend.com/docs/send-with-nextjs)
- [Prisma migrations](https://www.prisma.io/docs/orm/prisma-migrate)
- [Deploying Next.js to Vercel](https://nextjs.org/docs/app/getting-started/deploying)

## Stretch goals

- Render the digest email as a React component using `@react-email/components`.
- Enable [Partial Prerendering](https://nextjs.org/docs/app/api-reference/config/next-config-js/ppr): `experimental: { ppr: true }`. Suspense-wrap the user menu in the header so the home page becomes statically prerendered with the personalized chunk streamed in.
- Add a global `app/loading.tsx` for a top-bar progress indicator on navigations.
- Add a status page at `/status` that pings Neon and TMDB.
- Set up Vercel Analytics and Sentry. Pipe `error.tsx`'s `error.digest` to Sentry.
- Hook up a custom domain.
