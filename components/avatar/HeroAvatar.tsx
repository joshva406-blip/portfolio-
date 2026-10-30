'use client';
import { useEffect, useState } from 'react';
import SpeechBubble from './SpeechBubble';

export default function HeroAvatar() {
 const [pointing, setPointing] = useState(false);
 useEffect(() => {
  const change = (event: Event) => setPointing((event as CustomEvent<boolean>).detail);
  window.addEventListener('hero-reveal-point', change);
  return () => window.removeEventListener('hero-reveal-point', change);
 }, []);
 return <SpeechBubble pose={pointing ? 'point-left' : 'wave'}>Hey, I’m Joshva. <strong>Let’s look under the hood.</strong></SpeechBubble>;
}
