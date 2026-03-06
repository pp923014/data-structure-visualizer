// Each generator yields step objects describing what happened

export function* bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', i: j, j: j + 1, arr: [...a], log: `Compare a[${j}]=${a[j]} ↔ a[${j+1}]=${a[j+1]}` };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { type: 'swap', i: j, j: j + 1, arr: [...a], log: `Swap a[${j}] ↔ a[${j+1}]`, swapped: true };
      }
    }
    yield { type: 'sorted', index: n - 1 - i, arr: [...a] };
  }
  yield { type: 'sorted', index: 0, arr: [...a], done: true, log: 'Bubble Sort complete!' };
}

export function* selectionSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { type: 'active', index: i, arr: [...a], log: `Find minimum in a[${i}..${n-1}]` };
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', i: minIdx, j, arr: [...a], log: `Compare a[${j}]=${a[j]} with min=${a[minIdx]}` };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { type: 'newmin', index: minIdx, arr: [...a], log: `New minimum: a[${minIdx}]=${a[minIdx]}` };
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { type: 'swap', i, j: minIdx, arr: [...a], log: `Place minimum at position ${i}`, swapped: true };
    }
    yield { type: 'sorted', index: i, arr: [...a] };
  }
  yield { type: 'sorted', index: n - 1, arr: [...a], done: true, log: 'Selection Sort complete!' };
}

export function* insertionSort(arr) {
  const a = [...arr];
  const n = a.length;
  yield { type: 'sorted', index: 0, arr: [...a] };
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    yield { type: 'active', index: i, arr: [...a], log: `Insert a[${i}]=${key} into sorted portion` };
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      yield { type: 'compare', i: j, j: j + 1, arr: [...a], log: `Shift a[${j}]=${a[j]} right`, swapped: true };
      j--;
    }
    a[j + 1] = key;
    yield { type: 'sorted', index: i, arr: [...a] };
  }
  yield { type: 'done', arr: [...a], done: true, log: 'Insertion Sort complete!' };
}

export function* mergeSort(arr) {
  const a = [...arr];
  yield* mergeSortHelper(a, 0, a.length - 1);
  yield { type: 'done', arr: [...a], done: true, log: 'Merge Sort complete!' };
}

function* mergeSortHelper(a, left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  yield { type: 'divide', left, right, mid, arr: [...a], log: `Split [${left}..${right}] at ${mid}` };
  yield* mergeSortHelper(a, left, mid);
  yield* mergeSortHelper(a, mid + 1, right);
  yield* mergeStep(a, left, mid, right);
}

function* mergeStep(a, left, mid, right) {
  const L = a.slice(left, mid + 1);
  const R = a.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < L.length && j < R.length) {
    yield { type: 'compare', i: left + i, j: mid + 1 + j, arr: [...a], log: `Merge: compare ${L[i]} and ${R[j]}` };
    if (L[i] <= R[j]) { a[k] = L[i]; i++; }
    else { a[k] = R[j]; j++; }
    yield { type: 'place', index: k, arr: [...a], log: `Place ${a[k]} at position ${k}` };
    k++;
  }
  while (i < L.length) { a[k] = L[i]; i++; k++; }
  while (j < R.length) { a[k] = R[j]; j++; k++; }
  const range = Array.from({ length: right - left + 1 }, (_, x) => left + x);
  yield { type: 'merge-done', range, arr: [...a], log: `Merged [${left}..${right}]` };
}

export function* quickSort(arr) {
  const a = [...arr];
  yield* quickSortHelper(a, 0, a.length - 1);
  yield { type: 'done', arr: [...a], done: true, log: 'Quick Sort complete!' };
}

function* quickSortHelper(a, low, high) {
  if (low < high) {
    const pivotVal = a[high];
    yield { type: 'pivot', index: high, arr: [...a], log: `Pivot = ${pivotVal} at index ${high}` };
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { type: 'compare', i: j, j: high, arr: [...a], log: `Compare a[${j}]=${a[j]} with pivot=${pivotVal}` };
      if (a[j] <= pivotVal) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j) yield { type: 'swap', i, j, arr: [...a], log: `Swap a[${i}] ↔ a[${j}]`, swapped: true };
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    yield { type: 'sorted', index: i + 1, arr: [...a], log: `Pivot placed at index ${i+1}` };
    yield* quickSortHelper(a, low, i);
    yield* quickSortHelper(a, i + 2, high);
  } else if (low === high) {
    yield { type: 'sorted', index: low, arr: [...a] };
  }
}

export function* heapSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(a, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    yield { type: 'swap', i: 0, j: i, arr: [...a], log: `Move max to position ${i}`, swapped: true };
    yield { type: 'sorted', index: i, arr: [...a] };
    yield* heapify(a, i, 0);
  }
  yield { type: 'sorted', index: 0, arr: [...a], done: true, log: 'Heap Sort complete!' };
}

