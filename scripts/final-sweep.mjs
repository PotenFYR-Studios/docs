/* Final full-site verification: every page, live browser, five failure classes. */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const reg = JSON.parse(readFileSync("/mnt/hdd/Github-Repo/docs/src/data/registry.json", "utf8"));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

const errs = [];
let lastUrl = "";
page.on("console", (m) => { if (m.type() === "error") errs.push(`[js] ${lastUrl} :: ${m.text().slice(0, 120)}`); });
page.on("pageerror", (e) => errs.push(`[crash] ${lastUrl} :: ${e.message.slice(0, 120)}`));

let checked = 0;
const failures = { empty: [], dupH1: [], giantHeading: [], pipeTable: [], consoleErr: 0 };

async function check(url) {
  lastUrl = url;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(160);
  const r = await page.evaluate(() => {
    const art = document.querySelector("article");
    const txt = art?.innerText?.trim() ?? "";
    const h1s = [...document.querySelectorAll("h1")].map((h) => h.textContent.trim());
    const giant = [...document.querySelectorAll("article h1, article h2")].filter((h) => h.textContent.trim().length > 100).length;
    const pipes = [...document.querySelectorAll("article p")].filter((p) => { const outside = p.cloneNode(true); outside.querySelectorAll("code").forEach((c) => c.remove()); return (outside.textContent.match(/\|/g) || []).length >= 3; }).length;
    return { len: txt.length, h1s, giant, pipes };
  });
  checked++;
  if (r.len < 60) failures.empty.push(url);
  if (r.h1s.length > 2) failures.dupH1.push(`${url} :: ${JSON.stringify(r.h1s.slice(0, 3))}`);
  if (r.giant > 0) failures.giantHeading.push(url);
  if (r.pipes > 0) failures.pipeTable.push(url);
}

await check("http://127.0.0.1:5199/");
await check("http://127.0.0.1:5199/repos");
await check("http://127.0.0.1:5199/nope-404");
for (const repo of reg.repos) {
  for (const p of repo.pageList) {
    await check(`http://127.0.0.1:5199/repo/${repo.slug}/${p.path.replace(/\.(html|md)$/, "")}`);
  }
}
failures.consoleErr = errs.length;

console.log(`checked: ${checked} routes`);
console.log(`empty pages: ${failures.empty.length}`, failures.empty.slice(0, 5));
console.log(`dup-H1 pages: ${failures.dupH1.length}`, failures.dupH1.slice(0, 5));
console.log(`giant-heading pages: ${failures.giantHeading.length}`, failures.giantHeading.slice(0, 5));
console.log(`raw-pipe table pages: ${failures.pipeTable.length}`, failures.pipeTable.slice(0, 5));
console.log(`js/console errors: ${failures.consoleErr}`, errs.slice(0, 5));
await browser.close();
