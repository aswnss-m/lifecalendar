// Self-check for the date and wallpaper param helpers. Run with: bun run check
import { parseWallpaperMeta } from "../lib/wallpaper-meta";
import { yearProgress, totalDays, monthsData } from "../lib/days-in-year";
import assert from "node:assert";
const d = parseWallpaperMeta({});
assert.equal(d.columns, 10); assert.equal(d.passedColor, "#ef4444"); assert.equal(d.showPercentage, true); assert.equal(d.style, "flat");
const q = parseWallpaperMeta(Object.fromEntries(new URLSearchParams("columns=0&boxWidth=99999999&passedColor=abc&leftColor=red;x&showPercentage=false&style=monthly&radius=50")));
assert.equal(q.columns, 10); assert.equal(q.boxWidth, 25); assert.equal(q.passedColor, "#abc"); assert.equal(q.leftColor, "#fecaca"); assert.equal(q.showPercentage, false); assert.equal(q.style, "monthly"); assert.equal(q.radius, 50);
assert.equal(parseWallpaperMeta({ passedColor: "#E8E5DF", columns: 15 }).passedColor, "#E8E5DF");
assert.equal(parseWallpaperMeta(null).columns, 10);
assert.equal(totalDays(2024), 366); assert.equal(totalDays(2026), 365);
assert.equal(monthsData(2024)[1].days, 29); assert.equal(monthsData(2026)[0].name, "Jan");
const p = yearProgress("Not/AZone"); assert.ok(p.passed >= 0 && p.passed < p.total);
const k = yearProgress("Asia/Kolkata"); assert.ok(k.secondsUntilMidnight > 0 && k.secondsUntilMidnight <= 86400);
assert.ok(Number.isInteger(k.passed));
console.log("ok");
