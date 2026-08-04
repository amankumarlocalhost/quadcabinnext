import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Box, Skid, RoofCap, Downpipe } from './parts.jsx';
import { corrugatedMaterial, signTexture, brandingTexture, makeScreen } from '../textures.js';
import {
  aluminum, steelDark, roofMetal, redPaint, glassMat,
  woodFloor, drywallDark, ceilingMat, walnut, whiteLaminate,
  fabricGrey, leafGreen, potMat, ledWarm,
} from '../materials.js';

/*
 * ReceptionCabin — a welcoming front-of-house module for the contact page.
 * A full-height glass entrance bay opens straight onto a reception counter
 * with a working desk screen, a small waiting nook, and a potted plant —
 * built with the same economical corrugated-cladding + glass-curtain-wall
 * approach as Conference Cabin, re-themed around a front desk instead of a
 * meeting table.
 */
const W = 6.6, D = 3.0, B = 0.34, T = 3.3;
const DESK_X = 0.4;
const DOOR_X = -1.62;

function receptionSignTexture(){
  const w = 1024, h = 256;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#101012'; ctx.fillRect(0,0,w,h);
  ctx.fillStyle = '#e11b23'; ctx.fillRect(0,h-10,w,10);
  ctx.fillStyle = '#f3f2ee';
  ctx.font = "700 104px 'Anton', Impact, 'Arial Black', sans-serif";
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillText('RECEPTION', w/2, h/2-8);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* small animated desk monitor — reuses the shared reception-screen texture helper */
function DeskScreen(){
  const screen = useMemo(() => makeScreen(), []);
  const frame = useRef(0);
  useFrame(() => {
    frame.current++;
    if(frame.current % 12 === 0) screen.draw();
  });
  return (
    <mesh position={[0, 0, 0.02]} rotation={[-0.15,0,0]}>
      <planeGeometry args={[0.32, 0.2]} />
      <meshBasicMaterial map={screen.tex} toneMapped={false} />
    </mesh>
  );
}

function ReceptionInterior(){
  const brandTex = useMemo(() => brandingTexture(), []);
  const deskZ = -0.55;

  return (
    <group>
      <Box args={[W-0.6, 0.06, D-0.4]} position={[0, B+0.05, 0]} material={woodFloor} castShadow={false} />
      <Box args={[W-0.6, 0.06, D-0.4]} position={[0, T-0.12, 0]} material={ceilingMat} castShadow={false} />
      <Box args={[W-0.6, T-B, 0.08]} position={[0, (B+T)/2, -D/2+0.18]} material={drywallDark} castShadow={false} />

      {/* brand panel behind the desk */}
      <mesh position={[-1.4, 1.9, -D/2+0.23]}>
        <planeGeometry args={[1.7, 0.85]} />
        <meshBasicMaterial map={brandTex} toneMapped={false} />
      </mesh>

      {/* reception counter: white laminate front, walnut top, red kick strip,
          with a raised L-return that reads as a welcoming front desk */}
      <group position={[DESK_X, 0, deskZ]}>
        <Box args={[2.6, 1.02, 0.6]} position={[0, B+0.51, 0]} material={whiteLaminate} />
        <Box args={[2.6, 0.06, 0.68]} position={[0, B+1.05, 0]} material={walnut} />
        <Box args={[2.6, 0.05, 0.62]} position={[0, B+0.03, 0]} material={redPaint} castShadow={false} />
        <Box args={[0.6, 1.02, 1.1]} position={[-1.6, B+0.51, 0.35]} material={whiteLaminate} />
        <Box args={[0.6, 0.06, 1.16]} position={[-1.6, B+1.05, 0.35]} material={walnut} />
        <group position={[0, B+1.12, 0.02]}><DeskScreen /></group>
      </group>

      {/* desk chair behind the counter */}
      <group position={[DESK_X, 0, deskZ-0.55]}>
        <Box args={[0.42, 0.07, 0.42]} position={[0, B+0.5, 0]} material={fabricGrey} castShadow={false} />
        <Box args={[0.42, 0.55, 0.07]} position={[0, B+0.78, -0.2]} material={fabricGrey} castShadow={false} />
        <mesh position={[0, B+0.24, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.48, 10]} />
          <primitive object={steelDark} attach="material" />
        </mesh>
      </group>

      {/* waiting nook: two low chairs facing the desk */}
      {[[1.9,0.65],[2.5,0.95]].map(([x,z],i)=>(
        <group key={i} position={[x, 0, z]}>
          <Box args={[0.4, 0.06, 0.4]} position={[0, B+0.24, 0]} material={fabricGrey} castShadow={false} />
          <Box args={[0.4, 0.42, 0.06]} position={[0, B+0.45, -0.18]} material={fabricGrey} castShadow={false} />
        </group>
      ))}

      {/* potted plant softens the welcome */}
      <group position={[2.7, 0, -0.55]}>
        <mesh position={[0, B+0.18, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.13, 0.36, 12]} />
          <primitive object={potMat} attach="material" />
        </mesh>
        {[0,1,2,3,4].map(i=>(
          <mesh key={i} position={[Math.sin(i*1.3)*0.1, B+0.45+i*0.05, Math.cos(i*1.3)*0.1]} rotation={[0,i,Math.sin(i)*0.4]}>
            <coneGeometry args={[0.12, 0.4, 6]} />
            <primitive object={leafGreen} attach="material" />
          </mesh>
        ))}
      </group>

      {/* warm pendant + fill so the desk glows through the glass */}
      <Box args={[0.26, 0.05, 0.26]} position={[DESK_X, T-0.3, deskZ]} material={ledWarm} castShadow={false} />
      <pointLight position={[DESK_X, T-0.55, deskZ]} intensity={13} distance={7} decay={2} color={0xffdcae} />
    </group>
  );
}

export default function ReceptionCabin(){
  const signTex = useMemo(() => signTexture(), []);
  const receptionTex = useMemo(() => receptionSignTexture(), []);
  const backMat = useMemo(() => corrugatedMaterial(W), []);
  const sideMat = useMemo(() => corrugatedMaterial(D), []);
  const b = B, t = T;

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-2.2, 2.2]} />
      {/* thin red chassis accent line */}
      <Box args={[W+0.2, 0.03, D+0.12]} position={[0, 0.27, 0]} material={redPaint} castShadow={false} />

      <ReceptionInterior />

      {/* full-height glass curtain wall — front elevation, open and welcoming */}
      <group>
        <Box args={[W-0.2, 0.12, 0.14]} position={[0, t-0.06, D/2]} material={aluminum} />
        <Box args={[W-0.2, 0.12, 0.14]} position={[0, b+0.06, D/2]} material={aluminum} />
        {[-2.7,-1.62,-0.54,0.54,1.62,2.7].map(x=>(
          <Box key={x} args={[0.08, t-b, 0.12]} position={[x, (b+t)/2, D/2]} material={aluminum} />
        ))}
        <mesh position={[0, (b+t)/2, D/2-0.02]}>
          <planeGeometry args={[W-0.3, t-b-0.16]} />
          <primitive object={glassMat} attach="material" />
        </mesh>
        {/* frameless glass door, positioned so it lines up with the desk approach */}
        <Box args={[0.03, t-b-0.2, 0.02]} position={[DOOR_X, (b+t)/2, D/2+0.03]} material={aluminum} />
        <Box args={[0.14, 0.28, 0.03]} position={[DOOR_X+0.35, b+1.05, D/2+0.04]} material={aluminum} />
      </group>

      {/* charcoal-toned side panels + corrugated back */}
      <Box args={[0.12, t-b, D]} position={[-W/2, (b+t)/2, 0]} material={sideMat} />
      <Box args={[0.12, t-b, D]} position={[W/2, (b+t)/2, 0]} material={sideMat} />
      <Box args={[0.04, t-b+0.04, D+0.04]} position={[-W/2-0.06, (b+t)/2, 0]} material={aluminum} />
      <Box args={[0.04, t-b+0.04, D+0.04]} position={[W/2+0.06, (b+t)/2, 0]} material={aluminum} />
      <Box args={[W, t-b, 0.12]} position={[0, (b+t)/2, -D/2]} material={backMat} />

      <RoofCap width={W} depth={D} y={t+0.07} material={roofMetal} />
      {/* recessed downlights along the front eave */}
      {[-2.4,-1.2,0,1.2,2.4].map(x=>(
        <Box key={x} args={[0.14,0.03,0.14]} position={[x, t-0.02, D/2+0.16]} material={ledWarm} castShadow={false} />
      ))}

      <Downpipe x={-W/2-0.06} z={-D/2+0.1} />
      <Downpipe x={W/2+0.06} z={-D/2+0.1} />

      {/* signage: RECEPTION plaque + standard brand sign, above the door */}
      <mesh position={[DOOR_X, t+0.5, D/2+0.03]}>
        <planeGeometry args={[1.7, 0.42]} />
        <meshBasicMaterial map={receptionTex} toneMapped={false} />
      </mesh>
      <mesh position={[1.5, t+0.5, D/2+0.03]}>
        <planeGeometry args={[1.4, 0.42]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>

      {/* entry: step platform + slim railing at the door */}
      <group position={[DOOR_X, 0, D/2+0.62]}>
        <Box args={[2.0, 0.13, 1.0]} position={[0, 0.2, 0]} material={steelDark} />
        <Box args={[2.0, 0.13, 1.0]} position={[0, 0.07, 0.5]} material={steelDark} />
        {[-0.9, 0.9].map(x=>(
          <group key={x}>
            {[-0.4, 0.4].map(z=>(
              <mesh key={z} position={[x, 0.62, z]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.75, 10]} />
                <primitive object={aluminum} attach="material" />
              </mesh>
            ))}
            <mesh position={[x, 1.0, 0]} rotation={[Math.PI/2,0,0]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.9, 10]} />
              <primitive object={aluminum} attach="material" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
