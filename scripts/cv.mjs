// Prints the one-page CV in Spanish and English to public/cv/ (linked from the One Night hero):
//   npm run cv
// Kept short on purpose: the role sought, the three projects that can be tried or will be soon, work
// experience, education, skills and interests, with the second portrait from the One Night hero.
// Name, contact, grades, degree and project links come from lib/content.ts, so they match the site;
// the one-line descriptions are condensed from the project pages. Style follows Lucas's own CVs: A4,
// Calibri, navy accent. The phone number is left out because this copy is public.
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { academics, identity, projects, strings } from "../lib/content.ts";
import { fileUrl, renderWithChrome } from "./chrome.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "portfolio-lucasfanelli.com";
const project = (id) => projects.find((p) => p.id === id);
const certs = (label) => `<a href="${identity.certificationsUrl}">${label}</a>`;

const CV = {
  es: {
    file: "lucas-fanelli-cv-es.pdf",
    role: "Desarrollador de Software Junior",
    location: "Vélez-Málaga, España",
    h: { projects: "Proyectos", experience: "Experiencia", education: "Formación", skills: "Habilidades técnicas", interests: "Intereses" },
    status: { live: "En producción", active: "En desarrollo" },
    projects: [
      {
        id: "heladera",
        title: "Heladera — lista de compras compartida",
        stack: "TypeScript · React · Firebase",
        text: "PWA que una familia usa a diario, sin conexión y en tiempo real. El acceso lo deciden reglas de Firestore probadas en el emulador.",
      },
      {
        id: "remy",
        title: "Remy — plataforma de recetas",
        stack: "Next.js · TypeScript · PostgreSQL",
        text: "Red social de recetas full-stack con Clean Architecture. 1.161 tests (98&nbsp;% de cobertura) y CI/CD con GitHub Actions.",
      },
      {
        id: "jarvis",
        title: "JARVIS — asistente de voz local",
        stack: "Python · Ollama · ONNX Runtime",
        text: "Asistente de voz que funciona entero en la PC, sin nube: entiende español e inglés, piensa con un LLM local y responde hablando.",
      },
    ],
    job: {
      title: "Crew Member — McDonald's",
      meta: "Vélez-Málaga · Jul–Sep 2024 · Dic 2024 · Jul–Sep 2025 · Dic 2025",
      text: "Trabajo en equipo en turnos de alto volumen. Gestión en solitario del puesto de freidora (normalmente de dos personas); reconocido como el mejor en el puesto.",
    },
    education: [
      {
        title: strings.education.degreeTitle.es,
        meta: `${strings.education.degreeInst.es} · 2024 – actualidad (3.er curso)`,
        text: `Nota media ${academics.gpa.es} · Matrículas de honor en Programación, Topología y Geometría.`,
      },
      { title: strings.education.bachTitle.es, meta: "IES María Zambrano, Torre del Mar · 2024" },
    ],
    skills: [
      ["Lenguajes", "TypeScript · Python · Kotlin · C# · Java · C"],
      ["Web y datos", "React · Next.js · Firebase · PostgreSQL"],
      ["Prácticas", "Clean Architecture · SOLID · TDD · CI/CD"],
      ["Claude y Claude&nbsp;Code", `Conocimientos y varias certificaciones<br>${certs("Ver certificaciones")}`],
      ["Idiomas", "español nativo · inglés avanzado"],
    ],
    interests: "Aprendizaje y experimentación continuos en AI Engineering. Arquitectura de software, videojuegos y apps móviles.",
  },
  en: {
    file: "lucas-fanelli-cv-en.pdf",
    role: "Junior Software Developer",
    location: "Vélez-Málaga, Spain",
    h: { projects: "Projects", experience: "Experience", education: "Education", skills: "Technical skills", interests: "Interests" },
    status: { live: "Live", active: "In development" },
    projects: [
      {
        id: "heladera",
        title: "Heladera — shared grocery list",
        stack: "TypeScript · React · Firebase",
        text: "A PWA a family uses every day, offline and in real time. Access is decided by Firestore rules, tested on the emulator.",
      },
      {
        id: "remy",
        title: "Remy — recipe platform",
        stack: "Next.js · TypeScript · PostgreSQL",
        text: "A full-stack recipe social network built with Clean Architecture. 1,161 tests (98% coverage) and CI/CD on GitHub Actions.",
      },
      {
        id: "jarvis",
        title: "JARVIS — local voice assistant",
        stack: "Python · Ollama · ONNX Runtime",
        text: "A voice assistant that runs entirely on the PC, no cloud: it understands Spanish and English, thinks with a local LLM and answers out loud.",
      },
    ],
    job: {
      title: "Crew Member — McDonald's",
      meta: "Vélez-Málaga · Jul–Sep 2024 · Dec 2024 · Jul–Sep 2025 · Dec 2025",
      text: "Teamwork in high-volume shifts. Ran the fryer station alone (normally a two-person job); recognized as the best at the station.",
    },
    education: [
      {
        title: strings.education.degreeTitle.en,
        meta: `${strings.education.degreeInst.en} · 2024 – present (3rd year)`,
        text: `GPA ${academics.gpa.en}/10 · Honors in Programming, Topology and Geometry.`,
      },
      { title: strings.education.bachTitle.en, meta: "IES María Zambrano, Torre del Mar · 2024" },
    ],
    skills: [
      ["Languages", "TypeScript · Python · Kotlin · C# · Java · C"],
      ["Web and data", "React · Next.js · Firebase · PostgreSQL"],
      ["Practices", "Clean Architecture · SOLID · TDD · CI/CD"],
      ["Claude and Claude&nbsp;Code", `Knowledge and several certifications<br>${certs("View certifications")}`],
      ["Spoken", "Spanish (native) · English (advanced)"],
    ],
    interests: "Continuous learning and experimentation in AI Engineering. Software architecture, games and mobile apps.",
  },
};

