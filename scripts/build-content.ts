/*
 * build-content.ts — compile vendored markdown from content/repo-slug/… into
 * one shiki-highlighted JSON chunk per repo that the SPA lazy-loads.
 *
 * Inputs:  content/<slug>/**\/*.md, src/data/repos.json
 * Outputs: src/data/content/<slug>.json + src/data/index.ts (typed registry)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, basename as path } from "node:path";
import MarkdownIt from "markdown-it";
import { createHighlighter, bundledThemes, bundledLanguages, type Highlighter } from "shiki";
import { mdToBlocks, htmlToBlocks } from "./blocks";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const CONTENT = join(ROOT, "content");
const META_FILE = join(ROOT, "src/data/repos.json");

/* ------------ presentation metadata (curated) ------------ */
const OVERRIDES: Record<string, { category: string; blurb: string; showInNav?: boolean }> = {
  authcore: { category: "Minecraft Tooling", blurb: "Fabric authentication & anti-abuse framework" },
  statfyr: { category: "Minecraft Tooling", blurb: "Real-time player-stats REST API" },
  ojaj: { category: "Minecraft Tooling", blurb: "OneJumpAllJump - synchronized chaos plugin" },
  echoingdeaths: { category: "Minecraft Tooling", blurb: "Immersive death-curse mechanics" },
  customdamagenumbers: { category: "Minecraft Tooling", blurb: "Animated packet-only damage indicators" },
  "minecraft-eggs": { category: "Hosting Eggs", blurb: "One universal Minecraft egg, 18+ server types" },
  "prog-language-eggs": { category: "Hosting Eggs", blurb: "Run 50+ languages in one container" },
  "database-eggs": { category: "Hosting Eggs", blurb: "One egg, every database under the sun" },
  "shell-eggs": { category: "Hosting Eggs", blurb: "Host any shell, from one panel egg" },
  "potenfyr-nest": { category: "Hosting Eggs", blurb: "Central mirror of every egg collection" },
  "pteroops-mcp": { category: "Security & APIs", blurb: "AI-powered Pterodactyl ops through MCP" },
  vigilfyr: { category: "Security & APIs", blurb: "Guard-rails for AI coding agents" },
  fyrwall: { category: "Security & APIs", blurb: "Clean GUI over UFW & iptables, zero root" },
  linkfyr: { category: "Security & APIs", blurb: "Per-app network control layer" },
  orbynode: { category: "Security & APIs", blurb: "Self-hosted control plane for coding agents" },
  "hbs-tool": { category: "Security & APIs", blurb: "Offline-first config-security review" },
  "discord-botlists": { category: "Discord & Web", blurb: "Ship bot stats to 27 lists, one SDK" },
  web: { category: "Discord & Web", blurb: "Official PotenFYR Studios website" },
};

const CATEGORIES = ["Minecraft Tooling", "Hosting Eggs", "Security & APIs", "Discord & Web"] as const;
const CATEGORY_PITCH: Record<string, string> = {
  "Minecraft Tooling": "Mods, plugins & frameworks for Paper, Spigot and Fabric servers.",
  "Hosting Eggs": "Pterodactyl / Pelican / Feather container eggs that ship in one image.",
  "Security & APIs": "Auth, firewall, agent-guard and config-audit tooling for production.",
  "Discord & Web": "SDKs, bots and web platforms that power the community.",
};

/* RELATIVE per-repo doc hosts -> hub path (already patched by patch-links; safety net) */
const OLD_DOC_HOSTS: Array<[string, string]> = [
  ["docs.potenfyr.in/pteroops-mcp", "/#"],
  ["docs.potenfyr.in/fyrwall", "/#"],
  ["docs.potenfyr.in/vigilfyr", "/#"],
  ["docs.potenfyr.in/orbynode", "/#"],
  ["docs.potenfyr.in/hbs-tool", "/#"],
  ["docs.potenfyr.in/discord-botlists", "/#"],
  ["docs.potenfyr.in/linkfyr", "/#"],
];

/* ------------ markdown-it ------------ */
const md = new MarkdownIt({ html: true, linkify: true, typographer: true, langPrefix: "lang-" });
md.linkify.set({ fuzzyEmail: false, fuzzyLink: false });