function* heapify(a, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  yield { type: 'compare', i, j: l < n ? l : i, arr: [...a], log: `Heapify: check node ${i}` };
  if (l < n && a[l] > a[largest]) largest = l;
  if (r < n && a[r] > a[largest]) largest = r;
  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    yield { type: 'swap', i, j: largest, arr: [...a], log: `Heapify swap ${i} ↔ ${largest}`, swapped: true };
    yield* heapify(a, n, largest);
  }
}

// Binary Search
export function* binarySearch(arr, target) {
  const a = [...arr].sort((x, y) => x - y);
  yield { type: 'init', arr: [...a], log: `Binary Search for ${target} in sorted array` };
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    yield { type: 'search', lo, hi, mid, arr: [...a], log: `lo=${lo} mid=${mid} hi=${hi} → a[mid]=${a[mid]}` };
    if (a[mid] === target) {
      yield { type: 'found', index: mid, arr: [...a], done: true, log: `✓ Found ${target} at index ${mid}!` };
      return;
    } else if (a[mid] < target) {
      lo = mid + 1;
      yield { type: 'go-right', lo, hi, arr: [...a], log: `${a[mid]} < ${target}, go right` };
    } else {
      hi = mid - 1;
      yield { type: 'go-left', lo, hi, arr: [...a], log: `${a[mid]} > ${target}, go left` };
    }
  }
  yield { type: 'not-found', arr: [...a], done: true, log: `${target} not found in array` };
}

export function* linearSearch(arr, target) {
  const a = [...arr];
  yield { type: 'init', arr: [...a], log: `Linear Search for ${target}` };
  for (let i = 0; i < a.length; i++) {
    yield { type: 'check', index: i, arr: [...a], log: `Check a[${i}]=${a[i]}` };
    if (a[i] === target) {
      yield { type: 'found', index: i, arr: [...a], done: true, log: `✓ Found ${target} at index ${i}!` };
      return;
    }
  }
  yield { type: 'not-found', arr: [...a], done: true, log: `${target} not found` };
}

// Graph generators
function buildGraph(nodeCount = 10) {
  const nodes = [];
  const edges = [];
  // center node
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({ id: i, label: String(i) });
  }
  // ring
  for (let i = 1; i < nodeCount; i++) {
    const j = (i % (nodeCount - 1)) + 1;
    if (!edges.find(e => (e[0] === Math.min(i,j) && e[1] === Math.max(i,j)))) {
      edges.push([Math.min(i,j), Math.max(i,j)]);
    }
  }
  // spokes from center
  for (let i = 1; i < nodeCount; i++) {
    if (Math.random() < 0.5) edges.push([0, i]);
  }
  // extra random
  for (let k = 0; k < 3; k++) {
    const a = Math.floor(Math.random() * nodeCount);
    const b = Math.floor(Math.random() * nodeCount);
    if (a !== b && !edges.find(e => (e[0] === Math.min(a,b) && e[1] === Math.max(a,b)))) {
      edges.push([Math.min(a,b), Math.max(a,b)]);
    }
  }
  return { nodes, edges };
}

function getNeighbors(edges, id) {
  return edges.filter(([a, b]) => a === id || b === id).map(([a, b]) => a === id ? b : a);
}

export function buildGraphData() {
  return buildGraph(10);
}

export function* bfs(graphData) {
  const { nodes, edges } = graphData;
  const visited = new Set();
  const queue = [0];
  const order = [];
  visited.add(0);
  yield { type: 'start', visited: new Set(visited), queue: [...queue], current: null, log: 'BFS: Start from node 0' };
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    yield { type: 'visit', visited: new Set(visited), queue: [...queue], current: node, log: `Visit node ${node}` };
    for (const nb of getNeighbors(edges, node)) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        yield { type: 'discover', visited: new Set(visited), queue: [...queue], current: node, log: `Discover neighbor ${nb} (queued)` };
      }
    }
  }
  yield { type: 'done', visited: new Set(visited), queue: [], current: null, done: true, log: `BFS complete! Order: [${order.join(', ')}]` };
}

export function* dfs(graphData) {
  const { nodes, edges } = graphData;
  const visited = new Set();
  const order = [];
  function* dfsHelper(node) {
    visited.add(node);
    order.push(node);
    yield { type: 'visit', visited: new Set(visited), current: node, log: `Visit node ${node}` };
    for (const nb of getNeighbors(edges, node)) {
      if (!visited.has(nb)) {
        yield { type: 'explore', visited: new Set(visited), current: node, log: `Explore edge ${node} → ${nb}` };
        yield* dfsHelper(nb);
        yield { type: 'backtrack', visited: new Set(visited), current: node, log: `Backtrack to node ${node}` };
      }
    }
  }
  yield* dfsHelper(0);
  yield { type: 'done', visited: new Set(visited), current: null, done: true, log: `DFS complete! Order: [${order.join(', ')}]` };
}
