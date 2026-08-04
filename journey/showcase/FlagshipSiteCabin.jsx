import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Skid, RoofCap, Downpipe } from './parts.jsx';
import { corrugatedMaterial, signTexture, brandingTexture } from '../textures.js';
import {
  steelDark, aluminum, blackMetal, chassis, roofMetal, redPaint,
  ledWarm, whiteLaminate, woodFloor, drywallDark, ceilingMat, walnut,
} from '../materials.js';

/*
 * FlagshipSiteCabin — the /industries hero showpiece. A distinct silhouette
 * from every other showcase cabin: a mitred glass corner entrance (no flat
 * front wall of windows), a cantilevered steel canopy over the door, a
 * perforated privacy screen panel with real light-through-holes depth, and
 * a safety-yellow base band alongside the brand red — reads as "built for
 * every industry" rather than a single office type. PBR maps generated at
 * load, no external assets.
 */

const W = 5.8, D = 2.9, B = 0.34, T = 3.05;
const CORNER = 1.45; // glass run length off the mitred front-left corner, per side

function toTex(canvas, colorSpace = THREE.SRGBColorSpace){
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = colorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  return t;
}
function heightToNormal(heightCanvas, strength = 1.6){
  const w = heightCanvas.width, h = heightCanvas.height;
  const src = heightCanvas.getContext('2d').getImageData(0,0,w,h).data;
  const lum = (x,y)=> src[(((y+h)%h)*w + ((x+w)%w))*4] / 255;
  const out = document.createElement('canvas'); out.width = w; out.height = h;
  const octx = out.getContext('2d');
  const img = octx.createImageData(w,h);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){
    const dx = (lum(x+1,y-1)+2*lum(x+1,y)+lum(x+1,y+1)) - (lum(x-1,y-1)+2*lum(x-1,y)+lum(x-1,y+1));
    const dy = (lum(x-1,y+1)+2*lum(x,y+1)+lum(x+1,y+1)) - (lum(x-1,y-1)+2*lum(x,y-1)+lum(x+1,y-1));
    let nx = -dx*strength, ny = -dy*strength, nz = 1;
    const len = Math.sqrt(nx*nx+ny*ny+nz*nz); nx/=len; ny/=len; nz/=len;
    const i = (y*w+x)*4;
    img.data[i] = (nx*0.5+0.5)*255; img.data[i+1] = (ny*0.5+0.5)*255;
    img.data[i+2] = (nz*0.5+0.5)*255; img.data[i+3] = 255;
  }
  octx.putImageData(img,0,0);
  return toTex(out, THREE.NoColorSpace);
}

/* perforated steel screen: a grid of dark circular perforations over a
   brushed-steel base, with a stronger ambient-occlusion-like darkening in
   each hole so it reads as pierced metal rather than a printed dot pattern */
function perforatedMaps(){
  const w = 512, h = 512, GRID = 12, cell = w/GRID;
  const color = document.createElement('canvas'); color.width = w; color.height = h;
  {
    const ctx = color.getContext('2d');
    const base = ctx.createLinearGradient(0,0,w,h);
    base.addColorStop(0,'#4a4d52'); base.addColorStop(1,'#3c3f44');
    ctx.fillStyle = base; ctx.fillRect(0,0,w,h);
    for(let gy=0; gy<GRID; gy++) for(let gx=0; gx<GRID; gx++){
      const cx = gx*cell + cell/2, cy = gy*cell + cell/2, r = cell*0.3;
      const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0,'rgba(6,6,7,0.95)'); g.addColorStop(0.7,'rgba(6,6,7,0.85)'); g.addColorStop(1,'rgba(6,6,7,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx,cy,r*1.15,0,Math.PI*2); ctx.fill();
      // rim highlight catching the light on one edge of each punch
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(cx,cy,r*0.85,-0.6,1.6); ctx.stroke();
    }
  }
  const height = document.createElement('canvas'); height.width = w; height.height = h;
  {
    const ctx = height.getContext('2d');
    ctx.fillStyle = 'rgb(150,150,150)'; ctx.fillRect(0,0,w,h);
    for(let gy=0; gy<GRID; gy++) for(let gx=0; gx<GRID; gx++){
      const cx = gx*cell + cell/2, cy = gy*cell + cell/2, r = cell*0.3;
      ctx.fillStyle = 'rgb(10,10,10)';
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    }
  }
  return { color: toTex(color), normal: heightToNormal(height, 2.0) };
}
const perforated = perforatedMaps();
const perfMaterial = new THREE.MeshStandardMaterial({
  map: perforated.color, normalMap: perforated.normal, normalScale: new THREE.Vector2(1.4,1.4),
  roughness: 0.4, metalness: 0.75, envMapIntensity: 1.1,
});

