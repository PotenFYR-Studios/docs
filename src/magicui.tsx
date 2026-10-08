/*
 * Magic UI-style components, natively implemented for the PotenFYR palette
 * (black × sky-blue). No external UI deps-pure CSS keyframes + Intersection
 * Observer + canvas. Each piece keeps the small, typed API of its Magic UI
 * counterpart so it is familiar to contributors.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "~/lib/utils";

/* ---------------------------------- AuroraText ---------------------------------- */

export function AuroraText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("pp-aurora-text inline-block", className)} aria-label={typeof children === "string" ? children : undefined}>
      {children}
    </span>
  );
}

/* ---------------------------------- Meteors ---------------------------------- */

const METEORS = 14;

export function Meteors({ className, count = METEORS }: { className?: string; count?: number }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.floor(Math.random() * 40) - 8,
        left: Math.floor(Math.random() * 130) - 15,
        delay: Math.random() * 4,
        dur: 3.4 + Math.random() * 4.5,
        angle: -(215 + Math.random() * 12),
        width: 90 + Math.random() * 110,
      })),
    [count]
  );
  return (
    <div className={cn("pointer-events-none absolute overflow-hidden", className)} aria-hidden>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute h-px rotate-[215deg] rounded-full"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: m.width,
            ["--pp-angle" as never]: `${m.angle}deg`,
            animation: `pp-meteor ${m.dur}s linear ${m.delay}s infinite`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(79,163,236,0.85))",
            boxShadow: "0 0 7px 1px rgba(79,163,236,0.55)",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------- MagicCard (spotlight) ---------------------------------- */

export function MagicCard({
  children,
  className,
  glowColor = "#4fa3ec",
  spotlightRadius = 220,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  spotlightRadius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -400, y: -400 });

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ ["--pp-glow" as never]: glowColor }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos({ x: -400, y: -400 })}
    >
      <div
        className="pointer-events-none absolute transition-opacity duration-300"
        style={{
          background: `radial-gradient(${spotlightRadius}px circle at ${pos.x}px ${pos.y}px, ${glowColor}22, transparent 65%)`,
          opacity: pos.x > -100 ? 1 : 0,
          inset: 0,
        }}
      />
      {children}
    </div>
  );
}

/* ---------------------------------- BorderBeam ---------------------------------- */

