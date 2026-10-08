/*
 * rog-logo.tsx - the PotenFYR org mascot as a tappable home link.
 */
import * as React from "react";
import { Link } from "./router";

export function RogLogo({ size = 30, className, glow }: { size?: number; className?: string; glow?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="PotenFYR Studios home"
      className={`relative grid place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/rog.png"
        alt="PotenFYR logo"
        width={size}
        height={size}
        className="rounded-full"
        draggable={false}
        style={glow ? { boxShadow: "0 0 18px rgba(79,163,236,0.55)" } : undefined}
      />
    </Link>
  );
}
