import { useMemo } from "react";
import styles from "./Particles.module.css";

function Particles({ count = 50 }) {
  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.35,
      duration: 20 + Math.random() * 40,
      delay: Math.random() * -60,
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 30,
    }));
  }, [count]);

  return (
    <div className={styles.field}>
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={styles.dot}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            animationDuration: `${dot.duration}s`,
            animationDelay: `${dot.delay}s`,
            "--drift-x": `${dot.driftX}px`,
            "--drift-y": `${dot.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}

export default Particles;
