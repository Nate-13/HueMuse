import { useMemo } from "react";
import { motion } from "framer-motion";
import useMuseStore from "../../store/useMuseStore.js";
import { hexToOklch, oklchToHex } from "../../lib/color/index.js";
import styles from "./HueSteps.module.css";

const STEP_COUNT = 10;
const STEP_DEGREES = 360 / STEP_COUNT;
const GAP = 34;
const AMP = 10;
const FREQ = 1.3;

function wx(i) {
  return Math.sin((i / (STEP_COUNT - 1)) * Math.PI * 2 * FREQ) * AMP;
}

function HueSteps() {
  const hueStep = useMuseStore((s) => s.hueStep);
  const setHueStep = useMuseStore((s) => s.setHueStep);
  const basePalette = useMuseStore((s) => s.basePalette);

  const previews = useMemo(() => {
    const base = hexToOklch(basePalette[0]);
    if (!base) return Array(STEP_COUNT).fill(basePalette[0]);
    return Array.from({ length: STEP_COUNT }, (_, i) =>
      i === 0
        ? basePalette[0]
        : oklchToHex({ ...base, mode: "oklch", h: ((base.h || 0) + i * STEP_DEGREES) % 360 }),
    );
  }, [basePalette]);

  // Precompute positions
  const positions = useMemo(() =>
    Array.from({ length: STEP_COUNT }, (_, i) => ({
      x: wx(i),
      y: i * GAP,
    })),
  []);

  const trackH = (STEP_COUNT - 1) * GAP;

  // SVG curve through dot centers
  const curvePath = useMemo(() => {
    const cx = AMP + 8; // svg center x
    const pts = positions.map((p) => ({ x: cx + p.x, y: p.y + 8 }));
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const my = (pts[i - 1].y + pts[i].y) / 2;
      d += ` C${pts[i - 1].x},${my} ${pts[i].x},${my} ${pts[i].x},${pts[i].y}`;
    }
    return d;
  }, [positions]);

  const svgW = AMP * 2 + 16;
  const svgH = trackH + 16;

  return (
    <div
      className={styles.rail}
      style={{ width: svgW, height: svgH }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Wave line */}
      <svg className={styles.line} viewBox={`0 0 ${svgW} ${svgH}`}>
        <path d={curvePath} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>

      {/* Active ring */}
      <motion.div
        className={styles.ring}
        animate={{
          x: positions[hueStep].x,
          y: positions[hueStep].y,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      />

      {/* Dots */}
      {previews.map((color, i) => (
        <motion.button
          key={i}
          className={styles.dot}
          style={{
            top: positions[i].y,
            left: `calc(50% + ${positions[i].x}px)`,
          }}
          onClick={() => setHueStep(i)}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.85 }}
        >
          <span
            className={`${styles.fill} ${i === hueStep ? styles.fillOn : ""}`}
            style={{ backgroundColor: color }}
          />
        </motion.button>
      ))}
    </div>
  );
}

export default HueSteps;
