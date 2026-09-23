# Skinstric

FES **Module 13** virtual internship — a from-scratch build of Skinstric's A.I. skin-analysis
flow. Approved to start 2026-09-23 by Michel Mitri. Brief and screens: `identity/fes-module13-skinstric.md`.

## Stack

Next.js (App Router) · Tailwind v4 · deployed on Vercel. All inside the brief's allowed list
(React *or* Next, Tailwind *or* plain CSS, GSAP/ThreeJS optional).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run check:api    # hits both live endpoints, no install needed
```

## The two endpoints

Base: `https://us-central1-api-skinstric-ai.cloudfunctions.net`

| Level | Path | Send | Get back |
|---|---|---|---|
| 1 | `skinstricPhaseOne` | `{name, location}` | `{success:true, message:"Added … from …"}` |
| 2 | `skinstricPhaseTwo` | `{image:"<base64>"}` | `{success, message, data:{race, age, gender}}` |

**Three things the brief deck gets wrong or leaves out** (verified live 2026-09-23):

1. Phase one really answers `success` + `message`. The slide shows a `SUCCUSS` key. `src/lib/skinstric.js` accepts either.
2. Phase two returns **three** groups — `race`, `age` **and `gender`** — as confidence maps that sum to ~1.
3. Phase two does **not** validate the image. Sending the literal string `not-base64` still returns demographics, so bad input cannot be detected from the response. Validate before sending.

The demographics are **randomized / simulated** by Skinstric's own brief. Never present them as
real predictions.

## Layout

```
src/lib/skinstric.js   both API calls, top/ranked helpers, file → base64
src/app/               layout, landing page, globals.css (design tokens go here)
scripts/check-api.mjs  dependency-free endpoint check
```

## Still to come

- The Figma file (the actual spec)
- Screens: intro → name → location → camera or gallery → capture → category → summary
- The camera flow (`getUserMedia`), resize before base64, and the donut chart for scores
