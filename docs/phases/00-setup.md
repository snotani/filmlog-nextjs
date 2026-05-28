# Phase 0 — Setup

## Goal

Get Filmlog running on your machine and get oriented in the codebase.

## What you'll build

Nothing new. This phase is about cloning the project, wiring up your environment, and giving you a guided tour of what's already here so the rest of the phases have somewhere to land.

## Acceptance criteria

- [ ] You can run `npm run dev` and see the Filmlog landing page at `http://localhost:3000` without console errors.
- [ ] You have a `.env.local` file (not committed) with placeholder values for every variable in `.env.example`.
- [ ] `npm run lint` and `npm run build` both pass.
- [ ] You can describe in your own words what's inside `app/`, `components/`, `lib/`, and `prisma/`.

## Task list

1. Clone the repo and `cd` into it.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`. Leave the TMDB key empty for now — you'll need one in Phase 1.
4. Run `npm run db:generate` to generate the Prisma client.
5. Run `npm run dev` and open `http://localhost:3000`.
6. Open the project in your editor and tour the file tree. Find:
   - The file that defines what `/` renders.
   - The file that wraps every page with the header and footer.
   - The file where Tailwind theme tokens are defined.
   - The file where the Prisma schema lives.
7. Add a new route at `/about` that shows a paragraph about Filmlog. Hint: you only need a folder and a file.
8. Run `npm run lint` and `npm run build` and confirm both pass.

## New concepts you'll meet

- App Router file conventions (`page.tsx`, `layout.tsx`)
- Server Components (the default)
- Environment variables and `.env.local`
- Tailwind v4 + shadcn/ui theme tokens
- Prisma schema and the generated client

## Suggested reading

- [Project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Prisma getting started](https://www.prisma.io/docs/getting-started/quickstart)

## Stretch goals

- In `app/page.tsx`, add `console.log("Hello from the server")`. Reload the page in your browser. Where does the log appear, and why?
- Read `components/site-header.tsx`. The `Button render={<Link />}` pattern looks odd. Try to explain to your pair why we use it instead of `<Link><Button>...</Button></Link>`.
