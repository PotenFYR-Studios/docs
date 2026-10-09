# EchoingDeaths
Immersive death-based curses for Paper and Spigot servers. When a player dies, nearby players inherit a thematic curse - a debuff that spreads on a delay, stacks with other deaths and makes death in your world mean something again.
## What it does
- **Death curses** - a configurable pool of debuff effects attached to death events, chosen by weight, category or rarity.
- **Proximity echo** - curses reach only players inside a configurable radius, so the victim's party suffers most except when you widen the blast.
- **Thematic variety** - blindness, weakness, mining fatigue, slowness, marking sounds: every curse maps to a Bukkit effect with its own duration and lore.
- **Fully broadcast-aware** - victims, echo targets and the server see real, customizable messages for every stage of the curse.
## Who it is for
Survival, PvP, RPG and horror-themed Paper or Spigot servers looking for atmospheric consequences instead of another must-have death ban.
## Getting started
1. Drop the EchoingDeaths jar into `plugins/` and restart.
2. Edit the generated `config.yml`: choose the curse pool, radii, weights and messages per curse.
3. `/echoing reload` to apply changes live (full command reference in the sidebar).
Vanilla-compatible: no resource pack, no client mod, no dependencies on other plugins unless you want them.
## Where the detail lives
Each curse effect is documented with duration, amplifier and player experience, alongside the configuration reference and the full commands list in the sidebar.
## Links
- Source: [github.com/PotenFYR-Studios/EchoingDeaths](https://github.com/PotenFYR-Studios/EchoingDeaths)
- Modrinth: [modrinth.com/plugin/echoing-deaths](https://modrinth.com/plugin/echoing-deaths)
