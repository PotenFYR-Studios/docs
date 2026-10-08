/*
 * notfound.tsx — 404 with personality + cheat sheet overlay.
 */
import * as React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Link } from "./router";
import { Meteors, ShimmerButton } from "./magicui";
import { useAppStore } from "./app-store";
import { X } from "lucide-react";

export function NotFound(): React.ReactElement {
  return (
    <main className="relative grid min-h-[76vh] place-items-center overflow-hidden px-4 pt-24">
      <Meteors count={18} />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative max-w-lg text-center"
      >
        <div className="pp-aurora-text font-mono text-[88px] font-black leading-none sm:text-[120px]">404</div>
        <h1 className="mt-2 text-xl font-bold text-rog-ghost">This route drifted off the grid</h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-rog-dim">
          The page you asked for isn't in the hub. Try the catalog — or the command deck
          (<code className="rounded bg-rog-panel px-1.5 py-0.5 font-mono text-[12px] text-rog-sky">⌘K</code>, then <code className="rounded bg-rog-panel px-1.5 py-0.5 font-mono text-[12px] text-rog-sky">ls</code>).
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/">
            <ShimmerButton>
              <Compass className="h-4 w-4" /> Back home
            </ShimmerButton>
          </Link>
          <Link to="/repos" className="text-[13.5px] font-semibold text-rog-frost/90 underline-offset-4 hover:underline">
            all repos →
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

const SHORTCUTS: Array<[string, string]> = [
  ["⌘K / Ctrl+K", "Open the command deck (terminal)"],
  ["Esc", "Close any overlay"],
  ["?", "This cheat sheet"],
  ["↑↑↓↓←→←→BA", "…you already know"],
  ["type fyr", "🔥"],
  ["type docs", "a small hint"],
  ["7× logo taps", "HYPER ORBIT"],
];

export function CheatSheet(): React.ReactElement {
  const { cheatOpen, setCheatOpen } = useAppStore();
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCheatOpen(false);
    };
    if (cheatOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cheatOpen, setCheatOpen]);
  return (
    <>
      {cheatOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[115] grid place-items-center bg-rog-void/80 p-4 backdrop-blur-md"
          onClick={() => setCheatOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl border border-rog-line bg-rog-deep/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-rog-ghost">Cheat sheet</h2>
              <button onClick={() => setCheatOpen(false)} className="rounded-lg p-1.5 text-rog-dim hover:bg-rog-panel hover:text-rog-frost">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              {SHORTCUTS.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 text-[13px]">
                  <kbd className="rounded-md border border-rog-line bg-rog-panel px-2 py-1 font-mono text-[11.5px] text-rog-frost">{k}</kbd>
                  <span className="text-right text-rog-dim">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
