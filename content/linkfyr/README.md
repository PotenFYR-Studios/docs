# LinkFYR
One control layer for what your apps do on the network: which interface carries each app, how much bandwidth it gets, which VPN or DNS it uses, how traffic behaves when quality changes, and a full, explainable history of why. Written in Rust for macOS, Linux, Windows, desktop and mobile clients, with one deterministic account-level contract.
## What it does
- **Per-app interface routing** - route specific apps over Wi-Fi, Ethernet, hotspot, VPN or cellular per policy; everything else stays default.
- **Bandwidth shaping** - rate limits per app or per group, scheduled bursts, and a clean curve when the link degrades.
- **VPN and DNS policy** - split DNS, per-app VPN pinning, leak prevention, and an explicit per-rule "why did this happen" trail.
- **Explainable behavior** - every rule decision is logged with a reason, so a surprising route has a cause you can read.
- **One consistent model** - 108 real tools grouped into one registry, versioned IPC contract, and typed clients for daemon, desktop and CLI.
## Who it is for
Developers juggling hotspot vs VPN routing, teams enforcing "this tool always goes through the VPN", homelab admins shaping bandwidth per container, and anyone who wants their traffic behavior logged and explainable instead of mysterious.
## Getting started
1. Download a signed release for your platform (x64, ARM64 and universal builds) from the releases page.
2. Run the daemon (`linkfyrd`); it owns state, policy, scheduling and the IPC surface.
3. Use the desktop app or CLI to author rules: `linkfyr rule add <app> --interface <name> --bw <kbit/s>`.
4. Check `linkfyr status` for a live view of every active decision and its reason.
The daemon runs per-user (no admin escalation) or as a system service; the security model and threat model pages explain the boundaries that keep this safe.
## Where the detail lives
The sidebar carries the architecture page, per-section rule kinds (network, bandwidth, VPN/DNS), platform capability matrix with an honest "not supported here's what we do instead" list, protocol spec for the IPC bridge, and the full roadmap including the competitive survey and user-demand research.
## Links
- Source: [github.com/PotenFYR-Studios/LinkFYR](https://github.com/PotenFYR-Studios/LinkFYR)
- Releases: [github.com/PotenFYR-Studios/LinkFYR/releases](https://github.com/PotenFYR-Studios/LinkFYR/releases)
