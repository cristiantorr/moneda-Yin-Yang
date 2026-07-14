import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({ value, duration = 400, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const fromRef = useRef(value);

  useEffect(() => {
    if (value === display) return;

    fromRef.current = display;
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(fromRef.current + (value - fromRef.current) * eased);
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}
