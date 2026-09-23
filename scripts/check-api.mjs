/**
 * Hits both Skinstric endpoints and prints what they actually return.
 * No dependencies — runs before `npm install`:  node scripts/check-api.mjs
 */
const BASE = "https://us-central1-api-skinstric-ai.cloudfunctions.net";

async function call(path, body) {
  const started = Date.now();
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, ms: Date.now() - started, json };
}

function top(scores) {
  const [label, value] = Object.entries(scores).reduce((b, c) => (c[1] > b[1] ? c : b));
  return `${label} ${(value * 100).toFixed(1)}%`;
}

const one = await call("skinstricPhaseOne", { name: "Test User", location: "Minneapolis" });
console.log(`phaseOne  ${one.status}  ${one.ms}ms  ->`, JSON.stringify(one.json));

// A 1x1 transparent PNG, base64, no data: prefix.
const PIXEL =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const two = await call("skinstricPhaseTwo", { image: PIXEL });
console.log(`phaseTwo  ${two.status}  ${two.ms}ms`);
const data = two.json?.data;
if (data) {
  for (const [group, scores] of Object.entries(data)) {
    if (scores && typeof scores === "object") console.log(`  ${group.padEnd(8)} top: ${top(scores)}`);
  }
  console.log("  groups:", Object.keys(data).join(", "));
} else {
  console.log("  no data returned:", JSON.stringify(two.json)?.slice(0, 200));
}
