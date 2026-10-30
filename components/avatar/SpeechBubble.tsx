'use client';
import { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import type { AvatarPose } from './poses';

type Props = { children: React.ReactNode; pose?: AvatarPose; className?: string; side?: 'left'|'right'; };
/** A single accessible bubble; decorative character is hidden from assistive technology. */
export default function SpeechBubble({children,pose='idle',className='',side='left'}: Props) {
 const root = useRef<HTMLDivElement>(null);
 const [visible,setVisible] = useState(false);
 const [talking,setTalking] = useState(false);
 useEffect(() => { const element=root.current; if(!element)return; let timeout: ReturnType<typeof setTimeout>; const observer=new IntersectionObserver(([entry])=>{ if(entry.isIntersecting){setVisible(true); if(!matchMedia('(prefers-reduced-motion: reduce)').matches){setTalking(true); const length=element.querySelector('.speech-bubble')?.textContent?.length ?? 40; timeout=setTimeout(()=>setTalking(false),Math.min(4000,Math.max(700,length*38)));}} else {setVisible(false);setTalking(false);clearTimeout(timeout);} },{threshold:.2}); observer.observe(element); return()=>{observer.disconnect();clearTimeout(timeout)}; },[]);
 return <div ref={root} className={`avatar-scene avatar-scene-${side} ${visible?'is-visible':''} ${className}`}><div className="speech-bubble">{children}</div><Avatar pose={pose} talking={talking}/></div>;
}
