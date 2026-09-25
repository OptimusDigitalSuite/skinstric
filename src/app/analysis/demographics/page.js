"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfidenceRing from "@/components/ConfidenceRing";
import DiamondButton from "@/components/DiamondButton";
import Shell from "@/components/Shell";
import { GROUPS, aiPicks, display, options } from "@/lib/demographics";
import { readAnalysis, readConfirmed, writeConfirmed } from "@/lib/session";

/**
 * Frames 013 (race) and 014 (age): the centrepiece.
 *
 * Left rail: the three groups with the current pick under each. Centre: the
 * selected pick and a ring of its confidence. Right: every option in the group,
 * which is how the visitor corrects the A.I. RESET goes back to the A.I.'s
 * picks; CONFIRM saves the visitor's, so a refresh keeps them.
 */
export default function Demographics() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [group, setGroup] = useState("race");
  const [picks, setPicks] = useState({});
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    const data = readAnalysis();
    if (!data) {
      router.replace("/select");
      return;
    }
    const confirmed = readConfirmed();
    setAnalysis(data);
    setPicks(confirmed ?? aiPicks(data));
    setSaved(confirmed);
  }, [router]);

  const list = useMemo(() => options(group, analysis?.[group]), [group, analysis]);

  if (!analysis) return null;

  const groupIndex = GROUPS.findIndex((g) => g.key === group);
  const groupLabel = GROUPS[groupIndex].label;
  const selected = list.find((o) => o.key === picks[group]) ?? list[0];
  const isSaved = saved && GROUPS.every(({ key }) => saved[key] === picks[key]);
  const isAiPicks = GROUPS.every(({ key }) => aiPicks(analysis)[key] === picks[key]);

  const choose = (key) => setPicks((p) => ({ ...p, [group]: key }));
  const step = (delta) => setGroup(GROUPS[(groupIndex + delta + GROUPS.length) % GROUPS.length].key);

  function confirm() {
    writeConfirmed(picks);
    setSaved(picks);
  }

  return (
    <Shell
      section="ANALYSIS"
      showCode={false}
      scroll
      footer={
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4">
          <DiamondButton direction="back" href="/analysis" />
          <p className="hidden text-center text-xs text-neutral-400 md:block">
            If A.I. estimate is wrong, select the correct one.
          </p>
          <div className="flex gap-2 justify-self-end">
            <button
              type="button"
              onClick={() => setPicks(aiPicks(analysis))}
              disabled={isAiPicks}
              className="border border-neutral-900 px-4 py-2 text-[10px] font-semibold tracking-[0.08em] uppercase transition-opacity hover:bg-neutral-900 hover:text-[#fcfcfc] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={confirm}
              className="min-w-[6.5rem] bg-neutral-900 px-4 py-2 text-[10px] font-semibold tracking-[0.08em] text-[#fcfcfc] uppercase transition-opacity hover:opacity-80"
            >
              {isSaved ? "Confirmed ✓" : "Confirm"}
            </button>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {isSaved ? "Your answers are saved." : ""}
          </p>
        </div>
      }
    >
      <div className="demo">
        <header className="demo__title">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase">A. I. Analysis</p>
          <div className="flex items-start gap-4">
            <h1 className="demo__h1">Demographics</h1>
            <div className="mt-1 flex gap-1" aria-label="Switch group">
              <button type="button" className="demo__step" onClick={() => step(-1)} aria-label="Previous group">
                <span>◀</span>
              </button>
              <button type="button" className="demo__step" onClick={() => step(1)} aria-label="Next group">
                <span>▶</span>
              </button>
            </div>
          </div>
          <p className="text-[11px] tracking-[0.02em] uppercase">Predicted race &amp; age</p>
        </header>

        {/* Left rail */}
        <div className="demo__rail" role="tablist" aria-label="Demographic groups">
          {GROUPS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={group === key}
              aria-controls="demo-panel"
              onClick={() => setGroup(key)}
              className="demo__rail-item"
            >
              <span>{picks[key] ? display(key, picks[key]).rail : "—"}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Centre */}
        <section id="demo-panel" className="demo__panel" aria-live="polite">
          <h2 className="demo__pick">{selected ? display(group, selected.key).heading : ""}</h2>
          {/* Not in the Figma, on purpose: Skinstric's test API returns simulated
              demographics, so every live visitor gets a guess that isn't them. */}
          <p className="demo__note">Demo: estimates are simulated by Skinstric&apos;s test API.</p>
          {selected && <ConfidenceRing percent={selected.percent} label={display(group, selected.key).heading} />}
        </section>

        {/* Right list */}
        <div className="demo__list">
          <div className="demo__list-head">
            <span>{groupLabel}</span>
            <span>A. I. Confidence</span>
          </div>
          <OptionList group={group} list={list} value={selected?.key} onChange={choose} />
        </div>
      </div>
    </Shell>
  );
}

/** A radio group: click to choose, or arrow keys to move and choose, as radios do. */
function OptionList({ group, list, value, onChange }) {
  const refs = useRef({});

  function onKeyDown(event, index) {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = list[(index + delta + list.length) % list.length];
    onChange(next.key);
    refs.current[next.key]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={`${group} options`} className="demo__options">
      {list.map((option, i) => {
        const checked = option.key === value;
        return (
          <button
            key={option.key}
            ref={(el) => (refs.current[option.key] = el)}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="demo__option"
          >
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className="demo__mark" />
              {display(group, option.key).list}
            </span>
            <span className="tabular-nums">{option.percent} %</span>
          </button>
        );
      })}
    </div>
  );
}
