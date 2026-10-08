/*
 * blocks.ts (build-side) - turns vendored markdown and SSR-captured HTML into
 * a typed content-block JSON the SPA renders with its own doc components.
 * No raw markdown / markdown-like output reaches the client.
 */
import { createHighlighter, bundledLanguages, type Highlighter } from "shiki";
import MarkdownIt from "markdown-it";
type MdInstance = InstanceType<typeof MarkdownIt>;
import { Window } from "happy-dom";

export type Block =
  | { t: 1; level: number; id: string; text: string }                       // heading
  | { t: 2; html: string }                                                   // paragraph (inline-safe html)
  | { t: 3; ordered: boolean; items: Array<{ html?: string }> }              // list (one level)
  | { t: 4; lang: string; html: string }                                     // code card (shiki)
  | { t: 5; head: string[]; rows: string[][]; kv?: boolean }                 // table (kv when 2-col)
  | { t: 6; html: string }                                                   // quote/callout
  | { t: 7; src: string; alt: string }                                       // image
  | { t: 8 }                                                                 // hr
  | { t: 9; html: string };                                                  // raw fallback card

const slugCache = new Map<string, string>();
function slugify(text: string): string {
  const base = text.toLowerCase().replace(/[*_`]/g, "").trim()
    .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "section";
  if (!slugCache.has(base)) return base;
  let i = 2;
  while (slugCache.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

const BADGE_RE = /img\.shields\.io|komarev\.com|ghpvc|star-history|contrib\.rocks|capsule-render|readme-typing|badgen|badge\./i;

/** inline-html for a markdown-it inline token's children (options param is unused in default rules) */
type TokenLike = { children?: unknown; content?: string; attrGet?: (n: string) => string | null };
function inlineHtml(md: MdInstance, tok: TokenLike): string {
  const kids = (tok.children ?? null) as unknown[] | null;
  if (kids && kids.length) {
    const children = kids as never[];
    const env = { definitions: {}, references: {} } as never as Record<string, unknown>;
    const renderer = md.renderer as unknown as {
      renderInline: (this: unknown, t: never[], o: Record<string, unknown> | undefined, e: Record<string, unknown>) => string;
    };
    const bound = renderer.renderInline.bind(md.renderer as unknown as object) as (
      t: never[], o: Record<string, unknown> | undefined, e: Record<string, unknown>
    ) => string;
    return bound(children, { breaks: false, xhtmlOut: false } as Record<string, unknown>, env);
  }
  return md.utils.escapeHtml(tok.content ?? "");
}

export function mdToBlocks(mdSrc: string, md: MdInstance, hl: Highlighter): { blocks: Block[]; headings: Array<{ id: string; level: number; text: string }> } {
  const tokens = md.parse(mdSrc, {});
  const blocks: Block[] = [];
  const headings: Array<{ id: string; level: number; text: string }> = [];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]!;
    const inline = tokens[i + 1]?.type === "inline" ? (tokens[i + 1] as unknown as TokenLike) : null;

    if (tok.type === "heading_open") {
      const level = Number(tok.tag!.slice(1));
      const text = (inline?.content ?? "").replace(/[*_`]/g, "").trim();
      if (!text) continue;
      const id = slugify(text);
      headings.push({ id, level, text });
      blocks.push({ t: 1, level: level as 2, id, text });
      i++; // consume inline token
      continue;
    }

    if (tok.type === "paragraph_open") {
      const children = (inline?.children ?? []) as unknown as any[];
      // standalone-image paragraph -> image block
      const imgs = children.filter((c: any) => c.type === "image");
      if (imgs.length === 1 && textOfChildren(children).trim().length < 4) {
        const img = imgs[0]!;
        const src = String(img.attrGet("src") ?? "");
        if (src) { blocks.push({ t: 7, src, alt: img.content || "" }); i++; continue; }
      }
      const html = inlineHtml(md, inline!);
      if (html.trim()) blocks.push({ t: 2, html });
      i++;
      continue;
    }

    if (tok.type === "fence") {
      const lang = tok.info!.split(/\s+/)[0]!.toLowerCase() || "text";
      const out = hl.codeToHtml(tok.content.replace(/\n$/, ""), {
        lang: lang in bundledLanguages ? (lang as never) : "text",
        theme: "vitesse-dark",
      });
      blocks.push({ t: 4, lang, html: out });
      continue;
    }
    if (tok.type === "code_inline") {
      // inline code is handled inside paragraph rendering; skip here
      continue;
    }

    if (tok.type === "bullet_list_open" || tok.type === "ordered_list_open") {
      const ordered = tok.type === "ordered_list_open";
      const items: Array<{ html: string }> = [];
      let j = i + 1;
      let depth = 1; // inside this list
      while (j < tokens.length && depth > 0) {
        const t = tokens[j]!;
        if (t.type.endsWith("_list_open")) { depth++; }
        else if (t.type === "list_item_open" && depth === 1) {
          // scan to the paired list_item_close, collecting the first inline token
          let inner = 0;
          const inlineTok = tokens[j + 1];
          let inlineFound: any = null;
          if (inlineTok && inlineTok.type === "inline") inlineFound = inlineTok;
          else {
            for (let k = j + 1; k < tokens.length; k++) {
              const tt = tokens[k]!;
              if (tt.type === "list_item_open") inner++;
              if (tt.type === "inline" && !inlineFound) inlineFound = tt;
              if (tt.type === "list_item_close") { if (inner === 0) break; inner--; }
              if (tt.type === (ordered ? "ordered_list_close" : "bullet_list_close") && !inlineFound) break;
            }
          }
          if (inlineFound) {
            const html = inlineHtml(md, inlineFound as unknown as TokenLike);
            if (html.trim() && !looksLikeBadge(html)) items.push({ html });
          }
        }
        if (t.type === (ordered ? "ordered_list_close" : "bullet_list_close")) {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      if (items.length) blocks.push({ t: 3, ordered, items });
      i = j >= tokens.length ? tokens.length - 1 : j;
      continue;
    }

    if (tok.type === "blockquote_open") {
      // find closing blockquote_close; render inner inline tokens
      const inner: any[] = [];
      let depth = 0;
      let j = i;
      while (j < tokens.length) {
        const t = tokens[j]!;
        if (t.type === "blockquote_open") depth++;
        if (t.type === "blockquote_close") { depth--; if (depth === 0) { break; } }
        if (t.type === "inline") inner.push(t as unknown as TokenLike);
        j++;
      }
      i = j;
      const html = inner.map((x) => inlineHtml(md, x)).join("<br>");
      if (html.trim()) blocks.push({ t: 6, html });
      continue;
    }

    if (tok.type === "table_open") {
      const head: string[] = [];
      const rows: string[][] = [];
      let row: string[] | null = null;
      let mode: "head" | "body" | null = null;
      for (let j = i; j < tokens.length; j++) {
        const t = tokens[j]!;
        if (t.type === "thead_open") mode = "head";
        if (t.type === "tbody_open") mode = "body";
        if (t.type === "tr_open") row = [];
        if (t.type === "inline") {
          for (const c of t.children ?? []) if (c.type === "text" && row) row.push(c.content);
        }
        if (t.type === "tr_close") { if (row?.length && mode === "head") head.push(...row); else if (row?.length && mode === "body") rows.push(row); row = null; }
        if (t.type === "table_close") { i = j; break; }
      }
      if (head.length || rows.length) {
        const kv = !head.length && rows.every((r) => r.length === 2);
        blocks.push({ t: 5, head, rows, kv: kv || undefined });
      }
      continue;
    }

    if (tok.type === "hr") blocks.push({ t: 8 });
  }

  return { blocks, headings };
}

