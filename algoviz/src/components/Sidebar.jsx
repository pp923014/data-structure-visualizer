import styles from './Sidebar.module.css';

const ALGORITHMS = [
  {
    group: 'Sorting',
    items: [
      { id: 'bubble',    label: 'Bubble Sort',    abbr: 'B',  time: 'O(n²)',      space: 'O(1)' },
      { id: 'selection', label: 'Selection Sort',  abbr: 'S',  time: 'O(n²)',      space: 'O(1)' },
      { id: 'insertion', label: 'Insertion Sort',  abbr: 'I',  time: 'O(n²)',      space: 'O(1)' },
      { id: 'merge',     label: 'Merge Sort',      abbr: 'M',  time: 'O(n log n)', space: 'O(n)' },
      { id: 'quick',     label: 'Quick Sort',      abbr: 'Q',  time: 'O(n log n)', space: 'O(log n)' },
      { id: 'heap',      label: 'Heap Sort',       abbr: 'H',  time: 'O(n log n)', space: 'O(1)' },
    ],
  },
  {
    group: 'Graph',
    items: [
      { id: 'bfs', label: 'Breadth-First',  abbr: 'BF', time: 'O(V+E)', space: 'O(V)' },
      { id: 'dfs', label: 'Depth-First',    abbr: 'DF', time: 'O(V+E)', space: 'O(V)' },
    ],
  },
  {
    group: 'Search',
    items: [
      { id: 'binary', label: 'Binary Search', abbr: 'BS', time: 'O(log n)', space: 'O(1)' },
      { id: 'linear', label: 'Linear Search', abbr: 'LS', time: 'O(n)',     space: 'O(1)' },
    ],
  },
  {
    group: 'Structures',
    items: [
      { id: 'stack',      label: 'Stack',       abbr: 'ST', time: 'O(1)', space: 'O(n)' },
      { id: 'queue',      label: 'Queue',       abbr: 'QU', time: 'O(1)', space: 'O(n)' },
      { id: 'linkedlist', label: 'Linked List', abbr: 'LL', time: 'O(n)', space: 'O(n)' },
    ],
  },
];

export default function Sidebar({ current, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>Algo<span>Viz</span></div>
        <div className={styles.tagline}>Algorithm Visualizer</div>
      </div>

      <nav className={styles.nav}>
        {ALGORITHMS.map(({ group, items }) => (
          <div key={group} className={styles.group}>
            <div className={styles.groupLabel}>{group}</div>
            {items.map(item => (
              <button
                key={item.id}
                className={`${styles.item} ${current === item.id ? styles.active : ''}`}
                onClick={() => onSelect(item)}
              >
                <span className={styles.abbr}>{item.abbr}</span>
                <span className={styles.name}>{item.label}</span>
                <span className={styles.time}>{item.time}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerDot} />
        <span>React + Vite</span>
      </div>
    </aside>
  );
}
