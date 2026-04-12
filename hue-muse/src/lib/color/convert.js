/**
 * Color conversion utilities wrapping culori for OKLCH-native color math.
 * All internal operations use OKLCH for perceptual uniformity.
 */
import { parse, formatHex, converter, displayable, clampChroma } from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");

/**
 * Parse any CSS color string into an OKLCH object.
 * Returns null if the input is invalid.
 */
export function parseToOklch(color) {
  const parsed = parse(color);
  if (!parsed) return null;
  return toOklch(parsed);
}

/**
 * Convert an OKLCH object { l, c, h } to a displayable hex string.
 * Clamps chroma if the color falls outside sRGB gamut.
 */
export function oklchToHex(oklch) {
  const clamped = clampChroma(oklch, "oklch");
  return formatHex(clamped);
}

/**
 * Convert a hex string to an OKLCH object.
 */
export function hexToOklch(hex) {
  return toOklch(parse(hex));
}

/**
 * Convert a hex string to RGB { r, g, b } with values 0-255.
 */
export function hexToRgb(hex) {
  const rgb = toRgb(parse(hex));
  return {
    r: Math.round(rgb.r * 255),
    g: Math.round(rgb.g * 255),
    b: Math.round(rgb.b * 255),
  };
}

/**
 * Check if an OKLCH color is displayable in sRGB.
 */
export function isDisplayable(oklch) {
  return displayable(oklch);
}

/**
 * Generate a random hex color with decent saturation and lightness.
 */
export function randomHex() {
  const h = Math.random() * 360;
  const c = 0.08 + Math.random() * 0.2; // moderate to vivid chroma
  const l = 0.3 + Math.random() * 0.5; // avoid near-black and near-white
  return oklchToHex({ mode: "oklch", l, c, h });
}

/**
 * Format an OKLCH object as a human-readable string.
 */
export function formatOklch(oklch) {
  const l = (oklch.l * 100).toFixed(1);
  const c = oklch.c.toFixed(3);
  const h = (oklch.h || 0).toFixed(1);
  return `oklch(${l}% ${c} ${h})`;
}

/**
 * Format a hex color as HSL string for display purposes.
 */
export function hexToHslString(hex) {
  const rgb = toRgb(parse(hex));
  const r = rgb.r,
    g = rgb.g,
    b = rgb.b;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
