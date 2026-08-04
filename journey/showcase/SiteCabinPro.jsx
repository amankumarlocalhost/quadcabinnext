import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Skid, CorrWallX, CorrWallZ, RoofCap, Downpipe } from './parts.jsx';
import { signTexture } from '../textures.js';
import {
  aluminum, blackMetal, glassTint,
  ledWarm, whiteLaminate, woodFloor, drywallDark, ceilingMat, walnut,
} from '../materials.js';

/*
 * SiteCabinPro — the /industries hero showpiece. A completely different
 * model from every earlier attempt: proportions and layout modelled on a
 * real single-module portable site office (large picture window, single
 * steel door, plain cladding on every elevation — not just the front), in
 * the Quad Cabins mark's own palette (white body, black steel, red accent
 * line). Every wall segment below is sized against the cabin's actual
 * half-width/half-depth so nothing pokes through an adjacent face — the
 * previous model's stray-geometry artifact came from a door that didn't
 * fit inside its wall, which is why every span here is a plain, checked
 * arithmetic expression rather than a hand-tuned constant.
 */

const W = 5.4, D = 2.6, B = 0.32, T = 2.95;
const WIN = { x0: -W/2 + 0.4, x1: -0.2, y0: B + 0.85, y1: T - 0.3 };
const DOOR = { x0: 0.3, x1: 1.1, y0: B, y1: B + 2.05 };

function toTex(canvas, colorSpace = THREE.SRGBColorSpace){
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = colorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  return t;
}

/* flat black standing-seam roof + trim — generated locally (not a clone of
   the shared `roofMetal` singleton) so tinting it never touches the grey
   roof used by every other cabin on the site */
function blackRoofMaps(){
  const w = 512, h = 256, SEAMS = 9;
  const color = document.createElement('canvas'); color.width = w; color.height = h;
  {
    const ctx = color.getContext('2d');
    const base = ctx.createLinearGradient(0,0,0,h);
    base.addColorStop(0,'#1c1d20'); base.addColorStop(1,'#131416');
    ctx.fillStyle = base; ctx.fillRect(0,0,w,h);
    const sw = w/SEAMS;
    for(let i=0;i<SEAMS;i++){
      const x = i*sw;
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x,0,3,h);
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x+3,0,2,h);
    }
  }
  const rough = document.createElement('canvas'); rough.width = 256; rough.height = 128;
  {
    const ctx = rough.getContext('2d');
    ctx.fillStyle = '#5a5a5a'; ctx.fillRect(0,0,256,128);
    for(let i=0;i<400;i++){
      const g = 90 + Math.random()*60;
      ctx.fillStyle = `rgba(${g},${g},${g},${0.35*Math.random()})`;
      ctx.fillRect(Math.random()*256, Math.random()*128, 2, 6+Math.random()*10);
    }
  }
  return { color: toTex(color), rough: toTex(rough, THREE.NoColorSpace) };
}
const blackRoof = blackRoofMaps();
const blackRoofMat = new THREE.MeshStandardMaterial({
  map: blackRoof.color, roughnessMap: blackRoof.rough,
  roughness: 0.4, metalness: 0.6, envMapIntensity: 0.9,
});

const doorPanel = new THREE.MeshStandardMaterial({ color:0x161618, roughness:0.4, metalness:0.6, envMapIntensity:0.9 });

function WindowUnit(){
  const { x0, x1, y0, y1 } = WIN;
  const w = x1-x0, h = y1-y0, cx = (x0+x1)/2, cy = (y0+y1)/2, z = D/2;
  return (
    <group>
      <Box args={[w+0.14, 0.09, 0.18]} position={[cx, y1+0.03, z]} material={blackMetal} />
      <Box args={[w+0.14, 0.09, 0.18]} position={[cx, y0-0.03, z]} material={blackMetal} />
      <Box args={[0.09, h+0.12, 0.18]} position={[x0-0.03, cy, z]} material={blackMetal} />
      <Box args={[0.09, h+0.12, 0.18]} position={[x1+0.03, cy, z]} material={blackMetal} />
      <Box args={[0.06, h, 0.14]} position={[cx, cy, z]} material={blackMetal} castShadow={false} />
      {[x0+w*0.25+0.03, x1-w*0.25-0.03].map((mx,i)=>(
        <mesh key={i} position={[mx, cy, z-0.02]}>
          <planeGeometry args={[w/2-0.15, h-0.08]} />
          <primitive object={glassTint} attach="material" />
        </mesh>
      ))}
      {/* exterior sill */}
      <Box args={[w+0.24, 0.05, 0.22]} position={[cx, y0-0.08, z+0.08]} material={aluminum} castShadow={false} />
    </group>
  );
}

/* rooftop signage — a double-sided plate on two posts standing above the
   roofline, so the mark reads from the drive-up angle instead of being
   applied flat to the cladding */
