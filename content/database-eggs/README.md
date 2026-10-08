# Database-Eggs

One egg, every database. Multi-database container eggs for Pterodactyl, Pelican, Feather Panel, Wisp and plain Docker: from MariaDB, MySQL and PostgreSQL to MongoDB, Redis, ClickHouse, Elasticsearch and dozens more - installed isolated, on demand, inside the container on first boot.

## The idea

Maintaining one egg per database does not scale. These eggs ship one launcher per database family that asks for a `SERVER_TYPE` variable and installs the exact engine plus version you request - even on shared hosts where only one panel egg must cover everything.

## What it gives you

- **50+ database engines** across SQL, NoSQL, in-memory, vector, search, graph and object storage families (60+ with forks and variants).
- **Version pinning** - exact versions per engine via a `SERVER_VERSION` variable, resolved at install time and cached in the container.
- **Isolated data directories** - every install keeps its data, conf and logs under one mount so panel backups capture everything.
- **Panel-friendly ports** - the DB port binds to the port the panel allocates; no host networking constraints.
- **Client tools installed on demand** - `psql`, `mysql`, `redis-cli`, `mongosh` and friends are deployed next to the server for immediate debugging.

## Getting started

1. Import the egg JSON for the desired family (SQL, NoSQL, cache, search and object storage are grouped into one `egg-database-multi.json`).
2. Point a new server at it, pick `SERVER_TYPE` (for example `postgresql`, `vault`, `influxdb`).
3. Optionally pin `SERVER_VERSION`, choose an auth mode and start.
4. Connect with the database client of your choice on the panel-allocated port.

## Where the detail lives

The egg catalog page in the sidebar lists every engine with required variables, default data paths and client utilities. The install guide covers panel setup, and the configuration reference explains every variable, including advanced overrides.

## Links

- Source and egg JSON: [github.com/PotenFYR-Studios/Database-Eggs](https://github.com/PotenFYR-Studios/Database-Eggs)
- Synced catalog: [nest.potenfyr.in](https://nest.potenfyr.in)
