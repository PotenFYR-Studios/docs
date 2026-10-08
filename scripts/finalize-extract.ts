/*
 * finalize-extract.ts — post-process the SSR'd pages from the per-repo docs
 * sites and vendor them into content/<slug>/ alongside the existing markdown.
 *
 *  • drops landing/home/about/etc duplicates (README covers those)
 *  • kebab-cases page names
 *  • rewrites internal hrefs (/docs/x.html, /about/, site routes) → hub routes
 *  • strips external stylesheet/script tags from prebuilt HTML (AuthCore)
 *  • AuthCore's absolute *.docs.potenfyr.in links → hub
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT_ROOT = "/tmp/pp-docs";
const HUB = process.env.HUB_ROOT ?? new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const CONTENT = join(HUB, "content");

const REPOS: Record<string, { skip: Set<string>; siteRoutes: string[] }> = {
  "authcore": { skip: new Set(["index"]), siteRoutes: [] },  // docs/app/content/*.html handled separately
  "statfyr": { skip: new Set(["landing", "home", "docsportal"]), siteRoutes: ["docs", "commands", "api", "configuration", "integrations", "placeholders", "analytics", "examples", "faq", "about", "license"] },
  "ojaj": { skip: new Set(["landing", "home", "about"]), siteRoutes: ["getting_started", "gettingstarted", "gameplay", "commandspermissions", "configuration", "examples", "faq"] },
  "echoingdeaths": { skip: new Set(["landing", "home", "about"]), siteRoutes: ["docsportal", "gettingstarted", "curses", "examples", "configuration", "commandspermissions"] },
  "minecraft-eggs": { skip: new Set(["home", "about"]), siteRoutes: ["docs", "eggs", "examples", "servertypes", "license"] },
  "database-eggs": { skip: new Set(["home", "about"]), siteRoutes: ["docs", "eggs", "examples"] },
  "shell-eggs": { skip: new Set(["home", "about"]), siteRoutes: ["docs", "examples", "install", "license", "variablespage"] },
  "discord-botlists": { skip: new Set(["home", "about"]), siteRoutes: ["docs", "examples", "status", "license"] },
  "linkfyr": { skip: new Set(["home", "notfound"]), siteRoutes: ["docs"] },
  "hbs-tool": { skip: new Set(["home", "about"]), siteRoutes: ["docs", "examples", "license", "dashboard", "extractor", "first-scan", "getting-started", "security-model", "testcases", "validation"] },
  "customdamagenumbers": { skip: new Set(["home", "about"]), siteRoutes: ["docs", "examples", "license"] },
};

function kebab(s: string): string {
  // camelCase → kebab (gettingStarted → getting-started)
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").replace(/\.[a-z]+$/, "").toLowerCase();
}
function titleize(s: string): string {
  return s.split("-").map(w => (w.match(/^\d+$/) ? w : w[0]!.toUpperCase() + w.slice(1))).join(" ");
}

let total = 0;
const writtenBy: Record<string, string[]> = {};

/* ---- threshold all SSR pages ---- */
for (const [slug, cfg] of Object.entries(REPOS)) {
  const dir = OUT_ROOT + "-" + slug;
  let listing: string[] = [];
  try { listing = readdirSync(dir); } catch { /* no extracted dir */ }
  if (!listing.length && slug !== "authcore") { console.log("no extracted pages:", slug); continue; }
  mkdirSync(join(CONTENT, slug), { recursive: true });
  const pages: string[] = [];
  for (const f of listing.filter(x => x.endsWith(".html"))) {
    const base = kebab(f.replace(/\.html$/, ""));
    if (cfg.skip.has(base)) continue;
    // AuthCore versioned-URL pages land here through the normal flow
    let html = readFileSync(join(dir, f), "utf8");
    html = html.replace(/<script[\s\S]*?<\/script>/g, "");
    html = html.replace(/<link[^>]+>/g, "");
    html = html.replace(/<div id="authcore-versionbar"><\/div>/g, "");
    const outName = base.endsWith("-page") ? base.slice(0, -5) : base;
    writeFileSync(join(CONTENT, slug, outName + ".html"), html);
    pages.push(outName);
    total++;
  }
  writtenBy[slug] = pages;
}

/* ---- AuthCore prebuilt HTML content pages ---- */
{
  const slug = "authcore";
  const src = (process.env.EXTRACT_AUTHCORE_CONTENT ?? "/mnt/hdd/Github-Repo/AuthCore/docs/app/content");
  const pages: string[] = [];
  for (const f of readdirSync(src).filter(x => x.endsWith(".html"))) {
    const base = kebab(f.replace(/\.html$/, ""));
    if (cfg_skip(base)) continue;
    function cfg_skip(b: string) { return b === "index"; }
    let html = readFileSync(join(src, f), "utf8");
    html = html.replace(/<script[\s\S]*?<\/script>/g, "");
    html = html.replace(/<link[^>]+>/g, "");
    html = html.replace(/<div id="authcore-versionbar"><\/div>/g, "");
    html = html.replace(/https:\/\/authcore\.docs\.potenfyr\.in\/docs\/[\d.]+\/([a-z]+)\.html/g, "/#/repo/authcore/$1");
    html = html.replace(/\/docs\/[\d.]+\/([a-z]+)\.html/g, "/#/repo/authcore/$1");
    html = html.replace(/\/assets\/(site\.css|docs\.js|nav\.js|icons\/[^"]*)/g, "");
    writeFileSync(join(CONTENT, slug, base + ".html"), html);
    pages.push(base);
    total++;
  }
  writtenBy[slug] = (writtenBy[slug] ?? []).concat(pages);
}

/* ---- link rewriter pass over all injected html (and stale md) ---- */
for (const [slug, cfg] of Object.entries(REPOS)) {
  if (!writtenBy[slug]?.length) continue;
  for (const f of readdirSync(join(CONTENT, slug)).filter(x => x.endsWith(".html"))) {
    const p = join(CONTENT, slug, f);
    let html = readFileSync(p, "utf8");
    // internal /docs/<page>(.html|/) → hub route
    html = html.replace(/(href|HREF)="\/docs\/([a-z0-9\/\-_.]+?)(\.html)?(\/)?"/gi, (m0, attr: string, target: string) => {
      const clean = target.replace(/^\//, "").replace(/\/$/, "").replace(/\.html$/, "");
      const kebabClean = kebab(clean);
      // versioned docs urls: /docs/1.0.1/api-reference → latest section page names
      const mapped = clean.match(/^\d+\.\d+\.\d+\/(.+)$/) ? kebab(clean.split("/")[1]!) : kebabClean;
      return `${attr}="#/repo/${slug}/${mapped}"`;
    });
    // site-local routes (/, /about/, /eggs/…) only for confident matches
    for (const route of cfg.siteRoutes) {
      const kebabRoute = kebab(route);
      html = html.replace(new RegExp(`(href|HREF)="(/)(${kebabRoute})(\\.html|/|)"`, "gi"), `$1="#/repo/${slug}/${kebabRoute}"`);
    }
    html = html.replace(/(href)="\/?"/gi, `$1="#/"`);
    writeFileSync(p, html);
  }
}

/* summary */
for (const [slug, pages] of Object.entries(writtenBy)) {
  pages.sort();
  console.log(`${slug}: ${pages.length} pages → ${pages.join(", ")}`);
}
console.log(`total vendored html pages: ${total}`);
