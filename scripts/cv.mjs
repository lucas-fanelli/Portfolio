// Prints the one-page CV in Spanish and English to public/cv/ (linked from the One Night hero):
//   npm run cv
// Name, contact, grades and degree come from lib/content.ts, so they match the site. The rest is
// CV-only text, condensed from the project pages and Lucas's own CVs (June 2026). Layout and style
// follow those CVs: A4, Calibri, navy accent, two columns, one page. The phone number is left out
// because this copy is public.
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { academics, identity, strings } from "../lib/content.ts";
import { renderWithChrome } from "./chrome.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "portfolio-lucasfanelli.com";

const CV = {
  es: {
    file: "lucas-fanelli-cv-es.pdf",
    role: "Desarrollador de Software · Trainee / Working Student",
    location: "Vélez-Málaga, España",
    summary: `Estudiante de 3.er curso del Doble Grado en Ingeniería Informática + Matemáticas (UMA, ${academics.gpa.es} de media). <b>Desarrollador asistido por IA</b>: diseño y dirijo proyectos web, móviles y de videojuegos hasta producción, con la IA como herramienta de apoyo y no como sustituto del criterio técnico. Foco en Clean Architecture, SOLID y testing (TDD/E2E). Busco un rol de <i>working student / junior</i> para crecer dentro de un equipo.`,
    h: { projects: "Proyectos", education: "Formación", experience: "Experiencia", skills: "Habilidades técnicas", certs: "Certificaciones", languages: "Idiomas", interests: "Intereses" },
    projects: [
      {
        title: "Remy — Plataforma de recetas (full-stack, en producción)",
        link: "remy-recipes.com",
        stack: "Next.js 16 · TypeScript · Prisma · PostgreSQL · Vercel",
        text: "Red social de recetas: autenticación JWT/bcrypt, perfiles con follows, likes y comentarios, despensa con <i>matching</i> de recetas y PWA instalable. Clean Architecture + Repository pattern. CI/CD con GitHub Actions y Sentry; <b>1.161 tests con 98 % de cobertura</b> (Jest + Playwright E2E).",
      },
      {
        title: "Heladera — Lista de compras compartida (PWA, en producción)",
        link: "heladera-ec2b4.web.app",
        stack: "TypeScript · React 19 · Vite · Firebase",
        text: "Lista que una familia usa a diario, <b>sin conexión y en tiempo real</b>. Listas privadas con invitaciones que vencen y sin backend propio: el acceso lo deciden las reglas de Firestore, probadas caso por caso en el emulador. Una misma suite de contrato prueba el Db falso y Firestore; 28 decisiones de arquitectura documentadas.",
      },
      {
        title: "SleepSync — App Android",
        note: "(Google Play · beta interna)",
        stack: "Kotlin · Jetpack Compose · Hilt · Room · Health Connect",
        text: "Detecta cuándo el usuario se duerme con un sistema de <b>dos capas</b> (confirmación por popups + acelerómetro/actividad) y ajusta la alarma automáticamente. Calibración adaptativa, 100 % offline y bilingüe. Arquitectura modular limpia + MVVM; tests con JUnit 5, MockK y Turbine.",
      },
      {
        title: "Withdrawal — Juego",
        note: "(Unity · objetivo Steam)",
        stack: "C# · Unity 6 (URP) · ElevenLabs",
        text: "Terror psicológico en primera persona. Motor de eventos de horror dirigido por datos (ScriptableObjects), modelo de miedo que modula luz, audio y efectos en tiempo real, y sistemas desacoplados por Event Bus. Voces generadas con IA (ElevenLabs).",
      },
      {
        title: "JARVIS — Asistente de voz local",
        note: "(en desarrollo)",
        stack: "Python 3.12 · asyncio · Ollama · Parakeet STT · ONNX Runtime",
        text: "Asistente de voz que corre entero en la PC, sin nube. Pipeline propio en streaming (detección de turno, STT, router, LLM local y TTS) con la latencia de cada etapa medida y registrada; el LLM se eligió con un banco propio de 7 modelos medidos en la GPU.",
      },
    ],
    education: [
      {
        title: strings.education.degreeTitle.es,
        meta: `${strings.education.degreeInst.es} (UMA) · 2024 – actualidad (3.er curso)`,
        text: `Nota media ${academics.gpa.es}/10 · nota de acceso (PEvAU) ${academics.access.es}. Matrículas de honor en Programación, Topología y Geometría.<br>Asignaturas relevantes: Programación, Estructura de Datos, Ingeniería del Software, Fundamentos de IA, Álgebra, Análisis Matemático, Probabilidad y Estadística.`,
      },
      { title: strings.education.bachTitle.es, meta: "IES María Zambrano, Torre del Mar · 2024" },
    ],
    job: {
      title: "Crew Member — McDonald's",
      meta: "Vélez-Málaga · Jul–Sep 2024 · Dic 2024 · Jul–Sep 2025 · Dic 2025",
      points: [
        "Trabajo en equipo bajo alta presión y ritmo acelerado en turnos de alto volumen.",
        "Responsabilidades adicionales y operación autónoma (gestión individual del puesto de freidora, normalmente operado por dos personas).",
        "Reconocido como el mejor en el puesto; valoración positiva de la dirección.",
      ],
    },
    skills: [
      ["IA", "desarrollo asistido por IA (Claude Code); integración de APIs (Claude SDK/CLI, ElevenLabs); LLMs locales (Ollama)"],
      ["Stack en proyectos", "TypeScript · React · Next.js · Kotlin · Jetpack Compose · C# · Unity · Python"],
      ["Datos", "PostgreSQL · Prisma · Firestore · Room"],
      ["Bases académicas", "Java · C"],
      ["Arquitectura", "Clean Architecture · MVVM · SOLID · Repository · Event Bus · TDD · E2E"],
      ["Herramientas", "Git · GitHub Actions · Docker · Vercel · Firebase · VS Code · IntelliJ · Linux · Windows"],
    ],
    certs: ["Anthropic (2026)", "Claude Code in Action · AI Capabilities &amp; Limitations · Agent Skills · Subagents · Claude 101 · AI Fluency"],
    languages: [
      ["Español", "nativo (variante rioplatense)"],
      ["Inglés", "competencia profesional (lectura y escritura altas, conversación fluida)"],
    ],
    interests: "Aprendizaje continuo de nuevas tecnologías, arquitectura de software y desarrollo asistido por IA. IA aplicada y desarrollo de aplicaciones.",
  },
  en: {
    file: "lucas-fanelli-cv-en.pdf",
    role: "Software Developer · Trainee / Working Student",
    location: "Vélez-Málaga, Spain",
    summary: `Third-year student of the Double Degree in Computer Engineering + Mathematics (University of Málaga, ${academics.gpa.en}/10 GPA). <b>AI-assisted developer</b>: I design and lead web, mobile and game projects through to production, using AI as a support tool, not as a substitute for engineering judgement. Focus on Clean Architecture, SOLID and testing (TDD/E2E). Seeking a <i>working-student / junior</i> role to grow within a team.`,
    h: { projects: "Projects", education: "Education", experience: "Experience", skills: "Technical Skills", certs: "Certifications", languages: "Languages", interests: "Interests" },
    projects: [
      {
        title: "Remy — Recipe Platform (full-stack, in production)",
        link: "remy-recipes.com",
        stack: "Next.js 16 · TypeScript · Prisma · PostgreSQL · Vercel",
        text: "Social recipe platform: JWT/bcrypt authentication, profiles with follows, likes and comments, pantry management with recipe <i>matching</i>, and an installable PWA. Clean Architecture + Repository pattern. CI/CD with GitHub Actions and Sentry; <b>1,161 tests with 98% coverage</b> (Jest + Playwright E2E).",
      },
      {
        title: "Heladera — Shared Grocery List (PWA, in production)",
        link: "heladera-ec2b4.web.app",
        stack: "TypeScript · React 19 · Vite · Firebase",
        text: "A list a family uses every day, <b>offline-first and real-time</b>. Private lists with expiring invites and no backend of its own: Firestore security rules decide who gets in, tested case by case on the emulator. One contract suite runs against both the fake Db and Firestore; 28 architecture decisions on record.",
      },
      {
        title: "SleepSync — Android App",
        note: "(Google Play · internal beta)",
        stack: "Kotlin · Jetpack Compose · Hilt · Room · Health Connect",
        text: "Detects when the user falls asleep through a <b>two-layer system</b> (popup confirmation + accelerometer/activity) and sets the alarm automatically. Adaptive calibration, 100% offline and bilingual. Clean modular architecture + MVVM; tests with JUnit 5, MockK and Turbine.",
      },
      {
        title: "Withdrawal — Game",
        note: "(Unity · target: Steam)",
        stack: "C# · Unity 6 (URP) · ElevenLabs",
        text: "First-person psychological horror. A data-driven horror-event engine (ScriptableObjects), a fear model that modulates lighting, audio and visuals in real time, and systems decoupled through an Event Bus. AI-generated voices (ElevenLabs).",
      },
      {
        title: "JARVIS — Local Voice Assistant",
        note: "(in development)",
        stack: "Python 3.12 · asyncio · Ollama · Parakeet STT · ONNX Runtime",
        text: "A voice assistant that runs entirely on the PC, no cloud. A hand-built streaming pipeline (turn detection, STT, router, local LLM and TTS) with every stage's latency measured and logged; the LLM was picked with a benchmark of 7 models measured on the GPU.",
      },
    ],
    education: [
      {
        title: strings.education.degreeTitle.en,
        meta: `${strings.education.degreeInst.en} (UMA) · 2024 – present (3rd year)`,
        text: `GPA ${academics.gpa.en}/10 · university entry score (PEvAU) ${academics.access.en}/14. Honors (Matrícula de Honor) in Programming, Topology and Geometry.<br>Relevant courses: Programming, Data Structures, Software Engineering, Foundations of AI, Algebra, Mathematical Analysis, Probability &amp; Statistics.`,
      },
      { title: strings.education.bachTitle.en, meta: "IES María Zambrano, Torre del Mar · 2024" },
    ],
    job: {
      title: "Crew Member — McDonald's",
      meta: "Vélez-Málaga · Jul–Sep 2024 · Dec 2024 · Jul–Sep 2025 · Dec 2025",
      points: [
        "Teamwork under high pressure and fast pace during high-volume shifts.",
        "Took on additional responsibilities and operated autonomously (single-handedly running the fryer station, normally staffed by two).",
        "Recognized as the best at the station; positive feedback from management.",
      ],
    },
    skills: [
      ["AI", "AI-assisted development (Claude Code); API integration (Claude SDK/CLI, ElevenLabs); local LLMs (Ollama)"],
      ["Project stack", "TypeScript · React · Next.js · Kotlin · Jetpack Compose · C# · Unity · Python"],
      ["Data", "PostgreSQL · Prisma · Firestore · Room"],
      ["Academic foundations", "Java · C"],
      ["Architecture", "Clean Architecture · MVVM · SOLID · Repository · Event Bus · TDD · E2E"],
      ["Tools", "Git · GitHub Actions · Docker · Vercel · Firebase · VS Code · IntelliJ · Linux · Windows"],
    ],
    certs: ["Anthropic (2026)", "Claude Code in Action · AI Capabilities &amp; Limitations · Agent Skills · Subagents · Claude 101 · AI Fluency"],
    languages: [
      ["Spanish", "native (Rioplatense variant)"],
      ["English", "professional working proficiency (strong reading and writing, fluent conversation)"],
    ],
    interests: "Continuous learning of new technologies, software architecture and AI-driven development. Applied AI and application development.",
  },
};

