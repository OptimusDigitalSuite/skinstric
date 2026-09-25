# Skinstric — design spec

Read from the Figma on 2026-09-23: **https://www.figma.com/design/K43I2D7c3xgt1ZiF6lY1Yq/Skinstric**

The file has two pages. **Skinstric Internship** is the one to build — 14 frames. *Skinstric Full Project* is the wider product and is not the assignment.

**Every frame is 1920 × 960, background `#FCFCFC`** (an off-white, not pure white). Type is a light-weight grotesque, set in ALL CAPS at small sizes for labels and sentence case at display sizes.

## Recurring furniture

- **Top-left:** `SKINSTRIC` then a bracketed section label — `[ INTRO ]`, `[ ANALYSIS ]`.
- **Top-right:** a small black `ENTER CODE` button.
- **Bottom-left:** `◀ BACK` in a diamond outline. **Bottom-right:** `PROCEED ▶` when a step can advance.
- **The diamonds.** Three concentric dotted diamonds (squares rotated 45°) sit behind the centre of most screens and rotate slowly. They are the signature motion of the whole design.

## The flow, frame by frame

| # | Frame | What it is |
|---|---|---|
| 000 | Landing, centred | `Sophisticated skincare` centred, dotted diamonds left and right of the words |
| 001 | Landing, resting state | Same words **left-aligned**, small paragraph bottom-left, single diamond right |
| 002 | **Introduce Yourself** | `CLICK TO TYPE` above a centred input, inside the rotating diamonds |
| 504 | **Where are you from?** | Same treatment, underlined input |
| 505 | City entered | e.g. `Melbourne`, and **PROCEED** appears bottom-right |
| 005 | **To start analysis** | Two diamond targets: camera (left) `ALLOW A.I. TO SCAN YOUR FACE`, gallery (right) `ALLOW A.I. ACCESS GALLERY` |
| 006 | Camera permission | Black modal over the left target: `ALLOW A.I. TO ACCESS YOUR CAMERA`, deny/allow |
| 007 | `SETTING UP CAMERA…` | Diamond + camera icon while the stream starts |
| 009 | Live camera | Full-bleed video, shutter button right, caption: neutral expression, frontal pose, adequate lighting |
| 010 | Captured | The still, with **BACK** and **PROCEED** |
| 011 | `PREPARING YOUR ANALYSIS…` | Rotating diamonds, nothing else |
| 012 | **A.I. ANALYSIS** hub | Four diamond quadrants: `DEMOGRAPHICS`, `SKIN TYPE DETAILS`, `COSMETIC CONCERNS`, `WEATHER`. `GET SUMMARY` bottom-right |
| 013 | **Demographics — race** | Big `DEMOGRAPHICS` title, left rail (RACE / AGE / SEX with current picks), centre **percentage ring** at `96%`, right list of every option with its confidence, `RESET` / `CONFIRM` |
| 014 | **Demographics — age** | Same screen, AGE selected, e.g. `20-29 y.o.` |

### The demographics screen (013 / 014) is the one with real weight

Three parts, all driven by the same API response:

1. **Left rail** — the three groups (`RACE`, `AGE`, `SEX`) with the current top pick under each. Selecting one changes the centre and the right list.
2. **Centre** — the selected label as a heading, and a large circle showing the confidence of the top value.
3. **Right list** — every option in that group with its percentage, highest first, the current one highlighted. This is the "correct the A.I." control, so the user can pick a different value.

`src/lib/skinstric.js` already returns exactly this: `topPrediction(scores)` for the centre, `ranked(scores)` for the right list.

> Only three of the four hub quadrants have data. The API returns **race, age and gender**; `SKIN TYPE DETAILS`, `COSMETIC CONCERNS` and `WEATHER` have no source, which matches the real site showing them as coming soon.

## Build order

1. ~~Intake: name → city → phase one~~ (built and restyled to 002 / 504 / 505, commit `1778394`)
2. ~~The shell: wordmark, section label, ENTER CODE, BACK/PROCEED, and the rotating diamonds~~ (`Shell`, `Diamonds`, `DiamondButton`)
3. Landing (000 / 001)
4. Analysis choice (005) + gallery upload, which needs no camera permission
5. Camera (006 / 007 / 009 / 010)
6. Loading (011) and the hub (012)
7. Demographics (013 / 014) — the centrepiece
