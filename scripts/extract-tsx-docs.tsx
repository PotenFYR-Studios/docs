/*
 * extract-tsx-docs.ts — one-shot migration: server-render each repo's own
 * React doc-site pages into static HTML chunks the hub can serve, so no doc
 * content is lost when the per-repo `docs/` sites are removed upstream.
 *
 * Run per repo:  bunx --bun tsx ... is NOT needed — bun executes TSX natively:
 *   cd <repo>/docs && bun run /mnt/hdd/Github-Repo/docs/scripts/extract-one.tsx <outDir>
 * (script runs inside the repo's docs/ dir so its own node_modules resolve)
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as path from "node:path";
import * as fs from "node:fs";

const OUT = process.env.EXTRACT_OUT ?? "/tmp/pp-docs-out";
fs.mkdirSync(OUT, { recursive: true });

const pageDirs = ["src/pages", "src/docs"];
function listPages(): string[] {
  const out: string[] = [];
  for (const dir of pageDirs) {
    const abs = path.resolve(dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (/\.(tsx|ts)$/.test(f) && !/index|main|App|entry-server|SeoManager|bits|bits\.ts|bits\.tsx|chrome|ui|layout|magicui|site|router|content2?\.tsx?/.test(f))
        out.push(path.join(abs, f));
    }
  }
  return [...new Set(out)];
}

let pageCount = 0;
const pagesToExtract = listPages();

async function renderModule(modPath: string) {
  const base = path.basename(modPath).replace(/\.(tsx|ts)$/, "").toLowerCase();
  const mod = (await import(`file://${modPath}`)) as Record<string, unknown>;

  const render = async (value: unknown, outName: string): Promise<void> => {
    if (typeof value !== "function") return;
    try {
      const html = renderToStaticMarkup(React.createElement(value as React.FC, {}));
      if (!html) return;
      const file = path.join(OUT, outName + ".html");
      fs.writeFileSync(file, html);
      pageCount++;
      console.log(`✓ ${file} (${html.length} b)`);
    } catch (e) {
      console.error(`!! ${path.basename(modPath)}:${outName} → ${(e as Error).message}`);
    }
  };

  // default export first, then every named component export
  await render((mod as { default?: unknown }).default, base);
  for (const [name, value] of Object.entries(mod)) {
    if (!/^[A-Z][A-Za-z0-9]+$/.test(name)) continue; // component-shaped names only
    await render(value, name.toLowerCase());
  }
}


for (const p of pagesToExtract) {
  try {
    await renderModule(p);
  } catch (e) {
    console.error(`!! module ${p} → ${(e as Error).message}`);
  }
}
console.log(`\ndone: ${pageCount} pages → ${OUT}`);
