import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMuseStore from "../../store/useMuseStore.js";
import { accessibleTextColor, hexToOklch } from "../../lib/color/index.js";
import styles from "./Composition.module.css";

/* ============================================================
   COMPOSITIONS
   onClickColor(hex) — always pass the actual displayed color
   ============================================================ */

function Rings({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  return (
    <div className={styles.comp}>
      <div className={`${styles.ringsOuter} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
        <div className={`${styles.ringsMid} ${styles.animExpand}`} style={{ background: c2, animationDelay: "0.05s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }}>
          <div className={`${styles.ringsInner} ${styles.animExpand}`} style={{ background: c3 || c1, animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 || c1); }}>
            <div className={`${styles.ringsCore} ${styles.animExpand}`} style={{ background: c4 || c2, animationDelay: "0.19s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c4 || c2); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Slabs({ palette, onClickColor }) {
  return (
    <div className={styles.comp} style={{ display: "flex", flexDirection: "column" }}>
      {palette.map((color, i) => (
        <div key={i} className={`${styles.slab} ${styles.animRevealH}`} style={{ background: color, flex: i === 0 ? 2.5 : i === 1 ? 1.8 : 1, animationDelay: `${i * 0.07}s` }} onClick={() => onClickColor(color)} />
      ))}
    </div>
  );
}

function Eclipse({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={`${styles.eclipseCircle} ${styles.animExpand}`} style={{ background: c2, animationDelay: "0.08s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }}>
        <div className={`${styles.eclipseInner} ${styles.animExpand}`} style={{ background: c3 || c1, animationDelay: "0.16s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 || c1); }} />
      </div>
    </div>
  );
}

function Quarters({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const colors = [c1, c2, c3 || c1, c4 || c2];
  const anims = [styles.animCornerTL, styles.animCornerTR, styles.animCornerBL, styles.animCornerBR];
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
      {colors.map((color, i) => (
        <div key={i} className={anims[i]} style={{ background: color, animationDelay: `${i * 0.04}s` }} onClick={() => onClickColor(color)} />
      ))}
    </div>
  );
}

function Nested({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => onClickColor(c1)}>
      <div className={`${styles.nestedRect} ${styles.animExpand}`} style={{ background: c2, width: "75%", height: "75%", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }}>
        <div className={`${styles.nestedRect} ${styles.animExpand}`} style={{ background: c3 || c1, width: "65%", height: "65%", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c3 || c1); }}>
          <div className={`${styles.nestedRect} ${styles.animExpand}`} style={{ background: c4 || c2, width: "55%", height: "55%", animationDelay: "0.18s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c4 || c2); }} />
        </div>
      </div>
    </div>
  );
}

function Columns({ palette, onClickColor }) {
  return (
    <div className={styles.comp} style={{ display: "flex" }}>
      {palette.map((color, i) => (
        <div key={i} className={`${styles.slab} ${styles.animRevealW}`} style={{ background: color, flex: i === 0 ? 2.2 : i === palette.length - 1 ? 1.5 : 1, animationDelay: `${i * 0.07}s` }} onClick={() => onClickColor(color)} />
      ))}
    </div>
  );
}

function Split({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const accent = c3 || c2;
  return (
    <div className={styles.comp} style={{ display: "flex" }}>
      <div className={styles.animWipeRight} style={{ flex: 1, background: c1 }} onClick={() => onClickColor(c1)} />
      <div className={styles.animFade} style={{ width: "4%", background: accent, animationDelay: "0.15s" }} onClick={() => onClickColor(accent)} />
      <div className={styles.animWipeLeft} style={{ flex: 1, background: c2 }} onClick={() => onClickColor(c2)} />
    </div>
  );
}

function Mondrian({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const cc3 = c3 || c1, cc4 = c4 || c2;
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr 2fr", gap: "3px", background: "#111" }}>
      <div className={styles.animCell} style={{ background: c1, gridRow: "1 / 3", animationDelay: "0s" }} onClick={() => onClickColor(c1)} />
      <div className={styles.animCell} style={{ background: c2, animationDelay: "0.04s" }} onClick={() => onClickColor(c2)} />
      <div className={styles.animCell} style={{ background: cc3, gridRow: "1 / 3", animationDelay: "0.08s" }} onClick={() => onClickColor(cc3)} />
      <div className={styles.animCell} style={{ background: cc4, animationDelay: "0.12s" }} onClick={() => onClickColor(cc4)} />
      <div className={styles.animCell} style={{ background: c2, gridColumn: "1 / 3", animationDelay: "0.16s" }} onClick={() => onClickColor(c2)} />
      <div className={styles.animCell} style={{ background: c1, animationDelay: "0.2s" }} onClick={() => onClickColor(c1)} />
    </div>
  );
}

function Frame({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const inner = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => onClickColor(c1)}>
      <div className={styles.animExpand} style={{ width: "80%", height: "75%", background: c2, display: "flex", alignItems: "center", justifyContent: "center", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }}>
        <div className={styles.animExpand} style={{ width: "82%", height: "80%", background: inner, animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(inner); }} />
      </div>
    </div>
  );
}

function Stack({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const colors = [c2, c3 || c1, c4 || c2];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(c1)}>
      {colors.map((color, i) => (
        <div key={i} className={`${styles.stackCard} ${styles.animSlide}`} style={{ background: color, width: `${70 - i * 8}%`, height: `${55 - i * 6}%`, top: `${15 + i * 14}%`, left: `${15 + i * 6}%`, animationDelay: `${i * 0.08}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(color); }} />
      ))}
    </div>
  );
}

