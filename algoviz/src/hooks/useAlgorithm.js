import { useState, useRef, useCallback, useEffect } from 'react';

export function useAlgorithm() {
  const [array, setArray] = useState([]);
  const [highlights, setHighlights] = useState({});
  const [sortedSet, setSortedSet] = useState(new Set());
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [logs, setLogs] = useState(['// Welcome to AlgoViz', '// Select an algorithm and press Run']);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [graphState, setGraphState] = useState({ visited: new Set(), queue: [], current: null });
  const [dsItems, setDsItems] = useState([]);

  const generatorRef = useRef(null);
  const intervalRef = useRef(null);
  const speedRef = useRef(5);
  const comparisonsRef = useRef(0);
  const swapsRef = useRef(0);
  const isPausedRef = useRef(false);

  const getDelay = () => Math.max(15, Math.round(1050 / (speedRef.current * speedRef.current * 0.5 + speedRef.current * 3)));

  const addLog = useCallback((msg) => {
    if (!msg) return;
    setLogs(prev => ['// ' + msg, ...prev].slice(0, 6));
  }, []);

  const applyStep = useCallback((step, algo) => {
    if (!step) return;
    if (step.log) addLog(step.log);

    const isSorting = ['bubble','selection','insertion','merge','quick','heap'].includes(algo);
    const isSearch = ['binary','linear'].includes(algo);
    const isGraph = ['bfs','dfs'].includes(algo);

    if (isSorting || isSearch) {
      if (step.arr) setArray([...step.arr]);
      const h = {};
      if (step.type === 'compare') { h[step.i] = 'compare'; h[step.j] = 'compare'; }
      if (step.type === 'swap' || (step.swapped)) { h[step.i] = 'swap'; h[step.j] = 'swap'; }
      if (step.type === 'pivot') h[step.index] = 'pivot';
      if (step.type === 'active') h[step.index] = 'active';
      if (step.type === 'newmin') h[step.index] = 'pivot';
      if (step.type === 'place') h[step.index] = 'active';
      if (step.type === 'divide') { h[step.left] = 'compare'; h[step.right] = 'compare'; }
      if (step.type === 'merge-done') step.range?.forEach(i => { h[i] = 'sorted-temp'; });
      if (step.type === 'sorted') {
        setSortedSet(prev => new Set([...prev, step.index]));
      }
      if (step.type === 'done') {
        setSortedSet(prev => {
          const next = new Set(prev);
          step.arr?.forEach((_, i) => next.add(i));
          return next;
        });
      }
      // Search
      if (step.type === 'search') {
        if (step.lo !== undefined) {
          for (let i = step.lo; i <= step.hi; i++) h[i] = 'range';
          h[step.mid] = 'compare';
        }
        if (step.index !== undefined) h[step.index] = 'compare';
      }
      if (step.type === 'check') h[step.index] = 'compare';
      if (step.type === 'found') { h[step.index] = 'found'; }
      if (step.type === 'init' && step.arr) setArray([...step.arr]);
      setHighlights(h);
      if (step.swapped) swapsRef.current++;
      if (step.type === 'compare' || step.type === 'check') comparisonsRef.current++;
      setComparisons(comparisonsRef.current);
      setSwaps(swapsRef.current);
    }

    if (isGraph) {
      setGraphState({
        visited: step.visited || new Set(),
        queue: step.queue || [],
        current: step.current ?? null,
      });
      if (step.type === 'compare' || step.type === 'discover' || step.type === 'explore') comparisonsRef.current++;
      setComparisons(comparisonsRef.current);
    }

    if (step.done) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setIsPaused(false);
      setIsDone(true);
      generatorRef.current = null;
    }
  }, [addLog]);

  const startInterval = useCallback((algo) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!generatorRef.current) return;
      const result = generatorRef.current.next();
      if (result.done) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsDone(true);
        generatorRef.current = null;
        return;
      }
      applyStep(result.value, algo);
    }, getDelay());
  }, [applyStep]);

  const run = useCallback((algo, generator) => {
    clearInterval(intervalRef.current);
    generatorRef.current = generator;
    comparisonsRef.current = 0;
    swapsRef.current = 0;
    setComparisons(0);
    setSwaps(0);
    setIsRunning(true);
    setIsPaused(false);
    setIsDone(false);
    startInterval(algo);
  }, [startInterval]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  const resume = useCallback((algo) => {
    setIsPaused(false);
    setIsRunning(true);
    startInterval(algo);
  }, [startInterval]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    generatorRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setIsDone(false);
    setHighlights({});
    setSortedSet(new Set());
    comparisonsRef.current = 0;
    swapsRef.current = 0;
    setComparisons(0);
    setSwaps(0);
    setGraphState({ visited: new Set(), queue: [], current: null });
    setDsItems([]);
  }, []);

  const setSpeed = useCallback((s) => { speedRef.current = s; }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return {
    array, setArray,
    highlights, setHighlights,
    sortedSet, setSortedSet,
    comparisons, swaps,
    logs, addLog,
    isRunning, isPaused, isDone,
    graphState, setGraphState,
    dsItems, setDsItems,
    run, pause, resume, reset, setSpeed,
  };
}
