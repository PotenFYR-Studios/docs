# VigilFYR

Vigil is a local guard for AI coding agents: it sits between your agent and your filesystem, and blocks reads, writes, searches and commands wherever they touch sensitive areas. One install protects every supported agent CLI on the machine.

## What it does

- **Agent auto-detect** - the setup wizard finds installed agents (Claude Code, Codex, Gemini CLI, Cursor, OpenCode, Hermes) and offers per-agent protection.
- **Enforce, audit or off per agent** - `enforce` blocks, `audit` logs without blocking, `off` skips - your call per tool.
- **Sensitive-area policy** - built-in protections for SSH keys, cloud credentials, dotfiles, browsers and wallets; extend with project paths, secret patterns and a home-growing mask list.
- **Non-interactive masked reads** - matching content is redacted so agents can keep working without learning secrets.
- **Autostart and tray** - daemon starts on login with a tray that hosts update checks and per-agent status.

## Why a guard at all?

Agents are powerful and eager. Give one a wrong prompt, a huge repo, or a malicious dependency and it may read your SSH keys, ship your `.env` files, or wipe state you did not expect. Vigil draws the physical line once, at the filesystem layer, and every agent inside the fence inherits it.

## Getting started

```bash
curl -fsSL https://raw.githubusercontent.com/PotenFYR-Studios/VigilFYR/master/install.sh | sh
```

Then `vigil setup` guides you through platform checks, agent auto-detection, per-agent mode, extra paths, masking opt-in and autostart. Zero-prompt install: `vigil setup --defaults`.

Verify any time with `vigil status`: it lists every watched agent, the active mode, and today's blocked or masked events.

## Where the detail lives

The sidebar covers rules (pattern matching and precedence), masking, extensions, the daemon's lifecycle, and the security model - including the audit log format and the reasoning behind default masks.

## Links

- Source: [github.com/PotenFYR-Studios/VigilFYR](https://github.com/PotenFYR-Studios/VigilFYR)
- Releases: [github.com/PotenFYR-Studios/VigilFYR/releases](https://github.com/PotenFYR-Studios/VigilFYR/releases)
