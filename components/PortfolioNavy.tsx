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

type NavyTheme = "light" | "dark" | "navy";

type Palette = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentInk: string;
  tag: string;
  tagInk: string;
  code: string;
  codeInk: string;
};

const palettes: Record<NavyTheme, Palette> = {
  light: {
    bg: "#f7f6f3",
    surface: "#ffffff",
    ink: "#1a1f2c",
    muted: "#5b6478",
    line: "rgba(26,31,44,0.10)",
    accent: "#2B4C7E",
    accentInk: "#ffffff",
    tag: "#eef1f7",
    tagInk: "#2B4C7E",
    code: "#0f1422",
    codeInk: "#dbe2f1",
  },
  dark: {
    bg: "#0d1117",
    surface: "#161b22",
    ink: "#e6edf3",
    muted: "#8b95a7",
    line: "rgba(230,237,243,0.10)",
    accent: "#6ea8ff",
    accentInk: "#0d1117",
    tag: "rgba(110,168,255,0.12)",
    tagInk: "#9ec0ff",
    code: "#010409",
    codeInk: "#d1d9e0",
  },
  navy: {
    bg: "#1a2c4a",
    surface: "#22375a",
    ink: "#f3ecd9",
    muted: "#b6c2d8",
    line: "rgba(243,236,217,0.15)",
    accent: "#e3b341",
    accentInk: "#1a2c4a",
    tag: "rgba(243,236,217,0.10)",
    tagInk: "#f3ecd9",
    code: "#0f1d33",
    codeInk: "#e3ecf7",
  },
};

const navLink = (c: Palette): React.CSSProperties => ({
  color: c.ink,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.8,
  transition: "opacity .15s",
});
const sectionKicker = (c: Palette): React.CSSProperties => ({
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: c.accent,
  fontWeight: 600,
  marginBottom: 12,
  fontFamily: "ui-monospace, monospace",
});
const sectionH2: React.CSSProperties = {
  fontSize: 44,
  fontWeight: 600,
  letterSpacing: "-0.025em",
  margin: 0,
  lineHeight: 1.05,
};
const subHeader = (c: Palette): React.CSSProperties => ({
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: c.muted,
  fontWeight: 600,
  margin: "0 0 20px",
});
const metaDt = (c: Palette): React.CSSProperties => ({
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: c.muted,
  fontWeight: 600,
});
const metaDd = (c: Palette): React.CSSProperties => ({
  margin: 0,
  fontSize: 14,
  color: c.ink,
});

type Props = {
  theme: Theme;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
};

