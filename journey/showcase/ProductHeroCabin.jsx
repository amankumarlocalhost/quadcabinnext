'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows, SoftShadows } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, Vignette, HueSaturation, BrightnessContrast } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import ExecutiveCabin from './ExecutiveCabin.jsx';
import { useSceneReadyStore } from '@/lib/store/sceneReadyStore.js';

// Self-contained static turntable for the /products hero — no scroll link,
// just a fixed camera and a drag-to-rotate cabin. ExecutiveCabin is a
// dedicated hero model (anthracite cassette panels, glass curtain wall with
// a furnished interior glowing behind it, wood-slat feature bay) so the
// hero reads as a premium flagship shot rather than repeating any of the
// four showcase cabins used further down the page.
const FOV = 38;
const CAM_POS = [7.6, 2.75, 9.0];
const CAM_LOOK = [0, 1.35, 0.2];
// Phone framing: the frame sits under the intro copy in portrait, so pull
// in closer to fill the shorter box. Aimed higher than the very first pass
// (0.95) — that cut the "QUAD CABINS" roof sign off the top of the frame,
// since it sits well above the roofline at y ≈ T+0.52.
const CAM_POS_SMALL = [6.4, 2.7, 7.6];
const CAM_LOOK_SMALL = [0, 1.3, 0.2];
const isSmallViewport = () => window.matchMedia('(max-width:900px)').matches;
const BASE_ROT = -0.22;
const ROT_AMPLITUDE = 0.09;
// radians of rotation per pixel of horizontal drag
const DRAG_SENSITIVITY = 0.0072;
// how quickly released drag momentum bleeds off (higher = shorter coast)
const INERTIA_DAMPING = 2.6;

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cabin floats on just a soft contact shadow — no visible floor plane —
// matching the Industries hero cabin's Ground() treatment.
function Ground(){
  return <ContactShadows position={[0,0.02,0]} scale={14} far={4} blur={2.2} opacity={0.5} frames={1} />;
}

function SunRig(){
  const sun = useRef();
  const loaded = useRef(0);
  useFrame(()=>{
    loaded.current = Math.min(1, loaded.current + 0.02);
    if(sun.current) sun.current.intensity = 4.0 * loaded.current;
  });
  return (
    <directionalLight
      ref={sun}
      position={[7, 11, 9]}
      intensity={0}
      color={0xfff3e2}
      castShadow
      shadow-mapSize={[1536,1536]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-8}
      shadow-camera-right={8}
      shadow-camera-top={8}
      shadow-camera-bottom={-8}
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

  return <group ref={group} position={[0, 0, 0]}><ExecutiveCabin /></group>;
}

export default function ProductHeroCabin(){
  // dragging state lives outside the R3F tree (it's driven by native pointer
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
      camera={{ fov:FOV, near:0.1, far:80, position: CAM_POS }}
      onCreated={markSceneReady}
    >
      <fogExp2 attach="fog" args={['#0a0a0b', 0.009]} />
      <SunRig />
      <SoftShadows size={16} samples={12} focus={0.65} />
      <hemisphereLight args={[0x9aa4b5, 0x2a241c, 0.9]} />
      <directionalLight position={[-8,4,-6]} intensity={0.4} color={0xe11b23} />
      <directionalLight position={[3,5,7]} intensity={0.55} color={0xdbe6f5} />

      <Environment resolution={384} frames={1}>
        <Lightformer intensity={1.4} position={[0,6,0]} rotation={[Math.PI/2,0,0]} scale={[18,18,1]} color="#3f4045" />
        <Lightformer intensity={1.15} position={[-7,2.5,2]} rotation={[0,Math.PI/2,0]} scale={[8,3,1]} color="#3a3d43" />
        <Lightformer intensity={1.0} position={[7,2,-2]} rotation={[0,-Math.PI/2,0]} scale={[8,3,1]} color="#e8d9b8" />
        <Lightformer intensity={0.85} position={[0,2.5,-9]} rotation={[0,Math.PI,0]} scale={[8,3,1]} color="#4a4d53" />
        <Lightformer intensity={0.85} position={[0,2.5,9]} scale={[8,3,1]} color="#4a4d53" />
      </Environment>

      <Ground />
      <Turntable drag={drag} />

      <EffectComposer multisampling={0}>
        <N8AO aoRadius={0.5} distanceFalloff={1} intensity={2.1} color="#0a0806" halfRes />
        <Bloom mipmapBlur intensity={0.42} luminanceThreshold={0.95} luminanceSmoothing={0.3} />
        <HueSaturation saturation={-0.02} />
        <BrightnessContrast brightness={0.04} contrast={0.06} />
        <Vignette eskil={false} offset={0.26} darkness={0.42} />
      </EffectComposer>
    </Canvas>
    </div>
  );
}
