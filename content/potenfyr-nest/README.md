# potenfyr-nest

One nest for every multi egg. The PotenFYR-Nest is the official catalog and distribution hub for every `*-Eggs` collection the studio publishes. It keeps a synced catalog of the eggs, their variables and versions, serves them over a fast Vite + React 19 site, and lets you download a production-ready `egg.json` directly.

## Why the nest exists

- **One download URL per egg** - each collection mirrors its `egg.json` files verbatim into `public/eggs/`, the nest serves them.
- **Auto-refresh** - a sync workflow runs in GitHub Actions, re-scans the source repos every 30 minutes and regenerates the full catalog: stats, versions, topics and stars.
- **Panel-native** - the catalog JSON and catalog seed module are both directly consumed by most panel import flows.

## What the catalog shows

For every egg in every collection, the site lists the name, description, per-collection source repository, stars, last push time, tags and language, and a direct download button. Data is a deterministic structure derived from the source repos, so every egg definition lives at exactly one place in the catalog.

## A huge catalog, kept calm

The site includes a search box, category filters, keyboard navigation and direct links back to the source repository. Every egg card links out to the collection repo, release page and direct JSON so you can always verify that you're importing the version you expect.

## Getting started

1. Open the [nest site](https://nest.potenfyr.in).
2. Use search (type in a keyword like `redis`) or the collection filter.
3. Click the download button on the card you want - you get an `egg.json` ready for your panel's import dialog.
4. In your panel: create a new server, choose "Import egg", paste the JSON, fill the required variables.

The site itself needs no admin: it's rebuilt from upstream repos by the sync workflow, over GitHub Pages.

## Source and contributions

This repo is the catalog mirror. If you want to change an egg, open a pull request in its `*-Eggs` collection - the next sync picks it up automatically. See the CONTRIBUTING.md and SECURITY.md in each collection for details.

## Layout reference

| | |
| - | - |
| `public/eggs/` | Verbatim egg JSON per collection |
| `public/data/catalog.json` | The auto-generated catalog |
| `.github/workflows/sync.yml` | The scheduled sync + rebuild workflow |
