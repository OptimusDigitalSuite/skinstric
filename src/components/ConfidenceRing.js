"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The big circle from frames 013/014: a thin grey track, a dark arc for the
 * confidence, and the number in the middle. When the value changes, the arc
 * sweeps and the number counts to it together (instantly under reduced motion).
 */
const DURATION = 900;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function useCountTo(target) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = from.current;
    if (reduce || start === target) {
      from.current = target;
      setValue(target);
      return;
    }
    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / DURATION);
      const v = Math.round(start + (target - start) * easeOut(t));
      from.current = v;
      setValue(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

export default function ConfidenceRing({ percent, label }) {
  const shown = useCountTo(percent);

  return (
    <div className="conf-ring" role="img" aria-label={`${label}: ${percent}% A.I. confidence`}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="98" pathLength="100" className="conf-ring__track" />
        <circle
          cx="100"
          cy="100"
          r="98"
          pathLength="100"
          className="conf-ring__arc"
          style={{ strokeDashoffset: 100 - shown }}
        />
      </svg>
      <p className="conf-ring__value" aria-hidden="true">
        <span>
          {shown}
          <sup>%</sup>
        </span>
      </p>
    </div>
  );
}
