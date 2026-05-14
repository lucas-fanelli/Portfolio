// Shared bilingual content for all three portfolio directions.
// Single source of truth — every direction reads from window.PORTFOLIO.

window.PORTFOLIO = {
  identity: {
    name: "Lucas Ariel Fanelli Sánchez",
    initials: "LF",
    handle: "TheReaperGuy",
    location: "Vélez-Málaga, España",
    email: "lucasarielfanelli@hotmail.com",
    phone: "+34 623 299 094",
    linkedin: "linkedin.com/in/lucas-fanelli-sánchez",
    linkedinUrl: "https://www.linkedin.com/in/lucas-fanelli-s%C3%A1nchez-264a14398/",
    github: "github.com/TheReaperGuy",
    githubUrl: "https://github.com/TheReaperGuy",
  },

  // Two-language string table. Every leaf is { es, en }.
  t: {
    nav: {
      work: { es: "Proyectos", en: "Work" },
      about: { es: "Sobre mí", en: "About" },
      contact: { es: "Contacto", en: "Contact" },
      lang: { es: "EN", en: "ES" }, // label shown = the OTHER language
    },
    hero: {
      role: {
        es: "Estudiante de Ingeniería Informática + Matemáticas",
        en: "Computer Science + Mathematics undergraduate",
      },
      kicker: {
        es: "Doble grado · UMA · 2.º año",
        en: "Double degree · UMA · 2nd year",
      },
      intro: {
        es: "Diseño y dirijo proyectos de software — videojuegos, apps móviles y web — usando IA como herramienta de apoyo, no como sustituto del criterio técnico. Me interesa la arquitectura limpia, los sistemas que sobreviven al refactor y aprender lo siguiente.",
        en: "I design and direct software projects — games, mobile apps, and web — using AI as a support tool, not as a substitute for engineering judgement. I care about clean architecture, systems that survive refactors, and learning the next thing.",
      },
      available: { es: "Abierto a ofertas", en: "Open to offers" },
      based: { es: "Remoto / Oficina", en: "Remote / Office" },
    },
    sections: {
      work: { es: "Proyectos seleccionados", en: "Selected work" },
      workNote: {
        es: "Tres proyectos activos. Yo defino la arquitectura; la IA acelera la implementación.",
        en: "Three active projects. I own the architecture; AI accelerates implementation.",
      },
      about: { es: "Sobre mí", en: "About" },
      education: { es: "Formación", en: "Education" },
      stack: { es: "Stack técnico", en: "Technical stack" },
      methodology: { es: "Metodología", en: "Methodology" },
      languages: { es: "Idiomas", en: "Languages" },
      contact: { es: "Contacto", en: "Contact" },
      contactNote: {
        es: "La mejor vía es por email. Respondo en ES o EN.",
        en: "Email is the fastest route. Happy to reply in EN or ES.",
      },
    },
    education: {
      degreeTitle: {
        es: "Doble Grado en Ingeniería Informática y Matemáticas",
        en: "Double Degree in Computer Engineering and Mathematics",
      },
      degreeInst: { es: "Universidad de Málaga", en: "University of Málaga" },
      degreeDates: { es: "2024 — presente", en: "2024 — present" },
      gpa: { es: "Nota media", en: "GPA" },
      honors: { es: "Matrículas de honor", en: "Honors" },
      honorsList: {
        es: "Topología · Geometría · Programación",
        en: "Topology · Geometry · Programming",
      },
      bachTitle: { es: "Bachillerato Tecnológico", en: "Technological Baccalaureate" },
      bachInst: { es: "IES María Zambrano · Torre del Mar", en: "IES María Zambrano · Torre del Mar" },
      bachDates: { es: "Finalizado 2024", en: "Completed 2024" },
      access: { es: "Nota de acceso PEvAU", en: "University entry score" },
    },
    methodology: {
      es: ["Clean Architecture", "MVVM", "Event Bus", "Repository Pattern", "SOLID", "TDD", "E2E testing", "Ágil"],
      en: ["Clean Architecture", "MVVM", "Event Bus", "Repository Pattern", "SOLID", "TDD", "E2E testing", "Agile"],
    },
    languages: [
      {
        name: { es: "Español", en: "Spanish" },
        level: { es: "Nativo · variante rioplatense", en: "Native · Rioplatense" },
        bars: 5,
      },
      {
        name: { es: "Inglés", en: "English" },
        level: {
          es: "Avanzado · lectura y escritura altas, conversacional fluido",
          en: "Advanced · high reading/writing, fluent conversational",
        },
        bars: 4,
      },
    ],
    statusLabels: {
      live: { es: "EN VIVO", en: "LIVE" },
      active: { es: "EN DESARROLLO", en: "IN DEVELOPMENT" },
      beta: { es: "BETA", en: "BETA" },
    },
    visit: { es: "Visitar", en: "Visit" },
    role: { es: "Rol", en: "Role" },
    arch: { es: "Arquitectura", en: "Architecture" },
    stack: { es: "Stack", en: "Stack" },
    platform: { es: "Plataforma", en: "Platform" },
    status: { es: "Estado", en: "Status" },
  },

  // Three flagship projects, equal weight per user spec.
  projects: [
    {
      id: "withdrawal",
      n: "01",
      name: "Withdrawal",
      tagline: {
        es: "Terror psicológico en primera persona",
        en: "First-person psychological horror",
      },
      summary: {
        es: "El protagonista se queda sin pastillas y, durante episodios disociativos, comete actos violentos sin ser consciente. El jugador es el perpetrador sin saberlo. Sin jump scares, estética VHS/lo-fi.",
        en: "The protagonist runs out of medication and, during dissociative episodes, commits violent acts without realizing. The player is the unwitting perpetrator. No jump scares, VHS/lo-fi aesthetic.",
      },
      role: { es: "Arquitecto · diseño narrativo · sistemas", en: "Architect · narrative design · systems" },
      stack: ["C#", "Unity 6 (URP)", "ElevenLabs"],
      platform: "Steam",
      status: "active",
      // Architecture diagram drawn in monospace ASCII (rendered with white-space:pre)
      diagram: [
        "┌──────────────┐    publish    ┌────────────────┐",
        "│  Player I/O  │──────────────▶│   Event Bus    │",
        "└──────────────┘               └───────┬────────┘",
        "                                       │ subscribe",
        "      ┌────────────────────────────────┼─────────────────┐",
        "      ▼                ▼               ▼                 ▼",
        "┌──────────┐    ┌────────────┐  ┌──────────────┐  ┌─────────────┐",
        "│  Phase   │    │   Quest    │  │ Fear / Blink │  │ Deterioration│",
        "│ Tracker  │    │   System   │  │   Systems    │  │   Narrative  │",
        "└──────────┘    └────────────┘  └──────────────┘  └─────────────┘",
      ].join("\n"),
      snippet: {
        lang: "csharp",
        code: `public sealed class EventBus {
    static readonly Dictionary<Type, Delegate> _subs = new();

    public static void Publish<T>(T evt) where T : IGameEvent {
        if (_subs.TryGetValue(typeof(T), out var d))
            ((Action<T>)d)?.Invoke(evt);
    }

    public static void Subscribe<T>(Action<T> handler) where T : IGameEvent
        => _subs[typeof(T)] = Delegate.Combine(
               _subs.GetValueOrDefault(typeof(T)), handler);
}`,
      },
    },
    {
      id: "remy",
      n: "02",
      name: "Remy",
      tagline: {
        es: "Aplicación web de recetas en producción",
        en: "Live recipe web application",
      },
      summary: {
        es: "Aplicación web desplegada y funcional, construida con TypeScript y Next.js. Diseño de la experiencia, modelo de datos y despliegue.",
        en: "Live, working web app built with TypeScript and Next.js. Owned the UX, data model, and deployment.",
      },
      role: { es: "Diseño · arquitectura · despliegue", en: "Design · architecture · deployment" },
      stack: ["TypeScript", "React", "Next.js"],
      platform: "remy-recipes.com",
      url: "https://remy-recipes.com",
      status: "live",
      diagram: [
        "  Browser ──▶ Next.js App Router ──▶ Server Components",
        "                     │                       │",
        "                     ▼                       ▼",
        "                 Edge cache             Recipe store",
        "                                    (typed query layer)",
      ].join("\n"),
      snippet: {
        lang: "typescript",
        code: `export async function getRecipe(slug: string): Promise<Recipe> {
  const recipe = await db.recipe.findUnique({
    where: { slug },
    include: { steps: true, ingredients: true },
  });
  if (!recipe) notFound();
  return recipe;
}`,
      },
    },
    {
      id: "sleepsync",
      n: "03",
      name: "SleepSync",
      tagline: {
        es: "Alarma adaptativa para Android",
        en: "Adaptive alarm for Android",
      },
      summary: {
        es: "App Android que detecta el momento en que te quedas dormido y programa la alarma para que duermas un tiempo exacto. Clean Architecture + MVVM. En testing interno de Google Play.",
        en: "Android app that detects when you fall asleep and sets the alarm so you sleep an exact duration. Clean Architecture + MVVM. In Google Play internal testing.",
      },
      role: { es: "Arquitectura · UI · sensores", en: "Architecture · UI · sensor logic" },
      stack: ["Kotlin", "Jetpack Compose", "Clean Arch"],
      platform: "Android",
      status: "beta",
      diagram: [
        "  ┌─────────────────────── presentation ─────────────────────┐",
        "  │  Composables  ◀──state──  ViewModel  ──intent──▶  UseCase│",
        "  └──────────────────────────────────────────────────┬───────┘",
        "                                                     ▼",
        "  ┌──────────────────────── domain ──────────────────────────┐",
        "  │  SleepDetector  ·  AlarmScheduler  ·  Repository ports   │",
        "  └──────────────────────────────────────────────────┬───────┘",
        "                                                     ▼",
        "  ┌──────────────────────── data ────────────────────────────┐",
        "  │  Sensor source  ·  AlarmManager  ·  Room (Repository)    │",
        "  └──────────────────────────────────────────────────────────┘",
      ].join("\n"),
      snippet: {
        lang: "kotlin",
        code: `class DetectSleepUseCase(
    private val sensors: SensorRepository,
    private val alarm: AlarmScheduler,
) {
    suspend operator fun invoke(target: Duration) =
        sensors.stillness()
            .firstOrNull { it > THRESHOLD }
            ?.let { alarm.scheduleIn(target) }
}`,
      },
    },
  ],

  // Skills surfaced on each portfolio. Honest levels per CV maestro guidance.
  skills: [
    { lang: "Python", note: { es: "Académico + proyectos propios", en: "Coursework + personal projects" } },
    { lang: "C#",     note: { es: "Proyectos Unity desde 2016",   en: "Unity projects since 2016" } },
    { lang: "TypeScript", note: { es: "Proyecto propio (Remy)", en: "Personal project (Remy)" } },
    { lang: "Kotlin", note: { es: "Proyecto propio (SleepSync)", en: "Personal project (SleepSync)" } },
    { lang: "Java",   note: { es: "Académico", en: "Coursework" } },
    { lang: "C",      note: { es: "Académico", en: "Coursework" } },
  ],

  tools: ["Unity", "Git", "VS Code", "IntelliJ"],

  // Helper: pull lang-specific string out of {es, en} blobs.
  pick(value, lang) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value;
    if (typeof value === "object" && (value.es != null || value.en != null)) {
      return value[lang] ?? value.es ?? value.en ?? "";
    }
    return value;
  },
};
