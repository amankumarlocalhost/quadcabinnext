import { useMemo } from 'react';
import { Box, Skid, CorrWallX, CorrWallZ, RoofCap, Downpipe } from './parts.jsx';
import { corrugatedMaterial, signTexture } from '../textures.js';
import {
  steelDark, aluminum, blackMetal, roofMetal, chassis, redPaint, glassTint, glassMat,
  whiteLaminate, ledWarm,
} from '../materials.js';

/*
 * Compact Office — a plain, single-module ground-mounted site office: red
 * entrance door, a red skirt band along the base, two front windows (one
 * with half-lowered blinds), and the branded sign mounted flush on the
 * wall above the door. Simpler and smaller than the Site Office model used
 * elsewhere, with a different door position and window layout.
 */
const W = 5.2, D = 2.6, B = 0.35, T = 3.0;
const DOOR = { x0: -1.95, x1: -1.05, y0: B, y1: B + 2.05 };
const WIN1 = { x0: -0.55, x1: 0.85, y0: B + 0.9, y1: B + 2.15 };
const WIN2 = { x0: 1.2, x1: 2.5, y0: B + 0.9, y1: B + 2.15 };

function WindowUnit({ x0, x1, y0, y1 }){
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, z = D / 2;
  return (
    <group>
      <Box args={[w + 0.1, 0.06, 0.16]} position={[cx, y1 + 0.02, z]} material={steelDark} />
      <Box args={[w + 0.1, 0.06, 0.16]} position={[cx, y0 - 0.02, z]} material={steelDark} />
      <Box args={[0.06, h + 0.08, 0.16]} position={[x0 - 0.02, cy, z]} material={steelDark} />
      <Box args={[0.06, h + 0.08, 0.16]} position={[x1 + 0.02, cy, z]} material={steelDark} />
      <mesh position={[cx, cy, z - 0.02]}>
        <planeGeometry args={[w - 0.04, h - 0.04]} />
        <primitive object={glassTint} attach="material" />
      </mesh>
      <Box args={[w + 0.18, 0.05, 0.2]} position={[cx, y0 - 0.06, z + 0.06]} material={aluminum} />
    </group>
  );
}

/* half-lowered venetian blinds sitting just behind the glass */
function Blinds({ x0, x1, y1 }){
  const cx = (x0 + x1) / 2, w = x1 - x0 - 0.1;
  return (
    <group position={[cx, 0, D / 2 - 0.08]}>
      <Box args={[w, 0.06, 0.06]} position={[0, y1 - 0.08, 0]} material={whiteLaminate} castShadow={false} />
      {Array.from({ length: 7 }).map((_, i) => (
        <Box key={i} args={[w - 0.02, 0.016, 0.045]} position={[0, y1 - 0.18 - i * 0.075, 0]} rotation={[0.3, 0, 0]} material={whiteLaminate} castShadow={false} />
      ))}
    </group>
  );
}

