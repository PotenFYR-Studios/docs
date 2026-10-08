# discord-botlists

The universal multi-botlist SDK for Discord bots: post server and shard stats to every verified botlist, receive realtime vote webhooks, and parse every botlist's API shape into one normalized model - all from one zero-dependency package.

## What it does

- **Stats posting** to verified, live botlists, each with its correct wire format, auth header and endpoint learned from the list's own API docs plus the BotBlock directory. Dead lists get pruned automatically by the hourly status sync.
- **Realtime vote, comment and review events** through a built-in webhook server with typed events - no polling, no delay, and no express dependency.
- **Universal parser** that normalizes any list's bot payload into one `UniversalBot` shape so you never juggle `server_count`, `guildCount`, `guilds` and `count` again.
- **Status tracking** - automated hourly probes detect deprecated or shut-down lists, tracking latency and HTTP state per list.
- **Fully typed** - strict TypeScript, generic event emitter, and autocomplete for every option.

## The idea

Posting stats and handling every list's webhook format yourself means weeks of glue code. This SDK does it with no runtime dependencies and no framework lock-in.

## Getting started

1. `npm install @potenfyrstudios/discord-botlists` (or `bun add`, `pnpm add`).
2. With a Discord client: pass `client` and the SDK reads `guilds.cache.size` and shard info automatically. Without a framework: pass `statsProvider` and compute stats yourself.
3. Call `botlists.post()` on an interval or after each shard-ready event.
4. For votes: start the built-in server and point each list's webhook URL at `https://your-domain:8080/discord-botlists/<list-id>`.

## Where the detail lives

The docs pages carry the full API reference (per-module), theme configuration for the webhook server, and webhook security (signature verification for every offending list plus example verification strategies).

## Works everywhere

discord.js, Eris, Oceanic, or anything with a `guilds` cache - or no framework at all. Node 18+ or Bun 1.1+.

## Links

- npm: [npmjs.com/package/@potenfyrstudios/discord-botlists](https://www.npmjs.com/package/@potenfyrstudios/discord-botlists)
- Source: [github.com/PotenFYR-Studios/discord-botlists](https://github.com/PotenFYR-Studios/discord-botlists)
