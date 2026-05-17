'use client';

import { useRef, useCallback } from 'react';

interface DragScrollProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const THRESHOLD = 6; // px moved before drag activates

export default function DragScroll({ children, style, className = '' }: DragScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, dragging: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current = { down: true, dragging: false, startX: e.pageX, scrollLeft: el.scrollLeft };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const s = state.current;
    const el = ref.current;
    if (!s.down || !el) return;

    const delta = e.pageX - s.startX;

    if (!s.dragging) {
      if (Math.abs(delta) < THRESHOLD) return;
      s.dragging = true;
      el.classList.add('dragging');
    }

    e.preventDefault();
    el.scrollLeft = s.scrollLeft - delta;
  }, []);

  const stop = useCallback((e: React.MouseEvent) => {
    const s = state.current;
    const el = ref.current;
    if (s.dragging) e.preventDefault();
    s.down = false;
    s.dragging = false;
    el?.classList.remove('dragging');
  }, []);

  return (
    <div
      ref={ref}
      className={`hrow ${className}`}
      style={style}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stop}
      onMouseLeave={stop}
    >
      {children}
    </div>
  );
}
