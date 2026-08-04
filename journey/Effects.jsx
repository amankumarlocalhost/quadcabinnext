import { useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField, Vignette, N8AO, HueSaturation, BrightnessContrast, Noise } from '@react-three/postprocessing';
import { journey, mapRange } from './scrollState.js';

export default function Effects(){
  const bloom = useRef();
  const dof = useRef();
  // Callback refs, not object refs: @react-three/postprocessing's effect wrappers
  // aren't forwardRef-based, so under React 19 a `ref` prop lands in their internal
  // rest-spread and gets JSON.stringify'd for memoization. An object ref eventually
  // holds a live Three.js instance (circular parent/children) and blows up on
  // re-render; a function ref serializes to nothing, so it's silently skipped.
  const setBloom = useCallback((el) => { bloom.current = el; }, []);
  const setDof = useCallback((el) => { dof.current = el; }, []);

  useFrame(()=>{
    const p = journey.p;
    if(bloom.current){
      // stronger bloom inside where the LED strips live
      bloom.current.intensity = 0.5 + mapRange(p, 0.5, 0.7)*0.35;
    }
    if(dof.current){
      // focus walks from the cabin (far) to arm's length inside
      const focus = 11.2 - mapRange(p, 0, 0.46)*7.9 - mapRange(p, 0.56, 0.9)*1.6;
      dof.current.cocMaterial.uniforms.focusDistance.value = focus / 120; // normalized by camera far
      // hero stays pin-sharp (wide focus range, tiny bokeh); cinematic blur fades in on the approach
      const heroSharp = 1 - mapRange(p, 0.05, 0.3);
      dof.current.cocMaterial.uniforms.focusRange.value = (2.6 + heroSharp*5 + mapRange(p,0.5,0.7)*1.8) / 120;
      dof.current.bokehScale = 0.3 + (1-heroSharp)*1.5;
    }
  });

  return (
    <EffectComposer multisampling={0}>
      {/* contact AO — grounds the cabin/furniture against the surfaces they touch */}
      <N8AO aoRadius={0.55} distanceFalloff={1} intensity={2.6} color="#100c08" halfRes />
      <Bloom ref={setBloom} mipmapBlur intensity={0.55} luminanceThreshold={1.0} luminanceSmoothing={0.3} />
      <DepthOfField ref={setDof} focusDistance={9.5/120} focalLength={0.02} bokehScale={1.8} />
      {/* color grade matched to the site-bg photo's CSS filter (saturate .72 / brightness .78 / contrast 1.04) */}
      <HueSaturation saturation={-0.28} />
      <BrightnessContrast brightness={-0.1} contrast={0.05} />
      <Noise opacity={0.035} />
      <Vignette eskil={false} offset={0.22} darkness={0.72} />
    </EffectComposer>
  );
}
