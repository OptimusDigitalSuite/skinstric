# Skinstric

A from-scratch build of Skinstric's A.I. skin-analysis flow, for the Frontend Simplified
**Module 13 virtual internship**. Every one of the 14 frames in the internship Figma is built.

**Live:** https://skinstric-flame.vercel.app

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · deployed on Vercel.
No animation library: all motion is CSS, so nothing extra ships to the browser.

## The flow

| Route | Figma frames | What happens |
|---|---|---|
| `/` | 000, 001 | Landing. Hovering or focusing TAKE TEST slides the headline left and blooms the diamond; DISCOVER A.I. mirrors it |
| `/testing` | 002, 504, 505 | Name, then city → **phase one** API. PROCEED only appears once there is input |
| `/select` | 005, 006, 011 | Camera or gallery. The camera asks permission first (006); the gallery path runs straight to analysis |
| `/camera` | 007, 009, 010, 011 | Live camera, capture, retake or proceed → **phase two** API |
| `/analysis` | 012 | The A.I. analysis hub. Only Demographics has data from the API; the other three say "coming soon" |
| `/analysis/demographics` | 013, 014 | Race / age / sex: the A.I.'s pick, its confidence ring, and every option to correct it. RESET / CONFIRM |

Every route survives a refresh or a pasted link (state lives in `sessionStorage`) and sends the
visitor back a step if what it needs is missing.

## Beyond the Figma

- **Photos are downscaled in the browser** to ≤1024px JPEG before upload: an 8 MB phone photo goes up
  as ~20 KB, which is faster on mobile data and stays under the function's payload limit
  (`src/lib/image.js`)
- **Drag and drop** a photo onto the gallery target; wrong file types, oversized files and HEIC in
  browsers that can't decode it each get a plain-English error
- **Camera:** mirrored selfie preview with a matching capture, a capture flash, Space/Enter to shoot,
  and the camera is released the moment the picture is taken (the light goes off). Blocked, missing
  or busy cameras get a clear message with "try again" and "upload a photo instead"
- **Demographics:** the ring and the number count up together; the options list is a real radio
  group (arrow keys move and choose); ages read youngest to oldest while race and sex read by
  confidence; confirmed corrections persist
- **Keyboard and screen readers:** every hover state also works on focus, focus is always visible,
  status changes are announced
- **Reduced motion** is respected everywhere, and every screen has a designed phone layout
- The **Preview** box from the walkthrough (not in frame 005) shows the photo being analysed

The phase-two demographics are simulated by Skinstric's test API, per the brief, and the results
screen says so.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run check:api    # calls both live endpoints and prints what comes back
```

The camera needs `localhost` or HTTPS.

## Where things are

```
src/app/            one folder per route
src/components/     Shell (the frame every screen sits in), Diamonds, DiamondButton,
                    ConfidenceRing, Preview, Preparing, icons
src/lib/skinstric.js  the two API calls
src/lib/image.js      file / camera frame → upload-ready JPEG
src/lib/session.js    what the visitor gave us, refresh-safe
docs/design-spec.md   the Figma, read frame by frame
```
