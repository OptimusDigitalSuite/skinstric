import Link from "next/link";

/**
 * Placeholder landing page. The real one comes from the Figma —
 * this exists so the deploy is live from day one.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Skinstric [ intro ]</p>
      <h1 className="text-4xl leading-tight font-semibold">
        Sophisticated skincare
      </h1>
      <p className="max-w-prose text-neutral-600">
        Scaffold only — the build starts when the design file lands. Both Skinstric endpoints are
        already wired in <code className="rounded bg-neutral-100 px-1">src/lib/skinstric.js</code>.
      </p>
      <Link
        href="/testing"
        className="w-fit rounded-full border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900"
      >
        Take the test
      </Link>
    </main>
  );
}
