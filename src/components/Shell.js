import Link from "next/link";
import DiamondButton from "@/components/DiamondButton";

/**
 * The frame every screen sits in, per the Figma: SKINSTRIC and a bracketed
 * section label top-left, ENTER CODE top-right (some frames drop it), an
 * optional eyebrow such as TO START ANALYSIS, BACK bottom-left and PROCEED
 * bottom-right. `back` / `proceed` take DiamondButton props (or null to hide);
 * `footer` replaces the whole bottom bar when a screen needs something custom.
 */
export default function Shell({
  section = "INTRO",
  eyebrow = null,
  showCode = true,
  children,
  back = { href: "/" },
  proceed = null,
  footer,
  scroll = false, // content taller than a phone screen (demographics) scrolls instead of clipping
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex min-h-[4.75rem] items-center justify-between px-6 py-5 md:px-8">
        <p className="text-sm leading-none font-semibold tracking-tight uppercase">
          <Link href="/" className="hover:opacity-70">
            Skinstric
          </Link>
          <span className="ml-3 font-normal text-neutral-500">[ {section} ]</span>
        </p>
        {showCode && (
          <button
            type="button"
            className="bg-neutral-900 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#fcfcfc] uppercase transition-opacity hover:opacity-80"
          >
            Enter code
          </button>
        )}
      </header>

      <main
        className={`relative flex flex-1 flex-col items-center px-6 ${scroll ? "justify-start" : "justify-center overflow-hidden"}`}
      >
        {eyebrow && (
          <p className="absolute top-2 left-6 text-xs font-semibold tracking-[0.08em] uppercase md:left-8">{eyebrow}</p>
        )}
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
