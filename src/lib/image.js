/**
 * Turning a photo (from the gallery now, the camera later) into what phase two
 * wants: base64 JPEG without the data: prefix.
 *
 * Phones hand over 3–12 MB photos. Sending those raw is slow on mobile data and
 * risks the function's payload limit, and the model doesn't need 4000px to read
 * a face. So everything is redrawn to at most 1024px on the long edge and
 * re-encoded as JPEG (~100–200 KB) before it leaves the browser.
 */

const MAX_EDGE = 1024;
const QUALITY = 0.88;
const MAX_INPUT_BYTES = 20 * 1024 * 1024;

/** Draw any image source (an <img>, ImageBitmap or <video>) into an upload-ready JPEG. */
export function toUpload(source, width, height) {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
  return { dataUrl, base64: dataUrl.slice(dataUrl.indexOf(",") + 1) };
}

async function decode(file) {
  // createImageBitmap honours EXIF rotation, so portrait phone photos stay upright.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* fall through to <img>, which some browsers decode more formats with */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** A File from the gallery → { dataUrl, base64 }, with errors a person can act on. */
export async function prepareFile(file) {
  if (!file) throw new Error("No photo was selected.");
  if (!file.type.startsWith("image/")) {
    throw new Error("That file isn't a photo. Choose a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("That photo is over 20 MB. Choose a smaller one.");
  }

  let image;
  try {
    image = await decode(file);
  } catch {
    // Usually HEIC outside Safari.
    throw new Error("This browser can't open that photo. Try a JPG or PNG.");
  }

  const width = image.width || image.naturalWidth;
  const height = image.height || image.naturalHeight;
  const result = toUpload(image, width, height);
  image.close?.();
  return result;
}
