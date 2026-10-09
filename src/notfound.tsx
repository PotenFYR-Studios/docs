/*
 * notfound.tsx-404 with personality + cheat sheet overlay.
 */
import * as React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Link } from "./router";
import { ShimmerButton } from "./magicui";

export function NotFound(): React.ReactElement {
  return (
    <main className="relative grid min-h-[76vh] place-items-center overflow-hidden px-4 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative max-w-lg text-center"
      >
        <div className="pp-aurora-text font-mono text-[88px] font-black leading-none sm:text-[120px]">404</div>
        <h1 className="mt-2 text-xl font-bold text-rog-ghost">Page not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-rog-dim">
          The page you asked for isn't in the hub. Try the catalog or the command deck
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

