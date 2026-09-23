import Link from "next/link";

/**
 * The frame every screen sits in: the wordmark and section label top-left,
 * ENTER CODE top-right, and a slot along the bottom for BACK / PROCEED.
 * Deliberately plain — the Figma decides how this actually looks.
 */
export default function Shell({ section = "INTRO", children, footer = null }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5 text-xs tracking-[0.18em] uppercase">
        <p className="font-semibold">
          Skinstric <span className="ml-2 font-normal text-neutral-500">[ {section} ]</span>
        </p>
        <button
          type="button"
          className="border border-neutral-900 px-3 py-1.5 text-[10px] tracking-[0.18em] hover:bg-neutral-900 hover:text-white"
        >
          Enter code
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">{children}</main>

      <footer className="flex items-center justify-between px-6 py-6 text-xs tracking-[0.18em] uppercase">
        {footer ?? (
          <Link href="/" className="text-neutral-500 hover:text-neutral-900">
            ◀ Back
          </Link>
        )}
      </footer>
    </div>
  );
}
