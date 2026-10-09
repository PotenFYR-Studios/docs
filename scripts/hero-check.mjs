/* Verify the 2 hero comments live. */
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto("http://127.0.0.1:5199/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);

const badge = await page.evaluate(() => {
  const el = [...document.querySelectorAll("span")].find((s) => s.textContent.includes("open-source projects"));
  return el?.textContent.trim() ?? null;
});
const orbits = await page.evaluate(() => {
  // count orbiting icon chips: elements with pp-spin animation inside the hero logo block
  const hero = document.querySelector(".pp-glow-ring")?.parentElement;
  if (!hero) return null;
  return { orbiting: hero.querySelectorAll('[style*="pp-orbit"]').length };
});
console.log("badge:", JSON.stringify(badge));
console.log("orbits:", JSON.stringify(orbits));
await page.screenshot({ path: "/tmp/shot-hero-calm.png" });
await browser.close();
