# Skinstric

A front-end build of Skinstric's A.I. skin-analysis flow. A visitor enters their name and city,
takes or uploads a face photo, and gets the A.I.'s race, age and sex estimates, each with a
confidence score they can review and correct.

Built during the Frontend Simplified (FES) Module 13 virtual internship from the program's Figma
design and API brief. All 14 Figma frames are implemented, and the build was approved by the program.

**Live:** https://skinstric-flame.vercel.app

## Features

- **Two-step API flow**: name and city go to phase one, then the photo goes to phase two, which
  returns demographic confidence scores (`src/lib/skinstric.js`). Requests time out and show
  clear errors.
- **Camera or gallery upload**: live camera with a mirrored selfie preview, retake/proceed, and
  Space or Enter to take the picture. The camera is released as soon as the photo is taken.
  Blocked or missing cameras get a message with a "try again" and an upload fallback.
- **Drag and drop** a photo onto the gallery target. Wrong file types, files that are too large
  and HEIC photos a browser can't decode each get their own error message.
- **In-browser image resizing**: photos are redrawn to at most 1024px on the long edge and
  re-encoded as JPEG before upload, with EXIF rotation respected (`src/lib/image.js`).
- **Demographics screen**: animated confidence ring, and the options list is a real radio group
  (arrow keys move and select) so the visitor can correct the A.I.'s pick and confirm it.
- **Refresh-safe**: progress is kept in `sessionStorage`, so every route survives a refresh or a
  pasted link and sends the visitor back a step if something it needs is missing.
- **Accessibility**: every hover state also works on keyboard focus, focus is always visible,
  status changes are announced to screen readers, and `prefers-reduced-motion` is respected.
- **Responsive**: every screen has a phone layout.

The phase-two results come from Skinstric's test API, which returns simulated demographics (as
the brief describes), and the results screen says so.

## Tech stack

| Technology | Version |
|---|---|
| Next.js (App Router) | 16.2.10 |
| React / React DOM | 19.2.4 |
| Tailwind CSS (`@tailwindcss/postcss`) | 4.3.3 |
| react-icons | 5.7.0 |
| ESLint (`eslint-config-next`) | 9.39.5 (16.2.10) |
| Language | JavaScript |
| Hosting | Vercel |

All animation is plain CSS (no animation library).

**Node.js:** 20.9.0 or newer (the minimum Next.js 16 requires). Built and tested on Node 24.14.1.

## Getting started

```bash
git clone https://github.com/OptimusDigitalSuite/skinstric.git
cd skinstric
npm install
npm run dev          # http://localhost:3000
```

No environment variables are needed: the app calls Skinstric's public test API directly.

Other scripts:

```bash
npm run build        # production build
npm run lint         # ESLint
npm run check:api    # calls both live API endpoints and prints what comes back
```

The camera only works on `localhost` or HTTPS. There are no automated tests in this project.

## Project structure

```
src/app/              one folder per route (/, /testing, /select, /camera, /analysis, /analysis/demographics)
src/components/       Shell, Diamonds, DiamondButton, ConfidenceRing, Preview, Preparing, icons
src/lib/skinstric.js  the two API calls
src/lib/image.js      file or camera frame -> upload-ready JPEG
src/lib/session.js    refresh-safe visitor state
docs/design-spec.md   the Figma, read frame by frame
```
