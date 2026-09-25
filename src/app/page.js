"use client";

import { useState } from "react";
import DiamondButton from "@/components/DiamondButton";
import Shell from "@/components/Shell";

/**
 * Landing, Figma frames 000 (resting) and 001 (TAKE TEST hovered).
 *
 * Hovering or focusing a side slides the headline to the opposite edge, fades
 * the other side out and blooms that side's diamond into three rings. The
 * Figma only draws the TAKE TEST case; DISCOVER A.I. mirrors it. All of the
 * motion lives in CSS (see "Landing" in globals.css) — this component only
 * says which side has attention, via data-focus.
 */
const SIDES = [
  { key: "left", label: "Discover A.I.", direction: "back" },
  { key: "right", label: "Take test", direction: "proceed" },
];

export default function Home() {
  const [focus, setFocus] = useState("none");

  return (
    <Shell
      section="INTRO"
      footer={
        <p className="landing-blurb max-w-xs text-[11px] leading-5 tracking-[0.02em] text-neutral-900 uppercase sm:text-xs sm:leading-6">
          Skinstric developed an A.I. that creates a highly-personalised routine tailored to what your
          skin needs.
        </p>
      }
    >
      <div className="landing absolute inset-0" data-focus={focus}>
        <h1 className="landing-headline">
          <span className="landing-line">
            <span>Sophisticated</span>
          </span>
          <span className="landing-line">
            <span>skincare</span>
          </span>
        </h1>

        {SIDES.map(({ key, label, direction }) => (
          <div
            key={key}
            className={`landing-side landing-side--${key}`}
            onMouseEnter={() => setFocus(key)}
            onMouseLeave={() => setFocus("none")}
            onFocus={() => setFocus(key)}
            onBlur={() => setFocus("none")}
          >
            <span aria-hidden="true" className="landing-diamond landing-diamond--3" />
            <span aria-hidden="true" className="landing-diamond landing-diamond--2" />
            <span aria-hidden="true" className="landing-diamond" />
            <DiamondButton href="/testing" direction={direction} className="landing-cta">
              {label}
            </DiamondButton>
          </div>
        ))}
      </div>
    </Shell>
  );
}
