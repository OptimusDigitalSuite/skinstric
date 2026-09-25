/**
 * The signature motion of the design: three concentric dotted squares turned
 * 45° into diamonds, each rotating slowly at its own pace (the middle one
 * against the others). Purely decorative, so it's hidden from screen readers
 * and never takes clicks.
 *
 * `size` is the outer diamond's side in px; it shrinks to fit narrow or short screens.
 */
const RINGS = [
  { scale: 1, className: "diamond-ring diamond-ring--outer" },
  { scale: 0.87, className: "diamond-ring diamond-ring--middle" },
  { scale: 0.74, className: "diamond-ring diamond-ring--inner" },
];

export default function Diamonds({ size = 480, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
      // A 45° square is √2 taller than its side, so cap by height as well as width
      style={{ width: `min(${size}px, 78vw, 55dvh)`, aspectRatio: "1 / 1" }}
    >
      {RINGS.map(({ scale, className: ring }) => (
        <span
          key={ring}
          className={`absolute inset-0 m-auto ${ring}`}
          style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
        />
      ))}
    </div>
  );
}
