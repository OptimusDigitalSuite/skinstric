"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { readIntake } from "@/lib/session";

/**
 * "To start analysis" — camera or gallery.
 *
 * Next screen to build, once the Figma lands. For now it proves the routing
 * and reads the intake back from storage, so a refresh or a pasted link
 * still works.
 */
export default function Select() {
  const router = useRouter();
  const [intake, setIntake] = useState(null);

  useEffect(() => {
    const stored = readIntake();
    // Nobody should land here without completing the intake first.
    if (!stored) router.replace("/testing");
    else setIntake(stored);
  }, [router]);

  if (!intake) return null;

  return (
    <Shell section="ANALYSIS">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-10 text-xs uppercase tracking-[0.2em] text-neutral-500">
          To start analysis
        </p>

        <div className="grid gap-10 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-lg border border-dashed border-neutral-300 px-6 py-14 text-xs uppercase tracking-[0.18em] hover:border-neutral-900"
          >
            Allow A.I.
            <br />
            to scan your face
          </button>
          <button
            type="button"
            className="rounded-lg border border-dashed border-neutral-300 px-6 py-14 text-xs uppercase tracking-[0.18em] hover:border-neutral-900"
          >
            Allow A.I.
            <br />
            access gallery
          </button>
        </div>

        <p className="mt-10 text-sm text-neutral-500">
          Hello {intake.name} from {intake.location}.
        </p>
      </div>
    </Shell>
  );
}
