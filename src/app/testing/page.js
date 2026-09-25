"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Diamonds from "@/components/Diamonds";
import Shell from "@/components/Shell";
import { submitIntake } from "@/lib/skinstric";
import { writeIntake } from "@/lib/session";

const STEPS = [
  { key: "name", label: "Introduce Yourself" },
  { key: "location", label: "Where are you from?" },
];

export default function Testing() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: "", location: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const current = STEPS[step];
  const value = values[current.key];
  const isLast = step === STEPS.length - 1;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmed = value.trim();
    if (!trimmed) {
      setError(`Please enter your ${current.key === "name" ? "name" : "city"}.`);
      return;
    }

    if (!isLast) {
      setStep(step + 1);
      return;
    }

    const intake = { name: values.name.trim(), location: trimmed };
    setSending(true);
    try {
      await submitIntake(intake);
      writeIntake(intake);
      router.push("/select");
    } catch (err) {
      // Never strand the visitor on a spinner — say what happened and let them retry.
      setError(err.message || "Could not reach Skinstric. Please try again.");
      setSending(false);
    }
  }

  function handleBack() {
    setError("");
    if (step === 0) router.push("/");
    else setStep(step - 1);
  }

  return (
    <Shell
      section="INTRO"
      back={{ onClick: handleBack, disabled: sending }}
      // Frame 505: PROCEED only appears once there's something to submit.
      proceed={
        value.trim() && !sending
          ? { type: "submit", form: "intake", children: isLast ? "Proceed" : "Next" }
          : null
      }
    >
      <p className="absolute top-2 left-6 text-xs font-semibold tracking-[0.08em] uppercase md:left-8">
        To start analysis
      </p>

      <Diamonds size={480} />

      <form id="intake" onSubmit={handleSubmit} className="relative w-full max-w-xl text-center">
        <p className="mb-2 text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
          {sending ? "Processing submission" : "Click to type"}
        </p>

        <label htmlFor={current.key} className="sr-only">
          {current.label}
        </label>
        <input
          // A fresh input per step, so autoFocus fires again on "Where are you from?"
          key={current.key}
          id={current.key}
          name={current.key}
          value={value}
          autoFocus
          autoComplete={current.key === "name" ? "name" : "address-level2"}
          disabled={sending}
          onChange={(e) => setValues({ ...values, [current.key]: e.target.value })}
          placeholder={current.label}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "intake-error" : undefined}
          className="w-full border-b border-neutral-900 bg-transparent pb-1 text-center text-4xl font-light tracking-[-0.04em] outline-none placeholder:text-neutral-900 disabled:opacity-50 sm:text-5xl md:text-6xl"
        />

        {/* aria-live so a screen reader hears the failure without moving focus */}
        <p id="intake-error" role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-red-600">
          {error}
        </p>
      </form>
    </Shell>
  );
}
