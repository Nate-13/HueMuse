/**
 * OKLCH color harmony engine.
 *
 * Key improvements over naive approaches:
 * - Gamut-aware: knows the max chroma available for any (hue, lightness)
 * - Role-based lightness: assigns dark/mid/light roles so palettes have range
 * - Muddy zone avoidance: dark yellows/oranges get desaturated automatically
 * - Generates full palettes at once for palette-level balance
 * - Bezold-Brucke hue compensation for perceptual consistency
 */
import { hexToOklch, oklchToHex, randomHex, isDisplayable } from "./convert.js";

// ─── Utilities ───────────────────────────────────────────────

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function wrapHue(h) {
  return ((h % 360) + 360) % 360;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Gamut-aware chroma ──────────────────────────────────────

/**
 * Find the maximum displayable chroma for a given hue + lightness in sRGB.
 * Uses binary search with culori's displayable() check.
 */
function maxChroma(h, l) {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    if (isDisplayable({ mode: "oklch", l, c: mid, h })) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

/**
 * Get a chroma value as a fraction of the maximum available.
 * This ensures a yellow at L=0.85 looks as vivid as a blue at L=0.5.
 */
function chromaAt(h, l, ratio) {
  const max = maxChroma(h, l);
  return max * clamp(ratio, 0, 1);
}

// ─── Muddy zone avoidance ────────────────────────────────────

/**
 * Check if a (hue, lightness) pair falls in a "muddy" zone.
 * Dark yellows and dark oranges look like brown mud.
 */
function isMuddy(h, l) {
  const hue = wrapHue(h);
  // Dark yellows (H 70-110, L < 0.45)
  if (hue > 70 && hue < 110 && l < 0.45) return true;
  // Dark oranges (H 40-70, L < 0.38)
  if (hue > 40 && hue < 70 && l < 0.38) return true;
  return false;
}

/**
 * Adjust a color to escape muddy territory.
 * Either lighten it or desaturate it.
 */
function escapeMuddy(h, l, chromaRatio) {
  if (!isMuddy(h, l)) return { l, chromaRatio };
  // Push lightness up to escape the mud
  const hue = wrapHue(h);
  if (hue > 70 && hue < 110) {
    return { l: clamp(l + 0.2, 0.55, 0.88), chromaRatio: chromaRatio * 0.8 };
  }
  return { l: clamp(l + 0.15, 0.48, 0.85), chromaRatio: chromaRatio * 0.7 };
}

// ─── Bezold-Brücke hue compensation ─────────────────────────

/**
 * Slight hue shift across lightness to maintain perceived hue constancy.
 * At extreme lightness, hues shift toward yellow or blue perceptually.
 */
function compensateHue(h, l) {
  return h + 5 * (1 - l);
}

// ─── Lightness role assignment ───────────────────────────────

/**
 * Lightness roles ensure palette-level variety.
 * Each role defines a lightness range and preferred chroma intensity.
 */
const ROLES = {
  3: [
    { lRange: [0.25, 0.40], chromaRange: [0.55, 0.85] }, // dark, vivid
    { lRange: [0.50, 0.67], chromaRange: [0.65, 1.0] },  // mid, hero
    { lRange: [0.74, 0.88], chromaRange: [0.35, 0.70] }, // light, softer
  ],
  4: [
    { lRange: [0.22, 0.36], chromaRange: [0.50, 0.80] }, // dark
    { lRange: [0.44, 0.58], chromaRange: [0.65, 1.0] },  // mid-dark
    { lRange: [0.62, 0.76], chromaRange: [0.60, 0.90] }, // mid-light
    { lRange: [0.78, 0.90], chromaRange: [0.30, 0.65] }, // light
  ],
};

// ─── Harmony hue templates ───────────────────────────────────

/**
 * Each template defines hue offsets from the base hue.
 * The first offset is always 0 (the base color).
 * Some jitter is applied for organic feel.
 */
const HUE_TEMPLATES = {
  analogous: {
    3: [0, 25, -25],
    4: [0, 20, 40, -20],
    jitter: 8,
  },
  complementary: {
    3: [0, 180, 15],
    4: [0, 180, 15, 195],
    jitter: 12,
  },
  "split-complementary": {
    3: [0, 150, 210],
    4: [0, 150, 210, 30],
    jitter: 10,
  },
  triadic: {
    3: [0, 120, 240],
    4: [0, 120, 240, 60],
    jitter: 10,
  },
  monochromatic: {
    3: [0, 0, 0],
    4: [0, 0, 0, 0],
    jitter: 5, // tiny hue variation for warmth
  },
  accented: {
    3: [0, 30, 180],
    4: [0, 25, -25, 180],
    jitter: 8,
  },
};

// ─── Core palette generation ─────────────────────────────────

/**
 * Generate a complete harmonious palette.
 *
 * Unlike one-at-a-time generation, this produces all colors at once
 * with palette-level constraints:
 * - Lightness roles guarantee range
 * - Gamut-aware chroma ensures max vibrancy per hue
 * - Muddy zone avoidance
 * - Minimum lightness spread enforced
 */
export function generatePalette(mode = "mixed", count = null) {
  const n = count || (Math.random() < 0.5 ? 3 : 4);
  const template = mode === "mixed"
    ? pick(Object.keys(HUE_TEMPLATES))
    : mode;

  const tmpl = HUE_TEMPLATES[template] || HUE_TEMPLATES.analogous;
  const baseHue = Math.random() * 360;
  const offsets = tmpl[n] || tmpl[3];
  const jitter = tmpl.jitter || 8;

  // Assign lightness roles (shuffled so the "dark" slot isn't always first)
  const roles = shuffle(ROLES[n] || ROLES[3]);

  const colors = [];

  for (let i = 0; i < n; i++) {
    const role = roles[i];
    let h = wrapHue(baseHue + offsets[i] + rand(-jitter, jitter));
    let l = rand(role.lRange[0], role.lRange[1]);
    let cr = rand(role.chromaRange[0], role.chromaRange[1]);

    // Escape muddy zones
    const escaped = escapeMuddy(h, l, cr);
    l = escaped.l;
    cr = escaped.chromaRatio;

    // Bezold-Brücke compensation
    h = compensateHue(h, l);

    // Gamut-aware chroma
    const c = chromaAt(h, l, cr);

    colors.push(oklchToHex({ mode: "oklch", l, c, h }));
  }

  // Validate lightness spread — if too compressed, fix it
  const lValues = colors.map((hex) => hexToOklch(hex)?.l || 0.5);
  const spread = Math.max(...lValues) - Math.min(...lValues);
  if (spread < 0.25 && n >= 3) {
    // Force the lightest lighter and the darkest darker
    const sorted = [...lValues].sort((a, b) => a - b);
    const darkIdx = lValues.indexOf(sorted[0]);
    const lightIdx = lValues.indexOf(sorted[sorted.length - 1]);

    const darkOk = hexToOklch(colors[darkIdx]);
    const lightOk = hexToOklch(colors[lightIdx]);

    if (darkOk) {
      darkOk.l = clamp(darkOk.l - 0.12, 0.15, 0.4);
      darkOk.c = chromaAt(darkOk.h || 0, darkOk.l, rand(0.5, 0.85));
      colors[darkIdx] = oklchToHex(darkOk);
    }
    if (lightOk) {
      lightOk.l = clamp(lightOk.l + 0.12, 0.7, 0.92);
      lightOk.c = chromaAt(lightOk.h || 0, lightOk.l, rand(0.3, 0.65));
      colors[lightIdx] = oklchToHex(lightOk);
    }
  }

  return colors;
}

// ─── Single-color pairing (kept for compatibility) ───────────

export function generateDistinctPairing(baseHex, mode = "mixed") {
  const base = hexToOklch(baseHex);
  if (!base) return randomHex();

  const template = mode === "mixed"
    ? pick(Object.keys(HUE_TEMPLATES))
    : mode;
  const tmpl = HUE_TEMPLATES[template] || HUE_TEMPLATES.analogous;
  const offsets = tmpl[3];
  const jitter = tmpl.jitter || 8;

  // Pick a non-zero offset
  const offset = pick(offsets.filter((o) => o !== 0)) || 180;
  let h = wrapHue((base.h || 0) + offset + rand(-jitter, jitter));

  // Ensure lightness contrast with the base
  const baseLightness = base.l;
  let l;
  if (baseLightness > 0.6) {
    l = rand(0.2, 0.5); // go dark
  } else if (baseLightness < 0.4) {
    l = rand(0.6, 0.85); // go light
  } else {
    l = Math.random() < 0.5 ? rand(0.2, 0.4) : rand(0.7, 0.88); // either direction
  }

  const escaped = escapeMuddy(h, l, rand(0.5, 0.95));
  l = escaped.l;
  h = compensateHue(h, l);
  const c = chromaAt(h, l, escaped.chromaRatio);

  return oklchToHex({ mode: "oklch", l, c, h });
}

// ─── Similarity check ────────────────────────────────────────

export function colorsTooSimilar(hex1, hex2, threshold = 0.08) {
  const a = hexToOklch(hex1);
  const b = hexToOklch(hex2);
  if (!a || !b) return false;

  const dL = a.l - b.l;
  const dC = a.c - b.c;
  const dH = ((a.h || 0) - (b.h || 0)) * (Math.PI / 180);
  const dist = Math.sqrt(dL * dL + dC * dC * 4 + dH * dH * 0.01);
  return dist < threshold;
}