const slugCache = new Map<string, string>();
function slugify(text: string): string {
  const t = text.toLowerCase().replace(/[*_`]/g, "").trim();
  let base = t.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "section";
  if (!slugCache.has(base)) return base;
  let i = 2;
  while (slugCache.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

type Heading = { id: string; level: number; text: string };
type Page = { path: string; overview: boolean; title: string; headings: Heading[]; excerpt: string; html: string; blocks: unknown[] };

function listFiles(dir: string): string[] {
  return readdirSync(dir)
    .map((f) => join(dir, f))
    .flatMap((p) => (statSync(p).isDirectory() ? listFiles(p) : p.match(/\.(md|html)$/) ? [p] : []));
}

function pickOverview(paths: string[]): string | undefined {
  return paths.find((p) => /(^|\/)(README|index)$/i.test(p.replace(/\\/g, "/")));
}

function excerptOfText(t: string, max = 170): string {
  return t.replace(/\s+/g, " ").trim().slice(0, max);
}

/*
 * cleanMarkdown - strips the Github-badge noise that screenshots badly inside a
 * styled docs hub: capsule-render banners, typing-SVG walls, shields.io badge
 * rows, komarev/star-history/contrib.rocks embeds, and the <div align="center">
 * wrappers markdown-it would otherwise pass through unparsed (raw text leak).
 */
function cleanMarkdown(src: string): string {
  let s = src;
  // centered banner/badge wrappers are pure noise in the hub
  s = s.replace(/<div align="center">[\s\S]*?<\/div>\n?/gi, "");
  s = s.replace(/<div align=center>[\s\S]*?<\/div>\n?/gi, "");
  s = s.replace(/<p align="center">[\s\S]*?<\/p>\n?/gi, "");
  s = s.replace(/<picture>[\s\S]*?<\/picture>\n?/gi, "");
  // badge-only markdown lines: ![..](badge-url) and [![..](badge-url)](badge-url)
  s = s.replace(/^[^\S\n]*(?:!?\[(?:[^\]\\]|\\.)*\]\([^)]*\)|\[\!\[[^\]]*\]\([^)]*\)\]\([^)]*\))[^\S\n]*\n/gm, (line) =>
    /img\.shields\.io|komarev\.com|ghpvc|star-history|contrib\.rocks|capsule-render|readme-typing|badgen|badge\./i.test(line) ? "" : line);
  // full lines that exist only to render external badge services
  s = s.split("\n").filter((line) => {
    const l = line.trim();
    if (!l) return true;
    if (/capsule-render\.vercel\.app|readme-typing-svg|komarev\.com|contrib\.rocks|api\.star-history\.com/.test(l)) return false;
    return true;
  }).join("\n");
  // collapse 3+ blank lines
  s = s.replace(/\n{3,}/g, "\n\n");
  return s;
}

/* humanized "At a glance" callout prepended to every repo overview page */
function atAGlance(entry: {
  label: string; description: string; repo: string; category: string; blurb: string;
  stars: number; language: string; topics: string[]; pageList: Array<{ path: string; overview: boolean; title: string }>;
}): string {
  const first = entry.pageList.find((p) => !p.overview);
  const clone = `git clone ${entry.repo.replace(/^https?:\/\/(www\.)?/, "https://")}.git`.replace(/^https:\/\/https:\/\//, "https://");
  const lines = [
    `> **At a glance**`,
    `>${entry.blurb ? ` ${entry.blurb}` : ""}`,
    `>`,
    `> - **Category:** ${entry.category}${entry.language ? ` - ${entry.language}` : ""}${entry.stars >= 0 ? ` - ${entry.stars} star${entry.stars === 1 ? "" : "s"}` : ""}`,
    `> - **Source:** [${entry.repo.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}](${entry.repo})`,
    `> - **Clone:** \`${clone}\``,
  ];
  if (first) lines.push(`> - **Start here:** [${first.title}](#/repo/${entry.label}/${first.path === entry.pageList[0]?.path ? entry.pageList[0]!.path : first.path})`);
  return lines.join("\n") + "\n";
}

function excerptOf(mdText: string, max = 170): string {
  const cleaned = mdText
    .replace(/^---[\s\S]*?---/, "") // frontmatter
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, max) + (cleaned.length > max ? "…" : "");
}

