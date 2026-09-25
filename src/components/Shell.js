import Link from "next/link";
import DiamondButton from "@/components/DiamondButton";

/**
 * The frame every screen sits in, per the Figma: SKINSTRIC and a bracketed
 * section label top-left, ENTER CODE top-right, BACK bottom-left and PROCEED
 * bottom-right. `back` / `proceed` take DiamondButton props (or null to hide);
 * `footer` replaces the whole bottom bar when a screen needs something custom.
 */
export default function Shell({
  section = "INTRO",
  children,
  back = { href: "/" },
  proceed = null,
  footer,
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-8">
        <p className="text-sm leading-none font-semibold tracking-tight uppercase">
          <Link href="/" className="hover:opacity-70">
            Skinstric
          </Link>
          <span className="ml-3 font-normal text-neutral-500">[ {section} ]</span>
        </p>
        <button
          type="button"
          className="bg-neutral-900 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#fcfcfc] uppercase transition-opacity hover:opacity-80"
        >
          Enter code
        </button>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6">
        {children}
      </main>

      <footer className="flex min-h-24 items-center justify-between px-6 py-6 md:px-8">
        {footer !== undefined ? (
          footer
        ) : (
          <>
            {back ? <DiamondButton direction="back" {...back} /> : <span />}
            {proceed ? <DiamondButton direction="proceed" {...proceed} /> : <span />}
          </>
        )}
      </footer>
    </div>
  );
}
