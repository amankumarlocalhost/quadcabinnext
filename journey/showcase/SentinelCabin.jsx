import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Skid, CorrWallX, RoofCap } from './parts.jsx';
import { signTexture, brandingTexture } from '../textures.js';
import {
  aluminum, blackMetal, glassTint,
  ledWarm, whiteLaminate, woodFloor, drywallDark, ceilingMat, walnut,
} from '../materials.js';

/*
 * SentinelCabin — the /industries hero showpiece, restyled to the exact
 * Quad Cabins mark palette: white cladding body, black steel trim/roof,
 * and a single bold red chamfered fin at the entrance corner that is a
 * literal 3D read of the logo's clipped-corner red square. A different
 * silhouette again from both FlagshipSiteCabin (glass corner + perforated
 * screen, now retired from the hero) and the Products page's ExecutiveCabin
 * (full glass curtain wall): here the front is mostly solid white panel
 * with one large black-framed picture window, so it reads as a rugged
 * multi-sector site unit rather than an executive suite.
 */

const W = 5.6, D = 2.8, B = 0.34, T = 3.0;
// chamfer geometry — the red fin's diagonal matches the logo mark's
// clipped top-right corner, mirrored onto the cabin's front-left corner
const CHAMFER = 1.15;
const WIN = { x0: -0.35, x1: 1.85, y0: B + 0.95, y1: T - 0.32 };
// must fit within [WIN.x1, W/2] (1.85 .. 2.8) with room either side for a
// trailing wall segment — a wider door here previously overshot W/2 and
// pushed geometry through the right wall, which is what produced a stray
// sliver of geometry catching the rim light
const DOOR = { x0: 1.98, x1: 2.62, y0: B, y1: B + 2.08 };

function toTex(canvas, colorSpace = THREE.SRGBColorSpace){
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = colorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  return t;
}

/* brushed black roof/trim variant — same brushing technique as the other
   hero cabins' metal maps, kept local since it's specific to this model's
   pure black roofline (the shared roofMetal texture reads dark grey, not
   the flat black this palette needs) */
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
  roughness: 0.42, metalness: 0.6, envMapIntensity: 0.9,
});

const redFin = new THREE.MeshPhysicalMaterial({
  color:0xe11b23, roughness:0.32, metalness:0.15, envMapIntensity:0.75,
  clearcoat:0.5, clearcoatRoughness:0.3,
});
const doorRed = new THREE.MeshPhysicalMaterial({
  color:0xe11b23, roughness:0.36, metalness:0.12, envMapIntensity:0.6,
  clearcoat:0.35, clearcoatRoughness:0.4,
});
const doorBlack = new THREE.MeshStandardMaterial({ color:0x151517, roughness:0.4, metalness:0.6, envMapIntensity:0.9 });

/* the entrance fin: a canted black-and-red blade standing proud of the
   front-left corner, its top edge chamfered at the same angle as the
   logo's clipped corner — reads as a signature brand element, not applied
   decoration */
function EntranceFin(){
  const fx = -W/2 + CHAMFER*0.5;
  return (
    <group position={[fx, 0, D/2+0.02]}>
      {/* black backing blade */}
      <mesh position={[0, (B+T)/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[CHAMFER+0.3, T-B, 0.1]} />
        <primitive object={blackMetal} attach="material" />
      </mesh>
      {/* red chamfered cap — a triangular prism sliced at the logo's corner
          angle, sitting on top of the black blade like the mark's clipped
          red square */}
      <mesh position={[0, T-B-0.18, 0.09]} rotation={[0,0,0]} castShadow>
        <boxGeometry args={[CHAMFER, 0.5, 0.1]} />
        <primitive object={redFin} attach="material" />
      </mesh>
      <mesh position={[-CHAMFER/2+0.02, T-B+0.05, 0.09]} rotation={[0,0,Math.PI/4]} castShadow>
        <boxGeometry args={[0.36, 0.36, 0.1]} />
        <primitive object={redFin} attach="material" />
      </mesh>
      {/* slim white reveal separating the fin from the cladding */}
      <mesh position={[CHAMFER/2+0.06, (B+T)/2, 0.02]}>
        <boxGeometry args={[0.03, T-B, 0.06]} />
        <primitive object={aluminum} attach="material" />
      </mesh>
    </group>
  );
}

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
    </group>
  );
}

