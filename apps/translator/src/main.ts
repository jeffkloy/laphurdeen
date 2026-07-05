import "./style.css";
import lexiconTsv from "../../../LEXICON.tsv?raw";
import { Translator, type Direction, type TokenResult } from "./engine/translate";

const translator = new Translator(lexiconTsv);

const EXAMPLES: Record<Direction, string[]> = {
  "en-la": [
    "We are building a new nation.",
    "Do you speak Laphurdi?",
    "Today the people vote.",
    "I don't speak French.",
    "The little boy will swim to the island.",
    "Thank you.",
  ],
  "la-en": [
    "Vi, folket av Laphurdeen, kom fri fra mange strander te bygga en nasjon waar ingen stod befor.",
    "Sprekar du Laphurdi?",
    "Idag stemmar folket.",
    "Ik har sprekat med henne.",
    "Hen werkar in Helsaministeriet.",
    "Waar er staden?",
  ],
};

const LANG_NAME: Record<Direction, [string, string]> = {
  "en-la": ["Engelsk · English", "Laphurdi"],
  "la-en": ["Laphurdi", "Engelsk · English"],
};

/** Grammar-machinery tags get the amber treatment. */
const GRAMMAR_TAGS = new Set([
  "DEF", "PL", "PRES", "PAST", "PERF", "INF", "AUX", "MODAL",
  "NEG", "Q", "V2", "COMP", "SUP", "DIM", "COMPOUND", "FOSSIL",
  "FRONTED", "INDEF", "POSS", "OBJ", "SUBJ",
]);

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <header class="masthead">
    <svg class="star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.8 L14.4 8.4 L21.4 8.6 L15.9 12.9 L17.9 19.6 L12 15.6 L6.1 19.6 L8.1 12.9 L2.6 8.6 L9.6 8.4 Z" fill="#F2A900"/>
    </svg>
    <h1>Oversettaren</h1>
    <p class="sub"><b>Laphurdi</b> ⇄ <b>Engelsk</b> · an instrument of the Language Commission</p>
    <p class="motto">Frihed · Velvard · Konsens</p>
    <svg class="arc" viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 130 L0 108 Q600 8 1200 108 L1200 130 Z" fill="#F2A900"/>
      <path d="M0 130 L0 116 Q600 22 1200 116 L1200 130 Z" fill="#003A66" opacity="0.18"/>
    </svg>
  </header>

  <main class="instrument">
    <div class="paper">
      <div class="paper-head">
        <span class="doc-title">Application for the rendering of one language into the other</span>
        <span class="doc-stamp">Standard Laphurdi · First Spelling Reform<br/>LEXICON.tsv · <span id="stat-words"></span> words</span>
      </div>

      <div class="panes">
        <section class="pane">
          <label><span class="lang" id="src-lang"></span><span class="rule-line"></span>source</label>
          <textarea id="input" rows="5" spellcheck="false"
            placeholder="Skriv hier — write here…"></textarea>
        </section>

        <div class="pane-divider">
          <button class="swap" id="swap" title="Swap direction" aria-label="Swap translation direction">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6.5 H15 M12 3 L15.5 6.5 L12 10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 13.5 H5 M8 10.5 L4.5 13.5 L8 17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <section class="pane">
          <label><span class="lang" id="dst-lang"></span><span class="rule-line"></span>rendering</label>
          <div class="output" id="output" aria-live="polite"></div>
        </section>
      </div>

      <div class="examples">
        <span class="ex-label">Try</span>
        <span id="example-chips"></span>
      </div>
    </div>

    <section class="breakdown">
      <h2>Word by word — the gloss line</h2>
      <div class="tokens" id="tokens"></div>
    </section>
  </main>

  <footer>
    <p class="f-motto">Sang av de Mange Strander — many shores, one anchorage.</p>
    <p class="f-line">Commonwealth of Laphurdeen · Language Commission · built on LEXICON.tsv</p>
  </footer>