function Diagonal({ palette, onClickColor }) {
  const [c1, c2] = palette;
  return (
    <div className={styles.comp} style={{ position: "relative", overflow: "hidden" }}>
      <div className={styles.animDiagTL} style={{ position: "absolute", inset: 0, background: c1, clipPath: "polygon(0 0, 100% 0, 0 100%)" }} onClick={() => onClickColor(c1)} />
      <div className={styles.animDiagBR} style={{ position: "absolute", inset: 0, background: c2, clipPath: "polygon(100% 0, 100% 100%, 0 100%)", animationDelay: "0.08s" }} onClick={() => onClickColor(c2)} />
    </div>
  );
}

function Stripes({ palette, onClickColor }) {
  const count = 12;
  return (
    <div className={styles.comp} style={{ display: "flex", flexDirection: "column" }}>
      {Array.from({ length: count }, (_, i) => {
        const color = palette[i % palette.length];
        return <div key={i} className={styles.animRevealH} style={{ flex: 1, background: color, animationDelay: `${i * 0.025}s` }} onClick={() => onClickColor(color)} />;
      })}
    </div>
  );
}

function Grid({ palette, onClickColor }) {
  const cols = palette.length >= 4 ? 4 : 3;
  const rows = 3;
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const color = palette[i % palette.length];
        return <div key={i} className={styles.animCell} style={{ background: color, animationDelay: `${i * 0.025}s` }} onClick={() => onClickColor(color)} />;
      })}
    </div>
  );
}

function Duo({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const bg = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: bg, display: "flex", alignItems: "center", justifyContent: "center", gap: "5vw" }} onClick={() => onClickColor(bg)}>
      <div className={styles.animGrow} style={{ width: "30vmin", height: "30vmin", borderRadius: "50%", background: c1 }} onClick={(e) => { e.stopPropagation(); onClickColor(c1); }} />
      <div className={styles.animGrow} style={{ width: "30vmin", height: "30vmin", borderRadius: "50%", background: c2, animationDelay: "0.08s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
    </div>
  );
}

