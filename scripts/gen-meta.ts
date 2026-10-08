import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const raw = execSync(
  'gh api "orgs/PotenFYR-Studios/repos?per_page=100" --jq \'[.[] | {name, description, stargazers_count, language, topics, homepage_url: .homepage, archived, fork, default_branch, pushed_at}]\'',
  { encoding: "utf8" }
);
const repos = JSON.parse(raw).filter((r: any) => !r.fork);
const meta: Record<string, any> = {};
const slug = (n: string) => n.toLowerCase().replace(/^\./, "").replace(/-studios$/, "");
// .github => treat as org-profile, skip; map homepages/domains
const skip = new Set([".github", "docs"]);
for (const r of repos) {
  if (skip.has(r.name)) continue;
  meta[slug(r.name)] = {
    name: slug(r.name),
    label: r.name === ".web" ? "PotenFYR Studio Website" : r.name,
    repo: `https://github.com/PotenFYR-Studios/${r.name}`,
    description: r.description ?? "",
    stars: r.stargazers_count,
    language: r.language ?? "",
    topics: (r.topics ?? []).slice(0, 6),
    pushedAt: r.pushed_at,
    defaultBranch: r.default_branch,
  };
}
mkdirSync(join(ROOT, "src/data"), { recursive: true });
writeFileSync(join(ROOT, "src/data/repos.json"), JSON.stringify(meta, null, 2));
console.log("repos.json written:", Object.keys(meta).length, "repos");
