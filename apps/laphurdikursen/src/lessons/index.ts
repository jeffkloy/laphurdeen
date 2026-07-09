import type { Lesson } from "../types";
import { hallej } from "./01-hallej";
import { sounds } from "./02-sounds";
import { nouns } from "./03-nouns";
import { verbs } from "./04-verbs";
import { irregulars } from "./05-irregulars";
import { pronouns } from "./06-pronouns";
import { order } from "./07-order";
import { numbers } from "./08-numbers";
import { wordbuilding } from "./09-wordbuilding";
import { register } from "./10-register";
import { laphurdeen } from "./11-laphurdeen";
import { praktisk } from "./12-praktisk";

/** The course, in teaching order. */
export const lessons: Lesson[] = [
  hallej,
  sounds,
  nouns,
  verbs,
  irregulars,
  pronouns,
  order,
  numbers,
  wordbuilding,
  register,
  laphurdeen,
  praktisk,
];
