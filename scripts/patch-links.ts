import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = "/mnt/hdd/Github-Repo/docs/content";
const slugByHost: Record<string, string> = {
  "statfyr.docs.potenfyr.in": "/statfyr",
  "ojaj.docs.potenfyr.in": "/ojaj",
  "authcore.docs.potenfyr.in": "/authcore",
  "cdn.docs.potenfyr.in": "/customdamagenumbers",
  "prog-language-eggs.docs.potenfyr.in": "/prog-language-eggs",
  "minecraft-eggs.docs.potenfyr.in": "/minecraft-eggs",
  "database-eggs.docs.potenfyr.in": "/database-eggs",
  "shell-eggs.docs.potenfyr.in": "/shell-eggs",
  "botlists.docs.potenfyr.in": "/discord-botlists",
  "linkfyr.docs.potenfyr.in": "/linkfyr",
  "hbs-tool.docs.potenfyr.in": "/hbs-tool",
  "vigilfyr.docs.potenfyr.in": "/vigilfyr",
  "orbynode.docs.potenfyr.in": "/orbynode",
  "fyrwall.docs.potenfyr.in/install.sh": "https://docs.potenfyr.in/fyrwall-install.sh",
  "fyrwall.docs.potenfyr.in": "/fyrwall",
  "echoingdeaths.docs.potenfyr.in": "/echoingdeaths",
  "echoing.docs.potenfyr.in": "/echoingdeaths",
  "potenfyr-studios.github.io/PteroOps-MCP": "https://docs.potenfyr.in/pteroops-mcp",
  "fenfyr-studios.github.io/FYRwall": "https://docs.potenfyr.in/fyrwall",
  "potenfyr-studios.github.io/VigilFYR": "https://docs.potenfyr.in/vigilfyr",
  "potenfyr-studios.github.io/OrbyNode": "https://docs.potenfyr.in/orbynode",
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

const files = walk(ROOT);
const hosts = Object.keys(slugByHost).sort((a, b) => b.length - a.length);
let patchCount = 0;
for (const f of files) {
  let s = readFileSync(f, "utf8");
  for (const h of hosts) {
    // tolerate protocol presence or absence, tolerate http/https
    for (const proto of ["https://", "http://", ""]) {
      const from = proto + h;
      if (s.includes(from)) {
        s = s.split(from).join(slugByHost[h]);
        patchCount++;
      }
    }
  }
  // trailing double slashes hygiene
  s = s.replace(/docs\.potenfyr\.in\/\/+/g, "docs.potenfyr.in/");
  writeFileSync(f, s);
}
console.log("patched", patchCount, "links across", files.length, "files");