const STYLE = `
  @page { size: A4; margin: 1.6cm 1.7cm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Calibri", "Segoe UI", "Carlito", sans-serif; font-size: 11.5pt; color: #232323; line-height: 1.45; }
  a { color: #2B4C7E; text-decoration: none; white-space: nowrap; }
  header { display: flex; align-items: center; gap: 18px; padding-bottom: 18px; margin-bottom: 30px; border-bottom: 2px solid #2B4C7E; }
  .photo { width: 2.8cm; height: 3.5cm; object-fit: cover; border-radius: 6px; flex: none; }
  h1 { font-size: 27pt; line-height: 1.1; color: #2B4C7E; font-weight: 700; letter-spacing: .2px; }
  .role { margin-top: 4px; font-size: 14.5pt; color: #2B4C7E; font-weight: 600; }
  .contact { margin-top: 9px; font-size: 10pt; color: #444; line-height: 1.6; }
  .sep { color: #9aa6b5; margin: 0 5px; }
  .columns { display: flex; gap: 32px; }
  .main { flex: 1 1 64%; }
  .side { flex: 1 1 36%; }
  h2 { font-size: 10.5pt; color: #2B4C7E; text-transform: uppercase; letter-spacing: .8px; font-weight: 700; padding-bottom: 3px; margin: 30px 0 12px; border-bottom: 1px solid #c9d4e2; }
  .main h2:first-child, .side h2:first-child { margin-top: 0; }
  .item { margin-bottom: 17px; }
  .item:last-child { margin-bottom: 0; }
  .t { font-weight: 700; color: #1c1c1c; }
  .tag { display: inline-block; margin-left: 7px; padding: 0 7px; border: 1px solid #2B4C7E; border-radius: 9px; font-size: 8.5pt; font-weight: 600; color: #2B4C7E; vertical-align: 1px; }
  .meta { font-size: 10pt; color: #5a6573; }
  .stack { font-size: 10pt; color: #2B4C7E; font-weight: 600; }
  p { margin-top: 3px; }
  .group { margin-bottom: 12px; }
  .label { display: block; font-weight: 700; font-size: 10pt; color: #1c1c1c; }
  .val { font-size: 10.5pt; color: #333; }
`;

function html(lang) {
  const c = CV[lang];
  const sep = '<span class="sep">·</span>';
  // A "·" list breaks after its separators, never before, so no line starts with one.
  const dots = (text) => text.replaceAll(" · ", "&nbsp;· ");
  const contact = [
    c.location,
    `<a href="mailto:${identity.email}">${identity.email}</a>`,
    `<a href="${identity.linkedinUrl}">${identity.linkedin}</a>`,
    `<a href="${identity.githubUrl}">${identity.github}</a>`,
    `<a href="https://${SITE}${lang === "es" ? "/es/" : "/"}">${SITE}</a>`,
  ];
  const projectItem = (it) => {
    const p = project(it.id);
    const link = p.url ? ` · <a href="${p.url}">${p.platform}</a>` : "";
    return `
      <div class="item">
        <div class="t">${it.title}<span class="tag">${c.status[p.status]}</span></div>
        <div class="meta"><span class="stack">${dots(it.stack)}</span>${link}</div>
        <p>${it.text}</p>
      </div>`;
  };
  const item = (it) => `
      <div class="item">
        <div class="t">${it.title}</div>
        <div class="meta">${it.meta}</div>
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
    <img class="photo" src="${fileUrl(join(root, "public", "night", "lucas-2.webp"))}" alt="${identity.name}">
    <div>
      <h1>${identity.name}</h1>
      <div class="role">${c.role}</div>
      <div class="contact">${contact.join(` ${sep} `)}</div>
    </div>
  </header>
  <div class="columns">
    <div class="main">
      <h2>${c.h.projects}</h2>${c.projects.map(projectItem).join("")}
      <h2>${c.h.experience}</h2>${item(c.job)}
      <h2>${c.h.education}</h2>${c.education.map(item).join("")}
    </div>
    <div class="side">
      <h2>${c.h.skills}</h2>
      ${c.skills.map(([k, v]) => `<div class="group"><span class="label">${k}</span><span class="val">${dots(v)}</span></div>`).join("\n      ")}
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
  // --virtual-time-budget lets the photo finish loading before the page is printed.
  renderWithChrome(html(lang), ["--no-pdf-header-footer", "--virtual-time-budget=5000", `--print-to-pdf=${out}`]);
  // One page is the CV's rule; a longer text has to be cut, not spill onto a second sheet.
  const pages = readFileSync(out, "latin1").match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
  if (pages !== 1) throw new Error(`${CV[lang].file}: ${pages} pages, expected 1`);
  console.log(`${CV[lang].file}: 1 page`);
}
