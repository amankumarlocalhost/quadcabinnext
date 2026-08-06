'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, HueSaturation, BrightnessContrast } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import SiteCabinPro from './SiteCabinPro.jsx';
import { useSceneReadyStore } from '@/lib/store/sceneReadyStore.js';

// A free-floating cabin standing directly on the hero photo — no card, no
// backdrop plane, no vignette framing it into a box. Just the model plus a
// small, tightly-scoped contact shadow so it reads as grounded, with the
// alpha:true canvas leaving every other pixel fully transparent so the
// photo behind shows through untouched. SiteCabinPro is a dedicated hero
// model built off the Quad Cabins mark palette (white body, black steel,
// red accent line) — distinct from every other showcase cabin on the site.
// Camera sits close in with a narrower vertical look-height than the
// earlier pass so the cabin fills its frame instead of floating in a lot
// of empty headroom above it.
const FOV = 34;
// position + look-at shifted left by the same amount (rather than just
// re-aiming) so the cabin recentres toward the right of the frame without
// changing the viewing angle — re-aiming alone would also rotate the shot
const CAM_POS = [4.1, 2.25, 8.6];
const CAM_LOOK = [-0.6, 1.1, 0.1];
// Phone framing: the frame stacks under the copy on small screens, so pull
// the camera in to fill it. Aimed well above cabin-body height — the
// rooftop sign's posts put its top edge at y≈3.7, so the look height needs
// to sit roughly mid-way between the ground and the sign, not mid-cabin.
const CAM_POS_SMALL = [3.8, 2.3, 7.7];
const CAM_LOOK_SMALL = [-0.43, 1.65, 0.1];
const isSmallViewport = () => window.matchMedia('(max-width:900px)').matches;
// a shallow default angle — this model's front face (window, door, brand
// fin) is the whole point, so it should read nearly head-on rather than
// heavily foreshortened into a side profile
const BASE_ROT = 0.17;
const ROT_AMPLITUDE = 0.05;
// radians of rotation per pixel of horizontal drag
const DRAG_SENSITIVITY = 0.0072;
// how quickly released drag momentum bleeds off (higher = shorter coast)
const INERTIA_DAMPING = 2.6;

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Ground(){
  return <ContactShadows position={[0,0.02,0]} scale={10} far={3} blur={2.4} opacity={0.55} frames={1} />;
}

