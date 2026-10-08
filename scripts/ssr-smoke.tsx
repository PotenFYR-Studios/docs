/*
 * ssr-smoke.tsx — server-renders every hub route component through Bun's
 * native TSX pipeline: catches render-time crashes without a browser.
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { RouterCtx, useRouter } from "~/router";
import { AppProvider } from "~/app-store";
import { Home } from "~/home";
import { ReposIndex } from "~/repos";
import { NotFound } from "~/notfound";
import { Deck } from "~/deck";
import { Navbar, Footer } from "~/chrome";
import { repoBySlug, registry } from "~/data/types";

function Shell({ path, children }: { path: string; children: React.ReactNode }) {
  const router = { path, navigate: () => {} };
  return (
    <AppProvider>
      <RouterCtx.Provider value={router}>{children}</RouterCtx.Provider>
    </AppProvider>
  );
}

const cases: Array<[string, () => React.ReactElement]> = [
  ["Home", () => <Shell path="/"><Home /></Shell>],
  ["ReposIndex", () => <Shell path="/repos"><ReposIndex /></Shell>],
  ["NotFound", () => <Shell path="/bogus-route"><NotFound /></Shell>],
  ["Navbar+Footer", () => <Shell path="/"><Navbar /><Footer /></Shell>],
  ["Deck", () => <Shell path="/"><Deck /></Shell>],
];

for (const r of ["authcore", "statfyr", "ojaj", "echoingdeaths", "minecraft-eggs", "database-eggs", "shell-eggs", "discord-botlists", "linkfyr", "hbs-tool", "vigilfyr", "fyrwall", "orbynode", "pteroops-mcp", "customdamagenumbers", "potenfyr-nest", "web"]) {
  void r;
}

let ok = 0, fail = 0;
for (const [name, fn] of cases) {
  try {
    const html = renderToStaticMarkup(fn());
    ok++;
    console.log(`✓ ${name} (${html.length} b)`);
  } catch (e) {
    fail++;
    console.error(`✗ ${name}: ${(e as Error).message}\n  ${(e as Error).stack?.split("\n").slice(0, 3).join("\n  ")}`);
  }
}

// data-layer sanity instead of full RepoDoc (which lazy-imports JSON chunks)
for (const slug of registry.repos.map(r => r.slug)) {
  const repo = repoBySlug(slug);
  if (!repo || !repo.pageList.length || !repo.default) { fail++; console.error(`✗ data(${slug}) incomplete entries`); continue; }
  ok++;
}
console.log(`✓ data(${registry.repos.length} repos wired)`)

console.log(`\nSSR smoke: ${ok} ok, ${fail} failed`);