/* solid backing panel seen faintly through the perforations — a shadowed
   plane set back from the screen so the holes read as actual depth */
const screenBacking = new THREE.MeshStandardMaterial({ color:0x111214, roughness:0.7, metalness:0.2, envMapIntensity:0.4 });

const safetyYellow = new THREE.MeshPhysicalMaterial({
  color:0xe8b400, roughness:0.42, metalness:0.1, envMapIntensity:0.6,
  clearcoat:0.25, clearcoatRoughness:0.5,
});
const canopyMetal = new THREE.MeshStandardMaterial({ color:0x24262a, roughness:0.35, metalness:0.82, envMapIntensity:1.15 });
const solarPanel = new THREE.MeshPhysicalMaterial({
  color:0x0d1622, roughness:0.18, metalness:0.35, envMapIntensity:1.3,
  clearcoat:0.6, clearcoatRoughness:0.2,
});
const cornerGlass = new THREE.MeshPhysicalMaterial({
  color:0xc3dcea, roughness:0.04, metalness:0,
  transparent:true, opacity:0.15, envMapIntensity:1.4,
  reflectivity:0.58, ior:1.5, side:THREE.DoubleSide, depthWrite:false, fog:false,
});

/* mitred glass corner: two glazed runs meeting at a 45° corner post,
   wrapping the front-left edge of the cabin */
function GlassCorner(){
  const mullionCount = 3;
  const segX = { x0: -W/2, x1: -W/2 + CORNER, z: D/2 };   // front run
  const segZ = { z0: D/2, z1: D/2 - CORNER, x: -W/2 };    // side run
  return (
    <group>
      {/* corner post */}
      <Box args={[0.1, T-B, 0.1]} position={[-W/2+0.02, (B+T)/2, D/2-0.02]} rotation={[0,Math.PI/4,0]} material={blackMetal} />
      {/* head + sill along the front run */}
      <Box args={[CORNER, 0.12, 0.14]} position={[(segX.x0+segX.x1)/2, T-0.06, segX.z]} material={blackMetal} />
      <Box args={[CORNER, 0.12, 0.14]} position={[(segX.x0+segX.x1)/2, B+0.06, segX.z]} material={blackMetal} />
      {Array.from({length:mullionCount+1}).map((_,i)=>(
        <Box key={`fx${i}`} args={[0.06, T-B, 0.12]} position={[segX.x0+(CORNER/mullionCount)*i, (B+T)/2, segX.z]} material={blackMetal} />
      ))}
      <mesh position={[(segX.x0+segX.x1)/2, (B+T)/2, segX.z-0.02]}>
        <planeGeometry args={[CORNER-0.08, T-B-0.18]} />
        <primitive object={cornerGlass} attach="material" />
      </mesh>
      {/* head + sill along the side run */}
      <Box args={[0.14, 0.12, CORNER]} position={[segZ.x, T-0.06, (segZ.z0+segZ.z1)/2]} material={blackMetal} />
      <Box args={[0.14, 0.12, CORNER]} position={[segZ.x, B+0.06, (segZ.z0+segZ.z1)/2]} material={blackMetal} />
      {Array.from({length:mullionCount+1}).map((_,i)=>(
        <Box key={`fz${i}`} args={[0.12, T-B, 0.06]} position={[segZ.x, (B+T)/2, segZ.z0-(CORNER/mullionCount)*i]} material={blackMetal} />
      ))}
      <mesh position={[segZ.x+0.02, (B+T)/2, (segZ.z0+segZ.z1)/2]} rotation={[0,Math.PI/2,0]}>
        <planeGeometry args={[CORNER-0.08, T-B-0.18]} />
        <primitive object={cornerGlass} attach="material" />
      </mesh>
      {/* frameless glass door, second bay of the front run */}
      <mesh position={[segZ.x+0.1, 1.02, D/2-0.35]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.9, 10]} />
        <primitive object={aluminum} attach="material" />
      </mesh>
    </group>
  );
}

