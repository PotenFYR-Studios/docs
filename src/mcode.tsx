/*
 * mcode.tsx — renders pre-highlighted markdown HTML safely and enhances it:
 * copy buttons on code blocks, anchored headings, table hover accent.
 */
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "~/lib/utils";

export function MdHtml({ html, className }: { html: string; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* headings already carry ids from build; ensure anchor links exist */
    for (const h of Array.from(node.querySelectorAll<HTMLElement>("h1[id],h2[id],h3[id],h4[id]"))) {
      if (h.querySelector(".anchor-link")) continue;
      const id = h.id;
      const a = document.createElement("a");
      a.className = "anchor-link";
      a.href = `#${id}`;
      a.textContent = "¶";
      a.setAttribute("aria-label", "Anchor");
      h.appendChild(a);
    }

    /* copy-button on every highlighted pre block */
    const preList = Array.from(node.querySelectorAll<HTMLPreElement>("pre"));
    const cleanups: Array<() => void> = [];
    for (const pre of preList) {
      const btn = document.createElement("button");
      btn.className =
        "absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-[#232a3f] bg-[#10131f]/90 px-2.5 py-1.5 text-[11px] font-medium text-[#8a94ab] opacity-0 transition-all duration-200 hover:text-[#e3f1ff] hover:border-[#33507e]";
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> copy`;
      btn.style.transform = "translateY(-2px)";
      pre.appendChild(btn);
      const onEnter = () => (btn.style.opacity = "1");
      const onLeave = () => (btn.style.opacity = "0");
      const onClick = async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector("code")?.innerText ?? pre.innerText);
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 13 4 4L19 7"/></svg> copied`;
          setTimeout(() => {
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> copy`;
          }, 1400);
        } catch {
          /* clipboard unavailable (non-https) — ignore */
        }
      };
      pre.addEventListener("mouseenter", onEnter);
      pre.addEventListener("mouseleave", onLeave);
      btn.addEventListener("click", onClick);
      cleanups.push(() => {
        pre.removeEventListener("mouseenter", onEnter);
        pre.removeEventListener("mouseleave", onLeave);
        btn.removeEventListener("click", onClick);
      });
    }
    return () => cleanups.forEach((c) => c());
  }, [html]);

  return <div ref={ref} className={cn("pp-md", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

