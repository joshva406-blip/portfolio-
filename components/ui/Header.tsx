'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function Header() {
 const [clock,setClock]=useState('--:--'); const [hidden,setHidden]=useState(false);
 useEffect(()=>{ const update=()=>setClock(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())); update(); const id=setInterval(update,30000); let last=window.scrollY; const scroll=()=>{const y=window.scrollY; setHidden(y>140 && y>last); last=y;}; window.addEventListener('scroll',scroll,{passive:true}); return ()=>{clearInterval(id);window.removeEventListener('scroll',scroll);}; },[]);
 return <header className={'header '+(hidden?'header-hidden':'')}><Link className="brand" href="/#top"><span className="brand-mark" aria-hidden="true">J<span>.</span></span><span className="brand-copy">JOSHVA<br/><small>FULL STACK DEVELOPER</small></span></Link><nav aria-label="Main navigation"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></nav><div className="clock">COIMBATORE, IN <span className="clock-dot">●</span> {clock}</div></header>;
}
