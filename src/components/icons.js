/**
 * The two target icons from frame 005, redrawn as SVG so they stay crisp at
 * any size and pick up the text colour: a thin outer ring around a solid disc
 * holding a camera aperture, and the same ring around a landscape.
 */

// The classic aperture: a small hexagon in the middle, each of its edges
// extended as a blade line out to the rim. Computed once, not hand-plotted.
const HEX_R = 15;
const BLADES = Array.from({ length: 6 }, (_, i) => {
  const a = (i * Math.PI) / 3 - Math.PI / 2;
  const b = ((i + 1) * Math.PI) / 3 - Math.PI / 2;
  const [x1, y1] = [60 + HEX_R * Math.cos(a), 60 + HEX_R * Math.sin(a)];
  const [x2, y2] = [60 + HEX_R * Math.cos(b), 60 + HEX_R * Math.sin(b)];
  const len = Math.hypot(x2 - x1, y2 - y1);
  const reach = 60; // long enough to hit the rim; the clip trims it
  return { x1, y1, x2: x1 + ((x2 - x1) / len) * reach, y2: y1 + ((y2 - y1) / len) * reach };
});

export function ApertureIcon(props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="aperture-disc">
          <circle cx="60" cy="60" r="40" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="50" fill="currentColor" />
      <circle cx="60" cy="60" r="44" fill="#fcfcfc" />
      <circle cx="60" cy="60" r="40" fill="currentColor" />
      <g clipPath="url(#aperture-disc)" stroke="#fcfcfc" strokeWidth="3.5">
        {BLADES.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>
    </svg>
  );
}

export function GalleryIcon(props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" {...props}>
      <defs>
        <clipPath id="gallery-disc">
          <circle cx="60" cy="60" r="50" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4" />
      <g clipPath="url(#gallery-disc)" fill="currentColor">
        <circle cx="76" cy="44" r="10" />
        <path d="M0 78 C 20 60, 36 58, 52 72 S 86 66, 120 50 V 120 H 0 Z" />
      </g>
    </svg>
  );
}
