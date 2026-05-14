// PortfolioTerminal — Direction 2
// Developer terminal aesthetic. Monospace throughout, ASCII chrome,
// commands as section headers, ANSI-style accents. Themes shift palette
// (dark = classic green-on-black, light = cream paper, navy = blue
// retro-terminal) but the structure stays the same.

const PortfolioTerminal = ({ theme = "dark", lang = "en", setTheme, setLang }) => {
  const P = window.PORTFOLIO;
  const t = (v) => P.pick(v, lang);

  const palettes = {
    dark: {
      bg: "#0b0e0a",
      panel: "#0f1410",
      ink: "#cfe9c4",
      muted: "#5d7c54",
      dim: "#3a4d36",
      accent: "#7cf28a",      // bright green
      accent2: "#f0c14b",     // amber
      accent3: "#7ad9ff",     // cyan
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
  const c = palettes[theme] || palettes.dark;

  // Reusable prompt fragment
  const Prompt = ({ cmd, host = "uma", user = "lucas" }) => (
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

  const Comment = ({ children }) => (
    <span style={{ color: c.dim }}>{children}</span>
  );

  const statusColor = (s) => s === "live" ? c.accent : s === "active" ? c.accent2 : c.accent3;

  // ASCII title for hero
  const headerAscii = String.raw`
   __                            ____                  _ _ _
  / /  _   _  ___ __ _ ___      / ___|__ _ _ __   ___ | | (_)
 / /  | | | |/ __/ _\` / __|    | |__ / _\` | '_ \ / _ \| | | |
/ /___| |_| | (_| (_| \__ \    |  __/ (_| | | | |  __/| | | |
\____/ \__,_|\___\__,_|___/    |_|   \__,_|_| |_|\___||_|_|_|`;

  return (
    <div data-screen-label="Terminal Dev" style={{
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", ui-monospace, "Courier New", monospace',
      background: c.bg,
      color: c.ink,
      width: "100%", minHeight: "100%",
      fontSize: 14, lineHeight: 1.6,
    }}>
      {/* ───── Window chrome / tab bar (terminal frame) ───── */}
      <div style={{
        background: c.panel, borderBottom: `1px solid ${c.line}`,
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 5,
      }}>
        <div style={{ display: "flex", gap: 7 }}>
          <span style={dot("#ff5f57")} />
          <span style={dot("#febc2e")} />
          <span style={dot("#28c840")} />
        </div>
        <div style={{
          flex: 1, textAlign: "center", color: c.muted, fontSize: 12,
        }}>
          lucas@uma — ~/portfolio — 132×40
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["dark", "light", "navy"].map((th) => (
            <button key={th} onClick={() => setTheme && setTheme(th)} style={{
              padding: "3px 9px", fontSize: 11,
              background: theme === th ? c.accent : "transparent",
              color: theme === th ? c.bg : c.muted,
              border: `1px solid ${theme === th ? c.accent : c.line}`,
              borderRadius: 3, cursor: "pointer", fontFamily: "inherit",
              textTransform: "lowercase",
            }}>{th}</button>
          ))}
          <button onClick={() => setLang && setLang(lang === "es" ? "en" : "es")} style={{
            padding: "3px 9px", fontSize: 11,
            background: "transparent", color: c.accent3,
            border: `1px solid ${c.line}`,
            borderRadius: 3, cursor: "pointer", fontFamily: "inherit",
          }}>--lang={lang}</button>
        </div>
      </div>

      <div style={{ padding: "32px 40px 64px" }}>
        {/* ───── Boot / banner ───── */}
        <pre style={{
          margin: 0, color: c.accent, fontSize: 11, lineHeight: 1.2,
          whiteSpace: "pre", overflow: "hidden",
        }}>{headerAscii}</pre>

        <div style={{ marginTop: 12, color: c.muted, fontSize: 12 }}>
          v2.6 · {P.identity.location} · {t(P.t.hero.kicker)}
        </div>

        <hr style={hr(c)} />

        {/* ───── whoami ───── */}
        <Prompt cmd="whoami" />
        <pre style={{ margin: "0 0 6px", color: c.ink, fontSize: 13 }}>
{`${P.identity.name}
${t(P.t.hero.role)}`}
        </pre>
        <Prompt cmd="cat intro.md" />
        <p style={{
          color: c.ink, maxWidth: 760, margin: "0 0 8px",
          padding: "12px 18px", background: c.panel,
          borderLeft: `2px solid ${c.accent}`,
          lineHeight: 1.65,
        }}>{t(P.t.hero.intro)}</p>
        <div style={{ fontSize: 12, color: c.muted, marginBottom: 8 }}>
          <span style={{ color: c.accent }}>●</span> {t(P.t.hero.available)}
          {"   "}
          <Comment>// {t(P.t.hero.based)}</Comment>
        </div>

        <hr style={hr(c)} />

        {/* ───── ls projects/ ───── */}
        <Prompt cmd="ls -la ~/projects" />
        <pre style={{
          margin: "0 0 18px", fontSize: 12, color: c.muted, lineHeight: 1.6,
        }}>
{`total ${P.projects.length}
drwxr-xr-x  ${P.projects.length} lucas  staff   ${P.projects.length * 256}  ${new Date().toLocaleDateString("en", { month: "short", day: "2-digit" })}
${P.projects.map(p => {
  const c1 = p.status === "live" ? "x" : "-";
  return `drwxr-x${c1}--x  -  lucas  staff   ${p.name.padEnd(14)} [${t(P.t.statusLabels[p.status]).padEnd(14)}]`;
}).join("\n")}`}
        </pre>

        {/* ───── Each project ───── */}
        {P.projects.map((proj, idx) => (
          <div key={proj.id} style={{
            marginBottom: 36,
            border: `1px solid ${c.line}`,
            borderRadius: 4,
            background: c.panel,
          }}>
            {/* project header bar */}
            <div style={{
              padding: "10px 16px", borderBottom: `1px solid ${c.line}`,
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(0,0,0,0.18)",
            }}>
              <span style={{ color: c.muted, fontSize: 12 }}>[{proj.n}]</span>
              <span style={{ color: statusColor(proj.status), fontSize: 11, fontWeight: 700 }}>
                ●{" "}{t(P.t.statusLabels[proj.status])}
              </span>
              <span style={{ color: c.ink, fontWeight: 700, fontSize: 15 }}>{proj.name}</span>
              <span style={{ color: c.muted, fontSize: 12 }}>— {t(proj.tagline)}</span>
              <span style={{ flex: 1 }} />
              {proj.url && (
                <a href={proj.url} style={{
                  color: c.accent3, textDecoration: "none", fontSize: 12,
                }}>↗ {proj.platform}</a>
              )}
            </div>

            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 28 }}>
                <div>
                  <Prompt cmd={`cat projects/${proj.id}/README.md`} />
                  <p style={{ color: c.ink, margin: "0 0 18px", lineHeight: 1.65, fontSize: 13.5 }}>
                    {t(proj.summary)}
                  </p>

                  <div style={{ fontSize: 12.5, color: c.muted, lineHeight: 1.9 }}>
                    <div><span style={{ color: c.accent2 }}>role     </span><span style={{ color: c.muted }}>:: </span><span style={{ color: c.ink }}>{t(proj.role)}</span></div>
                    <div><span style={{ color: c.accent2 }}>stack    </span><span style={{ color: c.muted }}>:: </span><span style={{ color: c.ink }}>[{proj.stack.join(", ")}]</span></div>
                    <div><span style={{ color: c.accent2 }}>platform </span><span style={{ color: c.muted }}>:: </span><span style={{ color: c.ink }}>{proj.platform}</span></div>
                  </div>

                  <Prompt cmd={`head ${proj.id}.${proj.snippet.lang === "csharp" ? "cs" : proj.snippet.lang === "typescript" ? "ts" : "kt"}`} />
                  <pre style={{
                    margin: 0, padding: "12px 14px",
                    background: "rgba(0,0,0,0.35)",
                    borderRadius: 3, border: `1px solid ${c.line}`,
                    color: c.ink, fontSize: 12, lineHeight: 1.55,
                    whiteSpace: "pre", overflow: "hidden",
                  }}>{tinted(proj.snippet.code, proj.snippet.lang, c)}</pre>
                </div>

                <div>
                  <Prompt cmd={`./diagram ${proj.id}.arch`} />
                  <pre style={{
                    margin: 0, padding: "16px 18px",
                    background: c.bg, borderRadius: 3,
                    border: `1px solid ${c.line}`,
                    color: c.accent3, fontSize: 10.5, lineHeight: 1.55,
                    whiteSpace: "pre", overflow: "hidden",
                  }}>{proj.diagram}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}

        <hr style={hr(c)} />

        {/* ───── about / education ───── */}
        <Prompt cmd="cat ~/about.yml" />
        <pre style={{
          margin: "0 0 28px", padding: "16px 20px",
          background: c.panel, borderLeft: `2px solid ${c.accent2}`,
          fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
        }}>
<span style={{ color: c.accent2 }}>name</span>{": "}<span style={{ color: c.ink }}>{P.identity.name}</span>{"\n"}
<span style={{ color: c.accent2 }}>location</span>{": "}<span style={{ color: c.ink }}>{P.identity.location}</span>{"\n"}
<span style={{ color: c.accent2 }}>education</span>{":\n"}
{"  - "}<span style={{ color: c.accent }}>degree</span>{": "}<span style={{ color: c.ink }}>{t(P.t.education.degreeTitle)}</span>{"\n"}
{"    "}<span style={{ color: c.accent }}>at</span>{":     "}<span style={{ color: c.ink }}>{t(P.t.education.degreeInst)}</span>{"\n"}
{"    "}<span style={{ color: c.accent }}>period</span>{": "}<span style={{ color: c.ink }}>{t(P.t.education.degreeDates)}</span>{"\n"}
{"    "}<span style={{ color: c.accent }}>gpa</span>{":    "}<span style={{ color: c.accent3 }}>8.7 / 10</span>{"\n"}
{"    "}<span style={{ color: c.accent }}>honors</span>{": ["}<span style={{ color: c.accent3 }}>{t(P.t.education.honorsList).split(" · ").map(h => `"${h}"`).join(", ")}</span>{"]\n"}
{"  - "}<span style={{ color: c.accent }}>degree</span>{": "}<span style={{ color: c.ink }}>{t(P.t.education.bachTitle)}</span>{"\n"}
{"    "}<span style={{ color: c.accent }}>at</span>{":     "}<span style={{ color: c.ink }}>{t(P.t.education.bachInst)}</span>{"\n"}
{"    "}<span style={{ color: c.accent }}>period</span>{": "}<span style={{ color: c.ink }}>{t(P.t.education.bachDates)}</span>
        </pre>

        {/* ───── skills ───── */}
        <Prompt cmd="skills --top" />
        <div style={{
          background: c.panel, padding: "18px 20px", marginBottom: 28,
          border: `1px solid ${c.line}`, borderRadius: 3,
        }}>
          {P.skills.map((s) => (
            <div key={s.lang} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, padding: "4px 0" }}>
              <span style={{ width: 90, color: c.accent, fontWeight: 700 }}>{s.lang}</span>
              <span style={{ color: c.muted, fontSize: 12, flex: 1 }}>{t(s.note)}</span>
            </div>
          ))}
        </div>

        <Prompt cmd="methodology --list" />
        <div style={{ marginBottom: 28, fontSize: 12.5 }}>
          {t(P.t.methodology).map((m, i) => (
            <span key={m} style={{
              display: "inline-block", marginRight: 6, marginBottom: 6,
              padding: "3px 9px",
              border: `1px solid ${c.line}`, color: c.ink,
              borderRadius: 3,
            }}>{m}</span>
          ))}
        </div>

        <Prompt cmd="locale -a" />
        <div style={{ marginBottom: 28, fontSize: 13, lineHeight: 1.85 }}>
          {P.t.languages.map((l, i) => (
            <div key={i}>
              <span style={{ color: c.accent }}>{t(l.name).toLowerCase()}_{i === 0 ? "AR" : "GB"}.UTF-8</span>
              <span style={{ color: c.muted }}>{"  "}—{"  "}</span>
              <span style={{ color: c.ink }}>{t(l.level)}</span>
            </div>
          ))}
        </div>

        <hr style={hr(c)} />

        {/* ───── contact ───── */}
        <Prompt cmd="contact --resolve" />
        <pre style={{
          margin: 0, fontSize: 13, lineHeight: 1.9, color: c.ink,
          padding: "16px 20px", background: c.panel,
          borderLeft: `2px solid ${c.accent3}`,
        }}>
<span style={{ color: c.accent3 }}>email   </span>{" → "}<a href={`mailto:${P.identity.email}`} style={{ color: c.accent, textDecoration: "none" }}>{P.identity.email}</a>{"\n"}
<span style={{ color: c.accent3 }}>linkedin</span>{" → "}<a href={P.identity.linkedinUrl} style={{ color: c.accent, textDecoration: "none" }}>{P.identity.linkedin}</a>{"\n"}
<span style={{ color: c.accent3 }}>github  </span>{" → "}<a href={P.identity.githubUrl} style={{ color: c.accent, textDecoration: "none" }}>{P.identity.github}</a>
        </pre>

        <div style={{
          marginTop: 32, fontSize: 11, color: c.muted,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            display: "inline-block", width: 8, height: 14,
            background: c.accent, animation: "blink 1s steps(2) infinite",
            verticalAlign: "middle",
          }} />
          <span>{P.identity.name} · © {new Date().getFullYear()} · session active</span>
        </div>
      </div>

      <style>{`@keyframes blink{50%{opacity:0}}`}</style>
    </div>
  );
};

