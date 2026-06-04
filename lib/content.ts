export type Lang = "en" | "es";
export type Theme = "light" | "dark" | "navy";
export type DesignId = "navy" | "terminal";
export type ProjectStatus = "live" | "active" | "beta";

export type Localized<T = string> = { es: T; en: T };

export type Project = {
  id: string;
  n: string;
  name: string;
  tagline: Localized;
  summary: Localized;
  role: Localized;
  stack: string[];
  platform: string;
  url?: string;
  status: ProjectStatus;
  philosophy: Localized<string[]>;
  quality: Localized<string[]>;
  diagram: string;
  snippet: {
    lang: "csharp" | "typescript" | "kotlin";
    code: string;
  };
};

export type LanguageEntry = {
  name: Localized;
  level: Localized;
  bars: number;
};

export type Skill = {
  lang: string;
  note: Localized;
};

export type Identity = {
  name: string;
  initials: string;
  handle: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
};

export type Strings = {
  nav: {
    work: Localized;
    about: Localized;
    contact: Localized;
    lang: Localized;
  };
  hero: {
    role: Localized;
    kicker: Localized;
    intro: Localized;
    available: Localized;
    based: Localized;
  };
  sections: {
    work: Localized;
    workNote: Localized;
    about: Localized;
    education: Localized;
    stack: Localized;
    methodology: Localized;
    languages: Localized;
    contact: Localized;
    contactNote: Localized;
    philosophy: Localized;
    quality: Localized;
    tools: Localized;
  };
  education: {
    degreeTitle: Localized;
    degreeInst: Localized;
    degreeDates: Localized;
    gpa: Localized;
    honors: Localized;
    honorsList: Localized;
    bachTitle: Localized;
    bachInst: Localized;
    bachDates: Localized;
    access: Localized;
  };
  methodology: Localized<string[]>;
  languages: LanguageEntry[];
  statusLabels: Record<ProjectStatus, Localized>;
  visit: Localized;
  role: Localized;
  arch: Localized;
  stack: Localized;
  platform: Localized;
  status: Localized;
};

export const identity: Identity = {
  name: "Lucas Ariel Fanelli Sánchez",
  initials: "LF",
  handle: "lucas-fanelli",
  location: "Vélez-Málaga, España",
  email: "lucasarielfanelli@hotmail.com",
  phone: "+34 623 299 094",
  linkedin: "linkedin.com/in/lucasarielfanelli",
  linkedinUrl: "https://www.linkedin.com/in/lucasarielfanelli/",
  github: "github.com/lucas-fanelli",
  githubUrl: "https://github.com/lucas-fanelli",
};

