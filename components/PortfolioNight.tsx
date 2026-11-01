"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  academics,
  identity,
  pick,
  skills,
  strings,
  tools,
  type Lang,
  type Theme,
} from "@/lib/content";
import NightHouse from "./NightHouse";
import { type Translate } from "./NightProject";
import s from "./PortfolioNight.module.css";

type Props = {
  theme: Theme;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
};

type Tone = "dark" | "light";

export default function PortfolioNight({ lang, setLang }: Props) {
  const t: Translate = (value) => pick(value, lang);
  const rootRef = useRef<HTMLDivElement>(null);
  const [hour, setHour] = useState("20:00");
  const [tone, setTone] = useState<Tone>("dark");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.motion = "on";
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => reveal.observe(el));

    // The nav clock follows whichever scene crosses the middle of the viewport.
    const clock = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          setHour(el.dataset.hour ?? "20:00");
          setTone(el.dataset.tone === "light" ? "light" : "dark");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    root.querySelectorAll<HTMLElement>("[data-hour]").forEach((el) => clock.observe(el));

    return () => {
      reveal.disconnect();
      clock.disconnect();
    };
  }, []);

  const [firstName, ...rest] = identity.name.split(" ");
  const givenNames = [firstName, rest[0]].join(" ");
  const surnames = rest.slice(1).join(" ");

  const intro = (
    <header id="top" className={s.hero}>
      <div className={s.heroInner}>
        <div className={`${s.portraits} ${s.enter}`}>
          <Image
            className={s.portrait}
            src="/night/lucas.webp"
            alt={identity.name}
            width={640}
            height={800}
            sizes="(min-width: 1024px) 150px, 96px"
            priority
          />
          <Image
            className={s.portrait}
            src="/night/lucas-2.webp"
            alt={identity.name}
            width={301}
            height={376}
            sizes="(min-width: 1024px) 150px, 96px"
            priority
          />
        </div>
        <p className={`${s.hour} ${s.enter}`} style={{ animationDelay: "0.05s" }}>
          20:00 — {t(strings.night.hours.dusk)}
        </p>
        <div className={`${s.available} ${s.enter}`} style={{ animationDelay: "0.1s" }}>
          {t(strings.hero.available)} · {t(strings.hero.based)}
        </div>
        <h1 className={`${s.name} ${s.enter}`} style={{ animationDelay: "0.2s" }}>
          {givenNames}{" "}
          <em>{surnames}.</em>
        </h1>
        <p className={`${s.role} ${s.enter}`} style={{ animationDelay: "0.35s" }}>
          {t(strings.hero.role)}.
        </p>
        <p className={`${s.kicker} ${s.enter}`} style={{ animationDelay: "0.42s" }}>
          {t(strings.hero.kicker)}
        </p>
        <p className={`${s.intro} ${s.enter}`} style={{ animationDelay: "0.5s" }}>
          {t(strings.hero.intro)}
        </p>
      </div>
      <div className={`${s.cue} ${s.enter}`} style={{ animationDelay: "0.9s" }} aria-hidden="true">
        <p className={s.cueLine}>{t(strings.night.kicker)}</p>
        <p className={s.cueHint}>{t(strings.night.scrollCue)}</p>
      </div>
    </header>
  );

  const workIntro = (
    <div className={s.workIntro}>
      <h2 className={s.sectionLabel} data-reveal="">
        {t(strings.sections.work)}
      </h2>
      <p className={s.statement} data-reveal="">
        {t(strings.sections.workNote)}
      </p>
    </div>
  );

  // 06:00: the About heading closes the night in the same bedroom, over the dawn time-lapse; the
  // section it titles (below) continues in the cream the picture melts into.
  const dawnIntro = (
    <div id="about" className={s.dawnIntro}>
      <p className={s.hour} data-reveal="">
        06:00 — {t(strings.night.hours.dawn)}
      </p>
      <h2 id="about-title" className={s.dawnTitle} data-reveal="">
        {t(strings.sections.about)}
      </h2>
    </div>
  );

  return (
    <div ref={rootRef} className={s.root} data-screen-label="One Night">
      <div className={s.grain} aria-hidden="true" />

      <nav className={s.nav} data-tone={tone} aria-label="Primary">
        <a href="#top" className={s.brand}>
          Lucas Fanelli
        </a>
        <span className={s.clock} aria-live="polite" aria-atomic="true">
          <span key={hour} className={s.clockDigits}>
            {hour}
          </span>
        </span>
        <span className={s.spacer} />
        <div className={s.navLinks}>
          <a href="#work">{t(strings.nav.work)}</a>
          <a href="#about">{t(strings.nav.about)}</a>
          <a href="#contact">{t(strings.nav.contact)}</a>
        </div>
        <button
          type="button"
          className={s.lang}
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
        >
          {t(strings.nav.lang)}
        </button>
      </nav>

      <main>
        <NightHouse t={t} intro={intro} workIntro={workIntro} dawn={dawnIntro} />

        {/* 06:00 — dawn: titled by the heading that closes the house above */}
        <section className={s.dawn} aria-labelledby="about-title" data-hour="06:00" data-tone="light">
          <div className={s.about}>
            <div>
              <div className={s.block} data-reveal="">
                <h3 className={s.listLabel}>{t(strings.sections.education)}</h3>
                <p className={s.degree}>{t(strings.education.degreeTitle)}</p>
                <p className={s.degreeMeta}>
                  {t(strings.education.degreeInst)} · {t(strings.education.degreeDates)}
                </p>
                <div className={s.figures}>
                  <div className={s.figure}>
                    <span className={s.figureValue}>{academics.gpa}</span>
                    <span className={s.listLabel}>{t(strings.education.gpa)}</span>
                  </div>
                  <div className={s.figure}>
                    <span className={s.figureValue}>{academics.access}</span>
                    <span className={s.listLabel}>{t(strings.education.access)}</span>
                  </div>
                </div>
                <p className={s.small}>
                  {t(strings.education.honors)}: {t(strings.education.honorsList)}
                </p>
                <p className={s.small} style={{ marginTop: 18 }}>
                  {t(strings.education.bachTitle)} · {t(strings.education.bachInst)} ·{" "}
                  {t(strings.education.bachDates)}
                </p>
              </div>

              <div className={s.block} data-reveal="">
                <h3 className={s.listLabel}>{t(strings.sections.languages)}</h3>
                <ul className={s.rows}>
                  {strings.languages.map((l) => (
                    <li key={l.name.en}>
                      <span>
                        <span style={{ display: "block", fontSize: 15 }}>{t(l.name)}</span>
                        <span className={s.rowNote} style={{ textAlign: "left" }}>
                          {t(l.level)}
                        </span>
                      </span>
                      <span className={s.dots} role="img" aria-label={`${l.bars} / 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={s.dot} data-on={i < l.bars} />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className={s.block} data-reveal="">
                <h3 className={s.listLabel}>{t(strings.sections.stack)}</h3>
                <ul className={s.rows}>
                  {skills.map((sk) => (
                    <li key={sk.lang}>
                      <span className={s.rowName}>{sk.lang}</span>
                      <span className={s.rowNote}>{t(sk.note)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={s.block} data-reveal="">
                <h3 className={s.listLabel}>{t(strings.sections.methodology)}</h3>
                <div className={s.chips} style={{ marginTop: 14 }}>
                  {t(strings.methodology).map((m) => (
                    <span key={m} className={s.chip}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className={s.block} data-reveal="">
                <h3 className={s.listLabel}>{t(strings.sections.tools)}</h3>
                <p className={s.small} style={{ marginTop: 14 }}>
                  {tools.join(" · ")}
                </p>
              </div>
            </div>
          </div>

          <div id="contact" className={s.contact}>
            <h2 className={s.sectionLabel} data-reveal="">
              {t(strings.sections.contact)}
            </h2>
            <p className={s.contactNote} data-reveal="">
              {t(strings.sections.contactNote)}
            </p>
            <a className={s.email} href={`mailto:${identity.email}`} data-reveal="">
              {identity.email}
            </a>
            <ul className={s.socials} data-reveal="">
              <li>
                <a href={identity.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href={identity.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              </li>
            </ul>

            <footer className={s.footer}>
              <span>
                © {new Date().getFullYear()} {identity.name}
              </span>
              <span>{identity.location}</span>
              <p className={s.credit}>{t(strings.night.plateCredit)}</p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