function Door(){
  const { x0, x1, y0, y1 } = DOOR;
  const w = x1-x0, h = y1-y0, cx = (x0+x1)/2, z = D/2;
  return (
    <group>
      <Box args={[w+0.14, h+0.14, 0.2]} position={[cx, (y0+y1)/2, z]} material={blackMetal} />
      <Box args={[w-0.06, h-0.06, 0.05]} position={[cx, (y0+y1)/2, z+0.05]} material={doorBlack} />
      <Box args={[0.05, h-0.16, 0.02]} position={[cx-w/2+0.16, (y0+y1)/2, z+0.09]} material={doorRed} castShadow={false} />
      <Box args={[0.05, 0.2, 0.03]} position={[cx+w/2-0.14, (y0+y1)/2-0.05, z+0.11]} material={aluminum} />
      <Box args={[w+0.5, 0.15, 0.55]} position={[cx, 0.075, z+0.32]} material={whiteLaminate} />
    </group>
  );
}

/* dark interior glimpse behind the picture window — floor, brand wall, a
   low console and warm fill light — sold through the black-framed glass */
function CabinInterior(){
  const brandTex = useMemo(() => brandingTexture(), []);
  const ix = (WIN.x0+WIN.x1)/2, iz = -0.1;
  return (
    <group>
      <Box args={[WIN.x1-WIN.x0+0.6, 0.06, D-0.5]} position={[ix, B+0.05, iz]} material={woodFloor} castShadow={false} />
      <Box args={[WIN.x1-WIN.x0+0.6, 0.06, D-0.5]} position={[ix, T-0.12, iz]} material={ceilingMat} castShadow={false} />
      <Box args={[WIN.x1-WIN.x0+0.6, T-B, 0.08]} position={[ix, (B+T)/2, -D/2+0.2]} material={drywallDark} castShadow={false} />
      <mesh position={[ix, 1.75, -D/2+0.24]}>
        <planeGeometry args={[1.1, 0.55]} />
        <meshBasicMaterial map={brandTex} toneMapped={false} />
      </mesh>
      <Box args={[1.0, 0.6, 0.32]} position={[ix, B+0.4, -0.15]} material={walnut} castShadow={false} />
      <Box args={[0.22, 0.05, 0.22]} position={[ix, T-0.3, iz]} material={ledWarm} castShadow={false} />
      <pointLight position={[ix, T-0.5, iz]} intensity={9} distance={5} decay={2} color={0xffdcae} />
    </group>
  );
}

