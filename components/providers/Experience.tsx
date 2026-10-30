'use client';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function Experience() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    let lenis: Lenis | undefined;
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (!reduced && !touch) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    let finish: ReturnType<typeof setTimeout> | undefined;
    if (!reduced && !touch && !sessionStorage.getItem('joshva-loaded')) {
      setLoading(true);
      const start = performance.now();
      timer = setInterval(() => {
        const next = Math.min(100, Math.round((performance.now() - start) / 9));
        setProgress(next);
        if (next >= 100) { clearInterval(timer); finish = setTimeout(() => { setLoading(false); sessionStorage.setItem('joshva-loaded', '1'); }, 180); }
      }, 30);
    }
    return () => { if (timer) clearInterval(timer); if (finish) clearTimeout(finish); gsap.ticker.remove(tick); lenis?.destroy(); };
  }, []);
  return loading ? <div className="loader" aria-hidden="true"><span className="loader-name">JOSHVA<span className="orange">.</span></span><span className="loader-bottom">A PORTFOLIO IN PROGRESS <span>{String(progress).padStart(3, '0')} / 100</span></span></div> : null;
}
