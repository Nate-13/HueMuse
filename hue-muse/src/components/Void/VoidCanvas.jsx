import { useEffect, useRef } from "react";
import useMuseStore from "../../store/useMuseStore.js";
import Particles from "./Particles.jsx";
import Onboarding from "./Onboarding.jsx";
import Composition from "../Composition/Composition.jsx";
import HUD from "../Composition/HUD.jsx";
import HueSteps from "../Composition/HueSteps.jsx";
import styles from "./VoidCanvas.module.css";

function VoidCanvas() {
  const generate = useMuseStore((s) => s.generate);
  const stepHue = useMuseStore((s) => s.stepHue);
  const historyBack = useMuseStore((s) => s.historyBack);
  const historyForward = useMuseStore((s) => s.historyForward);
  const scrollAccum = useRef(0);
  const scrollCooldown = useRef(false);

  // Keyboard: Space → new, Left/Right → history
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target !== document.body) return;

      if (e.code === "Space") {
        e.preventDefault();
        generate();
      } else if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
        e.preventDefault();
        historyBack();
      } else if (e.code === "ArrowRight" || e.code === "ArrowDown") {
        e.preventDefault();
        historyForward();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [generate, historyBack, historyForward]);

  // Scroll → step through hue positions (10 snapped stops, looping)
  useEffect(() => {
    const THRESHOLD = 60; // accumulated scroll pixels to trigger one step
    const COOLDOWN_MS = 150; // minimum time between steps for clean feel

    const handleWheel = (e) => {
      e.preventDefault();
      scrollAccum.current += e.deltaY;

      if (scrollCooldown.current) return;

      if (Math.abs(scrollAccum.current) >= THRESHOLD) {
        const direction = scrollAccum.current > 0 ? 1 : -1;
        stepHue(direction);
        scrollAccum.current = 0;
        scrollCooldown.current = true;
        setTimeout(() => {
          scrollCooldown.current = false;
        }, COOLDOWN_MS);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [stepHue]);

  return (
    <div className={styles.canvas}>
      <Particles count={40} />
      <Composition />
      <HueSteps />
      <HUD />
      <Onboarding />
    </div>
  );
}

export default VoidCanvas;
