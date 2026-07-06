/** DOM rendering: shell, course home, lesson pages, and the quiz flow.
 *  All HTML injected here is authored in this repo (src/lessons/) - there is
 *  no user-generated content anywhere in the app. */

import type { Example, Lesson, Section, Table } from "./types";
import { isPassed, loadProgress, percent, recordResult, PASS_PERCENT } from "./progress";
import { QuizRun } from "./quiz";

const FLAG_SVG = `<svg class="brand-flag" viewBox="0 0 300 200" role="img" aria-label="The flag of Laphurdeen">
  <rect width="300" height="200" fill="#003A66"/>
  <path d="M0 200 Q150 66.67 300 200 Z" fill="#F2A900"/>
  <path d="M150 60 L154.49 73.82 L169.02 73.82 L157.27 82.36 L161.76 96.18 L150 87.64 L138.24 96.18 L142.73 82.36 L130.98 73.82 L145.51 73.82 Z" fill="#FFFFFF"/>
</svg>`;

const STAR = "★";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ------------------------------- shell -------------------------------- */

export function renderShell(root: HTMLElement): HTMLElement {
  root.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#/">
        ${FLAG_SVG}
        <span class="brand-name">Laphurdikursen</span>
      </a>
      <nav class="site-nav" aria-label="The Commonwealth online">
        <a href="../">Laphurdeen</a>
        <a href="../translator/">Oversettaren&nbsp;↗</a>
      </nav>
    </header>
    <main id="view" tabindex="-1"></main>
    <footer class="site-footer">
      <p class="f-motto">Frihed · Velvard · Konsens</p>
      <p class="f-line">Samveldet Laphurdeen · Sprakkommisjonen - the Language Commission · built on LAPHURDI.md &amp; LEXICON.tsv</p>
      <p class="f-line">Standard Laphurdi, First Spelling Reform - proper names keep their heritage spellings.</p>
    </footer>`;
  return root.querySelector<HTMLElement>("#view")!;
}

/* -------------------------------- home --------------------------------- */

export function renderHome(view: HTMLElement, lessons: Lesson[]): void {
  const progress = loadProgress();
  const passed = lessons.filter((l) => isPassed(progress[l.slug])).length;

  const cards = lessons
    .map((l, i) => {
      const p = progress[l.slug];
      const status = !p
        ? `<span class="card-status">Provet ventar <span class="gloss">- not yet taken</span></span>`
        : isPassed(p)
          ? `<span class="card-status is-passed">${STAR} ${percent(p)} % · Goed doat!</span>`
          : `<span class="card-status is-started">Best ${percent(p)} % - prova igen</span>`;
      return `
      <li class="lesson-card${isPassed(p) ? " lesson-card-passed" : ""}">
        <a href="#/leksjon/${l.slug}">
          <span class="card-no">${String(i + 1).padStart(2, "0")}</span>
          <span class="card-body">
            <span class="card-title" lang="lp">${l.titleLp}</span>
            <span class="card-sub">${esc(l.titleEn)}</span>
            <span class="card-tagline">${esc(l.tagline)}</span>
            ${status}
          </span>
          <span class="card-arrow" aria-hidden="true">→</span>
        </a>
      </li>`;
    })
    .join("");

  view.innerHTML = `
    <section class="hero">
      <p class="eyebrow">Samveldet Laphurdeen · The Language Commission</p>
      <h1>Velkom te <span class="amber">Laphurdikursen</span></h1>
      <p class="hero-lede">
        Learn <strong>Laphurdi</strong>, the national language of the Commonwealth -
        a Germanic language wearing a French coat. Eleven lessons take you from
        <i lang="lp">Hallej!</i> to reading the Preamble of the
        <i lang="lp">Grundlojen</i> itself. Each lesson ends with
        <i lang="lp">provet</i> - the quiz. ${PASS_PERCENT}&nbsp;% passes.
      </p>
      <p class="hero-progress">${
        passed === 0
          ? "No quizzes passed yet - start with Leksjon 1."
          : `${passed} of ${lessons.length} quizzes passed${passed === lessons.length ? ` - ${STAR} every star earned. Goed doat!` : ""}`
      }</p>
    </section>
    <ol class="lesson-list">${cards}</ol>`;
}

/* ------------------------------- lesson -------------------------------- */

function renderTable(t: Table): string {
  const head = t.headers.map((h) => `<th scope="col">${esc(h)}</th>`).join("");
  const rows = t.rows
    .map(
      (r) =>
        `<tr>${r
          .map((cell, i) => {
            const lang = t.langs[i] === "lp" ? ` lang="lp"` : "";
            const cls = t.langs[i] === "lp" ? ` class="lp"` : "";
            return `<td${lang}${cls}>${cell}</td>`;
          })
          .join("")}</tr>`,
    )
    .join("");
  return `<div class="table-wrap"><table>
    ${t.caption ? `<caption>${esc(t.caption)}</caption>` : ""}
    <thead><tr>${head}</tr></thead><tbody>${rows}</tbody>
  </table></div>`;
}

function renderExamples(examples: Example[]): string {
  return `<ul class="examples">${examples
    .map(
      (e) => `<li>
        <span class="ex-lp" lang="lp">${e.lp}</span>
        <span class="ex-en">${esc(e.en)}</span>
        ${e.note ? `<span class="ex-note">${e.note}</span>` : ""}
      </li>`,
    )
    .join("")}</ul>`;
}

function renderSection(s: Section): string {
  return `<section class="lesson-section">
    <h2>${s.heading}</h2>
    ${s.body.map((p) => `<p>${p}</p>`).join("")}
    ${s.table ? renderTable(s.table) : ""}
    ${s.examples ? renderExamples(s.examples) : ""}
  </section>`;
}

export function renderLesson(view: HTMLElement, lessons: Lesson[], slug: string): void {
  const idx = lessons.findIndex((l) => l.slug === slug);
  if (idx === -1) {
    location.hash = "#/";
    return;
  }
  const lesson = lessons[idx];
  const next = lessons[idx + 1];

  view.innerHTML = `
    <article class="lesson">
      <nav class="crumbs"><a href="#/">← Alle leksjoner <span class="gloss">- all lessons</span></a></nav>
      <header class="lesson-header">
        <p class="eyebrow">Leksjon ${idx + 1} av ${lessons.length}</p>
        <h1 lang="lp">${lesson.titleLp}</h1>
        <p class="lesson-sub">${esc(lesson.titleEn)}</p>
      </header>
      ${lesson.intro.map((p) => `<p class="lesson-intro">${p}</p>`).join("")}
      ${lesson.sections.map(renderSection).join("")}
      <section class="lesson-section vocab">
        <h2>Orderen <span class="gloss">- the words</span></h2>
        <dl class="vocab-list">
          ${lesson.vocab
            .map(
              (v) => `<div class="vocab-item">
                <dt lang="lp">${v.lp}</dt>
                <dd>${esc(v.en)}${v.note ? `<span class="vocab-note">${v.note}</span>` : ""}</dd>
              </div>`,
            )
            .join("")}
        </dl>
      </section>
      <section class="lesson-section quiz" id="quiz">
        <h2>Provet <span class="gloss">- the quiz</span></h2>
        <div class="quiz-host"></div>
      </section>
      ${
        next
          ? `<nav class="lesson-next"><a href="#/leksjon/${next.slug}">Neste leksjon: <span lang="lp">${next.titleLp}</span> →</a></nav>`
          : ""
      }
    </article>`;

  mountQuiz(view.querySelector<HTMLElement>(".quiz-host")!, lesson, next);
}

/* -------------------------------- quiz --------------------------------- */

function mountQuiz(host: HTMLElement, lesson: Lesson, next: Lesson | undefined): void {
  const start = () => {
    const run = new QuizRun(lesson.quiz);
    showQuestion(host, lesson, run, next);
  };

  const p = loadProgress()[lesson.slug];
  host.innerHTML = `
    <div class="quiz-start">
      <p>${lesson.quiz.length} kwestioner <span class="gloss">- ${lesson.quiz.length} questions</span>.
      Pass at ${PASS_PERCENT} % to earn the star.
      ${p ? `Your best so far: <strong>${percent(p)} %</strong>${isPassed(p) ? ` ${STAR}` : ""}.` : ""}</p>
      <button class="btn btn-navy" type="button">Beginna provet <span class="gloss-btn">- begin the quiz</span></button>
    </div>`;
  host.querySelector("button")!.addEventListener("click", start);
}

function showQuestion(host: HTMLElement, lesson: Lesson, run: QuizRun, next: Lesson | undefined): void {
  if (run.finished) {
    showSummary(host, lesson, run, next);
    return;
  }
  const q = run.current;
  const n = run.index + 1;

  // Authors keep the correct option first in the data for readability;
  // the display order is shuffled so position never gives the answer away.
  const displayOrder = q.type === "choice" ? q.options.map((_, i) => i) : [];
  for (let i = displayOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [displayOrder[i], displayOrder[j]] = [displayOrder[j], displayOrder[i]];
  }

  host.innerHTML = `
    <div class="quiz-q">
      <p class="quiz-meter">Kwestion ${n} av ${run.questions.length}
        <span class="quiz-track" aria-hidden="true"><span class="quiz-fill" style="width:${Math.round((100 * run.index) / run.questions.length)}%"></span></span>
      </p>
      <p class="quiz-prompt">${q.prompt}</p>
      ${
        q.type === "choice"
          ? `<div class="quiz-options">${displayOrder
              .map(
                (i) =>
                  `<button class="quiz-option" type="button" data-i="${i}"${q.lpOptions ? ` lang="lp"` : ""}>${q.options[i]}</button>`,
              )
              .join("")}</div>`
          : `<form class="quiz-typed">
              <input type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                ${q.lpAnswer ? `lang="lp"` : ""} placeholder="${esc(q.placeholder ?? "Skriv hier …")}" aria-label="Your answer" />
              <button class="btn btn-navy" type="submit">Svara <span class="gloss-btn">- answer</span></button>
            </form>`
      }
      <div class="quiz-feedback" role="status"></div>
    </div>`;

  const feedback = host.querySelector<HTMLElement>(".quiz-feedback")!;

  const showFeedback = (right: boolean) => {
    const answerLine =
      q.type === "choice"
        ? `<span class="fb-answer"${q.lpOptions ? ` lang="lp"` : ""}>${q.options[q.answer]}</span>`
        : `<span class="fb-answer"${q.lpAnswer ? ` lang="lp"` : ""}>${esc(q.accept[0])}</span>`;
    feedback.innerHTML = `
      <p class="fb-verdict ${right ? "is-rett" : "is-fel"}">
        ${right ? "✓ Rett!" : "✕ Fel."}
        <span class="gloss">${right ? "- correct" : "- not quite"}</span>
      </p>
      ${right ? "" : `<p class="fb-line">The answer: ${answerLine}</p>`}
      <p class="fb-explain">${q.explain}</p>
      <button class="btn btn-amber" type="button">${run.index + 1 < run.questions.length ? "Neste →" : "Se resultatet →"}</button>`;
    feedback.querySelector("button")!.addEventListener("click", () => {
      run.next();
      showQuestion(host, lesson, run, next);
    });
    feedback.querySelector("button")!.focus();
  };

  if (q.type === "choice") {
    host.querySelectorAll<HTMLButtonElement>(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (run.answered) return;
        const i = Number(btn.dataset.i);
        const right = run.submit(i);
        btn.classList.add(right ? "opt-rett" : "opt-fel");
        host.querySelectorAll<HTMLButtonElement>(".quiz-option").forEach((b) => {
          b.disabled = true;
          if (Number(b.dataset.i) === q.answer) b.classList.add("opt-answer");
        });
        showFeedback(right);
      });
    });
  } else {
    const form = host.querySelector<HTMLFormElement>(".quiz-typed")!;
    const input = form.querySelector<HTMLInputElement>("input")!;
    input.focus();
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (run.answered || input.value.trim() === "") return;
      const right = run.submit(input.value);
      input.disabled = true;
      form.querySelector("button")!.disabled = true;
      input.classList.add(right ? "opt-rett" : "opt-fel");
      showFeedback(right);
    });
  }
}

function showSummary(host: HTMLElement, lesson: Lesson, run: QuizRun, next: Lesson | undefined): void {
  const total = run.questions.length;
  const pct = Math.round((100 * run.correct) / total);
  const passed = pct >= PASS_PERCENT;
  recordResult(lesson.slug, run.correct, total);

  host.innerHTML = `
    <div class="quiz-summary ${passed ? "is-passed" : ""}">
      ${passed ? `<p class="summary-stamp">${STAR} Goed doat! <span class="gloss">- well done</span></p>` : ""}
      <p class="summary-score"><strong>${run.correct}</strong> av ${total} rett - ${pct} %</p>
      <p class="summary-line">${
        passed
          ? "The Language Commission is satisfied. The star is yours."
          : `You need ${PASS_PERCENT} % for the star. Read the lesson once more - then prova igen.`
      }</p>
      <div class="summary-actions">
        <button class="btn ${passed ? "btn-ghost" : "btn-navy"}" type="button">Prova igen <span class="gloss-btn">- try again</span></button>
        ${
          passed && next
            ? `<a class="btn btn-amber" href="#/leksjon/${next.slug}">Neste leksjon →</a>`
            : `<a class="btn ${passed ? "btn-amber" : "btn-ghost"}" href="#/">Alle leksjoner</a>`
        }
      </div>
    </div>`;

  host.querySelector("button")!.addEventListener("click", () => {
    const rerun = new QuizRun(lesson.quiz);
    showQuestion(host, lesson, rerun, next);
  });
}

/* ------------------------------- helpers ------------------------------- */

export type Route = { view: "home" } | { view: "lesson"; slug: string };

export function parseRoute(hash: string): Route {
  const m = hash.match(/^#\/leksjon\/([a-z0-9-]+)$/);
  return m ? { view: "lesson", slug: m[1] } : { view: "home" };
}

export function renderRoute(view: HTMLElement, lessons: Lesson[], hash: string): void {
  const route = parseRoute(hash);
  if (route.view === "lesson") renderLesson(view, lessons, route.slug);
  else renderHome(view, lessons);
  window.scrollTo({ top: 0 });
  view.focus({ preventScroll: true });
}