const STYLE = `
  @page { size: A4; margin: 1cm 1.1cm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Calibri", "Segoe UI", "Carlito", sans-serif; font-size: 9.6pt; color: #232323; line-height: 1.34; }
  a { color: #2B4C7E; text-decoration: none; white-space: nowrap; }
  header { border-bottom: 2px solid #2B4C7E; padding-bottom: 6px; margin-bottom: 8px; }
  h1 { font-size: 19pt; color: #2B4C7E; letter-spacing: .3px; font-weight: 700; }
  .role { font-size: 10.5pt; color: #2B4C7E; font-weight: 600; margin-top: 1px; }
  .contact { font-size: 8.4pt; color: #444; margin-top: 4px; }
  .sep { color: #9aa6b5; margin: 0 4px; }
  .summary { font-size: 9.2pt; margin: 8px 0 10px; text-align: justify; }
  .columns { display: flex; gap: 16px; }
  .main { flex: 1 1 63%; }
  .side { flex: 1 1 37%; }
  h2 { font-size: 9.2pt; color: #2B4C7E; text-transform: uppercase; letter-spacing: .6px; border-bottom: 1px solid #c9d4e2; padding-bottom: 2px; margin: 12px 0 5px; font-weight: 700; }
  .main h2:first-child, .side h2:first-child { margin-top: 0; }
  .item { margin-bottom: 7px; }
  .item .t { font-weight: 700; color: #1c1c1c; }
  .item .meta { font-size: 8.4pt; color: #5a6573; font-style: italic; font-weight: 400; }
  .item .stack { font-size: 8.3pt; color: #2B4C7E; font-weight: 600; margin: 1px 0; }
  .item p { font-size: 9.1pt; margin-top: 1px; }
  ul { list-style: none; margin-top: 2px; }
  ul li { position: relative; padding-left: 9px; font-size: 9pt; margin-bottom: 1.5px; }
  ul li::before { content: "•"; color: #2B4C7E; position: absolute; left: 0; }
  .group { margin-bottom: 6px; }
  .group .label { font-weight: 700; font-size: 8.7pt; color: #1c1c1c; }
  .group .val { font-size: 8.8pt; color: #333; }
  .lang { font-size: 8.9pt; margin-bottom: 3px; }
  .lang b { color: #1c1c1c; }
`;