function shikiBundled(): Record<string, unknown> {
  return bundledLanguages;
}

function textOfChildren(children: Array<{ content?: string }>): string {
  return children.map((c) => c.content ?? "").join(" ").trim();
}

function looksLikeBadge(html: string): boolean {
  return BADGE_RE.test(html);
}

/* ---------------- SSR html -> blocks (post clean-html pages) ---------------- */

export function htmlToBlocks(htmlSrc: string): { blocks: Block[]; headings: Array<{ id: string; level: number; text: string }> } {
  const win = new Window();
  const doc = win.document;
  doc.body.innerHTML = htmlSrc;
  const blocks: Block[] = [];
  const headings: Array<{ id: string; level: number; text: string }> = [];

  const seen = new Set<string>();
  const pushHeading = (el: Element, fallback: string) => {
    const lvl = Number(el.tagName.slice(1)) + 0; // h1..h4
    const text = (el.getAttribute("data-hub-title") ?? el.textContent ?? "").trim();
    if (!text) return;
    const id = el.id || slugify(text);
    if (seen.has(id)) { const n = 2; id2(id, n); }
    function id2(base: string, i: number) {
      while (seen.has(`${base}-${i}`)) i++;
      el.id = `${base}-${i}`;
    }
    seen.add(id);
    headings.push({ id, level: Math.min(lvl, 4), text });
    blocks.push({ t: 1, level: Math.min(lvl, 4) as 2, id, text });
  };

  const inlineOf = (el: Element): string => {
    // clone so live DOM edits do not leak
    const c = el.cloneNode(true) as Element;
    for (const img of Array.from(c.querySelectorAll("img"))) img.remove();
    for (const btn of Array.from(c.querySelectorAll("button,svg"))) btn.remove();
    // strip class attributes copied from the old site (appearance comes from us)
    for (const x of Array.from(c.querySelectorAll("*"))) { x.removeAttribute("class"); x.removeAttribute("style"); }
    return c.innerHTML.replace(/<script[\s\S]*?<\/script>/g, "");
  };

  const walk = (el: Element, depth: number): void => {
    for (const child of Array.from(el.children)) {
      const tag = child.tagName;
      if (/^H[1-4]$/.test(tag)) { pushHeading(child, ""); continue; }
      if (tag === "P") {
        const html = inlineOf(child);
        const imgChild = child.querySelector("img");
        if (imgChild && !child.textContent?.trim()) {
          const src = imgChild.getAttribute("src") ?? "";
          if (src && !BADGE_RE.test(src)) blocks.push({ t: 7, src, alt: imgChild.getAttribute("alt") ?? "" });
          continue;
        }
        if (html.replace(/<[^>]+>/g, "").trim()) blocks.push({ t: 2, html });
        continue;
      }
      if (tag === "PRE") {
        const code = child.querySelector("code");
        const lang = child.getAttribute("data-lang") ?? "text";
        blocks.push({ t: 4, lang, html: child.innerHTML });
        if (code) void code;
        continue;
      }
      if (tag === "TABLE") {
        const head: string[] = [];
        const rows: string[][] = [];
        for (const tr of Array.from(child.querySelectorAll("tr"))) {
          const cells = Array.from(tr.children).map((td) => (td.textContent ?? "").trim());
          if (tr.tagName === "TH" || tr.parentElement?.tagName === "THEAD") { head.push(...cells); continue; }
          rows.push(cells);
        }
        if (head.length || rows.length) {
          const kv = !head.length && rows.length > 0 && rows.every((r) => r.length === 2);
          blocks.push({ t: 5, head, rows, kv: kv || undefined });
        }
        continue;
      }
      if (tag === "UL" || tag === "OL") {
        const items: Array<{ html: string }> = [];
        for (const li of Array.from(child.children)) {
          if (li.tagName !== "LI") continue;
          const nested = li.querySelector("ul,ol");
          if (nested) nested.remove();
          const html = inlineOf(li);
          if (html.replace(/<[^>]+>/g, "").trim()) items.push({ html });
        }
        if (items.length) blocks.push({ t: 3, ordered: tag === "OL", items });
        continue;
      }
      if (tag === "BLOCKQUOTE") { const html = inlineOf(child); if (html.trim()) blocks.push({ t: 6, html }); continue; }
      if (tag === "IMG") {
        const src = child.getAttribute("src") ?? "";
        if (src && !BADGE_RE.test(src)) blocks.push({ t: 7, src, alt: child.getAttribute("alt") ?? "" });
        continue;
      }
      if (tag === "HR") { blocks.push({ t: 8 }); continue; }
      if (/^(DIV|MAIN|ARTICLE|SECTION|SPAN|CENTER|FONT|TABLE-WRAP)$/.test(tag) || tag.includes("TABLE-WRAP")) { walk(child, depth + 1); continue; }
      // unknown container with text -> paragraph
      const html = inlineOf(child);
      if (html.replace(/<[^>]+>/g, "").trim().length > 3) blocks.push({ t: 9, html });
      void depth;
    }
  };
  walk(doc.body as unknown as Element, 0);
  return { blocks, headings };
}
