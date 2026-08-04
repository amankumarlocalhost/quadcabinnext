import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { journey, sampleKeys, mapRange } from './scrollState.js';

/*
 * The drone path. t values allocate scroll budget: the approach is slow,
 * the door moment gets a long dwell, the interior tour glides between areas.
 */
const KEYS = [
  { t:0.00, pos:[-2.0, 2.3, 13.4], look:[-4.1, 1.8,  0.0] }, // cabin framed right of the headline, fully in view
  { t:0.16, pos:[-1.6, 1.95, 7.1], look:[-2.0, 1.55, 2.0] },
  { t:0.30, pos:[-2.2, 1.78, 3.95],look:[-2.2, 1.45, 2.3] },   // door fills frame
  { t:0.42, pos:[-2.18,1.88, 2.3], look:[-1.3, 1.45, 0.4] },   // threshold
  { t:0.58, pos:[-1.75,1.85, 1.05],look:[ 0.2, 1.3,  0.7] },   // reception
  { t:0.85, pos:[ 0.6, 1.9, -1.1], look:[ 0.6, 1.75,-9.0] },   // rear glass wall, aimed toward exit
  { t:1.00, pos:[ 0.6, 2.05,-6.8], look:[ 0.6, 1.95,-15.0] },  // flown through — hands off to Product section
];

// Phone-portrait variant: only the opening shot differs — pulled back and
// aimed at the cabin's middle so the whole cabin fits the narrow frame
// (the desktop key crops its sides). From the second key on, the flight
// path is identical.
const KEYS_MOBILE = [
  { t:0.00, pos:[-0.3, 2.3, 16.9], look:[-0.3, 1.35, 0.0] },
  ...KEYS.slice(1),
];

export default function CameraRig(){
  const { camera, gl } = useThree();
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const smoothedLook = useRef(new THREE.Vector3(0,1.9,0));
  const prevP = useRef(0);

  useFrame((state, dt)=>{
    const d = Math.min(dt, 1/20);
    // damp raw scroll into cinematic progress
    journey.p = THREE.MathUtils.damp(journey.p, journey.target, 2.4, d);
    journey.vel = Math.abs(journey.p - prevP.current)/Math.max(d, 1e-4);
    prevP.current = journey.p;

    sampleKeys(state.viewport.aspect < 0.85 ? KEYS_MOBILE : KEYS, journey.p, pos.current, look.current);

    // intro: camera drifts in from further back while the page loads
    const intro = 1 - journey.loaded;
    pos.current.z += intro*2.6;
    pos.current.y += intro*0.35;

    camera.position.lerp(pos.current, 1 - Math.exp(-8*d));
    smoothedLook.current.lerp(look.current, 1 - Math.exp(-6*d));
    camera.lookAt(smoothedLook.current);

    // responsive fov
    const targetFov = state.viewport.aspect < 0.85 ? 62 : 45;
    if(Math.abs(camera.fov - targetFov) > 0.1){
      camera.fov += (targetFov - camera.fov)*0.1;
      camera.updateProjectionMatrix();
    }

    // exposure: auto-adjust when entering the darker cabin, dip on glass exit
    const enterBoost = mapRange(journey.p, 0.42, 0.58) * 0.22;
    const exitDip = mapRange(journey.p, 0.9, 1) * 0.55;
    gl.toneMappingExposure = (1.02 + enterBoost - exitDip) * (0.25 + 0.75*journey.loaded);
  });

  return null;
}
