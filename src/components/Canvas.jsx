// src/components/Canvas.jsx

import { useRef, useState, useEffect } from 'react';

function Canvas() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const gridRef = useRef(null);

  useEffect(() => {
    const canvas = gridRef.current;
    const ctx = canvas.getContext('2d');
    const size = 2000;    // CSS size in px
    const step = 40;      // grid spacing
    const dpr = window.devicePixelRatio || 1;

    // set backing store resolution
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    // maintain CSS size
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    // scale all drawing ops
    ctx.scale(dpr, dpr);

    // clear
    ctx.clearRect(0, 0, size, size);

    // grid lines
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let x = 0; x <= size; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    // sharp dots at intersections
    ctx.fillStyle = '#bbb';
    for (let x = 0; x <= size; x += step) {
      for (let y = 0; y <= size; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    start.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    start.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      <canvas
        ref={gridRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default Canvas;
