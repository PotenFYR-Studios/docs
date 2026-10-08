# AuthCore

Authentication and defense-in-depth for Fabric Minecraft servers. AuthCore runs entirely server-side and handles the part of running a server that vanilla Minecraft leaves open: proving that the player connecting is actually the account that owns the session, keeping credentials safe, and blocking the abuse patterns that offline-mode servers invite.

## What it does

- **Session-based login** - players register, log in and stay authenticated with server-issued sessions instead of trusting the client.
- **Multi-factor auth** - optional second factor for privileged accounts, enforced by policy rather than convention.
- **Anti-abuse safeguards** - throttle password guessing, block credential reuse, and protect against the usual offline-mode attack paths.
- **Server-side only** - players need no mod, no resource pack and no client change; anything that speaks the standard Minecraft protocol works.

## Who it is for

Any Fabric server that allows cracked (offline-mode) clients, mixed premium and offline traffic, or wants a strict login policy for staff accounts on an otherwise premium server.

## Getting started

1. Drop the AuthCore jar into `plugins/` (or your Fabric `mods/` folder) and restart the server.
2. A default `config.yml` is generated on first run - review it before opening the server to players.
3. Players register with `/register <password> <password>` and log in with `/login <password>`.

The build is compiled against modern Java (17+) and targets recent Minecraft releases.

## Configuration and depth

The full command surface, permission nodes and the complete configuration reference live in the pages in the sidebar - including API endpoints exposed by the plugin for dashboards and bots.

## Links

- Source and releases: [github.com/PotenFYR-Studios/AuthCore](https://github.com/PotenFYR-Studios/AuthCore)
- Modrinth page: [modrinth.com/mod/authcore](https://modrinth.com/mod/authcore)
- Support: [support@potenfyr.in](mailto:support@potenfyr.in) or the PotenFYR Discord