function Corners({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const cc3 = c3 || c2, cc4 = c4 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(c1)}>
      <div className={styles.animCornerTL} style={{ position: "absolute", top: 0, left: 0, width: "45%", height: "40%", background: c2 }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animCornerBR} style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "50%", background: cc3, animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(cc3); }} />
      <div className={styles.animCornerBL} style={{ position: "absolute", bottom: 0, left: 0, width: "30%", height: "25%", background: cc4, animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(cc4); }} />
    </div>
  );
}

function Horizon({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const accent = c3 || c2;
  return (
    <div className={styles.comp} style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.animFade} style={{ flex: 5, background: c1 }} onClick={() => onClickColor(c1)} />
      <div className={styles.animFade} style={{ flex: 0.3, background: accent, animationDelay: "0.12s" }} onClick={() => onClickColor(accent)} />
      <div className={styles.animFade} style={{ flex: 4, background: c2, animationDelay: "0.06s" }} onClick={() => onClickColor(c2)} />
    </div>
  );
}

function Cascade({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const circles = [c2, c3 || c1, c4 || c2, c1];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(c1)}>
      {circles.map((color, i) => (
        <div key={i} className={styles.animGrow} style={{ position: "absolute", width: "38vmin", height: "38vmin", borderRadius: "50%", background: color, top: `${12 + i * 18}%`, left: `${10 + i * 20}%`, animationDelay: `${i * 0.06}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(color); }} />
      ))}
    </div>
  );
}

function Cross({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const center = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(c1)}>
      <div className={styles.animRevealW} style={{ position: "absolute", top: "38%", left: 0, right: 0, height: "24%", background: c2 }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animRevealH} style={{ position: "absolute", left: "40%", top: 0, bottom: 0, width: "20%", background: c2, animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animExpand} style={{ position: "absolute", top: "38%", left: "40%", width: "20%", height: "24%", background: center, animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(center); }} />
    </div>
  );
}

function Ladder({ palette, onClickColor }) {
  const [c1, c2] = palette;
  return (
    <div className={styles.comp} style={{ background: c1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-evenly", padding: "5% 15%" }} onClick={() => onClickColor(c1)}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className={styles.animRevealW} style={{ height: "4%", background: c2, animationDelay: `${i * 0.03}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      ))}
    </div>
  );
}

function Orbit({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const count = 8;
  const rx = 30, ry = 22;
  const dotColors = [c2, c3 || c2, c4 || c2];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(c1)}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const color = dotColors[i % dotColors.length];
        return (
          <div key={i} className={styles.animGrow} style={{ position: "absolute", width: "8vmin", height: "8vmin", borderRadius: "50%", background: color, top: `calc(50% + ${Math.sin(angle) * ry}vmin - 4vmin)`, left: `calc(50% + ${Math.cos(angle) * rx}vmin - 4vmin)`, animationDelay: `${i * 0.04}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(color); }} />
        );
      })}
    </div>
  );
}

function Weave({ palette, onClickColor }) {
  const [c1, c2] = palette;
  const count = 6;
  const cells = [];
  for (let r = 0; r < count; r++) for (let col = 0; col < count; col++) cells.push({ r, col, color: (r + col) % 2 === 0 ? c1 : c2 });
  return (
    <div className={styles.comp} style={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gridTemplateRows: `repeat(${count}, 1fr)` }}>
      {cells.map(({ r, col, color }, i) => (
        <div key={i} className={styles.animCell} style={{ background: color, animationDelay: `${(r + col) * 0.02}s` }} onClick={() => onClickColor(color)} />
      ))}
    </div>
  );
}

function Totem({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const bars = [
    { h: 55, color: c2 },
    { h: 75, color: c3 || c1 },
    { h: 90, color: c1 },
    { h: 70, color: c4 || c2 },
    { h: 50, color: c2 },
  ];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "1.5vw", padding: "0 15%" }} onClick={() => onClickColor(c1)}>
      {bars.map((bar, i) => (
        <div key={i} className={styles.animRevealH} style={{ width: "8vw", height: `${bar.h}%`, background: bar.color, animationDelay: `${i * 0.05}s`, transformOrigin: "bottom" }} onClick={(e) => { e.stopPropagation(); onClickColor(bar.color); }} />
      ))}
    </div>
  );
}

function Float({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const rects = [
    { w: "35%", h: "28%", t: "8%", l: "5%", color: c2 },
    { w: "25%", h: "40%", t: "45%", l: "60%", color: c3 || c1 },
    { w: "18%", h: "22%", t: "15%", l: "55%", color: c4 || c2 },
    { w: "30%", h: "18%", t: "72%", l: "12%", color: c2 },
  ];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1, position: "relative" }} onClick={() => onClickColor(c1)}>
      {rects.map((r, i) => (
        <div key={i} className={styles.animCell} style={{ position: "absolute", width: r.w, height: r.h, top: r.t, left: r.l, background: r.color, animationDelay: `${i * 0.06}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(r.color); }} />
      ))}
    </div>
  );
}

