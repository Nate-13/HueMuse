import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMuseStore from "../../store/useMuseStore.js";
import { COMP_REGISTRY } from "./Composition.jsx";
import styles from "./HUD.module.css";

const HARMONY_ORDER = [
  "mixed", "analogous", "complementary",
  "split-complementary", "triadic", "monochromatic", "accented",
];

const HARMONY_DISPLAY = {
  mixed: "Mixed",
  analogous: "Analogous",
  complementary: "Complementary",
  "split-complementary": "Split Complementary",
  triadic: "Triadic",
  monochromatic: "Monochromatic",
  accented: "Accented",
};

function HUD() {
  const setHarmonyMode = useMuseStore((s) => s.setHarmonyMode);
  const compType = useMuseStore((s) => s.compType);
  const setCompType = useMuseStore((s) => s.setCompType);

  const [flash, setFlash] = useState(null);

  const showFlash = useCallback((text) => {
    const id = Date.now();
    setFlash({ text, id });
    setTimeout(() => setFlash(null), 1200);
  }, []);

  // H → cycle harmony, C → cycle composition
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target !== document.body) return;

      if (e.code === "KeyH") {
        e.preventDefault();
        const idx = HARMONY_ORDER.indexOf(useMuseStore.getState().harmonyMode);
        const next = HARMONY_ORDER[(idx + 1) % HARMONY_ORDER.length];
        setHarmonyMode(next);
        showFlash(HARMONY_DISPLAY[next]);
      }

      if (e.code === "KeyC") {
        e.preventDefault();
        const { lockedCompType, compType } = useMuseStore.getState();
        if (lockedCompType) {
          setCompType(null);
          showFlash("Random Layout");
        } else {
          setCompType(compType);
          showFlash(COMP_REGISTRY[compType]?.label || compType);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setHarmonyMode, setCompType, showFlash]);

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key={flash.id}
          className={styles.flash}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {flash.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HUD;
