/*
 * deck.tsx-the PotenFYR command deck (⌘K terminal-style overlay).
 * Commands: help, ls [repo], all, open <slug>, goto <repo/page>, search <q>,
 * stars, eggs, konami, clear, whoami, sudo, exit. Fuzzy `goto`/open matching.
 */
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Terminal as TermIcon } from "lucide-react";
import { useAppStore } from "./app-store";
import { cn } from "~/lib/utils";
import { registry, type RepoEntry } from "~/data/types";
import { navigateTo } from "./nav-bus";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const COMMANDS = ["help", "ls", "all", "open", "search", "stars", "whoami", "clear", "exit"] as const;

function fuzzyCandidates(q: string): string[] {
  const l = q.toLowerCase();
  const out: string[] = [];
  for (const r of registry.repos as RepoEntry[]) {
    const hitTitle = r.slug.toLowerCase().includes(l) || r.label.toLowerCase().includes(l);
    const hitBlurb = r.blurb.toLowerCase().includes(l);
    if (hitTitle || hitBlurb) out.push(r.slug);
    for (const p of r.pageList) {
      if (p.title.toLowerCase().includes(l) || p.path.toLowerCase().includes(l)) {
        out.push(`${r.slug}:${p.path}`);
      }
    }
  }
  return [...new Set(out)].slice(0, 8);
}

function pickResult(q: string): { repo: string; path?: string } | null {
  const c = fuzzyCandidates(q);
  if (!c.length) return null;
  const first = c[0]!;
  if (first.includes(":")) {
    const [repo, ...rest] = first.split(":");
    return { repo: repo ?? "", path: rest.join(":") };
  }
  return { repo: first };
}