const dot = (color) => ({
  width: 12, height: 12, borderRadius: "50%", background: color, display: "inline-block",
});

const hr = (c) => ({
  border: "none", borderTop: `1px dashed ${c.line}`,
  margin: "30px 0",
});

// Same tinting helper as Direction 1, with terminal palette
function tinted(code, lang, c) {
  const keywords = {
    csharp: /\b(public|sealed|class|static|readonly|new|void|return|using|namespace|where|var|null|true|false|if|else|out|async|await|Action|Type|Delegate|Dictionary)\b/g,
    typescript: /\b(export|async|function|const|let|var|await|return|if|else|throw|new|import|from|interface|type|class|extends|implements|public|private|null|undefined|true|false|notFound)\b/g,
    kotlin: /\b(class|fun|val|var|private|public|suspend|operator|return|if|else|null|true|false|object|companion|override|by|in|when|sealed|Duration|firstOrNull)\b/g,
  };
  const kw = keywords[lang] || /(?!)/g;
  const matches = [];
  for (const m of code.matchAll(/"([^"\\]|\\.)*"/g))
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "string" });
  for (const m of code.matchAll(/\/\/[^\n]*/g))
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "comment" });
  for (const m of code.matchAll(kw))
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "kw" });
  matches.sort((a, b) => a.start - b.start);
  const filtered = []; let cur = -1;
  for (const m of matches) { if (m.start >= cur) { filtered.push(m); cur = m.end; } }
  const out = []; let lastIdx = 0;
  for (const m of filtered) {
    if (m.start > lastIdx) out.push(code.slice(lastIdx, m.start));
    const style = m.type === "string"
      ? { color: c.accent2 }
      : m.type === "comment"
        ? { color: c.dim, fontStyle: "italic" }
        : { color: c.accent, fontWeight: 600 };
    out.push(<span key={m.start} style={style}>{m.text}</span>);
    lastIdx = m.end;
  }
  if (lastIdx < code.length) out.push(code.slice(lastIdx));
  return out;
}

window.PortfolioTerminal = PortfolioTerminal;
