import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
const errs: string[] = [];
page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 150)));
for (const path of ["/", "/repo/discord-botlists", "/repo/statfyr", "/repo/authcore/26x", "/repo/minecraft-eggs/servertypes"]) {
  await page.goto("https://docs.potenfyr.in" + path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600);
  const text = await page.evaluate(() => ((document.getElementById("root")?.innerText ?? "(EMPTY)") as string).replace(/\s+/g, " ").slice(0, 170));
  const badgeLeak = await page.evaluate(() => document.body.innerText.includes("img.shields.io") || document.body.innerText.includes("!(npm") || document.body.innerText.includes("markdown"));
  console.log(path, "→", text.slice(0, 140), badgeLeak ? "⚠ BADGE LEAK" : errs.length ? "❌ " + errs[0] : "✓");
}
await browser.close();
process.exit(0);
