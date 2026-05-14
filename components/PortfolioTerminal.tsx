"use client";

import React from "react";
import {
  identity,
  pick,
  projects,
  skills,
  strings,
  tools,
  type Lang,
  type Localized,
  type ProjectStatus,
  type Theme,
} from "@/lib/content";
import { useViewport } from "@/lib/useViewport";

type Palette = {
  bg: string;
  panel: string;
  ink: string;
  muted: string;
  dim: string;
  accent: string;
  accent2: string;
  accent3: string;
  red: string;
  line: string;
  promptUser: string;
  promptHost: string;
};

const palettes: Record<Theme, Palette> = {
  dark: {
    bg: "#0b0e0a",
    panel: "#0f1410",
    ink: "#cfe9c4",
    muted: "#5d7c54",
    dim: "#3a4d36",
    accent: "#7cf28a",
    accent2: "#f0c14b",
    accent3: "#7ad9ff",
    red: "#ff7b7b",
    line: "rgba(124,242,138,0.16)",
    promptUser: "#7cf28a",
    promptHost: "#7ad9ff",
  },
  light: {
    bg: "#f3efe3",
    panel: "#ece6d4",
    ink: "#2c2a22",
    muted: "#6a6457",
    dim: "#b2ab98",
    accent: "#2f7a48",
    accent2: "#9c6b1a",
    accent3: "#1c5b88",
    red: "#a23a3a",
    line: "rgba(44,42,34,0.15)",
    promptUser: "#2f7a48",
    promptHost: "#1c5b88",
  },
  navy: {
    bg: "#0a1a30",
    panel: "#0e2240",
    ink: "#d9e6ff",
    muted: "#7e96bd",
    dim: "#3c5279",
    accent: "#7ad9ff",
    accent2: "#ffd066",
    accent3: "#b9a8ff",
    red: "#ff8e8e",
    line: "rgba(122,217,255,0.18)",
    promptUser: "#7ad9ff",
    promptHost: "#ffd066",
  },
};

const dot = (color: string): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: color,
  display: "inline-block",
});

const hr = (c: Palette): React.CSSProperties => ({
  border: "none",
  borderTop: `1px dashed ${c.line}`,
  margin: "30px 0",
});

const headerAscii = String.raw`
   __                            ____                  _ _ _
  / /  _   _  ___ __ _ ___      / ___|__ _ _ __   ___ | | (_)
 / /  | | | |/ __/ _\` / __|    | |__ / _\` | '_ \ / _ \| | | |
/ /___| |_| | (_| (_| \__ \    |  __/ (_| | | | |  __/| | | |
\____/ \__,_|\___\__,_|___/    |_|   \__,_|_| |_|\___||_|_|_|`;

type Props = {
  theme: Theme;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
};

