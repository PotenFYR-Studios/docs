/*
 * clean-html.ts — run over content/**\/*.html once:
 *   • removes the retired doc sites' chrome (<header>/<nav>/<aside>/<footer>,
 *     .sidebar/.crumb rails) that the SSR capture accidentally kept;
 *   • unwraps layout-shell divs so pages start with real content;
 *   • strips abs-link/script leftovers;
 *   • replaces em/en dashes with hyphens (house rule: no em dashes anywhere).
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { Window } from "happy-dom";

const CONTENT = join(new URL("..", import.meta.url).pathname.replace(/\/$/, ""), "content");

const CHROME_SELECTORS = [
  "header", "nav", "aside", "footer", "dialog",
  ".sidebar", ".sidebar-rail", ".side-group", ".side-group-btn", ".side-group-body",
  ".side-link", ".docs-sidebar", ".crumb", ".topbar", ".top-nav", ".site-header", ".site-footer",
  ".navbar", ".menu",
  "link", "script", "meta", "title",
].join(",");

const SHELL_CLASS_RE = /(min-h-screen|layout|shell|wrapper|container|docs-content|page|grid-cols|app-root|root)/i;

function clean(html: string): { html: string; removed: number } {
  const win = new Window();
  const doc = win.document;
  doc.body.innerHTML = html;
  let removed = 0;

  for (const el of Array.from(doc.body.querySelectorAll(CHROME_SELECTORS))) {
    el.remove();
    removed++;
  }

  // unwrap shell divs: repeatedly replace top-level divs whose class looks like
  // a layout shell with their children (keeps semantic content nodes).
  const isShell = (el: Element) =>
    el.tagName === "DIV" && SHELL_CLASS_RE.test(el.getAttribute("class") ?? "")
    && !/(?<!-)pp-md/.test(el.getAttribute("class") ?? "");

  for (let pass = 0; pass < 6; pass++) {
    let changed = false;
    for (const el of Array.from(doc.body.children as unknown as Element[])) {
      if (isShell(el)) {
        const frag = doc.createDocumentFragment();
        for (const child of Array.from(el.childNodes as unknown as import("happy-dom").Node[])) frag.appendChild(child);
        el.replaceWith(frag as unknown as Node);
        changed = true;
        removed++;
      } else if ((el as HTMLElement).tagName === "SPAN" && (el as HTMLElement).textContent === "") {
        (el as HTMLElement).remove();
        changed = true;
      }
    }
    if (!changed) break;
  }

  // ..empty leftovers
  for (const el of Array.from(doc.body.children)) {
    if (!el.textContent?.trim() && !el.querySelector("table,pre,img,code,h1,h2,h3")) el.remove();
  }

  const dashFixed = (n: Element) => {
    for (const node of Array.from(n.childNodes)) {
      if (node.nodeType === 3) {
        const v = (node as Text).data;
        if (/[\u2014\u2013]/.test(v)) {
          const fixed = v.replace(/\s*[\u2014\u2013]\s*/g, " - ");
          (node as Text).data = fixed;
          removed++;
        }
      } else if (node.nodeType === 1) dashFixed(node as Element);
    }
  };
  dashFixed(doc.body as unknown as Element);

  const out = doc.body.innerHTML.replace(/\s*[\u2014\u2013]\s*/g, " - ");
  return { html: out, removed };
}

const w = (dir: string): string[] =>
  readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? w(p) : p.endsWith(".html") ? [p] : [];
  });

let edits = 0;
for (const file of w(CONTENT)) {
  const before = readFileSync(file, "utf8");
  const { html, removed } = clean(before);
  if (html !== before) {
    writeFileSync(file, html);
    edits++;
    console.log(`${file.replace(CONTENT + "/", "")} (${removed} removals)`);
  }
}
console.log(`cleaned ${edits} pages`);
