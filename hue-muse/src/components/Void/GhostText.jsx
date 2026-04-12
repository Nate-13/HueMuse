import { useState, useEffect, useRef } from "react";
import styles from "./GhostText.module.css";

const TAGLINES = [
  "stars in the Milky Way",
  "drops of water in a thunderstorm",
  "Google searches ever made",
  "seconds in a millennium",
  "photographs ever taken",
  "cells in your body",
];

function GhostText() {
  const [text, setText] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let charIndex = 0;
    let deleting = false;
    const current = TAGLINES[taglineIndex];

    const tick = () => {
      if (!deleting && charIndex <= current.length) {
        setText(current.slice(0, charIndex));
        charIndex++;
        timeoutRef.current = setTimeout(tick, 60);
      } else if (!deleting) {
        timeoutRef.current = setTimeout(() => {
          deleting = true;
          tick();
        }, 5000);
      } else if (deleting && charIndex >= 0) {
        setText(current.slice(0, charIndex));
        charIndex--;
        timeoutRef.current = setTimeout(tick, 30);
      } else {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
      }
    };

    tick();
    return () => clearTimeout(timeoutRef.current);
  }, [taglineIndex]);

  return (
    <div className={styles.container}>
      <span className={styles.prefix}>More color combinations than</span>
      <span className={styles.tagline}>{text}</span>
    </div>
  );
}

export default GhostText;
