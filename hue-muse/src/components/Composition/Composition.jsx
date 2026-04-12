import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMuseStore from "../../store/useMuseStore.js";
import { accessibleTextColor, formatOklch, hexToOklch } from "../../lib/color/index.js";
import styles from "./Composition.module.css";

/* ============================================================
   COMPOSITIONS — each with a form-matched entrance animation
   ============================================================ */

// Concentric circles — expand outward from center, staggered
function Rings({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  return (
    <div className={styles.comp}>
      <div className={`${styles.ringsOuter} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(0)}>
        <div className={`${styles.ringsMid} ${styles.animExpand}`} style={{ background: c2, animationDelay: "0.05s" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }}>
          <div className={`${styles.ringsInner} ${styles.animExpand}`} style={{ background: c3 || c1, animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(2); }}>
            <div className={`${styles.ringsCore} ${styles.animExpand}`} style={{ background: c4 || c2, animationDelay: "0.19s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c4 ? 3 : 1); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Horizontal bands — reveal height top-to-bottom, staggered
function Slabs({ palette, onClickColor }) {
  return (
    <div className={styles.comp} style={{ display: "flex", flexDirection: "column" }}>
      {palette.map((color, i) => (
        <div
          key={i}
          className={`${styles.slab} ${styles.animRevealH}`}
          style={{ background: color, flex: i === 0 ? 2.5 : i === 1 ? 1.8 : 1, animationDelay: `${i * 0.07}s` }}
          onClick={() => onClickColor(i)}
        />
      ))}
    </div>
  );
}

// Circle on a field — field fades, circle expands smoothly
function Eclipse({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(0)}>
      <div className={`${styles.eclipseCircle} ${styles.animExpand}`} style={{ background: c2, animationDelay: "0.08s" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }}>
        <div className={`${styles.eclipseInner} ${styles.animExpand}`} style={{ background: c3 || c1, animationDelay: "0.16s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 ? 2 : 0); }} />
      </div>
    </div>
  );
}

// Four quadrants — each reveals from its own corner
function Quarters({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const colors = [c1, c2, c3 || c1, c4 || c2];
  const anims = [styles.animCornerTL, styles.animCornerTR, styles.animCornerBL, styles.animCornerBR];
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
      {colors.map((color, i) => (
        <div key={i} className={anims[i]} style={{ background: color, cursor: "pointer", animationDelay: `${i * 0.04}s` }} onClick={() => onClickColor(i % palette.length)} />
      ))}
    </div>
  );
}

// Nested rectangles — each layer expands from center, staggered
function Nested({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => onClickColor(0)}>
      <div className={`${styles.nestedRect} ${styles.animExpand}`} style={{ background: c2, width: "75%", height: "75%", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }}>
        <div className={`${styles.nestedRect} ${styles.animExpand}`} style={{ background: c3 || c1, width: "65%", height: "65%", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 ? 2 : 0); }}>
          <div className={`${styles.nestedRect} ${styles.animExpand}`} style={{ background: c4 || c2, width: "55%", height: "55%", animationDelay: "0.18s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c4 ? 3 : 1); }} />
        </div>
      </div>
    </div>
  );
}

// Vertical columns — reveal width left-to-right, staggered
function Columns({ palette, onClickColor }) {
  return (
    <div className={styles.comp} style={{ display: "flex" }}>
      {palette.map((color, i) => (
        <div
          key={i}
          className={`${styles.slab} ${styles.animRevealW}`}
          style={{ background: color, flex: i === 0 ? 2.2 : i === palette.length - 1 ? 1.5 : 1, animationDelay: `${i * 0.07}s` }}
          onClick={() => onClickColor(i)}
        />
      ))}
    </div>
  );
}

// Split — halves wipe open from center
function Split({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={styles.comp} style={{ display: "flex" }}>
      <div className={styles.animWipeRight} style={{ flex: 1, background: c1, cursor: "pointer" }} onClick={() => onClickColor(0)} />
      <div className={styles.animFade} style={{ width: "4%", background: c3 || c2, cursor: "pointer", animationDelay: "0.15s" }} onClick={() => onClickColor(c3 ? 2 : 1)} />
      <div className={styles.animWipeLeft} style={{ flex: 1, background: c2, cursor: "pointer" }} onClick={() => onClickColor(1)} />
    </div>
  );
}

// Mondrian — cells fade-scale with stagger
function Mondrian({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr 2fr", gap: "3px", background: "#111" }}>
      <div className={styles.animCell} style={{ background: c1, gridRow: "1 / 3", cursor: "pointer", animationDelay: "0s" }} onClick={() => onClickColor(0)} />
      <div className={styles.animCell} style={{ background: c2, cursor: "pointer", animationDelay: "0.04s" }} onClick={() => onClickColor(1)} />
      <div className={styles.animCell} style={{ background: c3 || c1, gridRow: "1 / 3", cursor: "pointer", animationDelay: "0.08s" }} onClick={() => onClickColor(c3 ? 2 : 0)} />
      <div className={styles.animCell} style={{ background: c4 || c2, cursor: "pointer", animationDelay: "0.12s" }} onClick={() => onClickColor(c4 ? 3 : 1)} />
      <div className={styles.animCell} style={{ background: c2, gridColumn: "1 / 3", cursor: "pointer", animationDelay: "0.16s" }} onClick={() => onClickColor(1)} />
      <div className={styles.animCell} style={{ background: c1, cursor: "pointer", animationDelay: "0.2s" }} onClick={() => onClickColor(0)} />
    </div>
  );
}

// Frame — fade outer, expand inner layers
function Frame({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => onClickColor(0)}>
      <div className={styles.animExpand} style={{ width: "80%", height: "75%", background: c2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }}>
        <div className={styles.animExpand} style={{ width: "82%", height: "80%", background: c3 || c1, cursor: "pointer", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 ? 2 : 0); }} />
      </div>
    </div>
  );
}

// Stack — cards slide into place from above
function Stack({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const colors = [c1, c2, c3 || c1, c4 || c2];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(0)}>
      {colors.slice(1).map((color, i) => (
        <div
          key={i}
          className={`${styles.stackCard} ${styles.animSlide}`}
          style={{ background: color, width: `${70 - i * 8}%`, height: `${55 - i * 6}%`, top: `${15 + i * 14}%`, left: `${15 + i * 6}%`, animationDelay: `${i * 0.08}s` }}
          onClick={(e) => { e.stopPropagation(); onClickColor((i + 1) % palette.length); }}
        />
      ))}
    </div>
  );
}

// Diagonal — triangles wipe along their diagonal edge
function Diagonal({ palette, onClickColor }) {
  const [c1, c2] = palette;
  return (
    <div className={styles.comp} style={{ position: "relative", overflow: "hidden" }}>
      <div className={styles.animDiagTL} style={{ position: "absolute", inset: 0, background: c1, clipPath: "polygon(0 0, 100% 0, 0 100%)", cursor: "pointer" }} onClick={() => onClickColor(0)} />
      <div className={styles.animDiagBR} style={{ position: "absolute", inset: 0, background: c2, clipPath: "polygon(100% 0, 100% 100%, 0 100%)", cursor: "pointer", animationDelay: "0.08s" }} onClick={() => onClickColor(1)} />
    </div>
  );
}

// Stripes — reveal height with rapid stagger
function Stripes({ palette, onClickColor }) {
  const count = 12;
  return (
    <div className={styles.comp} style={{ display: "flex", flexDirection: "column" }}>
      {Array.from({ length: count }, (_, i) => {
        const ci = i % palette.length;
        return (
          <div
            key={i}
            className={styles.animRevealH}
            style={{ flex: 1, background: palette[ci], cursor: "pointer", animationDelay: `${i * 0.025}s` }}
            onClick={() => onClickColor(ci)}
          />
        );
      })}
    </div>
  );
}

// Grid — cells fade-scale with stagger
function Grid({ palette, onClickColor }) {
  const cols = palette.length >= 4 ? 4 : 3;
  const rows = 3;
  const cells = Array.from({ length: cols * rows }, (_, i) => palette[i % palette.length]);
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {cells.map((color, i) => (
        <div key={i} className={styles.animCell} style={{ background: color, cursor: "pointer", animationDelay: `${i * 0.025}s` }} onClick={() => onClickColor(i % palette.length)} />
      ))}
    </div>
  );
}

// Duo — circles grow in place
function Duo({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c3 || c1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5vw" }} onClick={() => onClickColor(c3 ? 2 : 0)}>
      <div className={styles.animGrow} style={{ width: "30vmin", height: "30vmin", borderRadius: "50%", background: c1, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onClickColor(0); }} />
      <div className={styles.animGrow} style={{ width: "30vmin", height: "30vmin", borderRadius: "50%", background: c2, cursor: "pointer", animationDelay: "0.08s" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }} />
    </div>
  );
}

// Corners — blocks reveal from their edges
function Corners({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(0)}>
      <div className={styles.animCornerTL} style={{ position: "absolute", top: 0, left: 0, width: "45%", height: "40%", background: c2, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }} />
      <div className={styles.animCornerBR} style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "50%", background: c3 || c2, cursor: "pointer", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 ? 2 : 1); }} />
      <div className={styles.animCornerBL} style={{ position: "absolute", bottom: 0, left: 0, width: "30%", height: "25%", background: c4 || c1, cursor: "pointer", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c4 ? 3 : 0); }} />
    </div>
  );
}

// --- Rothko-inspired: two heavy fields with a thin breath between ---
function Horizon({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={styles.comp} style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.animFade} style={{ flex: 5, background: c1, cursor: "pointer" }} onClick={() => onClickColor(0)} />
      <div className={styles.animFade} style={{ flex: 0.3, background: c3 || c2, cursor: "pointer", animationDelay: "0.12s" }} onClick={() => onClickColor(c3 ? 2 : 1)} />
      <div className={styles.animFade} style={{ flex: 4, background: c2, cursor: "pointer", animationDelay: "0.06s" }} onClick={() => onClickColor(1)} />
    </div>
  );
}

// --- Overlapping circles cascading diagonally ---
function Cascade({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const circles = [c2, c3 || c1, c4 || c2, c1];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(0)}>
      {circles.map((color, i) => (
        <div
          key={i}
          className={styles.animGrow}
          style={{
            position: "absolute",
            width: "38vmin",
            height: "38vmin",
            borderRadius: "50%",
            background: color,
            top: `${12 + i * 18}%`,
            left: `${10 + i * 20}%`,
            cursor: "pointer",
            animationDelay: `${i * 0.06}s`,
          }}
          onClick={(e) => { e.stopPropagation(); onClickColor(i % palette.length); }}
        />
      ))}
    </div>
  );
}

// --- Bold cross on a field ---
function Cross({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(0)}>
      <div className={styles.animRevealW} style={{ position: "absolute", top: "38%", left: 0, right: 0, height: "24%", background: c2, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }} />
      <div className={styles.animRevealH} style={{ position: "absolute", left: "40%", top: 0, bottom: 0, width: "20%", background: c2, cursor: "pointer", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }} />
      <div className={styles.animExpand} style={{ position: "absolute", top: "38%", left: "40%", width: "20%", height: "24%", background: c3 || c1, cursor: "pointer", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 ? 2 : 0); }} />
    </div>
  );
}

// --- Thin horizontal rungs on a vertical field ---
function Ladder({ palette, onClickColor }) {
  const [c1, c2] = palette;
  const rungs = 8;
  return (
    <div className={styles.comp} style={{ background: c1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-evenly", padding: "5% 15%" }} onClick={() => onClickColor(0)}>
      {Array.from({ length: rungs }, (_, i) => (
        <div
          key={i}
          className={styles.animRevealW}
          style={{ height: "4%", background: c2, cursor: "pointer", animationDelay: `${i * 0.03}s` }}
          onClick={(e) => { e.stopPropagation(); onClickColor(1); }}
        />
      ))}
    </div>
  );
}

// --- Small circles arranged in an elliptical orbit ---
function Orbit({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const count = 8;
  const rx = 30;
  const ry = 22;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(0)}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const ci = [c2, c3 || c2, c4 || c2][i % 3];
        return (
          <div
            key={i}
            className={styles.animGrow}
            style={{
              position: "absolute",
              width: "8vmin",
              height: "8vmin",
              borderRadius: "50%",
              background: ci,
              top: `calc(50% + ${Math.sin(angle) * ry}vmin - 4vmin)`,
              left: `calc(50% + ${Math.cos(angle) * rx}vmin - 4vmin)`,
              cursor: "pointer",
              animationDelay: `${i * 0.04}s`,
            }}
            onClick={(e) => { e.stopPropagation(); onClickColor((i + 1) % palette.length); }}
          />
        );
      })}
    </div>
  );
}

// --- Alternating horizontal/vertical strips that weave ---
function Weave({ palette, onClickColor }) {
  const [c1, c2] = palette;
  const count = 6;
  const size = 100 / count;
  const cells = [];
  for (let r = 0; r < count; r++) {
    for (let col = 0; col < count; col++) {
      cells.push({ r, col, color: (r + col) % 2 === 0 ? c1 : c2 });
    }
  }
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gridTemplateRows: `repeat(${count}, 1fr)` }}>
      {cells.map(({ r, col, color }, i) => (
        <div
          key={i}
          className={styles.animCell}
          style={{ background: color, cursor: "pointer", animationDelay: `${(r + col) * 0.02}s` }}
          onClick={() => onClickColor(color === c1 ? 0 : 1)}
        />
      ))}
    </div>
  );
}

// --- Tall narrow bars of varying heights, centered ---
function Totem({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const bars = [
    { h: 55, color: c2, ci: 1 },
    { h: 75, color: c3 || c1, ci: c3 ? 2 : 0 },
    { h: 90, color: c1, ci: 0 },
    { h: 70, color: c4 || c2, ci: c4 ? 3 : 1 },
    { h: 50, color: c2, ci: 1 },
  ];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "1.5vw", padding: "0 15%" }} onClick={() => onClickColor(0)}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={styles.animRevealH}
          style={{
            width: "8vw",
            height: `${bar.h}%`,
            background: bar.color,
            cursor: "pointer",
            animationDelay: `${i * 0.05}s`,
            transformOrigin: "bottom",
          }}
          onClick={(e) => { e.stopPropagation(); onClickColor(bar.ci); }}
        />
      ))}
    </div>
  );
}

// --- Scattered rectangles on a field, asymmetric ---
function Float({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const rects = [
    { w: "35%", h: "28%", t: "8%", l: "5%", color: c2, ci: 1 },
    { w: "25%", h: "40%", t: "45%", l: "60%", color: c3 || c1, ci: c3 ? 2 : 0 },
    { w: "18%", h: "22%", t: "15%", l: "55%", color: c4 || c2, ci: c4 ? 3 : 1 },
    { w: "30%", h: "18%", t: "72%", l: "12%", color: c2, ci: 1 },
  ];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(0)}>
      {rects.map((r, i) => (
        <div
          key={i}
          className={styles.animCell}
          style={{
            position: "absolute",
            width: r.w,
            height: r.h,
            top: r.t,
            left: r.l,
            background: r.color,
            cursor: "pointer",
            animationDelay: `${i * 0.06}s`,
          }}
          onClick={(e) => { e.stopPropagation(); onClickColor(r.ci); }}
        />
      ))}
    </div>
  );
}

// --- Diamond shape centered on a field ---
function Diamond({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(0)}>
      <div
        className={styles.animExpand}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "55vmin",
          height: "55vmin",
          transform: "translate(-50%, -50%) rotate(45deg)",
          background: c2,
          cursor: "pointer",
          animationDelay: "0.06s",
        }}
        onClick={(e) => { e.stopPropagation(); onClickColor(1); }}
      >
        <div
          className={styles.animExpand}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "55%",
            height: "55%",
            transform: "translate(-50%, -50%)",
            background: c3 || c1,
            cursor: "pointer",
            animationDelay: "0.14s",
          }}
          onClick={(e) => { e.stopPropagation(); onClickColor(c3 ? 2 : 0); }}
        />
      </div>
    </div>
  );
}

// --- Staircase stepping diagonally ---
function Steps({ palette, onClickColor }) {
  const count = 6;
  const stepW = 100 / count;
  const stepH = 100 / count;
  return (
    <div className={styles.comp} style={{ position: "relative", overflow: "hidden", background: palette[0] }} onClick={() => onClickColor(0)}>
      {Array.from({ length: count }, (_, i) => {
        const ci = i % palette.length;
        return (
          <div
            key={i}
            className={styles.animCell}
            style={{
              position: "absolute",
              left: `${i * stepW}%`,
              top: `${i * stepH}%`,
              width: `${100 - i * stepW}%`,
              height: `${100 - i * stepH}%`,
              background: palette[ci],
              cursor: "pointer",
              animationDelay: `${i * 0.04}s`,
            }}
            onClick={(e) => { e.stopPropagation(); onClickColor(ci); }}
          />
        );
      })}
    </div>
  );
}

// --- Three circles in a triangle arrangement ---
function Triad({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const bg = c4 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: bg, position: "relative" }} onClick={() => onClickColor(c4 ? 3 : 0)}>
      <div className={styles.animGrow} style={{ position: "absolute", width: "30vmin", height: "30vmin", borderRadius: "50%", background: c1, top: "15%", left: "50%", transform: "translateX(-50%)", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onClickColor(0); }} />
      <div className={styles.animGrow} style={{ position: "absolute", width: "30vmin", height: "30vmin", borderRadius: "50%", background: c2, bottom: "18%", left: "22%", transform: "translateX(-50%)", cursor: "pointer", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(1); }} />
      <div className={styles.animGrow} style={{ position: "absolute", width: "30vmin", height: "30vmin", borderRadius: "50%", background: c3 || c1, bottom: "18%", right: "22%", transform: "translateX(50%)", cursor: "pointer", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 ? 2 : 0); }} />
    </div>
  );
}

/* ============================================================
   REGISTRY
   ============================================================ */

export const COMP_REGISTRY = {
  nested:   { label: "Nested",   component: Nested },
  slabs:    { label: "Slabs",    component: Slabs },
  columns:  { label: "Columns",  component: Columns },
  rings:    { label: "Rings",    component: Rings },
  eclipse:  { label: "Eclipse",  component: Eclipse },
  quarters: { label: "Quarters", component: Quarters },
  split:    { label: "Split",    component: Split },
  mondrian: { label: "Mondrian", component: Mondrian },
  frame:    { label: "Frame",    component: Frame },
  stack:    { label: "Stack",    component: Stack },
  diagonal: { label: "Diagonal", component: Diagonal },
  stripes:  { label: "Stripes",  component: Stripes },
  grid:     { label: "Grid",     component: Grid },
  duo:      { label: "Duo",      component: Duo },
  corners:  { label: "Corners",  component: Corners },
  horizon:  { label: "Horizon",  component: Horizon },
  cascade:  { label: "Cascade",  component: Cascade },
  cross:    { label: "Cross",    component: Cross },
  ladder:   { label: "Ladder",   component: Ladder },
  orbit:    { label: "Orbit",    component: Orbit },
  weave:    { label: "Weave",    component: Weave },
  totem:    { label: "Totem",    component: Totem },
  float:    { label: "Float",    component: Float },
  diamond:  { label: "Diamond",  component: Diamond },
  steps:    { label: "Steps",    component: Steps },
  triad:    { label: "Triad",    component: Triad },
};

export const COMP_KEYS = Object.keys(COMP_REGISTRY);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function Composition() {
  const palette = useMuseStore((s) => s.palette);
  const compType = useMuseStore((s) => s.compType);
  const compositionKey = useMuseStore((s) => s.compositionKey);

  const [pings, setPings] = useState([]);
  const clickPos = useRef({ x: 0, y: 0 });

  const handleClickColor = useCallback((index) => {
    const hex = useMuseStore.getState().palette[index];
    if (!hex) return;
    navigator.clipboard.writeText(hex);

    const id = Date.now() + Math.random();
    const { x, y } = clickPos.current;
    setPings((prev) => [...prev, { id, hex, x, y }]);

    setTimeout(() => {
      setPings((prev) => prev.filter((p) => p.id !== id));
    }, 2200);
  }, []);

  const entry = COMP_REGISTRY[compType] || COMP_REGISTRY.nested;
  const CompComponent = entry.component;

  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={compositionKey}
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClickCapture={(e) => {
            clickPos.current = { x: e.clientX, y: e.clientY };
          }}
        >
          <CompComponent palette={palette} onClickColor={handleClickColor} />
        </motion.div>
      </AnimatePresence>

      {/* Copy swatch — paint chip rises from click point */}
      <AnimatePresence>
        {pings.map((ping) => {
          const oklch = hexToOklch(ping.hex);
          const textOnColor = accessibleTextColor(ping.hex);
          // Nudge position so the card doesn't overflow viewport edges
          const cardW = 130;
          const cardH = 132;
          const x = Math.min(Math.max(ping.x - cardW / 2, 12), window.innerWidth - cardW - 12);
          const y = Math.min(Math.max(ping.y - cardH / 2, 12), window.innerHeight - cardH - 12);

          return (
            <motion.div
              key={ping.id}
              className={styles.swatch}
              style={{ left: x, top: y }}
              initial={{ opacity: 0, y: 24, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{
                enter: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                exit: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              {/* Color field — top portion */}
              <div
                className={styles.swatchColor}
                style={{ background: ping.hex }}
              >
                <motion.span
                  className={styles.swatchCopied}
                  style={{ color: textOnColor }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.75, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  Copied
                </motion.span>
              </div>

              {/* Info — bottom portion */}
              <div className={styles.swatchInfo}>
                <motion.span
                  className={styles.swatchHex}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {ping.hex}
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
}

export default Composition;
