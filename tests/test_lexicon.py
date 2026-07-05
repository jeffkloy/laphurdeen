import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import lexicon


def row(**kw):
    r = {c: "" for c in lexicon.COLUMNS}
    r["_line"] = kw.pop("line", 2)
    r.update(kw)
    return r


def noun(word="vatter", english="water", **kw):
    base = dict(word=word, pos="n", gender="c", english=english,
                domain="world-nature", sources="EN water + NL water + SV vatten")
    base.update(kw)
    return row(**base)


class CheckTests(unittest.TestCase):
    def assert_error(self, rows, fragment):
        errors, _ = lexicon.check(rows)
        self.assertTrue(any(fragment in e for e in errors), errors)

    def assert_clean(self, rows):
        errors, _ = lexicon.check(rows)
        self.assertEqual(errors, [])

    def test_clean_row_passes(self):
        self.assert_clean([noun()])

    def test_duplicate_headword(self):
        self.assert_error([noun(), noun(english="wet stuff", line=3)],
                          "duplicate headword")

    def test_noun_requires_gender(self):
        self.assert_error([noun(gender="")], "needs gender")

    def test_non_noun_rejects_gender(self):
        self.assert_error(
            [row(word="blij", pos="adj", gender="c", english="happy",
                 domain="qualities", sources="NL blij")],
            "must not have gender")

    def test_verb_must_end_in_a(self):
        self.assert_error(
            [row(word="sprek", pos="v", english="speak",
                 domain="communication", sources="EN speak + SV spreka")],
            "must end in -a")

    def test_irregular_verb_se_allowed(self):
        self.assert_clean(
            [row(word="se", pos="v", forms="pres=ser, past=saag, perf=seet",
                 english="see", domain="common-verbs", sources="SV se + NL zien")])

    def test_forms_only_for_closed_list(self):
        self.assert_error([noun(forms="pl=vattrar")], "may not carry forms")

    def test_irregular_requires_forms(self):
        self.assert_error(
            [row(word="gaa", pos="v", english="go", domain="common-verbs",
                 sources="SV gaa + NL gaan")],
            "missing forms")

    def test_sources_required(self):
        self.assert_error([noun(sources="")], "missing sources")

    def test_derivation_integrity(self):
        bygga = row(word="bygga", pos="v", english="build",
                    domain="work-trade", sources="SV bygga")
        byggare = row(word="byggare", pos="n", gender="c", english="builder",
                      domain="work-trade", sources="bygga + -are", line=3)
        self.assert_error([byggare], "unknown")
        self.assert_clean([bygga, byggare])

    def test_root_citation_not_checked(self):
        self.assert_clean([noun(sources="EN nonexistent + FR imaginaire")])

    def test_doublet_glosses_allowed(self):
        helpa = row(word="helpa", pos="v", english="help", register="everyday",
                    domain="common-verbs", sources="NL helpen + SV hjälpa")
        assistera = row(word="assistera", pos="v", english="help",
                        register="high", domain="common-verbs",
                        sources="FR assister", line=3)
        _, warnings = lexicon.check([helpa, assistera])
        self.assertEqual(warnings, [])

    def test_plain_duplicate_gloss_warns(self):
        a = noun()
        b = noun(word="aqua", line=3, sources="FR eau")
        _, warnings = lexicon.check([a, b])
        self.assertTrue(any("duplicate gloss" in w for w in warnings), warnings)


class BuildTests(unittest.TestCase):
    def rows(self):
        return [
            row(word="vatter", pos="n", gender="c", english="water",
                domain="world-nature", sources="EN water + NL water + SV vatten"),
            row(word="fri", pos="adj", english="free", domain="qualities",
                sources="EN free + SV fri", line=3),
            row(word="frihed", pos="n", gender="c", english="freedom",
                domain="law-civic", sources="fri + -hed", line=4),
        ]

    def test_build_structure(self):
        out = lexicon.build(self.rows())
        self.assertIn("# LEXICON", out)
        self.assertIn("## world-nature", out)
        self.assertIn("## Alphabetical index", out)
        self.assertIn("| **frihed** | n (c) | freedom |  | fri + -hed |", out)
        self.assertIn("**3 words** — 2 roots, 1 derived.", out)

    def test_build_deterministic(self):
        self.assertEqual(lexicon.build(self.rows()), lexicon.build(self.rows()))

    def test_empty_domains_omitted(self):
        self.assertNotIn("## sea-ships", lexicon.build(self.rows()))


if __name__ == "__main__":
    unittest.main()
