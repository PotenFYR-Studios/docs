import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
for (const path of ["/repo/discord-botlists", "/repo/statfyr/commands", "/repo/minecraft-eggs/servertypes"]) {
  await page.goto("https://docs.potenfyr.in" + path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2800);
  const p = await page.evaluate(() => ({
    textPreview: (document.getElementById("root")?.innerText ?? "").replace(/\s+/g, " ").slice(0, 170),
    tables: document.querySelectorAll("table").length,
    lists: document.querySelectorAll(".doc-blocks ol, .doc-blocks ul").length,
    blockRoots: document.querySelectorAll(".doc-blocks").length,
    blockWidth: Math.round(document.querySelector(".doc-blocks")?.getBoundingClientRect().width ?? -1),
  }));
  console.log(path, JSON.stringify(p));
  await page.screenshot({ path: "/tmp/opencode/probe-" + path.replace(/[^a-z0-9]/gi, "_") + ".png" });
}
await browser.close();
