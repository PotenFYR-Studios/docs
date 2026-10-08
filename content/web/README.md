# PotenFYR Studios Website

The official PotenFYR Studios website at [potenfyr.in](https://potenfyr.in) - the public face of the studio: the flagship project list, live telemetry from GitHub and Modrinth, the security hall of fame, the community hub and the terminal command deck.

## What the site delivers

- **Project catalog** - all flagship and auto-discovered repositories with categories, stats and launch links, refreshed automatically from GitHub.
- **Live telemetry** - download counts from Modrinth, repo stars, language distribution and node latency cards computed from real APIs.
- **Security hall of fame** - the responsible-disclosure recognition program, its policy, and verified researchers.
- **Command deck** - an interactive terminal that answers questions about the ecosystem, projects, eggs and tooling.
- **Community hub** - the community Discord, support Discord, Modrinth organization and GitHub org linked from everywhere.

## Built with

React 19, TypeScript, Tailwind v4, Vite and Bun. Deployed statically with GitHub Pages; designed in the studio's signature dark sky-blue palette with Magic UI-inspired motion.

## Development workflow

1. Clone the repo and run `bun install` (Bun is the required package manager).
2. `bun run dev` for the local dev server.
3. Commits to `master` build and deploy to GitHub Pages automatically.

Every deploy is atomic: telemetry, catalog data and OG images are computed at build time so the site ships as static assets that load instantly.

## Where things live

| | |
| - | - |
| Project catalog component | auto-synced from the GH org metadata |
| Telemetry components | Modrinth API + GH API derived cards |
| Terminal deck | typed-commands engine with the studio's answers |
| Hall of fame | verified researcher cards with disclosure attributions |