function Door(){
  const y0 = DOOR.y0, y1 = DOOR.y1, h = y1 - y0, cx = (DOOR.x0 + DOOR.x1) / 2, w = DOOR.x1 - DOOR.x0;
  const z = D / 2;
  return (
    <group>
      <Box args={[0.09, h + 0.08, 0.18]} position={[DOOR.x0 - 0.02, (y0 + y1) / 2, z]} material={steelDark} />
      <Box args={[0.09, h + 0.08, 0.18]} position={[DOOR.x1 + 0.02, (y0 + y1) / 2, z]} material={steelDark} />
      <Box args={[w + 0.16, 0.09, 0.18]} position={[cx, y1 + 0.03, z]} material={steelDark} />

      {/* red leaf with vertical panel grooves + a small vision panel — each
          layer stepped forward by a generous gap (>=0.02) so nothing sits
          near-coplanar with the layer behind it */}
      <Box args={[w - 0.04, h - 0.04, 0.06]} position={[cx, (y0 + y1) / 2, z + 0.03]} material={redPaint} />
      {[-0.32, 0.32].map((dx) => (
        <Box key={dx} args={[0.02, h - 0.14, 0.012]} position={[cx + dx, (y0 + y1) / 2, z + 0.086]} material={blackMetal} castShadow={false} />
      ))}
      <mesh position={[cx, y1 - 0.55, z + 0.1]}>
        <planeGeometry args={[0.3, 0.24]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <Box args={[0.05, 0.18, 0.03]} position={[cx + w / 2 - 0.14, (y0 + y1) / 2 - 0.1, z + 0.12]} material={aluminum} />

      {/* threshold step */}
      <Box args={[w + 0.5, 0.16, 0.55]} position={[cx, 0.08, z + 0.32]} material={aluminum} />
      <Box args={[w + 0.7, 0.16, 0.4]} position={[cx, -0.04, z + 0.62]} material={whiteLaminate} />
    </group>
  );
}

export default function CompactOffice(){
  const signTex = useMemo(() => signTexture(), []);
  const sideMat = useMemo(() => corrugatedMaterial(D), []);
  const b = B, t = T;

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-1.7, 1.7]} />

      {/* front wall: door + two windows */}
      <CorrWallX x0={-W / 2} x1={DOOR.x0} y0={b} y1={t} z={D / 2} />
      <CorrWallX x0={DOOR.x0} x1={DOOR.x1} y0={DOOR.y1} y1={t} z={D / 2} />
      <CorrWallX x0={DOOR.x1} x1={WIN1.x0} y0={b} y1={t} z={D / 2} />
      <CorrWallX x0={WIN1.x0} x1={WIN1.x1} y0={b} y1={WIN1.y0} z={D / 2} />
      <CorrWallX x0={WIN1.x0} x1={WIN1.x1} y0={WIN1.y1} y1={t} z={D / 2} />
      <CorrWallX x0={WIN1.x1} x1={WIN2.x0} y0={b} y1={t} z={D / 2} />
      <CorrWallX x0={WIN2.x0} x1={WIN2.x1} y0={b} y1={WIN2.y0} z={D / 2} />
      <CorrWallX x0={WIN2.x0} x1={WIN2.x1} y0={WIN2.y1} y1={t} z={D / 2} />
      <CorrWallX x0={WIN2.x1} x1={W / 2} y0={b} y1={t} z={D / 2} />

      <WindowUnit {...WIN1} />
      <WindowUnit {...WIN2} />
      <Blinds x0={WIN1.x0} x1={WIN1.x1} y1={WIN1.y1} />
      <Door />

      {/* back + side walls, plain cladding */}
      <CorrWallX x0={-W / 2} x1={W / 2} y0={b} y1={t} z={-D / 2} />
      <Box args={[0.12, t - b, D]} position={[-W / 2, (b + t) / 2, 0]} material={sideMat} castShadow receiveShadow />
      <Box args={[0.12, t - b, D]} position={[W / 2, (b + t) / 2, 0]} material={sideMat} castShadow receiveShadow />

      {/* corner trim caps — proud of both wall faces (not flush) so they
          fully swallow the seam between the front/back and side cladding,
          including the corrugated texture's cut-off rib at the panel edge.
          A flush post the same width as the walls behind it leaves a
          hairline, angle-dependent shimmer right at the seam; oversizing
          it removes that edge case entirely rather than just narrowing it. */}
      {[-W / 2, W / 2].map((x) => [-D / 2, D / 2].map((z) => (
        <Box key={`${x}:${z}`} args={[0.2, t - b + 0.1, 0.2]} position={[x, (b + t) / 2, z]} material={steelDark} />
      )))}

      {/* red skirt band along the base, full perimeter — offset well clear
          of the cladding behind it (a near-zero gap here z-fights into a
          jagged moire against the corrugated wall at camera distance) */}
      <Box args={[W + 0.06, 0.22, 0.1]} position={[0, b + 0.11, D / 2 + 0.07]} material={redPaint} />
      <Box args={[W + 0.06, 0.22, 0.1]} position={[0, b + 0.11, -D / 2 - 0.07]} material={redPaint} />
      <Box args={[0.1, 0.22, D + 0.06]} position={[-W / 2 - 0.07, b + 0.11, 0]} material={redPaint} />
      <Box args={[0.1, 0.22, D + 0.06]} position={[W / 2 + 0.07, b + 0.11, 0]} material={redPaint} />

      <RoofCap width={W} depth={D} y={t + 0.07} material={roofMetal} />

      {/* branded sign, mounted proud of the wall above the door/window run
          — offset well clear of the cladding behind it to avoid z-fighting
          at camera distance */}
      <Box args={[1.98, 0.62, 0.03]} position={[-0.55, t - 0.32, D / 2 + 0.09]} material={blackMetal} castShadow={false} />
      <mesh position={[-0.55, t - 0.32, D / 2 + 0.115]}>
        <planeGeometry args={[1.9, 0.54]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>

      {/* wall lamp over the door */}
      <group position={[(DOOR.x0 + DOOR.x1) / 2, DOOR.y1 + 0.32, D / 2 + 0.06]}>
        <Box args={[0.3, 0.06, 0.12]} material={blackMetal} />
        <Box args={[0.24, 0.02, 0.08]} position={[0, -0.035, 0]} material={ledWarm} />
      </group>

      {/* wall-mounted AC condenser on the blind side elevation — fins are
          spaced wider than their own depth so adjacent fins never overlap */}
      <group position={[W / 2 + 0.16, b + 1.15, 0.4]}>
        <Box args={[0.3, 0.5, 0.6]} material={aluminum} />
        <Box args={[0.32, 0.06, 0.62]} position={[0, 0.22, 0]} material={steelDark} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} args={[0.02, 0.36, 0.09]} position={[-0.16, 0, -0.18 + i * 0.12]} material={blackMetal} castShadow={false} />
        ))}
      </group>

      <Downpipe x={-W / 2 - 0.06} z={-D / 2} />
      <Downpipe x={W / 2 + 0.06} z={-D / 2} />

      {/* roof vent */}
      <group position={[1.6, t + 0.2, -0.5]}>
        <mesh material={steelDark}><cylinderGeometry args={[0.16, 0.19, 0.05, 14]} /></mesh>
        <mesh position={[0, 0.12, 0]} castShadow material={aluminum}><cylinderGeometry args={[0.09, 0.09, 0.22, 12]} /></mesh>
        <mesh position={[0, 0.25, 0]} castShadow material={steelDark}><cylinderGeometry args={[0.13, 0.07, 0.06, 12]} /></mesh>
      </group>
    </group>
  );
}
