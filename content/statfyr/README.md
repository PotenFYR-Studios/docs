<div align="center"> <img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,50:ec4899,100:f97316&height=220&section=header&text=Statfyr&fontSize=52&fontColor=ffffff&fontAlignY=34&desc=A%20blazing-fast%20REST%20API%20for%20Minecraft%20player%20statistics&descSize=20&descAlignY=55&animation=twinkling" width="100%" alt="Statfyr banner"/> [![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1200&color=8B5CF6&center=true&vCenter=true&width=800&lines=Every+player+statistic%2C+one+JSON+API;Live+reads+with+zero+TPS+impact;Bearer+auth%2C+rate+limits%2C+gzip+built+in;Bukkit+%C2%B7+Spigot+%C2%B7+Paper+%C2%B7+Purpur+%C2%B7+Folia+1.8.x+to+26.x)](/statfyr) [![Modrinth](https://img.shields.io/badge/Modrinth-statfyr-1bd96a?style=for-the-badge&logo=modrinth&logoColor=white&labelColor=1c1e26)](https://modrinth.com/plugin/statfyr)
[![Docs](https://img.shields.io/badge/Docs-/statfyr-8b5cf6?style=for-the-badge&logo=githubpages&logoColor=white&labelColor=1c1e26)](/statfyr)
[![Build](https://img.shields.io/github/actions/workflow/status/PotenFYR-Studios/statfyr/build.yml?branch=master&style=for-the-badge&logo=githubactions&label=Build&labelColor=1c1e26&color=2ea043)](https://github.com/PotenFYR-Studios/statfyr/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/License-Apache--2.0%20%2B%20Commons%20Clause-f97316?style=for-the-badge&labelColor=1c1e26)](LICENSE)
[![View](https://komarev.com/ghpvc/?username=PotenFYR-Studios-statfyr&color=ec4899&style=for-the-badge&label=VIEW&labelColor=1c1e26)](https://github.com/PotenFYR-Studios/statfyr) </div> **Statfyr** is a fast REST API plugin for Minecraft that exposes player statistics (playtime, kills, deaths, blocks mined, items crafted, movement analytics) through a clean, documented HTTP interface. Built for **Bukkit, Spigot, Paper, Purpur, and Folia - Minecraft 1.8.x through 26.x** (1.8.x - 1.16.x kept as legacy support) with zero external dependencies: dashboards, Discord bots, leaderboard sites, and analytics tools all talk to your server over plain JSON. Stats are read **asynchronously, off the main thread**, and served from an in-memory cache, so API traffic never touches your TPS. 📚 **Full documentation → [/statfyr](/statfyr)** --- ## ✨ Features - 📊 **Full stat access**: all nine vanilla statistic categories, live for online players and parsed from vanilla stat files for offline ones
- 🧮 **Analytics engine**: sessions, playtime / active time / AFK time, first & last seen, derived stats (KDR, averages) and player segmentation
- 🕒 **Historical data**: append-only, restart-safe snapshots with configurable retention - query yesterday, this week, this month or all time
- 🏆 **Leaderboards**: 24 ranked metrics with `daily` / `weekly` / `monthly` / `all_time` periods, configurable minimums and resettable windows
- 🗺️ **Server analytics**: peak & average concurrency, unique players, new vs returning, sessions per day, retention cohorts (D1/D7/D14/D30) and activity heatmaps
- 🧩 **Commands & placeholders**: `/statfyr` + `/sf` with tab completion, and a full PlaceholderAPI expansion
- 🔌 **Optional integrations** (none required): PlaceholderAPI, Vault economy analytics, Discord webhooks, Prometheus `/metrics`
- 🧱 **Custom metrics API**: other plugins can register arbitrary metrics (economy, quests, wins, votes…) and expose them through the API
- ⚡ **Async loading**: stats are fetched on background threads, zero TPS impact; snapshots are batched, never per-event
- 🔐 **Bearer authentication**: lock the API behind a secret key
- 🛡️ **Rate limiting**: per-IP throttling out of the box (120 requests / 60 s by default)
- 🌐 **CORS support**: browser-based dashboards work without a proxy
- 🧱 **IP whitelist**: restrict access to trusted addresses
- 🔑 **HTTPS / TLS**: optional, via a Java keystore
- 📄 **Built-in API docs**: browsable endpoint reference at `/api/docs`
- 🧩 **Pagination & sorting**: standard `limit`, `page`, and `order` params across list endpoints
- 🗜️ **gzip compression**: automatic for clients that send `Accept-Encoding: gzip`
- 🗃️ **Persistent, file-based storage**: no database or bundled dependency required ## 📋 Requirements | Requirement | Version |
|---------------|-------------------------|
| Java | 8+ (runs up to Java 25+) |
| Minecraft / servers | Bukkit · Spigot · Paper · Purpur · Folia - **1.8.x - 26.x** |
| Legacy support | 1.8.x - 1.16.x (best effort) | > A single JAR targets Java 8 bytecode, so it loads on a 1.8.x server running Java 8 *and* on a 26.x server running Java 25. ## 🚀 Quick Start 1. Download the latest `.jar` from [Modrinth](https://modrinth.com/plugin/statfyr)
2. Drop it into your server's `/plugins/` folder and restart
3. Verify it's live: ```bash curl http://localhost:8080/api/health ``` 4. For anything beyond localhost, **enable authentication**: set `security.enable-api-key: true`, generate a strong random key into `security.api-key`, then call the API with `Authorization: Bearer <key>` (or set the `STATFYR_API_KEY` environment variable) Configuration changes apply with `/statfyr reload`; no restart needed. ## 🔌 API Overview All endpoints are `GET`-only and return JSON. The base URL is: ```
http://your-server:8080/api
``` ### Endpoints | Method | Endpoint | Description |
|--------|---------------------------------|----------------------------------------------------|
| `GET` | `/api` | API index and version |
| `GET` | `/api/health` | Server health, memory, platform, and feature flags |
| `GET` | `/api/docs` | Built-in endpoint reference |
| `GET` | `/api/players` | Paginated player list (`limit`, `page`, `online_only`, `search`) |
| `GET` | `/api/player/{uuid\|name}` | Full stats for one player |
| `GET` | `/api/player/{uuid\|name}/summary` | Lightweight movement/combat/activity summary |
| `GET` | `/api/player/{uuid\|name}/history` | Historical metric snapshots (`from`, `to`, `limit`) |
| `GET` | `/api/player/{uuid\|name}/activity` | Activity timeline |
| `GET` | `/api/player/{uuid\|name}/sessions` | Session statistics |
| `GET` | `/api/player/{uuid\|name}/retention` | Player cohort / retention info |
| `GET` | `/api/leaderboard/{stat}` | Ranked leaderboard (`limit`, `page`, `order`, `period`) |
| `GET` | `/api/server` · `/api/server/summary` | Server analytics summary |
| `GET` | `/api/server/history` | Concurrency history (`from`, `to`, `limit`) |
| `GET` | `/api/server/activity` | Activity heatmap data |
| `GET` | `/api/server/retention` | D1/D7/D14/D30 retention cohorts |
| `GET` | `/api/server/segments` | Player segmentation counts |
| `GET` | `/api/network` | Network / multi-server aggregation |
| `POST` | `/api/network/report` | Accept a peer summary from another server |
| `GET` | `/api/custom/{metric}` | Custom metrics registered by other plugins |
| `GET` | `/api/archive/{metric}` | Archived leaderboard results for completed periods |
| `GET` | `/api/server/economy` | Economy analytics (Vault, when present) |
| `GET` | `/metrics` | Prometheus exposition (when enabled) |
| `GET` | `/dashboard` | Optional API-first web dashboard (when enabled) | Leaderboard `{stat}` values include `kills`, `deaths`, `kdr`, `player_kills`, `mob_kills`, `damage_dealt`, `damage_taken`, `playtime`, `active_time`, `sessions`, `blocks_mined`, `blocks_broken`, `items_crafted`, `items_used`, `items_picked_up`, `items_dropped`, `chests_opened`, `jumps`, `distance_traveled`, `distance_walked`, `distance_sprinted`, `distance_swum`, `distance_flown`, `balance`. Add `?period=daily|weekly|monthly|all_time`. ### Examples ```bash
# Server health
curl http://localhost:8080/api/health # Five most recently online players
curl "http://localhost:8080/api/players?limit=5&online_only=true" # A player's summary (by name or UUID)
curl -H "Authorization: Bearer $STATFYR_API_KEY" \ "http://localhost:8080/api/player/Notch/summary" # Top 10 by playtime
curl "http://localhost:8080/api/leaderboard/playtime?limit=10" # Weekly kills leaderboard
curl "http://localhost:8080/api/leaderboard/kills?period=weekly&limit=10" # Server analytics summary
curl "http://localhost:8080/api/server/summary" # A player's session history
curl "http://localhost:8080/api/player/Notch/sessions"
``` <details>
<summary><strong>Example response: leaderboard</strong></summary> ```json
{ "stat": "playtime", "total": 1, "limit": 25, "offset": 0, "page": 1, "entries": [ { "rank": 1, "uuid": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "name": "Steve", "online": false, "value": 125, "formatted": "6s" } ], "metadata": { "generated_at": "2026-05-20T11:18:07.625703400Z", "execution_time_ms": 3, "ascending": false, "online_only": false }
}
``` </details> Every request shape, parameter, and response field is documented in the [API Reference](/statfyr/docs/api). ## ⚙️ Configuration The config file is generated at `plugins/statfyr/config.yml` on first run. The core, enforced keys: ```yaml
http: port: 8080 bind-address: "0.0.0.0" # use 127.0.0.1 to keep the API localhost-only https: enabled: false keystore-path: "plugins/statfyr/keystore.jks" security: enable-api-key: false api-key: "" # or set the STATFYR_API_KEY env var enable-rate-limit: true rate-limit-requests: 120 rate-limit-window-seconds: 60 enable-cors: true enable-ip-whitelist: false allowed-ips: [] pagination: default-limit: 25 max-limit: 100
``` **Environment variable overrides** (take precedence over the config file): | Variable | Config key |
|-----------------------------|----------------------------|
| `STATFYR_API_KEY` | `security.api-key` |
| `STATFYR_KEYSTORE_PASSWORD` | `https.keystore-password` | > Some keys shipped in `config.yml` (compression, async, cache, docs, and a few others) are read but **not yet enforced** in the 1.0.0-BETA build; the [configuration reference](/statfyr/docs/configuration) marks every key as enforced or reserved. ## 🔒 Securing Your API For any server reachable beyond localhost: 1. **Enable API key authentication**: set `security.enable-api-key: true` with a long random key
2. **Enable HTTPS**: generate a keystore and set `https.enabled: true`
3. **Restrict the bind address**: `http.bind-address: "127.0.0.1"` if only local services (e.g. a reverse proxy) need access
4. **Enable IP whitelisting**: `security.enable-ip-whitelist: true` with your dashboard's IPs **Generate a keystore for HTTPS:** ```bash
keytool -genkeypair -alias statfyr \ -keyalg RSA -keysize 2048 \ -storetype JKS \ -keystore plugins/statfyr/keystore.jks \ -validity 3650
``` ## 🛠️ Commands & Permissions StatFYR works with vanilla Bukkit permissions and is fully compatible with **LuckPerms** (no hard dependency). | Command | Permission | Default | Description |
|---------|------------|---------|-------------|
| `/statfyr stats [player]` | `statfyr.stats.self` / `statfyr.stats.others` | everyone / op | View statistics (self or another player) |
| `/statfyr top [stat] [period]` | `statfyr.top` (or `statfyr.top.<stat>`) | everyone | View leaderboards |
| `/statfyr help` | `statfyr.help` | everyone | Show available commands |
| `/statfyr status` | `statfyr.status` | op | Show API + analytics status |
| `/statfyr reload` | `statfyr.reload` | op | Reload configuration |
| `/statfyr database` | `statfyr.admin` | op | Storage statistics |
| `/statfyr purge <player>` | `statfyr.admin` | op | Delete a player's analytics data |
| `/statfyr purge-history` | `statfyr.admin` | op | Delete all historical snapshots |
| `/statfyr debug` | `statfyr.admin` | op | Dump diagnostics | `/sf` is a built-in alias for `/statfyr` (configurable under `commands.aliases`). ### LuckPerms examples ```bash
/lp group default permission set statfyr.use true
/lp group default permission set statfyr.stats true
/lp group default permission set statfyr.top true
/lp group moderator permission set statfyr.stats.others true
/lp group moderator permission set statfyr.admin true
``` ## 🔗 PlaceholderAPI When [PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/) is installed the `statfyr` expansion registers automatically. If it is not installed, StatFYR works normally. ```text
%statfyr_kills% %statfyr_deaths% %statfyr_kdr%
%statfyr_playtime% %statfyr_active_time% %statfyr_afk_time%
%statfyr_sessions% %statfyr_blocks_mined% %statfyr_blocks_broken%
%statfyr_distance_traveled% %statfyr_rank% %statfyr_segment%
%statfyr_first_seen% %statfyr_last_seen% %statfyr_afk%
``` Parameterised variants append a player name: ```text
%statfyr_kills_Steve% %statfyr_playtime_Steve% %statfyr_rank_Steve%
``` Server placeholders: ```text
%statfyr_server_online% %statfyr_server_peak_today%
%statfyr_server_peak_all_time% %statfyr_server_unique_today%
%statfyr_server_total_players% %statfyr_server_sessions%
``` ## 🖥️ Web Dashboard An optional built-in dashboard is served at `/dashboard` when `enabled: true` is set in
`plugins/statfyr/dashboard.yml`. It is configured separately from the API (branding, theme,
accent color, refresh interval, default leaderboard view) and each section can be toggled
independently under `modules:` in that file (overview, charts, leaderboards, players,
retention, segments, network). The page never asks visitors for an API key: the server injects its configuration (and,
when `embed-api-key: true` and API auth is on, the key itself) on load. Keep the dashboard
behind a reverse proxy or on a LAN when the key is embedded. See [ENDPOINT.md](ENDPOINT.md)
for the full `dashboard.yml` reference. ## 🔌 Integrations Every integration is optional and independently toggleable under `integrations:` in `config.yml`. | Integration | Purpose | Notes |
|-------------|---------|-------|
| **PlaceholderAPI** | In-game placeholders | Soft dependency, auto-registered |
| **Vault** | Read-only economy analytics (balance, leaderboards) | Soft dependency, never implements an economy |
| **Discord** | Weekly/monthly leaderboard & milestone webhooks | Plain `HttpURLConnection`, no dependency |
| **Prometheus** | `/metrics` exposition endpoint for Grafana | Hand-rolled exposition format |
| **Web dashboard** | Optional API-first dashboard at `/dashboard` | Consumes the public REST API only |
| **Multi-server** | Network aggregation at `/api/network` | Push/accept peer reports; no shared database | ## 📈 Custom metrics API Other plugins can push arbitrary metrics into StatFYR: ```java
Statfyr.getInstance().getAnalytics().setCustomMetric( "economy.balance", player.getUniqueId(), 12500.0
);
``` They are then available at `GET /api/custom/economy.balance`. ## 🗄️ Storage & Privacy Historical data is stored as append-only JSON Lines under `plugins/statfyr/data/` - no database or bundled driver is required. Profiles are small JSON files; snapshots are streamed and pruned according to `history.retention-days`. - Snapshots are written on a configurable interval (default 5 minutes), never per event.
- `history.retention-days: 0` keeps data forever; otherwise old snapshots are pruned automatically.
- Disable collection entirely with `collection.enabled: false`.
- Exclude specific metrics with `collection.disabled-metrics`.
- `/statfyr purge <player>` and `/statfyr purge-history` remove data on request. Only information required for Minecraft server analytics is stored. ## 📡 Status Codes | Code | Meaning |
|-------|-------------------------------------------|
| `200` | Success |
| `400` | Bad request (invalid parameters) |
| `401` | Unauthorized (missing or invalid API key) |
| `403` | Forbidden (IP not whitelisted) |
| `404` | Player or resource not found |
| `405` | Method not allowed (the API is GET-only) |
| `429` | Too many requests (rate limit exceeded) |
| `500` | Internal server error | ## 💬 Support - **Bugs, ideas, questions** → [GitHub Issues](https://github.com/PotenFYR-Studios/statfyr/issues); issue templates are provided, so pick the closest fit
- **Documentation** → [/statfyr](/statfyr) ## 🤝 Contributing Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to build the plugin locally and what to include in a pull request. ## 🔐 Security Policy Found a security vulnerability? Please **do not open a public issue**, and follow the confidential disclosure process in [SECURITY.md](SECURITY.md). ## 📜 License Statfyr is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) with the [Commons Clause](https://github.com/PotenFYR-Studios/statfyr/blob/master/LICENSE) condition: use, modify, fork, self-host, and redistribute it freely, including in commercial projects, but do not sell Statfyr itself. The license text in this repository is the authoritative version. ## Contributing Contributions make the open-source community such an amazing place to learn, inspire and create. Any contributions you make are **greatly appreciated** - see [CONTRIBUTING.md](CONTRIBUTING.md) and the [good first issues](https://github.com/PotenFYR-Studios/statfyr/labels/good%20first%20issue). Security concerns: please use [SECURITY.md](SECURITY.md) (private vulnerability reporting), not public issues. <a href="https://github.com/PotenFYR-Studios/statfyr/graphs/contributors"> <img src="https://contrib.rocks/image?repo=PotenFYR-Studios/statfyr" alt="statfyr contributors" />
</a>
<a href="https://github.com/PotenFYR-Studios/statfyr/stargazers"> <img src="https://img.shields.io/github/stars/PotenFYR-Studios/statfyr?style=social&label=Stars" alt="Live star count" />
</a>
<a href="https://github.com/PotenFYR-Studios/statfyr/network/members"> <img src="https://img.shields.io/github/forks/PotenFYR-Studios/statfyr?style=social&label=Forks" alt="Live fork count" />
</a> <picture> <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/PotenFYR-Studios/FYRwall/output/github-snake-dark.svg" /> <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/PotenFYR-Studios/FYRwall/output/github-snake.svg" /> <img alt="Contribution snake animation" src="https://raw.githubusercontent.com/PotenFYR-Studios/FYRwall/output/github-snake.svg" width="100%" />
</picture> --- ## ⭐ Star History <picture> <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=potenfyr-studios/.github,potenfyr-studios/.web,potenfyr-studios/AuthCore,potenfyr-studios/CustomDamageNumbers,potenfyr-studios/Database-Eggs,potenfyr-studios/EchoingDeaths,potenfyr-studios/FYRwall,potenfyr-studios/HBS-Tool,potenfyr-studios/LinkFYR,potenfyr-studios/Minecraft-Eggs,potenfyr-studios/OrbyNode,potenfyr-studios/PteroOps-MCP,potenfyr-studios/Prog-Language-Eggs,potenfyr-studios/Shell-Eggs,potenfyr-studios/VigilFYR,potenfyr-studios/discord-botlists,potenfyr-studios/ojaj,potenfyr-studios/potenfyr-nest,potenfyr-studios/statfyr&type=Date&theme=dark" /> <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=potenfyr-studios/.github,potenfyr-studios/.web,potenfyr-studios/AuthCore,potenfyr-studios/CustomDamageNumbers,potenfyr-studios/Database-Eggs,potenfyr-studios/EchoingDeaths,potenfyr-studios/FYRwall,potenfyr-studios/HBS-Tool,potenfyr-studios/LinkFYR,potenfyr-studios/Minecraft-Eggs,potenfyr-studios/OrbyNode,potenfyr-studios/PteroOps-MCP,potenfyr-studios/Prog-Language-Eggs,potenfyr-studios/Shell-Eggs,potenfyr-studios/VigilFYR,potenfyr-studios/discord-botlists,potenfyr-studios/ojaj,potenfyr-studios/potenfyr-nest,potenfyr-studios/statfyr&type=Date" /> <img alt="Star history chart for all PotenFYR Studios public repositories" src="https://api.star-history.com/svg?repos=potenfyr-studios/.github,potenfyr-studios/.web,potenfyr-studios/AuthCore,potenfyr-studios/CustomDamageNumbers,potenfyr-studios/Database-Eggs,potenfyr-studios/EchoingDeaths,potenfyr-studios/FYRwall,potenfyr-studios/HBS-Tool,potenfyr-studios/LinkFYR,potenfyr-studios/Minecraft-Eggs,potenfyr-studios/OrbyNode,potenfyr-studios/PteroOps-MCP,potenfyr-studios/Prog-Language-Eggs,potenfyr-studios/Shell-Eggs,potenfyr-studios/VigilFYR,potenfyr-studios/discord-botlists,potenfyr-studios/ojaj,potenfyr-studios/potenfyr-nest,potenfyr-studios/statfyr&type=Date" width="80%" />
</picture> Every public PotenFYR Studios repository on one live chart, served by [star-history.com](https://star-history.com). --- <!-- markdownlint-disable --> <div align="center"> <img src="https://capsule-render.vercel.app/api?type=waving&color=0:f97316,50:ec4899,100:8b5cf6&height=120&section=footer&text=Made%20with%20%E2%9D%A4%EF%B8%8F%20by%20PotenFYR%20Studios&fontSize=22&fontColor=ffffff&animation=twinkling" width="100%" alt="footer"/> </div>
<!-- markdownlint-enable -->
