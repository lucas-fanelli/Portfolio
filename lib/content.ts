export type Lang = "en" | "es";
export type Theme = "light" | "dark" | "navy";
export type DesignId = "navy" | "terminal" | "night";
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
    lang: "csharp" | "typescript" | "kotlin" | "python";
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
    menu: Localized;
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
    copyEmail: Localized;
    copied: Localized;
    copyFailed: Localized;
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
  night: {
    kicker: Localized;
    scrollCue: Localized;
    code: Localized;
    more: Localized;
    less: Localized;
    plateCredit: Localized;
    hours: Record<
      "dusk" | "remy" | "heladera" | "withdrawal" | "jarvis" | "sleepsync" | "dawn",
      Localized
    >;
    fridge: { toBuy: Localized; items: Localized[] };
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
    menu: { es: "Menú", en: "Menu" },
  },
  hero: {
    role: {
      es: "Estudiante de Ingeniería Informática + Matemáticas",
      en: "Computer Science + Mathematics undergraduate",
    },
    kicker: {
      es: "Doble grado · UMA · 3.er año",
      en: "Double degree · UMA · 3rd year",
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
      es: "Proyectos en producción y en desarrollo. Yo defino la arquitectura; la IA acelera la implementación.",
      en: "Live and in-progress projects. I own the architecture; AI accelerates implementation.",
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
    copyEmail: { es: "Copiar email", en: "Copy email" },
    copied: { es: "Copiado", en: "Copied" },
    copyFailed: { es: "No se pudo copiar: selecciona el email", en: "Couldn't copy: select the address" },
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
  night: {
    kicker: { es: "Una noche en casa.", en: "One night at home." },
    scrollCue: { es: "Baja despacio", en: "Scroll slowly" },
    code: { es: "Ver código real", en: "View real code" },
    more: { es: "Ver arquitectura y detalles", en: "Architecture and details" },
    less: { es: "Ocultar detalles", en: "Hide details" },
    plateCredit: {
      es: "Ambientes generados con IA (Higgsfield). Los proyectos, el código y los diagramas son reales.",
      en: "Ambient plates generated with AI (Higgsfield). Projects, code and diagrams are real.",
    },
    hours: {
      dusk: { es: "anochece", en: "nightfall" },
      remy: { es: "la cena", en: "dinner" },
      heladera: { es: "el antojo", en: "the craving" },
      sleepsync: { es: "dormirse", en: "falling asleep" },
      withdrawal: { es: "la casa en silencio", en: "the house goes quiet" },
      jarvis: { es: "la madrugada", en: "the small hours" },
      dawn: { es: "amanece", en: "dawn" },
    },
    // Labels for the fridge scene's selection animation (an illustration of ticking items off the list).
    fridge: {
      toBuy: { es: "Faltan", en: "To buy" },
      items: [
        { es: "Leche", en: "Milk" },
        { es: "Tomates", en: "Tomatoes" },
        { es: "Queso", en: "Cheese" },
        { es: "Lechuga", en: "Lettuce" },
      ],
    },
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
      es: "Una noche, un apartamento, sin combate: la tensión se construye desde la ambientación. Diseñé los sistemas que la generan: un motor de eventos de horror dirigido por datos, un modelo de miedo que modula luz, audio y efectos en tiempo real, y un deterioro visual progresivo con estética VHS/lo-fi.",
      en: "One night, one apartment, no combat — dread is built from atmosphere. I designed the systems behind it: a data-driven horror-event engine, a fear model that modulates lighting, audio and visuals in real time, and progressive VHS/lo-fi decay.",
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
  {
    id: "heladera",
    n: "04",
    name: "Heladera",
    tagline: {
      es: "Lista de compras compartida, sin conexión y en tiempo real",
      en: "Shared grocery list — offline-first and real-time",
    },
    summary: {
      es: "PWA que una familia usa todos los días: uno anota el antojo, otro lo ve en el súper y lo tilda, con o sin señal. Listas privadas con invitaciones que vencen y sin backend propio: el acceso lo deciden las reglas de Firestore.",
      en: "A PWA a family uses every day: one person jots down the craving, another ticks it off at the supermarket, with or without signal. Private lists with expiring invites and no backend of its own — Firestore security rules decide who gets in.",
    },
    role: { es: "Producto · arquitectura · circuito de deploy", en: "Product · architecture · deploy pipeline" },
    stack: ["TypeScript", "React 19", "Vite", "Firebase", "Motion"],
    platform: "heladera-ec2b4.web.app",
    url: "https://heladera-ec2b4.web.app",
    status: "live",
    philosophy: {
      es: [
        "La UI solo conoce una URL y la interfaz Db",
        "Mutaciones sin await: la UI nunca espera a la red",
        "Seguridad en las reglas de Firestore, sin servidor propio",
        "28 decisiones registradas (D1–D28), cada una con su porqué",
      ],
      en: [
        "The UI only knows a URL and the Db interface",
        "No-await mutations: the UI never waits on the network",
        "Security lives in Firestore rules, no server of its own",
        "28 recorded decisions (D1–D28), each with its rationale",
      ],
    },
    quality: {
      es: [
        "Suite de contrato: los mismos tests contra el Db falso y Firestore",
        "Reglas de seguridad probadas caso por caso en el emulador",
        "Deploy con puertas deterministas y auditorías de agentes a ciegas",
        "Bugs de Android diagnosticados midiendo en el teléfono (CDP sobre adb)",
      ],
      en: [
        "Contract suite: the same tests against the fake Db and Firestore",
        "Security rules tested case by case on the emulator",
        "Deploys gated by deterministic checks and blind agent audits",
        "Android bugs diagnosed by measuring on the phone (CDP over adb)",
      ],
    },
    diagram: [
      "  URL ─▶ app/router ─▶ useLista ─▶ PantallaLista · ui/",
      "                          │ suscribir(listId) → Vista",
      "                          ▼",
      "         ┌─────────── db/types.ts ────────────┐",
      "         │  interface Db · the only data door │",
      "         │  no-await mutations · onError      │",
      "         └──────┬─────────────────────┬───────┘",
      "                ▼                     ▼",
      "            fake.ts              firestore.ts",
      "       memory · tests · demo   offline cache · realtime",
      "                └─ contract suite ────┘     │",
      "                                            ▼",
      "  domain/ (pure): normalizar · dedupe   firestore.rules",
      "  vista · mercados · sugerencias        who gets in",
    ].join("\n"),
    snippet: {
      lang: "typescript",
      code: `export interface Db {
  /** Se suscribe a la vista de una lista. Llama a \`cb\` de inmediato (caché) y en cada cambio. */
  suscribir(listId: string, cb: (vista: Vista) => void): () => void;
  // ...
  /** Devuelve el id del ítem nuevo de inmediato (id generado en el cliente). */
  agregarItem(listId: string, texto: string, yo: Yo): string;
  marcarComprado(listId: string, itemId: string, comprado: boolean, yo: Yo): void;
  // ...
  /** Crea una invitación que vence en 7 días y devuelve su código (va en el fragmento del link). */
  invitar(listId: string): Promise<string>;
  // ...
  /** Errores de cualquier operación (permisos, validación, red). La UI los muestra como toast. */
  onError(cb: (e: DbError) => void): () => void;
}`,
    },
  },
  {
    id: "jarvis",
    n: "05",
    name: "JARVIS",
    tagline: {
      es: "Asistente de voz local, en tiempo real",
      en: "Real-time local voice assistant",
    },
    summary: {
      es: "Asistente de voz que corre entero en la PC, sin nube: le hablás en español y responde en voz, en inglés. Un pipeline propio —detección de turno, STT, router, LLM local y TTS en streaming— donde cada milisegundo se mide y queda registrado.",
      en: "A voice assistant that runs entirely on the PC, no cloud: you speak Spanish and it answers aloud in English. A hand-built pipeline — turn detection, STT, router, local LLM and streaming TTS — where every millisecond is measured and logged.",
    },
    role: { es: "Arquitectura · pipeline de voz · medición", en: "Architecture · voice pipeline · benchmarking" },
    stack: ["Python 3.12", "asyncio", "Ollama · gemma4", "Parakeet STT", "ONNX Runtime"],
    platform: "Windows · local",
    status: "active",
    philosophy: {
      es: [
        "Cada hito termina con algo usable y un número medido",
        "El cerebro se eligió con un banco propio: 7 LLMs medidos en la GPU",
        "Pipeline fino, sin frameworks pesados: cada milisegundo visible",
        "Dueño de su propio Ollama: sin procesos huérfanos reteniendo VRAM",
      ],
      en: [
        "Every milestone ends with something usable and a measured number",
        "The brain was picked by benchmark: 7 local LLMs measured on the GPU",
        "Thin pipeline, no heavy frameworks: every millisecond visible",
        "Owns its Ollama child process: no orphans holding VRAM",
      ],
    },
    quality: {
      es: [
        "Meta: < 800 ms del fin de tu frase al primer sonido (p50)",
        "Comandos por fast-path: < 400 ms hasta la respuesta",
        "Cada turno en logs/turns.jsonl con la latencia de cada etapa",
        "Modo juego: el LLM pasa a CPU y libera la VRAM",
      ],
      en: [
        "Target: < 800 ms from end of speech to first sound (p50)",
        "Fast-path commands: < 400 ms to the reply",
        "Every turn logged to logs/turns.jsonl with per-stage latency",
        "Game mode: the LLM moves to CPU and frees the VRAM",
      ],
    },
    diagram: [
      "  mic ─▶ VAD/turn ─▶ STT ─▶ router ─┬─▶ fast-path (regex)",
      "                    Parakeet        │     ─▶ action + canned reply",
      "                                    │",
      "                                    └─▶ LLM stream · Ollama gemma4",
      "                                          ─▶ clause chunker",
      "                                          ─▶ TTS stream ─▶ headphones",
      "",
      "  every stage ─▶ logs/turns.jsonl + live latency line",
    ].join("\n"),
    snippet: {
      lang: "python",
      code: `class ClauseChunker:
    """Corta el texto del LLM en frases cortas para que el TTS empiece cuanto antes.

    La primera cláusula se corta en la primera coma (así empieza a sonar mientras se
    genera el resto); las demás en fin de oración, o en coma/punto y coma con 8+
    palabras; tope duro de 25 palabras. Nunca se corta justo antes de "sir"/"señor":
    sintetizado suelto sonaba "Yes........ sir" / "señooooor".
    """

    def feed(self, piece: str) -> list[str]:
        self.buf += piece
        # ...
        out = []
        while (cut := self._find_cut()) is not None:
            clause, self.buf = self.buf[:cut].strip(), self.buf[cut:]
            if clause:
                out.append(self._clean(clause))
                self.first = False
        return out`,
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

export const academics = { gpa: "8,7", access: "13,400" } as const;

/** Widest line of an ASCII diagram, in characters. Designs size the font so this many columns fit. */
export function diagramColumns(diagram: string): number {
  return Math.max(...diagram.split("\n").map((line) => line.length));
}

export function pick<T>(value: Localized<T> | T, lang: Lang): T {
  if (value && typeof value === "object" && "es" in (value as object) && "en" in (value as object)) {
    return (value as Localized<T>)[lang];
  }
  return value as T;
}
