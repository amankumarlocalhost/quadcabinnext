'use client';

import { Component, useEffect, useRef } from 'react';
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
      shadow-mapSize={mobile ? [512,512] : [1536,1536]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={9}
      shadow-camera-bottom={-9}
    />
  );
}

// Temporary load-time diagnostic — remove once the slow-load report is
// resolved. Logs the first actually-rendered frame (after GPU shader
// compilation for every material in the scene, which onCreated doesn't
// capture since that fires right as the context is created, before draw calls).
function FirstFrameMarker(){
  const logged = useRef(false);
  useFrame(()=>{
    if(logged.current) return;
    logged.current = true;
    console.log(`[perf] first rendered frame: ${performance.now().toFixed(1)}ms since navigation start`);
  });
  return null;
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

// WebGL context creation can fail for reasons entirely outside this app
// (GPU disabled/blocklisted by the browser, too many contexts already open,
// unsupported device) — without this boundary that throws past Canvas and
// crashes the whole homepage. JourneyStage already renders the backdrop
// photo and hero copy as siblings of <Experience>, not inside it, so on
// failure they keep working; only the 3D layer itself is skipped.
class CanvasErrorBoundary extends Component {
  state = { failed:false };
  static getDerivedStateFromError(){ return { failed:true }; }
  componentDidCatch(error){
    console.error('3D experience failed to initialize, falling back to the static hero backdrop:', error);
  }
  render(){
    return this.state.failed ? null : this.props.children;
  }
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
      <CanvasErrorBoundary>
      <Canvas
        shadows={mobile ? false : 'soft'}
        // capped at 1.5 (not 2) on desktop: the postprocessing chain (Bloom,
        // DepthOfField, N8AO) runs its full-screen passes at this resolution,
        // so this is the single biggest lever on GPU/shader-compile time for
        // first paint — DoF/Bloom themselves are left untouched so the
        // cinematic look stays intact; only pixel density drops slightly on
        // very high-DPI (retina/4K) screens, invisible on standard displays.
        dpr={mobile ? 1 : [1, 1.5]}
        // antialias is off on desktop because the postprocessing EffectComposer
        // (Effects.jsx, desktop-only) already resolves its own framebuffer, so
        // renderer-level MSAA would just be redundant work. Note: the recurring
        // "glBlitFramebuffer: Read and write depth stencil attachments cannot be
        // the same image" error was NOT caused by this — it came from `three`
        // being pinned below the version the installed `postprocessing` engine
        // (bundled inside @react-three/postprocessing) requires for its
        // depth-texture render-target handling. See package.json's `three` range.
        gl={{ antialias:false, powerPreference:'high-performance', alpha:true, toneMapping:THREE.ACESFilmicToneMapping }}
        camera={{ fov:45, near:0.1, far:120, position:[0.3, 2.65, 15.2] }}
        // Temporary load-time diagnostic — remove once the slow-load report is
        // resolved. Fires once the WebGL context + renderer exist (before the
        // first frame is drawn), timed from navigation start.
        onCreated={(state)=>{
          console.log(`[perf] WebGL context ready: ${performance.now().toFixed(1)}ms since navigation start`);
          // A GPU driver reset/OOM can drop the WebGL context at any time —
          // three.js already recovers it automatically (recompiling shaders,
          // re-uploading textures), but that takes several seconds, and until
          // now the canvas just went blank/frozen for that whole window. This
          // hides the canvas the instant that happens, revealing the backdrop
          // photo already sitting underneath it (JourneyStage.jsx), and
          // un-hides it the moment the context comes back — so a rare GPU
          // hiccup reads as "the photo is showing" instead of "this is broken".
          // No effect on the normal path: canvas opacity is untouched unless
          // a context loss actually happens.
          const canvas = state.gl.domElement;
          canvas.addEventListener('webglcontextlost', ()=>{
            console.warn('[Experience] WebGL context lost — hiding canvas until the GPU recovers.');
            canvas.style.opacity = '0';
          });
          canvas.addEventListener('webglcontextrestored', ()=>{
            console.log('[Experience] WebGL context restored.');
            canvas.style.opacity = '';
          });
        }}
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
        <FirstFrameMarker />
      </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
