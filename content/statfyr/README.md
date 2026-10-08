# Statfyr

A fast REST API plugin for Minecraft that turns live player statistics into a clean JSON interface. Dashboards, Discord bots, leaderboard sites and analytics tools read from your server over plain HTTP without ever touching the game thread.

## What it does

- **Full stat access** - all nine vanilla statistic categories for online players, parsed live; offline players are read from their vanilla stat files.
- **Analytics engine** - sessions, playtime, active and AFK time, first and last seen, derived stats such as kill/death ratio, and player segmentation.
- **Historical snapshots** - append-only, restart-safe history with configurable retention, so dashboards can query yesterday, this week, this month or all time.
- **Leaderboards** - ranked metric endpoints with daily, weekly, monthly and all-time periods, including minimum activity thresholds and resettable windows.
- **Custom metrics** - other plugins can register arbitrary metrics (economy, quests, event wins) and expose them through the same API.

## Design goals

Stats are read asynchronously off the main thread and served from an in-memory cache, so API traffic never affects TPS. The HTTP surface ships with bearer-token auth, per-IP rate limiting, CORS support and optional TLS - the endpoints a public dashboard actually needs.

## Getting started

1. Drop the Statfyr jar into `plugins/` and restart the server.
2. The API starts on port `8080` by default; set `api.port` and `api.auth.token` in `config.yml`.
3. Point your dashboard at `http://your-server:8080/api/...` and authenticate with the bearer token.

Commands: `/statfyr` (alias `/sf`) with tab completion, plus a PlaceholderAPI expansion for in-game reads. Folia is supported alongside Paper, Spigot and Purpur for 1.8.x through current releases.

## Where the detail lives

The sidebar pages carry the complete endpoint reference (`api data`), the analytics and placeholder references, examples, and the integration guide (Prometheus, Discord webhooks, Vault).

## Links

- Source: [github.com/PotenFYR-Studios/statfyr](https://github.com/PotenFYR-Studios/statfyr)
- Modrinth: [modrinth.com/plugin/statfyr](https://modrinth.com/plugin/statfyr)
