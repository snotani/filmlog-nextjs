# Filmlog requirements

The full product brief. Read this once at the start so you know where you're heading, then refer back as you build each phase.

## What we're building

Filmlog is a "Letterboxd-lite" — a movie diary you can use to:

- Browse trending and popular films
- Log films you've watched, with a date, rating, and review
- Build watchlists and custom themed lists
- See public profiles for other members
- Follow other members and read a feed of their reviews

Think Letterboxd at 1/100th the scope. We'll build it across nine phases (Phase 0 is setup; Phases 1–8 each ship a real feature).

## Personas

- **Visitor** — anyone landing on the site. Can browse films, search, view public profiles and public lists, and read reviews. Cannot log films, rate, review, or follow.
- **Member** — a signed-in user. Can do everything a visitor can, plus log films, rate, review, build lists, follow other members, and edit their profile.

## Feature inventory

### Public site (Phases 1–2)

- Home page — trending films from the past week, plus recently published reviews
- Film detail page — poster, backdrop, title, year, runtime, overview, cast, rating distribution, list of reviews
- Search — query box that returns matching films
- Member directory — list of recently active members

### Identity (Phase 3)

- Sign up with email + password
- Sign in (email + password, or Google OAuth)
- Sign out
- Settings page to edit your display name, bio, and avatar
- Public profile at `/u/[username]` showing recent activity

### Diary, ratings, reviews (Phases 4–5)

- "I watched this" button on a film page that creates a diary entry
- Diary page at `/u/[username]/diary` grouped by month
- 1–10 star rating on each diary entry
- Optional markdown review
- Edit and delete your own entries

### Lists (Phase 6)

- One-click "Add to watchlist" on a film page
- Watchlist visible on your profile
- Custom themed lists — e.g. "Best A24 movies", "Films I cried at"
- Public list page at `/u/[username]/list/[slug]` with a poster collage
- Dynamic Open Graph image generated per list

### Social (Phase 7)

- Follow / unfollow members
- Feed at `/feed` showing recent reviews from people you follow
- Light notifications (e.g. "X followed you", "Y liked your review")

### Polish (Phase 8)

- Suspense streaming on slow data
- `sitemap.xml`, `robots.txt`, default Open Graph image
- Weekly digest email via Resend, triggered by Vercel Cron
- Migration from SQLite to Postgres
- Deployed to Vercel with preview deploys on every push

## Route map

| Path | Renders | Auth | Phase |
| --- | --- | --- | --- |
| `/` | Home (trending + recent reviews) | public | 1 |
| `/film/[id]` | Film detail page | public | 1 |
| `/search?q=...` | Search results | public | 2 |
| `/sign-in` | Sign-in form | public | 3 |
| `/sign-up` | Sign-up form | public | 3 |
| `/settings` | Edit your profile | member | 3 |
| `/u/[username]` | Public profile | public | 3 |
| `/u/[username]/diary` | Diary entries | public | 4 |
| `/u/[username]/list/[slug]` | Public list | public | 6 |
| `/feed` | Activity feed of people you follow | member | 7 |
| `/api/search` | Search Route Handler (proxies TMDB) | public | 2 |
| `/api/og/film/[id]` | Dynamic Open Graph image for a film | public | 5 |
| `/api/og/list/[id]` | Dynamic Open Graph image for a list | public | 6 |
| `/api/cron/weekly-digest` | Weekly email cron endpoint | cron | 8 |

`middleware.ts` gates `/settings`, `/feed`, and all mutation Server Actions; redirects unauthenticated visitors to `/sign-in?from=<path>`.

## Data model (Prisma)

These models land progressively across the phases. The final shape:

```prisma
model User {
  id        String    @id @default(cuid())
  username  String    @unique
  email     String    @unique
  name      String?
  image     String?
  bio       String?
  createdAt DateTime  @default(now())

  accounts  Account[]
  sessions  Session[]

  entries     Entry[]
  watchlist   Watchlist[]
  lists       List[]

  following  Follow[] @relation("Follower")
  followers  Follow[] @relation("Following")
}

// Auth.js tables (Account, Session, VerificationToken) — Phase 3
// see https://authjs.dev/getting-started/adapters/prisma

model Film {
  id        Int       @id            // TMDB id
  title     String
  year      Int?
  poster    String?                  // TMDB poster path
  backdrop  String?
  overview  String?
  runtime   Int?
  createdAt DateTime  @default(now())

  entries     Entry[]
  watchlists  Watchlist[]
  listItems   ListItem[]
}

model Entry {
  id         String    @id @default(cuid())
  userId     String
  filmId     Int
  watchedOn  DateTime  @default(now())
  rating     Int?                    // 1..10
  reviewMd   String?
  createdAt  DateTime  @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  film  Film  @relation(fields: [filmId], references: [id], onDelete: Cascade)

  @@index([userId, watchedOn])
}

model Watchlist {
  userId    String
  filmId    Int
  addedAt   DateTime  @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  film  Film  @relation(fields: [filmId], references: [id], onDelete: Cascade)

  @@id([userId, filmId])
}

model List {
  id          String     @id @default(cuid())
  userId      String
  slug        String
  title       String
  description String?
  isPublic    Boolean    @default(true)
  createdAt   DateTime   @default(now())

  user   User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items  ListItem[]

  @@unique([userId, slug])
}

model ListItem {
  listId  String
  filmId  Int
  order   Int

  list  List  @relation(fields: [listId], references: [id], onDelete: Cascade)
  film  Film  @relation(fields: [filmId], references: [id], onDelete: Cascade)

  @@id([listId, filmId])
  @@index([listId, order])
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime  @default(now())

  follower   User  @relation("Follower", fields: [followerId], references: [id], onDelete: Cascade)
  following  User  @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
}
```

## Definition of done

The project is "done" when:

- All nine phases pass their per-phase acceptance criteria.
- `npm run build` and `npm run lint` are both green.
- The app is deployed to Vercel on a public URL.
- A new visitor can sign up, log a film, write a review, follow another user, and see that user's activity in their feed.
- The Open Graph card renders for a film page and a list page when pasted into Discord / Twitter / iMessage.
- The Vercel cron job has fired at least once successfully and sent a weekly digest email.
