import Diamonds from "@/components/Diamonds";

/**
 * Frame 011: nothing but the diamonds and one line of status. The rings spin
 * faster here than anywhere else, so the wait reads as work happening.
 */
export default function Preparing({ label = "Preparing your analysis" }) {
  return (
    <>
      <Diamonds size={480} className="diamonds--busy" />
      <p role="status" aria-live="polite" className="preparing relative text-sm font-semibold tracking-[0.08em] uppercase">
        {label}
      </p>
    </>
  );
}
