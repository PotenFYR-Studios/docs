# Shell-Eggs
Host any shell from one panel egg. Shell-Eggs is a multi-shell container egg for Pterodactyl, Pelican and Feather Panel that runs interactive SSH sessions - incoming SSH, tunneled, reverse, encrypted, covert and web shells - with credentials as the only required input.
## The idea
Giving shell access from a game panel in a container-safe, clearly controlled way. Pick the `SERVER_TYPE` (which maps to a shell flavor like `bash`, `zsh`, `python`, `node`, `alpine`, `webshell`), set credentials, and the container wires users, ports and tunnels automatically.
## What it gives you
- **One egg, many shells** - bash, zsh, ash, dash, fish,bourne family, python REPL, node REPL, busybox, and web-based shells with fine-grained option fields.
- **Credential-only setup** - you must only fill a username/password; every extra option has sane defaults and can be overridden via panel variables.
- **Multiple connection modes** - direct SSH on the panel port, reverse tunnels back to your host, encrypted covert channels and HTTP/WebSocket frontends.
- **Safety posture** - users are non-root, chrooted to the allocation, and the shell never inherits panel secrets.
## Getting started
1. Import the egg JSON from the release assets (or grab a fresh copy from the egg catalog site).
2. Create the server and set `SERVER_TYPE` to the shell you want (see egg catalog page for the list with required variables).
3. Fill the credential variables (at minimum username and password).
4. Start the server and connect: incoming shells listen on the panel port; tunneling and web shells print their URLs in the console on boot.
## Where the detail lives
The install page walks each panel variant, the variable catalog page carries the full table of variables (with per-shell notes), and the examples page shows ready-to-copy setups: a per-user SSH gateway, a web shell behind a reverse proxy, and a debugging shell inside a Kubernetes pod.
## Links
- Source: [github.com/PotenFYR-Studios/Shell-Eggs](https://github.com/PotenFYR-Studios/Shell-Eggs)
- Egg catalog: [nest.potenfyr.in](https://nest.potenfyr.in)
