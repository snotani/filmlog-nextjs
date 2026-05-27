import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          filmlog &middot; a teaching project for learning{" "}
          <Link
            href="https://nextjs.org"
            className="underline decoration-dotted underline-offset-4 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            Next.js
          </Link>
        </p>
        <p>
          film data from{" "}
          <Link
            href="https://www.themoviedb.org"
            className="underline decoration-dotted underline-offset-4 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </Link>
        </p>
      </div>
    </footer>
  );
}
