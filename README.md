# Portfolio · Lucas Fanelli Sánchez

Personal portfolio for [Lucas Ariel Fanelli Sánchez](https://github.com/lucas-fanelli) — Computer Science + Mathematics undergraduate at the University of Málaga.

Built as a static-exported Next.js app so it can be deployed anywhere (Vercel, GitHub Pages, Netlify, S3, …) without a server.

---

## What's inside

- **Three designs, one site.** *One Night* is the default and the prerendered page: one night in a house, 20:00 to dawn, where a scroll-driven camera moves between rooms, one per project, with the project cards beside it. A floating pill at the bottom of the screen switches to *Navy Minimal* (recruiter-friendly, navy accent, generous whitespace) or *Terminal Dev* (monospace shell, ASCII chrome, ANSI palette). All render the same content from a single source of truth.
- **Shortcuts through the night.** The hero offers See the work, the CV (PDF) and email, plus "Skip the tour" to a compact list of every project; on phones the menu lists the night hour by hour, marks the scene on screen, and a thin line under the nav shows how far down the page you are.
- **Three colour themes** — `light`, `dark`, `navy` — apply to Navy Minimal and Terminal Dev. One Night has its own palette per scene.
- **Bilingual, one page per language.** `/` is prerendered in English and `/es/` in Spanish, each with its own `<html lang>`, metadata, share card and hreflang links; the language toggle moves between them without a reload.
- **Persisted preferences.** Design / theme / language choices the visitor makes survive reloads via `localStorage`; query params override them, e.g. `/?design=terminal&theme=light`.
- **Search and sharing.** schema.org `ProfilePage`/`Person` data, a sitemap with both languages, and share cards rendered from the One Night opening shot.
- **Five projects.** Withdrawal (Unity 6 horror game), Remy (Next.js recipe app — live at [remy-recipes.com](https://remy-recipes.com)), SleepSync (Kotlin/Compose adaptive alarm), Heladera (offline-first shared grocery PWA — live at [heladera-ec2b4.web.app](https://heladera-ec2b4.web.app)) and JARVIS (local real-time voice assistant). Code snippets and ASCII architecture diagrams are extracted from the real repos — nothing mocked.
- **AI ambience, real work.** One Night's room plates were generated with [Higgsfield](https://higgsfield.ai) (the site says so in its footer); the in-scene monitor shows real Withdrawal captures, and every snippet and diagram comes from the projects themselves.
- **Responsive across phone / tablet / desktop.** Fluid text sizing (`clamp` + viewport), stacked grids on narrow widths, hidden-vs-shown nav anchors; ASCII diagrams and code size themselves to their card instead of scrolling sideways.
- **Smooth animations.** Sliding indicator on the design pill and the language toggle, scale + colour transitions on theme swatches, hover lift on contact cards.

## Tech stack

| Component        | Choice                                   |
| ---------------- | ---------------------------------------- |
| Framework        | Next.js 15 (App Router, `output: "export"`) |
| Language         | TypeScript (strict)                      |
| UI               | React 18 — inline styles (Navy, Terminal), CSS Modules (One Night) |
| Fonts            | `next/font/local` — Inter, Instrument Serif, JetBrains Mono, self-hosted and subset (OFL licences in `app/fonts/`) |
| State            | `useState` / `useEffect` + `localStorage` |
| Build            | Static export → `out/`                   |
| Deploy           | Host-agnostic; configured for Vercel     |

## Local development

```bash
git clone https://github.com/lucas-fanelli/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

```bash
npm run dev         # hot-reload dev server
npm run build       # production static export to out/
npm run start       # serve the production build locally
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run cv          # print the one-page CVs (ES/EN) to public/cv/ with headless Chrome
npm run og          # render the share cards public/og.jpg and og-es.jpg with headless Chrome
npm run sizes       # write the smaller copies of the hero plate and portraits that srcset offers
```

Requires Node 22 (the `cv`, `og` and `sizes` scripts import files from `lib/` directly). `cv` and `og` look for Chrome at its default Windows path; set `CHROME` to use another binary. Re-run them after changing the content they print, and `sizes` after replacing one of the pictures it copies.

## Project structure

```
.
├── app/
│   ├── (en)/                    "/": root layout (lang="en") + page
│   ├── (es)/es/                 "/es/": root layout (lang="es") + page
│   ├── shell.tsx                the <html> both layouts share · fonts · boot script
│   ├── global-not-found.tsx     the 404 page (its own document)
│   ├── robots.ts, sitemap.ts    generated robots.txt and sitemap.xml
│   ├── fonts/                   self-hosted woff2 subsets + OFL licences
│   ├── globals.css              CSS reset + body font fallbacks
│   └── icon.svg                 favicon
├── components/
│   ├── PortfolioApp.tsx         tweaks state · localStorage + query-param prefs
│   ├── PortfolioNavy.tsx        Navy Minimal design
│   ├── PortfolioTerminal.tsx    Terminal Dev design
│   ├── PortfolioNight.tsx       One Night design (nav, hero, dawn/about)
│   ├── NightHouse.tsx           One Night's scroll-driven house scene + project cards
│   ├── NightProject.tsx         project card body shared by the scene
│   ├── DesignSwitcher.tsx       bottom-centre pill with sliding indicator
│   └── TweaksPanel.tsx          design / theme / language picker
├── lib/
│   ├── content.ts               bilingual content (identity, projects, …)
│   ├── seo.ts                   per-language metadata + schema.org data
│   ├── designs.ts               each design's background colour
│   ├── imageLoader.ts           next/image loader: which pictures have smaller copies, for srcset
│   ├── syntax.tsx               (unused) syntax tinter — kept for future
│   └── useViewport.ts           breakpoint hook (mobile / tablet / desktop)
├── public/night/                One Night plates, portrait and Withdrawal captures (webp)
├── public/cv/                   the CV PDFs (from scripts/cv.mjs)
├── scripts/                     cv.mjs, og.mjs (headless Chrome renders), sizes.mjs (image copies)
├── next.config.mjs              output: "export", image widths for srcset
└── package.json
```

## Editing content

All the bilingual strings, projects, skills, languages, and identity info live in [`lib/content.ts`](lib/content.ts). The schema is typed end-to-end; TypeScript will complain if a translation key is missing or a status / theme value is wrong.

Each project has `philosophy` and `quality` lists alongside the architecture diagram. Both are bilingual `string[]`s extracted from the project's own docs — they're not fabricated. If you change a project's real architecture, update the diagram and snippet here too.

## Deployment

This site is configured for **static export** (`output: "export"` in [`next.config.mjs`](next.config.mjs)). Running `npm run build` produces a fully static `out/` folder.

- **Vercel** — auto-detected. Push to `main` → live in ~60s. No environment variables required.
- **GitHub Pages / Netlify / S3 / Cloudflare Pages** — drop `out/` onto any static host.
