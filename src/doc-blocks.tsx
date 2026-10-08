/*
 * doc-blocks.tsx - renders typed content blocks with the hub's own visual
 * language: gradient section rules, icon bullets, code cards, tinted callouts,
 * sticky key-value chips and wide tables. No markdown output is rendered.
 */
import * as React from "react";
import { useInView } from "framer-motion";
import {
  AlertTriangle, Check, ChevronRight, CircleDot, Copy, Info, Lightbulb,
} from "lucide-react";
import type { Block } from "~/data/types";
import { cn } from "~/lib/utils";

/* ------------------------------- atoms ------------------------------- */

/** inline html from the build pipeline (links already point at hub routes) */
function Inline({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function CodeCard({ block }: { block: Extract<Block, { t: 4 }> }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ok, setOk] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.querySelector("code")?.innerText ?? "");
      setOk(true);
      setTimeout(() => setOk(false), 1400);
    } catch { /* ignore */ }
  };
  return (
    <div className="group relative my-6 overflow-hidden rounded-2xl border border-rog-line bg-[#0b0e17] shadow-[0_8px_40px_-16px_rgba(79,163,236,0.25)]">
      <div className="flex items-center justify-between border-b border-rog-line/70 bg-rog-deep/70 px-4 py-2">
        <span className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full bg-rog-sky/80", block.lang !== "text" && "shadow-[0_0_8px_rgba(79,163,236,0.8)]")} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-rog-dim">{block.lang}</span>
        </span>
        <button onClick={copy} className="flex items-center gap-1.5 rounded-lg border border-rog-line px-2.5 py-1 text-[11px] text-rog-dim transition-colors hover:border-rog-sky/50 hover:text-rog-frost">
          {ok ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {ok ? "copied" : "copy"}
        </button>
      </div>
      <div ref={ref} className="overflow-x-auto p-4 text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.html }} />
    </div>
  );
}

function Callout({ block }: { block: Extract<Block, { t: 6 }> }) {
  const text = block.html.toLowerCase();
  const tone = /warn|careful|danger|must not|never|don'?t|do not/.test(text)
    ? { Icon: AlertTriangle, cls: "border-amber-400/30 bg-amber-400/[0.06]", icon: "text-amber-300" }
    : /tip|pro tip|recommend|best practice|hint/.test(text)
      ? { Icon: Lightbulb, cls: "border-emerald-400/30 bg-emerald-400/[0.06]", icon: "text-emerald-300" }
      : { Icon: Info, cls: "border-rog-sky/35 bg-rog-sky/[0.06]", icon: "text-rog-sky" };
  return (
    <div className={cn("my-6 flex gap-3 rounded-2xl border px-5 py-4", tone.cls)}>
      <tone.Icon className={cn("mt-1 h-4.5 w-4.5 h-5 w-5 shrink-0", tone.icon)} />
      <div className="min-w-0 text-[14.5px] leading-relaxed text-[#b9c6dd]" dangerouslySetInnerHTML={{ __html: block.html }} />
    </div>
  );
}

function ListBlock({ block }: { block: Extract<Block, { t: 3 }> }) {
  const Tag = block.ordered ? "ol" : "ul";
  return (
    <Tag className={cn("my-5 space-y-3", !block.ordered && "list-none")}>
      {block.items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#c7d2e4]">
          {block.ordered ? (
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-rog-line bg-rog-deep font-mono text-[11px] font-bold text-rog-sky">
              {i + 1}
            </span>
          ) : (
            <CircleDot className="mt-[5px] h-3.5 w-3.5 shrink-0 text-rog-sky/70" />
          )}
          <div className="min-w-0 flex-1" dangerouslySetInnerHTML={{ __html: it.html ?? "" }} />
        </li>
      ))}
    </Tag>
  );
}

