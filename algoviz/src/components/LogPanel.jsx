import styles from './LogPanel.module.css';

export default function LogPanel({ logs }) {
  return (
    <div className={styles.panel}>
      <span className={styles.label}>LOG</span>
      <div className={styles.entries}>
        {logs.map((line, i) => (
          <div key={i} className={`${styles.entry} ${i === 0 ? styles.latest : ''}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