export const strings: Strings = {
  nav: {
    work: { es: "Proyectos", en: "Work" },
    about: { es: "Sobre mí", en: "About" },
    contact: { es: "Contacto", en: "Contact" },
    lang: { es: "EN", en: "ES" },
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
    philosophy: { es: "Filosofía", en: "Philosophy" },
    quality: { es: "Estándares de calidad", en: "Quality standards" },
    tools: { es: "Herramientas", en: "Tools" },
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
      level: { es: "Nativo · Argentino", en: "Native · Argentinian" },
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
};

export const projects: Project[] = [
  {
    id: "withdrawal",
    n: "01",
    name: "Withdrawal",
    tagline: {
      es: "Terror psicológico en primera persona",
      en: "First-person psychological horror",
    },
    summary: {
      es: "Una noche, un apartamento, sin combate ni jump scares: la tensión se construye solo con la ambientación. Diseñé los sistemas que la generan: un motor de eventos de horror dirigido por datos, un modelo de miedo que modula luz, audio y efectos en tiempo real, y un deterioro visual progresivo con estética VHS/lo-fi.",
      en: "One night, one apartment, no combat and no jump scares — dread is built entirely from atmosphere. I designed the systems behind it: a data-driven horror-event engine, a fear model that modulates lighting, audio and visuals in real time, and progressive VHS/lo-fi decay.",
    },
    role: { es: "Arquitecto · diseño narrativo · sistemas", en: "Architect · narrative design · systems" },
    stack: ["C#", "Unity 6 (URP)", "ElevenLabs"],
    platform: "Steam",
    status: "active",
    philosophy: {
      es: [
        "Datos como código · ScriptableObjects",
        "EventBus desacoplado · sistemas sin referencias directas",
        "SOLID · una responsabilidad por script",
        "Sistemas portables entre escenas",
      ],
      en: [
        "Data-driven via ScriptableObjects",
        "EventBus decoupling · no direct system references",
        "SOLID · one responsibility per script",
        "Scene-portable systems",
      ],
    },
    quality: {
      es: [
        "Herramientas de editor idempotentes",
        "Descubrimiento de singletons en runtime",
        "Helpers de setup reutilizables",
      ],
      en: [
        "Idempotent editor tools (safe re-runs)",
        "Runtime singleton discovery",
        "Reusable per-scene setup helpers",
      ],
    },
    diagram: [
      "┌──────────────────┐   publish    ┌──────────────────┐",
      "│  PhaseTracker    │─────────────▶│     EventBus     │",
      "│  FearManager     │              │  static pub/sub  │",
      "│  QuestManager    │              │ Dict<Type,Deleg> │",
      "│  ObjectStateT.   │              └─────────┬────────┘",
      "│  PlayerCtrl      │                        │ subscribe",
      "└──────────────────┘                        ▼",
      "      ┌─────────────┬──────────────┬────────────────┐",
      "      ▼             ▼              ▼                ▼",
      "HorrorEvent    FearVisual /    AmbientMgr      Narrative",
      "  Manager      FearAudio Ctrl  SpatialAudio     Manager",
      "(data-driven   (vignette /     (per-phase     (sequences,",
      "  triggers +    chromatic /     crossfade,     emotions,",
      "  effects via   blink burst)    one-shots)     voice clips)",
      "  ScriptableObjects)",
    ].join("\n"),
    snippet: {
      lang: "csharp",
      code: `public static class EventBus
{
    private static readonly Dictionary<Type, Delegate> subscribers = new();

    public static void Subscribe<T>(Action<T> handler) where T : struct, IGameEvent
    {
        var type = typeof(T);
        if (subscribers.TryGetValue(type, out var existing))
            subscribers[type] = Delegate.Combine(existing, handler);
        else
            subscribers[type] = handler;
    }

    public static void Publish<T>(T gameEvent) where T : struct, IGameEvent
    {
        if (subscribers.TryGetValue(typeof(T), out var d))
            ((Action<T>)d)(gameEvent);
    }
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
    stack: ["TypeScript", "Next.js 16", "Prisma", "PostgreSQL"],
    platform: "remy-recipes.com",
    url: "https://remy-recipes.com",
    status: "live",
    philosophy: {
      es: [
        "Clean Architecture · 4 capas",
        "SOLID en services + repositories",
        "Inyección de dependencias por interfaces",
        "Seguridad en middleware (JWT + rate limit)",
      ],
      en: [
        "Clean Architecture · 4 layers",
        "SOLID across services + repositories",
        "Interface-driven dependency injection",
        "Middleware-level security (JWT + rate limit)",
      ],
    },
    quality: {
      es: [
        "98% cobertura · 1.161 tests pasando",
        "CI/CD por PR (GitHub Actions)",
        "Sentry para tracking en producción",
        "Playwright E2E + Husky pre-commit",
      ],
      en: [
        "98% statement coverage · 1,161 tests passing",
        "CI/CD on every PR (GitHub Actions)",
        "Sentry error tracking in production",
        "Playwright E2E + Husky pre-commit hooks",
      ],
    },
    diagram: [
      "  Browser  ──▶  Next.js App Router  (28+ API routes,",
      "                  app/api/* · app/recipe/[id])",
      "                          │",
      "                          ▼",
      "            ┌────────────────────────────────┐",
      "            │  Services (business logic)     │",
      "            │  RecipeService · UserService   │",
      "            │  AuthService · PantryService   │",
      "            └───────────────┬────────────────┘",
      "                            ▼   IRecipeRepository",
      "            ┌────────────────────────────────┐",
      "            │  Repositories (Prisma-backed)  │",
      "            │  RecipeRepo · UserRepo · …     │",
      "            └───────────────┬────────────────┘",
      "                            ▼",
      "        PostgreSQL (Neon)  ·  Cloudinary CDN",
    ].join("\n"),
    snippet: {
      lang: "typescript",
      code: `export class RecipeRepository implements IRecipeRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Recipe | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    return post ? this.mapToRecipe(post) : null;
  }
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
    stack: ["Kotlin 2.1", "Jetpack Compose", "Hilt", "Room"],
    platform: "Android",
    status: "beta",
    philosophy: {
      es: [
        "Clean Architecture + MVVM, multi-módulo",
        "Hilt DI · diseño por interfaces",
        "Repository pattern en todo el acceso a datos",
        "Sensor · Alarma · Abstracciones de i18n",
      ],
      en: [
        "Clean Architecture + MVVM, multi-module",
        "Hilt DI · interface-driven design",
        "Repository pattern for all data access",
        "Sensor · alarm · i18n abstractions",
      ],
    },
    quality: {
      es: [
        "TDD: Red → Green → Refactor",
        "Objetivo 90%+ cobertura (95%+ en detección)",
        "Cero tests inestables · tiempo mockeado, sin I/O real",
        "Inmutabilidad por defecto · sin números mágicos",
      ],
      en: [
        "TDD: Red → Green → Refactor",
        "Target 90%+ coverage (95%+ on detection engine)",
        "Zero flaky tests · mocked time, no real I/O",
        "Immutability by default · no magic numbers",
      ],
    },
    diagram: [
      "  ┌──────────────── presentation ──────────────────────┐",
      "  │  Composables ◀─state─ ViewModel ─intent─▶ UseCase  │",
      "  └────────────────────────────────────────────┬───────┘",
      "                                               ▼",
      "  ┌────────────── detection engine ────────────────────┐",
      "  │ SignalCollectors ─▶ ScoreCalculator ─▶ Coordinator │",
      "  │ accel · screen · HR · HRV · time   (weighted avg)  │",
      "  │              │                              │      │",
      "  │              └─ ProgressivePopupTimer ──────┘      │",
      "  └────────────────────────────────────────────┬───────┘",
      "                                               ▼",
      "  ┌──────────────── data ──────────────────────────────┐",
      "  │ AlarmClock intent · Room DB · Health Connect API   │",
      "  └────────────────────────────────────────────────────┘",
    ].join("\n"),
    snippet: {
      lang: "kotlin",
      code: `class SleepScoreCalculator(private val clock: Clock) {
    fun calculate(
        weights: SignalWeights,
        movementScore: Float?, heartRateScore: Float?,
        screenScore: Float?, hrvScore: Float?, timeContextScore: Float?,
    ): SleepScore {
        var totalWeight = 0f
        var weightedSum = 0f

        fun addSignal(score: Float?, weight: Float) {
            if (score != null && weight > 0f) {
                weightedSum += score * weight
                totalWeight += weight
            }
        }
        addSignal(movementScore, weights.movement)
        addSignal(heartRateScore, weights.heartRate)
        addSignal(screenScore, weights.screen)
        addSignal(hrvScore, weights.hrv)
        addSignal(timeContextScore, weights.timeContext)

        val overall = if (totalWeight > 0f)
            (weightedSum / totalWeight).coerceIn(0f, 1f) else 0f
        // ...build SleepScore(overall, …)
    }
}`,
    },
  },
];

export const skills: Skill[] = [
  { lang: "Python", note: { es: "Académico + proyectos propios", en: "Coursework + personal projects" } },
  { lang: "C#", note: { es: "Proyectos Unity desde 2016", en: "Unity projects since 2016" } },
  { lang: "TypeScript", note: { es: "Proyecto propio (Remy)", en: "Personal project (Remy)" } },
  { lang: "Kotlin", note: { es: "Proyecto propio (SleepSync)", en: "Personal project (SleepSync)" } },
  { lang: "Java", note: { es: "Académico", en: "Coursework" } },
  { lang: "C", note: { es: "Académico", en: "Coursework" } },
];

export const tools: string[] = ["Unity", "Git", "VS Code", "IntelliJ"];

export function pick<T>(value: Localized<T> | T, lang: Lang): T {
  if (value && typeof value === "object" && "es" in (value as object) && "en" in (value as object)) {
    return (value as Localized<T>)[lang];
  }
  return value as T;
}
