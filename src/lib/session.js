/**
 * What the visitor gave us, kept in sessionStorage: the intake, the photo, and
 * the analysis that came back for it.
 *
 * Every routed screen has to survive a refresh or a pasted link, so nothing
 * downstream may rely on state held in a previous component. Anything a later
 * screen needs is read back from here.
 *
 * sessionStorage throws in some privacy modes, so every access is guarded.
 */

const KEYS = {
  intake: "skinstric:intake",
  photo: "skinstric:photo",
  analysis: "skinstric:analysis",
};

function read(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or quota — the flow still works, it just won't survive a refresh */
  }
}

function remove(key) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readIntake() {
  const value = read(KEYS.intake);
  return value && typeof value.name === "string" ? value : null;
}
export const writeIntake = (intake) => write(KEYS.intake, intake);
export const clearIntake = () => remove(KEYS.intake);

/** The photo that was analysed, as a data: URL (already downscaled, so it fits). */
export function readPhoto() {
  const value = read(KEYS.photo);
  return typeof value === "string" && value.startsWith("data:image/") ? value : null;
}
export const writePhoto = (dataUrl) => write(KEYS.photo, dataUrl);

/** Phase two's `data`: { race, age, gender } confidence maps. */
export function readAnalysis() {
  const value = read(KEYS.analysis);
  return value && typeof value === "object" && value.race && value.age && value.gender ? value : null;
}
export const writeAnalysis = (data) => write(KEYS.analysis, data);
