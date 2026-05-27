import { ArrowRight, Film, Heart, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Film,
    title: "Track every film",
    body: "Log films you've watched, when you watched them, and what you thought.",
  },
  {
    icon: Heart,
    title: "Rate and review",
    body: "Give every film a score out of ten and write notes for your future self.",
  },
  {
    icon: Users,
    title: "Follow other film lovers",
    body: "See what your friends are watching and discover what to queue up next.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 sm:py-24">
      <section className="flex flex-col items-start gap-6">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Phase 0 &middot; the boilerplate
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          A movie diary you&apos;ll build, one Next.js concept at a time.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Filmlog is a Letterboxd-style watching log we&apos;ll grow phase by
          phase. This is the empty shell &mdash; every page, route, and
          database model is something you&apos;ll add as you learn.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button render={<Link href="/search" />}>
            Start exploring
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="ghost" render={<Link href="https://nextjs.org/docs" target="_blank" rel="noreferrer" />}>
            Next.js docs
          </Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 p-5"
          >
            <feature.icon className="size-5 text-primary" aria-hidden />
            <h2 className="text-base font-medium text-foreground">
              {feature.title}
            </h2>
            <p className="text-sm text-muted-foreground">{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-dashed border-border/60 bg-card/20 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">What ships in Phase 1</p>
        <p className="mt-1">
          Replace this placeholder with a live grid of trending films pulled
          from TMDB inside an <code className="font-mono">async</code> Server
          Component. See <code className="font-mono">docs/phases/01-browsing-films.md</code>.
        </p>
      </section>
    </div>
  );
}
