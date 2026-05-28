# Phase 3 — Auth & profiles

## Goal

Add real user accounts. Sign up, sign in, sign out, a settings page, and a public profile at `/u/[username]`.

## What you'll build

- Email + password sign-in via Auth.js v5 (with optional Google OAuth).
- A `User` table in your database (plus the Auth.js standard tables).
- Middleware that redirects unauthed users away from `/settings` and `/feed`.
- A route group `(auth)` that shares a layout between `/sign-in` and `/sign-up`.
- A public profile at `/u/[username]` anyone can visit.
- A settings page where signed-in users can edit their display name, bio, and avatar.
- A user menu in the header that swaps in once you sign in.

## Acceptance criteria

- [ ] Visiting `/sign-up` lets you create an account. The new user appears in `npm run db:studio`.
- [ ] Right after sign-up, you're redirected to `/` and the header shows your username.
- [ ] Signing out from the header menu returns you to `/` with the "Sign in / Sign up" buttons.
- [ ] Visiting `/settings` while signed out redirects you to `/sign-in?from=/settings`. After signing in, you land back on `/settings`.
- [ ] You can update your display name and bio. The change shows up on `/u/yourusername` after save.
- [ ] Visiting `/u/some-bogus-name` shows the not-found page.
- [ ] `npm run build` passes.

## Task list

1. Install dependencies: `next-auth@beta`, `@auth/prisma-adapter`, `bcryptjs`. Add `@types/bcryptjs` as a dev dep.
2. Add `User`, `Account`, `Session`, `VerificationToken` models to `prisma/schema.prisma`. `User` needs `username @unique`, `email @unique`, `passwordHash` (nullable), and a `bio`. Run `npm run db:push` and `npm run db:generate`.
3. Generate an `AUTH_SECRET` (`npx auth secret`) and put it in `.env.local`. Restart the dev server.
4. Create `auth.ts` at the project root exporting `{ handlers, auth, signIn, signOut }` from `NextAuth({...})`. Configure:
   - Prisma adapter
   - JWT session strategy
   - Credentials provider with `authorize` that does a bcrypt compare
   - JWT + session callbacks that thread `id` and `username` through
   - Module augmentation extending `Session.user`
5. Create `app/api/auth/[...nextauth]/route.ts` re-exporting `handlers.GET` and `handlers.POST`.
6. Create `middleware.ts` that imports `auth` from `@/auth` and redirects unauthed users away from `/settings` and `/feed`. Set the `matcher` to exclude `api/auth`, `_next/*`, and static files.
7. Create the route group: `app/(auth)/layout.tsx`, `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`. Each form is a Client Component that uses `useActionState`.
8. Create `app/(auth)/actions.ts` with three Server Actions: `signInAction`, `signUpAction`, `signOutAction`. Use Zod for validation.
9. Create `lib/users.ts` with `getUserByUsername(username)`.
10. Create `app/u/[username]/page.tsx`. Server Component. Calls `notFound()` for unknown usernames. Includes `generateMetadata`.
11. Create `app/settings/page.tsx` and `app/settings/settings-form.tsx`. Page fetches the user with `auth()`. Form is a Client Component.
12. Create `app/settings/actions.ts` with `updateProfileAction`. Validate with Zod, update via Prisma, and call `revalidatePath` on the profile and settings.
13. Create `components/user-menu.tsx` with the avatar, settings link, and sign-out form. Update `components/site-header.tsx` to be `async`, call `auth()`, and conditionally render the user menu or the sign-in/up buttons.

## New concepts you'll meet

- Auth.js v5 setup
- JWT vs database sessions
- Prisma adapter for Auth.js
- `middleware.ts` and the `matcher` config
- Route groups `(parens)`
- `auth()`, `signIn()`, `signOut()` (server-only helpers)
- Server Actions (`"use server"`) — first taste
- `useActionState` (client side of a Server Action)
- TypeScript module augmentation
- `redirect()` and `notFound()` in pages

## Suggested reading

- [Auth.js getting started (Next.js)](https://authjs.dev/getting-started)
- [Auth.js Prisma adapter](https://authjs.dev/getting-started/adapters/prisma)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Server Actions](https://nextjs.org/docs/app/getting-started/updating-data)
- [`useActionState`](https://react.dev/reference/react/useActionState)

## Stretch goals

- Add the Google provider. Two-line change in `auth.ts` after creating an OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- Add a "delete account" button to settings (Server Action that calls `prisma.user.delete`).
- Make the username editable, with uniqueness validation.
- Add a "members" page at `/members` that lists recently signed-up users (use `getRecentMembers` from `lib/users.ts`).
- Read about [Auth.js callbacks](https://authjs.dev/reference/nextjs#callbacks). What could `signIn` callback be used for?
