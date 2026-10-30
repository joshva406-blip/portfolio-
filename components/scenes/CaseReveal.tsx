'use client';
import { useEffect,useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function CaseReveal({text}:{text:string}){const ref=useRef<HTMLParagraphElement>(null);useEffect(()=>{const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{if(!ref.current)return;const tween=gsap.fromTo(ref.current.querySelectorAll('[aria-hidden="true"]'),{opacity:.15},{opacity:1,stagger:.08,ease:'none',scrollTrigger:{trigger:ref.current,start:'top 80%',end:'bottom 40%',scrub:true}});return()=>{tween.scrollTrigger?.kill();tween.kill();}});return()=>mm.revert()},[]);return <p ref={ref}><span className="sr-only">{text}</span>{text.split(' ').map((word,i)=><span key={i} aria-hidden="true">{word} </span>)}</p>}
