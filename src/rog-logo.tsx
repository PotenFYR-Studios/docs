/*
 * rog-logo.tsx-theary org mascot (potenfyr avatar) as a tappable component.
 * 7 quick taps trigger the HYPER ORBIT egg (via eggs.triggerLogoTap()).
 */
import * as React from "react";
import { triggerLogoTap } from "./eggs";

export function RogLogo({ size = 30, className, glow }: { size?: number; className?: string; glow?: boolean }) {
  return (
    <button
      onClick={() => triggerLogoTap()}
      aria-label="PotenFYR Studios"
      className={`relative grid place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <img
        src="./rog.png"
        alt="PotenFYR logo"
        width={size}
        height={size}
        className="rounded-full"
        draggable={false}
        style={glow ? { boxShadow: "0 0 18px rgba(79,163,236,0.55)" } : undefined}
      />
    </button>
  );
}
