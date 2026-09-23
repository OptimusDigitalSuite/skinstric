"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Shell from "@/components/Shell";
import { submitIntake } from "@/lib/skinstric";
import { writeIntake } from "@/lib/session";

const STEPS = [
  { key: "name", label: "Introduce yourself", placeholder: "Your name" },
  { key: "location", label: "Where are you from?", placeholder: "Your city name" },
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
      footer={
        <>
          <button
            type="button"
            onClick={handleBack}
            disabled={sending}
            className="uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 disabled:opacity-40"
          >
            ◀ Back
          </button>
          <button
            type="submit"
            form="intake"
            disabled={sending || !value.trim()}
            className="uppercase tracking-[0.18em] text-neutral-900 disabled:text-neutral-300"
          >
            {sending ? "Processing…" : isLast ? "Proceed ▶" : "Next ▶"}
          </button>
        </>
      }
    >
      <form id="intake" onSubmit={handleSubmit} className="w-full max-w-lg text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Click to type
        </p>

        <label htmlFor={current.key} className="sr-only">
          {current.label}
        </label>
        <input
          id={current.key}
          name={current.key}
          value={value}
          autoFocus
          autoComplete={current.key === "name" ? "name" : "address-level2"}
          disabled={sending}
          onChange={(e) => setValues({ ...values, [current.key]: e.target.value })}
          placeholder={current.placeholder}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "intake-error" : undefined}
          className="w-full border-b border-neutral-900 bg-transparent pb-2 text-center text-4xl font-light tracking-wide outline-none placeholder:text-neutral-300 disabled:opacity-50"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-400">
          {current.label}
        </p>

        {/* aria-live so a screen reader hears the failure without moving focus */}
        <p id="intake-error" role="status" aria-live="polite" className="mt-6 min-h-5 text-sm text-red-600">
          {error}
        </p>

        {sending && (
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Processing submission
          </p>
        )}
      </form>
    </Shell>
  );
}
