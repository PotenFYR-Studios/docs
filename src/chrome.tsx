/*
 * chrome.tsx-top navbar + footer shell.
 */
import * as React from "react";
import { Link, useRouteParts } from "./router";
import { RogLogo } from "./rog-logo";
import { DeckButton } from "./deck";
import { useAppStore } from "./app-store";
import { registry } from "~/data/types";
import { WordRotate } from "./magicui";
import { Home, Compass, Terminal, FlipVertical2, Heart } from "lucide-react";
import { GithubMark } from "~/lib/icons";
import { cn } from "~/lib/utils";

export function Navbar() {
  const parts = useRouteParts();
  const onHome = parts.length === 0;
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-rog-line/80 bg-rog-void/70 px-3 py-2 backdrop-blur-xl">
          <RogLogo size={26} glow />
          <Link to="/" className="text-[15px] font-bold tracking-tight text-rog-ghost">
            PotenFYR <span className="text-rog-sky">Docs</span>
          </Link>
          <nav className="ml-3 hidden items-center gap-1 text-[13px] font-medium text-rog-dim md:flex">
            <NavLink to="/" active={onHome}>
              Home
            </NavLink>
            <NavLink to="/repos" active={parts[0] === "repos"}>
              All repos
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <DeckButton />
            <a
              href="https://github.com/PotenFYR-Studios"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-xl border border-rog-line bg-rog-panel/70 text-rog-dim transition-colors hover:border-rog-sky/50 hover:text-rog-frost"
              title="PotenFYR on GitHub"
            >
              <GithubMark className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, active, children }: { to: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-lg px-2.5 py-1.5 transition-colors hover:bg-rog-panel/80 hover:text-rog-frost",
        active && "bg-rog-deep text-rog-frost"
      )}
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const { setDeckOpen } = useAppStore();
  return (
    <footer className="mt-20 border-t border-rog-line/70 bg-rog-void/60 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <RogLogo size={34} />
            <div>
              <div className="text-[13.5px] font-semibold text-rog-ghost">PotenFYR Studios · Docs Hub</div>
              <div className="text-[12px] text-rog-dim">
                One engine for every public repo. Built with Vite + React + TS + Bun.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-rog-dim">
            <WordRotate className="text-rog-frost" />
            <span className="mx-1 hidden sm:inline">·</span>
            <span>{registry.stats.pages} pages</span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-rog-dim">
          <a href="https://potenfyr.in" className="hover:text-rog-frost">potenfyr.in</a>
          <a href="https://github.com/PotenFYR-Studios/docs" className="hover:text-rog-frost">hub source</a>
          <button className="hover:text-rog-frost" onClick={() => setDeckOpen(true)}>command deck ⌘K</button>
        </div>
      </div>
    </footer>
  );
}
