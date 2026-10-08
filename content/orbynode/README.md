# OrbyNode

The self-hosted control plane for coding agents. OrbyNode runs persistent terminal agents, owns their PTYs, files, tasks, git workflows, services and machine state in one daemon - and reconnects your browser without interrupting the work.

## What it does

- **Persistent agents** - each agent lives in a durable workspace: its PTY survives closes, crashes and day-long parallel task runs across machines.
- **Crash recovery and multi-user** - sessions attach and detach safely with role-scoped access; the audit trail explains every interaction.
- **Attention Center** - exactly one place that surfaces what an agent needs: completions, conflicts, approvals or failures.
- **Git-native workflows** - branch snapshots, patchsets, conflict checks and agent runs orchestrated around normal git.
- **REST + realtime** - versioned `/api/v1` HTTP surface plus sequenced event streaming with bounded replay.

## Who it is for

Engineering teams who want agents that keep working between sessions: run dozens of agents across dev machines, hold them in one place, know exactly which one needs you and never lose work to a browser refresh again.

## Core concepts

| | |
| - | - |
| Daemon | The single root process on each machine; owns PTYs, files, state |
| Workspace | An agent's durable home: project files, session state, task graph |
| Attention Center | Notification and approval surface for what needs a human |
| Remote nodes | Machines paired to a fleet parent for multi-machine control |

## Getting started

1. Download a signed release or use the installer script from the installation page.
2. Start the daemon: `orbynode start` and open the web console it prints.
3. Create your first workspace, attach an agent CLI (Claude Code, Codex, OpenCode, or your own), and give it a task.
4. Pair a second machine as a remote node with `orbynode pair add` when you need a fleet.

## Where the detail lives

Every subsystem has a page: the architecture and ADR catalog explain the daemon-centric design; operations covers filesystem layout, backups and upgrades; rest-api, realtime and notifications pages document the integration surfaces. Start with getting-started, then operations for daily care.

## Links

- Source: [github.com/PotenFYR-Studios/OrbyNode](https://github.com/PotenFYR-Studios/OrbyNode)
- Releases: [github.com/PotenFYR-Studios/OrbyNode/releases](https://github.com/PotenFYR-Studios/OrbyNode/releases)
