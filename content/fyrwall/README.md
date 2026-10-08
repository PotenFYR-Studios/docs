# FYRwall

A clean GUI over `ufw` and `iptables` for Linux servers, without ever running the web server as root, without shell interpolation anywhere, and never a single firewall mutation without a restore point and a rollback path.

## What it does

- **Browser GUI for firewalls** - rules, interfaces, zones and NAT visible and editable from the browser with instant feedback from the actual firewall.
- **Zero-root web tier** - the web UI runs as an unprivileged user; privileged mutations happen through a small, auditable root-side helper.
- **Restore points** - every mutation snapshots the previous ruleset first; one click rolls any change back.
- **No shell interpolation** - inputs are parsed into structured commands and executed through typed helpers; there is no string concatenation into `sudo` calls anywhere.
- **Extensions system** - integrate fail2ban-style log ingest, WireGuard node tables and custom watchers as first-class UI surfaces.

## Who it is for

Server admins who want real firewall visibility without memorizing `iptables` chains, teams that need shared-but-auditable change management (every edit has author, timestamp and rollback), and anyone tired of giving their management panel root.

## Getting started

```bash
curl -fsSL https://github.com/PotenFYR-Studios/FYRwall/releases/latest/download/install.sh | sudo sh
```

Same script, straight from GitHub Releases - installs the single static binary and never touches your rules. Default web UI: `http://localhost:8080` (adjust with the config file). The first signup becomes the admin.

## Architecture in one minute

The Go web server (unprivileged) talks to `fyrwalld` helper (root, minimal surface) over a strict local protocol: structured JSON, no shell, and every mutation validated against the live ruleset's snapshot. Backups live next to the database with timestamps; the UI exposes a timeline of every change with the exact diff returned to the firewall.

## Where the detail lives

The sidebar covers installation methods, the full configuration manual, docker mode, the operations handbook (backups, updates, logs), the extensions SDK and the security/safety model that explains exactly what runs as root and why the rest does not.

## Links

- Source: [github.com/PotenFYR-Studios/FYRwall](https://github.com/PotenFYR-Studios/FYRwall)
- Releases and installers: [github.com/PotenFYR-Studios/FYRwall/releases](https://github.com/PotenFYR-Studios/FYRwall/releases)
