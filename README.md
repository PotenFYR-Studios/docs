<!-- markdownlint-disable -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4fa3ec,55:b6dcff,100:0a0d14&height=200&section=header&text=PotenFYR%20Docs&fontSize=50&fontColor=ffffff&fontAlignY=35&desc=The%20unified%20documentation%20engine%20for%20every%20public%20PotenFYR-Studios%20repo&descSize=17&descAlignY=56&animation=twinkling" width="100%" alt="PotenFYR Docs banner"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&pause=1300&color=4FA3EC&center=true&vCenter=true&width=760&lines=One+engine+%C2%B7+18+repos+%C2%B7+190+doc+pages;Served+from+docs.potenfyr.in;Vite+%2B+React+%2B+TypeScript+%2B+Bun;Dark+sky-blue%2C+ROG-flavored%2C+with+eggs+%F0%9F%A5%9A)](https://docs.potenfyr.in)

[![Docs](https://img.shields.io/badge/Hub-docs.potenfyr.in-4fa3ec?style=for-the-badge&logo=githubpages&logoColor=white&labelColor=1c1e26)](https://docs.potenfyr.in)
[![Source](https://img.shields.io/badge/Repo-PotenFYR--Studios%2Fdocs-8b5cf6?style=for-the-badge&logo=github&logoColor=white&labelColor=1c1e26)](https://github.com/PotenFYR-Studios/docs)
[![Stack](https://img.shields.io/badge/Stack-Vite%20%C2%B7%20React%20%C2%B7%20TS%20%C2%B7%20Bun-f97316?style=for-the-badge&logo=vite&logoColor=white&labelColor=1c1e26)](#architecture)
[![Stars](https://img.shields.io/github/stars/PotenFYR-Studios/docs?style=for-the-badge&logo=github&labelColor=1c1e26&color=f97316)](https://github.com/PotenFYR-Studios/docs/stargazers)
[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?style=for-the-badge&logo=discord&logoColor=white&labelColor=1c1e26)](https://discord.gg/zUaN2FPBec)
[![View](https://komarev.com/ghpvc/?username=PotenFYR-Studios-docs&color=ec4899&style=for-the-badge&label=VIEW&labelColor=1c1e26)](https://github.com/PotenFYR-Studios/docs)

<p align="center">
  <b>The single source of truth for PotenFYR documentation.</b><br>
  Every public repo under PotenFYR-Studios has its docs vendored into this repo, compiled into one
  dark, sky-blue SPA, and served on <a href="https://docs.potenfyr.in"><b>docs.potenfyr.in</b></a> — no more
  scattered <code>docs/</code> trees or per-repo Pages sites to keep in sync.
</p>

</div>

## 📑 Contents

<details open>
<summary><b>Click to expand / collapse contents</b></summary>

- [Why a hub?](#why-a-hub)
- [The covered toolchain](#the-covered-toolchain)
- [Repo catalog](#repo-catalog)
- [Getting started](#getting-started)
- [Architecture](#architecture)
- [Docs as data — how content flows](#docs-as-data-how-content-flows)
- [Theming — the ROG palette](#theming-the-rog-palette)
- [Easter eggs](#easter-eggs)
- [Deploying changes](#deploying-changes)
- [Contributing docs](#contributing-docs)
- [Repository conventions](#repository-conventions)
- [FAQ](#faq)
- [License](#license)

</details>

---

## 🧭 Why a hub?

Before this repo existed, PotenFYR documentation lived everywhere: full `docs/`
trees inside five repos, standalone Vite sites inside two more, READMEs doing
double duty on a dozen others, and one-off GitHub Pages deployments per repo.
Nineteen URLs, four build stacks, a dozen CI jobs — all saying roughly the same
thing in different fonts.

That model breaks quietly: install one-liners go stale, a README edit in
`VigilFYR` never reaches the FYRwall user who actually needs the same fix, and
every new repo adds another stack to babysit.

This hub answers with a simple rule:

> **This repo is the only place docs live. Everything else is a mirror that
> points here.**

One pipeline, one visual language, one deploy. A new repo joining the org needs
a README and one line in the catalog table below — not a documentation project.

---

## 🧰 The covered toolchain

Everything you'd reach for is in here, loudly:

| Layer | What ships | Where it runs |
|---|---|---|
| **Rendering** | `markdown-it` (GFM tables, tasklists, link rewriting) | build-time, Bun |
| **Code highlighting** | `shiki` v4 (vitesse-dark, lazy grammar loading) | build-time, Bun |
| **Docs → JSON** | 190 highlighted-inlined pages (vendored markdown + SSR-captured TSX doc sites), per-repo code-split chunks | build output |
| **SPA routing** | tiny history-API router + generated `404.html` deep-link redirect | runtime |
| **Data types** | hand-typed large aggregates (registry + per-repo chunks) | runtime |
| **Motion** | `framer-motion` + ~20 hand-rolled Magic-UI-style components | runtime |
| **Styling** | Tailwind v4 theme tokens (`@theme`), zero runtime CSS-in-JS | build-time |
| **Fonts** | self-hosted Inter / JetBrains Mono / Space Grotesk (`woff2`, ~140 KB) | build-time |
| **State** | one 60-line React context store — no Redux, no Zustand | runtime |
| **Icons** | `lucide-react`, one custom brand mark (`GithubMark`) | runtime |

Nothing at *runtime* talks to the network — every page you can visit is
already type-checked JSON.

---

## 📦 Repo catalog

All 18 public repos under PotenFYR-Studios are indexed automatically from the
GitHub API plus a curated presentation table in [`scripts/build-content.ts`](scripts/build-content.ts).
Current totals: **18 repos · 190 doc pages · 4 categories**.

| Category | Repos | Blurb |
|---|---|---|
| **Minecraft Tooling** | `AuthCore`, `statfyr`, `ojaj`, `EchoingDeaths`, `CustomDamageNumbers` | Mods, plugins & auth frameworks for Paper, Spigot & Fabric |
| **Hosting Eggs** | `Minecraft-Eggs`, `Prog-Language-Eggs`, `Database-Eggs`, `Shell-Eggs`, `potenfyr-nest` | Pterodactyl / Pelican / Feather container eggs |
| **Security & APIs** | `VigilFYR`, `FYRwall`, `OrbyNode`, `PteroOps-MCP`, `LinkFYR`, `HBS-Tool` | Agent guard-rails, firewall GUIs, MCP servers, config audits |
| **Discord & Web** | `discord-botlists`, `.web` | Multi-botlist SDK, the PotenFYR website itself |

Adding a repo is one line of effort — drop `content/<slug>/README.md`, add a
`blurb` + `category` override in `OVERRIDES`, and build. The rest (route, cards,
search, catalog grid, terminal `ls/open` support) is automatic.

---

## 🚀 Getting started

Prereqs: [Bun](https://bun.sh) ≥ 1.4, and `gh` authenticated (`gh auth login`) —
both used at build-time only.

```bash
# clone & install
git clone https://github.com/PotenFYR-Studios/docs
cd docs && bun install

# regenerate repo metadata (stars, descriptions, topics) from the GitHub API
bun run sync

# compile content/<slug>/**.md → Shiki-highlighted JSON chunks + registry
bun run build:content

# typecheck + full production build
bun run typecheck
bun run build:offline

# hot-reload dev server (http://localhost:3000)
bun run dev

# smoke-test the production bundle (http://localhost:4173)
bun run preview
```

<details>
<summary><b>What each command does internally</b></summary>

<br>

- `bun run sync` → `scripts/gen-meta.ts`: pulls `orgs/PotenFYR-Studios/repos` and writes `src/data/repos.json`.
- `bun run build:content` → `scripts/build-content.ts`: 2-pass walk that
  (a) slugs every heading, (b) rewrites relative `.md` links into
  `#/repo/<slug>/<page>` URLs, (c) strips legacy `*.docs.potenfyr.in`
  links that were rewritten in the consolidation PRs, and (d) renders each page
  through `markdown-it` + `shiki`. Output lands in `src/data/content/<slug>.json`
  plus a single `src/data/registry.json` index.
- `bun run build:offline` → same as `build` minus the `sync` step, so the
  registry doesn't churn when [`GITHUB_TOKEN`](#faq) is unavailable.
- `bun run dev` → Vite dev server; content JSON is imported dynamically so
  chunks stay tree-shaken.

</details>

---

## 🏗 Architecture

```
                ┌── content/<slug>/*.md ───┐         (vendored, single source of truth)
                │  18 repos, 190 pages      │
                └──────────┬───────────────┘
                           │  scripts/build-content.ts
                           ▼
   shiki + markdown-it ──► src/data/content/<slug>.json   (18 lazy chunks)
                        ──► src/data/registry.json        (typed shard index)
                        ──► src/data/types.ts             (TS-facing types)

                ┌── src/ ──────────────────┐
                │  router.tsx      history API + Link
                │  app-store.tsx   toasts / overlays state
                │  chrome.tsx      navbar + footer shell
                │  home.tsx        hero · bento · repo grid
                │  repos.tsx       catalog + per-repo reader (TOC, sidebar)
                │  mcode.tsx       markdown renderer + copy buttons
                │  magicui.tsx     20 Magic-UI-style components (native)
                │  deck.tsx        ⌘K command deck (terminal overlay)
                │  eggs.tsx        konami · fyr · logo-tap egg engine
                │  notfound.tsx    404 + cheat sheet
                └──────────────────────────┘
                           │  vite build (base "./", per-repo code split)
                           ▼
                       dist/ ──► GitHub Pages (docs.potenfyr.in, via CNAME)
```

<details>
<summary><b>Why not a full MDX/Next.js stack?</b></summary>

<br>

Three reasons, in order of weight:

1. **Bun-native, zero-run-time-data-fetch.** GitHub Pages serves static
   files only; bundling content as JSON chunks means instant navigation and zero
   `fetch` waterfalls or edge functions.
2. **One visual language, shared components.** Magic UI / Aceternity components
   work best when they're *in-tree* and typed against our tokens, not imported
   from an npm package that drifts.
3. **Repo-authored docs, not CMS-authored.** Content stays in git as markdown —
   reviewable, diffable, and movable — but ships as data the SPA lazy-loads.

</details>

---

## 🔁 Docs as data — how content flows

1. **Vendoring.** Every public repo's `docs/` folder (or README) is vendored
   into `content/<slug>/…`, with per-repo link rewrites already applied during
   the consolidation PRs. The original repos now keep **zero** markdown docs of
   their own.
2. **Turnover.** When a source repo updates its README, the flow is:
   edit upstream → `cp <upstream>/README.md docs/content/<slug>/README.md` →
   commit the hub. (We considered auto-syncing — see
   [API rate limits](#faq) — but vendoring wins on determinism.)
3. **Renders.** `build:content` writes JSON chunks; `vite build` code-splits
   them so `/repo/orbynode` loads only its 44-page chunk.
4. **Deploy.** `.github/workflows/deploy.yml` pushes Pages from `dist/` with the
   custom domain read from `public/CNAME`.

<details>
<summary><b>Link rewriting rules (exact)</b></summary>

<br>

| Source pattern in markdown | Becomes |
|---|---|
| `[text](other-page.md)` | `[text](#/repo/<slug>/other-page)` |
| `[text](../adr/001-x.md)` | `[text](#/repo/orbynode/adr/001-x)` |
| `https://*.docs.potenfyr.in/...` | rewritten to the hub route during the consolidation PRs |
| `[text](#anchor)` | kept as-is (SPAs handle same-page anchors) |
| `https://github.com/…` | kept — real repo links stay real |

</details>

---

## 🎨 Theming — the ROG palette

The palette is derived from the PotenFYR org avatar: near-black
`#05070c` void, a sky gradient running `#4fa3ec → #b6dcff`, and an icy
`#e3f1ff` ghost for headings.

```css
/* src/theme.css — the four tokens that drive every component */
--color-rog-void:   #05070c;   /* page background            */
--color-rog-panel:  #141827;   /* cards, code, tables        */
--color-rog-sky:    #4fa3ec;   /* primary accent (links, CTA)*/
--color-rog-frost:  #b6dcff;   /* secondary accent (cursors) */
```

Consequence: changing any of those four values cascades through 20 component
colors, shiki backgrounds, code copy buttons, terminal output, toasts, and both
charts. No `grep`-and-replace.

---

## 🥚 Easter eggs

The hub is quietly playful. Every egg is discoverable from the UI and safe to
trigger; nothing is gated behind auth.

| Input | Result |
|---|---|
| <kbd>↑ ↑ ↓ ↓ ← → ← → B A</kbd> | Confetti + `DECK MASTER` toast + enables the ROG glow |
| typing <code>f y r</code> | Blue-flame burst overlay |
| typing <code>d o c s</code> | A small hint toast about <kbd>⌘K</kbd> |
| 7× logo taps | Toggles **HYPER ORBIT** (faster auroras, page-wide glow) |
| typing <code>?</code> | Cheat-sheet modal (also lists every egg above) |
| <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> | Command deck (terminal) |
| footer <code>=^.^=</code> | A console meow 🐱 |

The command deck is a full terminal with fuzzy repo lookup, per-repo `ls`, a
spoiler-friendly `eggs` command, and `/sudo` correctly denied.

---

## ⬆ Deploying changes

```
git commit -m "docs: …"      # anything under content/ or src/
git push origin main         # → .github/workflows/deploy.yml runs automatically
```

The workflow:
1. `bun run build:content` — recompiles from `content/`.
2. `bun run typecheck` — blocks merge on type errors **and** link-rewrite
   regressions caught by the type surface.
3. `bun run build:offline` — the actual Vite bundle.
4. generates `dist/404.html` (copy of `index.html` + a `<script>` that hashes
   the missing path) and uploads Pages.

`docs.potenfyr.in` is bound via the `public/CNAME` file, which GH Pages reads at
deploy time. The workflow also generates `nojekyll`.

---

## 🤝 Contributing docs

- **Fix a typo on any page?** It lives in exactly one place: `content/<slug>/<page>.md`.
- **Propose a new page?** Drop markdown into the relevant repo's folder and
  open a PR here; the pipeline handles the rest.
- **Add a repo to the hub?** See [Repo catalog](#repo-catalog).
- **Rework a component?** Everything under `src/magicui.tsx` is a native,
  typed rewrite of its Magic UI counterpart — copy our patterns rather than
  installing `magicui` npm packages, so tokens can flow cleanly.

Run `bun run typecheck` before opening a PR; CI does the same on push.

---

## 🗒 Repository conventions

| Convention | Why |
|---|---|
| `content/` is **generated-in-repo, vendored at authoring time** | No per-repo Pages sites to babysit; reviewable git diffs |
| Every vendored file keeps its original upstream path | `content/fyrwall/installation.md` ↔ `FYRwall/docs/content/installation.md` |
| `npm`-isms are avoided | Bun-only codebase; use `bun run`, `bun add`, `bun -e` |
| `[slug]`-prefixed keyframes & classes (`pp-aurora`, `pp-term-caret`) | Namespace safety; Tailwind v4 `@theme` tokens stay SSOT |
| One H1 per page, frontmatter unnecessary | `build-content` derives page titles from headings |

---

## ❓ FAQ

<details>
<summary><b>Where did <code><repo>.docs.potenfyr.in</code> go?</b></summary>

Decommissioned during the docs-hub consolidation (see the
[Repo catalog](#repo-catalog)). Every one of those URLs 301s to
`docs.potenfyr.in/<slug>` in client rendering, and the per-repo Pages workflows
were deleted at the same time.
</details>

<details>
<summary><b>How do I add a brand-new repo?</b></summary>

1. Vendored markdown: <code>content/<slug>/README.md</code> (or a full docs tree).
2. Add a line to <code>OVERRIDES</code> in <code>scripts/build-content.ts</code> with a <code>category</code> + <code>blurb</code>.
3. <code>bun run build:offline</code> — verify in <code>dist/</code>, open a PR.
</details>

<details>
<summary><b>Does the repo fetch GitHub stars live?</b></summary>

No — <code>registry.json</code> stores stars at <strong>build time</strong> via
<code>gh api</code> / <code>bun run sync</code>. We considered using the
GitHub REST API live but most free-plan runners burn through the 60 req/hr
anonymous limit on the first page load, so caching wins.
</details>

<details>
<summary><b>Why is the source repo marked <code>private</code> while the docs are public?</b></summary>

This repo is currently private. The <code>deploy.yml</code> workflow gates Pages
on <code>github.event.repository.private != true</code>, so the day it flips
public the pipeline deploys without changes.
</details>

<details>
<summary><b>Which routes are implemented?</b></summary>

| Route | Purpose |
|---|---|
| <code>/</code> | Home — hero, bento, repo grid, marquee |
| <code>/repos</code> | Catalog with <code>?cat=</code> filter |
| <code>/repo/<slug></code> | Repo overview (default page) |
| <code>/repo/<slug>/<page></code> | Specific doc page |
| everything else | 404 with meteors + cheat-sheet pointer |
</details>

---

## 📜 License

Apache-2.0 + Commons Clause — matching the rest of the PotenFYR tooling. A
dedicated `LICENSE` file for this repo is pending; see
[fyrwall/LICENSE](https://github.com/PotenFYR-Studios/FYRwall/blob/master/LICENSE)
for the exact text used across the org's code repos.

<div align="center">

### 🜲 [docs.potenfyr.in](https://docs.potenfyr.in) — one engine, every repo.

*Vite · React · TypeScript · Bun · Tailwind · shiki · markdown-it*

</div>
