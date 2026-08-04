import { useMemo } from 'react';
import { corrugatedMaterial } from '../textures.js';
import { chassis, steelDark, aluminum } from '../materials.js';

/* shared low-level builders reused across all four showcase cabin models —
   same pattern as CabinExterior.jsx, factored out so each cabin file only
   describes its own layout. */

export function Box({ args, position, rotation, material, castShadow = true, receiveShadow = true }){
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={args} />
    </mesh>
  );
}

/* skid base + forklift pockets, sized to the cabin footprint */
export function Skid({ width, depth, y = 0.13, pocketAt = [] }){
  return (
    <>
      <Box args={[width + 0.2, 0.26, depth + 0.12]} position={[0, y, 0]} material={chassis} />
      {pocketAt.map(x => (
        <Box key={x} args={[0.55, 0.16, depth + 0.16]} position={[x, y, 0]} material={steelDark} />
      ))}
    </>
  );
}

/* corrugated wall segment spanning x, fixed z (front/back walls) */
export function CorrWallX({ x0, x1, y0, y1, z, thick = 0.12 }){
  const w = x1 - x0, h = y1 - y0;
  const mat = useMemo(() => corrugatedMaterial(w), [w]);
  return <Box args={[w, h, thick]} position={[(x0 + x1) / 2, (y0 + y1) / 2, z]} material={mat} />;
}

/* corrugated wall segment spanning z, fixed x (side walls) */
export function CorrWallZ({ z0, z1, y0, y1, x, thick = 0.12 }){
  const d = z1 - z0, h = y1 - y0;
  const mat = useMemo(() => corrugatedMaterial(d), [d]);
  return <Box args={[thick, h, d]} position={[x, (y0 + y1) / 2, (z0 + z1) / 2]} material={mat} />;
}

/* flat metal roof cap + fascia trim */
export function RoofCap({ width, depth, y, material }){
  return (
    <>
      <Box args={[width + 0.12, 0.14, depth + 0.12]} position={[0, y, 0]} material={material} />
      <Box args={[width + 0.18, 0.2, 0.06]} position={[0, y - 0.02, depth / 2]} material={steelDark} />
      <Box args={[width + 0.18, 0.2, 0.06]} position={[0, y - 0.02, -depth / 2]} material={steelDark} />
      <Box args={[0.06, 0.2, depth + 0.2]} position={[-width / 2, y - 0.02, 0]} material={steelDark} />
      <Box args={[0.06, 0.2, depth + 0.2]} position={[width / 2, y - 0.02, 0]} material={steelDark} />
    </>
  );
}

/* four corner posts running the wall height */
export function CornerPosts({ halfW, halfD, yMid, height, material = steelDark }){
  return [-halfW, halfW].map(x => [-halfD, halfD].map(z => (
    <Box key={`${x}:${z}`} args={[0.12, height + 0.06, 0.12]} position={[x, yMid, z]} material={material} />
  )));
}

export function Downpipe({ x, z, height = 3.0 }){
  return (
    <mesh position={[x, height / 2 - 0.3, z]} castShadow>
      <cylinderGeometry args={[0.045, 0.045, height, 10]} />
      <primitive object={aluminum} attach="material" />
    </mesh>
  );
}
