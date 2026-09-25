/**
 * Shaping phase two's raw confidence maps for the demographics screen.
 *
 * The API speaks in lowercase keys ("east asian", "latino hispanic", "40-49")
 * and says "gender"; the Figma speaks in "East Asian", "20–29 y.o." and "SEX".
 * Everything the screen shows goes through here, so the mapping lives in one
 * place.
 */

import { topPrediction } from "@/lib/skinstric";

export const GROUPS = [
  { key: "race", label: "Race" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Sex" },
];

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const sentenceCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const ageStart = (key) => parseInt(key, 10) || 0;

/** How an option reads in each place it appears. */
export function display(group, key) {
  if (group === "age") {
    const range = key.replace("-", "–");
    return { list: range, rail: range, heading: `${range} y.o.` };
  }
  return { list: titleCase(key), rail: key.toUpperCase(), heading: sentenceCase(key) };
}

/**
 * Options for a group. Ages read youngest to oldest, as drawn in frame 014;
 * race and sex read by confidence, as in 013.
 */
export function options(group, scores) {
  const list = Object.entries(scores || {})
    .filter(([, v]) => typeof v === "number")
    .map(([key, confidence]) => ({ key, confidence, percent: Math.round(confidence * 100) }));
  return group === "age"
    ? list.sort((a, b) => ageStart(a.key) - ageStart(b.key))
    : list.sort((a, b) => b.confidence - a.confidence);
}

/** The A.I.'s own pick for every group: { race: "black", age: "40-49", gender: "female" }. */
export function aiPicks(analysis) {
  return Object.fromEntries(GROUPS.map(({ key }) => [key, topPrediction(analysis?.[key])?.label ?? null]));
}
