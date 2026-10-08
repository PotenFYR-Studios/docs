# OneJumpAllJump (ojaj)

One plugin, one rule: **when one player jumps, every online player jumps with them.** A chaotic community plugin for Paper and Purpur servers that turns the smallest movement into a synchronized server-wide launch, built for chaos events, community streams and memes - with real guardrails underneath.

## What it does

- **Synchronized launches** - every online player is launched the moment a permitted player jumps, with matched velocity so everyone flies the same height.
- **Per-player controls** - operators can toggle the effect server-wide or per-player, check their personal jump counter, and reload configuration live.
- **Freedom-preserving options** - creative/spectator players can be excluded, and a blacklist can protect spawn, minigame or event worlds from the chaos.
- **Server-safe by design** - the effect only triggers from a real jump event, never from sneaking, stepping or falling.

## Requirements

| | |
| - | - |
| Server | Paper, Purpur or forks that ship the Paper API (Spigot is not enough) |
| Minecraft | 26.1 and newer |
| Java | 21 or newer |
| Client | Vanilla - nothing to install for players |

## Getting started

1. Download the latest `.jar` from the [Modrinth project page](https://modrinth.com/plugin/onejumpalljump).
2. Drop it into your `plugins/` folder and restart.
3. Confirm your world is allowed: if `worlds.mode` is `whitelist`, your world must be listed in `worlds.list`.
4. Jump.

The generated `config.yml` covers cooldowns, velocity tuning, trigger chance, particles, sound, broadcast titles and the world list - every key is documented in the bundled configuration reference page.

## Commands

`/onejump stats` - your tracked jumps. `/onejump toggle` - flip the plugin on or off. `/onejump reload` - re-read the config file. Full command and permission reference lives in the sidebar.

## Where the detail lives

The configuration reference walks through every key with defaults, while the gameplay page explains the exact trigger chain and launch math.

## Links

- Source: [github.com/PotenFYR-Studios/ojaj](https://github.com/PotenFYR-Studios/ojaj)
- Modrinth: [modrinth.com/plugin/onejumpalljump](https://modrinth.com/plugin/onejumpalljump)
