<!-- markdownlint-disable -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,50:ec4899,100:f97316&height=220&section=header&text=ojaj&fontSize=52&fontColor=ffffff&fontAlignY=34&animation=twinkling" width="100%" alt="ojaj banner"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1200&color=8B5CF6&center=true&vCenter=true&width=800&lines=One+jump.+Everybody+jumps.;Random+launch+power%2C+particles%2C+pure+chaos;Paper+and+Purpur.+Server-side+only.;Whitelist+your+worlds.+Blacklist+your+sanity.)](https://github.com/PotenFYR-Studios/ojaj)

[![Modrinth](https://img.shields.io/badge/Modrinth-Download-1bd96a?style=for-the-badge&logo=modrinth&logoColor=white&labelColor=1c1e26)](https://modrinth.com/plugin/onejumpalljump)
[![Docs](https://img.shields.io/badge/Docs-/ojaj-8b5cf6?style=for-the-badge&logo=readme&logoColor=white&labelColor=1c1e26)](/ojaj)
[![License](https://img.shields.io/badge/License-Apache--2.0%20%2B%20Commons%20Clause-f97316?style=for-the-badge&logo=apache&logoColor=white&labelColor=1c1e26)](https://github.com/PotenFYR-Studios/ojaj/blob/master/LICENSE)
[![GitHub repo](https://img.shields.io/badge/GitHub-PotenFYR--Studios%2Fojaj-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=1c1e26)](https://github.com/PotenFYR-Studios/ojaj)
[![View](https://komarev.com/ghpvc/?username=PotenFYR-Studios-ojaj&color=ec4899&style=for-the-badge&label=VIEW&labelColor=1c1e26)](https://github.com/PotenFYR-Studios/ojaj)

</div>

**OneJumpAllJump** (short: **ojaj**) is a chaotic, server-side [Paper](https://papermc.io) plugin for Minecraft 26.1+ where **one player's jump launches every player on the server**: each with an independent random launch power, wrapped in particle bursts, synchronized sounds, fullscreen titles and a chat broadcast. The original Minecraft chaos plugin where physics becomes a group activity.

## ✨ What it does

- **Global synchronized jumps**: one real jump (Paper's `PlayerJumpEvent`) launches every online player in the same tick
- **Random launch power**: per-player roll between `0.35` and `1.10` by default; fixed velocity mode available (vanilla jump ≈ `0.42`)
- **Full spectacle kit**: particle bursts, particle trails, sounds, action bars, titles/subtitles, chat broadcasts, all configurable, all with `%player%`
- **Safeguards**: 5-tick re-entry lock (no infinite cascade), per-player cooldown, `onejump.bypass` opt-out, optional trigger chance, world whitelist/blacklist
- **Soft landings**: optional fall-damage cancellation (on by default)
- **Fast**: every config value is cached on load and after `/onejump reload`; zero per-jump file reads

> 🧪 **Alpha notice:** balancing tweaks, edge-case bugs and the occasional config change between versions are expected. Feedback and testing are appreciated.

## 🚀 Installation

1. Download the latest jar from [Modrinth](https://modrinth.com/plugin/onejumpalljump)
2. Drop it into your server's `plugins/` folder
3. Restart the server: a default `config.yml` is generated on first run
4. Jump.

Requires **Paper or Purpur** (the jump event is a Paper API; plain Spigot is not supported) for **Minecraft 26.1+**, Java 21+. Full guide: [Getting started](/ojaj/docs/getting-started.html).

## 🕹️ Commands & permissions

| Command | Description |
|---|---|
| `/onejump` (`/ojaj`) | Help menu |
| `/onejump toggle` | Flip the plugin on/off (writes to `config.yml`) |
| `/onejump reload` | Re-read `config.yml` from disk |
| `/onejump stats` | Your tracked global-jump count (in-memory) |

| Permission | Default | Description |
|---|---|---|
| `onejump.admin` | op | Required for every `/onejump` subcommand |
| `onejump.bypass` | false | Holder never triggers global jumps |

## 🎛️ Configuration

Everything lives in `plugins/OneJumpAllJump/config.yml`: launch power & randomness, cooldown, trigger chance, fall damage, particles, trails, sounds, action bar, titles, broadcasts and world whitelist/blacklist. A taste:

```yaml
velocity:
  y: 0.42              # vanilla jump ≈ 0.42
  random:
    enabled: true      # every player rolls their own power
    min: 0.35
    max: 1.10

trigger-chance:
  enabled: false
  chance: 100          # percent chance a jump triggers the chaos

worlds:
  mode: whitelist      # whitelist | blacklist
  list:
    - world
    - spawn
```

📖 **Every key is documented** in the [Configuration reference](/ojaj/docs/configuration.html).

## 📚 Documentation

Full documentation lives at **[/ojaj](/ojaj)**:

- [Getting started](/ojaj/docs/getting-started.html): install and first launch
- [Gameplay & mechanics](/ojaj/docs/gameplay.html): the exact trigger chain and launch math
- [Configuration](/ojaj/docs/configuration.html): full `config.yml` reference
- [Commands & permissions](/ojaj/docs/commands-permissions.html)
- [FAQ](/ojaj/docs/faq.html)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to build the plugin (Maven + Java 21) and the docs site (Bun + Vite), and how to open good issues and PRs.

## 🔒 Security

Found a vulnerability? Please report it privately; see [SECURITY.md](SECURITY.md). Do not open public issues for security reports.

## 📜 Licensing

ojaj is free for any purpose, commercial use included: run it on any server, fork it, modify it, self-host it, redistribute it, and build products or services around it. You may not sell the software itself, offer a paid product or service whose value derives entirely or substantially from this software's functionality, or use PotenFYR names, logos or trademarks. License notices you redistribute must carry the Commons Clause notice. The <https://github.com/PotenFYR-Studios/ojaj/blob/master/LICENSE> file is the single authoritative source, not this summary.

## Contributing

Contributions make the open-source community such an amazing place to learn, inspire and create. Any contributions you make are **greatly appreciated** - see [CONTRIBUTING.md](CONTRIBUTING.md) and the [good first issues](https://github.com/PotenFYR-Studios/ojaj/labels/good%20first%20issue). Security concerns: please use [SECURITY.md](SECURITY.md) (private vulnerability reporting), not public issues.

<a href="https://github.com/PotenFYR-Studios/ojaj/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=PotenFYR-Studios/ojaj" alt="ojaj contributors" />
</a>
<a href="https://github.com/PotenFYR-Studios/ojaj/stargazers">
  <img src="https://img.shields.io/github/stars/PotenFYR-Studios/ojaj?style=social&label=Stars" alt="Live star count" />
</a>
<a href="https://github.com/PotenFYR-Studios/ojaj/network/members">
  <img src="https://img.shields.io/github/forks/PotenFYR-Studios/ojaj?style=social&label=Forks" alt="Live fork count" />
</a>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/PotenFYR-Studios/FYRwall/output/github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/PotenFYR-Studios/FYRwall/output/github-snake.svg" />
  <img alt="Contribution snake animation" src="https://raw.githubusercontent.com/PotenFYR-Studios/FYRwall/output/github-snake.svg" width="100%" />
</picture>


---

## ⭐ Star History

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=potenfyr-studios/.github,potenfyr-studios/.web,potenfyr-studios/AuthCore,potenfyr-studios/CustomDamageNumbers,potenfyr-studios/Database-Eggs,potenfyr-studios/EchoingDeaths,potenfyr-studios/FYRwall,potenfyr-studios/HBS-Tool,potenfyr-studios/LinkFYR,potenfyr-studios/Minecraft-Eggs,potenfyr-studios/OrbyNode,potenfyr-studios/PteroOps-MCP,potenfyr-studios/Prog-Language-Eggs,potenfyr-studios/Shell-Eggs,potenfyr-studios/VigilFYR,potenfyr-studios/discord-botlists,potenfyr-studios/ojaj,potenfyr-studios/potenfyr-nest,potenfyr-studios/statfyr&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=potenfyr-studios/.github,potenfyr-studios/.web,potenfyr-studios/AuthCore,potenfyr-studios/CustomDamageNumbers,potenfyr-studios/Database-Eggs,potenfyr-studios/EchoingDeaths,potenfyr-studios/FYRwall,potenfyr-studios/HBS-Tool,potenfyr-studios/LinkFYR,potenfyr-studios/Minecraft-Eggs,potenfyr-studios/OrbyNode,potenfyr-studios/PteroOps-MCP,potenfyr-studios/Prog-Language-Eggs,potenfyr-studios/Shell-Eggs,potenfyr-studios/VigilFYR,potenfyr-studios/discord-botlists,potenfyr-studios/ojaj,potenfyr-studios/potenfyr-nest,potenfyr-studios/statfyr&type=Date" />
  <img alt="Star history chart for all PotenFYR Studios public repositories" src="https://api.star-history.com/svg?repos=potenfyr-studios/.github,potenfyr-studios/.web,potenfyr-studios/AuthCore,potenfyr-studios/CustomDamageNumbers,potenfyr-studios/Database-Eggs,potenfyr-studios/EchoingDeaths,potenfyr-studios/FYRwall,potenfyr-studios/HBS-Tool,potenfyr-studios/LinkFYR,potenfyr-studios/Minecraft-Eggs,potenfyr-studios/OrbyNode,potenfyr-studios/PteroOps-MCP,potenfyr-studios/Prog-Language-Eggs,potenfyr-studios/Shell-Eggs,potenfyr-studios/VigilFYR,potenfyr-studios/discord-botlists,potenfyr-studios/ojaj,potenfyr-studios/potenfyr-nest,potenfyr-studios/statfyr&type=Date" width="80%" />
</picture>

Every public PotenFYR Studios repository on one live chart, served by [star-history.com](https://star-history.com).

---

<!-- markdownlint-disable -->


<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:f97316,50:ec4899,100:8b5cf6&height=120&section=footer&text=Made%20with%20%E2%9D%A4%EF%B8%8F%20by%20PotenFYR%20Studios&fontSize=22&fontColor=ffffff&animation=twinkling" width="100%" alt="footer"/>

</div>
<!-- markdownlint-enable -->