function TableBlock({ block }: { block: Extract<Block, { t: 5 }> }) {
  if (block.kv) {
    return (
      <div className="my-6 grid gap-2 sm:grid-cols-2">
        {block.rows.map((r, i) => (
          <div key={i} className="rounded-xl border border-rog-line bg-rog-panel/50 px-4 py-3 transition-colors hover:border-rog-sky/40">
            <div className="font-mono text-[12px] font-semibold text-rog-frost">{r[0]}</div>
            <div className="mt-1 text-[13px] leading-relaxed text-rog-dim">{r[1]}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="pp-table-wrap my-6 overflow-hidden rounded-2xl border border-rog-line">
      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px]">
          {block.head.length > 0 && (
            <thead>
              <tr className="bg-rog-deep">
                {block.head.map((h, i) => (
                  <th key={i} className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-rog-sky">{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {block.rows.map((r, i) => (
              <tr key={i} className={cn("border-t border-rog-line/70 transition-colors hover:bg-rog-panel/50", i % 2 === 1 && "bg-rog-panel/25")}>
                {r.map((c, j) => (
                  <td key={j} className={cn("px-4 py-3 align-top text-[#c4d1e3]", j === 0 && "font-medium text-rog-frost")}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ImageBlock({ block }: { block: Extract<Block, { t: 7 }> }) {
  return (
    <figure className="my-6">
      <img src={block.src} alt={block.alt || ""} loading="lazy" className="mx-auto max-h-[420px] rounded-xl border border-rog-line" />
      {block.alt ? <figcaption className="mt-2 text-center text-[12px] text-rog-dim">{block.alt}</figcaption> : null}
    </figure>
  );
}

function SectionHeading({ block }: { block: Extract<Block, { t: 1 }> }) {
  if (block.level === 1) {
    return <h1 className="mb-6 mt-2 text-3xl font-extrabold tracking-tight text-rog-ghost">{block.text}</h1>;
  }
  const size = block.level === 2 ? "text-[1.6rem]" : block.level === 3 ? "text-[1.25rem]" : "text-[1.05rem]";
  return (
    <h2
      id={block.id}
      data-doc-heading
      className={cn(
        "group relative mt-12 scroll-mt-28 first:mt-6",
        size,
        "font-bold tracking-tight text-rog-ghost"
      )}
    >
      <span className="absolute -left-4 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-rog-sky/60 lg:block" aria-hidden />
      <a href={`#${block.id}`} onClick={(e) => e.preventDefault()} className="outline-none">
        {block.text}
      </a>
      <span className="absolute bottom-0 left-0 -mb-1 h-[2px] w-12 rounded-full bg-gradient-to-r from-rog-sky to-transparent" aria-hidden />
    </h2>
  );
}

/* ------------------------------- page renderer ------------------------------- */

function BlockNode({ block, i }: { block: Block; i: number }) {
  switch (block.t) {
    case 1: return <SectionHeading key={i} block={block} />;
    case 2: return <p key={i} className="my-4 text-[15.5px] leading-[1.8] text-[#c7d2e4]" dangerouslySetInnerHTML={{ __html: block.html }} />;
    case 3: return <ListBlock key={i} block={block} />;
    case 4: return <CodeCard key={i} block={block} />;
    case 5: return <TableBlock key={i} block={block} />;
    case 6: return <Callout key={i} block={block} />;
    case 7: return <ImageBlock key={i} block={block} />;
    case 8: return <hr key={i} className="my-10 border-rog-line/70" />;
    case 9: return <Cardish key={i} html={block.html} />;
    default: return null;
  }
}

function Cardish({ html }: { html: string }) {
  return (
    <div className="my-5 rounded-2xl border border-rog-line bg-rog-panel/40 p-5 text-[14.5px] leading-relaxed text-[#c7d2e4]" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/** dominated by reading-time estimate + progress */
export function DocBlocks({ blocks }: { blocks: Block[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  void inView;
  return (
    <div ref={ref} className="doc-blocks max-w-none">
      {blocks.map((b, i) => <BlockNode key={i} block={b} i={i} />)}
    </div>
  );
}

/* small extension used by the reader's TOC scroll-spy */
export function Chevron(): React.ReactElement {
  return <ChevronRight />;
}
