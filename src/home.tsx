/*
 * home.tsx — docs.potenfyr.in landing: hero (Meteors + OrbitingCircles +
 * AuroraText + TypingAnimation), org stats with NumberTicker, category
 * bento, full repo grid with MagicCard + BorderBeam, marquee footer.
 */
import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Boxes, Flame, Gamepad2, ShieldCheck, Sparkles,
  Star, TerminalSquare, Languages, Database, MessagesSquare, Globe2, Wrench,
} from "lucide-react";
import { GithubMark } from "~/lib/icons";
import { Link } from "./router";
import { registry } from "~/data/types";
import { AuroraText, BlurFade, BorderBeam, FlickeringGrid, MagicCard, Marquee, Meteors, NumberTicker, OrbitingCircles, ParticlesLite, RetroGrid, ShimmerButton, TypingAnimation, AnimatedShinyText, ScrollProgress } from "./magicui";
import { RogLogo } from "./rog-logo";
import { cn, confetti } from "~/lib/utils";
import { useAppStore } from "./app-store";

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  "Minecraft Tooling": Gamepad2,
  "Hosting Eggs": Boxes,
  "Security & APIs": ShieldCheck,
  "Discord & Web": MessagesSquare,
};

export function Home(): React.ReactElement {
  const repos = registry.repos;
  const totalStars = repos.reduce((a, r) => a + (r.stars ?? 0), 0);
  return (
    <main className="relative">
      <ScrollProgress />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-36">
        <FlickeringGrid opacity={0.85} />
        <Meteors count={16} />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-rog-void via-transparent to-transparent" aria-hidden />
        <ParticlesLite count={26} />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* orbiting repo avatars around the logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="relative mx-auto mb-9 h-44 w-44 sm:h-56 sm:w-56"
          >
            <div className="pp-glow-ring absolute inset-6 rounded-full" aria-hidden />
            <div className="absolute inset-10 grid place-items-center rounded-full bg-gradient-to-br from-rog-sky/[0.14] to-transparent">
              <RogLogo size={86} glow />
            </div>
            <OrbitingCircles radius={86} duration={26} count={6}>
              {(i) => {
                const icons = [ShieldCheck, Gamepad2, Boxes, MessagesSquare, GithubMark, TerminalSquare];
                const I = icons[i % icons.length]!;
                return (
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-rog-line bg-rog-panel/90 text-rog-sky shadow-lg">
                    {React.createElement(I, { className: "h-4 w-4" })}
                  </span>
                );
              }}
            </OrbitingCircles>
            <OrbitingCircles radius={122} duration={38} reverse count={6}>
              {(i) => {
                const icons = [BookOpen, Flame, Languages, Database, Globe2, Sparkles];
                const I = icons[i % icons.length]!;
                return (
                  <span className="grid h-7 w-7 place-items-center rounded-lg border border-rog-line/70 bg-rog-void/90 text-rog-frost/90">
                    {React.createElement(I, { className: "h-3.5 w-3.5" })}
                  </span>
                );
              }}
            </OrbitingCircles>
          </motion.div>

          <BlurFade className="text-center" delay={0.1}>
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-rog-line bg-rog-panel/60 px-3.5 py-1.5 text-[12.5px] text-rog-dim backdrop-blur">
              <AnimatedShinyText>unified documentation · {registry.stats.repos} public repos</AnimatedShinyText>
            </div>
          </BlurFade>

          <BlurFade delay={0.18} className="text-center">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl">
              Every repo.
              <br />
              <AuroraText>One docs engine.</AuroraText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-rog-dim sm:text-lg">
            <p>
              Documentation for PotenFYR Studios — hosting eggs, AuthCore & Statfyr, FYRwall,
              Vigil, OrbyNode and the rest of the fleet, renovated into one dark, sky-blue experience.
            </p>
          </BlurFade>

          <BlurFade delay={0.42} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ShimmerButton onClick={() => confetti(60, 50, 18)}>
              <BookOpen className="h-4 w-4" /> Dig into the docs
            </ShimmerButton>
            <a
              href="https://github.com/PotenFYR-Studios"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-rog-line bg-rog-panel/70 px-6 py-3 text-sm font-semibold text-rog-frost/90 transition-all hover:border-rog-sky/60 hover:shadow-[0_0_18px_rgba(79,163,236,0.2)]"
            >
              <GithubMark className="h-4 w-4" /> GitHub org
            </a>
          </BlurFade>

          <BlurFade delay={0.5} className="mt-8 text-center font-mono text-[13px] text-rog-dim">
            <TypingAnimation text="docs.potenfyr.in — every page, one place, zero clutter." />
          </BlurFade>

          {/* stats strip */}
          <BlurFade delay={0.56} className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "repos", value: registry.stats.repos, icon: Boxes },
              { label: "doc pages", value: registry.stats.pages, icon: BookOpen },
              { label: "stars", value: totalStars, icon: Star },
              { label: "categories", value: 4, icon: Flame },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-rog-line bg-rog-panel/50 px-4 py-5 text-center backdrop-blur">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-rog-ghost">
                  <NumberTicker value={s.value} />
                </div>
                <div className="mt-1 text-[11.5px] font-medium uppercase tracking-wider text-rog-dim">{s.label}</div>
              </div>
            ))}
          </BlurFade>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="relative border-y border-rog-line/60 bg-rog-panel/25 py-4">
        <Marquee duration={52}>
          {repos.map((r) => (
            <span key={r.slug} className="mx-4 inline-flex items-center gap-2 text-[13px] font-medium text-rog-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-rog-sky" />
              {r.label}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ============ CATEGORY BENTO ============ */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <BlurFade>
          <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-rog-ghost sm:text-3xl">Pick a lane</h2>
          <p className="mb-9 text-[14.5px] text-rog-dim">{`Four categories… each one a door.`}</p>
        </BlurFade>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {registry.categories.map((cat, i) => {
            const Icon = CATEGORY_ICON[cat] ?? Wrench;
            const list = repos.filter((r) => r.category === cat);
            return (
              <BlurFade key={cat} delay={i * 0.08}>
                <MagicCard className="h-full rounded-2xl">
                  <Link
                    to={`/repos?cat=${encodeURIComponent(cat)}`}
                    className="block h-full rounded-2xl border border-rog-line bg-rog-deep/60 p-5 transition-colors hover:border-rog-sky/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-rog-line bg-rog-panel text-rog-sky">
                        {React.createElement(Icon, { className: "h-5 w-5" })}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-rog-dim">{list.length} repos</span>
                    </div>
                    <div className="mt-4 text-[15.5px] font-bold text-rog-ghost">{cat}</div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-rog-dim">{registry.categoryPitch[cat]}</p>
                  </Link>
                </MagicCard>
              </BlurFade>
            );
          })}
        </div>
      </section>

      {/* ============ FULL REPO GRID ============ */}
      <section id="repos" className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <RetroGrid className="-scale-y-50 opacity-40" />
        <BlurFade>
          <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-rog-ghost sm:text-3xl">Every repo, every page</h2>
          <p className="mb-9 text-[14.5px] text-rog-dim">Straight into each repo's docs — the overview page first.</p>
        </BlurFade>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <BlurFade key={r.slug} delay={(i % 3) * 0.07}>
              <MagicCard className="h-full rounded-2xl" glowColor="#4fa3ec">
                <Link
                  to={`/repo/${r.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-rog-line bg-rog-panel/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-rog-sky/40 hover:shadow-[0_10px_40px_-12px_rgba(79,163,236,0.28)]"
                >
                  <BorderBeam size={70} duration={9 + (i % 5) * 2} delay={(i % 4) * 1.3} />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[15.5px] font-bold text-rog-ghost group-hover:text-rog-frost">{r.label}</div>
                      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-rog-sky/80">{r.category}</div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full border border-rog-line px-2 py-0.5 text-[11.5px] text-rog-dim">
                      <Star className="h-3 w-3 text-rog-sky" /> {r.stars}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-rog-dim">{r.blurb || r.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 text-[11.5px] text-rog-dim">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-rog-sky/80" />
                      {r.pageList.length} page{r.pageList.length === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-rog-frost/80 transition-transform group-hover:translate-x-1">
                      read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section className="relative overflow-hidden border-t border-rog-line/60 py-20">
        <FlickeringGrid opacity={0.35} />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <BlurFade>
            <div className="pp-aurora-border mx-auto mb-8 max-w-xl rounded-2xl border border-rog-line bg-rog-deep/70 p-8 backdrop-blur">
              <RogLogo size={54} glow />
              <h3 className="mt-5 text-xl font-bold text-rog-ghost">Hidden things are in here.</h3>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-rog-dim">
                This hub has a few easter eggs. Konami lovers will feel at home; so will anyone
                who pokes the logo more than a few times.
              </p>
            </div>
          </BlurFade>
          <BlurFade delay={0.12}>
            <div className={cn("flex flex-wrap items-center justify-center gap-3")}>
              <ShimmerButton onClick={() => confetti(120, 50, 20)}>
                <Sparkles className="h-4 w-4" /> Try your luck
              </ShimmerButton>
              <Link to="/repos" className="text-[13.5px] font-semibold text-rog-frost/90 underline-offset-4 hover:underline">
                or just browse →
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}