function SunRig(){
  const sun = useRef();
  const loaded = useRef(0);
  useFrame(()=>{
    loaded.current = Math.min(1, loaded.current + 0.02);
    if(sun.current) sun.current.intensity = 3.3 * loaded.current;
  });
  return (
    <directionalLight
      ref={sun}
      position={[6, 10, 8]}
      intensity={0}
      color={0xfff3e2}
      castShadow
      shadow-mapSize={[2048,2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-6.5}
      shadow-camera-right={6.5}
      shadow-camera-top={6.5}
      shadow-camera-bottom={-6.5}
    />
  );
}

function Turntable({ drag }){
  const group = useRef();
  const { camera } = useThree();

  useEffect(()=>{
    const apply = ()=>{
      const small = isSmallViewport();
      camera.position.set(...(small ? CAM_POS_SMALL : CAM_POS));
      camera.lookAt(...(small ? CAM_LOOK_SMALL : CAM_LOOK));
    };
    apply();
    window.addEventListener('resize', apply);
    return ()=>window.removeEventListener('resize', apply);
  }, [camera]);

  useFrame((state, dt)=>{
    if(!group.current) return;
    const d = drag.current;

    if(d.dragging){
      group.current.rotation.y = d.rotY;
      return;
    }
    if(d.rotated){
      // coast on release momentum, damping smoothly to a stop — once it
      // settles the cabin simply holds the user's chosen angle.
      if(Math.abs(d.vel) > 0.0002){
        d.vel *= Math.exp(-INERTIA_DAMPING * Math.min(dt, 1/20));
        d.rotY += d.vel;
      } else {
        d.vel = 0;
      }
      group.current.rotation.y = d.rotY;
      return;
    }
    if(reduced){
      group.current.rotation.y = BASE_ROT;
      return;
    }
    const t = state.clock.elapsedTime;
    group.current.rotation.y = BASE_ROT + Math.sin(t*0.16) * ROT_AMPLITUDE;
    d.rotY = group.current.rotation.y;
  });

  return <group ref={group} position={[0, 0, 0]}><SiteCabinPro /></group>;
}

export default function IndustriesHeroCabin(){
  // dragging state lives outside the R3F tree (driven by native pointer
  // events on the wrapper div) but is read every frame inside the Canvas —
  // a ref avoids re-rendering either side on every mouse-move.
  const drag = useRef({ dragging:false, rotated:false, lastX:0, lastT:0, vel:0, rotY:BASE_ROT });
  const markSceneReady = useSceneReadyStore((s) => s.markSceneReady);

  useEffect(()=>{
    const cabin = { loaded: 0 };
    const tween = gsap.to(cabin, { loaded:1, duration:1.6, ease:'power2.inOut' });
    return ()=>tween.kill();
  }, []);

  const onPointerDown = (e)=>{
    const d = drag.current;
    d.dragging = true;
    d.vel = 0;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e)=>{
    const d = drag.current;
    if(!d.dragging) return;
    const now = performance.now();
    const dt = Math.max(now - d.lastT, 1);
    const dx = e.clientX - d.lastX;
    d.lastX = e.clientX;
    d.lastT = now;
    const step = dx * DRAG_SENSITIVITY;
    d.rotY += step;
    // smoothed instantaneous velocity (radians/frame at ~60fps), used for
    // the post-release inertial coast
    d.vel = d.vel * 0.6 + (step / dt) * 16.6 * 0.4;
    d.rotated = true;
  };
  const onPointerUp = (e)=>{
    drag.current.dragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="w-full h-full touch-none cursor-grab"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
    <Canvas
      shadows="soft"
      dpr={[1, 1.75]}
      gl={{ antialias:true, powerPreference:'high-performance', alpha:true, toneMapping:THREE.ACESFilmicToneMapping }}
      // near/far kept tight (the cabin + its ground disc never exceed ~15
      // units from camera) — a wide near..far ratio starves the depth
      // buffer of precision and is the single biggest cause of z-fighting
      // flicker on thin, closely-stacked panels like these.
      camera={{ fov:FOV, near:1, far:25, position: CAM_POS }}
      onCreated={markSceneReady}
    >
      <fogExp2 attach="fog" args={['#0a0a0b', 0.011]} />
      <SunRig />
      <hemisphereLight args={[0x9aa4b5, 0x2a241c, 0.9]} />
      <directionalLight position={[-7,4,-5]} intensity={0.32} color={0xe11b23} />
      <directionalLight position={[2,5,6]} intensity={0.4} color={0xdbe6f5} />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.3} position={[0,6,0]} rotation={[Math.PI/2,0,0]} scale={[16,16,1]} color="#3f4045" />
        <Lightformer intensity={1.1} position={[-6,2.5,2]} rotation={[0,Math.PI/2,0]} scale={[7,3,1]} color="#3a3d43" />
        <Lightformer intensity={1.0} position={[6,2,-2]} rotation={[0,-Math.PI/2,0]} scale={[7,3,1]} color="#e8d9b8" />
        <Lightformer intensity={0.85} position={[0,2.5,-8]} rotation={[0,Math.PI,0]} scale={[7,3,1]} color="#4a4d53" />
      </Environment>

      <Ground />
      <Turntable drag={drag} />

      <EffectComposer multisampling={0}>
        <N8AO aoRadius={0.5} distanceFalloff={1} intensity={2.1} color="#0a0806" halfRes />
        <Bloom mipmapBlur intensity={0.32} luminanceThreshold={1.0} luminanceSmoothing={0.3} />
        <HueSaturation saturation={-0.02} />
        <BrightnessContrast brightness={0.03} contrast={0.05} />
      </EffectComposer>
    </Canvas>
    </div>
  );
}