`;

const input = document.querySelector<HTMLTextAreaElement>("#input")!;
const output = document.querySelector<HTMLDivElement>("#output")!;
const tokensEl = document.querySelector<HTMLDivElement>("#tokens")!;
const swapBtn = document.querySelector<HTMLButtonElement>("#swap")!;
const srcLang = document.querySelector<HTMLSpanElement>("#src-lang")!;
const dstLang = document.querySelector<HTMLSpanElement>("#dst-lang")!;
const chips = document.querySelector<HTMLSpanElement>("#example-chips")!;

document.querySelector("#stat-words")!.textContent =
  translator.lexicon.entries.length.toLocaleString("en-US");

let direction: Direction = "en-la";
let lastResult = "";

function renderToken(t: TokenResult, i: number): HTMLElement {
  const el = document.createElement("div");
  el.className = "token" + (t.unknown ? " is-unknown" : "") + (t.punct ? " is-punct" : "");
  el.style.setProperty("--i", String(Math.min(i, 24)));

  const src = document.createElement("div");
  src.className = "t-src";
  src.textContent = t.source;
  el.appendChild(src);

  const out = document.createElement("div");
  out.className = "t-out";
  out.textContent = t.output || "·";
  el.appendChild(out);

  const meta = document.createElement("div");
  meta.className = "t-meta";
  if (t.lemma && t.gloss && t.lemma.toLowerCase() !== t.output.toLowerCase()) {
    const lemma = document.createElement("span");
    lemma.className = "t-lemma";
    lemma.textContent = `${t.lemma}${t.pos ? " · " + t.pos : ""}`;
    meta.appendChild(lemma);
  } else if (t.pos) {
    const pos = document.createElement("span");
    pos.className = "t-lemma";
    pos.textContent = t.pos;
    meta.appendChild(pos);
  }
  for (const tag of t.tags) {
    const chip = document.createElement("span");
    chip.className = "tag" + (GRAMMAR_TAGS.has(tag) ? " grammar" : "");
    chip.textContent = tag.toLowerCase();
    meta.appendChild(chip);
  }
  if (t.register) {
    const reg = document.createElement("span");
    reg.className = "tag reg-" + t.register;
    reg.textContent = t.register;
    meta.appendChild(reg);
  }
  if (meta.childElementCount > 0) el.appendChild(meta);

  if (t.note) {
    const note = document.createElement("div");
    note.className = "t-note";
    note.textContent = t.note;
    el.appendChild(note);
  }
  return el;
}

function run() {
  const text = input.value.trim();
  if (!text) {
    output.textContent = "";
    tokensEl.innerHTML =
      '<span class="empty-hint">The gloss line appears here — every word accounted for.</span>';
    lastResult = "";
    return;
  }
  const { text: rendered, tokens } = translator.translate(text, direction);
  lastResult = rendered;
  output.textContent = rendered;
  tokensEl.innerHTML = "";
  let i = 0;
  for (const t of tokens) {
    if (t.punct) continue;
    tokensEl.appendChild(renderToken(t, i++));
  }
}

function syncDirection() {
  const [src, dst] = LANG_NAME[direction];
  srcLang.textContent = src;
  dstLang.textContent = dst;
  input.placeholder = direction === "en-la"
    ? "Write here — the Commission renders it into Laphurdi…"
    : "Skriv hier — the Commission renders it into English…";
  chips.innerHTML = "";
  for (const ex of EXAMPLES[direction]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = ex.length > 46 ? ex.slice(0, 44).trimEnd() + "…" : ex;
    b.title = ex;
    b.addEventListener("click", () => {
      input.value = ex;
      run();
      input.focus();
    });
    chips.appendChild(b);
  }
}

let debounce = 0;
input.addEventListener("input", () => {
  window.clearTimeout(debounce);
  debounce = window.setTimeout(run, 140);
});

swapBtn.addEventListener("click", () => {
  direction = direction === "en-la" ? "la-en" : "en-la";
  swapBtn.classList.toggle("flipped", direction === "la-en");
  // Carry the rendering back across the desk: output becomes the new input.
  if (lastResult) input.value = lastResult;
  syncDirection();
  run();
});

syncDirection();
run();
