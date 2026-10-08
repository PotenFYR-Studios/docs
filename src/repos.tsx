/*
 * repos.tsx-/repos catalog with client-side search + category filter
 * (?cat=), and the per-repo docs reader at /repo/<slug>[/…path] with a
 * file-tree sidebar, TOC rail, prev/next, and lazy-loaded content chunk.
 */
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, ChevronRight, FileText, FolderTree,
  ListTree, Search, Star,
} from "lucide-react";
import { GithubMark } from "~/lib/icons";
import { Link, useRouteParts, useRouter, RouterCtx } from "./router";
import { registry, repoBySlug, loadRepoContent, type LoadedPage, type RepoEntry } from "~/data/types";
import { BlurFade, BorderBeam, MagicCard, Meteors, ScrollProgress } from "./magicui";
import { DocBlocks } from "./doc-blocks";
import { cn, confetti } from "~/lib/utils";
import { useAppStore } from "./app-store";

/* ============================ /repos catalog ============================ */

function useQueryParam(name: string): [string | null, (v: string | null) => void] {
  const read = React.useCallback((): string | null => {
    try {
      // URLSearchParams over the hash query (SPA ignores real search on GH Pages)
      const hash = typeof window === "undefined" ? "" : window.location.hash || "";
      const q = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : "";
      return new URLSearchParams(q).get(name);
    } catch { return null; }
  }, [name]);
  const [value, setValue] = React.useState<string | null>(read);
  React.useEffect(() => {
    const on = () => setValue(read());
    if (typeof window !== "undefined") window.addEventListener("hashchange", on);
    return () => { if (typeof window !== "undefined") window.removeEventListener("hashchange", on); };
  }, [read]);
  return [value, setValue];
}

export function ReposIndex(): React.ReactElement {
  const [catParam] = useQueryParam("cat");
  const [cat, setCat] = React.useState<string | null>(catParam);
  const [q, setQ] = React.useState("");
  React.useEffect(() => setCat(catParam), [catParam]);

  const list = registry.repos.filter((r) => {
    if (cat && r.category !== cat) return false;
    if (!q) return true;
    const l = q.toLowerCase();
    return r.slug.includes(l) || r.label.toLowerCase().includes(l) || r.description.toLowerCase().includes(l) || r.topics.some((t) => t.includes(l));
  });

  return (
    <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <Meteors count={8} />
      <BlurFade>
        <h1 className="text-3xl font-extrabold tracking-tight text-rog-ghost sm:text-4xl">
          The <span className="pp-aurora-text">catalog</span>
        </h1>
        <p className="mt-2 text-[14.5px] text-rog-dim">{registry.stats.pages} documentation pages across {registry.repos.length} repos.</p>
      </BlurFade>

      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rog-dim" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter repos…"
            className="w-64 rounded-xl border border-rog-line bg-rog-panel/60 py-2.5 pl-9 pr-3 text-[13.5px] text-rog-ghost outline-none backdrop-blur placeholder:text-rog-dim/70 focus:border-rog-sky/60"
          />
        </div>
        <Chip active={!cat} onClick={() => setCat(null)}>All</Chip>
        {registry.categories.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</Chip>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r, i) => (
          <BlurFade key={r.slug} delay={Math.min(i * 0.04, 0.3)}>
            <MagicCard className="h-full rounded-2xl">
              <Link to={`/repo/${r.slug}`} className="group flex h-full flex-col rounded-2xl border border-rog-line bg-rog-panel/40 p-5 transition-all hover:border-rog-sky/40">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[15px] font-bold text-rog-ghost">{r.label}</span>
                  <span className="flex shrink-0 items-center gap-1 text-[11.5px] text-rog-dim"><Star className="h-3 w-3 text-rog-sky" />{r.stars}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-[13px] text-rog-dim">{r.blurb || r.description}</p>
                <div className="mt-auto pt-4 text-[11.5px] text-rog-dim">{r.pageList.length} page{r.pageList.length === 1 ? "" : "s"} · {r.category}</div>
              </Link>
            </MagicCard>
          </BlurFade>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-rog-line p-14 text-center text-rog-dim">
            Nothing matches “{q}”. <span className="text-rog-sky">Try fewer words.</span>
          </div>
        )}
      </div>
    </main>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
        active ? "border-rog-sky/70 bg-rog-deep text-rog-frost" : "border-rog-line bg-rog-panel/40 text-rog-dim hover:text-rog-frost"
      )}
    >
      {children}
    </button>
  );
}

/* ============================ /repo/<slug> reader ============================ */

type Loader = { page?: LoadedPage; loading: boolean; notFound?: boolean };

