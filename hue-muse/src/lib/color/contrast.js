/**
 * APCA (Accessible Perceptual Contrast Algorithm) contrast checking.
 * APCA is the successor to WCAG 2.x contrast ratio — it accounts for
 * polarity (light-on-dark vs dark-on-light) and perceptual luminance.
 *
 * Simplified APCA implementation based on the SAPC/APCA algorithm.
 */
import { parse, converter } from "culori";
import { hexToOklch, oklchToHex } from "./convert.js";

const toRgb = converter("rgb");

// sRGB to Y (luminance) using APCA coefficients
function sRGBtoY(srgb) {
  // Linearize
  const r =
    srgb.r <= 0.04045
      ? srgb.r / 12.92
      : Math.pow((srgb.r + 0.055) / 1.055, 2.4);
  const g =
    srgb.g <= 0.04045
      ? srgb.g / 12.92
      : Math.pow((srgb.g + 0.055) / 1.055, 2.4);
  const b =
    srgb.b <= 0.04045
      ? srgb.b / 12.92
      : Math.pow((srgb.b + 0.055) / 1.055, 2.4);

  // APCA luminance coefficients
  return 0.2126729 * r + 0.7151522 * g + 0.0722099 * b;
}

/**
 * Calculate APCA contrast value between text and background colors.
 * Returns a value from ~-108 to ~+106.
 * Positive = dark text on light bg, Negative = light text on dark bg.
 * Absolute value indicates contrast strength.
 *
 * @param {string} textColor - CSS color string for text
 * @param {string} bgColor - CSS color string for background
 * @returns {number} APCA Lc (Lightness Contrast) value
 */
export function apcaContrast(textColor, bgColor) {
  const textRgb = toRgb(parse(textColor));
  const bgRgb = toRgb(parse(bgColor));

  if (!textRgb || !bgRgb) return 0;

  const txtY = sRGBtoY(textRgb);
  const bgY = sRGBtoY(bgRgb);

  // SAPC constants
  const normBG = 0.56;
  const normTXT = 0.57;
  const revBG = 0.62;
  const revTXT = 0.65;
  const blkThrs = 0.022;
  const blkClmp = 1.414;
  const scaleBoW = 1.14;
  const scaleWoB = 1.14;
  const loBoWoffset = 0.027;
  const loWoBoffset = 0.027;

  // Clamp to black threshold
  const txC = txtY > blkThrs ? txtY : txtY + Math.pow(blkThrs - txtY, blkClmp);
  const bgC = bgY > blkThrs ? bgY : bgY + Math.pow(blkThrs - bgY, blkClmp);

  // SAPC contrast
  let Lc;
  if (bgC > txC) {
    // Dark text on light background
    const SAPC = (Math.pow(bgC, normBG) - Math.pow(txC, normTXT)) * scaleBoW;
    Lc = SAPC < loBoWoffset ? 0 : SAPC - loBoWoffset;
  } else {
    // Light text on dark background
    const SAPC = (Math.pow(bgC, revBG) - Math.pow(txC, revTXT)) * scaleWoB;
    Lc = SAPC > -loWoBoffset ? 0 : SAPC + loWoBoffset;
  }

  return Math.round(Lc * 100) / 100;
}

/**
 * Get a human-readable contrast rating.
 * Based on APCA Lc values:
 * - |Lc| >= 90: Excellent (body text)
 * - |Lc| >= 75: Good (large text, headlines)
 * - |Lc| >= 60: Fair (large bold text, icons)
 * - |Lc| >= 45: Minimum (non-text, decorative)
 * - |Lc| < 45: Poor
 */
export function contrastRating(lc) {
  const abs = Math.abs(lc);
  if (abs >= 90) return { label: "Excellent", level: 4 };
  if (abs >= 75) return { label: "Good", level: 3 };
  if (abs >= 60) return { label: "Fair", level: 2 };
  if (abs >= 45) return { label: "Min", level: 1 };
  return { label: "Poor", level: 0 };
}

/**
 * Generate an accessible text color (black or white) for a given background.
 * Returns whichever has better APCA contrast.
 */
export function accessibleTextColor(bgHex) {
  const onWhite = Math.abs(apcaContrast("#ffffff", bgHex));
  const onBlack = Math.abs(apcaContrast("#000000", bgHex));
  return onBlack > onWhite ? "#000000" : "#ffffff";
}

/**
 * Generate a text color from the same hue family as the background
 * but with sufficient contrast. More aesthetically pleasing than pure B/W.
 */
export function harmonicTextColor(bgHex) {
  const bg = hexToOklch(bgHex);
  if (!bg) return accessibleTextColor(bgHex);

  // Try a same-hue, high/low lightness variant
  const light = oklchToHex({
    mode: "oklch",
    l: Math.min(bg.l + 0.55, 0.97),
    c: Math.max(bg.c * 0.3, 0.01),
    h: bg.h,
  });
  const dark = oklchToHex({
    mode: "oklch",
    l: Math.max(bg.l - 0.55, 0.05),
    c: Math.max(bg.c * 0.3, 0.01),
    h: bg.h,
  });

  const lightContrast = Math.abs(apcaContrast(light, bgHex));
  const darkContrast = Math.abs(apcaContrast(dark, bgHex));

  // Only use harmonic color if it has sufficient contrast, otherwise fall back to B/W
  const best = darkContrast > lightContrast ? dark : light;
  const bestContrast = Math.max(darkContrast, lightContrast);

  return bestContrast >= 60 ? best : accessibleTextColor(bgHex);
}
