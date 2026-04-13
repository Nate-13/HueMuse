import { create } from "zustand";
import {
  hexToOklch,
  oklchToHex,
} from "../lib/color/index.js";
import { generatePalette } from "../lib/color/harmony.js";

const HUE_STEPS = 10;
const STEP_DEGREES = 360 / HUE_STEPS; // 36° per step

let _compKeys = null;
function getCompKeys() {
  if (!_compKeys) {
    _compKeys = [
      "nested", "slabs", "columns", "rings", "eclipse", "quarters",
      "split", "mondrian", "frame", "stack", "diagonal", "stripes",
      "grid", "duo", "corners", "horizon", "cascade", "cross",
      "ladder", "orbit", "weave", "totem", "float",
      "diamond", "steps", "triad",
      "sunrise", "crescent", "spotlight", "hex", "ripple",
      "arch", "lens", "pyramid", "chevron", "dotgrid",
      "letterbox", "canyon", "bloom", "wave",
    ];
  }
  return _compKeys;
}

function pickCompType(locked) {
  if (locked) return locked;
  const keys = getCompKeys();
  return keys[Math.floor(Math.random() * keys.length)];
}

/** Rotate every color in a palette by `degrees` in OKLCH hue. */
function rotatePalette(basePalette, degrees) {
  if (degrees === 0) return basePalette;
  return basePalette.map((hex) => {
    const oklch = hexToOklch(hex);
    if (oklch) {
      oklch.h = ((oklch.h || 0) + degrees + 360) % 360;
      return oklchToHex(oklch);
    }
    return hex;
  });
}

/** Encode state as a URL hash: #AABBCC-DDEEFF.compType.hueStep */
function encodeHash(basePalette, compType, hueStep) {
  const colors = basePalette.map((h) => h.replace("#", "")).join("-");
  return `#${colors}.${compType}.${hueStep}`;
}

/** Parse a hash string back into state. Returns null if invalid. */
function parseHash(hash) {
  if (!hash || hash.length < 2) return null;
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const parts = raw.split(".");
  if (parts.length < 2) return null;

  const colorStr = parts[0];
  const compType = parts[1];
  const hueStep = parts.length >= 3 ? parseInt(parts[2], 10) : 0;

  const hexes = colorStr.split("-").map((c) => `#${c}`);
  if (hexes.length < 2 || hexes.some((h) => !/^#[0-9A-Fa-f]{6}$/.test(h))) {
    return null;
  }

  const keys = getCompKeys();
  if (!keys.includes(compType)) return null;

  const step = isNaN(hueStep) ? 0 : ((hueStep % HUE_STEPS) + HUE_STEPS) % HUE_STEPS;
  return { basePalette: hexes, compType, hueStep: step };
}

// Try to hydrate from URL hash on load
const hashState = parseHash(window.location.hash);
const initialBase = hashState ? hashState.basePalette : generatePalette("mixed");
const initialCompType = hashState ? hashState.compType : pickCompType(null);
const initialHueStep = hashState ? hashState.hueStep : 0;
const initialPalette = rotatePalette(initialBase, initialHueStep * STEP_DEGREES);

/** Silently update the URL hash to reflect current state. */
function syncHash(basePalette, compType, hueStep) {
  const hash = encodeHash(basePalette, compType, hueStep);
  history.replaceState(null, "", window.location.pathname + window.location.search + hash);
}

const useMuseStore = create((set, get) => ({
  basePalette: initialBase,
  hueStep: initialHueStep,
  palette: initialPalette,
  compType: initialCompType,
  lockedCompType: null,
  harmonyMode: "mixed",
  compositionKey: 0,

  // History for arrow key navigation
  history: [{ basePalette: initialBase, compType: initialCompType }],
  historyIndex: 0,

  saved: [],

  // Generate new composition — pushes to history
  generate: (mode) => {
    const m = mode || get().harmonyMode;
    const { lockedCompType, history, historyIndex } = get();
    const newBase = generatePalette(m);
    const newComp = pickCompType(lockedCompType);

    // Truncate any forward history and append
    const trimmed = history.slice(0, historyIndex + 1);
    const entry = { basePalette: newBase, compType: newComp };
    const newHistory = [...trimmed, entry];

    set((s) => ({
      basePalette: newBase,
      hueStep: 0,
      palette: newBase,
      compType: newComp,
      compositionKey: s.compositionKey + 1,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    }));
  },

  // Navigate history backwards
  historyBack: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set((s) => ({
      basePalette: prev.basePalette,
      hueStep: 0,
      palette: prev.basePalette,
      compType: prev.compType,
      compositionKey: s.compositionKey + 1,
      historyIndex: historyIndex - 1,
    }));
  },

  // Navigate history forwards
  historyForward: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set((s) => ({
      basePalette: next.basePalette,
      hueStep: 0,
      palette: next.basePalette,
      compType: next.compType,
      compositionKey: s.compositionKey + 1,
      historyIndex: historyIndex + 1,
    }));
  },

  setCompType: (type) => {
    set((s) => ({
      lockedCompType: type,
      compType: type || pickCompType(null),
      compositionKey: s.compositionKey + 1,
    }));
  },

  setHarmonyMode: (mode) => {
    set({ harmonyMode: mode });
    get().generate(mode);
  },

  // Step hue forward or backward — snaps to 10 discrete positions, loops
  stepHue: (direction) => {
    set((s) => {
      const next = ((s.hueStep + direction) % HUE_STEPS + HUE_STEPS) % HUE_STEPS;
      return {
        hueStep: next,
        palette: rotatePalette(s.basePalette, next * STEP_DEGREES),
      };
    });
  },

  // Jump directly to a specific step
  setHueStep: (step) => {
    const clamped = ((step % HUE_STEPS) + HUE_STEPS) % HUE_STEPS;
    set((s) => ({
      hueStep: clamped,
      palette: rotatePalette(s.basePalette, clamped * STEP_DEGREES),
    }));
  },

  // Get the preview color (first color) for a given step
  getStepPreview: (step) => {
    const { basePalette } = get();
    const rotated = rotatePalette(basePalette, step * STEP_DEGREES);
    return rotated[0];
  },

  tweakColor: (index, hex) => {
    set((s) => {
      const palette = [...s.palette];
      palette[index] = hex;
      // Also update basePalette so scroll stays relative to tweaked version
      const basePalette = [...s.basePalette];
      const reverseDeg = -(s.hueStep * STEP_DEGREES);
      const oklch = hexToOklch(hex);
      if (oklch) {
        oklch.h = ((oklch.h || 0) + reverseDeg + 360) % 360;
        basePalette[index] = oklchToHex(oklch);
      }
      return { palette, basePalette };
    });
  },

  savePalette: () => {
    const { palette, saved } = get();
    const id = crypto.randomUUID();
    set({ saved: [...saved, { id, colors: [...palette] }] });
  },

  removeSaved: (id) => {
    set((s) => ({ saved: s.saved.filter((p) => p.id !== id) }));
  },

  loadPalette: (id) => {
    const { saved } = get();
    const found = saved.find((p) => p.id === id);
    if (found) {
      set((s) => ({
        basePalette: [...found.colors],
        hueStep: 0,
        palette: [...found.colors],
        compositionKey: s.compositionKey + 1,
      }));
    }
  },
}));

// Keep URL hash + favicon in sync with visible state
import { updateFavicon } from "../lib/favicon.js";
syncHash(initialBase, initialCompType, initialHueStep);
updateFavicon(initialPalette);
useMuseStore.subscribe((state) => {
  syncHash(state.basePalette, state.compType, state.hueStep);
  updateFavicon(state.palette);
});

export default useMuseStore;
