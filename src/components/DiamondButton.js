import Link from "next/link";

/**
 * BACK / PROCEED: a small outlined diamond holding a triangle, with the label
 * beside it (label on the outside edge, so BACK reads "◀ BACK" and PROCEED
 * reads "PROCEED ▶"). Renders a Link when given `href`, otherwise a button, so
 * it can also submit a form via `type="submit" form="…"`.
 */
export default function DiamondButton({ direction = "back", href, children, className = "", ...props }) {
  const isBack = direction === "back";
  const label = children ?? (isBack ? "Back" : "Proceed");

  const content = (
    <>
      <span className="diamond-btn__icon" aria-hidden="true">
        <span className="diamond-btn__arrow">{isBack ? "◀" : "▶"}</span>
      </span>
      <span>{label}</span>
    </>
  );

  const classes = `diamond-btn ${isBack ? "" : "flex-row-reverse"} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
