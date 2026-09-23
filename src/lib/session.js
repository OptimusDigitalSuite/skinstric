/**
 * What the visitor told us, kept in sessionStorage.
 *
 * Every routed screen has to survive a refresh or a pasted link, so nothing
 * downstream may rely on state held in a previous component. Anything the
 * summary screen needs is read back from here or re-fetched.
 *
 * sessionStorage throws in some privacy modes, so every access is guarded.
 */

const KEY = "skinstric:intake";

export function readIntake() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return value && typeof value.name === "string" ? value : null;
  } catch {
    return null;
  }
}

export function writeIntake(intake) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(intake));
  } catch {
    /* private mode — the flow still works, it just won't survive a refresh */
  }
}

export function clearIntake() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
