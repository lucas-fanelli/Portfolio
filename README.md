# Portfolio · Lucas Fanelli Sánchez

Personal portfolio for [Lucas Ariel Fanelli Sánchez](https://github.com/lucas-fanelli) — Computer Science + Mathematics undergraduate at the University of Málaga.

Built as a static-exported Next.js app so it can be deployed anywhere (Vercel, GitHub Pages, Netlify, S3, …) without a server.

---

## What's inside

- **Three designs, one site.** A floating pill at the bottom of the screen flips between *Navy Minimal* (recruiter-friendly, navy accent, generous whitespace), *Terminal Dev* (monospace shell, ASCII chrome, ANSI palette) and *One Night* (one night in a house, 20:00 to dawn: a scroll-driven camera moves between rooms, one per project, with the project cards beside it). All render the same content from a single source of truth.
- **Three colour themes** — `light`, `dark`, `navy` — apply to Navy Minimal and Terminal Dev. One Night has its own palette per scene.
- **Bilingual** — every string ships in English and Spanish; toggle from the nav or the Tweaks panel.
- **Persisted preferences.** Design / theme / language choices survive reloads via `localStorage`; query params override them, e.g. `/?design=night&lang=es`.
- **Five projects.** Withdrawal (Unity 6 horror game), Remy (Next.js recipe app — live at [remy-recipes.com](https://remy-recipes.com)), SleepSync (Kotlin/Compose adaptive alarm), Heladera (offline-first shared grocery PWA — live at [heladera-ec2b4.web.app](https://heladera-ec2b4.web.app)) and JARVIS (local real-time voice assistant). Code snippets and ASCII architecture diagrams are extracted from the real repos — nothing mocked.
- **AI ambience, real work.** One Night's room plates were generated with [Higgsfield](https://higgsfield.ai) (the site says so in its footer); the in-scene monitor shows real Withdrawal captures, and every snippet and diagram comes from the projects themselves.
- **Responsive across phone / tablet / desktop.** Fluid Architecture text sizing (`clamp` + viewport), stacked grids on narrow widths, hidden-vs-shown nav anchors, scroll-overflow on wide ASCII art.
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
```

Requires Node 18.17+.

## Project structure

```
.
├── app/
│   ├── fonts/                   self-hosted woff2 subsets + OFL licences
│   ├── globals.css              CSS reset + body font fallbacks
│   ├── icon.svg                 favicon
│   ├── layout.tsx               root layout · fonts · SEO metadata
│   └── page.tsx                 mounts PortfolioApp (server entry)
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
│   ├── syntax.tsx               (unused) syntax tinter — kept for future
│   └── useViewport.ts           breakpoint hook (mobile / tablet / desktop)
├── public/night/                One Night plates, portrait and Withdrawal captures (webp)
├── next.config.mjs              output: "export"
└── package.json
```

## Editing content

All the bilingual strings, projects, skills, languages, and identity info live in [`lib/content.ts`](lib/content.ts). The schema is typed end-to-end; TypeScript will complain if a translation key is missing or a status / theme value is wrong.

Each project has `philosophy` and `quality` lists alongside the architecture diagram. Both are bilingual `string[]`s extracted from the project's own docs — they're not fabricated. If you change a project's real architecture, update the diagram and snippet here too.

## Deployment

This site is configured for **static export** (`output: "export"` in [`next.config.mjs`](next.config.mjs)). Running `npm run build` produces a fully static `out/` folder.

- **Vercel** — auto-detected. Push to `main` → live in ~60s. No environment variables required.
- **GitHub Pages / Netlify / S3 / Cloudflare Pages** — drop `out/` onto any static host.
