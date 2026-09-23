/**
 * The two Skinstric endpoints, wrapped.
 *
 * Verified live 2026-09-23. NOTE: the real responses differ from the brief deck —
 * phase one answers {success, message}, not {"SUCCUSS": "..."} — so read `success`
 * and fall back to the old key rather than trusting either one.
 *
 * Phase two's demographics are RANDOMIZED / SIMULATED by Skinstric's own brief.
 * Never present them as real predictions.
 */

const BASE = "https://us-central1-api-skinstric-ai.cloudfunctions.net";
const TIMEOUT_MS = 15000;

async function post(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    // The API answers 200 for almost everything, so never trust the status alone.
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Skinstric ${path} returned non-JSON (${res.status})`);
    }
    if (!res.ok) throw new Error(json?.message || `Skinstric ${path} failed (${res.status})`);
    return json;
  } catch (err) {
    if (err.name === "AbortError") throw new Error(`Skinstric ${path} timed out`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** Level 1 — register the visitor. Returns the message Skinstric echoes back. */
export async function submitIntake({ name, location }) {
  if (!name?.trim() || !location?.trim()) throw new Error("Name and location are both required");
  const json = await post("skinstricPhaseOne", { name: name.trim(), location: location.trim() });
  const ok = json?.success === true || typeof json?.SUCCUSS === "string";
  if (!ok) throw new Error(json?.message || "Skinstric did not accept that");
  return json.message ?? json.SUCCUSS;
}

/** Level 2 — send the photo. `image` is base64 WITHOUT the data: prefix. */
export async function analyzeImage(image) {
  if (typeof image !== "string" || image.length < 100) throw new Error("No image to analyse");
  const json = await post("skinstricPhaseTwo", { image });
  const data = json?.data;
  if (!data || typeof data !== "object") throw new Error("Skinstric returned no demographics");
  return data;
}

/** Highest-scoring key in a confidence map, e.g. {"white":0.73,...} -> {label, confidence}. */
export function topPrediction(scores) {
  if (!scores || typeof scores !== "object") return null;
  const entries = Object.entries(scores).filter(([, v]) => typeof v === "number");
  if (!entries.length) return null;
  const [label, confidence] = entries.reduce((best, cur) => (cur[1] > best[1] ? cur : best));
  return { label, confidence };
}

/** Every option, highest first — for the "correct the A.I." list. */
export function ranked(scores) {
  if (!scores || typeof scores !== "object") return [];
  return Object.entries(scores)
    .filter(([, v]) => typeof v === "number")
    .sort((a, b) => b[1] - a[1])
    .map(([label, confidence]) => ({ label, confidence }));
}

/** A File from camera or gallery -> base64 with the data: prefix stripped. */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image"));
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma === -1 ? result : result.slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });
}
