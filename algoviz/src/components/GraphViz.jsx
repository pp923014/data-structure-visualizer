import { useEffect, useRef, useMemo } from 'react';
import styles from './GraphViz.module.css';

function buildLayout(nodes, W, H) {
  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.32;
  return nodes.map((n, i) => {
    if (i === 0) return { ...n, x: cx, y: cy };
    const angle = ((i - 1) / (nodes.length - 1)) * Math.PI * 2 - Math.PI / 2;
    return { ...n, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

export default function GraphViz({ graphData, graphState }) {
  const canvasRef = useRef(null);

  const layout = useMemo(() => {
    if (!graphData || !canvasRef.current) return [];
    return buildLayout(graphData.nodes, canvasRef.current.width, canvasRef.current.height);
  }, [graphData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const positioned = buildLayout(graphData.nodes, W, H);
    const { visited, queue, current } = graphState || {};

    // Draw edges
    graphData.edges.forEach(([a, b]) => {
      const na = positioned[a], nb = positioned[b];
      if (!na || !nb) return;
      const bothVisited = visited?.has(a) && visited?.has(b);
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = bothVisited ? 'rgba(0,229,255,0.25)' : 'rgba(23,35,51,0.9)';
      ctx.lineWidth = bothVisited ? 1.5 : 1;
      ctx.stroke();
    });

    // Draw nodes
    positioned.forEach(n => {
      const isVisited = visited?.has(n.id);
      const isCurrent = current === n.id;
      const isQueued = queue?.includes(n.id);

      let fill = '#0d1a2a';
      let stroke = '#172333';
      let lw = 1;
      if (isVisited) { fill = '#0d2a1a'; stroke = '#1a4a2e'; }
      if (isQueued)  { fill = '#1a0d2a'; stroke = '#3a1a5a'; }
      if (isCurrent) { fill = 'rgba(0,229,255,0.15)'; stroke = '#00e5ff'; lw = 2; }

      ctx.shadowBlur = isCurrent ? 24 : isVisited ? 8 : 0;
      ctx.shadowColor = isCurrent ? '#00e5ff' : '#6cff8a';

      ctx.beginPath();
      ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = isCurrent ? '#000' : isVisited ? '#6cff8a' : isQueued ? '#a78bfa' : '#4a6a8a';
      ctx.font = `bold 12px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
    });
  }, [graphData, graphState]);

  return (
    <div className={styles.wrap}>
      <canvas
        ref={canvasRef}
        width={800} height={400}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
