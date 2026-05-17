'use client';
import { useRef, useState, useEffect } from 'react';

interface Props { children: React.ReactNode; delay?: number; index?: number }

export default function AnimatedItem({ children, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      transform: inView ? 'scale(1)' : 'scale(0.7)',
      opacity:   inView ? 1 : 0,
      transition: `transform 220ms cubic-bezier(.22,1,.36,1) ${delay}s, opacity 220ms cubic-bezier(.22,1,.36,1) ${delay}s`,
      transformOrigin: 'center',
    }}>
      {children}
    </div>
  );
}
