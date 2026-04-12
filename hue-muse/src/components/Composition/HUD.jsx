import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { accessibleTextColor } from "../../lib/color/index.js";
import useMuseStore from "../../store/useMuseStore.js";
import { COMP_REGISTRY, COMP_KEYS } from "./Composition.jsx";
import styles from "./HUD.module.css";

const HARMONY_LABELS = [
  { value: "mixed", label: "Mixed" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "split-complementary", label: "Split" },
  { value: "triadic", label: "Triadic" },
  { value: "monochromatic", label: "Mono" },
];

function HUD() {
  const palette = useMuseStore((s) => s.palette);
  const harmonyMode = useMuseStore((s) => s.harmonyMode);
  const setHarmonyMode = useMuseStore((s) => s.setHarmonyMode);
  const lockedCompType = useMuseStore((s) => s.lockedCompType);
  const setCompType = useMuseStore((s) => s.setCompType);
  const savePalette = useMuseStore((s) => s.savePalette);
  const saved = useMuseStore((s) => s.saved);
  const loadPalette = useMuseStore((s) => s.loadPalette);
  const removeSaved = useMuseStore((s) => s.removeSaved);

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showCompPicker, setShowCompPicker] = useState(false);

  const copyHex = useCallback((hex, index, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  }, []);

  return (
    <div className={styles.hud}>
      {/* Palette swatches — bottom left */}
      <div className={styles.swatches}>
        {palette.map((hex, i) => (
          <motion.button
            key={`${hex}-${i}`}
            className={styles.swatch}
            style={{
              background: hex,
              color: accessibleTextColor(hex),
            }}
            onClick={(e) => copyHex(hex, i, e)}
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            title={hex}
            layout
          >
            <span className={styles.swatchLabel}>
              {copiedIndex === i ? "✓" : hex}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Actions — bottom right */}
      <div className={styles.actions}>
        {/* Harmony mode selector */}
        <div className={styles.harmonyRow}>
          {HARMONY_LABELS.map((h) => (
            <button
              key={h.value}
              className={`${styles.harmonyChip} ${harmonyMode === h.value ? styles.harmonyActive : ""}`}
              onClick={(e) => { e.stopPropagation(); setHarmonyMode(h.value); }}
            >
              {h.label}
            </button>
          ))}
        </div>

        <div className={styles.actionRow}>
          {/* Composition picker */}
          <button
            className={styles.actionBtn}
            onClick={(e) => { e.stopPropagation(); setShowCompPicker(!showCompPicker); }}
            title="Choose composition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
            {lockedCompType ? COMP_REGISTRY[lockedCompType]?.label : "Random"}
          </button>

          {/* Save */}
          <button
            className={styles.actionBtn}
            onClick={(e) => { e.stopPropagation(); savePalette(); }}
            title="Save palette"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Save
          </button>

          {/* Saved palettes toggle */}
          {saved.length > 0 && (
            <button
              className={styles.actionBtn}
              onClick={(e) => { e.stopPropagation(); setShowSaved(!showSaved); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              {saved.length}
            </button>
          )}
        </div>
      </div>

      {/* Interaction hints — bottom center */}
      <div className={styles.hints}>
        <div className={styles.hintGroup}>
          <span className={styles.key}>space</span>
          <span className={styles.hintLabel}>new</span>
        </div>
        <div className={styles.hintGroup}>
          <span className={styles.key}>← →</span>
          <span className={styles.hintLabel}>history</span>
        </div>
        <div className={styles.hintGroup}>
          <span className={styles.key}>scroll</span>
          <span className={styles.hintLabel}>shift hue</span>
        </div>
        <div className={styles.hintGroup}>
          <span className={styles.key}>click</span>
          <span className={styles.hintLabel}>copy</span>
        </div>
      </div>

      {/* Composition picker panel */}
      <AnimatePresence>
        {showCompPicker && (
          <motion.div
            className={styles.compPanel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`${styles.compOption} ${lockedCompType === null ? styles.compOptionActive : ""}`}
              onClick={() => { setCompType(null); setShowCompPicker(false); }}
            >
              Random
            </button>
            {COMP_KEYS.map((key) => (
              <button
                key={key}
                className={`${styles.compOption} ${lockedCompType === key ? styles.compOptionActive : ""}`}
                onClick={() => { setCompType(key); setShowCompPicker(false); }}
              >
                {COMP_REGISTRY[key].label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved palettes panel */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            className={styles.savedPanel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {saved.map((p) => (
              <div key={p.id} className={styles.savedRow}>
                <div className={styles.savedSwatches}>
                  {p.colors.map((c, i) => (
                    <div
                      key={i}
                      className={styles.savedDot}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <button
                  className={styles.savedLoad}
                  onClick={() => { loadPalette(p.id); setShowSaved(false); }}
                >
                  Load
                </button>
                <button
                  className={styles.savedDelete}
                  onClick={() => removeSaved(p.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HUD;
