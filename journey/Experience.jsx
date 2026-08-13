'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { gsap } from 'gsap';
import { journey, mapRange } from './scrollState.js';
import CabinExterior from './CabinExterior.jsx';
import Interior from './Interior.jsx';
import CameraRig from './CameraRig.jsx';
import Effects from './Effects.jsx';
import { Dust, LightRays } from './Atmosphere.jsx';
import { useIsMobile } from '@/hooks/useIsMobile.js';

/* key light with load-in animation + subtle day→dusk drift over the journey */
function SunRig({ mobile }){
  const sun = useRef();
  const warm = new THREE.Color(0xffe3bd);
  const day = new THREE.Color(0xfff3e2);
  const tmp = new THREE.Color();
  useFrame(()=>{
    if(!sun.current) return;
    const p = journey.p;
    const dusk = mapRange(p, 0.15, 0.75);
    sun.current.intensity = (4.2 - dusk*1.5) * journey.loaded;
    sun.current.color.copy(tmp.copy(day).lerp(warm, dusk));
  });
  return (
    <directionalLight
      ref={sun}
      position={[7, 11, 9]}
      intensity={0}
      castShadow={!mobile}
      shadow-mapSize={mobile ? [512,512] : [2048,2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={9}
      shadow-camera-bottom={-9}
    />
  );
}

/* lets App pause this canvas once the walkthrough is finished and hidden */
function FrameGate(){
  const setFrameloop = useThree(s=>s.setFrameloop);
  useEffect(()=>{
    journey.mainLoop = setFrameloop;
    return ()=>{ if(journey.mainLoop === setFrameloop) journey.mainLoop = null; };
  }, [setFrameloop]);
  return null;
}

function Ground({ mobile }){
  return (
    <>
      {/* invisible shadow catcher — the cabin's shadow falls onto the backdrop photo's ground */}
      {!mobile && (
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.005,0]} receiveShadow>
          <planeGeometry args={[60,60]} />
          <shadowMaterial transparent opacity={0.42} />
        </mesh>
      )}
      {!mobile && <ContactShadows position={[0,0.02,0]} scale={14} far={4} blur={2.2} opacity={0.5} frames={1} />}
    </>
  );
}

export default function Experience(){
  const mobile = useIsMobile();

  // Hero text ([data-rise]) rides the exact same `journey.loaded` value that
  // lights up the cabin below, instead of a separate timeline — so text and
  // model are driven by one number and always land on screen together.
  useEffect(()=>{
    journey.loaded = 0;
    const riseEls = gsap.utils.toArray('[data-hero-overlay] [data-rise]');
    gsap.set(riseEls, { opacity:0, y:24 });
    // No per-element stagger offset — every element reads `journey.loaded`
    // directly, same as the sun light, so text and model finish together
    // with zero lag between them. `sine.out` keeps the tail smooth instead
    // of the crawl-then-catch-up feel `power2.out` gave the staggered version.
    const tween = gsap.to(journey, {
      loaded:1, duration:0.6, ease:'sine.out',
      onUpdate(){
        const l = journey.loaded;
        riseEls.forEach(el=>{
          el.style.opacity = String(l);
          el.style.transform = `translateY(${24*(1-l)}px)`;
        });
      },
    });
    return ()=>tween.kill();
  }, []);

  return (
    <div id="stage" className="fixed inset-0 w-screen h-screen z-1 [&>canvas]:block [&>canvas]:w-full [&>canvas]:h-full">
      <Canvas
        shadows={mobile ? false : 'soft'}
        dpr={mobile ? 1 : [1, 2]}
        // antialias is off even on desktop: the postprocessing EffectComposer
        // (Effects.jsx, desktop-only) does its own framebuffer resolve, and
        // the renderer also doing MSAA on the same default framebuffer is
        // what throws "glBlitFramebuffer: Read and write depth stencil
        // attachments cannot be the same image" on real GPUs (repeats every
        // frame). Mobile never hit this — antialias was already off there
        // and Effects doesn't mount on mobile either.
        gl={{ antialias:false, powerPreference:'high-performance', alpha:true, toneMapping:THREE.ACESFilmicToneMapping }}
        camera={{ fov:45, near:0.1, far:120, position:[0.3, 2.65, 15.2] }}
      >
        {/* no opaque background — the hero backdrop photo shows through the canvas */}
        <fogExp2 attach="fog" args={['#3a352e', 0.014]} />

        <SunRig mobile={mobile} />
        {/* hazy overcast site sky — cool sky bounce, warm dusty bounce off the ground */}
        <hemisphereLight args={[0x9aa4b5, 0x3a3226, 0.55]} />
        {/* red brand rim from behind-left, kept subtle so it doesn't tint like a studio gel */}
        <directionalLight position={[-8, 4, -6]} intensity={0.22} color={0xe11b23} />

        <Environment resolution={mobile ? 96 : 256} frames={1}>
          <Lightformer intensity={1.4} position={[0, 6, 0]} rotation={[Math.PI/2,0,0]} scale={[18,18,1]} color="#c7cdd8" />
          <Lightformer intensity={1.15} position={[-7, 2.5, 2]} rotation={[0,Math.PI/2,0]} scale={[8,3,1]} color="#dfe6f2" />
          <Lightformer intensity={0.95} position={[7, 2, -2]} rotation={[0,-Math.PI/2,0]} scale={[8,3,1]} color="#f0d9b8" />
          <Lightformer intensity={0.5} position={[0, 1.2, 6]} rotation={[0,Math.PI,0]} scale={[8,3,1]} color="#5c554a" />
          <Lightformer intensity={0.3} position={[0, 2.5, -9]} scale={[6,2,1]} color="#e11b23" />
        </Environment>

        <Ground mobile={mobile} />
        <CabinExterior />
        <Interior />
        <Dust count={mobile ? 90 : 260} />
        <LightRays />
        <CameraRig />
        {!mobile && <Effects />}
        <FrameGate />
      </Canvas>
    </div>
  );
}