export default function PortfolioTerminal({ theme, lang, setTheme, setLang }: Props) {
  const c = palettes[theme] || palettes.dark;
  const t = <T,>(value: Localized<T> | T): T => pick(value, lang);
  const { isMobile, isTablet } = useViewport();
  const narrow = isMobile || isTablet;
  const PAD_X = isMobile ? 16 : isTablet ? 28 : 40;
  const PAD_TOP = isMobile ? 20 : 32;
  const PAD_BOTTOM = isMobile ? 48 : 64;

  const Prompt = ({ cmd, host = "uma", user = "lucas" }: { cmd: string; host?: string; user?: string }) => (
    <div style={{ marginBottom: 14 }}>
      <span style={{ color: c.promptUser }}>{user}</span>
      <span style={{ color: c.muted }}>@</span>
      <span style={{ color: c.promptHost }}>{host}</span>
      <span style={{ color: c.muted }}>:</span>
      <span style={{ color: c.accent3 }}>~</span>
      <span style={{ color: c.muted }}>$ </span>
      <span style={{ color: c.ink }}>{cmd}</span>
    </div>
  );

  const Comment = ({ children }: { children: React.ReactNode }) => (
    <span style={{ color: c.dim }}>{children}</span>
  );

  const statusColor = (s: ProjectStatus) =>
    s === "live" ? c.accent : s === "active" ? c.accent2 : c.accent3;

  const lsListing = (() => {
    const today = new Date().toLocaleDateString("en", { month: "short", day: "2-digit" });
    const header = `total ${projects.length}\ndrwxr-xr-x  ${projects.length} lucas  staff   ${projects.length * 256}  ${today}`;
    const rows = projects.map((p) => {
      const x = p.status === "live" ? "x" : "-";
      return `drwxr-x${x}--x  -  lucas  staff   ${p.name.padEnd(14)} [${t(strings.statusLabels[p.status]).padEnd(14)}]`;
    });
    return [header, ...rows].join("\n");
  })();

  return (
    <div
      data-screen-label="Terminal Dev"
      style={{
        fontFamily: 'var(--font-jetbrains), "JetBrains Mono", "Fira Code", "SF Mono", ui-monospace, "Courier New", monospace',
        background: c.bg,
        color: c.ink,
        width: "100%",
        minHeight: "100vh",
        fontSize: 14,
        lineHeight: 1.6,
        paddingBottom: isMobile ? 88 : 0,
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          background: c.panel,
          borderBottom: `1px solid ${c.line}`,
          padding: `${isMobile ? 8 : 10}px ${isMobile ? 12 : 16}px`,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 8 : 12,
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          <span style={dot("#ff5f57")} />
          <span style={dot("#febc2e")} />
          <span style={dot("#28c840")} />
        </div>
        {!isMobile && (
          <div style={{ flex: 1, textAlign: "center", color: c.muted, fontSize: 12 }}>
            lucas@uma — ~/portfolio — 132×40
          </div>
        )}
        {isMobile && <div style={{ flex: 1 }} />}
        <div style={{ display: "flex", gap: 6 }}>
          {(["dark", "light", "navy"] as const).map((th) => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              style={{
                padding: "3px 9px",
                fontSize: 11,
                background: theme === th ? c.accent : "transparent",
                color: theme === th ? c.bg : c.muted,
                border: `1px solid ${theme === th ? c.accent : c.line}`,
                borderRadius: 3,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "lowercase",
                transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease",
              }}
            >
              {th}
            </button>
          ))}
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            style={{
              padding: "3px 9px",
              fontSize: 11,
              background: "transparent",
              color: c.accent3,
              border: `1px solid ${c.line}`,
              borderRadius: 3,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
            }}
          >
            --lang={lang}
          </button>
        </div>
      </div>

      <div style={{ padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px` }}>
        <pre
          style={{
            margin: 0,
            color: c.accent,
            fontSize: 11,
            lineHeight: 1.2,
            whiteSpace: "pre",
            overflowX: "auto",
          }}
        >
          {headerAscii}
        </pre>

        <div style={{ marginTop: 12, color: c.muted, fontSize: 12 }}>
          v2.6 · {identity.location} · {t(strings.hero.kicker)}
        </div>

        <hr style={hr(c)} />

        <Prompt cmd="whoami" />
        <pre
          style={{
            margin: "0 0 6px",
            color: c.ink,
            fontSize: 13,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {`${identity.name}\n${t(strings.hero.role)}`}
        </pre>
        <Prompt cmd="cat intro.md" />
        <p
          style={{
            color: c.ink,
            maxWidth: 760,
            margin: "0 0 8px",
            padding: "12px 18px",
            background: c.panel,
            borderLeft: `2px solid ${c.accent}`,
            lineHeight: 1.65,
          }}
        >
          {t(strings.hero.intro)}
        </p>
        <div style={{ fontSize: 12, color: c.muted, marginBottom: 8 }}>
          <span style={{ color: c.accent }}>●</span> {t(strings.hero.available)}
          {"   "}
          <Comment>{"// "}{t(strings.hero.based)}</Comment>
        </div>

        <hr style={hr(c)} />

        <Prompt cmd="ls -la ~/projects" />
        <pre
          style={{
            margin: "0 0 18px",
            fontSize: 12,
            color: c.muted,
            lineHeight: 1.6,
            whiteSpace: "pre",
            overflowX: "auto",
          }}
        >
          {lsListing}
        </pre>

        {projects.map((proj) => (
          <div
            key={proj.id}
            style={{
              marginBottom: 36,
              border: `1px solid ${c.line}`,
              borderRadius: 4,
              background: c.panel,
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderBottom: `1px solid ${c.line}`,
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 8 : 12,
                flexWrap: "wrap",
                background: "rgba(0,0,0,0.18)",
              }}
            >
              <span style={{ color: c.muted, fontSize: 12 }}>[{proj.n}]</span>
              <span style={{ color: statusColor(proj.status), fontSize: 11, fontWeight: 700 }}>
                ● {t(strings.statusLabels[proj.status])}
              </span>
              <span style={{ color: c.ink, fontWeight: 700, fontSize: 15 }}>{proj.name}</span>
              <span style={{ color: c.muted, fontSize: 12 }}>— {t(proj.tagline)}</span>
              <span style={{ flex: 1 }} />
              {proj.url && (
                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: c.accent3, textDecoration: "none", fontSize: 12 }}
                >
                  ↗ {proj.platform}
                </a>
              )}
            </div>

            <div style={{ padding: isMobile ? "16px 14px" : "18px 22px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: narrow
                    ? "minmax(0, 1fr)"
                    : "minmax(0, 1fr) minmax(0, 1.15fr)",
                  gap: narrow ? 22 : 28,
                }}
              >
                {/* LEFT: same text content as Minimal — README + meta + principles + quality */}
                <div>
                  <Prompt cmd={`cat projects/${proj.id}/README.md`} />
                  <p
                    style={{
                      color: c.ink,
                      margin: "0 0 18px",
                      lineHeight: 1.65,
                      fontSize: 13.5,
                    }}
                  >
                    {t(proj.summary)}
                  </p>

                  <div style={{ fontSize: 12.5, color: c.muted, lineHeight: 1.9 }}>
                    <div>
                      <span style={{ color: c.accent2 }}>role     </span>
                      <span style={{ color: c.muted }}>:: </span>
                      <span style={{ color: c.ink }}>{t(proj.role)}</span>
                    </div>
                    <div>
                      <span style={{ color: c.accent2 }}>stack    </span>
                      <span style={{ color: c.muted }}>:: </span>
                      <span style={{ color: c.ink }}>[{proj.stack.join(", ")}]</span>
                    </div>
                    <div>
                      <span style={{ color: c.accent2 }}>platform </span>
                      <span style={{ color: c.muted }}>:: </span>
                      <span style={{ color: c.ink }}>{proj.platform}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <Prompt cmd={`cat ${proj.id}/principles.md`} />
                    <TerminalList items={t(proj.philosophy)} c={c} />
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <Prompt cmd={`cat ${proj.id}/quality.md`} />
                    <TerminalList items={t(proj.quality)} c={c} />
                  </div>
                </div>

                {/* RIGHT: architecture console (code dropped — diagram centred) */}
                <div>
                  <Prompt cmd={`./diagram ${proj.id}.arch`} />
                  <div
                    style={{
                      padding: "16px 18px",
                      background: c.bg,
                      borderRadius: 3,
                      border: `1px solid ${c.line}`,
                      overflowX: "auto",
                      textAlign: "center",
                    }}
                  >
                    <pre
                      style={{
                        margin: 0,
                        display: "inline-block",
                        textAlign: "left",
                        color: c.accent3,
                        fontSize: 10.5,
                        lineHeight: 1.55,
                        whiteSpace: "pre",
                      }}
                    >
                      {proj.diagram}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <hr style={hr(c)} />

        <Prompt cmd="cat ~/about.yml" />
        <pre
          style={{
            margin: "0 0 28px",
            padding: "16px 20px",
            background: c.panel,
            borderLeft: `2px solid ${c.accent2}`,
            fontSize: 13,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          <span style={{ color: c.accent2 }}>name</span>
          {": "}
          <span style={{ color: c.ink }}>{identity.name}</span>
          {"\n"}
          <span style={{ color: c.accent2 }}>location</span>
          {": "}
          <span style={{ color: c.ink }}>{identity.location}</span>
          {"\n"}
          <span style={{ color: c.accent2 }}>education</span>
          {":\n"}
          {"  - "}
          <span style={{ color: c.accent }}>degree</span>
          {": "}
          <span style={{ color: c.ink }}>{t(strings.education.degreeTitle)}</span>
          {"\n"}
          {"    "}
          <span style={{ color: c.accent }}>at</span>
          {":     "}
          <span style={{ color: c.ink }}>{t(strings.education.degreeInst)}</span>
          {"\n"}
          {"    "}
          <span style={{ color: c.accent }}>period</span>
          {": "}
          <span style={{ color: c.ink }}>{t(strings.education.degreeDates)}</span>
          {"\n"}
          {"    "}
          <span style={{ color: c.accent }}>gpa</span>
          {":    "}
          <span style={{ color: c.accent3 }}>8.7 / 10</span>
          {"\n"}
          {"    "}
          <span style={{ color: c.accent }}>honors</span>
          {": ["}
          <span style={{ color: c.accent3 }}>
            {t(strings.education.honorsList)
              .split(" · ")
              .map((h) => `"${h}"`)
              .join(", ")}
          </span>
          {"]\n"}
          {"  - "}
          <span style={{ color: c.accent }}>degree</span>
          {": "}
          <span style={{ color: c.ink }}>{t(strings.education.bachTitle)}</span>
          {"\n"}
          {"    "}
          <span style={{ color: c.accent }}>at</span>
          {":     "}
          <span style={{ color: c.ink }}>{t(strings.education.bachInst)}</span>
          {"\n"}
          {"    "}
          <span style={{ color: c.accent }}>period</span>
          {": "}
          <span style={{ color: c.ink }}>{t(strings.education.bachDates)}</span>
        </pre>

        <Prompt cmd="skills --top" />
        <div
          style={{
            background: c.panel,
            padding: "18px 20px",
            marginBottom: 28,
            border: `1px solid ${c.line}`,
            borderRadius: 3,
          }}
        >
          {skills.map((s) => (
            <div
              key={s.lang}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 13,
                padding: "4px 0",
              }}
            >
              <span style={{ width: 90, color: c.accent, fontWeight: 700 }}>{s.lang}</span>
              <span style={{ color: c.muted, fontSize: 12, flex: 1 }}>{t(s.note)}</span>
            </div>
          ))}
        </div>

        <Prompt cmd="methodology --list" />
        <div style={{ marginBottom: 28, fontSize: 12.5 }}>
          {t(strings.methodology).map((m) => (
            <span
              key={m}
              style={{
                display: "inline-block",
                marginRight: 6,
                marginBottom: 6,
                padding: "3px 9px",
                border: `1px solid ${c.line}`,
                color: c.ink,
                borderRadius: 3,
              }}
            >
              {m}
            </span>
          ))}
        </div>

        <Prompt cmd="tools --list" />
        <div style={{ marginBottom: 28, fontSize: 12.5 }}>
          {tools.map((tool) => (
            <span
              key={tool}
              style={{
                display: "inline-block",
                marginRight: 6,
                marginBottom: 6,
                padding: "3px 9px",
                border: `1px solid ${c.line}`,
                color: c.ink,
                borderRadius: 3,
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        <Prompt cmd="locale -a" />
        <div style={{ marginBottom: 28, fontSize: 13, lineHeight: 1.85 }}>
          {strings.languages.map((l, i) => (
            <div key={i}>
              <span style={{ color: c.accent }}>
                {t(l.name).toLowerCase()}_{i === 0 ? "AR" : "GB"}.UTF-8
              </span>
              <span style={{ color: c.muted }}>{"  —  "}</span>
              <span style={{ color: c.ink }}>{t(l.level)}</span>
            </div>
          ))}
        </div>

        <hr style={hr(c)} />

        <Prompt cmd="contact --resolve" />
        <pre
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.9,
            color: c.ink,
            padding: "16px 20px",
            background: c.panel,
            borderLeft: `2px solid ${c.accent3}`,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <span style={{ color: c.accent3 }}>email   </span>
          {" → "}
          <a href={`mailto:${identity.email}`} style={{ color: c.accent, textDecoration: "none" }}>
            {identity.email}
          </a>
          {"\n"}
          <span style={{ color: c.accent3 }}>linkedin</span>
          {" → "}
          <a
            href={identity.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: c.accent, textDecoration: "none" }}
          >
            {identity.linkedin}
          </a>
          {"\n"}
          <span style={{ color: c.accent3 }}>github  </span>
          {" → "}
          <a
            href={identity.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: c.accent, textDecoration: "none" }}
          >
            {identity.github}
          </a>
        </pre>

        <div
          style={{
            marginTop: 32,
            fontSize: 11,
            color: c.muted,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 14,
              background: c.accent,
              animation: "portfolio-blink 1s steps(2) infinite",
              verticalAlign: "middle",
            }}
          />
          <span>
            {identity.name} · © {new Date().getFullYear()} · session active
          </span>
        </div>
      </div>

      <style>{`@keyframes portfolio-blink{50%{opacity:0}}`}</style>
    </div>
  );
}

function TerminalList({ items, c }: { items: string[]; c: Palette }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 10,
            padding: "3px 0",
            fontSize: 12.5,
            lineHeight: 1.55,
            color: c.ink,
          }}
        >
          <span style={{ color: c.accent }}>▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
