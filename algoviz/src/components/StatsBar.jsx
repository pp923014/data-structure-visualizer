import styles from './StatsBar.module.css';

export default function StatsBar({ algoMeta, comparisons, swaps, isDone }) {
  return (
    <div className={styles.bar}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{algoMeta?.title || 'Select Algorithm'}</h1>
        <p className={styles.sub}>{algoMeta?.sub || 'Choose from the sidebar to get started'}</p>
      </div>
      <div className={styles.stats}>
        <Stat label="Time" value={algoMeta?.time || '—'} accent />
        <Stat label="Space" value={algoMeta?.space || '—'} />
        <Stat label="Comparisons" value={comparisons} />
        <Stat label="Swaps" value={swaps} />
        {isDone && <div className={styles.done}>✓ DONE</div>}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={styles.stat}>
      <span className={`${styles.val} ${accent ? styles.accent : ''}`}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
