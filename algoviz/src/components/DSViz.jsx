import styles from './DSViz.module.css';

export default function DSViz({ type, items }) {
  if (type === 'stack') return <StackViz items={items} />;
  if (type === 'queue') return <QueueViz items={items} />;
  if (type === 'linkedlist') return <LinkedListViz items={items} />;
  return null;
}

function StackViz({ items }) {
  const show = items.slice(-10);
  return (
    <div className={styles.stackWrap}>
      <div className={styles.stack}>
        {show.length === 0 && <div className={styles.empty}>Empty Stack</div>}
        {[...show].reverse().map((val, i) => {
          const isTop = i === 0;
          return (
            <div key={show.length - 1 - i} className={`${styles.stackNode} ${isTop ? styles.top : ''}`}>
              <span className={styles.nodeVal}>{val}</span>
              {isTop && <span className={styles.badge}>TOP</span>}
            </div>
          );
        })}
        <div className={styles.stackBase} />
      </div>
      <div className={styles.dsInfo}>Size: {items.length}</div>
    </div>
  );
}

function QueueViz({ items }) {
  const show = items.slice(-8);
  return (
    <div className={styles.queueWrap}>
      <div className={styles.queueArrow}>DEQUEUE ←</div>
      <div className={styles.queue}>
        {show.length === 0 && <div className={styles.empty}>Empty Queue</div>}
        {show.map((val, i) => {
          const isFront = i === 0;
          const isBack  = i === show.length - 1;
          return (
            <div key={i} className={`${styles.queueNode} ${isFront ? styles.front : ''} ${isBack ? styles.back : ''}`}>
              {isFront && <span className={`${styles.badge} ${styles.frontBadge}`}>FRONT</span>}
              <span className={styles.nodeVal}>{val}</span>
              {isBack && <span className={`${styles.badge} ${styles.backBadge}`}>BACK</span>}
            </div>
          );
        })}
      </div>
      <div className={styles.queueArrow}>→ ENQUEUE</div>
      <div className={styles.dsInfo}>Size: {items.length}</div>
    </div>
  );
}

function LinkedListViz({ items }) {
  const show = items.slice(0, 8);
  return (
    <div className={styles.llWrap}>
      <div className={styles.ll}>
        {show.length === 0 && <div className={styles.empty}>Empty List</div>}
        {show.map((val, i) => {
          const isHead = i === 0;
          const isTail = i === show.length - 1;
          return (
            <div key={i} className={styles.llItem}>
              <div className={`${styles.llNode} ${isHead ? styles.head : ''} ${isTail ? styles.tail : ''}`}>
                {isHead && <span className={`${styles.badge} ${styles.headBadge}`}>HEAD</span>}
                <span className={styles.nodeVal}>{val}</span>
                {isTail && <span className={`${styles.badge} ${styles.tailBadge}`}>TAIL</span>}
              </div>
              {i < show.length - 1 && <div className={styles.llArrow}>→</div>}
            </div>
          );
        })}
        {show.length > 0 && <div className={styles.llNull}><span>→</span><span className={styles.null}>null</span></div>}
      </div>
      <div className={styles.dsInfo}>Length: {items.length}</div>
    </div>
  );
}