export function Deck() {
  const { deckOpen, setDeckOpen, pushToast } = useAppStore();
  const [lines, setLines] = React.useState<Line[]>([]);
  const [input, setInput] = React.useState("");
  const scroller = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (deckOpen && lines.length === 0) {
      setLines([
        { kind: "ok", text: "⚡ PotenFYR Documentation Deck [v2.0]" },
        { kind: "out", text: "Type `help` to begin. Tab completes. `Ctrl+\\` closes." },
      ]);
    }
  }, [deckOpen, lines.length]);

  React.useEffect(() => {
    if (deckOpen) setTimeout(() => scroller.current?.scrollTo({ top: 1e9 }), 30);
  }, [lines.length, deckOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!deckOpen) return;
      if (e.key === "Escape") setDeckOpen(false);
      if (e.ctrlKey && e.key === "\\") {
        e.preventDefault();
        setDeckOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deckOpen, setDeckOpen]);

  function run(cmdRaw: string) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;
    const [head, ...args] = cmd.split(/\s+/);
    const rest = args.join(" ");
    const push = (l: Line) => setLines((ls) => [...ls, l]);

    switch (head) {
      case "help":
        push({ kind: "ok", text: "commands:" });
        push({ kind: "out", text: "  ls [repo]           list repos / pages of one repo" });
        push({ kind: "out", text: "  open <repo|path>    open a doc (fuzzy)" });
        push({ kind: "out", text: "  search <query>      search titles & blurbs" });
        push({ kind: "out", text: "  stars               star counts across the org" });
        push({ kind: "out", text: "  eggs                list known easter eggs (spoilers)" });
        push({ kind: "out", text: "  whoami | sudo | clear | exit" });
        break;
      case "ls": {
        if (rest) {
          const r = (registry.repos as RepoEntry[]).find((x) => x.slug === rest.toLowerCase() || x.label.toLowerCase() === rest.toLowerCase());
          if (!r) { push({ kind: "err", text: `no repo named "${rest}"-try ls` }); return; }
          push({ kind: "ok", text: `${r!.label} (${r.category})-${r!.pageList.length} page(s):` });
          for (const p of r!.pageList) push({ kind: "out", text: `  ${p.path}${p.overview ? "  [overview]" : ""}` });
        } else {
          push({ kind: "ok", text: `${registry.repos.length} repos available:` });
          for (const r of registry.repos as RepoEntry[]) push({ kind: "out", text: `  ${r.slug.padEnd(24, " ")} ${r.category}` });
        }
        break;
      }
      case "open": {
        if (!rest) return push({ kind: "err", text: "usage: open <repo>" });
        const hit = pickResult(rest);
        if (!hit) return push({ kind: "err", text: `no match for "${rest}"` });
        push({ kind: "ok", text: `→ /${hit.repo}${hit.path ? "/" + hit.path : ""}` });
        navigateTo(`/repo/${hit.repo}${hit.path ? "/" + hit.path : ""}`);
        setDeckOpen(false);
        break;
      }
      case "search": {
        if (!rest) return push({ kind: "err", text: "usage: search <query>" });
        push({ kind: "ok", text: `matches for "${rest}":` });
        for (const c of fuzzyCandidates(rest)) push({ kind: "out", text: `  ${c}` });
        break;
      }
      case "stars": {
        const sorted = [...(registry.repos as RepoEntry[])].sort((a, b) => b.stars - a.stars).slice(0, 10);
        for (const r of sorted as RepoEntry[]) push({ kind: "out", text: `  ${String(r.stars).padStart(5)} ★  ${r.slug}` });
        break;
      }
      case "whoami":
        push({ kind: "out", text: "docs visitor · powered by curiosity" });
        break;
      case "sudo":
        push({ kind: "err", text: "nice try-this deck is read-only by design." });
        break;
      case "exit":
        setDeckOpen(false);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        push({ kind: "err", text: `unknown command "${head}"-try: ${COMMANDS.slice(0, 6).join(", ")}…` });
    }
  }

  return (
    <AnimatePresence>
      {deckOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-rog-void/80 backdrop-blur-md"
          onClick={() => setDeckOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="mx-auto mt-[8vh] w-[min(94vw,780px)] overflow-hidden rounded-2xl border border-rog-line bg-rog-deep/95 shadow-[0_0_60px_rgba(79,163,236,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-rog-line bg-rog-panel/80 px-4 py-2.5">
              <TermIcon className="h-4 w-4 text-rog-sky" />
              <span className="text-[12.5px] font-semibold text-rog-frost">potenfyr-deck</span>
              <span className="ml-auto rounded-full border border-rog-line px-2 py-0.5 text-[10.5px] font-medium text-rog-dim">bun · sh</span>
            </div>
            <div ref={scroller} className="no-scrollbar h-[60vh] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed">
              {lines.map((l, i) => (
                <div key={i} className={cn("whitespace-pre-wrap", l.kind === "in" && "text-rog-ghost", l.kind === "err" && "text-rose-300/90", l.kind === "ok" && "text-rog-sky", l.kind === "out" && "text-[#9db4d3]")}>
                  {l.kind === "in" ? <span className="text-rog-dim">❯ </span> : null}
                  {l.text}
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 text-rog-frost">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-rog-sky" />
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setLines((ls) => [...ls, { kind: "in", text: input }]);
                      run(input);
                      setInput("");
                    }
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const cands = fuzzyCandidates(input);
                      const c0 = cands[0];
      if (c0) setInput(c0.split(":")[0] ?? "");
                    }
                  }}
                  className="w-full bg-transparent outline-none placeholder:text-rog-dim/60"
                  placeholder="type a command… (help)"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useDeckHotkey(): void {
  const { deckOpen, setDeckOpen, searchOpen } = useAppStore();
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setDeckOpen(!deckOpen && !searchOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deckOpen, setDeckOpen, searchOpen]);
}

export function DeckButton({ className }: { className?: string }) {
  const { setDeckOpen } = useAppStore();
  return (
    <button
      onClick={() => setDeckOpen(true)}
      title="Command deck-⌘K"
      className={cn(
        "group flex items-center gap-2 rounded-xl border border-rog-line bg-rog-panel/70 px-3 py-2 text-rog-dim transition-colors hover:border-rog-sky/50 hover:text-rog-frost",
        className
      )}
    >
      <TermIcon className="h-4 w-4" />
      <kbd className="hidden text-[10.5px] md:inline">⌘K</kbd>
    </button>
  );
}

