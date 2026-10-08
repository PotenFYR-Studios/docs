import registryJson from "./registry.json";
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
  return (await import(`./content/${slug}.json`)) as never;
}