export default function PortfolioNavy({ theme, lang, setTheme, setLang }: Props) {
  const c = palettes[theme] || palettes.light;
  const t = <T,>(value: Localized<T> | T): T => pick(value, lang);
  const { isMobile, isTablet } = useViewport();
  const narrow = isMobile || isTablet;
  const PAD_X = isMobile ? 20 : isTablet ? 40 : 64;
  const SECTION_PAD = isMobile
    ? `64px ${PAD_X}px 48px`
    : isTablet
      ? `80px ${PAD_X}px 64px`
      : `96px ${PAD_X}px 80px`;
  const HERO_PAD = isMobile
    ? `72px ${PAD_X}px 56px`
    : isTablet
      ? `96px ${PAD_X}px 72px`
      : `120px ${PAD_X}px 96px`;
  const sectionH2Resp: React.CSSProperties = {
    ...sectionH2,
    fontSize: isMobile ? 30 : isTablet ? 38 : 44,
  };

  const statusBadge = (status: ProjectStatus) => {
    const label = t(strings.statusLabels[status]);
    return (
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          fontWeight: 600,
          padding: "4px 8px",
          borderRadius: 999,
          background: status === "live" ? c.accent : "transparent",
          color: status === "live" ? c.accentInk : c.muted,
          border: status === "live" ? "none" : `1px solid ${c.line}`,
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <div
      data-screen-label="Navy Minimal"
      style={{
        fontFamily: 'var(--font-inter), "Inter", "Helvetica Neue", Helvetica, system-ui, sans-serif',
        background: c.bg,
        color: c.ink,
        width: "100%",
        minHeight: "100vh",
        fontSize: 15,
        lineHeight: 1.55,
        letterSpacing: "-0.005em",
        paddingBottom: isMobile ? 88 : 0,
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 12 : 32,
          padding: `${isMobile ? 18 : 26}px ${PAD_X}px`,
          borderBottom: `1px solid ${c.line}`,
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: c.bg + "f2",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: c.accent,
              color: c.accentInk,
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            LF
          </span>
          <span>Lucas Fanelli</span>
          <span style={{ color: c.muted, fontWeight: 400 }}>/ portfolio</span>
        </div>
        <div style={{ flex: 1 }} />
        {!isMobile && (
          <>
            <a href="#work" style={navLink(c)}>
              {t(strings.nav.work)}
            </a>
            <a href="#about" style={navLink(c)}>
              {t(strings.nav.about)}
            </a>
            <a href="#contact" style={navLink(c)}>
              {t(strings.nav.contact)}
            </a>
          </>
        )}
        <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
          {(["light", "dark", "navy"] as const).map((th) => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: theme === th ? c.accent : c.line,
                background: th === "light" ? "#f7f6f3" : th === "dark" ? "#0d1117" : "#1a2c4a",
                cursor: "pointer",
                padding: 0,
                transform: theme === th ? "scale(1.1)" : "scale(1)",
                transition: "border-color 0.25s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-label={`theme ${th}`}
            />
          ))}
        </div>
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: `1px solid ${c.line}`,
            background: "transparent",
            color: c.ink,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = c.tag;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {t(strings.nav.lang)}
        </button>
      </nav>

      {/* Hero */}
      <section style={{ padding: HERO_PAD, borderBottom: `1px solid ${c.line}` }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 14px",
            borderRadius: 999,
            border: `1px solid ${c.line}`,
            background: c.surface,
            fontSize: 12,
            color: c.muted,
            marginBottom: 36,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#3aab6d",
              boxShadow: "0 0 0 4px rgba(58,171,109,0.18)",
            }}
          />
          {t(strings.hero.available)} · {t(strings.hero.based)}
        </div>
        <h1
          style={{
            fontSize: isMobile ? 44 : isTablet ? 64 : 84,
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            fontWeight: 600,
            margin: "0 0 28px",
            maxWidth: 1000,
          }}
        >
          {identity.name.split(" ").slice(0, 2).join(" ")}
          <br />
          <span style={{ color: c.muted, fontWeight: 400 }}>
            {identity.name.split(" ").slice(2).join(" ")}.
          </span>
        </h1>
        <p
          style={{
            fontSize: isMobile ? 17 : 22,
            lineHeight: 1.45,
            maxWidth: 720,
            color: c.ink,
            fontWeight: 400,
            margin: "0 0 12px",
          }}
        >
          {t(strings.hero.role)}.
        </p>
        <p
          style={{
            fontSize: 14,
            color: c.muted,
            marginBottom: 32,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {t(strings.hero.kicker)}
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 640, color: c.muted, margin: 0 }}>
          {t(strings.hero.intro)}
        </p>
      </section>

      {/* Work */}
      <section id="work" style={{ padding: SECTION_PAD }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "baseline",
            justifyContent: "space-between",
            gap: isMobile ? 12 : 0,
            marginBottom: isMobile ? 36 : 56,
          }}
        >
          <div>
            <div style={sectionKicker(c)}>§ 01 · Work</div>
            <h2 style={sectionH2Resp}>{t(strings.sections.work)}</h2>
          </div>
          <p
            style={{
              color: c.muted,
              fontSize: 14,
              maxWidth: 360,
              textAlign: isMobile ? "left" : "right",
            }}
          >
            {t(strings.sections.workNote)}
          </p>
        </div>

        <div style={{ display: "grid", gap: isMobile ? 28 : 40 }}>
          {projects.map((proj) => (
            <article
              key={proj.id}
              style={{
                background: c.surface,
                border: `1px solid ${c.line}`,
                borderRadius: 16,
                padding: isMobile ? 22 : 36,
                display: "grid",
                gridTemplateColumns: narrow ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1.1fr)",
                gap: narrow ? 28 : 40,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                  <span
                    style={{
                      fontSize: 13,
                      color: c.muted,
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {proj.n}
                  </span>
                  {statusBadge(proj.status)}
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? 28 : 38,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    margin: "0 0 8px",
                    lineHeight: 1.05,
                  }}
                >
                  {proj.name}
                </h3>
                <p style={{ fontSize: 17, color: c.accent, fontWeight: 500, margin: "0 0 20px" }}>
                  {t(proj.tagline)}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    color: c.muted,
                    lineHeight: 1.6,
                    margin: "0 0 28px",
                    maxWidth: 460,
                  }}
                >
                  {t(proj.summary)}
                </p>

                <dl
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "10px 24px",
                    margin: 0,
                    fontSize: 13,
                  }}
                >
                  <dt style={metaDt(c)}>{t(strings.role)}</dt>
                  <dd style={metaDd(c)}>{t(proj.role)}</dd>
                  <dt style={metaDt(c)}>{t(strings.stack)}</dt>
                  <dd style={metaDd(c)}>
                    <span style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {proj.stack.map((s) => (
                        <span
                          key={s}
                          style={{
                            background: c.tag,
                            color: c.tagInk,
                            padding: "3px 9px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </span>
                  </dd>
                  <dt style={metaDt(c)}>{t(strings.platform)}</dt>
                  <dd style={metaDd(c)}>
                    {proj.url ? (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: c.accent,
                          textDecoration: "none",
                          borderBottom: `1px solid ${c.accent}`,
                        }}
                      >
                        {proj.platform} ↗
                      </a>
                    ) : (
                      proj.platform
                    )}
                  </dd>
                </dl>

                <div style={{ marginTop: 28 }}>
                  <div style={metaDt(c)}>{t(strings.sections.philosophy)}</div>
                  <PrinciplesList items={t(proj.philosophy)} accent={c.accent} ink={c.ink} />
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={metaDt(c)}>{t(strings.sections.quality)}</div>
                  <PrinciplesList items={t(proj.quality)} accent={c.accent} ink={c.ink} />
                </div>
              </div>

              <div
                style={{
                  background: c.code,
                  borderRadius: 10,
                  overflow: "hidden",
                  fontFamily:
                    'var(--font-jetbrains), "JetBrains Mono", "SF Mono", ui-monospace, monospace',
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: c.codeInk,
                  border: `1px solid ${c.line}`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                  <span style={{ marginLeft: 10 }}>{proj.id}.arch</span>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: isMobile ? "16px 12px" : "28px 20px",
                    overflowX: "auto",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      display: "inline-block",
                      textAlign: "left",
                      fontSize: "clamp(9.5px, calc(7px + 0.45vw), 15px)",
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.78)",
                      whiteSpace: "pre",
                    }}
                  >
                    {proj.diagram}
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        style={{
          padding: SECTION_PAD,
          borderTop: `1px solid ${c.line}`,
          background: c.surface,
        }}
      >
        <div style={sectionKicker(c)}>§ 02 · About</div>
        <h2 style={{ ...sectionH2Resp, marginBottom: isMobile ? 36 : 56 }}>
          {t(strings.sections.about)}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: narrow ? "1fr" : "1fr 1fr",
            gap: isMobile ? 40 : 64,
          }}
        >
          <div>
            <h4 style={subHeader(c)}>{t(strings.sections.education)}</h4>
            <div style={{ padding: "20px 0", borderBottom: `1px solid ${c.line}` }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>
                {t(strings.education.degreeTitle)}
              </div>
              <div style={{ fontSize: 14, color: c.muted, marginBottom: 14 }}>
                {t(strings.education.degreeInst)} · {t(strings.education.degreeDates)}
              </div>
              <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
                <div>
                  <span style={metaDt(c)}>{t(strings.education.gpa)}</span>{" "}
                  <strong style={{ color: c.accent, fontSize: 17 }}>8,7</strong>
                </div>
                <div>
                  <span style={metaDt(c)}>{t(strings.education.access)}</span>{" "}
                  <strong style={{ color: c.accent, fontSize: 17 }}>13,400</strong>
                </div>
              </div>
              <div style={{ marginTop: 14, fontSize: 13, color: c.muted }}>
                <span style={metaDt(c)}>{t(strings.education.honors)}:</span>{" "}
                {t(strings.education.honorsList)}
              </div>
            </div>
            <div style={{ padding: "20px 0" }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                {t(strings.education.bachTitle)}
              </div>
              <div style={{ fontSize: 13, color: c.muted }}>
                {t(strings.education.bachInst)} · {t(strings.education.bachDates)}
              </div>
            </div>

            <h4 style={{ ...subHeader(c), marginTop: 40 }}>{t(strings.sections.languages)}</h4>
            {strings.languages.map((l, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderTop: i ? `1px solid ${c.line}` : "none",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{t(l.name)}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{t(l.level)}</div>
                </div>
                <LanguageRing
                  value={l.bars}
                  max={5}
                  accent={c.accent}
                  lineColor={c.line}
                  ink={c.ink}
                />
              </div>
            ))}
          </div>

          <div>
            <h4 style={subHeader(c)}>{t(strings.sections.stack)}</h4>
            <div style={{ display: "grid", gap: 4 }}>
              {skills.map((s) => (
                <div
                  key={s.lang}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: `1px solid ${c.line}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    {s.lang}
                  </span>
                  <span style={{ fontSize: 12, color: c.muted, textAlign: "right" }}>
                    {t(s.note)}
                  </span>
                </div>
              ))}
            </div>

            <h4 style={{ ...subHeader(c), marginTop: 40 }}>{t(strings.sections.methodology)}</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {t(strings.methodology).map((m) => (
                <span
                  key={m}
                  style={{
                    background: c.tag,
                    color: c.tagInk,
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {m}
                </span>
              ))}
            </div>

            <h4 style={{ ...subHeader(c), marginTop: 40 }}>{t(strings.sections.tools)}</h4>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                fontSize: 13,
                color: c.muted,
              }}
            >
              {tools.map((tool, i) => (
                <span key={tool}>
                  {tool}
                  {i < tools.length - 1 && (
                    <span style={{ marginLeft: 14, opacity: 0.4 }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: SECTION_PAD }}>
        <div style={sectionKicker(c)}>§ 03 · Contact</div>
        <h2 style={{ ...sectionH2Resp, marginBottom: 16 }}>{t(strings.sections.contact)}</h2>
        <p style={{ color: c.muted, fontSize: 16, maxWidth: 480, marginBottom: 40 }}>
          {t(strings.sections.contactNote)}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
            marginBottom: isMobile ? 40 : 64,
          }}
        >
          {[
            {
              label: "Email",
              value: identity.email,
              href: `mailto:${identity.email}`,
              icon: <EmailIcon size={22} />,
            },
            {
              label: "LinkedIn",
              value: identity.linkedin,
              href: identity.linkedinUrl,
              icon: <LinkedInIcon size={22} />,
            },
            {
              label: "GitHub",
              value: identity.github,
              href: identity.githubUrl,
              icon: <GitHubIcon size={22} />,
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                alignItems: "center",
                gap: 16,
                padding: 24,
                borderRadius: 12,
                background: c.surface,
                border: `1px solid ${c.line}`,
                textDecoration: "none",
                color: c.ink,
                transition: "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = c.accent;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = c.line;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ ...metaDt(c), marginBottom: 8 }}>{item.label}</div>
                <div
                  style={{
                    fontSize: 14,
                    color: c.ink,
                    fontFamily: "ui-monospace, monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {item.value}
                </div>
              </div>
              <div
                aria-hidden="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.accent,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
            </a>
          ))}
        </div>

        <div
          style={{
            paddingTop: 28,
            borderTop: `1px solid ${c.line}`,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 6 : 0,
            justifyContent: "space-between",
            fontSize: 12,
            color: c.muted,
          }}
        >
          <span>
            © {new Date().getFullYear()} {identity.name}
          </span>
          <span>{identity.location}</span>
        </div>
      </section>
    </div>
  );
}

function PrinciplesList({
  items,
  accent,
  ink,
}: {
  items: string[];
  accent: string;
  ink: string;
}) {
  return (
    <ul
      style={{
        margin: "10px 0 0",
        padding: 0,
        listStyle: "none",
        display: "grid",
        gap: 4,
      }}
    >
      {items.map((item) => (
        <li
          key={item}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 10,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: ink,
          }}
        >
          <span style={{ color: accent, fontWeight: 700 }}>·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EmailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6 9 6.5L21 6" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
  );
}

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56v-2.02c-3.2.69-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LanguageRing({
  value,
  max,
  accent,
  lineColor,
  ink,
}: {
  value: number;
  max: number;
  accent: string;
  lineColor: string;
  ink: string;
}) {
  const size = 44;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(value, max)) / max) * circumference;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${value} out of ${max}`}
      role="img"
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={lineColor}
        strokeWidth={stroke}
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={accent}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={ink}
        fontSize="13"
        fontWeight={600}
        fontFamily='var(--font-jetbrains), "JetBrains Mono", ui-monospace, monospace'
      >
        {value}
      </text>
    </svg>
  );
}