function Diamond({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const inner = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animExpand} style={{ position: "absolute", top: "50%", left: "50%", width: "55vmin", height: "55vmin", transform: "translate(-50%, -50%) rotate(45deg)", background: c2, animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }}>
        <div className={styles.animExpand} style={{ position: "absolute", top: "50%", left: "50%", width: "55%", height: "55%", transform: "translate(-50%, -50%)", background: inner, animationDelay: "0.14s" }} onClick={(e) => { e.stopPropagation(); onClickColor(inner); }} />
      </div>
    </div>
  );
}

function Steps({ palette, onClickColor }) {
  const count = 6;
  const stepW = 100 / count, stepH = 100 / count;
  return (
    <div className={styles.comp} style={{ position: "relative", overflow: "hidden", background: palette[0] }} onClick={() => onClickColor(palette[0])}>
      {Array.from({ length: count }, (_, i) => {
        const color = palette[i % palette.length];
        return <div key={i} className={styles.animCell} style={{ position: "absolute", left: `${i * stepW}%`, top: `${i * stepH}%`, width: `${100 - i * stepW}%`, height: `${100 - i * stepH}%`, background: color, animationDelay: `${i * 0.04}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(color); }} />;
      })}
    </div>
  );
}

function Triad({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const bg = c4 || c1;
  const cc3 = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: bg, position: "relative" }} onClick={() => onClickColor(bg)}>
      <div className={styles.animGrow} style={{ position: "absolute", width: "30vmin", height: "30vmin", borderRadius: "50%", background: c1, top: "15%", left: "50%", transform: "translateX(-50%)" }} onClick={(e) => { e.stopPropagation(); onClickColor(c1); }} />
      <div className={styles.animGrow} style={{ position: "absolute", width: "30vmin", height: "30vmin", borderRadius: "50%", background: c2, bottom: "18%", left: "22%", transform: "translateX(-50%)", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animGrow} style={{ position: "absolute", width: "30vmin", height: "30vmin", borderRadius: "50%", background: cc3, bottom: "18%", right: "22%", transform: "translateX(50%)", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(cc3); }} />
    </div>
  );
}

/* ============================================================
   NEW COMPOSITIONS — 15 additional designs
   ============================================================ */

function Sunrise({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const colors = [c1, c2, c3 || c1, c4 || c2];
  const anims = [styles.animWedgeTop, styles.animWedgeRight, styles.animWedgeBottom, styles.animWedgeLeft];
  return (
    <div className={styles.comp}>
      {anims.map((anim, i) => (
        <div key={i} className={anim} style={{ position: "absolute", inset: 0, background: colors[i], animationDelay: `${i * 0.07}s` }} onClick={() => onClickColor(colors[i])} />
      ))}
    </div>
  );
}

function Crescent({ palette, onClickColor }) {
  const [c1, c2] = palette;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animExpand} style={{ position: "absolute", left: "calc(50% - 25vmin)", top: "calc(50% - 25vmin)", width: "50vmin", height: "50vmin", borderRadius: "50%", background: c2, animationDelay: "0.08s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animFade} style={{ position: "absolute", left: "calc(50% - 13vmin)", top: "calc(50% - 30vmin)", width: "42vmin", height: "42vmin", borderRadius: "50%", background: c1, animationDelay: "0.16s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c1); }} />
    </div>
  );
}

function Spotlight({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const stage = c3 || c2;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animGrow} style={{ position: "absolute", left: "calc(70% - 7vmin)", top: "calc(18% - 7vmin)", width: "14vmin", height: "14vmin", borderRadius: "50%", background: c2, animationDelay: "0.1s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animFade} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: stage, animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(stage); }} />
    </div>
  );
}

function Hex({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const inner = c3 || c1;
  const hexPoly = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animExpand} style={{ position: "absolute", left: "calc(50% - 32vmin)", top: "calc(50% - 32vmin)", width: "64vmin", height: "64vmin", background: c2, clipPath: hexPoly, animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animExpand} style={{ position: "absolute", left: "calc(50% - 18vmin)", top: "calc(50% - 18vmin)", width: "36vmin", height: "36vmin", background: inner, clipPath: hexPoly, animationDelay: "0.14s" }} onClick={(e) => { e.stopPropagation(); onClickColor(inner); }} />
    </div>
  );
}

function Ripple({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const ringColors = [c2, c3 || c2, c4 || c2];
  const rings = [
    { size: 65, border: 5 },
    { size: 42, border: 4 },
    { size: 22, border: 3 },
  ];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      {rings.map((r, i) => {
        const color = ringColors[i % ringColors.length];
        return (
          <div key={i} className={styles.animExpand} style={{ position: "absolute", left: `calc(50% - ${r.size / 2}vmin)`, top: `calc(50% - ${r.size / 2}vmin)`, width: `${r.size}vmin`, height: `${r.size}vmin`, borderRadius: "50%", border: `${r.border}vmin solid ${color}`, background: "transparent", transition: "border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1)", animationDelay: `${i * 0.08}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(color); }} />
        );
      })}
    </div>
  );
}

