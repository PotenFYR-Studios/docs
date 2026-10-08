import { chromium } from "playwright";
const urls = [
  "https://docs.potenfyr.in/",
  "https://docs.potenfyr.in/repo/authcore",
  "https://docs.potenfyr.in/repo/fyrwall/configuration",
  "https://docs.potenfyr.in/repo/orbynode/adr/001-daemon-architecture",
  "https://docs.potenfyr.in/repos",
];
const browser = await chromium.launch();
for (const url of urls) {
  const errs: string[] = [];
  const page = await browser.newPage();
  page.on("pageerror", (e) => errs.push(String(e.message)));
  page.on("console", (m) => { if (m.type() === "error") errs.push("console:" + m.text().slice(0, 120)); });
  const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2200);
  const root = await page.evaluate(() => document.getElementById("root")?.children.length ?? -1);
  const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 130);
  console.log(`\n══ ${url} (${resp?.status()}, root=${root})`);
  console.log("  ", text || "(EMPTY)");
  if (errs.length) { console.log("   ERRORS:"); errs.slice(0, 4).forEach(e => console.log("     -", e)); }
  else console.log("   ✓ clean");
  await page.close();
}
await browser.close();
