# CustomDamageNumbers

Custom damage numbers, animated and packet-only, for your Minecraft server. Critical hits pop in hand-tuned styles, hits merge into cleaner stacks, numbers follow entities, and players can tune their own display - all carried over vanilla packets so no client mod is required.

## What it does

- **Animated damage indicators** - clean numbers with configurable fonts, colors, shapes and per-type styling (normal, critical, fire, explosive, magic).
- **Hit merging** - multiple rapid hits on the same target merge into one readable number instead of an unreadable number storm.
- **Entity-following animations** - numbers ride the target so the display tracks the hit cleanly.
- **Style profiles** - named styles players or admins can switch (`/cdn style <player> <profile|default>`), plus per-player toggles.
- **Packet-only** - uses vanilla display entities and packets, so the vanilla client renders everything with no resource pack and no client mod.

## Getting started

1. Drop the jar into `plugins/` (Paper/Spigot) and restart.
2. Run `/cdn stats` to see active counters and viewer slots, `/cdn test <type> <amount>` to preview a display.
3. Tune the generated config: styles per damage type, merge window, animation lifetime, and the per-player default.
4. `grant` or `revoke` the style permission from your permission plugin for player choice.

## The deep dive

The docs page in the sidebar documents every config key style-by-style, the examples page shows ready-made profiles (PvP numbers, event champions, MMO crits) and the license page covers what you may do with the jar.

## Links

- Source: [github.com/PotenFYR-Studios/CustomDamageNumbers](https://github.com/PotenFYR-Studios/CustomDamageNumbers)
- Releases: [github.com/PotenFYR-Studios/CustomDamageNumbers/releases](https://github.com/PotenFYR-Studios/CustomDamageNumbers/releases)
