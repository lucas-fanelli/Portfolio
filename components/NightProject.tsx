"use client";

import React, { useState } from "react";
import { diagramColumns, strings, type Localized, type Project } from "@/lib/content";
import s from "./PortfolioNight.module.css";

export type Translate = <T>(value: Localized<T> | T) => T;

/**
 * Renders code one line per block so long lines wrap with a hanging indent that keeps the
 * code's own indentation, instead of forcing a horizontal scrollbar.
 */
function CodeLines({ code }: { code: string }) {
  return (
    <>
      {code.split("\n").map((line, i) => {
        const indent = line.length - line.trimStart().length;
        return (
          <span key={i} className={s.codeLine} style={{ "--indent": indent } as React.CSSProperties}>
            {line.trimStart() || " "}
          </span>
        );
      })}
    </>
  );
}

/** Status badge plus the live link (or platform name) shown under a project title. */
export function ProjectMeta({ proj, t }: { proj: Project; t: Translate }) {
  return (
    <div className={s.headMeta} data-reveal="">
      <span className={s.status} data-live={proj.status === "live"}>
        {t(strings.statusLabels[proj.status])}
      </span>
      {proj.url ? (
        <a className={s.visit} href={proj.url} target="_blank" rel="noopener noreferrer">
          <span className={s.visitVerb}>{t(strings.visit)}</span>
          {proj.platform} ↗
        </a>
      ) : (
        <span className={s.platform}>{proj.platform}</span>
      )}
    </div>
  );
}

/**
 * Summary, role/stack, principles and the architecture card with the real snippet, for the
 * floating cards beside the house scene. On phones everything after the summary folds behind
 * a toggle so the card doesn't cover the scene the whole time it is on screen.
 */
export function ProjectDetails({ proj, t }: { proj: Project; t: Translate }) {
  const [open, setOpen] = useState(false);
  const moreId = `${proj.id}-details`;

  return (
    <div className={s.cardBody}>
      <p className={s.summary} data-reveal="">
        {t(proj.summary)}
      </p>
      <button
        type="button"
        className={s.more}
        aria-expanded={open}
        aria-controls={moreId}
        onClick={() => setOpen((v) => !v)}
      >
        {t(open ? strings.night.less : strings.night.more)}
      </button>
      <div id={moreId} className={s.moreBody} data-open={open}>
        <dl className={s.meta} data-reveal="">
          <dt>{t(strings.role)}</dt>
          <dd>{t(proj.role)}</dd>
          <dt>{t(strings.stack)}</dt>
          <dd>
            <span className={s.chips}>
              {proj.stack.map((item) => (
                <span key={item} className={s.chip}>
                  {item}
                </span>
              ))}
            </span>
          </dd>
        </dl>
        <div className={s.lists} data-reveal="">
          <div>
            <h4 className={s.listLabel}>{t(strings.sections.philosophy)}</h4>
            <ul className={s.list}>
              {t(proj.philosophy).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={s.listLabel}>{t(strings.sections.quality)}</h4>
            <ul className={s.list}>
              {t(proj.quality).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={s.terminal} data-reveal="">
          <div className={s.terminalBar}>
            {proj.id}.arch · {t(strings.arch)}
          </div>
          <pre
            className={s.diagram}
            style={{ "--cols": diagramColumns(proj.diagram) } as React.CSSProperties}
          >
            {proj.diagram}
          </pre>
          <details className={s.code}>
            <summary>
              {t(strings.night.code)} · {proj.snippet.lang}
            </summary>
            <pre className={s.snippet}>
              <code>
                <CodeLines code={proj.snippet.code} />
              </code>
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
