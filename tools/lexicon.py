#!/usr/bin/env python3
"""Laphurdi lexicon tooling: `check` lints LEXICON.tsv, `build` generates LEXICON.md."""
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TSV_PATH = ROOT / "LEXICON.tsv"
MD_PATH = ROOT / "LEXICON.md"

COLUMNS = ["word", "pos", "gender", "forms", "english",
           "domain", "register", "sources", "notes"]
POS = {"n", "v", "adj", "adv", "prep", "conj", "pron", "num", "det", "interj"}
REGISTERS = {"", "everyday", "high"}
DOMAINS = ["world-nature", "plants-animals", "body-health", "people-family",
           "food-drink", "house-home", "clothing", "time-calendar",
           "numbers-measure", "motion-travel", "sea-ships", "work-trade",
           "communication", "mind-emotion", "law-civic", "arts-leisure",
           "school-knowledge", "science", "digital", "society",
           "common-verbs", "qualities", "function-words"]
IRREGULAR_VERBS = {"vera", "hava", "gaa", "staa", "komma", "se", "doa", "ta",
                   "geva", "faa", "seja", "veta", "kunna", "vilja", "skola",
                   "moste"}
FORMS_ALLOWED = IRREGULAR_VERBS | {"krona"}
LANG_TAG = re.compile(r"^(EN|NL|SV|FR|DA)\b")
WORD_RE = re.compile(r"^[A-Za-z]+$")


def load(path=TSV_PATH):
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t", restkey="_extra")
        if reader.fieldnames != COLUMNS:
            raise SystemExit(f"bad header: {reader.fieldnames}")
        for lineno, r in enumerate(reader, start=2):
            r["_line"] = lineno
            rows.append(r)
    return rows


def is_derived(r):
    src = r["sources"]
    if not src:
        return False
    terms = [t.strip() for t in src.split(" + ")]
    return not any(LANG_TAG.match(t) for t in terms)


def check(rows):
    errors, warnings = [], []
    seen = {}
    for r in rows:
        seen.setdefault(r["word"], []).append(r["_line"])
    for w, lines in seen.items():
        if len(lines) > 1:
            errors.append(f"duplicate headword: {w} (lines {lines})")
    headwords = set(seen)

    for r in rows:
        line, w = r["_line"], r["word"]
        if "_extra" in r or any(r.get(c) is None for c in COLUMNS):
            errors.append(f"line {line}: wrong column count")
            continue
        if not WORD_RE.match(w):
            errors.append(f"line {line}: illegal characters in '{w}'")
        if r["pos"] not in POS:
            errors.append(f"line {line}: bad pos '{r['pos']}'")
        if r["domain"] not in DOMAINS:
            errors.append(f"line {line}: bad domain '{r['domain']}'")
        if r["register"] not in REGISTERS:
            errors.append(f"line {line}: bad register '{r['register']}'")
        if r["pos"] == "n":
            if r["gender"] not in {"c", "n"}:
                errors.append(f"line {line}: noun '{w}' needs gender c or n")
        elif r["gender"]:
            errors.append(f"line {line}: non-noun '{w}' must not have gender")
        if (r["pos"] == "v" and not w.endswith("a")
                and w not in IRREGULAR_VERBS):
            errors.append(f"line {line}: verb '{w}' must end in -a or be on the closed irregular list")
        if r["forms"] and w not in FORMS_ALLOWED:
            errors.append(f"line {line}: '{w}' may not carry forms")
        if w in IRREGULAR_VERBS and r["pos"] == "v" and not r["forms"]:
            errors.append(f"line {line}: irregular verb '{w}' missing forms")
        if not r["english"]:
            errors.append(f"line {line}: '{w}' missing gloss")
        if not r["sources"]:
            errors.append(f"line {line}: '{w}' missing sources")
        elif is_derived(r):
            for t in (t.strip() for t in r["sources"].split(" + ")):
                if t.startswith("-") or t.endswith("-"):
                    continue  # affix
                if t not in headwords:
                    errors.append(f"line {line}: '{w}' derives from unknown headword '{t}'")

    by_gloss = {}
    for r in rows:
        by_gloss.setdefault(r["english"], []).append(r)
    for gloss, rs in by_gloss.items():
        if len(rs) > 1 and sorted(x["register"] for x in rs) != ["everyday", "high"]:
            words = ", ".join(x["word"] for x in rs)
            warnings.append(f"duplicate gloss '{gloss}' without register doublet: {words}")
    return errors, warnings


def build(rows):
    by_domain = {d: [] for d in DOMAINS}
    for r in rows:
        by_domain[r["domain"]].append(r)
    derived = sum(1 for r in rows if is_derived(r))
    total = len(rows)

    out = ["# LEXICON — Laphurdi–English", "",
           "*Generated from `LEXICON.tsv` by `tools/lexicon.py build` — do not edit by hand.*",
           "",
           f"**{total} words** — {total - derived} roots, {derived} derived.",
           "",
           "| domain | words |", "|---|---|"]
    for d in DOMAINS:
        if by_domain[d]:
            out.append(f"| {d} | {len(by_domain[d])} |")
    for d in DOMAINS:
        if not by_domain[d]:
            continue
        out += ["", f"## {d}", "",
                "| Laphurdi | pos | English | register | sources |",
                "|---|---|---|---|---|"]
        for r in sorted(by_domain[d], key=lambda r: r["word"].lower()):
            pos = r["pos"] + (f" ({r['gender']})" if r["gender"] else "")
            word = f"**{r['word']}**" + (f" ({r['forms']})" if r["forms"] else "")
            out.append(f"| {word} | {pos} | {r['english']} | {r['register']} | {r['sources']} |")
    out += ["", "## Alphabetical index", "",
            "| Laphurdi | English |", "|---|---|"]
    for r in sorted(rows, key=lambda r: r["word"].lower()):
        out.append(f"| {r['word']} | {r['english']} |")
    return "\n".join(out) + "\n"


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd not in {"check", "build"}:
        print("usage: lexicon.py check|build")
        sys.exit(2)
    rows = load()
    errors, warnings = check(rows)
    for msg in warnings:
        print(f"WARN: {msg}")
    for msg in errors:
        print(f"ERROR: {msg}")
    print(f"{len(rows)} rows, {len(errors)} errors, {len(warnings)} warnings")
    if errors:
        sys.exit(1)
    if cmd == "build":
        MD_PATH.write_text(build(rows), encoding="utf-8")
        print(f"wrote {MD_PATH.name}")


if __name__ == "__main__":
    main()
