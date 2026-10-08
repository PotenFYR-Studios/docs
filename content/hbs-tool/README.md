# HBS-Tool

An offline-first, strictly read-only configuration-security review platform for enterprise servers. HBS scans server hardening configs against a tested ruleset, produces a sealed report with reproducible evidence, and never modifies a single file - the audit always stays on the audit's side of the line.

## What it is

HBS answers the classic enterprise question - "is this server actually hardened, and can you prove it?" - without agents, network write access or config drift risk. Run it offline, from a USB stick, on an airgapped machine, or in a pipeline; it always produces the same deterministic, tamper-sealed report.

## What it does

- **Read-only scans** - every check opens configurations in read mode; the tool has no write、patch or "fix it for you" path at all.
- **Rule catalog** - major hardening domains including SSH, users and authentication, network stack, filesystem perms, kernel runtime, logging and package state.
- **Sealed reports** - outputs produce a signed evidence chain: file hash, rule, matched evidence, verdict, and RL-bounded suggestions you can hand to an auditor.
- **Reproducible** - the same config and rule set always produce the same report, enabling regression detection between two snapshots.
- **EDR compatibility** - tested against common EDR/AV builds so scanning a production host does not detonate security tooling.

## Getting started

1. Download a release or build from source; one binary, no runtime deps.
2. Point HBS at the server root (or mount the target filesystem read-only in Docker for testing).
3. Run a scan - fully offline, no callers, no alerts; evidence is pasted in the plain human-readable output plus a machine JSON.
4. Re-run later and diff the two reports to identify drift.

## Where the detail lives

Sidebar pages include the extraction reference for every scanner module (SSH, user auth, network, systemd, filesystem, kernel), per-domain rule testcases, the report format and the validation engine that enforces evidence-chain consistency, plus an EDR compatibility matrix collected from real deployments.

## Links

- Source: [github.com/PotenFYR-Studios/HBS-Tool](https://github.com/PotenFYR-Studios/HBS-Tool)
- Releases: [github.com/PotenFYR-Studios/HBS-Tool/releases](https://github.com/PotenFYR-Studios/HBS-Tool/releases)
