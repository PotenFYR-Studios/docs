/*
 * eggs.tsx — the hidden easter-egg layer for docs.potenfyr.in.
 * Triggers:
 *   • Konami ↑↑↓↓←→←→BA   → confetti + "DECK MASTER" toast + egg badge
 *   • typing "fyr"        → flame burst overlay
 *   • 7× ROG logo clicks  → HYPER ORBIT (rogMode: page glow + faster auroras)
 *   • typing "egg"        → cute hint toast (doesn't spoil Konami)
 *   • footer cat          → meow.
 * The command deck (terminal) lives in deck.tsx and is toggled from the store.
 */
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Sparkles, Egg, Terminal } from "lucide-react";
import { useAppStore } from "./app-store";
import { confetti } from "~/lib/utils";

export function useKeyboardSequence(target: string, onMatch: () => void, resetMs = 1600) {
  const buf = React.useRef("");
  const timer = React.useRef<number | undefined>(undefined);
  const cb = React.useRef(onMatch);
  cb.current = onMatch;
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key.length === 1) buf.current += e.key.toLowerCase();
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => (buf.current = ""), resetMs);
      if (target.length > 1 && buf.current.endsWith(target)) {
        buf.current = "";
        cb.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, [target, resetMs]);
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function useKonami(onMatch: () => void) {
  const idx = React.useRef(0);
  const cb = React.useRef(onMatch);
  cb.current = onMatch;
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === KONAMI[idx.current]) {
        idx.current++;
        if (idx.current === KONAMI.length) {
          idx.current = 0;
          cb.current();
        }
      } else {
        idx.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/* ------------------------------- layered overlays ------------------------------- */

function FlameBurst({ on }: { on: boolean }) {
  if (!on) return null;
  const drops = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {drops.map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i / drops.length) * 100 + Math.random() * 6}%`,
            bottom: `${Math.random() * 14}%`,
            width: 16 + Math.random() * 22,
            height: 16 + Math.random() * 22,
            filter: "blur(6px)",
            background: `radial-gradient(circle, rgba(182,220,255,0.9), rgba(79,163,236,0.5) 55%, rgba(20,40,70,0) 75%)`,
            animation: `pp-flame-rise ${0.8 + Math.random() * 0.9}s ease-out forwards`,
          }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Flame className="h-28 w-28 text-rog-frost drop-shadow-[0_0_30px_rgba(79,163,236,0.9)]" />
      </motion.div>
    </div>
  );
}

function Toasts() {
  const { toasts, dismissToast } = useAppStore();
  const ICON: Record<string, React.ReactNode> = {
    sparkles: <Sparkles className="h-4 w-4 text-rog-sky" />,
    flame: <Flame className="h-4 w-4 text-rog-frost" />,
    terminal: <Terminal className="h-4 w-4 text-rog-sky" />,
    egg: <Egg className="h-4 w-4 text-rog-frost" />,
  };
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[120] flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pp-aurora-border pointer-events-auto flex cursor-pointer items-start gap-3 rounded-2xl border border-rog-line bg-rog-panel/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
            onClick={() => dismissToast(t.id)}
          >
            <span className="mt-0.5">{ICON[t.icon ?? "sparkles"] ?? ICON.sparkles}</span>
            <span>
              <span className="block text-[13.5px] font-semibold text-rog-ghost">{t.title}</span>
              {t.body && <span className="mt-0.5 block text-[12.5px] text-rog-dim">{t.body}</span>}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- engine ------------------------------- */

export function EggLayer(): React.ReactElement {
  const { pushToast, setCheatOpen, rogMode, setRogMode } = useAppStore();
  const [flameOn, setFlameOn] = React.useState(false);
  const logoTaps = React.useRef(0);
  const tapTimer = React.useRef<number | undefined>(undefined);

  const flame = React.useCallback(() => {
    setFlameOn(true);
    setTimeout(() => setFlameOn(false), 1900);
    pushToast({ icon: "flame", title: "F Y R", body: "Flame mode unlocked. You found one." });
  }, [pushToast]);

  useKonami(() => {
    confetti(140, 50, 12);
    pushToast({ icon: "sparkles", title: "DECK MASTER", body: "Konami code accepted — you are one of us now." });
    setRogMode(true);
  });

  useKeyboardSequence("fyr", flame);
  useKeyboardSequence("egg", () => pushToast({ icon: "egg", title: "🥚 nice try", body: "That could hurt someone. The real eggs are quieter." }), 2200);
  useKeyboardSequence("?", () => setCheatOpen(true));
  useKeyboardSequence("docs", () => pushToast({ icon: "sparkles", title: "You rang?", body: "Try `?` for the cheat sheet, or ⌘K for the command deck." }), 2400);

  React.useEffect(() => {
    if (rogMode) document.documentElement.classList.add("rog-mode");
    else document.documentElement.classList.remove("rog-mode");
  }, [rogMode]);

  const logoTap = React.useCallback(() => {
    logoTaps.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = window.setTimeout(() => (logoTaps.current = 0), 2200);
    if (logoTaps.current === 3) {
      pushToast({ icon: "sparkles", title: "4 more…", body: "The logo likes attention." });
    }
    if (logoTaps.current >= 7) {
      logoTaps.current = 0;
      setRogMode(!rogMode);
      confetti(90, 50, 8);
      pushToast({ icon: "sparkles", title: rogMode ? "HYPER ORBIT off" : "HYPER ORBIT on", body: "Logo-tap combo accepted." });
    }
  }, [pushToast, rogMode, setRogMode]);

  return (
    <>
      <Toasts />
      <AnimatePresence>
        <FlameBurst key="flame" on={flameOn} />
      </AnimatePresence>
      <Hidden logoTap={logoTap} />
    </>
  );
}

/** invisible anchor for the 7-tap logo egg — rendered near the actual logo button */
function Hidden({ logoTap }: { logoTap: () => void }) {
  return <span data-egg="rog-tap" onClick={logoTap} className="hidden" />;
}

export function triggerLogoTap(): void {
  const el = document.querySelector<HTMLElement>('[data-egg="rog-tap"]');
  el?.click();
}

export function meow(): void {
  // eslint-disable-next-line no-console
  console.log("%c =^.^= meow ", "background:#4fa3ec;color:#05070c;font-weight:bold;border-radius:4px");
}