function RoofSign(){
  const signTex = useMemo(() => signTexture(), []);
  const postH = 0.36;
  return (
    <group position={[-0.2, T+0.07, 0.35]}>
      {[-0.55, 0.55].map(x=>(
        <mesh key={x} position={[x, postH/2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, postH, 10]} />
          <primitive object={blackMetal} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, postH+0.17, 0]}>
        <planeGeometry args={[1.3, 0.34]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>
      <mesh position={[0, postH+0.17, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.3, 0.34]} />
        <meshBasicMaterial color={0x141416} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Door(){
  const { x0, x1, y0, y1 } = DOOR;
  const w = x1-x0, h = y1-y0, cx = (x0+x1)/2, z = D/2;
  return (
    <group>
      <Box args={[w+0.14, h+0.14, 0.2]} position={[cx, (y0+y1)/2, z]} material={blackMetal} />
      <Box args={[w-0.06, h-0.06, 0.05]} position={[cx, (y0+y1)/2, z+0.05]} material={doorPanel} />
      <Box args={[0.05, 0.2, 0.03]} position={[cx+w/2-0.12, (y0+y1)/2-0.05, z+0.11]} material={aluminum} />
      {/* threshold step */}
      <Box args={[w+0.5, 0.15, 0.55]} position={[cx, 0.075, z+0.32]} material={whiteLaminate} />
    </group>
  );
}

/* dark interior glimpse behind the picture window — floor, back panel, a
   low console and warm fill light — sold through the window glass instead
   of leaving it a flat black void */
function CabinInterior(){
  const ix = (WIN.x0+WIN.x1)/2, iz = -0.1;
  const span = WIN.x1 - WIN.x0 + 0.7;
  return (
    <group>
      <Box args={[span, 0.06, D-0.5]} position={[ix, B+0.05, iz]} material={woodFloor} castShadow={false} />
      <Box args={[span, 0.06, D-0.5]} position={[ix, T-0.12, iz]} material={ceilingMat} castShadow={false} />
      <Box args={[span, T-B, 0.08]} position={[ix, (B+T)/2, -D/2+0.2]} material={drywallDark} castShadow={false} />
      <Box args={[1.0, 0.6, 0.32]} position={[ix, B+0.4, -0.15]} material={walnut} castShadow={false} />
      <Box args={[0.22, 0.05, 0.22]} position={[ix, T-0.28, iz]} material={ledWarm} castShadow={false} />
      <pointLight position={[ix, T-0.48, iz]} intensity={8.5} distance={4.8} decay={2} color={0xffdcae} />
    </group>
  );
}

export default function SiteCabinPro(){
  const b = B, t = T;

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-1.7, 1.7]} />

      <CabinInterior />

      {/* front wall — window, then door, plain cladding filling the rest;
          every span below is checked against W/2 = 2.7 so nothing overhangs
          the corner trim or pokes through the side wall */}
      <CorrWallX x0={-W/2} x1={WIN.x0} y0={b} y1={t} z={D/2} />
      <CorrWallX x0={WIN.x0} x1={WIN.x1} y0={b} y1={WIN.y0} z={D/2} />
      <CorrWallX x0={WIN.x0} x1={WIN.x1} y0={WIN.y1} y1={t} z={D/2} />
      <WindowUnit />
      <CorrWallX x0={WIN.x1} x1={DOOR.x0} y0={b} y1={t} z={D/2} />
      <CorrWallX x0={DOOR.x0} x1={DOOR.x1} y0={DOOR.y1} y1={t} z={D/2} />
      <Door />
      <CorrWallX x0={DOOR.x1} x1={W/2} y0={b} y1={t} z={D/2} />

      {/* back + side walls — same cladding material/tone as the front, so
          the whole body reads as one consistent white unit from any angle */}
      <CorrWallX x0={-W/2} x1={W/2} y0={b} y1={t} z={-D/2} />
      <CorrWallZ z0={-D/2} z1={D/2} y0={b} y1={t} x={-W/2} />
      <CorrWallZ z0={-D/2} z1={D/2} y0={b} y1={t} x={W/2} />

      {/* black corner trim, all four corners, full wall height */}
      {[-W/2, W/2].map(x => [-D/2, D/2].map(z => (
        <Box key={`${x}:${z}`} args={[0.16, t-b+0.08, 0.16]} position={[x, (b+t)/2, z]} material={blackMetal} />
      )))}

      {/* black base band, full perimeter */}
      <Box args={[W+0.06, 0.18, 0.1]} position={[0, b+0.09, D/2+0.07]} material={blackMetal} />
      <Box args={[W+0.06, 0.18, 0.1]} position={[0, b+0.09, -D/2-0.07]} material={blackMetal} />
      <Box args={[0.1, 0.18, D+0.06]} position={[-W/2-0.07, b+0.09, 0]} material={blackMetal} />
      <Box args={[0.1, 0.18, D+0.06]} position={[W/2+0.07, b+0.09, 0]} material={blackMetal} />
      <RoofCap width={W} depth={D} y={t+0.07} material={blackRoofMat} />
      <RoofSign />

      {/* wall lamp over the door */}
      <group position={[(DOOR.x0+DOOR.x1)/2, DOOR.y1+0.28, D/2+0.06]}>
        <Box args={[0.28, 0.06, 0.12]} material={blackMetal} />
        <Box args={[0.22, 0.02, 0.08]} position={[0,-0.032,0]} material={ledWarm} castShadow={false} />
      </group>

      {/* roof-mounted AC condenser */}
      <group position={[1.7, t+0.28, -0.4]}>
        <Box args={[0.7, 0.32, 0.55]} material={aluminum} />
        <Box args={[0.72, 0.05, 0.57]} position={[0,0.17,0]} material={blackMetal} castShadow={false} />
      </group>

      <Downpipe x={-W/2-0.06} z={-D/2} />
      <Downpipe x={W/2+0.06} z={-D/2} />
    </group>
  );
}
