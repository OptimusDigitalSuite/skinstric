"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Diamonds from "@/components/Diamonds";
import Shell from "@/components/Shell";
import { readAnalysis } from "@/lib/session";

/**
 * Frame 012, the A.I. analysis hub: four diamond tiles in a diamond.
 *
 * Only DEMOGRAPHICS has data — the API returns race, age and gender and
 * nothing else — so the other three are shown as coming soon rather than as
 * links to empty screens. A 2×2 grid turned 45° gives the layout: top-left
 * cell becomes the top tile, top-right the right, bottom-left the left.
 */
const TILES = [
  { key: "demographics", label: "Demographics", href: "/analysis/demographics" },
  { key: "cosmetic", label: "Cosmetic concerns" },
  { key: "skin", label: "Skin type details" },
  { key: "weather", label: "Weather" },
];

export default function Analysis() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Refresh-safe, and nobody reaches the hub without a photo analysed.
    if (!readAnalysis()) router.replace("/select");
    else setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <Shell
      section="ANALYSIS"
      showCode={false}
      back={{ href: "/select" }}
      proceed={{ href: "/analysis/demographics", children: "Get summary" }}
    >
      <div className="absolute top-2 left-6 md:left-8">
        <h1 className="text-xs font-semibold tracking-[0.08em] uppercase">A. I. Analysis</h1>
        <p className="mt-2 text-[11px] leading-5 tracking-[0.02em] uppercase">
          A. I. has estimated the following.
          <br />
          Fix estimated information if needed.
        </p>
      </div>

      <Diamonds size={537} spread={[1, 0.89, 0.79]} className="diamonds--calm hub-rings" />

      <nav aria-label="Analysis sections" className="hub">
        {TILES.map(({ key, label, href }, i) =>
          href ? (
            <Link key={key} href={href} className="hub__tile" style={{ "--i": i }}>
              <span>{label}</span>
            </Link>
          ) : (
            <span key={key} className="hub__tile hub__tile--soon" aria-disabled="true" style={{ "--i": i }}>
              <span>
                {label}
                <small>Coming soon</small>
              </span>
            </span>
          ),
        )}
      </nav>
    </Shell>
  );
}
