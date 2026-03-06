import { useState } from 'react';
import styles from './Controls.module.css';

export default function Controls({
  isRunning, isPaused, isDone,
  onRun, onPause, onResume, onReset,
  onShuffle, onSorted, onReversed,
  speed, onSpeedChange,
  size, onSizeChange,
  algoType,
}) {
  const isGraph = ['bfs', 'dfs'].includes(algoType);
  const isDS = ['stack', 'queue', 'linkedlist'].includes(algoType);

  return (
    <div className={styles.controls}>
      <div className={styles.group}>
        {!isRunning && !isPaused ? (
          <button className={`${styles.btn} ${styles.primary}`} onClick={onRun}>
            <span className={styles.icon}>▶</span> Run
          </button>
        ) : isPaused ? (
          <button className={`${styles.btn} ${styles.primary}`} onClick={onResume}>
            <span className={styles.icon}>▶</span> Resume
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.warning}`} onClick={onPause}>
            <span className={styles.icon}>⏸</span> Pause
          </button>
        )}
        <button className={`${styles.btn} ${styles.danger}`} onClick={onReset}>
          <span className={styles.icon}>↺</span> Reset
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <span className={styles.label}>Speed</span>
        <input
          type="range" min="1" max="10" value={speed}
          onChange={e => onSpeedChange(+e.target.value)}
          className={styles.slider}
        />
        <span className={styles.val}>{speed}</span>
      </div>

      {!isGraph && !isDS && (
        <>
          <div className={styles.divider} />
          <div className={styles.group}>
            <span className={styles.label}>Size</span>
            <input
              type="range" min="6" max="80" value={size}
              onChange={e => onSizeChange(+e.target.value)}
              className={styles.slider}
              disabled={isRunning}
            />
            <span className={styles.val}>{size}</span>
          </div>

          <div className={styles.divider} />
          <div className={styles.group}>
            <button className={styles.btn} onClick={onShuffle} disabled={isRunning}>⇄ Random</button>
            <button className={styles.btn} onClick={onSorted} disabled={isRunning}>↑ Nearly</button>
            <button className={styles.btn} onClick={onReversed} disabled={isRunning}>↓ Reverse</button>
          </div>
        </>
      )}
    </div>
  );
}
