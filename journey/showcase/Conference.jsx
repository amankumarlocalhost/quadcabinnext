import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Skid, RoofCap, Downpipe } from './parts.jsx';
import { corrugatedMaterial, signTexture } from '../textures.js';
import {
  steelDark, aluminum, roofMetal, glassMat, glassTint, chassis,
  ledWarm, whiteLaminate,
} from '../materials.js';

/*
 * Conference Cabin — a premium glass-fronted meeting space: the whole front
 * elevation is a full-height curtain wall so it reads nothing like a site
 * shed, with dark charcoal panel cladding on the back/sides for contrast.
 */
const W = 6.4, D = 3.0, B = 0.35, T = 3.5;

// lighter than the stock blackMetal — this panel fills most of the frame
// when it swings broadside to camera mid-spin, so it needs enough albedo and
// specular response to read as a material rather than a flat void.
const charcoalPanel = new THREE.MeshStandardMaterial({
  color: 0x33363b, roughness: 0.38, metalness: 0.5, envMapIntensity: 1.1,
});

export default function Conference(){
  const signTex = useMemo(() => signTexture(), []);
  const b = B, t = T;
  const backMat = useMemo(() => corrugatedMaterial(W), []);
  const darkPanel = charcoalPanel;

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-2.2, 2.2]} />

      {/* full-height glass curtain wall — front elevation */}
      <group>
        <Box args={[W-0.2, 0.12, 0.14]} position={[0, t-0.06, D/2]} material={aluminum} />
        <Box args={[W-0.2, 0.12, 0.14]} position={[0, b+0.06, D/2]} material={aluminum} />
        {[-2.85, -1.71, -0.57, 0.57, 1.71, 2.85].map(x=>(
          <Box key={x} args={[0.08, t-b, 0.12]} position={[x, (b+t)/2, D/2]} material={aluminum} />
        ))}
        <mesh position={[0, (b+t)/2, D/2-0.02]}>
          <planeGeometry args={[W-0.3, t-b-0.16]} />
          <primitive object={glassMat} attach="material" />
        </mesh>
        {/* frameless glass door, centre bay */}
        <Box args={[0.03, t-b-0.2, 0.02]} position={[0, (b+t)/2, D/2+0.03]} material={aluminum} />
        <Box args={[0.14, 0.28, 0.03]} position={[0.35, b+1.05, D/2+0.04]} material={aluminum} />
      </group>

      {/* dark charcoal side panels with a slim aluminium reveal at the corner */}
      <Box args={[0.12, t-b, D]} position={[-W/2, (b+t)/2, 0]} material={darkPanel} />
      <Box args={[0.12, t-b, D]} position={[W/2, (b+t)/2, 0]} material={darkPanel} />
      <Box args={[0.04, t-b+0.04, D+0.04]} position={[-W/2-0.06, (b+t)/2, 0]} material={aluminum} />
      <Box args={[0.04, t-b+0.04, D+0.04]} position={[W/2+0.06, (b+t)/2, 0]} material={aluminum} />

      {/* back wall — corrugated cladding, restrained/premium colourway */}
      <Box args={[W, t-b, 0.12]} position={[0, (b+t)/2, -D/2]} material={backMat} />

      {/* clerestory glass strip above the back wall for daylight depth */}
      <mesh position={[0, t-0.18, -D/2-0.01]}>
        <planeGeometry args={[W-0.6, 0.28]} />
        <primitive object={glassTint} attach="material" />
      </mesh>

      <RoofCap width={W} depth={D} y={t+0.07} material={roofMetal} />

      {/* recessed soffit downlights along the front eave */}
      {[-2.2,-0.7,0.7,2.2].map(x=>(
        <Box key={x} args={[0.16,0.03,0.16]} position={[x, t-0.02, D/2+0.14]} material={ledWarm} castShadow={false} />
      ))}

      {/* premium entrance signage */}
      <mesh position={[0, t+0.36, D/2+0.02]}>
        <planeGeometry args={[2.0, 0.5]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>

      <Downpipe x={-W/2-0.06} z={-D/2} />
      <Downpipe x={W/2+0.06} z={-D/2} />

      {/* decking step spanning the full glass front */}
      <Box args={[W-0.4, 0.14, 0.9]} position={[0, 0.07, D/2+0.55]} material={whiteLaminate} />
      <Box args={[0.06, 0.5, 0.9]} position={[-(W-0.4)/2, 0.32, D/2+0.55]} material={chassis} />
      <Box args={[0.06, 0.5, 0.9]} position={[(W-0.4)/2, 0.32, D/2+0.55]} material={chassis} />
    </group>
  );
}
