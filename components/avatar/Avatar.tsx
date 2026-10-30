'use client';
import { useEffect, useId, useRef, useState } from 'react';
import type { AvatarPose } from './poses';

type Props = { pose?: AvatarPose; talking?: boolean; className?: string };
/** Original illustrated character. Its dots are SVG patterns rather than an external image. */
export default function Avatar({ pose = 'idle', talking = false, className = '' }: Props) {
 const id = useId().replace(/:/g, '');
 const root = useRef<HTMLDivElement>(null);
 const [blink, setBlink] = useState(false);
 const [mouth, setMouth] = useState(false);
 const [eyes, setEyes] = useState({x: 0, y: 0});
 useEffect(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  let close: ReturnType<typeof setTimeout>; let next: ReturnType<typeof setTimeout>;
  const schedule = () => { next = setTimeout(() => { setBlink(true); close = setTimeout(() => { setBlink(false); schedule(); }, 140); }, 3000 + Math.random() * 2000); };
  schedule();
  const move = (e: PointerEvent) => { const rect = root.current?.getBoundingClientRect(); if (!rect) return; const dx = e.clientX - (rect.left + rect.width / 2); const dy = e.clientY - (rect.top + rect.height * .38); const dist = Math.max(1, Math.hypot(dx,dy)); setEyes({x: Math.max(-4,Math.min(4,dx / dist * 4)),y:Math.max(-4,Math.min(4,dy / dist * 4))}); };
  if (matchMedia('(pointer: fine)').matches) window.addEventListener('pointermove',move,{passive:true});
  return () => { clearTimeout(next); clearTimeout(close); window.removeEventListener('pointermove',move); };
 }, []);
 useEffect(() => { if (!talking || matchMedia('(prefers-reduced-motion: reduce)').matches) { setMouth(false); return; } const timer = setInterval(() => setMouth(value => !value), 120); return () => clearInterval(timer); },[talking]);
 const waving = pose === 'wave' || pose === 'laugh';
 const pointing = pose === 'point-right' || pose === 'point-left';
 const airborne = pose === 'hold' || pose === 'fall';
 return <div ref={root} className={`avatar ${className}`} aria-hidden="true"><svg viewBox="0 0 260 300" role="presentation" xmlns="http://www.w3.org/2000/svg">
  <defs><pattern id={`dots-${id}`} width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".85" fill="#111"/></pattern><pattern id={`dense-${id}`} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.35" fill="#111"/></pattern></defs>
  <g className="avatar-body" transform={pose === 'point-left' ? 'translate(260 0) scale(-1 1)' : undefined}>
   <path d="M63 285c2-44 12-76 39-88l29-9 29 9c28 12 38 44 41 88Z" fill="#f4f3ef" stroke="#111" strokeWidth="3"/><path d="M64 285c2-44 12-76 39-88l28-8 29 8c27 12 38 44 40 88Z" fill={`url(#dots-${id})`}/>
   <path d="M104 195c0 15 10 23 27 23s27-8 27-23l-5-25h-44Z" fill="#f4f3ef" stroke="#111" strokeWidth="3"/><path d="M105 200q26 24 52 0" fill="none" stroke="#111" strokeWidth="2"/>
   {airborne ? <path d="M79 239q-20-5-31-25l-12-20q-3-5-7-3-4 2-2 7l7 17-10-8q-5-3-7 1-2 3 2 7l15 15q7 19 30 29Z" fill="#f4f3ef" stroke="#111" strokeWidth="3" strokeLinejoin="round"/> : <path d="M70 239q-15 9-20 31-2 9 7 12 9 2 14-8l12-22" fill="#f4f3ef" stroke="#111" strokeWidth="3"/>}
   {airborne ? <path d="M180 239q20-5 31-25l12-20q3-5 7-3 4 2 2 7l-7 17 10-8q5-3 7 1 2 3-2 7l-15 15q-7 19-30 29Z" fill="#f4f3ef" stroke="#111" strokeWidth="3" strokeLinejoin="round"/> : waving ? <g className="avatar-wave"><path d="M187 240q17-10 22-36l-3-26q-1-6 3-7 4-1 6 6l3 11 3-25q1-6 5-5 4 0 3 6l-1 21 6-18q2-5 6-3 3 1 1 6l-5 20 7-11q3-4 6-1 2 2 0 6l-12 22q-2 7-8 12-3 36-26 49Z" fill="#f4f3ef" stroke="#111" strokeWidth="3" strokeLinejoin="round"/></g> : pointing ? <path d="M187 240q16-11 25-27l24-8q5-2 4-6-1-4-6-3l-18 4 14-12q4-3 1-6-2-3-6 0l-20 14q-8 3-11 11l-20 12Z" fill="#f4f3ef" stroke="#111" strokeWidth="3"/> : <path d="M188 239q16 8 21 31 2 9-7 12-8 2-13-8l-13-22" fill="#f4f3ef" stroke="#111" strokeWidth="3"/>}
   <ellipse cx="131" cy="119" rx="63" ry="73" fill="#f4f3ef" stroke="#111" strokeWidth="3"/><ellipse cx="131" cy="119" rx="61" ry="71" fill={`url(#dots-${id})`} opacity=".5"/>
   <path d="M69 105q-4-63 46-72 28-8 48 7 27 7 31 42l-4 31q-8-10-12-23-15 6-27-3-19 12-36 4-13 10-27 7l-7 20-10 3Z" fill="#111"/><path d="M81 88q6-42 43-47 33-8 52 18-19-7-29 2-17-6-30 4-18-1-36 23Z" fill={`url(#dense-${id})`} stroke="#555" strokeWidth="1"/>
   <g transform={`translate(${eyes.x} ${eyes.y})`} fill="#111">{blink || pose === 'blink' ? <><path d="M99 128h14M149 128h14" stroke="#111" strokeWidth="3" strokeLinecap="round"/></> : <><ellipse cx="106" cy="128" rx="3.8" ry="5.3"/><ellipse cx="156" cy="128" rx="3.8" ry="5.3"/></>}</g>
   {pose === 'fall' ? <ellipse cx="131" cy="153" rx="6" ry="8" fill="#111"/> : pose === 'hold' ? <path d="M124 154q7-3 14 0" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/> : mouth || pose === 'talk' ? <ellipse cx="131" cy="153" rx="5" ry="7" fill="#111"/> : pose === 'laugh' ? <path d="M119 151q12 15 24 0Z" fill="#111"/> : pose === 'think' ? <path d="M126 155q7-4 13 0" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/> : <path d="M121 151q10 9 20 0" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>}
   {airborne ? <path d="M97 115q8-8 16-3M149 112q8-5 16 3" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"/> : <path d="M96 117q8-5 16-1M150 116q8-4 15 1" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"/>}
  </g></svg></div>;
}