function Arch({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const inner = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animGrow} style={{ position: "absolute", bottom: 0, left: "calc(50% - 38vmin)", width: "76vmin", height: "70vmin", borderRadius: "38vmin 38vmin 0 0", background: c2, transformOrigin: "center bottom", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }}>
        <div className={styles.animGrow} style={{ position: "absolute", bottom: 0, left: "10vmin", width: "56vmin", height: "60vmin", borderRadius: "28vmin 28vmin 0 0", background: inner, transformOrigin: "center bottom", animationDelay: "0.14s" }} onClick={(e) => { e.stopPropagation(); onClickColor(inner); }} />
      </div>
    </div>
  );
}

function Lens({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const iris = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animFade} style={{ position: "absolute", inset: 0, background: c2, clipPath: "ellipse(45% 22% at 50% 50%)", animationDelay: "0.08s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animGrow} style={{ position: "absolute", left: "calc(50% - 10vmin)", top: "calc(50% - 10vmin)", width: "20vmin", height: "20vmin", borderRadius: "50%", background: iris, animationDelay: "0.14s" }} onClick={(e) => { e.stopPropagation(); onClickColor(iris); }} />
    </div>
  );
}

function Pyramid({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const inner = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animExpand} style={{ position: "absolute", inset: 0, background: c2, clipPath: "polygon(50% 10%, 90% 90%, 10% 90%)", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animExpand} style={{ position: "absolute", inset: 0, background: inner, clipPath: "polygon(50% 30%, 75% 80%, 25% 80%)", animationDelay: "0.14s" }} onClick={(e) => { e.stopPropagation(); onClickColor(inner); }} />
    </div>
  );
}

function Chevron({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const inner = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animExpand} style={{ position: "absolute", inset: 0, background: c2, clipPath: "polygon(0% 100%, 50% 25%, 100% 100%)", animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animExpand} style={{ position: "absolute", inset: 0, background: inner, clipPath: "polygon(12% 100%, 50% 42%, 88% 100%)", animationDelay: "0.12s" }} onClick={(e) => { e.stopPropagation(); onClickColor(inner); }} />
    </div>
  );
}

function DotGrid({ palette, onClickColor }) {
  const cols = 5, rows = 4;
  return (
    <div className={styles.comp} style={{ background: palette[0], display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }} onClick={() => onClickColor(palette[0])}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const color = palette[(i % (palette.length - 1)) + 1];
        const col = i % cols, row = Math.floor(i / cols);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e) => { e.stopPropagation(); onClickColor(color); }}>
            <div className={styles.animGrow} style={{ width: "6vmin", height: "6vmin", borderRadius: "50%", background: color, animationDelay: `${(col + row) * 0.03}s` }} />
          </div>
        );
      })}
    </div>
  );
}