function html(lang) {
  const c = CV[lang];
  const linkedin = `<a href="${identity.linkedinUrl}">${identity.linkedin}</a>`;
  const github = `<a href="${identity.githubUrl}">${identity.github}</a>`;
  const portfolio = `<a href="https://${SITE}${lang === "es" ? "/es/" : "/"}">${SITE}</a>`;
  const email = `<a href="mailto:${identity.email}">${identity.email}</a>`;
  const sep = '<span class="sep">·</span>';
  // A "·" list breaks after its separators, never before, so no line starts with one.
  const dots = (text) => text.replaceAll(" · ", "&nbsp;· ");
  const item = (it) => `
      <div class="item">
        <div class="t">${it.title}${it.link ? ` · <a href="https://${it.link}">${it.link}</a>` : ""}${it.note ? ` <span class="meta">${it.note}</span>` : ""}</div>
        ${it.meta ? `<div class="meta">${it.meta}</div>` : ""}
        ${it.stack ? `<div class="stack">${dots(it.stack)}</div>` : ""}
        ${it.text ? `<p>${it.text}</p>` : ""}
      </div>`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>CV · ${identity.name}</title>
<meta name="author" content="${identity.name}">
<style>${STYLE}</style>
</head>
<body>
  <header>
    <h1>${identity.name}</h1>
    <div class="role">${c.role}</div>
    <div class="contact">${[c.location, email, linkedin, github, portfolio].join(` ${sep} `)}</div>
  </header>
  <div class="summary">${c.summary}</div>
  <div class="columns">
    <div class="main">
      <h2>${c.h.projects}</h2>${c.projects.map(item).join("")}
      <h2>${c.h.education}</h2>${c.education.map(item).join("")}
      <h2>${c.h.experience}</h2>
      <div class="item">
        <div class="t">${c.job.title}</div>
        <div class="meta">${c.job.meta}</div>
        <ul>${c.job.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>
    </div>
    <div class="side">
      <h2>${c.h.skills}</h2>
      ${c.skills.map(([k, v]) => `<div class="group"><span class="label">${k}:</span> <span class="val">${dots(v)}</span></div>`).join("\n      ")}
      <h2>${c.h.certs}</h2>
      <div class="group"><span class="label">${c.certs[0]}:</span> <span class="val">${dots(c.certs[1])}</span></div>
      <h2>${c.h.languages}</h2>
      ${c.languages.map(([k, v]) => `<div class="lang"><b>${k}</b> — ${v}</div>`).join("\n      ")}
      <h2>${c.h.interests}</h2>
      <div class="group"><span class="val">${c.interests}</span></div>
    </div>
  </div>
</body>
</html>`;
}

const outDir = join(root, "public", "cv");
mkdirSync(outDir, { recursive: true });
for (const lang of ["es", "en"]) {
  const out = join(outDir, CV[lang].file);
  renderWithChrome(html(lang), ["--no-pdf-header-footer", `--print-to-pdf=${out}`]);
  // One page is the CV's rule; a longer text has to be cut, not spill onto a second sheet.
  const pages = readFileSync(out, "latin1").match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
  if (pages !== 1) throw new Error(`${CV[lang].file}: ${pages} pages, expected 1`);
  console.log(`${CV[lang].file}: 1 page`);
}
