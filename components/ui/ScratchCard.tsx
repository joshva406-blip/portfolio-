'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = { onReveal?: () => void };
const WIDTH = 600, HEIGHT = 260, RADIUS = 28;
export default function ScratchCard({ onReveal }: Props) {
 const canvas = useRef<HTMLCanvasElement>(null);
 const drawing = useRef(false);
 const previous = useRef<{ x:number; y:number } | null>(null);
 const lastSample = useRef(0);
 const revealedRef = useRef(false);
 const [revealed,setRevealed] = useState(false);
 const [celebrate,setCelebrate] = useState(false);
 const reveal = useCallback(() => {
  if (revealedRef.current) return;
  revealedRef.current = true;
  setRevealed(true);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setCelebrate(true);
  onReveal?.();
 },[onReveal]);
 useEffect(()=>{
  const ctx=canvas.current?.getContext('2d',{willReadFrequently:true});
  if(!ctx)return;
  ctx.fillStyle='#b8b9b5';ctx.fillRect(0,0,WIDTH,HEIGHT);
  // Dithered metallic surface: deterministic dots, with a solid base for accurate alpha sampling.
  for(let y=0;y<HEIGHT;y+=6)for(let x=0;x<WIDTH;x+=6){ctx.fillStyle=((x/6+y/6)%2===0)?'#e6e6e0':'#90928e';ctx.fillRect(x,y,2,2);}
  ctx.fillStyle='#111';ctx.textAlign='center';ctx.font='600 28px sans-serif';ctx.fillText('SCRATCH ME',WIDTH/2,HEIGHT/2-2);ctx.font='12px monospace';ctx.fillText('A LITTLE SOMETHING UNDER HERE  ↗',WIDTH/2,HEIGHT/2+26);
 },[]);
 function coordinates(event: React.PointerEvent<HTMLCanvasElement>) {const rect=event.currentTarget.getBoundingClientRect();return {x:(event.clientX-rect.left)*WIDTH/rect.width,y:(event.clientY-rect.top)*HEIGHT/rect.height};}
 function scratch(event: React.PointerEvent<HTMLCanvasElement>) {
  if(!drawing.current || revealedRef.current)return;
  const ctx=canvas.current?.getContext('2d',{willReadFrequently:true});if(!ctx)return;
  const point=coordinates(event);const from=previous.current ?? point;
  ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=RADIUS*2;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(point.x,point.y);ctx.stroke();ctx.beginPath();ctx.arc(point.x,point.y,RADIUS,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over';previous.current=point;
  if(performance.now()-lastSample.current>150){lastSample.current=performance.now();const pixels=ctx.getImageData(0,0,WIDTH,HEIGHT).data;let clear=0,total=0;for(let i=3;i<pixels.length;i+=4*16){total++;if(pixels[i]<128)clear++;}if(clear/total>=.55)reveal();}
 }
 function start(event: React.PointerEvent<HTMLCanvasElement>){if(revealedRef.current)return;event.preventDefault();drawing.current=true;previous.current=null;event.currentTarget.setPointerCapture(event.pointerId);scratch(event);}
 function stop(event: React.PointerEvent<HTMLCanvasElement>){if(drawing.current && event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);drawing.current=false;previous.current=null;}
 return <div className="scratch-component"><div className="scratch-top"><span>THE LITTLE WIN / 01</span><span>SCRATCH TO REVEAL ↘</span></div><div className="scratch-card"><div className="scratch-prize"><span>✳ &nbsp; A MOMENT WORTH KEEPING</span><strong>First prize.</strong><p>Hackathon winner</p><small>Event name, year and place to be added.</small></div><canvas ref={canvas} width={WIDTH} height={HEIGHT} className={`scratch-surface ${revealed?'scratch-cleared':''}`} onPointerDown={start} onPointerMove={scratch} onPointerUp={stop} onPointerCancel={stop} aria-hidden="true" data-cursor="Scratch"/>{celebrate && <div className="pixel-confetti" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{'--x':`${(i*43)%100}%`,'--delay':`${(i%6)*40}ms`,'--rotate':`${i*29}deg`,'--color':['#ffd84d','#ff5b2e','#f4f3ef','#c7a6f5'][i%4]} as React.CSSProperties}/>)}</div>}</div><div className="scratch-actions"><span aria-live="polite">{revealed?'Revealed: First prize, hackathon winner. Event details to be added.':'Scratch the panel to uncover the win.'}</span><button type="button" onClick={reveal} disabled={revealed}>{revealed?'REVEALED':'REVEAL WITHOUT SCRATCHING'} ↗</button></div></div>;
}