function Letterbox({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const accent = c3 || c1;
  return (
    <div className={styles.comp} style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.animRevealH} style={{ flex: "0 0 20%", background: c1 }} onClick={() => onClickColor(c1)} />
      <div className={styles.animFade} style={{ flex: 1, background: c2, display: "flex", alignItems: "center", justifyContent: "center", animationDelay: "0.06s" }} onClick={() => onClickColor(c2)}>
        <div className={styles.animGrow} style={{ width: "18vmin", height: "18vmin", borderRadius: "50%", background: accent, animationDelay: "0.14s" }} onClick={(e) => { e.stopPropagation(); onClickColor(accent); }} />
      </div>
      <div className={styles.animRevealUp} style={{ flex: "0 0 20%", background: c1, animationDelay: "0.04s" }} onClick={() => onClickColor(c1)} />
    </div>
  );
}

function Canyon({ palette, onClickColor }) {
  const [c1, c2, c3] = palette;
  const cc3 = c3 || c1;
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      <div className={styles.animGrow} style={{ position: "absolute", left: "-25vmin", top: "calc(50% - 40vmin)", width: "80vmin", height: "80vmin", borderRadius: "50%", background: c2, animationDelay: "0.06s" }} onClick={(e) => { e.stopPropagation(); onClickColor(c2); }} />
      <div className={styles.animGrow} style={{ position: "absolute", right: "-25vmin", top: "calc(50% - 40vmin)", width: "80vmin", height: "80vmin", borderRadius: "50%", background: cc3, animationDelay: "0.1s" }} onClick={(e) => { e.stopPropagation(); onClickColor(cc3); }} />
    </div>
  );
}

function Bloom({ palette, onClickColor }) {
  const [c1, c2, c3, c4] = palette;
  const cc3 = c3 || c1, cc4 = c4 || c2;
  const circles = [
    { size: 35, ox: -8, oy: -6, color: c2, delay: 0.06 },
    { size: 30, ox: 10, oy: -4, color: cc3, delay: 0.1 },
    { size: 28, ox: -3, oy: 10, color: cc4, delay: 0.14 },
    { size: 22, ox: 12, oy: 8, color: c2, delay: 0.18 },
  ];
  return (
    <div className={`${styles.comp} ${styles.animFade}`} style={{ background: c1 }} onClick={() => onClickColor(c1)}>
      {circles.map((c, i) => (
        <div key={i} className={styles.animGrow} style={{ position: "absolute", left: `calc(50% + ${c.ox}vmin - ${c.size / 2}vmin)`, top: `calc(50% + ${c.oy}vmin - ${c.size / 2}vmin)`, width: `${c.size}vmin`, height: `${c.size}vmin`, borderRadius: "50%", background: c.color, animationDelay: `${c.delay}s` }} onClick={(e) => { e.stopPropagation(); onClickColor(c.color); }} />
      ))}
    </div>
  );
}

