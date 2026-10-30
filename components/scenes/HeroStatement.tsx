'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const text = 'I’m a full-stack developer who builds fast, responsive web apps, from the React interface to the API and database behind it. I’m especially into AI-powered products: LLMs, RAG pipelines, and tools that actually help people.';
const highlighted = new Set(['full-stack', 'React', 'AI-powered']);

gsap.registerPlugin(ScrollTrigger);
export default function HeroStatement() {
 const ref = useRef<HTMLParagraphElement>(null);
 useEffect(() => {
  if (!ref.current) return;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const words = ref.current?.querySelectorAll<HTMLElement>('.reveal-word');
   if (!words?.length) return;
   let lastPoint = false;
   const tween = gsap.fromTo(words, { opacity: .15 }, {
    opacity: 1, stagger: .08, ease: 'none',
    scrollTrigger: {
     trigger: ref.current,
     start: 'top 80%',
     end: 'bottom 40%',
     scrub: true,
     onUpdate: self => {
      const next = self.progress >= .96;
      if (next !== lastPoint) { lastPoint = next; window.dispatchEvent(new CustomEvent('hero-reveal-point', { detail: next })); }
     }
    }
   });
   return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  });
  return () => media.revert();
 }, []);
 return <p ref={ref} className="hero-statement"><span className="sr-only">{text}</span>{text.split(' ').map((word, i) => <span key={`${word}-${i}`} className={`reveal-word${highlighted.has(word) ? ' reveal-accent' : ''}`} aria-hidden="true">{word}{' '}</span>)}</p>;
}
