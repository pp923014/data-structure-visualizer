import { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import StatsBar from './components/StatsBar';
import BarViz from './components/BarViz';
import GraphViz from './components/GraphViz';
import DSViz from './components/DSViz';
import LogPanel from './components/LogPanel';
import { useAlgorithm } from './hooks/useAlgorithm';
import {
  bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort,
  binarySearch, linearSearch,
  bfs, dfs, buildGraphData,
} from './algorithms';
import styles from './App.module.css';

const ALGO_META = {
  bubble: { title: 'Bubble Sort', sub: 'Repeatedly swap adjacent elements if out of order', time: 'O(n²)', space: 'O(1)' },
  selection: { title: 'Selection Sort', sub: 'Find the minimum, place it at the start of unsorted portion', time: 'O(n²)', space: 'O(1)' },
  insertion: { title: 'Insertion Sort', sub: 'Build sorted array one element at a time by insertion', time: 'O(n²)', space: 'O(1)' },
  merge: { title: 'Merge Sort', sub: 'Divide in half recursively, then merge sorted halves', time: 'O(n log n)', space: 'O(n)' },
  quick: { title: 'Quick Sort', sub: 'Choose a pivot, partition around it, recurse on both sides', time: 'O(n log n)', space: 'O(log n)' },
  heap: { title: 'Heap Sort', sub: 'Build a max-heap, repeatedly extract the maximum', time: 'O(n log n)', space: 'O(1)' },
  bfs: { title: 'Breadth-First Search', sub: 'Explore graph level by level using a queue', time: 'O(V+E)', space: 'O(V)' },
  dfs: { title: 'Depth-First Search', sub: 'Explore as far as possible before backtracking', time: 'O(V+E)', space: 'O(V)' },
  binary: { title: 'Binary Search', sub: 'Halve the search space each step on a sorted array', time: 'O(log n)', space: 'O(1)' },
  linear: { title: 'Linear Search', sub: 'Scan each element until the target is found', time: 'O(n)', space: 'O(1)' },
  stack: { title: 'Stack', sub: 'LIFO — Last In, First Out · push() and pop()', time: 'O(1)', space: 'O(n)' },
  queue: { title: 'Queue', sub: 'FIFO — First In, First Out · enqueue() and dequeue()', time: 'O(1)', space: 'O(n)' },
  linkedlist: { title: 'Linked List', sub: 'Sequential nodes where each points to the next', time: 'O(n)', space: 'O(n)' },
};

function makeArray(size, type = 'random') {
  return Array.from({ length: size }, (_, i) => {
    if (type === 'random') return Math.floor(Math.random() * 85) + 8;
    if (type === 'sorted') return Math.floor((i / size) * 85) + 8 + (Math.random() < 0.3 ? Math.floor(Math.random() * 6) - 3 : 0);
    if (type === 'reversed') return Math.floor(((size - i) / size) * 85) + 8;
    return Math.floor(Math.random() * 85) + 8;
  });
}

function getDSOps(type) {
  if (type === 'stack') {
    const vals = Array.from({ length: 7 }, () => Math.floor(Math.random() * 99) + 1);
    return [...vals.map(v => ({ op: 'push', val: v })), { op: 'pop' }, { op: 'pop' }, { op: 'pop' }];
  }
  if (type === 'queue') {
    const vals = Array.from({ length: 6 }, () => Math.floor(Math.random() * 99) + 1);
    return [...vals.map(v => ({ op: 'enqueue', val: v })), { op: 'dequeue' }, { op: 'dequeue' }];
  }
  // linkedlist
  const vals = Array.from({ length: 6 }, () => Math.floor(Math.random() * 99) + 1);
  return [...vals.map(v => ({ op: 'append', val: v })), { op: 'delete', index: 0 }, { op: 'delete', index: 1 }];
}

async function* dsOpsGen(ops, setItems, addLog) {
  const items = [];
  for (const op of ops) {
    await new Promise(r => setTimeout(r, 0));
    if (op.op === 'push') { items.push(op.val); setItems([...items]); yield { log: `push(${op.val}) → size: ${items.length}` }; }
    else if (op.op === 'pop') { if (items.length) { const v = items.pop(); setItems([...items]); yield { log: `pop() → removed ${v}` }; } }
    else if (op.op === 'enqueue') { items.push(op.val); setItems([...items]); yield { log: `enqueue(${op.val}) → size: ${items.length}` }; }
    else if (op.op === 'dequeue') { if (items.length) { const v = items.shift(); setItems([...items]); yield { log: `dequeue() → removed ${v}` }; } }
    else if (op.op === 'append') { items.push(op.val); setItems([...items]); yield { log: `append(${op.val}) → length: ${items.length}` }; }
    else if (op.op === 'delete') { if (items.length > op.index) { const v = items.splice(op.index, 1)[0]; setItems([...items]); yield { log: `delete(${op.index}) → removed ${v}` }; } }
  }
  yield { done: true, log: 'All operations complete!' };
}

export default function App() {
  const [algoId, setAlgoId] = useState('bubble');
  const [arraySize, setArraySize] = useState(28);
  const [speed, setSpeedState] = useState(5);
  const [graphData, setGraphData] = useState(null);

  const algo = useAlgorithm();

  const isGraph = ['bfs', 'dfs'].includes(algoId);
  const isDS = ['stack', 'queue', 'linkedlist'].includes(algoId);

  // Init array on mount / algoId change
  useEffect(() => {
    algo.reset();
    if (isGraph) {
      setGraphData(buildGraphData());
    } else if (!isDS) {
      algo.setArray(makeArray(arraySize));
    }
    algo.addLog(`Selected: ${ALGO_META[algoId]?.title}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId]);

  const handleSelect = useCallback((item) => {
    setAlgoId(item.id);
  }, []);

  const handleRun = useCallback(() => {
    if (isGraph) {
      const gd = graphData || buildGraphData();
      setGraphData(gd);
      const gen = algoId === 'bfs' ? bfs(gd) : dfs(gd);
      algo.run(algoId, gen);
      return;
    }
    if (isDS) {
      const ops = getDSOps(algoId);
      algo.setDsItems([]);
      const gen = dsOpsGen(ops, algo.setDsItems, algo.addLog);
      algo.run(algoId, gen);
      return;
    }
    const sortedArr = [...algo.array];
    algo.setSortedSet(new Set());
    algo.setHighlights({});

    let gen;
    if (algoId === 'bubble') gen = bubbleSort(sortedArr);
    else if (algoId === 'selection') gen = selectionSort(sortedArr);
    else if (algoId === 'insertion') gen = insertionSort(sortedArr);
    else if (algoId === 'merge') gen = mergeSort(sortedArr);
    else if (algoId === 'quick') gen = quickSort(sortedArr);
    else if (algoId === 'heap') gen = heapSort(sortedArr);
    else if (algoId === 'binary') gen = binarySearch(sortedArr, sortedArr[Math.floor(Math.random() * sortedArr.length)]);
    else if (algoId === 'linear') gen = linearSearch(sortedArr, sortedArr[Math.floor(Math.random() * sortedArr.length)]);

    if (gen) algo.run(algoId, gen);
  }, [algoId, algo, isGraph, isDS, graphData]);

  const handlePause = useCallback(() => algo.pause(), [algo]);
  const handleResume = useCallback(() => algo.resume(algoId), [algo, algoId]);

  const handleReset = useCallback(() => {
    algo.reset();
    if (isGraph) setGraphData(buildGraphData());
    else if (!isDS) algo.setArray(makeArray(arraySize));
  }, [algo, isGraph, isDS, arraySize]);

  const handleShuffle = () => { algo.reset(); algo.setArray(makeArray(arraySize, 'random')); algo.setSortedSet(new Set()); };
  const handleSorted = () => { algo.reset(); algo.setArray(makeArray(arraySize, 'sorted')); algo.setSortedSet(new Set()); };
  const handleReversed = () => { algo.reset(); algo.setArray(makeArray(arraySize, 'reversed')); algo.setSortedSet(new Set()); };

  const handleSizeChange = (s) => {
    setArraySize(s);
    if (!algo.isRunning) algo.setArray(makeArray(s));
  };

  const handleSpeedChange = (s) => {
    setSpeedState(s);
    algo.setSpeed(s);
  };

  return (
    <div className={styles.app}>
      {/* Grid bg */}
      <div className={styles.gridBg} />

      <Sidebar current={algoId} onSelect={handleSelect} />

      <div className={styles.main}>
        <Controls
          isRunning={algo.isRunning}
          isPaused={algo.isPaused}
          isDone={algo.isDone}
          onRun={handleRun}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          onShuffle={handleShuffle}
          onSorted={handleSorted}
          onReversed={handleReversed}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          size={arraySize}
          onSizeChange={handleSizeChange}
          algoType={algoId}
        />

        <StatsBar
          algoMeta={ALGO_META[algoId]}
          comparisons={algo.comparisons}
          swaps={algo.swaps}
          isDone={algo.isDone}
        />

        <div className={styles.vizArea}>
          {isGraph ? (
            <GraphViz graphData={graphData} graphState={algo.graphState} />
          ) : isDS ? (
            <DSViz type={algoId} items={algo.dsItems} />
          ) : (
            <BarViz
              array={algo.array}
              highlights={algo.highlights}
              sortedSet={algo.sortedSet}
            />
          )}
        </div>

        <LogPanel logs={algo.logs} />
      </div>
    </div>
  );
}
