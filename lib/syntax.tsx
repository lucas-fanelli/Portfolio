import React from "react";

export type SnippetLang = "csharp" | "typescript" | "kotlin";

const KEYWORDS: Record<SnippetLang, RegExp> = {
  csharp: /\b(public|sealed|class|static|readonly|new|void|return|using|namespace|where|var|null|true|false|if|else|out|async|await|Action|Type|Delegate|Dictionary)\b/g,
  typescript: /\b(export|async|function|const|let|var|await|return|if|else|throw|new|import|from|interface|type|class|extends|implements|public|private|null|undefined|true|false|notFound)\b/g,
  kotlin: /\b(class|fun|val|var|private|public|suspend|operator|return|if|else|null|true|false|object|companion|override|by|in|when|sealed|Duration|firstOrNull)\b/g,
};

export type TintStyles = {
  string: React.CSSProperties;
  comment: React.CSSProperties;
  keyword: React.CSSProperties;
};

type Match = { start: number; end: number; text: string; type: "string" | "comment" | "kw" };

export function tintCode(code: string, lang: SnippetLang, styles: TintStyles): React.ReactNode[] {
  const kw = KEYWORDS[lang];
  const matches: Match[] = [];

  for (const m of code.matchAll(/"([^"\\]|\\.)*"/g)) {
    if (m.index === undefined) continue;
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "string" });
  }
  for (const m of code.matchAll(/\/\/[^\n]*/g)) {
    if (m.index === undefined) continue;
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "comment" });
  }
  for (const m of code.matchAll(kw)) {
    if (m.index === undefined) continue;
    matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "kw" });
  }

  matches.sort((a, b) => a.start - b.start);

  const filtered: Match[] = [];
  let cur = -1;
  for (const m of matches) {
    if (m.start >= cur) {
      filtered.push(m);
      cur = m.end;
    }
  }

  const out: React.ReactNode[] = [];
  let lastIdx = 0;
  for (const m of filtered) {
    if (m.start > lastIdx) out.push(code.slice(lastIdx, m.start));
    const style =
      m.type === "string" ? styles.string : m.type === "comment" ? styles.comment : styles.keyword;
    out.push(
      <span key={m.start} style={style}>
        {m.text}
      </span>,
    );
    lastIdx = m.end;
  }
  if (lastIdx < code.length) out.push(code.slice(lastIdx));
  return out;
}

export function snippetExt(lang: SnippetLang): string {
  return lang === "csharp" ? "cs" : lang === "typescript" ? "ts" : "kt";
}