export function RepoDoc(): React.ReactElement {
  const parts = useRouteParts(); // ["repo", slug, ...path]
  const slug = parts[1] ?? "";
  const pathTail = parts.slice(2).join("/");
  const repo = repoBySlug(slug);
  const [state, setState] = React.useState<Loader>({ loading: true });

  React.useEffect(() => {
    if (!repo) return;
    let dead = false;
    setState({ loading: true });
    loadRepoContent(slug)
      .then((data) => {
        if (dead) return;
        const target = pathTail ? data.pages.find((p) => p.path.toLowerCase() === pathTail.toLowerCase()) : data.pages.find((p) => p.path === repo.default);
        const page = target ?? data.pages.find((p) => p.path === repo.default) ?? data.pages[0];
        setState({ page, loading: false });
      })
      .catch(() => setState({ loading: false, notFound: true }));
    return () => {
      dead = true;
    };
  }, [slug, pathTail]);

  if (!repo) return <RepoNotFound slug={slug} />;
  return <RepoReader repo={repo} pathTail={pathTail} state={state} />;
}

function RepoReader({ repo, pathTail, state }: { repo: RepoEntry; pathTail: string; state: Loader }) {
  const { navigate } = React.useContext(RouterCtx);
  const scrollRef = React.useRef<HTMLElement | null>(null);
  const page = state.page;
  const meta = registry.repos.find((r) => r.slug === repo.slug);

  React.useEffect(() => {
    const h = window.location.hash;
    if (h.includes("#", 1)) {
      const id = h.slice(h.indexOf("#", 1) + 1);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 240);
    }
  }, [page?.path]);

  const idx = page && repo.pageList.findIndex((p) => p.path === page.path);
  const prev = idx !== undefined && idx > 0 ? repo.pageList[idx - 1] : null;
  const next = idx !== undefined && idx >= 0 && idx < repo.pageList.length - 1 ? repo.pageList[idx + 1] : null;

  return (
    <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <ScrollProgress />
      {/* repo header */}
      <div className="mb-8 border-b border-rog-line/70 pb-6">
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-rog-dim">
          <Bread to="/">docs</Bread>
          <ChevronRight className="h-3 w-3" />
          <Bread to="/repos">repos</Bread>
          <ChevronRight className="h-3 w-3" />
          <span className="text-rog-frost">{repo.label}</span>
          {page && !page.overview && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="max-w-[220px] truncate text-rog-frost">{page.title}</span>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-rog-ghost sm:text-3xl">{repo.label}</h1>
            <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-rog-dim">{repo.blurb || repo.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {repo.topics.slice(0, 5).map((t) => (
                <span key={t} className="rounded-full border border-rog-line bg-rog-panel/50 px-2.5 py-0.5 text-[11px] text-rog-dim">{t}</span>
              ))}
              {meta && (
                <span className="inline-flex items-center gap-1 rounded-full border border-rog-line bg-rog-panel/50 px-2.5 py-0.5 text-[11px] text-rog-dim">
                  <Star className="h-3 w-3 text-rog-sky" /> {meta.stars}
                </span>
              )}
            </div>
          </div>
          <a
            href={repo.repo}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-rog-line bg-rog-panel/70 px-4 py-2.5 text-[13px] font-semibold text-rog-frost/90 transition-colors hover:border-rog-sky/50"
          >
            <GithubMark className="h-4 w-4" /> source
          </a>
        </div>
      </div>

      <div className="flex gap-8 xl:gap-12">
        {/* sidebar */}
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-64 shrink-0 overflow-y-auto pr-1 lg:block">
          <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-rog-dim">
            <FolderTree className="h-3.5 w-3.5" /> documentation
          </div>
          <nav className="space-y-0.5">
            {repo.pageList.map((p) => {
              const active = page?.path === p.path;
              const depth = p.path.includes("/") ? 1 : 0;
              return (
                <Link
                  key={p.path}
                  to={`/repo/${repo.slug}/${p.path === repo.default ? "" : p.path}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors",
                    depth > 0 && "ml-3 text-[12.5px]",
                    active ? "bg-rog-deep font-semibold text-rog-frost" : "text-rog-dim hover:bg-rog-panel/60 hover:text-rog-frost"
                  )}
                >
                  {active && <motion.span layoutId="pp-side-active" className="absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-full bg-rog-sky" />}
                  <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{p.overview ? "Overview" : p.title}</span>
                </Link>
              );
            })}
          </nav>
          {/* mini TOC */}
          {page && page.headings.filter((h) => h.level <= 3).length > 2 && (
            <div className="mt-7 border-t border-rog-line/60 pt-4">
              <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-rog-dim">
                <ListTree className="h-3.5 w-3.5" /> on this page
              </div>
              <nav className="space-y-0.5">
                {page.headings.filter((h) => h.level <= 3).map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={cn("block truncate rounded-lg px-2.5 py-1 text-[12px] text-rog-dim transition-colors hover:text-rog-frost", h.level === 3 && "pl-6")}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>

        {/* content */}
        <article className="min-w-0 flex-1">
          {state.loading && <SkeletonDoc />}
          {state.notFound && <div className="rounded-2xl border border-dashed border-rog-line p-12 text-center text-rog-dim">This page failed to load. <button className="text-rog-sky underline" onClick={() => navigate(`/repo/${repo.slug}`)}>Back to overview</button></div>}
          {page && (
            <motion.div key={page.path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              {!page.overview && (
                <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-rog-ghost">{page.title}</h1>
              )}
              <DocBlocks blocks={page.blocks} />
              {/* prev / next */}
              <div className="mt-14 flex items-stretch justify-between gap-3">
                {prev ? (
                  <DocNavCard dir="prev" label={prev.overview ? "Overview" : prev.title} to={`/repo/${repo.slug}/${prev.path === repo.default ? "" : prev.path}`} />
                ) : <span />}
                {next ? (
                  <DocNavCard dir="next" label={next.overview ? "Overview" : next.title} to={`/repo/${repo.slug}/${next.path === repo.default ? "" : next.path}`} />
                ) : <span />}
              </div>
            </motion.div>
          )}
        </article>
      </div>
    </main>
  );
}

function Bread({ to, children }: { to: string; children: React.ReactNode }) {
  return <Link to={to} className="transition-colors hover:text-rog-frost">{children}</Link>;
}

function DocNavCard({ dir, label, to }: { dir: "prev" | "next"; label: string; to: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "group max-w-[46%] flex-1 rounded-2xl border border-rog-line bg-rog-panel/40 px-4 py-3.5 transition-colors hover:border-rog-sky/40",
        dir === "next" && "text-right"
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-rog-dim" style={{ justifyContent: dir === "next" ? "flex-end" : "flex-start" }}>
        {dir === "prev" ? <ArrowLeft className="h-3 w-3" /> : null}
        {dir}
        {dir === "next" ? <ArrowRight className="h-3 w-3" /> : null}
      </div>
      <div className="mt-1 truncate text-[13.5px] font-semibold text-rog-frost/90 group-hover:text-rog-frost">{label}</div>
    </Link>
  );
}

function SkeletonDoc() {
  return (
    <div className="max-w-3xl animate-pulse space-y-4">
      {[92, 70, 96, 54, 84, 64, 90, 44].map((w, i) => (
        <div key={i} className="h-4 rounded-full bg-rog-panel" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

function RepoNotFound({ slug }: { slug: string }) {
  const { setDeckOpen } = useAppStore();
  return (
    <main className="relative grid min-h-[70vh] place-items-center px-4 pt-24">
      <Meteors count={10} />
      <div className="relative max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-rog-ghost">No docs for “{slug}”</h1>
        <p className="mt-3 text-[14px] text-rog-dim">Wrong slug? Try the catalog, or open the command deck (⌘K) and run <code className="rounded bg-rog-panel px-1.5 py-0.5 font-mono text-[12px] text-rog-sky">ls</code>.</p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link to="/repos" className="rounded-full border border-rog-line bg-rog-panel/70 px-5 py-2.5 text-[13px] font-semibold text-rog-frost/90 hover:border-rog-sky/50">Browse repos</Link>
          <button onClick={() => setDeckOpen(true)} className="rounded-full bg-rog-sky px-5 py-2.5 text-[13px] font-bold text-rog-void hover:bg-rog-glow">Open deck</button>
        </div>
      </div>
    </main>
  );
}

/* mobile docs-nav sheet (bottom bar on small screens) */
export function MobileDocBar({ repo }: { repo: RepoEntry }): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const { path } = useRouter();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mx-3 mb-14 max-h-[50vh] overflow-y-auto rounded-2xl border border-rog-line bg-rog-deep/95 p-3 shadow-2xl backdrop-blur-xl"
          >
            {repo.pageList.map((p) => (
              <Link key={p.path} to={`/repo/${repo.slug}/${p.path === repo.default ? "" : p.path}`} onClick={() => setOpen(false)} className={cn("block rounded-lg px-3 py-2 text-[13px]", path.includes(p.path) ? "bg-rog-panel text-rog-frost" : "text-rog-dim")}>
                {p.overview ? "Overview" : p.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mx-auto mb-4 w-fit">
        <button onClick={() => { setOpen(!open); void confetti(14, 50, 96); }} className="flex items-center gap-2 rounded-full border border-rog-line bg-rog-deep/90 px-5 py-3 text-[12.5px] font-semibold text-rog-frost shadow-xl backdrop-blur">
          <BookOpen className="h-4 w-4 text-rog-sky" /> pages
          <BorderBeam size={40} duration={7} />
        </button>
      </div>
    </div>
  );
}