/* cantilevered flat canopy over the entrance corner, on two raked struts */
function Canopy(){
  const cx = -W/2 + CORNER*0.55, cz = D/2 + 0.55;
  return (
    <group>
      <Box args={[CORNER+0.5, 0.07, 1.3]} position={[cx, T+0.22, cz]} material={canopyMetal} />
      <Box args={[CORNER+0.5, 0.03, 0.08]} position={[cx, T+0.14, cz+0.63]} material={blackMetal} castShadow={false} />
      {[cx-0.7, cx+0.7].map(x=>(
        <mesh key={x} position={[x, T-0.35, D/2+0.06]} rotation={[0.55,0,0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.05, 10]} />
          <primitive object={canopyMetal} attach="material" />
        </mesh>
      ))}
      {/* underside strip light */}
      <Box args={[CORNER+0.2, 0.02, 0.05]} position={[cx, T+0.185, cz-0.4]} material={ledWarm} castShadow={false} />
    </group>
  );
}

/* dark interior glimpse behind the glass corner — floor, back panel with
   brand texture, a low reception console and warm fill light — so the
   glazing reads as a real occupied room instead of a flat reflective pane */
function CabinInterior(){
  const brandTex = useMemo(() => brandingTexture(), []);
  const ix = -W/2 + CORNER*0.42, iz = -0.15;
  return (
    <group>
      <Box args={[CORNER+0.4, 0.06, D-0.5]} position={[ix, B+0.05, iz]} material={woodFloor} castShadow={false} />
      <Box args={[CORNER+0.4, 0.06, D-0.5]} position={[ix, T-0.12, iz]} material={ceilingMat} castShadow={false} />
      <Box args={[CORNER+0.4, T-B, 0.08]} position={[ix, (B+T)/2, -D/2+0.2]} material={drywallDark} castShadow={false} />
      <mesh position={[ix-0.2, 1.8, -D/2+0.24]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshBasicMaterial map={brandTex} toneMapped={false} />
      </mesh>
      <Box args={[1.1, 0.62, 0.35]} position={[ix+0.3, B+0.4, -0.1]} material={walnut} castShadow={false} />
      <Box args={[0.24, 0.05, 0.24]} position={[ix, T-0.3, iz]} material={ledWarm} castShadow={false} />
      <pointLight position={[ix, T-0.5, iz]} intensity={11} distance={5.5} decay={2} color={0xffdcae} />
    </group>
  );
}

export default function FlagshipSiteCabin(){
  const signTex = useMemo(() => signTexture(), []);
  const backMat = useMemo(() => { const m = corrugatedMaterial(W); m.color.setHex(0x4a4d52); return m; }, []);
  const rightMat = useMemo(() => { const m = corrugatedMaterial(D); m.color.setHex(0x4a4d52); return m; }, []);
  const b = B, t = T;
  // the screen starts right where the glass corner's mitred post ends, so
  // no strip of exposed base cladding shows between the two front elements
  const screenX0 = -W/2 + CORNER + 0.05, screenX1 = W/2 - 0.15;

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-1.9, 1.9]} />

      <CabinInterior />
      <GlassCorner />
      <Canopy />

      {/* right portion of the front wall: solid backing behind a perforated
          privacy screen, standing proud of the wall for real shadow depth */}
      <Box args={[screenX1-screenX0+0.3, t-b, 0.1]} position={[(screenX0+screenX1)/2, (b+t)/2, D/2]} material={backMat} />
      <Box args={[screenX1-screenX0, t-b-0.3, 0.08]} position={[(screenX0+screenX1)/2, (b+t)/2, D/2+0.02]} material={screenBacking} castShadow={false} />
      <mesh position={[(screenX0+screenX1)/2, (b+t)/2, D/2+0.09]}>
        <planeGeometry args={[screenX1-screenX0, t-b-0.3]} />
        <primitive object={perfMaterial} attach="material" />
      </mesh>
      <Box args={[screenX1-screenX0+0.06, 0.05, 0.14]} position={[(screenX0+screenX1)/2, t-0.15, D/2+0.06]} material={blackMetal} castShadow={false} />

      {/* side + back walls */}
      <Box args={[W, t-b, 0.1]} position={[0, (b+t)/2, -D/2]} material={backMat} />
      <Box args={[0.12, t-b, D-CORNER]} position={[-W/2, (b+t)/2, -CORNER/2-0.03]} material={rightMat} />
      <Box args={[0.12, t-b, D]} position={[W/2, (b+t)/2, 0]} material={rightMat} />

      {/* corner posts (non-glazed corners only) */}
      {[[-W/2, -D/2], [W/2, -D/2], [W/2, D/2]].map(([x,z])=>(
        <Box key={`${x}:${z}`} args={[0.18, t-b+0.08, 0.18]} position={[x, (b+t)/2, z]} material={steelDark} />
      ))}

      {/* safety-yellow base band, full perimeter, with a slim red brand
          line riding just above it */}
      <Box args={[W+0.08, 0.16, 0.11]} position={[0, b+0.08, D/2+0.075]} material={safetyYellow} />
      <Box args={[W+0.08, 0.16, 0.11]} position={[0, b+0.08, -D/2-0.075]} material={safetyYellow} />
      <Box args={[0.11, 0.16, D+0.08]} position={[-W/2-0.075, b+0.08, 0]} material={safetyYellow} />
      <Box args={[0.11, 0.16, D+0.08]} position={[W/2+0.075, b+0.08, 0]} material={safetyYellow} />
      <Box args={[W+0.1, 0.035, 0.13]} position={[0, b+0.19, D/2+0.085]} material={redPaint} castShadow={false} />
      <Box args={[W+0.1, 0.035, 0.13]} position={[0, b+0.19, -D/2-0.085]} material={redPaint} castShadow={false} />

      <RoofCap width={W} depth={D} y={t+0.07} material={roofMetal} />

      {/* rooftop solar array, angled toward the sun rig */}
      <group position={[1.3, t+0.13, -0.4]} rotation={[-0.14,0,0]}>
        <Box args={[2.0, 0.04, 1.15]} material={solarPanel} />
        {[-0.62,-0.2,0.2,0.62].map(x=>(
          <Box key={x} args={[0.02, 0.045, 1.15]} position={[x,0,0]} material={steelDark} castShadow={false} />
        ))}
      </group>

      {/* branded sign, mounted on the screen bay above eye level */}
      <mesh position={[(screenX0+screenX1)/2, t-0.42, D/2+0.11]}>
        <planeGeometry args={[1.7, 0.44]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>

      <Downpipe x={W/2+0.06} z={-D/2} />

      {/* entrance step, spanning the glazed corner — two treads for a
          finished, grounded look instead of one flat slab */}
      <Box args={[CORNER+0.7, 0.13, 0.5]} position={[-W/2+CORNER*0.42, 0.2, D/2+0.28]} material={whiteLaminate} />
      <Box args={[CORNER+0.9, 0.13, 0.55]} position={[-W/2+CORNER*0.42, 0.07, D/2+0.72]} material={whiteLaminate} />
      <Box args={[0.06, 0.34, 0.5]} position={[-W/2+CORNER*0.42-(CORNER+0.7)/2, 0.155, D/2+0.28]} material={chassis} />
    </group>
  );
}
