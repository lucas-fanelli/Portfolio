// PortfolioEditorial — Direction 3
// Magazine / editorial feel. Big serif display type, asymmetric grids,
// numbered features, drop caps, oversized project numerals. Visuals are
// architecture diagrams typeset as monospace plates, framed like figures.

const PortfolioEditorial = ({ theme = "light", lang = "en", setTheme, setLang }) => {
  const P = window.PORTFOLIO;
  const t = (v) => P.pick(v, lang);

  const palettes = {
    light: {
      bg: "#f4ede0",
      paper: "#ebe2cf",
      ink: "#1d1b16",
      muted: "#6a6253",
      rule: "#1d1b16",
      accent: "#c84a1f",
      tag: "rgba(29,27,22,0.06)",
    },
    dark: {
      bg: "#15140f",
      paper: "#1d1b15",
      ink: "#ede4cd",
      muted: "#9a8f76",
      rule: "#ede4cd",
      accent: "#ff9572",
      tag: "rgba(237,228,205,0.08)",
    },
    navy: {
      bg: "#0f1a30",
      paper: "#15233f",
      ink: "#f4e7d4",
      muted: "#9aa7c0",
      rule: "#f4e7d4",
      accent: "#ffb46b",
      tag: "rgba(244,231,212,0.08)",
    },
  };
  const c = palettes[theme] || palettes.light;

  return (
    <div data-screen-label="Editorial" style={{
      fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
      background: c.bg, color: c.ink, width: "100%", minHeight: "100%",
      fontSize: 15.5, lineHeight: 1.6,
    }}>
      {/* ───── Masthead ───── */}
      <header style={{
        padding: "26px 56px 22px",
        borderBottom: `2px solid ${c.rule}`,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 32,
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: c.muted, marginBottom: 6 }}>
            Issue 01 · {new Date().toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { month: "long", year: "numeric" })}
          </div>
          <div style={{
            fontFamily: '"Newsreader", "Iowan Old Style", Georgia, "Times New Roman", serif',
            fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1,
            fontStyle: "italic",
          }}>
            The Fanelli Quarterly
          </div>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#work" style={navLinkEd(c)}>{t(P.t.nav.work)}</a>
          <a href="#about" style={navLinkEd(c)}>{t(P.t.nav.about)}</a>
          <a href="#contact" style={navLinkEd(c)}>{t(P.t.nav.contact)}</a>
          <div style={{ display: "flex", gap: 4, padding: "3px", border: `1px solid ${c.rule}`, borderRadius: 999 }}>
            {["light", "dark", "navy"].map((th) => (
              <button key={th} onClick={() => setTheme && setTheme(th)} style={{
                width: 18, height: 18, borderRadius: "50%",
                border: theme === th ? `1.5px solid ${c.accent}` : "1px solid transparent",
                background: th === "light" ? "#f4ede0" : th === "dark" ? "#15140f" : "#0f1a30",
                cursor: "pointer", padding: 0,
              }} aria-label={`theme ${th}`} />
            ))}
          </div>
          <button onClick={() => setLang && setLang(lang === "es" ? "en" : "es")} style={{
            padding: "6px 14px", border: `1px solid ${c.rule}`,
            background: "transparent", color: c.ink,
            fontFamily: "inherit", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em",
            cursor: "pointer", borderRadius: 999,
          }}>{t(P.t.nav.lang)}</button>
        </nav>
      </header>

      {/* ───── Hero spread ───── */}
      <section style={{
        padding: "60px 56px 80px",
        borderBottom: `1px solid ${c.rule}`,
        position: "relative",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 56, alignItems: "start" }}>
          <div style={{
            fontFamily: '"Newsreader", Georgia, serif',
            fontSize: 240, lineHeight: 0.78, fontWeight: 200,
            color: c.accent, letterSpacing: "-0.06em",
          }}>LF</div>
          <div style={{ paddingTop: 12 }}>
            <div style={{
              fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase",
              color: c.muted, marginBottom: 18,
            }}>{t(P.t.hero.kicker)}</div>
            <h1 style={{
              fontFamily: '"Newsreader", Georgia, "Times New Roman", serif',
              fontSize: 112, lineHeight: 0.92, letterSpacing: "-0.035em",
              fontWeight: 400, margin: "0 0 22px",
            }}>
              Lucas <span style={{ fontStyle: "italic", color: c.accent, fontWeight: 300 }}>Fanelli</span>
              <br />
              Sánchez.
            </h1>
            <p style={{
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: 26, lineHeight: 1.35, color: c.ink, margin: "0 0 28px",
              maxWidth: 620, fontStyle: "italic", fontWeight: 400,
            }}>"{t(P.t.hero.role)}."</p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: c.muted }}>
              <span><strong style={{ color: c.accent }}>●</strong> {t(P.t.hero.available)}</span>
              <span style={{ opacity: 0.4 }}>—</span>
              <span>{P.identity.location}</span>
              <span style={{ opacity: 0.4 }}>—</span>
              <span>est. 2006</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Intro pull-paragraph with drop cap ───── */}
      <section style={{
        padding: "64px 56px",
        borderBottom: `1px solid ${c.rule}`,
        background: c.paper,
      }}>
        <div style={{ maxWidth: 900, columnCount: 2, columnGap: 48 }}>
          <p style={{
            fontFamily: '"Newsreader", Georgia, serif',
            fontSize: 19, lineHeight: 1.6, margin: 0, color: c.ink,
            textAlign: "justify", hyphens: "auto",
          }}>
            <span style={{
              float: "left",
              fontSize: 96, lineHeight: 0.8, fontWeight: 500,
              paddingRight: 12, marginTop: 6, color: c.accent,
              fontFamily: '"Newsreader", Georgia, serif',
            }}>{lang === "es" ? "D" : "I"}</span>
            {t(P.t.hero.intro)}
          </p>
        </div>
      </section>

      {/* ───── Work — three editorial spreads ───── */}
      <section id="work" style={{ padding: "72px 56px 40px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginBottom: 56,
          borderBottom: `2px solid ${c.rule}`, paddingBottom: 14,
        }}>
          <h2 style={featureLabel(c)}>{t(P.t.sections.work)}</h2>
          <div style={{ fontSize: 12, color: c.muted, fontStyle: "italic" }}>
            {t(P.t.sections.workNote)}
          </div>
        </div>

        {P.projects.map((proj, idx) => (
          <article key={proj.id} style={{
            display: "grid",
            gridTemplateColumns: idx % 2 === 0 ? "auto 1fr 1.2fr" : "auto 1.2fr 1fr",
            gap: 48,
            padding: "56px 0",
            borderBottom: `1px solid ${c.rule}`,
            alignItems: "start",
          }}>
            {/* Big numeral */}
            <div style={{
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: 160, lineHeight: 0.78, fontWeight: 200,
              color: c.accent, fontStyle: "italic",
              letterSpacing: "-0.04em",
            }}>{proj.n}</div>

            {/* Text */}
            <div style={{ order: idx % 2 === 0 ? 0 : 2 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: c.muted, marginBottom: 10 }}>
                {t(P.t.statusLabels[proj.status])} · {proj.platform}
              </div>
              <h3 style={{
                fontFamily: '"Newsreader", Georgia, serif',
                fontSize: 64, fontWeight: 400, letterSpacing: "-0.025em",
                lineHeight: 0.98, margin: "0 0 12px",
              }}>{proj.name}</h3>
              <p style={{
                fontFamily: '"Newsreader", Georgia, serif',
                fontSize: 22, fontStyle: "italic", color: c.accent,
                margin: "0 0 22px", lineHeight: 1.3, fontWeight: 400,
              }}>{t(proj.tagline)}</p>
              <p style={{
                fontSize: 15.5, lineHeight: 1.65, color: c.ink,
                margin: "0 0 24px", maxWidth: 520,
              }}>{t(proj.summary)}</p>

              <div style={{
                paddingTop: 18, borderTop: `1px solid ${c.rule}`,
                display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 10, columnGap: 18,
                fontSize: 12,
              }}>
                <span style={kvKey(c)}>{t(P.t.role)}</span>
                <span style={kvVal(c)}>{t(proj.role)}</span>
                <span style={kvKey(c)}>{t(P.t.stack)}</span>
                <span style={kvVal(c)}>{proj.stack.join(" · ")}</span>
                <span style={kvKey(c)}>{t(P.t.platform)}</span>
                <span style={kvVal(c)}>
                  {proj.url
                    ? <a href={proj.url} style={{ color: c.accent, textDecoration: "underline", textUnderlineOffset: 3 }}>{proj.platform} ↗</a>
                    : proj.platform}
                </span>
              </div>
            </div>

            {/* Figure: architecture plate */}
            <figure style={{ margin: 0, order: idx % 2 === 0 ? 2 : 0 }}>
              <div style={{
                background: c.paper, border: `1px solid ${c.rule}`,
                padding: "20px 22px 6px",
              }}>
                <pre style={{
                  margin: 0, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 10.5, lineHeight: 1.55, color: c.ink,
                  whiteSpace: "pre", overflow: "hidden",
                }}>{proj.diagram}</pre>
              </div>
              <figcaption style={{
                fontSize: 11, fontStyle: "italic", color: c.muted,
                marginTop: 8, fontFamily: '"Newsreader", Georgia, serif',
              }}>
                <span style={{ fontWeight: 600, fontStyle: "normal", color: c.ink }}>Fig. {proj.n}</span>
                {"  —  "}{t(P.t.arch)} · {proj.name}
              </figcaption>
            </figure>
          </article>
        ))}
      </section>

      {/* ───── About ───── */}
      <section id="about" style={{ padding: "72px 56px", background: c.paper, borderTop: `2px solid ${c.rule}` }}>
        <h2 style={{ ...featureLabel(c), marginBottom: 56, borderBottom: `2px solid ${c.rule}`, paddingBottom: 14 }}>
          {t(P.t.sections.about)}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64 }}>
          <div>
            <div style={kicker(c)}>{t(P.t.sections.education)}</div>
            <div style={{
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: 32, lineHeight: 1.15, margin: "0 0 8px", letterSpacing: "-0.015em",
            }}>{t(P.t.education.degreeTitle)}</div>
            <div style={{ fontSize: 14, color: c.muted, marginBottom: 24 }}>
              {t(P.t.education.degreeInst)} · {t(P.t.education.degreeDates)}
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
              marginBottom: 24,
            }}>
              <Stat c={c} label={t(P.t.education.gpa)} value="8,7" suffix="/ 10" />
              <Stat c={c} label={t(P.t.education.access)} value="13,4" suffix="/ 14" />
            </div>
            <div style={{ fontSize: 14, color: c.ink, paddingTop: 18, borderTop: `1px solid ${c.rule}` }}>
              <span style={{ ...kicker(c), display: "inline-block", marginRight: 10 }}>{t(P.t.education.honors)}</span>
              <span style={{ fontFamily: '"Newsreader", Georgia, serif', fontStyle: "italic", fontSize: 17 }}>
                {t(P.t.education.honorsList)}
              </span>
            </div>

            <div style={{ marginTop: 40 }}>
              <div style={kicker(c)}>{t(P.t.sections.languages)}</div>
              {P.t.languages.map((l, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  alignItems: "baseline", gap: 20, padding: "14px 0",
                  borderTop: i ? `1px solid ${c.rule}` : "none",
                }}>
                  <div>
                    <div style={{
                      fontFamily: '"Newsreader", Georgia, serif', fontSize: 22,
                      fontStyle: "italic",
                    }}>{t(l.name)}</div>
                    <div style={{ fontSize: 13, color: c.muted, marginTop: 2 }}>{t(l.level)}</div>
                  </div>
                  <div style={{
                    fontFamily: '"Newsreader", Georgia, serif', fontSize: 28,
                    color: c.accent, fontWeight: 500,
                  }}>
                    {l.bars === 5 ? "Native" : `${l.bars}/5`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={kicker(c)}>{t(P.t.sections.stack)}</div>
            <div style={{ display: "grid", gap: 0 }}>
              {P.skills.map((s, i) => (
                <div key={s.lang} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto",
                  gap: 16, alignItems: "baseline",
                  padding: "14px 0", borderTop: `1px solid ${c.rule}`,
                  borderBottom: i === P.skills.length - 1 ? `1px solid ${c.rule}` : "none",
                }}>
                  <span style={{
                    fontFamily: '"Newsreader", Georgia, serif', fontSize: 28,
                    fontWeight: 400, letterSpacing: "-0.01em", minWidth: 120,
                  }}>{s.lang}</span>
                  <span style={{ fontSize: 13, color: c.muted }}>{t(s.note)}</span>
                  <span style={{
                    fontFamily: "ui-monospace, monospace", fontSize: 11,
                    color: c.muted, letterSpacing: "0.1em",
                  }}>0{i + 1}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <div style={kicker(c)}>{t(P.t.sections.methodology)}</div>
              <p style={{
                fontFamily: '"Newsreader", Georgia, serif', fontSize: 19,
                lineHeight: 1.55, margin: 0, color: c.ink,
              }}>
                {t(P.t.methodology).map((m, i) => (
                  <React.Fragment key={m}>
                    <span style={{ fontStyle: "italic" }}>{m}</span>
                    {i < t(P.t.methodology).length - 1 && <span style={{ color: c.accent }}>  ·  </span>}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div style={{ marginTop: 40 }}>
              <div style={kicker(c)}>Tools</div>
              <p style={{
                fontSize: 14, color: c.muted, margin: 0, lineHeight: 1.7,
              }}>{P.tools.join("  ·  ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Contact ───── */}
      <section id="contact" style={{ padding: "72px 56px 40px" }}>
        <h2 style={{ ...featureLabel(c), marginBottom: 24, borderBottom: `2px solid ${c.rule}`, paddingBottom: 14 }}>
          {t(P.t.sections.contact)}
        </h2>
        <p style={{
          fontFamily: '"Newsreader", Georgia, serif', fontSize: 22,
          fontStyle: "italic", color: c.muted, maxWidth: 560,
          margin: "0 0 40px", lineHeight: 1.4,
        }}>{t(P.t.sections.contactNote)}</p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          borderTop: `2px solid ${c.rule}`, borderBottom: `2px solid ${c.rule}`,
        }}>
          {[
            { label: "Email", value: P.identity.email, href: `mailto:${P.identity.email}` },
            { label: "LinkedIn", value: P.identity.linkedin, href: P.identity.linkedinUrl },
            { label: "GitHub", value: P.identity.github, href: P.identity.githubUrl },
          ].map((item, i) => (
            <a key={item.label} href={item.href} style={{
              padding: "32px 24px",
              borderLeft: i ? `1px solid ${c.rule}` : "none",
              textDecoration: "none", color: c.ink,
              display: "block",
            }}>
              <div style={{ ...kicker(c), marginBottom: 16 }}>{item.label}</div>
              <div style={{
                fontFamily: '"Newsreader", Georgia, serif', fontSize: 22,
                lineHeight: 1.2, wordBreak: "break-word",
                color: c.accent, letterSpacing: "-0.005em",
              }}>{item.value}</div>
            </a>
          ))}
        </div>

        <div style={{
          padding: "32px 0 12px", display: "flex", justifyContent: "space-between",
          fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
          color: c.muted,
        }}>
          <span>© {new Date().getFullYear()} Lucas Fanelli Sánchez</span>
          <span>Set in Newsreader & Inter</span>
          <span>{lang === "es" ? "Fin de la edición" : "End of issue"}</span>
        </div>
      </section>
    </div>
  );
};

// ───── helpers ─────
const navLinkEd = (c) => ({
  color: c.ink, textDecoration: "none", fontSize: 13,
  fontWeight: 500, letterSpacing: "0.04em",
});
const featureLabel = (c) => ({
  fontFamily: '"Newsreader", Georgia, serif',
  fontSize: 48, fontWeight: 400, fontStyle: "italic",
  margin: 0, letterSpacing: "-0.02em", color: c.ink,
});
const kicker = (c) => ({
  fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase",
  color: c.muted, fontWeight: 600, marginBottom: 16,
});
const kvKey = (c) => ({
  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
  color: c.muted, fontWeight: 600, paddingTop: 2,
});
const kvVal = (c) => ({
  fontSize: 14, color: c.ink, lineHeight: 1.4,
});

const Stat = ({ c, label, value, suffix }) => (
  <div style={{
    padding: "16px 18px", background: c.bg,
    border: `1px solid ${c.rule}`,
  }}>
    <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: c.muted, marginBottom: 8 }}>
      {label}
    </div>
    <div style={{
      fontFamily: '"Newsreader", Georgia, serif',
      fontSize: 44, lineHeight: 1, fontWeight: 400,
      color: c.accent, letterSpacing: "-0.02em",
    }}>
      {value} <span style={{ fontSize: 14, color: c.muted, fontStyle: "italic" }}>{suffix}</span>
    </div>
  </div>
);

window.PortfolioEditorial = PortfolioEditorial;
