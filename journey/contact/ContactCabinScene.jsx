'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, Vignette, BrightnessContrast } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import ReceptionCabin from '../showcase/ReceptionCabin.jsx';
import { useIsMobile } from '@/hooks/useIsMobile.js';
import { useSceneReadyStore } from '@/lib/store/sceneReadyStore.js';

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
  ctx.strokeStyle = 'rgba(225,27,35,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 430, 0, Math.PI*2); ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Ground({ mobile }){
  const tex = useMemo(()=>podiumTexture(), []);
  return (
    <>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.006,0]}>
        <circleGeometry args={[8, 64]} />
        <meshBasicMaterial map={tex} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
      {!mobile && <ContactShadows position={[0,0.02,0]} scale={16} far={4} blur={2.2} opacity={0.55} frames={1} />}
    </>
  );
}

function Rig({ containerRef, camTarget }){
  const group = useRef();
  const rotY = useRef(-0.4);
  const mouse = useRef({ x:0, y:0 });
  const mSmooth = useRef({ x:0, y:0 });

  useEffect(()=>{
    const el = containerRef.current;
    if(!el) return;
    const onMove = (e)=>{
      const r = el.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left) / r.width - 0.5;
      mouse.current.y = (e.clientY - r.top) / r.height - 0.5;
    };
    el.addEventListener('pointermove', onMove);
    return ()=>el.removeEventListener('pointermove', onMove);
  }, [containerRef]);

  useFrame(({ camera, clock }, dt)=>{
    const d = Math.min(dt, 1/20);
    if(!reduced) rotY.current += d * 0.16;
    mSmooth.current.x += (mouse.current.x - mSmooth.current.x) * 0.05;
    mSmooth.current.y += (mouse.current.y - mSmooth.current.y) * 0.05;
    if(group.current){
      group.current.rotation.y = rotY.current + mSmooth.current.x * 0.5;
      group.current.position.y = Math.sin(clock.elapsedTime*0.4)*0.025;
    }
    camera.lookAt(...camTarget);
  });

  return (
    <group ref={group} position={[0,0,0]} scale={0.82}>
      <ReceptionCabin />
    </group>
  );
}

function SunRig({ loaded, mobile }){
  const sun = useRef();
  useFrame(()=>{ if(sun.current) sun.current.intensity = 3.2 * loaded.current; });
  return (
    <directionalLight ref={sun} position={[6,10,8]} intensity={0} color={0xfff3e2}
      castShadow={!mobile} shadow-mapSize={mobile ? [256,256] : [1024,1024]} shadow-bias={-0.0004}
      shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
  );
}

export default function ContactCabinScene(){
  const containerRef = useRef(null);
  const loaded = useRef(0);
  const mobile = useIsMobile();
  const [inView, setInView] = useState(true);
  const markSceneReady = useSceneReadyStore((s) => s.markSceneReady);

  useEffect(()=>{
    const tween = gsap.to(loaded, { current:1, duration:1.8, ease:'power2.inOut', delay:0.15 });
    return ()=>tween.kill();
  }, []);

  useEffect(()=>{
    const el = containerRef.current;
    if(!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry])=>setInView(entry.isIntersecting), { rootMargin: '200px' });
    io.observe(el);
    return ()=>io.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 [&>canvas]:block [&>canvas]:w-full [&>canvas]:h-full" ref={containerRef}>
      <Canvas
        shadows={mobile ? false : 'soft'}
        dpr={mobile ? 1 : [1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias:!mobile, powerPreference:'high-performance', alpha:true, toneMapping:THREE.ACESFilmicToneMapping }}
        camera={{ fov:38, near:0.1, far:60, position:[6.3, 2.3, 7.4] }}
        onCreated={markSceneReady}
      >
        <fogExp2 attach="fog" args={['#0a0a0b', 0.02]} />
        <SunRig loaded={loaded} mobile={mobile} />
        <directionalLight position={[-6,5,-6]} intensity={0.9} color={0xdce4f0} />
        <hemisphereLight args={[0x9aa4b5, 0x2a241c, 0.8]} />

        <Environment resolution={mobile ? 96 : 256} frames={1}>
          <Lightformer intensity={1.2} position={[0,6,0]} rotation={[Math.PI/2,0,0]} scale={[16,16,1]} color="#3a3b3e" />
          <Lightformer intensity={1.0} position={[-6,2.2,2]} rotation={[0,Math.PI/2,0]} scale={[7,3,1]} color="#3a3d43" />
          <Lightformer intensity={0.9} position={[6,2,-2]} rotation={[0,-Math.PI/2,0]} scale={[7,3,1]} color="#e8d9b8" />
        </Environment>

        <Ground mobile={mobile} />
        <Rig containerRef={containerRef} camTarget={[0, 1.1, 0.16]} />

        {!mobile && (
          <EffectComposer multisampling={0}>
            <N8AO aoRadius={0.5} distanceFalloff={1} intensity={2.0} color="#0a0806" halfRes />
            <Bloom mipmapBlur intensity={0.35} luminanceThreshold={1.0} luminanceSmoothing={0.3} />
            <BrightnessContrast brightness={-0.04} contrast={0.03} />
            <Vignette eskil={false} offset={0.28} darkness={0.62} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
