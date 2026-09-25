"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Diamonds from "@/components/Diamonds";
import Preparing from "@/components/Preparing";
import Preview from "@/components/Preview";
import Shell from "@/components/Shell";
import { ApertureIcon, GalleryIcon } from "@/components/icons";
import { prepareFile } from "@/lib/image";
import { runAnalysis } from "@/lib/analyse";
import { readIntake, readPhoto } from "@/lib/session";

/**
 * Frames 005 (choose camera or gallery), 006 (camera permission) and 011
 * (preparing). The gallery path runs start to finish here: pick or drop a
 * photo → downscale → phase two → store → the analysis hub.
 */
export default function Select() {
  const router = useRouter();
  const fileInput = useRef(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState("choose"); // choose | camera-prompt | preparing
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Nobody should land here without completing the intake first.
    if (!readIntake()) router.replace("/testing");
    else {
      setPreview(readPhoto()); // coming back? show the last photo analysed
      setReady(true);
    }
  }, [router]);

  async function analyse(file) {
    setError("");
    setMode("preparing");
    try {
      const photo = await prepareFile(file);
      setPreview(photo.dataUrl);
      await runAnalysis(photo);
      router.push("/analysis");
    } catch (err) {
      // Never strand the visitor on the spinner: back to the choice, with the reason.
      setPreview(readPhoto());
      setError(err.message || "Something went wrong. Please try another photo.");
      setMode("choose");
    }
  }

  function onFileChosen(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // so choosing the same photo again still fires
    if (file) analyse(file);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) analyse(file);
  }

  if (!ready) return null;

  if (mode === "preparing") {
    return (
      <Shell section="INTRO" showCode={false} back={null}>
        <Preview src={preview} />
        <Preparing />
      </Shell>
    );
  }

  const prompting = mode === "camera-prompt";

  return (
    <Shell section="INTRO" eyebrow="To start analysis" showCode={false} back={{ href: "/testing" }}>
      <Preview src={preview} />
      <div className="grid w-full grid-cols-1 items-center justify-items-center gap-y-[13dvh] py-10 md:grid-cols-2">
        {/* Camera — frame 006's permission panel hangs off this target */}
        <div className="target">
          <Diamonds size="100%" spread={[1, 0.94, 0.88]} className="diamonds--calm" />
          <button
            type="button"
            className="target__button"
            onClick={() => setMode("camera-prompt")}
            aria-haspopup="dialog"
            aria-expanded={prompting}
          >
            <ApertureIcon className="target__icon" />
            <span className="callout callout--up" aria-hidden="true">
              <svg viewBox="0 0 60 60">
                <line x1="0" y1="60" x2="57" y2="3" />
                <circle cx="57" cy="3" r="2.5" />
              </svg>
            </span>
            <span className="callout-label callout-label--up">
              Allow A.I.
              <br />
              to scan your face
            </span>
          </button>
          {prompting && <CameraPrompt onDeny={() => setMode("choose")} onAllow={() => router.push("/camera")} />}
        </div>

        {/* Gallery — click, or drag a photo onto it */}
        <div
          className={`target transition-opacity duration-300 ${prompting ? "opacity-30" : ""} ${dragging ? "target--dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <Diamonds size="100%" spread={[1, 0.94, 0.88]} className="diamonds--calm" />
          <button type="button" className="target__button" onClick={() => fileInput.current?.click()} disabled={prompting}>
            <GalleryIcon className="target__icon" />
            <span className="callout callout--down" aria-hidden="true">
              <svg viewBox="0 0 60 60">
                <line x1="60" y1="0" x2="3" y2="57" />
                <circle cx="3" cy="57" r="2.5" />
              </svg>
            </span>
            <span className="callout-label callout-label--down">
              {dragging ? (
                "Drop it here"
              ) : (
                <>
                  Allow A.I.
                  <br />
                  access gallery
                </>
              )}
            </span>
          </button>
          <input ref={fileInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onFileChosen} />
        </div>
      </div>

      <p role="alert" className="absolute bottom-2 left-1/2 w-full max-w-md -translate-x-1/2 px-6 text-center text-sm text-red-600">
        {error}
      </p>
    </Shell>
  );
}

/** Frame 006. Opens with focus on ALLOW; Escape or a click outside counts as DENY. */
function CameraPrompt({ onDeny, onAllow }) {
  const allowRef = useRef(null);

  useEffect(() => {
    allowRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onDeny();
    const onPointer = (e) => !e.target.closest(".camera-prompt, .target__button") && onDeny();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [onDeny]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="camera-prompt-title" className="camera-prompt">
      <p id="camera-prompt-title" className="px-4 pt-4 pb-10 text-sm font-semibold tracking-[0.02em] uppercase">
        Allow A.I. to access your camera
      </p>
      <div className="flex justify-end gap-8 border-t border-white/60 px-4 py-2.5 text-sm font-semibold tracking-[0.02em] uppercase">
        <button type="button" onClick={onDeny} className="uppercase text-neutral-400 hover:text-white">
          Deny
        </button>
        <button ref={allowRef} type="button" onClick={onAllow} className="uppercase hover:opacity-70 focus-visible:underline">
          Allow
        </button>
      </div>
    </div>
  );
}
