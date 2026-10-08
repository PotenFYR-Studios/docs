import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 1050 } });
for (const [i, path] of [["1", "/repo/discord-botlists"], ["2", "/repo/statfyr/commands"], ["3", "/"]].entries()) {
  await page.goto("https://docs.potenfyr.in" + path[1], { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const p = await page.evaluate(() => ({
    width: Math.round(document.querySelector("main")?.getBoundingClientRect().width ?? -1),
    tables: document.querySelectorAll("table").length,
    lists: document.querySelectorAll("ol, ul").length,
    codeCards: document.querySelectorAll("[class*='font-mono']").length,
  }));
  console.log(path[1], JSON.stringify(p));
  await page.screenshot({ path: `/tmp/opencode/v-${path[0]}.png` });
}
await browser.close();
