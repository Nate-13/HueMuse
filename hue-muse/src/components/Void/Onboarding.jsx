import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Onboarding.module.css";

function Onboarding() {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem("huemuse-onboarded"),
  );

  useEffect(() => {
    if (!visible) return;
    const handle = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setVisible(false);
        localStorage.setItem("huemuse-onboarded", "1");
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [visible]);

  const row = (i, delay) => ({
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={styles.title}>HueMuse</h1>
            <a
              href="https://nateborwick.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.author}
            >
              by Nate Borwick
            </a>
          </motion.div>

          <div className={styles.grid}>
            {/* Space */}
            <motion.div className={styles.cell} {...row(0, 0.15)}>
              <span className={`${styles.key} ${styles.keyWide} ${styles.keyPulse}`}>
                space
              </span>
            </motion.div>
            <motion.span className={styles.label} {...row(0, 0.15)}>
              new palette
            </motion.span>

            {/* Arrows */}
            <motion.div className={styles.cell} {...row(1, 0.23)}>
              <div className={styles.keyPair}>
                <span className={`${styles.key} ${styles.keyArrow}`}>←</span>
                <span className={`${styles.key} ${styles.keyArrow}`}>→</span>
              </div>
            </motion.div>
            <motion.span className={styles.label} {...row(1, 0.23)}>
              go back / forward
            </motion.span>

            {/* Scroll */}
            <motion.div className={styles.cell} {...row(2, 0.31)}>
              <div className={styles.iconGroup}>
                <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
                  <rect x="1" y="1" width="16" height="24" rx="8" stroke="rgba(255,253,239,0.3)" strokeWidth="1.2" />
                  <rect className={styles.scrollDot} x="7.5" y="5.5" width="3" height="4.5" rx="1.5" fill="rgba(255,253,239,0.45)" />
                </svg>
                <span className={styles.iconLabel}>scroll</span>
              </div>
            </motion.div>
            <motion.span className={styles.label} {...row(2, 0.31)}>
              shift hue
            </motion.span>

            {/* Click */}
            <motion.div className={styles.cell} {...row(3, 0.39)}>
              <div className={styles.iconGroup}>
                <svg width="16" height="20" viewBox="0 0 24 28" fill="none">
                  <path d="M5 3l14 9-7 2-4 7z" fill="rgba(255,253,239,0.45)" />
                </svg>
                <span className={styles.iconLabel}>click</span>
              </div>
            </motion.div>
            <motion.span className={styles.label} {...row(3, 0.39)}>
              copy color
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Onboarding;
