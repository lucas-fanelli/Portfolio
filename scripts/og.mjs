// Renders the share cards (1200×630 JPEG) to public/og.jpg (English) and public/og-es.jpg (Spanish):
//   npm run og
// The opening shot of One Night: the kitchen at 20:00 with the hero's portraits, name and role.
// Every word comes from lib/content.ts; fonts and pictures are the site's own files.
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { identity, strings } from "../lib/content.ts";
import { fileUrl, renderWithChrome } from "./chrome.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const asset = (...parts) => fileUrl(join(root, ...parts));
const font = (file) => asset("app", "fonts", file);

const CARDS = { en: "og.jpg", es: "og-es.jpg" };

function html(lang) {
  const t = (value) => value[lang];
  const words = identity.name.split(" ");
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: "Instrument Serif"; src: url("${font("InstrumentSerif-Regular.woff2")}"); }
  @font-face { font-family: "Instrument Serif"; font-style: italic; src: url("${font("InstrumentSerif-Italic.woff2")}"); }
  @font-face { font-family: "Inter"; font-weight: 400 700; src: url("${font("InterVariable.woff2")}"); }
  @font-face { font-family: "JetBrains Mono"; src: url("${font("JetBrainsMono-Regular.woff2")}"); }
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #0b0c0e; }
  .plate { position: absolute; inset: 0; background: url("${asset("public", "night", "house-kitchen.webp")}") 50% 58% / cover; }
  .shade {
    position: absolute; inset: 0;
    background:
      linear-gradient(90deg, rgba(11, 12, 14, 0.94) 0%, rgba(11, 12, 14, 0.8) 34%, rgba(11, 12, 14, 0.2) 68%, rgba(11, 12, 14, 0.05) 100%),
      linear-gradient(0deg, rgba(11, 12, 14, 0.7) 0%, rgba(11, 12, 14, 0) 42%);
  }
  .lamp {
    position: absolute; left: 25.5%; top: 18%; width: 360px; height: 360px; translate: -50% -50%; border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 196, 120, 0.3) 0%, rgba(255, 196, 120, 0) 62%); mix-blend-mode: screen;
  }
  .content { position: absolute; left: 72px; bottom: 60px; color: #efe7da; }
  .portraits { display: flex; gap: 10px; margin-bottom: 22px; }
  .portraits img {
    width: 88px; height: 110px; object-fit: cover; border-radius: 12px; filter: saturate(0.92) contrast(1.04);
    -webkit-mask-image: linear-gradient(to bottom, #000 58%, transparent 100%);
  }
  .hour { display: flex; align-items: center; gap: 14px; margin: 0; font: 15px "JetBrains Mono", monospace; letter-spacing: 0.16em; text-transform: uppercase; color: #e8b86a; }
  .hour::before { content: ""; width: 36px; height: 1px; background: currentColor; }
  h1 { margin: 20px 0 22px; font: 400 116px/0.88 "Instrument Serif", serif; letter-spacing: -0.025em; }
  h1 em { display: block; color: #d8c7ab; }
  .role { margin: 0; font: 400 26px/1.3 "Inter", sans-serif; }
  .corner { position: absolute; right: 72px; bottom: 60px; text-align: right; color: #efe7da; }
  .cue { margin: 0 0 10px; font: italic 34px "Instrument Serif", serif; }
  .site { margin: 0; font: 15px "JetBrains Mono", monospace; letter-spacing: 0.08em; color: #a39b8f; }
</style>
</head>
<body>
  <div class="plate"></div>
  <div class="lamp"></div>
  <div class="shade"></div>
  <div class="content">
    <div class="portraits">
      <img src="${asset("public", "night", "lucas.webp")}" alt="">
      <img src="${asset("public", "night", "lucas-2.webp")}" alt="">
    </div>
    <p class="hour">20:00 — ${t(strings.night.hours.dusk)}</p>
    <h1>${words.slice(0, 2).join(" ")} <em>${words.slice(2).join(" ")}.</em></h1>
    <p class="role">${t(strings.hero.role)}.</p>
  </div>
  <div class="corner">
    <p class="cue">${t(strings.night.kicker)}</p>
    <p class="site">portfolio-lucasfanelli.com</p>
  </div>
</body>
</html>`;
}

for (const lang of ["en", "es"]) {
  const out = join(root, "public", CARDS[lang]);
  // --virtual-time-budget lets the fonts and images finish loading before the capture.
  renderWithChrome(html(lang), [`--screenshot=${out}`, "--window-size=1200,630", "--force-device-scale-factor=1", "--virtual-time-budget=5000"]);
  if (!existsSync(out) || statSync(out).size === 0) throw new Error(`${CARDS[lang]} was not written`);
  console.log(`${CARDS[lang]}: ${Math.round(statSync(out).size / 1024)} KB`);
}
