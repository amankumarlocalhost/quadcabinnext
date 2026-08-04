import { useMemo } from 'react';
import { Box, Skid, CorrWallX, CorrWallZ, RoofCap, CornerPosts } from './parts.jsx';
import { steelDark, aluminum, blackMetal, roofMetal, chassis } from '../materials.js';

/*
 * Storage Cabin — a closed, windowless steel shell built to guard tools and
 * inventory: a full-width horizontal roller shutter on the front, a hasp +
 * padlock, and reinforced corner posts. No glazing anywhere.
 */
const W = 6.0, D = 2.6, B = 0.3, T = 2.7;
const SHUTTER = { x0: -2.55, x1: 2.55, y0: 0.32, y1: 2.35 };

function RollerShutter(){
  const { x0, x1, y0, y1 } = SHUTTER;
  const w = x1-x0, h = y1-y0, slats = 16;
  const slatH = h/slats;
  return (
    <group position={[0,0,D/2+0.02]}>
      {/* frame */}
      <Box args={[w+0.16,0.1,0.12]} position={[0,y1+0.05,0]} material={steelDark} />
      <Box args={[0.1,h+0.1,0.12]} position={[x0-0.05,(y0+y1)/2,0]} material={steelDark} />
      <Box args={[0.1,h+0.1,0.12]} position={[x1+0.05,(y0+y1)/2,0]} material={steelDark} />
      {/* box housing above */}
      <Box args={[w+0.2,0.24,0.16]} position={[0,y1+0.22,0.01]} material={blackMetal} />
      {/* slats */}
      {Array.from({length:slats}).map((_,i)=>(
        <Box key={i} args={[w-0.06, slatH-0.015, 0.05]} position={[0, y0 + slatH*(i+0.5), 0.03]} material={i%2===0?steelDark:aluminum} />
      ))}
      {/* hasp + padlock */}
      <Box args={[0.16,0.05,0.05]} position={[0, y0+0.18, 0.08]} material={aluminum} />
      <mesh position={[0, y0+0.1, 0.1]} castShadow>
        <boxGeometry args={[0.08,0.09,0.03]} />
        <primitive object={blackMetal} attach="material" />
      </mesh>
    </group>
  );
}

export default function Storage(){
  const b = B, t = T;

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-1.8, 1.8]} />

      {/* front wall around the shutter opening */}
      <CorrWallX x0={-W/2} x1={SHUTTER.x0} y0={b} y1={t} z={D/2} />
      <CorrWallX x0={SHUTTER.x1} x1={W/2} y0={b} y1={t} z={D/2} />
      <CorrWallX x0={SHUTTER.x0} x1={SHUTTER.x1} y0={SHUTTER.y1} y1={t} z={D/2} />
      <RollerShutter />

      {/* fully closed back + side walls — no glazing anywhere */}
      <CorrWallX x0={-W/2} x1={W/2} y0={b} y1={t} z={-D/2} />
      <CorrWallZ z0={-D/2} z1={D/2} y0={b} y1={t} x={-W/2} />
      <CorrWallZ z0={-D/2} z1={D/2} y0={b} y1={t} x={W/2} />

      <CornerPosts halfW={W/2} halfD={D/2} yMid={(b+t)/2} height={t-b} />

      {/* reinforcement ribs flanking the shutter */}
      <Box args={[0.08, t-b, 0.14]} position={[SHUTTER.x0-0.1, (b+t)/2, D/2]} material={steelDark} />
      <Box args={[0.08, t-b, 0.14]} position={[SHUTTER.x1+0.1, (b+t)/2, D/2]} material={steelDark} />

      {/* warning stripe band + stencilled corner guards */}
      <Box args={[W+0.06, 0.16, 0.02]} position={[0, b+0.32, D/2+0.01]} material={aluminum} />
      {[-W/2,W/2].map(x=>(
        <Box key={x} args={[0.1,0.4,0.1]} position={[x, b+0.2, D/2]} material={chassis} />
      ))}

      <RoofCap width={W} depth={D} y={t+0.07} material={roofMetal} />

      {/* roof vent — passive airflow, no window ventilation available */}
      <group position={[0, t+0.2, -0.6]}>
        <mesh material={steelDark}><cylinderGeometry args={[0.18,0.21,0.04,14]} /></mesh>
        <mesh position={[0,0.13,0]} castShadow material={aluminum}><cylinderGeometry args={[0.1,0.1,0.24,12]} /></mesh>
        <mesh position={[0,0.28,0]} castShadow material={steelDark}><cylinderGeometry args={[0.15,0.08,0.07,12]} /></mesh>
      </group>
    </group>
  );
}