function titleOf(text: string, fallback: string): string {
  // first real heading line (skip image-only/badges); cut at the first
  // sentence/table boundary so glued export artifacts don't leak into titles
  for (const line of text.split("\n")) {
    const m = /^#{1,4}\s+(.{2,80})\s*$/.exec(line);
    if (!m) continue;
    let t = m[1]!.replace(/[*_`]/g, "").trim();
    const cut = [t.indexOf(". "), t.indexOf(": "), t.indexOf(" | "), t.indexOf(" 1. ")].filter((c) => c > 8);
    if (cut.length) t = t.slice(0, Math.min(...cut)).trim();
    if (t.length >= 2) return t;
  }
  return fallback;
}

/* link resolver: relative .md links -> SPA routes (#/repo/<slug>/<path>) */
function resolveInternalLinks(text: string, slug: string, filePath: string): string {
  return text.replace(/\]\(([^)#\s]+\.md)((#[^)\s]*)?)\)/g, (_m0, linkTarget: string, anchor: string) => {
    let target = linkTarget.replace(/^\.\//, "").replace(/\.md$/, "");
    const base = dirname(filePath.replace(/\\/g, "/"));
    const parts = target.split("/");
    let ups = 0;
    while (parts[0] === "..") { ups++; parts.shift(); }
    const baseParts = base && base !== "." ? base.split("/") : [];
    const norm = baseParts.slice(0, Math.max(0, baseParts.length - ups)).concat(parts).join("/").replace(/\\/g, "/");
    return `](#/repo/${slug}/${norm}${anchor ?? ""})`;
  });
}

/* rewrite github.com links stay as-is; container slugs come from CONTENT dirlisting */

  const slugs = readdirSync(CONTENT).filter((d) => statSync(join(CONTENT, d)).isDirectory()).sort();
async function main() {
  /* collect every code fence language actually used so shiki loads them once */
  const allFiles = slugs.flatMap((s) => listFiles(join(CONTENT, s)));
  const fenceLangs = new Set<string>();
  for (const f of allFiles) {
    for (const m of readFileSync(f, "utf8").matchAll(/```([a-zA-Z0-9_+-]+)/g)) fenceLangs.add(m[1]!.toLowerCase());
  }
  const loadable = [...fenceLangs].filter((l) => l in bundledLanguages);
  const highlighter = await createHighlighter({
    themes: ["vitesse-dark"],
    langs: loadable.length ? (loadable as never) : (["text"] as never),
  });

  const meta: Record<string, any> = JSON.parse(readFileSync(META_FILE, "utf8"));

  /** render one file */
  async function buildPage(fileAbs: string, slug: string): Promise<Page> {
    const raw = readFileSync(fileAbs, "utf8");
    if (fileAbs.endsWith(".html")) {
      const rel = relative(join(CONTENT, slug), fileAbs).replace(/\\/g, "/");
      const base = path(fileAbs, ".html");
      const filenameTitle = base.split("-").map(w => (w.match(/^\d+$/) ? w : w[0]!.toUpperCase() + w.slice(1))).join(" ");
      const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(raw);
      const title = (h1 ? h1[1]!.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, "\"").replace(/\s+/g, " ").trim() : "") || filenameTitle;
      let html = raw;
      html = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<link[^>]+>/g, "");
      const headings: Heading[] = [];
      const seen = new Set<string>();
      html = html.replace(/<h([23])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g, (m0, lvl, id, inner) => {
        const text = inner.replace(/<[^>]+>/g, "").trim();
        let uid = id || slugify(text);
        let i = 2;
        while (seen.has(uid)) uid = (id || slugify(text)) + "-" + i++;
        seen.add(uid);
        headings.push({ id: uid, level: Number(lvl) + 1, text });
        return m0.replace(/id="[^"]*"/, `id="${uid}"`);
      });
      const excerptOfHtml = () => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 170);
      const b = htmlToBlocks(html);
      return { path: rel, overview: false, title, headings: b.headings, excerpt: excerptOfHtml(), html, blocks: b.blocks };
    }
    let src = raw;
    const rel = relative(join(CONTENT, slug), fileAbs).replace(/\.md$/, "").replace(/\\/g, "/");
    const overview = /(^|\/)(README|index)$/i.test(rel);
    src = cleanMarkdown(src);
    src = resolveInternalLinks(src, slug, rel);
    for (const [host, hubPath] of OLD_DOC_HOSTS) {
      src = src.split(`https://${host}`).join(hubPath);
    }

    const headings: Heading[] = [];
    const seenIds = new Set<string>();
    const beforeOpen = md.renderer.rules.heading_open?.bind(md.renderer.rules);
    md.renderer.rules.heading_open = (tokens, idx, opts, env, self) => {
      const level = Number(tokens[idx]!.tag!.slice(1));
      const text = (tokens[idx + 1]?.content ?? "").trim();
      let id = slugify(text);
      let i = 2;
      while (seenIds.has(id)) id = `${slugify(text)}-${i++}`;
      seenIds.add(id);
      headings.push({ id, level, text });
      const rendered = self.renderToken(tokens, idx, opts);
      return rendered.replace(/>$/, ` id="${id}">`);
    };

    let html = md.render(src);
    if (beforeOpen) md.renderer.rules.heading_open = beforeOpen;

    html = html.replace(/<table>/g, '<div class="pp-table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
    html = html.replace(/<li><input /g, '<li class="pp-task"><input ');

    html = html.replace(/<pre([^>]*)><code class="(lang-([^"]+))"[\s\S]*?<\/code><\/pre>/g, (m0, attrs: string | undefined, _cls: string, langRaw: string, ...rest) => {
      void rest;
      const lang = (langRaw || "text").toLowerCase() as keyof typeof bundledLanguages;
      const mCode = /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/.exec(m0);
      const codeHtml = mCode?.[1] ?? "";
      const decoded = codeHtml
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
      const out = highlighter.codeToHtml(decoded, {
        lang: lang in bundledLanguages ? lang : "text",
        theme: "vitesse-dark",
      });
      void attrs;
      return out.replace(/<pre /, `<pre data-lang="${lang in bundledLanguages ? lang : "text"}" `);
    });
    // ?? mark: placeholder for shiki html path kept as html only

    return {
      path: rel,
      overview,
      title: overview ? "Overview" : titleOf(src, rel),
      headings,
      excerpt: excerptOf(src),
      html,
      blocks: mdToBlocks(src, md, highlighter).blocks,
    };
  }

  const registry: any = { generatedAt: new Date().toISOString(), categories: CATEGORIES, categoryPitch: CATEGORY_PITCH, repos: [] };
  let totalPages = 0;

  mkdirSync(join(ROOT, "src/data/content"), { recursive: true });
  rmSync(join(ROOT, "src/data/index.ts"), { force: true });

  for (const slug of slugs) {
    const m = meta[slug] ?? {
      name: slug, label: slug, repo: `https://github.com/PotenFYR-Studios/${slug}`,
      description: "", stars: 0, language: "", topics: [], pushedAt: null,
    };
    const files = listFiles(join(CONTENT, slug)).sort();
    // prefer README.md when both README and index exist at the repo root
    const hasReadme = files.some((f) => /(^|\/)README\.md$/i.test(f));
    const filtered = hasReadme ? files.filter((f) => !/(^|\/)index\.md$/i.test(f)) : files;
    const pages: Page[] = [];
    for (const f of filtered) pages.push(await buildPage(f, slug));
    totalPages += pages.length;

    const overviewIdx = pickOverview(pages.map((p) => p.path));
    const entry = {
      slug,
      label: m.label ?? slug,
      description: m.description ?? "",
      repo: m.repo ?? `https://github.com/PotenFYR-Studios/${slug}`,
      stars: m.stars ?? 0,
      language: m.language ?? "",
      topics: m.topics ?? [],
      pushedAt: m.pushedAt ?? null,
      category: OVERRIDES[slug]?.category ?? "Security & APIs",
      blurb: OVERRIDES[slug]?.blurb ?? m.description ?? "",
      default: overviewIdx ?? pages[0]?.path ?? null,
      pageList: pages.map((p) => ({ path: p.path, overview: p.overview, title: p.title, headings: p.headings })),
    };
    /* humanized At-a-glance callout on every overview page */
    if (entry.default) {
      const ov = pages.find((p) => p.path === entry.default);
      if (ov) ov.html = md.render(atAGlance({ ...entry, pageList: entry.pageList })) + ov.html;
    }
    writeFileSync(join(ROOT, "src/data/content", `${slug}.json`), JSON.stringify({ slug, pages }, null, 0));
    registry.repos.push(entry);
  }
  registry.stats = { repos: registry.repos.length, pages: totalPages, bytes: contentBytes() };

  writeFileSync(join(ROOT, "src/data/index.ts"), typedRegistryTs());
  writeFileSync(join(ROOT, "src/data/registry.json"), JSON.stringify(registry, null, 2));
  console.log(`✓ ${registry.repos.length} repos · ${totalPages} pages · registry.json + ${slugs.length} chunks`);

  function contentBytes() {
    return registry.repos.reduce((acc: number, r: any) => acc + (r.pageList?.length ?? 0), 0);
  }
  function typedRegistryTs() {
    /* the client imports registry.json directly; TS wrapper provides types */
    return `import registryJson from "./registry.json";
import reposJson from "./repos.json";
export const registry = registryJson as unknown as Registry;
export const reposMeta = reposJson as unknown as Record<string, RepoMeta>;
export type RepoMeta = {
  name: string; label: string; repo: string; description: string; stars: number;
  language: string; topics: string[]; pushedAt: string | null; defaultBranch: string;
};
export type Heading = { id: string; level: number; text: string };
export type PageEntry = { path: string; overview: boolean; title: string };
export type PageMeta = { path: string; overview: boolean; title: string; headings: Heading[] };
export type RepoEntry = {
  slug: string; label: string; description: string; repo: string; stars: number;
  language: string; topics: string[]; pushedAt: string | null;
  category: string; blurb: string; default: string | null; pageList: PageMeta[];
};
export type Registry = {
  generatedAt: string;
  categories: string[];
  categoryPitch: Record<string, string>;
  repos: RepoEntry[];
  stats: { repos: number; pages: number };
};
export async function loadRepoContent(slug: string): Promise<{ slug: string; pages: (PageEntry & { html: string; excerpt: string })[] }> {
  return (await import(\`./content/\${slug}.json\`)) as never;
}
`;
  }
  function sync(x?: unknown) { return x; }
}

main().catch((e) => { console.error(e); process.exit(1); });