/* Pre-computed wavy polygon — 40 segments, gentle sine */
const _wN = 40;
const _wPts = [];
for (let i = 0; i <= _wN; i++) {
  _wPts.push({ x: ((i / _wN) * 100), y: (50 + 4 * Math.sin((i / _wN) * Math.PI * 3)) });
}
const WAVE_TOP = `polygon(0% 0%, 100% 0%, ${_wPts.slice().reverse().map(p => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(", ")})`;
const WAVE_BTM = `polygon(${_wPts.map(p => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(", ")}, 100% 100%, 0% 100%)`;

function Wave({ palette, onClickColor }) {
  const [c1, c2] = palette;
  return (
    <div className={styles.comp}>
      <div className={styles.animFade} style={{ position: "absolute", inset: 0, background: c2 }} onClick={() => onClickColor(c2)} />
      <div className={styles.animExpand} style={{ position: "absolute", inset: 0, background: c1, clipPath: WAVE_TOP, animationDelay: "0.06s" }} onClick={() => onClickColor(c1)} />
    </div>
  );
}

/* ============================================================
   REGISTRY
   ============================================================ */

export const COMP_REGISTRY = {
  nested: { label: "Nested", component: Nested },
  slabs: { label: "Slabs", component: Slabs },
  columns: { label: "Columns", component: Columns },
  rings: { label: "Rings", component: Rings },
  eclipse: { label: "Eclipse", component: Eclipse },
  quarters: { label: "Quarters", component: Quarters },
  split: { label: "Split", component: Split },
  mondrian: { label: "Mondrian", component: Mondrian },
  frame: { label: "Frame", component: Frame },
  stack: { label: "Stack", component: Stack },
  diagonal: { label: "Diagonal", component: Diagonal },
  stripes: { label: "Stripes", component: Stripes },
  grid: { label: "Grid", component: Grid },
  duo: { label: "Duo", component: Duo },
  corners: { label: "Corners", component: Corners },
  horizon: { label: "Horizon", component: Horizon },
  cascade: { label: "Cascade", component: Cascade },
  cross: { label: "Cross", component: Cross },
  ladder: { label: "Ladder", component: Ladder },
  orbit: { label: "Orbit", component: Orbit },
  weave: { label: "Weave", component: Weave },
  totem: { label: "Totem", component: Totem },
  float: { label: "Float", component: Float },
  diamond: { label: "Diamond", component: Diamond },
  steps: { label: "Steps", component: Steps },
  triad: { label: "Triad", component: Triad },
  sunrise: { label: "Sunrise", component: Sunrise },
  crescent: { label: "Crescent", component: Crescent },
  spotlight: { label: "Spotlight", component: Spotlight },
  hex: { label: "Hex", component: Hex },
  ripple: { label: "Ripple", component: Ripple },
  arch: { label: "Arch", component: Arch },
  lens: { label: "Lens", component: Lens },
  pyramid: { label: "Pyramid", component: Pyramid },
  chevron: { label: "Chevron", component: Chevron },
  dotgrid: { label: "Dot Grid", component: DotGrid },
  letterbox: { label: "Letterbox", component: Letterbox },
  canyon: { label: "Canyon", component: Canyon },
  bloom: { label: "Bloom", component: Bloom },
  wave: { label: "Wave", component: Wave },
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

  useEffect(() => {
    setPings([]);
  }, [compositionKey]);

  const handleClickColor = useCallback((hex) => {
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

      <AnimatePresence>
        {pings.map((ping) => {
          const textOnColor = accessibleTextColor(ping.hex);
          const cardW = 120, cardH = 130;
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
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.swatchColor} style={{ background: ping.hex }}>
                <motion.span className={styles.swatchCopied} style={{ color: textOnColor }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 0.75, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
                  Copied
                </motion.span>
              </div>
              <div className={styles.swatchInfo}>
                <motion.span className={styles.swatchHex} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
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
