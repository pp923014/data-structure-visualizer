import { useEffect, useRef } from 'react';
import styles from './BarViz.module.css';

const COLOR_MAP = {
  compare:     '#ff5c3a',
  swap:        '#ff5c3a',
  active:      '#00e5ff',
  pivot:       '#a78bfa',
  found:       '#6cff8a',
  'sorted-temp': '#2a6b3a',
  range:       '#1a3060',
};
const DEFAULT_COLOR = '#0d2a4a';
const SORTED_COLOR  = '#6cff8a';

export default function BarViz({ array, highlights, sortedSet }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!array.length) return;

    const padX = 16, padY = 28;
    const barW = (W - padX * 2) / array.length;
    const maxVal = Math.max(...array, 1);

    array.forEach((val, i) => {
      const x = padX + i * barW;
      const barH = ((val / maxVal) * (H - padY * 2 - 10));
      const y = H - padY - barH;
      const gap = barW > 3 ? 1.5 : 0.5;
      const bw = barW - gap;

      let color = DEFAULT_COLOR;
      if (sortedSet?.has(i)) color = SORTED_COLOR;
      if (highlights?.[i]) color = COLOR_MAP[highlights[i]] || highlights[i];

      if (color !== DEFAULT_COLOR) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      const r = Math.min(2, bw / 2);
      ctx.moveTo(x + gap / 2 + r, y);
      ctx.lineTo(x + gap / 2 + bw - r, y);
      ctx.arcTo(x + gap / 2 + bw, y, x + gap / 2 + bw, y + r, r);
      ctx.lineTo(x + gap / 2 + bw, y + barH);
      ctx.lineTo(x + gap / 2, y + barH);
      ctx.lineTo(x + gap / 2, y + r);
      ctx.arcTo(x + gap / 2, y, x + gap / 2 + r, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Labels for small arrays
      if (array.length <= 24 && bw > 12) {
        ctx.fillStyle = color === DEFAULT_COLOR ? '#2a4060' : color;
        ctx.font = `bold ${Math.min(9, bw - 2)}px JetBrains Mono`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(val, x + barW / 2, y - 2);
      }
    });
  }, [array, highlights, sortedSet]);

  return (
    <div className={styles.wrap}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={800}
        height={400}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
