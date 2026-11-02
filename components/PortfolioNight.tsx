"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  academics,
  cvFiles,
  identity,
  pick,
  skills,
  strings,
  tools,
  type Lang,
  type Theme,
} from "@/lib/content";
import NightHouse, { HOUSE_CHAPTERS } from "./NightHouse";
import { ProjectMeta, type Translate } from "./NightProject";
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
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [hour, setHour] = useState("20:00");
  const [tone, setTone] = useState<Tone>("dark");
  const [chapter, setChapter] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");

  // The phone menu closes on Escape (focus back on its button) and on a tap outside the nav.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen]);

  // The phone's browser bar takes the scene's colour: night, then the cream of dawn. The layout's
  // theme colours belong to the default design, so they're put back when this one unmounts.
  useEffect(() => {
    const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
    const before = metas.map((m) => m.content);
    for (const m of metas) m.content = tone === "light" ? "#f2ebe1" : "#0b0c0e";
    return () => metas.forEach((m, i) => (m.content = before[i]));
  }, [tone]);

  useEffect(() => {
    if (copy === "idle") return;
    const id = window.setTimeout(() => setCopy("idle"), copy === "done" ? 2500 : 6000);
    return () => window.clearTimeout(id);
  }, [copy]);

  // mailto: does nothing on a computer without a mail app, so the address can be copied too.
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopy("done");
    } catch {
      // No clipboard access (insecure context, permission denied): say so, so the visitor copies it by hand.
      setCopy("failed");
    }
  };

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

    // The nav clock (and the chapter menu) follow whichever scene crosses the middle of the viewport.
    const clock = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          setHour(el.dataset.hour ?? "20:00");
          setTone(el.dataset.tone === "light" ? "light" : "dark");
          if (el.dataset.chapter) setChapter(el.dataset.chapter);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    root.querySelectorAll<HTMLElement>("[data-hour]").forEach((el) => clock.observe(el));

    // How far down the page the visitor is: a thin line along the bottom of the nav.
    let raf = 0;
    const progress = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${p.toFixed(4)})`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(progress);
    };
    progress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      reveal.disconnect();
      clock.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The phone menu lists the night hour by hour; the scene on screen is marked, and the ones
  // already seen are filled in up to it.
  const chapters = [
    { id: "top", hour: "20:00", name: t(strings.night.start) },
    ...HOUSE_CHAPTERS.map(({ project, hour }) => ({ id: project.id, hour, name: project.name })),
    { id: "about", hour: "06:00", name: t(strings.nav.about) },
  ];
  const current = Math.max(0, chapters.findIndex((c) => c.id === chapter));
  const closeMenu = () => setMenuOpen(false);
  const cv = t(cvFiles);

  const [firstName, ...rest] = identity.name.split(" ");
  const givenNames = [firstName, rest[0]].join(" ");
  const surnames = rest.slice(1).join(" ");

  const intro = (
    <header id="top" className={s.hero}>
      {/* The design switcher fades out while it would sit on top of this text. */}
      <div className={s.heroInner} data-switcher-avoid="">
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
          {/* Same person as the first portrait, which already carries the name. */}
          <Image
            className={s.portrait}
            src="/night/lucas-2.webp"
            alt=""
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
        <div className={`${s.actions} ${s.enter}`} style={{ animationDelay: "0.6s" }}>
          <a className={s.actionMain} href="#work">
            {t(strings.hero.seeWork)}
          </a>
          <a href={cv} download>
            {t(strings.hero.cv)}
            <span className={s.actionNote}>PDF</span>
          </a>
          <a href={`mailto:${identity.email}`}>{t(strings.hero.email)}</a>
        </div>
        <p className={`${s.skipHint} ${s.enter}`} style={{ animationDelay: "0.66s" }}>
          {t(strings.hero.skipHint)} <a href="#projects">{t(strings.hero.skip)} →</a>
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
      {/* Keyboard users land here first: straight to the project list, past the whole house. */}
      <a className={s.skipLink} href="#projects">
        {t(strings.hero.skip)}
      </a>
      <div className={s.grain} aria-hidden="true" />

      <nav ref={navRef} className={s.nav} data-tone={tone} aria-label="Primary">
        <span ref={progressRef} className={s.progress} aria-hidden="true" />
        <a href="#top" className={s.brand}>
          Lucas Fanelli
        </a>
        {/* Decorative: every scene states its hour in its own heading, and announcing each change
            while scrolling would only be noise for screen readers. */}
        <span className={s.clock} aria-hidden="true">
          <span key={hour} className={s.clockDigits}>
            {hour}
          </span>
        </span>
        <span className={s.spacer} />
        <div className={s.navLinks}>
          <a href="#work">{t(strings.nav.work)}</a>
          <a href="#about">{t(strings.nav.about)}</a>
          <a href="#contact">{t(strings.nav.contact)}</a>
          {/* Always in reach: on most laptops the hero's own CV button sits just below the first screen. */}
          <a href={cv} download>
            CV ↓
          </a>
        </div>
        {/* Phones: the links fold behind this button; without it, Contact is twenty screens away. */}
        <button
          ref={menuButtonRef}
          type="button"
          className={s.menuButton}
          aria-expanded={menuOpen}
          aria-controls="night-menu"
          aria-label={t(strings.nav.menu)}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={s.menuIcon} aria-hidden="true" />
        </button>
        <div id="night-menu" className={s.menu} hidden={!menuOpen}>
          <p id="night-menu-label" className={s.menuLabel}>
            {t(strings.night.chapters)}
          </p>
          <ol
            className={s.chapters}
            aria-labelledby="night-menu-label"
            style={{ "--done": current / (chapters.length - 1) } as React.CSSProperties}
          >
            {chapters.map((c, i) => (
              <li key={c.id} data-state={i < current ? "done" : i === current ? "now" : "next"}>
                <a href={`#${c.id}`} aria-current={i === current ? "location" : undefined} onClick={closeMenu}>
                  <span className={s.chapterHour}>{c.hour}</span>
                  <span className={s.chapterName}>{c.name}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className={s.menuLinks}>
            <a href="#projects" onClick={closeMenu}>
              {t(strings.sections.index)}
            </a>
            <a href="#contact" onClick={closeMenu}>
              {t(strings.nav.contact)}
            </a>
            <a href={cv} download onClick={closeMenu}>
              CV (PDF)
            </a>
          </div>
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

        {/* 06:00 — dawn, in cream: About (titled by the heading that closes the house above), the
            project list and Contact. */}
        <div className={s.dawn} data-hour="06:00" data-tone="light" data-chapter="about">
          <section className={s.about} aria-labelledby="about-title">
            <div>
              <div className={s.block} data-reveal="">
                <h3 className={s.listLabel}>{t(strings.sections.education)}</h3>
                <p className={s.degree}>{t(strings.education.degreeTitle)}</p>
                <p className={s.degreeMeta}>
                  {t(strings.education.degreeInst)} · {t(strings.education.degreeDates)}
                </p>
                <div className={s.figures}>
                  <div className={s.figure}>
                    <span className={s.figureValue}>{t(academics.gpa)}</span>
                    <span className={s.listLabel}>{t(strings.education.gpa)}</span>
                  </div>
                  <div className={s.figure}>
                    <span className={s.figureValue}>{t(academics.access)}</span>
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
          </section>

          {/* Everything the house shows, in one list: where "Skip the tour" leads. */}
          <section id="projects" className={s.index} aria-labelledby="projects-title">
            <h2 id="projects-title" className={s.sectionLabel} data-reveal="">
              {t(strings.sections.index)}
            </h2>
            <p className={s.indexNote} data-reveal="">
              {t(strings.sections.indexNote)}
            </p>
            <ol className={s.indexList}>
              {HOUSE_CHAPTERS.map(({ project: p, hour }) => (
                <li key={p.id} className={s.indexRow} data-reveal="">
                  <span className={s.indexHour}>{hour}</span>
                  <div>
                    <h3 className={s.indexName}>
                      <a href={`#${p.id}`}>
                        {p.name} <span aria-hidden="true">↑</span>
                      </a>
                    </h3>
                    <p className={s.indexTagline}>{t(p.tagline)}</p>
                    <p className={s.indexStack}>{p.stack.join(" · ")}</p>
                  </div>
                  <div className={s.indexMeta}>
                    <ProjectMeta proj={p} t={t} />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="contact" className={s.contact} aria-labelledby="contact-title">
            <h2 id="contact-title" className={s.sectionLabel} data-reveal="">
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
                <button type="button" onClick={copyEmail}>
                  {t(strings.sections.copyEmail)}
                </button>
                <span className={s.copyStatus} role="status" data-state={copy}>
                  {copy === "done" && `${t(strings.sections.copied)} ✓`}
                  {copy === "failed" && t(strings.sections.copyFailed)}
                </span>
              </li>
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
              <li>
                <a href={cv} download>
                  CV (PDF) ↓
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
          </section>
        </div>
      </main>
    </div>
  );
}
