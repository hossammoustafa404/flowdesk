'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduceMotion(media.matches);
    syncMotion();
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-500 ease-out',
        isVisible || reduceMotion
          ? 'translate-y-0 opacity-100'
          : 'translate-y-3 opacity-0',
        className,
      )}
      style={
        reduceMotion || !isVisible
          ? undefined
          : { transitionDelay: `${delayMs}ms` }
      }
    >
      {children}
    </div>
  );
}