export default function SentinelCabin(){
  const signTex = useMemo(() => signTexture(), []);
  const b = B, t = T;
  // CorrWallX (used for the front/back panel segments below) builds its own
  // near-white cladding material internally, so only the two side Box walls
  // — which take an explicit material prop — need this local one.
  const sideMat = useMemo(() => corrugatedFrontMaterial(D), []);

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-1.8, 1.8]} />

      <CabinInterior />

      {/* white cladding front wall, built around the fin / window / door */}
      <CorrWallX x0={-W/2+CHAMFER} x1={WIN.x0} y0={b} y1={t} z={D/2} />
      <CorrWallX x0={WIN.x0} x1={WIN.x1} y0={b} y1={WIN.y0} z={D/2} />
      <CorrWallX x0={WIN.x0} x1={WIN.x1} y0={WIN.y1} y1={t} z={D/2} />
      <WindowUnit />
      <CorrWallX x0={WIN.x1} x1={DOOR.x0} y0={b} y1={t} z={D/2} />
      <CorrWallX x0={DOOR.x0} x1={DOOR.x1} y0={DOOR.y1} y1={t} z={D/2} />
      <Door />
      <CorrWallX x0={DOOR.x1} x1={W/2} y0={b} y1={t} z={D/2} />

      <EntranceFin />

      {/* back + side walls, plain white cladding */}
      <CorrWallX x0={-W/2} x1={W/2} y0={b} y1={t} z={-D/2} />
      <Box args={[0.12, t-b, D]} position={[-W/2, (b+t)/2, 0]} material={sideMat} castShadow receiveShadow />
      <Box args={[0.12, t-b, D]} position={[W/2, (b+t)/2, 0]} material={sideMat} castShadow receiveShadow />

      {/* black corner trim, full height, all four corners */}
      {[-W/2, W/2].map(x => [-D/2, D/2].map(z => (
        <Box key={`${x}:${z}`} args={[0.16, t-b+0.08, 0.16]} position={[x, (b+t)/2, z]} material={blackMetal} />
      )))}

      {/* black base band with a slim red brand line above it */}
      <Box args={[W+0.06, 0.2, 0.1]} position={[0, b+0.1, D/2+0.07]} material={blackMetal} />
      <Box args={[W+0.06, 0.2, 0.1]} position={[0, b+0.1, -D/2-0.07]} material={blackMetal} />
      <Box args={[0.1, 0.2, D+0.06]} position={[-W/2-0.07, b+0.1, 0]} material={blackMetal} />
      <Box args={[0.1, 0.2, D+0.06]} position={[W/2+0.07, b+0.1, 0]} material={blackMetal} />
      <Box args={[W+0.08, 0.03, 0.12]} position={[0, b+0.21, D/2+0.075]} material={redFin} castShadow={false} />
      <Box args={[W+0.08, 0.03, 0.12]} position={[0, b+0.21, -D/2-0.075]} material={redFin} castShadow={false} />

      <RoofCap width={W} depth={D} y={t+0.07} material={blackRoofMat} />

      {/* red underside strip light along the front eave */}
      <Box args={[W-0.4, 0.02, 0.05]} position={[0, t-0.1, D/2+0.1]} material={ledWarm} castShadow={false} />

      {/* branded sign, centred above the window */}
      <mesh position={[(WIN.x0+WIN.x1)/2, t-0.4, D/2+0.11]}>
        <planeGeometry args={[1.7, 0.44]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>

      {/* roof-mounted AC condenser */}
      <group position={[1.5, t+0.28, -0.45]}>
        <Box args={[0.7, 0.32, 0.55]} material={aluminum} />
        <Box args={[0.72, 0.05, 0.57]} position={[0,0.17,0]} material={blackMetal} castShadow={false} />
      </group>
    </group>
  );
}

/* white/off-white corrugated cladding — reuses the shared rib profile from
   textures.js but freshly generated here at full brightness (no darkening
   multiply) so it reads as the crisp white body this palette calls for */
function corrugatedFrontMaterial(widthM = W){
  const w = 512, h = 1024, RIBS = 8;
  const color = document.createElement('canvas'); color.width = w; color.height = h;
  {
    const ctx = color.getContext('2d');
    const base = ctx.createLinearGradient(0,0,0,h);
    base.addColorStop(0,'#f4f3f0'); base.addColorStop(0.5,'#eeede9'); base.addColorStop(1,'#e8e7e2');
    ctx.fillStyle = base; ctx.fillRect(0,0,w,h);
    const rw = w/RIBS;
    for(let i=0;i<RIBS;i++){
      const x = i*rw;
      const grad = ctx.createLinearGradient(x,0,x+rw,0);
      grad.addColorStop(0,'rgba(0,0,0,0.1)'); grad.addColorStop(0.18,'rgba(0,0,0,0.02)');
      grad.addColorStop(0.38,'rgba(255,255,255,0.12)'); grad.addColorStop(0.62,'rgba(255,255,255,0.12)');
      grad.addColorStop(0.82,'rgba(0,0,0,0.03)'); grad.addColorStop(1,'rgba(0,0,0,0.12)');
      ctx.fillStyle = grad; ctx.fillRect(x,0,rw,h);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.fillRect(0,0,2,h); ctx.fillRect(w-2,0,2,h);
  }
  const rough = document.createElement('canvas'); rough.width = 256; rough.height = 512;
  {
    const ctx = rough.getContext('2d');
    ctx.fillStyle = '#9a9a9a'; ctx.fillRect(0,0,256,512);
    for(let i=0;i<700;i++){
      const g = 130 + Math.random()*60;
      ctx.fillStyle = `rgba(${g},${g},${g},${0.3*Math.random()})`;
      ctx.fillRect(Math.random()*256, Math.random()*512, 2, 4+Math.random()*10);
    }
  }
  const map = toTex(color); map.repeat.set(widthM,1);
  const roughnessMap = toTex(rough, THREE.NoColorSpace); roughnessMap.repeat.set(widthM,1);
  return new THREE.MeshStandardMaterial({ map, roughnessMap, roughness:0.52, metalness:0.3, envMapIntensity:0.85 });
}