export function BorderBeam({
  className,
  size = 90,
  duration = 6,
  delay = 0,
  color = "#4fa3ec",
}: {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  color?: string;
}) {
  return (
    <span className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", className)} aria-hidden>
      <span
        className="absolute rounded-[inherit]"
        style={{ inset: 0, mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor", padding: "1.2px" }}
      >
        <span
          className="absolute"
          style={{
            width: size,
            height: size,
            top: "50%",
            left: "50%",
            translate: "-50% -50%",
            animation: `pp-border-beam ${duration}s linear ${delay}s infinite`,
            offsetPath: "rect(0 auto auto 0 round calc(infinity * 1px))",
            background: `conic-gradient(from 0deg, transparent 0 340deg, ${color}f0 348deg, transparent 360deg)`,
            borderRadius: "9999px",
          }}
        />
      </span>
    </span>
  );
}

/* ---------------------------------- OrbitingCircles ---------------------------------- */

export function OrbitingCircles({
  children,
  radius = 90,
  duration = 22,
  reverse = false,
  count = 6,
  className,
}: {
  children: (i: number) => React.ReactNode;
  radius?: number;
  duration?: number;
  reverse?: boolean;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
            ["--pp-radius" as never]: `${radius}px`,
            ["--pp-spin" as never]: `${Math.round((i * 360) / count)}deg`,
            animation: `${reverse ? "pp-orbit" : "pp-orbit-rev"} ${duration}s linear infinite`,
          }}
        >
          <div style={{ transform: `translateX(${radius}px)` }}>
            <div style={{ transform: "translate(-50%, -50%)" }}>{children(i)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- ShimmerButton ---------------------------------- */

export function ShimmerButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      className={cn(
        "relative isolate overflow-hidden rounded-full px-6 py-3 font-semibold text-rog-void",
        "bg-gradient-to-r from-rog-sky to-rog-frost shadow-[0_0_22px_rgba(79,163,236,0.35)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]",
        className
      )}
      {...rest}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <span className="pp-shimmer-underlay absolute inset-0 z-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} />
    </button>
  );
}

/* ---------------------------------- GhostButton ---------------------------------- */

export function GhostButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      className={cn(
        "rounded-full border border-rog-line bg-rog-panel/70 px-6 py-3 font-semibold text-rog-frost/90 backdrop-blur",
        "transition-all duration-200 hover:border-rog-sky/60 hover:bg-rog-deep hover:shadow-[0_0_18px_rgba(79,163,236,0.2)] active:scale-[0.98]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------------------------------- Marquee ---------------------------------- */

export function Marquee({ children, duration = 42, className }: { children: React.ReactNode; duration?: number; className?: string }) {
  return (
    <div className={cn("relative flex overflow-hidden", className)} aria-hidden>
      <div className="pp-marquee-track flex w-max shrink-0 items-center" style={{ ["--pp-marquee-dur" as never]: `${duration}s` }}>
        <div className="flex items-center">{children}</div>
        <div className="flex items-center">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------- NumberTicker ---------------------------------- */

export function NumberTicker({ value, className, suffix }: { value: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className={className}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------------------------------- AnimatedShinyText ---------------------------------- */

export function AnimatedShinyText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: "linear-gradient(120deg, #6b7a97 25%, #b6dcff 50%, #6b7a97 75%)",
        backgroundSize: "200% 100%",
        animation: "pp-shimmer-text 3.2s linear infinite",
      }}
    >
      {children}
    </span>
  );
}

/* ---------------------------------- TypingAnimation ---------------------------------- */

export function TypingAnimation({ text, className, speed = 42, startDelay = 300 }: { text: string; className?: string; speed?: number; startDelay?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    const t0 = setTimeout(() => {
      const iv = setInterval(() => {
        setShown((s) => {
          if (s >= text.length) {
            clearInterval(iv);
            return s;
          }
          return s + 1;
        });
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t0);
  }, [text, speed, startDelay]);
  return (
    <span className={className}>
      {text.slice(0, shown)}
      <span className="pp-term-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-rog-sky" />
    </span>
  );
}

/* ---------------------------------- BlurFade ---------------------------------- */

export function BlurFade({
  children,
  className,
  delay = 0,
  y = 14,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", y }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------- FlickeringGrid (canvas bg) ---------------------------------- */

export function FlickeringGrid({ className, opacity = 0.5 }: { className?: string; opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let cols = 0;
    let rows = 0;
    const cell = 26;
    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      cols = Math.ceil(canvas.width / (cell * devicePixelRatio)) + 1;
      rows = Math.ceil(canvas.height / (cell * devicePixelRatio)) + 1;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    const drawn = new Set<number>();
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gl = "rgba(79,163,236,";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          // deterministic per-cell flicker
          const n = Math.sin(i * 12.9898 + Math.floor(t / 90) * 0.0009) * 43758.5453;
          const a = n - Math.floor(n);
          if (a > 0.62) drawn.add(i);
          else if (a < 0.58) drawn.delete(Math.floor(i + Math.sin(t / 700) * 3));
          if (drawn.has(i)) {
            ctx.fillStyle = `${gl}${(0.10 + a * 0.30 * opacity).toFixed(2)})`;
            const x0 = x * cell * devicePixelRatio;
            const y0 = y * cell * devicePixelRatio;
            ctx.fillRect(x0, y0, 1.2 * devicePixelRatio, 1.2 * devicePixelRatio);
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [opacity]);
  return <canvas ref={ref} className={cn("pointer-events-none absolute inset-0", className)} aria-hidden />;
}

/* ---------------------------------- RetroGrid ---------------------------------- */

export function RetroGrid({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute"
        style={{
          inset: "0px 0px -65% 0px",
          transform: "perspective(28em) rotateX(58deg) translateZ(0)",
          backgroundImage:
            "linear-gradient(to right, rgba(79,163,236,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(79,163,236,0.16) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 45%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 45%, transparent 90%)",
        }}
      />
    </div>
  );
}

/* ---------------------------------- ParticlesLite ---------------------------------- */

export function ParticlesLite({ count = 34, className }: { count?: number; className?: string }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        dur: 7 + Math.random() * 9,
        size: 1.2 + Math.random() * 2.4,
      })),
    [count]
  );
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {parts.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-rog-frost/60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `pp-flicker ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------- WordRotate ---------------------------------- */

const ROT_WORDS = ["hosting eggs", "auth frameworks", "API defense", "Minecraft tooling", "dev infrastructure"];

export function WordRotate({ words = ROT_WORDS, className }: { words?: string[]; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(iv);
  }, [words.length]);
  return (
    <span className={cn("relative inline-grid", className)}>
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.38 }}
        className="text-rog-sky"
      >
        {words[i]}
      </motion.span>
    </span>
  );
}

/* ---------------------------------- ScrollProgress ---------------------------------- */

export function ScrollProgress({ containerRef }: { containerRef?: React.RefObject<HTMLElement | null> } = {}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el: HTMLElement | Window = containerRef?.current ?? window;
    const onScroll = () => {
      const h = el instanceof HTMLElement ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      const top = el instanceof HTMLElement ? el.scrollTop : window.scrollY;
      setW(h > 0 ? Math.min(1, top / h) : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true } as never);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll as never);
  }, [containerRef]);
  return (
    <div className="fixed left-0 top-0 z-[60] h-[2.5px] w-full bg-transparent" aria-hidden>
      <div
        className="h-full origin-left bg-gradient-to-r from-rog-sky to-rog-frost"
        style={{ transform: `scaleX(${w})`, boxShadow: "0 0 12px rgba(79,163,236,0.7)" }}
      />
    </div>
  );
}
