'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, Vignette, HueSaturation, BrightnessContrast } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import { showcase } from './state.js';
import SiteOffice from './SiteOffice.jsx';

// Mirrors the old Choreographer's Site Office hold (see git history of
// Scene.jsx) but static — this is only the intro hero shot, shown before
// the user starts scrolling into the per-product image carousel.
const CAM_POS = [8.0, 3.2, 11.2];
const CAM_LOOK = [-4.6, 1.6, 0];

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function podiumTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 1024;
  const ctx = c.getContext('2d');
  const cx = 512, cy = 512;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 512);
  g.addColorStop(0, 'rgba(28,28,31,0.95)');
  g.addColorStop(0.55, 'rgba(18,18,20,0.7)');
  g.addColorStop(0.85, 'rgba(10,10,11,0.25)');
  g.addColorStop(1, 'rgba(10,10,11,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,1024,1024);

  ctx.strokeStyle = 'rgba(225,27,35,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 430, 0, Math.PI*2); ctx.stroke();
  ctx.strokeStyle = 'rgba(225,27,35,0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, 470, 0, Math.PI*2); ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for(let r = 120; r < 420; r += 90){
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Podium(){
  const tex = useMemo(() => podiumTexture(), []);
  return (
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.006,0]}>
      <circleGeometry args={[8, 64]} />
      <meshBasicMaterial map={tex} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Ground(){
  return (
    <>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.005,0]} receiveShadow>
        <planeGeometry args={[60,60]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
      <Podium />
      <ContactShadows position={[0,0.02,0]} scale={16} far={4} blur={2.2} opacity={0.5} frames={1} />
    </>
  );
}

function SunRig(){
  const sun = useRef();
  useFrame(()=>{
    if(!sun.current) return;
    sun.current.intensity = 3.4 * showcase.loaded;
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
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={9}
      shadow-camera-bottom={-9}
    />
  );
}

function FillLight(){
  const fill = useRef();
  useFrame(()=>{
    if(!fill.current) return;
    fill.current.intensity = 1.1 * showcase.loaded;
  });
  return <directionalLight ref={fill} position={[-7, 6, -8]} intensity={0} color={0xdce4f0} />;
}

/* static hold on the Site Office cabin, with the same gentle idle breathing
   and mouse parallax the old Choreographer applied while a cabin was held */
function IdleCabin(){
  const group = useRef();
  const { camera } = useThree();
  const camPos = useRef(new THREE.Vector3(...CAM_POS));
  const smoothedLook = useRef(new THREE.Vector3(...CAM_LOOK));
  const mouse = useRef({ x:0, y:0 });
  const mSmooth = useRef({ x:0, y:0 });

  useEffect(()=>{
    const onMove = (e)=>{
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove);
    return ()=>window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state)=>{
    const intro = 1 - showcase.loaded;
    camPos.current.set(...CAM_POS);
    camPos.current.z += intro * 2.4;
    camPos.current.y += intro * 0.3;

    if(!reduced){
      const t = state.clock.elapsedTime;
      camPos.current.x += Math.sin(t*0.35) * 0.05;
      camPos.current.y += Math.sin(t*0.5) * 0.03;
      if(group.current) group.current.rotation.y = -0.3 + Math.sin(t*0.12) * 0.1;
    } else if(group.current){
      group.current.rotation.y = -0.3;
    }

    mSmooth.current.x += (mouse.current.x - mSmooth.current.x) * 0.05;
    mSmooth.current.y += (mouse.current.y - mSmooth.current.y) * 0.05;
    const par = reduced ? 0 : 1;
    camPos.current.x += mSmooth.current.x * 0.7 * par;
    camPos.current.y -= mSmooth.current.y * 0.4 * par;

    camera.position.lerp(camPos.current, 1 - Math.exp(-6*0.016));
    smoothedLook.current.lerp(new THREE.Vector3(...CAM_LOOK), 1 - Math.exp(-5*0.016));
    camera.lookAt(smoothedLook.current);
  });

  return <group ref={group}><SiteOffice /></group>;
}

export default function HeroCabin(){
  const wrapRef = useRef(null);

  useEffect(()=>{
    showcase.loaded = 0;
    const tween = gsap.to(showcase, { loaded:1, duration:2.2, ease:'power2.inOut', delay:0.2 });
    return ()=>tween.kill();
  }, []);

  useEffect(()=>{
    const tick = ()=>{
      if(!wrapRef.current) return;
      // fades out over the same 0..5% scroll window the intro copy uses
      const k = Math.min(1, showcase.target / 0.05);
      wrapRef.current.style.opacity = String(1 - k);
      wrapRef.current.style.visibility = k >= 1 ? 'hidden' : 'visible';
    };
    gsap.ticker.add(tick);
    return ()=>gsap.ticker.remove(tick);
  }, []);

  return (
    <div className="w-full h-full block [&>canvas]:block [&>canvas]:w-full! [&>canvas]:h-full!" ref={wrapRef}>
      <Canvas
        shadows="soft"
        dpr={[1, 1.5]}
        gl={{ antialias:true, powerPreference:'high-performance', alpha:true, toneMapping:THREE.ACESFilmicToneMapping }}
        camera={{ fov:42, near:0.1, far:100, position: CAM_POS }}
      >
        <fogExp2 attach="fog" args={['#0a0a0b', 0.016]} />
        <SunRig />
        <FillLight />
        <hemisphereLight args={[0x9aa4b5, 0x2a241c, 0.85]} />
        <directionalLight position={[-8,4,-6]} intensity={0.2} color={0xe11b23} />

        <Environment resolution={256} frames={1}>
          <Lightformer intensity={1.3} position={[0,6,0]} rotation={[Math.PI/2,0,0]} scale={[18,18,1]} color="#3a3b3e" />
          <Lightformer intensity={1.1} position={[-7,2.5,2]} rotation={[0,Math.PI/2,0]} scale={[8,3,1]} color="#3a3d43" />
          <Lightformer intensity={0.9} position={[7,2,-2]} rotation={[0,-Math.PI/2,0]} scale={[8,3,1]} color="#e8d9b8" />
          <Lightformer intensity={0.8} position={[0,2.5,-9]} rotation={[0,Math.PI,0]} scale={[8,3,1]} color="#4a4d53" />
          <Lightformer intensity={0.8} position={[0,2.5,9]} scale={[8,3,1]} color="#4a4d53" />
        </Environment>

        <Ground />
        <IdleCabin />

        <EffectComposer multisampling={0}>
          <N8AO aoRadius={0.5} distanceFalloff={1} intensity={2.2} color="#0a0806" halfRes />
          <Bloom mipmapBlur intensity={0.4} luminanceThreshold={1.0} luminanceSmoothing={0.3} />
          <HueSaturation saturation={-0.15} />
          <BrightnessContrast brightness={-0.06} contrast={0.04} />
          <Vignette eskil={false} offset={0.24} darkness={0.68} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
