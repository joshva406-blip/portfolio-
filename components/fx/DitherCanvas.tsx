'use client';
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { gsap } from 'gsap';

const vertex = `attribute vec2 position; void main(){ gl_Position=vec4(position,0.,1.); }`;
const fragment = `precision highp float;
uniform float uProgress; uniform float uPixelSize; uniform vec3 uColor;
float bayer2(vec2 p) { return mod(p.x,2.0)*2.0 + mod(p.y,2.0)*3.0 - 4.0*mod(p.x,2.0)*mod(p.y,2.0); }
float bayer8(vec2 p) { return (16.0*bayer2(p) + 4.0*bayer2(floor(p/2.0)) + bayer2(floor(p/4.0)) + 0.5)/64.0; }
void main(){ vec2 cell=floor(gl_FragCoord.xy/uPixelSize); float alpha=step(uProgress,bayer8(cell)); gl_FragColor=vec4(uColor,alpha); }`;
/** Allocate WebGL only when this below-the-fold illustration approaches the viewport. */
export default function DitherCanvas() {
 const host = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const element=host.current;
  if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let dispose=()=>{};
  const observer=new IntersectionObserver(([entry])=>{
   if(!entry.isIntersecting)return;
   observer.disconnect();
   let renderer:Renderer;
   try{renderer=new Renderer({alpha:true,dpr:Math.min(devicePixelRatio||1,2),premultipliedAlpha:false});}catch{return;}
   const gl=renderer.gl; gl.clearColor(0,0,0,0); gl.canvas.setAttribute('aria-hidden','true'); element.appendChild(gl.canvas);
   const geometry=new Triangle(gl);
   const program=new Program(gl,{vertex,fragment,transparent:true,uniforms:{uProgress:{value:0},uPixelSize:{value:5*Math.min(devicePixelRatio||1,2)},uColor:{value:[.055,.055,.055]}}});
   const mesh=new Mesh(gl,{geometry,program});
   const draw=()=>renderer.render({scene:mesh});
   const resize=()=>{const {width,height}=element.getBoundingClientRect();if(width&&height){renderer.setSize(width,height);draw();}};
   resize();const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);
   const tween=gsap.to(program.uniforms.uProgress,{value:1,duration:.8,ease:'power2.inOut',onUpdate:draw,onComplete:()=>element.classList.add('dither-complete')});
   dispose=()=>{tween.kill();resizeObserver.disconnect();geometry.remove();program.remove();gl.canvas.remove();gl.getExtension('WEBGL_lose_context')?.loseContext();};
  },{rootMargin:'0px 0px 150px 0px',threshold:0});
  observer.observe(element);
  return ()=>{observer.disconnect();dispose();};
 }, []);
 return <div ref={host} className="dither-canvas" aria-hidden="true"/>;
}
