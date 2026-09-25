import { writeAnalysis, writeConfirmed, writePhoto } from "@/lib/session";
import { analyzeImage } from "@/lib/skinstric";

// Long enough that frame 011 registers as a step, short enough not to stall.
const MIN_PREPARING_MS = 1600;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Shared by the gallery and the camera: send the prepared photo to phase two,
 * then keep the photo and its demographics for the screens after. A new photo
 * clears any picks confirmed for the previous one.
 */
export async function runAnalysis(photo) {
  const [data] = await Promise.all([analyzeImage(photo.base64), wait(MIN_PREPARING_MS)]);
  writePhoto(photo.dataUrl);
  writeAnalysis(data);
  writeConfirmed(null);
  return data;
}
