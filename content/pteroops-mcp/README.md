# PteroOps-MCP
AI-powered server operations and monitoring for Pterodactyl panels, served over the Model Context Protocol. Give Claude, Codex or any MCP-capable agent real, read-and-write access to your servers: deployments, diagnostics, backups, monitoring - through a typed tool surface instead of copy-pasting panel URLs into prompts.
## What it does
- **Typed MCP tools** - servers, files, databases, accounts, schedules, backups and diagnostics exposed as structured tools with annotations (read-only vs mutating) so agents behave responsibly.
- **Investigation ladder** - the agent guide encodes an evidence-based troubleshooting pattern (logs first, config second, actions last) so AI sessions act like an SRE instead of guessing.
- **Monitoring built-in** - Prometheus metrics, alert rules sample bundle and logs ingestion; agents can poll and reason about health.
- **Multi-transport** - stdio for local CLI agents, HTTP for remote teams, Docker for homelabs, systemd for bare metal; one binary everywhere.
## Who it is for
Pterodactyl/Pelican panel operators who want AI-assisted ops without giving an agent their panel password, platform teams standardizing how multiple assistants act against game infrastructure, and homelabbers who want a typed, auditable automation surface.
## Getting started
1. Grab a release or install with npm/Docker (the installation page has the exact one-liners).
2. Run `pteroops login` against your panel URL with an API key - the key stays in the local keyring.
3. Connect the MCP client of your choice (Claude Code, Codex, Cursor, custom HTTP agents) per the integrations page.
4. Ask naturally: "show RAM pressure across all servers", "grep the last 100 lines for OOM kills", "restart the minecraft-2 server after backing up".
## Where the detail lives
The sidebar carries the full tool and capability map, web console reference, install and configuration manuals, exact integration snippets (Claude Code, Cursor, VS Code, HTTP, Docker) and the MCP reference with annotations and when-NOT-to-use notes. The monitoring page documents the Prometheus endpoint and alert bundle.
## Links
- Source: [github.com/PotenFYR-Studios/PteroOps-MCP](https://github.com/PotenFYR-Studios/PteroOps-MCP)
- npm: [npmjs.com/package/pteroops-mcp](https://www.npmjs.com/package/pteroops-mcp)
