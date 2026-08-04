import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Skid, CorrWallX, CorrWallZ, RoofCap, Downpipe } from './parts.jsx';
import { corrugatedMaterial } from '../textures.js';
import {
  steelDark, aluminum, redPaint, roofMetal, glassTint, blackMetal,
  whiteLaminate, ledWarm,
} from '../materials.js';

/*
 * Labour Accommodation — a long multi-bay module: four private bunk bays
 * behind a shared corrugated front wall, a linking corridor stub on the
 * right end (where a second module would dock on-site), and a ridge of
 * roof vents for ventilated long stays.
 */
const W = 9.0, D = 2.6, B = 0.35, T = 3.0;
const DOOR = { x0: -3.95, x1: -3.05, y0: B, y1: 2.5 };
const WIN_W = 0.85, WIN_H = 0.9, WIN_Y0 = 1.35;
const WINDOWS = [-1.9, -0.35, 1.2, 2.75].map(cx => ({ x0: cx - WIN_W/2, x1: cx + WIN_W/2, y0: WIN_Y0, y1: WIN_Y0 + WIN_H }));

function BunkWindow({ x0, x1, y0, y1 }){
  const w = x1-x0, h = y1-y0, cx = (x0+x1)/2, cy = (y0+y1)/2;
  const z = D/2;
  return (
    <group>
      <Box args={[w+0.1, 0.06, 0.14]} position={[cx, y1+0.02, z]} material={steelDark} />
      <Box args={[w+0.1, 0.06, 0.14]} position={[cx, y0-0.02, z]} material={steelDark} />
      <Box args={[0.06, h+0.08, 0.14]} position={[x0-0.02, cy, z]} material={steelDark} />
      <Box args={[0.06, h+0.08, 0.14]} position={[x1+0.02, cy, z]} material={steelDark} />
      <mesh position={[cx, cy, z-0.02]}>
        <planeGeometry args={[w-0.04, h-0.04]} />
        <primitive object={glassTint} attach="material" />
      </mesh>
      {/* fixed louvre vent above each window for airflow */}
      <Box args={[w-0.1, 0.09, 0.1]} position={[cx, y1+0.16, z]} material={aluminum} />
    </group>
  );
}

export default function Labour(){
  const b = B, t = T;
  const sideMat = useMemo(() => corrugatedMaterial(D), []);

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-3.2, 0, 3.2]} />

      {/* front wall: door + four bunk-bay windows */}
      <CorrWallX x0={-W/2} x1={DOOR.x0} y0={b} y1={t} z={D/2} />
      <CorrWallX x0={DOOR.x0} x1={DOOR.x1} y0={DOOR.y1} y1={t} z={D/2} />
      {WINDOWS.map((w,i)=>(
        <group key={i}>
          <CorrWallX x0={i===0?DOOR.x1:WINDOWS[i-1].x1} x1={w.x0} y0={b} y1={t} z={D/2} />
          <CorrWallX x0={w.x0} x1={w.x1} y0={b} y1={w.y0} z={D/2} />
          <CorrWallX x0={w.x0} x1={w.x1} y0={w.y1} y1={t} z={D/2} />
        </group>
      ))}
      <CorrWallX x0={WINDOWS[WINDOWS.length-1].x1} x1={W/2} y0={b} y1={t} z={D/2} />
      {WINDOWS.map((w,i)=><BunkWindow key={i} {...w} />)}

      {/* door frame + leaf (static, always shut) */}
      <Box args={[0.08, DOOR.y1-DOOR.y0+0.08, 0.16]} position={[DOOR.x0-0.02, (DOOR.y0+DOOR.y1)/2, D/2]} material={steelDark} />
      <Box args={[0.08, DOOR.y1-DOOR.y0+0.08, 0.16]} position={[DOOR.x1+0.02, (DOOR.y0+DOOR.y1)/2, D/2]} material={steelDark} />
      <Box args={[0.96, DOOR.y1-DOOR.y0-0.04, 0.06]} position={[(DOOR.x0+DOOR.x1)/2, (DOOR.y0+DOOR.y1)/2, D/2+0.05]} material={redPaint} />
      <Box args={[0.05, 0.2, 0.07]} position={[(DOOR.x0+DOOR.x1)/2+0.3, 1.05, D/2+0.1]} material={aluminum} />
      <group position={[(DOOR.x0+DOOR.x1)/2, 2.72, D/2+0.08]}>
        <Box args={[0.3, 0.05, 0.1]} material={blackMetal} />
        <Box args={[0.24, 0.02, 0.06]} position={[0,-0.03,0]} material={ledWarm} />
      </group>

      {/* back wall — plain corrugated */}
      <CorrWallX x0={-W/2} x1={W/2} y0={b} y1={t} z={-D/2} />

      {/* side walls */}
      <Box args={[0.12, t-b, D]} position={[-W/2, (b+t)/2, 0]} material={sideMat} castShadow receiveShadow />
      <Box args={[0.12, t-b, D]} position={[W/2, (b+t)/2, 0]} material={sideMat} castShadow receiveShadow />

      {/* linking corridor stub on the right end — where the next module docks */}
      <group position={[W/2+0.55, 0, 0]}>
        <Box args={[1.1, t-b-0.3, D-0.5]} position={[0, b+(t-b-0.3)/2, 0]} material={whiteLaminate} />
        <Box args={[0.08, t-b-0.3, D-0.5]} position={[0.55, b+(t-b-0.3)/2, 0]} material={steelDark} />
      </group>

      <RoofCap width={W} depth={D} y={t+0.07} material={roofMetal} />

      {/* ridge of ventilation stacks along the roof */}
      {[-2.7,-0.9,0.9,2.7].map(x=>(
        <group key={x} position={[x, t+0.2, 0.7]}>
          <mesh material={steelDark}><cylinderGeometry args={[0.16,0.19,0.05,14]} /></mesh>
          <mesh position={[0,0.13,0]} castShadow material={aluminum}><cylinderGeometry args={[0.09,0.09,0.22,12]} /></mesh>
          <mesh position={[0,0.26,0]} castShadow material={steelDark}><cylinderGeometry args={[0.14,0.07,0.06,12]} /></mesh>
        </group>
      ))}

      <Downpipe x={-W/2-0.06} z={D/2} />
      <Downpipe x={W/2+0.06} z={-D/2} />

      {/* entry step */}
      <Box args={[1.1,0.15,0.7]} position={[(DOOR.x0+DOOR.x1)/2, 0.075, D/2+0.4]} material={aluminum} />
    </group>
  );
}
