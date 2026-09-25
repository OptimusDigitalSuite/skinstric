/**
 * The signature motion of the design: three concentric dotted squares turned
 * 45° into diamonds, each rotating slowly at its own pace (the middle one
 * against the others). Purely decorative, so it's hidden from screen readers
 * and never takes clicks.
 *
 * `size` is the outer diamond's side in px; it shrinks to fit narrow or short screens.
 */
const RINGS = ["outer", "middle", "inner"];

/**
 * `size`: a number (px, capped to fit the viewport) or any CSS width.
 * `spread`: each ring's scale; the 005 targets pack them tighter than 002.
 */
export default function Diamonds({ size = 480, spread = [1, 0.87, 0.74], className = "" }) {
  // A 45° square is √2 taller than its side, so cap by height as well as width
  const width = typeof size === "number" ? `min(${size}px, 78vw, 55dvh)` : size;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{ width, aspectRatio: "1 / 1" }}
    >
      {RINGS.map((ring, i) => (
        <span
          key={ring}
          className={`diamond-ring diamond-ring--${ring} absolute inset-0 m-auto`}
          style={{ width: `${spread[i] * 100}%`, height: `${spread[i] * 100}%` }}
        />
      ))}
    </div>
  );
}
