/* types.ts-data access layer over the generated registry + per-repo chunks */

import registryRaw from "./registry.json";
import reposRaw from "./repos.json";

export type Heading = { id: string; level: number; text: string };
export type PageMeta = { path: string; overview: boolean; title: string; headings: Heading[] };
export type RepoEntry = {
  slug: string;
  label: string;
  description: string;
  repo: string;
  stars: number;
  language: string;
  topics: string[];
  pushedAt: string | null;
  category: string;
  blurb: string;
  default: string | null;
  pageList: PageMeta[];
};
export type Registry = {
  generatedAt: string;
  categories: string[];
  categoryPitch: Record<string, string>;
  repos: RepoEntry[];
  stats: { repos: number; pages: number };
};
export type RepoMeta = { name: string; label: string; repo: string; description: string; stars: number; language: string; topics: string[]; pushedAt: string | null; defaultBranch: string };
export type LoadedPage = { path: string; overview: boolean; title: string; headings: Heading[]; excerpt: string; html: string };

export const registry = registryRaw as unknown as Registry;
export const reposMeta = reposRaw as unknown as Record<string, RepoMeta>;
export function repoBySlug(slug: string): RepoEntry | undefined {
  return registry.repos.find((r) => r.slug === slug);
}

export async function loadRepoContent(slug: string): Promise<{ slug: string; pages: LoadedPage[] }> {
  const mod = (await import(`./content/${slug}.json`)) as unknown as { default: { slug: string; pages: LoadedPage[] } } & { slug: string; pages: LoadedPage[] };
  return (mod.default ?? mod) as { slug: string; pages: LoadedPage[] };
}

const dashless = (s: string) => s.replace(/-/g, "").toLowerCase();

export function pageByPath(repo: RepoEntry, path: string | undefined): PageMeta {
  const clean = (path ?? "").replace(/\.md$/, "").replace(/\.html$/, "").toLowerCase();
  if (!clean || clean === "index") {
    return repo.pageList.find((p) => p.path === repo.default) ?? repo.pageList[0]!;
  }
  const direct = repo.pageList.find((p) => p.path.toLowerCase() === clean
    || p.path.toLowerCase() === clean + (/\.html?$/.test(p.path) ? "" : ""));
  if (direct) return direct;
  // dash-insensitive fallback so old site URLs (getting-started) match
  // SSR-captured pages often named gettingstarted(.html)
  const dl = dashless(clean);
  const fuzzy = repo.pageList.find((p) => dashless(p.path.replace(/\.(md|html)$/, "")) === dl)
    ?? repo.pageList.find((p) => dashless(p.path.replace(/\.(md|html)$/, "")).endsWith(dashless(clean.split("/").pop() ?? "")));
  if (fuzzy) return fuzzy;
  return repo.pageList.find((p) => p.path === repo.default) ?? repo.pageList[0]!;
}

/* flat search index used by the deck + browser find */
export const SEARCH_INDEX: Array<{ repo: string; path: string; title: string; kind: string }> = registry.repos.flatMap((r) =>
  r.pageList.map((p) => ({ repo: r.slug, path: p.path, title: p.title, kind: r.category }))
);
