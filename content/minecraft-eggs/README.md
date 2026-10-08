# Minecraft-Eggs

One egg, every Minecraft server type. A universal egg for Pterodactyl, Pelican, Feather Panel and plain Docker that carries Vanilla, Paper, Purpur, Spigot, Folia, Fabric, Forge, NeoForge, Quilt, Velocity, Waterfall, BungeeCord, Bedrockdedicated (BDS), Nukkit, PocketMine and more, all in a single container image with automatic Java selection and crash recovery.

## The idea

Instead of maintaining a different egg per engine, this egg ships one launcher that asks for a `SERVER_TYPE` variable and installs the requested engine on demand - every engine pinned to the version you choose (Alpha to 26.x for Java, any release for Bedrock and proxies).

## What it gives you

- **18+ engine profiles** - curated, container-tested `SERVER_TYPE` values with sane defaults for ports, memory and launcher flags.
- **Automatic Java** - leave `JAVA_VERSION` empty and the launcher downloads and selects the correct JVM (8, 17, 21, 26+) on demand.
- **Memory and flag optimization** - sensible defaults around Aikar and ZGC-style flags, tweakable from panel variables.
- **Safe instance switching** - change `SERVER_TYPE` on an existing instance and the launcher migrates the layout instead of clobbering your world.
- **Diagnostics toolset** - a full diagnostics subcommand set for version checks, environment introspection and crash-kit collection.
- **Panel behavior suite** - every push runs a Docker-based suite that mimics real panel behavior (start, stop, version pinning, upgrades).

## Getting started

1. In your panel, import the egg JSON from the release assets or grab it from the egg catalog page (per-engine cards list `SERVER_TYPE`, ports and required variables).
2. Create a server with the egg. Required variables are only `SERVER_TYPE` plus the engine-specific extras (like `MINECRAFT_VERSION` or `GITHUB_REPO` for engine `github`).
3. Start the server. First launch downloads the engine and JVM; later launches reuse the cached layout.
4. Tune with panel variables - check the variables page for the full table.

## Where the detail lives

The sidebar pages carry the **engine catalog** (a card per engine with versions, ports and required variables), the **Java auto-selection table**, version-fallback rules, **examples** of ready-to-go panel presets and install instructions for each panel type.

## Links

- Source: [github.com/PotenFYR-Studios/Minecraft-Eggs](https://github.com/PotenFYR-Studios/Minecraft-Eggs)
- The synced catalog lives at [nest.potenfyr.in](https://nest.potenfyr.in)
