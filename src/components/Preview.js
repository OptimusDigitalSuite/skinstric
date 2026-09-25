/**
 * The PREVIEW box from the walkthrough of the analysis-choice screen (it's in
 * the live Skinstric site, not in frame 005): top-right, a label over a small
 * square that shows the photo being analysed, or stays empty until there is one.
 */
export default function Preview({ src }) {
  return (
    <figure className="preview" aria-label="Preview">
      <figcaption className="preview__label">Preview</figcaption>
      <div className="preview__frame">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- a local data: URL, nothing for next/image to optimise
          <img src={src} alt="The photo being analysed" className="preview__img" />
        ) : null}
      </div>
    </figure>
  );
}
