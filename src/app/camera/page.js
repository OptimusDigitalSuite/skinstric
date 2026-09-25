"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import DiamondButton from "@/components/DiamondButton";
import Diamonds from "@/components/Diamonds";
import Preparing from "@/components/Preparing";
import Shell from "@/components/Shell";
import { ApertureIcon, CameraGlyph } from "@/components/icons";
import { runAnalysis } from "@/lib/analyse";
import { toUpload } from "@/lib/image";
import { readIntake } from "@/lib/session";

/**
 * Frames 007 (setting up), 009 (live), 010 (captured), then 011 (preparing).
 *
 * The preview is mirrored like any selfie camera, and the capture is mirrored
 * to match, so the saved photo is the one the visitor saw. The camera is
 * released the moment a picture is taken (the light goes off) and re-opened on
 * retake. Space or Enter takes the picture.
 */
const MIN_SETUP_MS = 900; // let frame 007 read as a step, not a flicker

const TIPS = ["Neutral expression", "Frontal pose", "Adequate lighting"];

function describeCameraError(err) {
  if (!navigator.mediaDevices?.getUserMedia || err?.name === "NotSupportedError") {
    return "This browser can't open a camera here. Upload a photo instead.";
  }
  switch (err?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Camera access is blocked. Allow it from the camera icon in the address bar, or upload a photo instead.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "No camera was found on this device. Upload a photo instead.";
    case "NotReadableError":
      return "Another app is using the camera. Close it and try again, or upload a photo instead.";
    default:
      return "The camera couldn't start. Try again, or upload a photo instead.";
  }
}

export default function Camera() {
  const router = useRouter();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [mode, setMode] = useState("starting"); // starting | live | captured | preparing | error
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  // Each start gets an id; stop() bumps it. A camera that finishes opening after
  // the visitor has left (or after a second start) is closed at once instead of
  // being left running with its light on.
  const runRef = useRef(0);

  const stop = useCallback(() => {
    runRef.current += 1;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    stop();
    const run = runRef.current;
    setMode("starting");
    setError("");
    const t0 = performance.now();
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      if (run !== runRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      const left = MIN_SETUP_MS - (performance.now() - t0);
      if (left > 0) await new Promise((r) => setTimeout(r, left));
      if (run === runRef.current) setMode("live");
    } catch (err) {
      if (run !== runRef.current) return;
      stop();
      setError(describeCameraError(err));
      setMode("error");
    }
  }, [stop]);

  useEffect(() => {
    if (!readIntake()) {
      router.replace("/testing");
      return;
    }
    start();
    return stop; // never leave the camera on when leaving the page
  }, [router, start, stop]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    setPhoto(toUpload(video, video.videoWidth, video.videoHeight, { mirror: true }));
    setFlash(true);
    stop();
    setMode("captured");
  }, [stop]);

  // Space / Enter takes the picture while the camera is live.
  useEffect(() => {
    if (mode !== "live") return;
    const onKey = (e) => {
      if ((e.key === " " || e.key === "Enter") && !e.target.closest?.("a, button")) {
        e.preventDefault();
        capture();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, capture]);

  async function proceed() {
    setMode("preparing");
    try {
      await runAnalysis(photo);
      router.push("/analysis");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setMode("captured");
    }
  }

  function retake() {
    setPhoto(null);
    start();
  }

  if (mode === "preparing") {
    return (
      <Shell section="ANALYSIS" showCode={false} back={null}>
        <Preparing />
      </Shell>
    );
  }

  if (mode === "error") {
    return (
      <Shell section="ANALYSIS" showCode={false} back={{ href: "/select" }}>
        <Diamonds size={480} />
        <div className="relative max-w-sm text-center">
          <ApertureIcon className="mx-auto mb-6 h-20 w-20 opacity-40" />
          <p role="alert" className="text-sm leading-6">
            {error}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={start}
              className="border border-neutral-900 px-4 py-2 text-[10px] font-semibold tracking-[0.08em] uppercase hover:bg-neutral-900 hover:text-[#fcfcfc]"
            >
              Try again
            </button>
            <Link
              href="/select"
              className="bg-neutral-900 px-4 py-2 text-[10px] font-semibold tracking-[0.08em] text-[#fcfcfc] uppercase hover:opacity-80"
            >
              Upload a photo
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const captured = mode === "captured";

  return (
    <div className="camera">
      {/* The live preview stays mounted so the stream has somewhere to go during 007 */}
      <video ref={videoRef} className="camera__media camera__media--mirror" playsInline muted aria-hidden="true" />
      {captured && photo && (
        // eslint-disable-next-line @next/next/no-img-element -- a local data: URL, nothing for next/image to optimise
        <img src={photo.dataUrl} alt="The photo you just took" className="camera__media" />
      )}
      {flash && <div className="camera__flash" onAnimationEnd={() => setFlash(false)} />}

      <header className="camera__header">
        <p className="text-sm leading-none font-semibold tracking-tight uppercase">
          <Link href="/">Skinstric</Link>
          <span className="ml-3 font-normal opacity-70">[ Analysis ]</span>
        </p>
      </header>

      {captured && (
        <p className="camera__great" role="status">
          Great shot!
        </p>
      )}

      {mode === "live" && (
        <button type="button" onClick={capture} className="camera__shutter" aria-label="Take picture">
          <span className="camera__shutter-label">Take picture</span>
          <span className="camera__shutter-button">
            <CameraGlyph className="h-6 w-6" />
          </span>
        </button>
      )}

      <footer className="camera__footer">
        <div className="camera__corner">
          {captured ? (
            <DiamondButton direction="back" onClick={retake} className="diamond-btn--light">
              Back
            </DiamondButton>
          ) : (
            <DiamondButton direction="back" href="/select" className="diamond-btn--light">
              <span className="sr-only">Back</span>
            </DiamondButton>
          )}
        </div>
        <Tips />
        <div className="camera__corner justify-end">
          {captured && (
            <DiamondButton direction="proceed" onClick={proceed} className="diamond-btn--light">
              Proceed
            </DiamondButton>
          )}
        </div>
      </footer>

      {error && captured && (
        <p role="alert" className="camera__error">
          {error}
        </p>
      )}

      {/* Frame 007 sits over everything until the first frames arrive */}
      {mode === "starting" && (
        <div className="camera__setup">
          <Diamonds size={400} />
          <div className="relative flex flex-col items-center gap-4">
            <ApertureIcon className="h-24 w-24" />
            <p role="status" className="preparing text-xs font-semibold tracking-[0.08em] uppercase">
              Setting up camera
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-8">
            <Tips />
          </div>
        </div>
      )}
    </div>
  );
}

function Tips() {
  return (
    <div className="camera__tips">
      <p>To get better results make sure to have</p>
      <ul>
        {TIPS.map((tip) => (
          <li key={tip}>
            <span aria-hidden="true" className="demo__mark" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
