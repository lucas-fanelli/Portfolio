// PortfolioNavy — Direction 1
// Recruiter-friendly minimalist. Navy accent, generous whitespace,
// system-stack sans, code snippets as project visuals.
//
// Three themes:
//   light — off-white surface, deep navy accent, ink text
//   dark  — near-black surface, ice text, electric accent
//   navy  — solid navy surface, cream text, gold accent

const PortfolioNavy = ({ theme = "light", lang = "en", setTheme, setLang }) => {
  const P = window.PORTFOLIO;
  const t = (v) => P.pick(v, lang);

  const palettes = {
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
  const c = palettes[theme] || palettes.light;

  const statusBadge = (status) => {
    const label = t(P.t.statusLabels[status]);
    return (
      <span style={{
        fontSize: 10, letterSpacing: "0.12em", fontWeight: 600,
        padding: "4px 8px", borderRadius: 999,
        background: status === "live" ? c.accent : "transparent",
        color: status === "live" ? c.accentInk : c.muted,
        border: status === "live" ? "none" : `1px solid ${c.line}`,
      }}>{label}</span>
    );
  };

  return (
    <div data-screen-label="Navy Minimal" style={{
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, system-ui, sans-serif',
      background: c.bg,
      color: c.ink,
      width: "100%",
      minHeight: "100%",
      fontSize: 15,
      lineHeight: 1.55,
      letterSpacing: "-0.005em",
    }}>
      {/* ───── Navigation ───── */}
      <nav style={{
        display: "flex", alignItems: "center", gap: 32,
        padding: "26px 64px",
        borderBottom: `1px solid ${c.line}`,
        position: "sticky", top: 0, zIndex: 5,
        background: c.bg + "f2",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em",
        }}>
          <span style={{
            width: 26, height: 26, borderRadius: 6,
            background: c.accent, color: c.accentInk,
            display: "grid", placeItems: "center",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
          }}>LF</span>
          <span>Lucas Fanelli</span>
          <span style={{ color: c.muted, fontWeight: 400 }}>/ portfolio</span>
        </div>
        <div style={{ flex: 1 }} />
        <a href="#work" style={navLink(c)}>{t(P.t.nav.work)}</a>
        <a href="#about" style={navLink(c)}>{t(P.t.nav.about)}</a>
        <a href="#contact" style={navLink(c)}>{t(P.t.nav.contact)}</a>
        <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
          {["light", "dark", "navy"].map((th) => (
            <button key={th} onClick={() => setTheme && setTheme(th)} style={{
              width: 22, height: 22, borderRadius: "50%",
              border: theme === th ? `2px solid ${c.accent}` : `1px solid ${c.line}`,
              background: th === "light" ? "#f7f6f3" : th === "dark" ? "#0d1117" : "#1a2c4a",
              cursor: "pointer", padding: 0,
            }} aria-label={`theme ${th}`} />
          ))}
        </div>
        <button onClick={() => setLang && setLang(lang === "es" ? "en" : "es")} style={{
          padding: "6px 12px", borderRadius: 999,
          border: `1px solid ${c.line}`, background: "transparent",
          color: c.ink, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
          cursor: "pointer", fontFamily: "inherit",
        }}>{t(P.t.nav.lang)}</button>
      </nav>

      {/* ───── Hero ───── */}
      <section style={{ padding: "120px 64px 96px", borderBottom: `1px solid ${c.line}` }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 14px", borderRadius: 999,
          border: `1px solid ${c.line}`, background: c.surface,
          fontSize: 12, color: c.muted, marginBottom: 36,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#3aab6d", boxShadow: "0 0 0 4px rgba(58,171,109,0.18)",
          }} />
          {t(P.t.hero.available)} · {t(P.t.hero.based)}
        </div>
        <h1 style={{
          fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.035em",
          fontWeight: 600, margin: "0 0 28px", maxWidth: 1000,
        }}>
          {P.identity.name.split(" ").slice(0, 2).join(" ")}
          <br />
          <span style={{ color: c.muted, fontWeight: 400 }}>
            {P.identity.name.split(" ").slice(2).join(" ")}.
          </span>
        </h1>
        <p style={{
          fontSize: 22, lineHeight: 1.45, maxWidth: 720,
          color: c.ink, fontWeight: 400, margin: "0 0 12px",
        }}>{t(P.t.hero.role)}.</p>
        <p style={{
          fontSize: 14, color: c.muted, marginBottom: 32,
          letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
        }}>{t(P.t.hero.kicker)}</p>
        <p style={{
          fontSize: 17, lineHeight: 1.6, maxWidth: 640,
          color: c.muted, margin: 0,
        }}>{t(P.t.hero.intro)}</p>
      </section>

      {/* ───── Work ───── */}
      <section id="work" style={{ padding: "96px 64px 80px" }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: 56,
        }}>
          <div>
            <div style={sectionKicker(c)}>§ 01 · Work</div>
            <h2 style={sectionH2(c)}>{t(P.t.sections.work)}</h2>
          </div>
          <p style={{ color: c.muted, fontSize: 14, maxWidth: 360, textAlign: "right" }}>
            {t(P.t.sections.workNote)}
          </p>
        </div>

        <div style={{ display: "grid", gap: 40 }}>
          {P.projects.map((proj) => (
            <article key={proj.id} style={{
              background: c.surface,
              border: `1px solid ${c.line}`,
              borderRadius: 16,
              padding: 36,
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 40,
            }}>
              {/* Left: meta */}
              <div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 14, marginBottom: 24,
                }}>
                  <span style={{
                    fontSize: 13, color: c.muted, fontFamily: "ui-monospace, monospace",
                  }}>{proj.n}</span>
                  {statusBadge(proj.status)}
                </div>
                <h3 style={{
                  fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em",
                  margin: "0 0 8px", lineHeight: 1.05,
                }}>{proj.name}</h3>
                <p style={{
                  fontSize: 17, color: c.accent, fontWeight: 500,
                  margin: "0 0 20px",
                }}>{t(proj.tagline)}</p>
                <p style={{
                  fontSize: 15, color: c.muted, lineHeight: 1.6,
                  margin: "0 0 28px", maxWidth: 460,
                }}>{t(proj.summary)}</p>

                <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", margin: 0, fontSize: 13 }}>
                  <dt style={metaDt(c)}>{t(P.t.role)}</dt>
                  <dd style={metaDd(c)}>{t(proj.role)}</dd>
                  <dt style={metaDt(c)}>{t(P.t.stack)}</dt>
                  <dd style={metaDd(c)}>
                    <span style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {proj.stack.map((s) => (
                        <span key={s} style={{
                          background: c.tag, color: c.tagInk,
                          padding: "3px 9px", borderRadius: 4,
                          fontSize: 12, fontWeight: 500,
                        }}>{s}</span>
                      ))}
                    </span>
                  </dd>
                  <dt style={metaDt(c)}>{t(P.t.platform)}</dt>
                  <dd style={metaDd(c)}>
                    {proj.url
                      ? <a href={proj.url} style={{ color: c.accent, textDecoration: "none", borderBottom: `1px solid ${c.accent}` }}>{proj.platform} ↗</a>
                      : proj.platform}
                  </dd>
                </dl>
              </div>

              {/* Right: code snippet */}
              <div style={{
                background: c.code, borderRadius: 10, overflow: "hidden",
                fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
                fontSize: 12.5, lineHeight: 1.6,
                color: c.codeInk,
                border: `1px solid ${c.line}`,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", borderBottom: `1px solid rgba(255,255,255,0.07)`,
                  fontSize: 11, color: "rgba(255,255,255,0.5)",
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                  <span style={{ marginLeft: 10 }}>{proj.id}.{proj.snippet.lang === "csharp" ? "cs" : proj.snippet.lang === "typescript" ? "ts" : "kt"}</span>
                </div>
                <pre style={{ margin: 0, padding: "18px 20px", whiteSpace: "pre", overflow: "hidden" }}>
                  <code>{highlightSimple(proj.snippet.code, proj.snippet.lang, c)}</code>
                </pre>
                <div style={{
                  padding: "12px 20px", borderTop: `1px solid rgba(255,255,255,0.07)`,
                  fontSize: 10.5, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>{t(P.t.arch)}</div>
                <pre style={{
                  margin: 0, padding: "8px 20px 18px",
                  fontSize: 9.5, lineHeight: 1.55,
                  color: "rgba(255,255,255,0.6)", whiteSpace: "pre", overflow: "hidden",
                }}>{proj.diagram}</pre>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───── About ───── */}
      <section id="about" style={{
        padding: "96px 64px 80px",
        borderTop: `1px solid ${c.line}`,
        background: c.surface,
      }}>
        <div style={sectionKicker(c)}>§ 02 · About</div>
        <h2 style={{ ...sectionH2(c), marginBottom: 56 }}>{t(P.t.sections.about)}</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          {/* Education */}
          <div>
            <h4 style={subHeader(c)}>{t(P.t.sections.education)}</h4>
            <div style={{
              padding: "20px 0", borderBottom: `1px solid ${c.line}`,
            }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>
                {t(P.t.education.degreeTitle)}
              </div>
              <div style={{ fontSize: 14, color: c.muted, marginBottom: 14 }}>
                {t(P.t.education.degreeInst)} · {t(P.t.education.degreeDates)}
              </div>
              <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
                <div>
                  <span style={metaDt(c)}>{t(P.t.education.gpa)}</span>{" "}
                  <strong style={{ color: c.accent, fontSize: 17 }}>8,7</strong>
                </div>
                <div>
                  <span style={metaDt(c)}>{t(P.t.education.access)}</span>{" "}
                  <strong style={{ color: c.accent, fontSize: 17 }}>13,400</strong>
                </div>
              </div>
              <div style={{ marginTop: 14, fontSize: 13, color: c.muted }}>
                <span style={metaDt(c)}>{t(P.t.education.honors)}:</span> {t(P.t.education.honorsList)}
              </div>
            </div>
            <div style={{ padding: "20px 0" }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                {t(P.t.education.bachTitle)}
              </div>
              <div style={{ fontSize: 13, color: c.muted }}>
                {t(P.t.education.bachInst)} · {t(P.t.education.bachDates)}
              </div>
            </div>

            <h4 style={{ ...subHeader(c), marginTop: 40 }}>{t(P.t.sections.languages)}</h4>
            {P.t.languages.map((l, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 0", borderTop: i ? `1px solid ${c.line}` : "none",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{t(l.name)}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{t(l.level)}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((b) => (
                    <span key={b} style={{
                      width: 18, height: 4, borderRadius: 1,
                      background: b <= l.bars ? c.accent : c.line,
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div>
            <h4 style={subHeader(c)}>{t(P.t.sections.stack)}</h4>
            <div style={{ display: "grid", gap: 4 }}>
              {P.skills.map((s) => (
                <div key={s.lang} style={{
                  display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  padding: "12px 0", borderBottom: `1px solid ${c.line}`,
                }}>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 500 }}>
                    {s.lang}
                  </span>
                  <span style={{ fontSize: 12, color: c.muted, textAlign: "right" }}>{t(s.note)}</span>
                </div>
              ))}
            </div>

            <h4 style={{ ...subHeader(c), marginTop: 40 }}>{t(P.t.sections.methodology)}</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {t(P.t.methodology).map((m) => (
                <span key={m} style={{
                  background: c.tag, color: c.tagInk,
                  padding: "6px 12px", borderRadius: 6,
                  fontSize: 12, fontWeight: 500,
                }}>{m}</span>
              ))}
            </div>

            <h4 style={{ ...subHeader(c), marginTop: 40 }}>Tools</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 13, color: c.muted }}>
              {P.tools.map((tool, i) => (
                <span key={tool}>{tool}{i < P.tools.length - 1 && <span style={{ marginLeft: 14, opacity: 0.4 }}>·</span>}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Contact ───── */}
      <section id="contact" style={{
        padding: "96px 64px 64px",
      }}>
        <div style={sectionKicker(c)}>§ 03 · Contact</div>
        <h2 style={{ ...sectionH2(c), marginBottom: 16 }}>{t(P.t.sections.contact)}</h2>
        <p style={{ color: c.muted, fontSize: 16, maxWidth: 480, marginBottom: 40 }}>
          {t(P.t.sections.contactNote)}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 64 }}>
          {[
            { label: "Email", value: P.identity.email, href: `mailto:${P.identity.email}` },
            { label: "LinkedIn", value: P.identity.linkedin, href: P.identity.linkedinUrl },
            { label: "GitHub", value: P.identity.github, href: P.identity.githubUrl },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{
              display: "block", padding: 24, borderRadius: 12,
              background: c.surface, border: `1px solid ${c.line}`,
              textDecoration: "none", color: c.ink,
              transition: "transform .15s",
            }}>
              <div style={{ ...metaDt(c), marginBottom: 8 }}>{item.label}</div>
              <div style={{
                fontSize: 14, color: c.ink, fontFamily: "ui-monospace, monospace",
                wordBreak: "break-all",
              }}>{item.value}</div>
            </a>
          ))}
        </div>

        <div style={{
          paddingTop: 28, borderTop: `1px solid ${c.line}`,
          display: "flex", justifyContent: "space-between",
          fontSize: 12, color: c.muted,
        }}>
          <span>© {new Date().getFullYear()} {P.identity.name}</span>
          <span>{P.identity.location}</span>
        </div>
      </section>
    </div>
  );
};

// ───── helper style functions ─────

const navLink = (c) => ({
  color: c.ink, textDecoration: "none", fontSize: 14, fontWeight: 500,
  opacity: 0.8, transition: "opacity .15s",
});
const sectionKicker = (c) => ({
  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
  color: c.accent, fontWeight: 600, marginBottom: 12,
  fontFamily: "ui-monospace, monospace",
});
const sectionH2 = (c) => ({
  fontSize: 44, fontWeight: 600, letterSpacing: "-0.025em",
  margin: 0, lineHeight: 1.05,
});
const subHeader = (c) => ({
  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
  color: c.muted, fontWeight: 600, margin: "0 0 20px",
});
const metaDt = (c) => ({
  fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
  color: c.muted, fontWeight: 600,
});
const metaDd = (c) => ({
  margin: 0, fontSize: 14, color: c.ink,
});

// Very simple syntax tinting — colors a handful of language keywords/strings.
// Not a real lexer; just enough to make snippets feel alive.
function highlightSimple(code, lang, c) {
  const keywords = {
    csharp: /\b(public|sealed|class|static|readonly|new|void|return|using|namespace|where|var|null|true|false|if|else|out|async|await|Action|Type|Delegate|Dictionary)\b/g,
    typescript: /\b(export|async|function|const|let|var|await|return|if|else|throw|new|import|from|interface|type|class|extends|implements|public|private|null|undefined|true|false)\b/g,
    kotlin: /\b(class|fun|val|var|private|public|suspend|operator|return|if|else|null|true|false|object|companion|override|by|in|when|sealed)\b/g,
  };
  const kw = keywords[lang] || /(?!)/g;
  const accent = c.accent;
  // First, split into tokens preserving order.
  const out = [];
  let lastIdx = 0;
  const matches = [];
  // strings
  for (const m of code.matchAll(/"([^"\\]|\\.)*"/g)) {
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "string" });
  }
  // comments (// to EOL)
  for (const m of code.matchAll(/\/\/[^\n]*/g)) {
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "comment" });
  }
  // keywords
  for (const m of code.matchAll(kw)) {
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "kw" });
  }
  matches.sort((a, b) => a.start - b.start);
  // Drop overlaps (favor earlier match).
  const filtered = [];
  let cur = -1;
  for (const m of matches) {
    if (m.start >= cur) { filtered.push(m); cur = m.end; }
  }
  for (const m of filtered) {
    if (m.start > lastIdx) out.push(code.slice(lastIdx, m.start));
    const style = m.type === "string"
      ? { color: "#a8d99a" }
      : m.type === "comment"
        ? { color: "rgba(255,255,255,0.4)", fontStyle: "italic" }
        : { color: accent, fontWeight: 500 };
    out.push(<span key={m.start} style={style}>{m.text}</span>);
    lastIdx = m.end;
  }
  if (lastIdx < code.length) out.push(code.slice(lastIdx));
  return out;
}

window.PortfolioNavy = PortfolioNavy;
