# Prog-Language-Eggs

One egg, one image, every language. A production-grade hosting platform egg for Pterodactyl, Pelican, Feather Panel, Kubernetes and Fly.io that installs, compiles and runs 50+ programming languages inside one container - with versions you can pin and per-container isolation.

## The idea

Panel hosts traditionally need one egg per language. This egg inverts that: one container image provides a language installer pool that provisions the requested runtime (interpreter or toolchain) at install time and runs your code with the panel's resource limits intact.

## What it gives you

- **50+ runtimes** - interpreted and compiled: Python, Node, Deno, Bun, Ruby, PHP, Java, Kotlin, Scala, Go, Rust, C, C++, C#, F#, Elixir, Erlang, Haskell, Lua, Perl, R, Julia, Dart, Swift, Zig, Gleam, Crystal, Nim and more.
- **Per-language version pinning** - each runtime supports exact version selection at install time with latest-version fallback.
- **Isolation** - runtimes live under the container's data path, so a rebuild is clean and panel backups include only what you keep.
- **Build-time safety** - compilation happens in the data path under the panel's resource controls, no host escalation, no global installs.
- **Multi-platform** - amd64 and arm64 images; runs on Pterodactyl/Pelican/Feather Panel, plain Docker, Compose, Kubernetes and Fly.io.

## Getting started

1. Import the egg JSON from the repo or the egg catalog (a single multi-egg covers all languages).
2. Pick the runtime with the `LANGUAGE` variable and pin `LANGUAGE_VERSION` if you want an exact one.
3. Set your startup file and command (for example `main.py` + `python main.py`); the egg runs it after install.
4. Deploy your code as usual (git clone, upload, drag-and-drop) - the installed stack is reused until the language or version changes.

## Where the detail lives

The sidebar includes the language catalog page (per-runtime table with default version, minimum version, install behavior and notes), the full variable reference, examples for the most common stacks, and the operations guide for resource tuning.

## Links

- Source: [github.com/PotenFYR-Studios/Prog-Language-Eggs](https://github.com/PotenFYR-Studios/Prog-Language-Eggs)
- Egg catalog: [nest.potenfyr.in](https://nest.potenfyr.in)
