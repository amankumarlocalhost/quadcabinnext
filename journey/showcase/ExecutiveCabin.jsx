import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Skid, Downpipe } from './parts.jsx';
import { signTexture, brandingTexture } from '../textures.js';
import {
  steelDark, chassis, roofMetal, woodFloor, drywallDark, ceilingMat,
  walnut, fabricGrey, ledWarm,
} from '../materials.js';

/*
 * ExecutiveCabin — the /products hero showpiece. A modern flagship module
 * that reads nothing like the four showcase cabins: anthracite cassette
 * panels with recessed seams, a warm vertical wood-slat feature bay, a
 * floor-to-ceiling glass front with a furnished interior visible behind it,
 * and a red brand fin at the material junction. All PBR maps (color /
 * normal / roughness) are generated at load so nothing is downloaded.
 */

const W = 7.0, D = 3.2, B = 0.34, T = 3.3;
const GLASS_X0 = -W/2 + 0.12;           // glass bay: left edge…
const GLASS_X1 = W/2 - 2.3;             // …to the wood-slat bay
const SLAT_X0 = GLASS_X1, SLAT_X1 = W/2 - 0.12;

/* ---------- local texture helpers (kept here so shared files stay untouched) */
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

/* anthracite cassette panels — one tile = 1m of wall, recessed seam grooves
   at the edges, a horizontal joint line, brushed-metal micro variation */
function cassetteMaps(){
  const w = 512, h = 1024;
  const color = document.createElement('canvas'); color.width = w; color.height = h;
  {
    const ctx = color.getContext('2d');
    const base = ctx.createLinearGradient(0,0,0,h);
    base.addColorStop(0,'#33373c'); base.addColorStop(0.5,'#2e3237'); base.addColorStop(1,'#2a2e33');
    ctx.fillStyle = base; ctx.fillRect(0,0,w,h);
    // fine vertical brushing
    for(let i=0;i<1400;i++){
      const g = 40 + Math.random()*30;
      ctx.fillStyle = `rgba(${g},${g+3},${g+7},${0.05+Math.random()*0.07})`;
      ctx.fillRect(Math.random()*w, Math.random()*h, 1, 8+Math.random()*40);
    }
    // recessed seams: both vertical edges + one horizontal joint
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0,0,5,h); ctx.fillRect(w-5,0,5,h); ctx.fillRect(0,Math.round(h*0.62),w,5);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(5,0,2,h); ctx.fillRect(w-7,0,2,h); ctx.fillRect(0,Math.round(h*0.62)+5,w,2);
    // faint weather film near the bottom
    const dirt = ctx.createLinearGradient(0,h*0.85,0,h);
    dirt.addColorStop(0,'rgba(15,14,12,0)'); dirt.addColorStop(1,'rgba(15,14,12,0.25)');
    ctx.fillStyle = dirt; ctx.fillRect(0,0,w,h);
  }
  const height = document.createElement('canvas'); height.width = w; height.height = h;
  {
    const ctx = height.getContext('2d');
    ctx.fillStyle = 'rgb(150,150,150)'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'rgb(40,40,40)';
    ctx.fillRect(0,0,6,h); ctx.fillRect(w-6,0,6,h); ctx.fillRect(0,Math.round(h*0.62),w,6);
  }
  const rough = document.createElement('canvas'); rough.width = 256; rough.height = 512;
  {
    const ctx = rough.getContext('2d');
    ctx.fillStyle = '#6e6e6e'; ctx.fillRect(0,0,256,512);
    for(let i=0;i<700;i++){
      const g = 90 + Math.random()*70;
      ctx.fillStyle = `rgba(${g},${g},${g},${0.35*Math.random()})`;
      ctx.fillRect(Math.random()*256, Math.random()*512, 2+Math.random()*4, 2+Math.random()*10);
    }
  }
  return { color: toTex(color), normal: heightToNormal(height, 2.4), rough: toTex(rough, THREE.NoColorSpace) };
}
const cassette = cassetteMaps();
function cassetteMaterial(widthM){
  const map = cassette.color.clone(); map.repeat.set(widthM,1); map.needsUpdate = true;
  const normalMap = cassette.normal.clone(); normalMap.repeat.set(widthM,1); normalMap.needsUpdate = true;
  const roughnessMap = cassette.rough.clone(); roughnessMap.repeat.set(widthM,1); roughnessMap.needsUpdate = true;
  return new THREE.MeshStandardMaterial({
    map, normalMap, normalScale:new THREE.Vector2(1,1), roughnessMap,
    roughness:0.42, metalness:0.6, envMapIntensity:1.05,
  });
}

/* vertical wood slats — one tile = 0.64m, 8 slats with dark shadow gaps */
function slatMaps(){
  const w = 512, h = 1024, SLATS = 8, sw = w/SLATS;
  const color = document.createElement('canvas'); color.width = w; color.height = h;
  {
    const ctx = color.getContext('2d');
    ctx.fillStyle = '#141210'; ctx.fillRect(0,0,w,h);
    for(let i=0;i<SLATS;i++){
      const x = i*sw;
      const tone = 128 + Math.random()*26 - 10;
      const grad = ctx.createLinearGradient(x,0,x+sw,0);
      grad.addColorStop(0, `rgb(${Math.round(tone*0.72)},${Math.round(tone*0.5)},${Math.round(tone*0.32)})`);
      grad.addColorStop(0.5, `rgb(${Math.round(tone)},${Math.round(tone*0.68)},${Math.round(tone*0.44)})`);
      grad.addColorStop(1, `rgb(${Math.round(tone*0.66)},${Math.round(tone*0.46)},${Math.round(tone*0.3)})`);
      ctx.fillStyle = grad; ctx.fillRect(x+3,0,sw-6,h);
      // grain
      ctx.strokeStyle = 'rgba(52,32,16,0.35)';
      for(let g=0; g<7; g++){
        const gx = x + 4 + Math.random()*(sw-8);
        ctx.beginPath(); ctx.moveTo(gx, 0);
        ctx.bezierCurveTo(gx+3*(Math.random()-0.5), h*0.33, gx+3*(Math.random()-0.5), h*0.66, gx, h);
        ctx.stroke();
      }
    }
  }
  const height = document.createElement('canvas'); height.width = w; height.height = h;
  {
    const ctx = height.getContext('2d');
    ctx.fillStyle = 'rgb(55,55,55)'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'rgb(190,190,190)';
    for(let i=0;i<SLATS;i++) ctx.fillRect(i*sw+3,0,sw-6,h);
  }
  const rough = document.createElement('canvas'); rough.width = 256; rough.height = 256;
  {
    const ctx = rough.getContext('2d');
    ctx.fillStyle = '#9a9a9a'; ctx.fillRect(0,0,256,256);
    for(let i=0;i<500;i++){
      const g = 130 + Math.random()*60;
      ctx.fillStyle = `rgba(${g},${g},${g},${0.4*Math.random()})`;
      ctx.fillRect(Math.random()*256, Math.random()*256, 2, 4+Math.random()*10);
    }
  }
  return { color: toTex(color), normal: heightToNormal(height, 2.0), rough: toTex(rough, THREE.NoColorSpace) };
}
const slats = slatMaps();
function slatMaterial(widthM){
  const rep = widthM / 0.64;
  const map = slats.color.clone(); map.repeat.set(rep,1); map.needsUpdate = true;
  const normalMap = slats.normal.clone(); normalMap.repeat.set(rep,1); normalMap.needsUpdate = true;
  const roughnessMap = slats.rough.clone(); roughnessMap.repeat.set(rep,1); roughnessMap.needsUpdate = true;
  return new THREE.MeshStandardMaterial({
    map, normalMap, normalScale:new THREE.Vector2(1.2,1.2), roughnessMap,
    roughness:0.62, metalness:0.05, envMapIntensity:0.7,
  });
}

/* ---------- one-off materials */
const frameBlack = new THREE.MeshStandardMaterial({ color:0x1b1c1f, roughness:0.32, metalness:0.85, envMapIntensity:1.2 });
const redFin = new THREE.MeshPhysicalMaterial({
  color:0xd91820, roughness:0.34, metalness:0.15, envMapIntensity:0.8,
  clearcoat:0.5, clearcoatRoughness:0.35,
});
const heroGlass = new THREE.MeshPhysicalMaterial({
  color:0xbfd6e2, roughness:0.03, metalness:0,
  transparent:true, opacity:0.16, envMapIntensity:1.5,
  reflectivity:0.6, ior:1.5, side:THREE.DoubleSide, depthWrite:false, fog:false,
});
const stepPlate = new THREE.MeshStandardMaterial({ color:0x2c2e32, roughness:0.55, metalness:0.7, envMapIntensity:0.9 });
const ledStrip = new THREE.MeshStandardMaterial({ color:0xfff3dc, emissive:0xffe0ae, emissiveIntensity:2.6, roughness:0.4 });

/* ---------- interior visible through the curtain wall */
function CabinInterior(){
  const brandTex = useMemo(() => brandingTexture(), []);
  const gw = GLASS_X1 - GLASS_X0;                 // interior spans the glass bay
  const cx = (GLASS_X0 + GLASS_X1) / 2;
  return (
    <group>
      {/* floor / ceiling / back + right partition walls */}
      <Box args={[gw+0.5, 0.06, D-0.35]} position={[cx, B+0.05, 0]} material={woodFloor} castShadow={false} />
      <Box args={[gw+0.5, 0.06, D-0.35]} position={[cx, T-0.12, 0]} material={ceilingMat} castShadow={false} />
      <Box args={[gw+0.5, T-B, 0.08]} position={[cx, (B+T)/2, -D/2+0.18]} material={drywallDark} castShadow={false} />
      <Box args={[0.08, T-B, D-0.4]} position={[GLASS_X1+0.2, (B+T)/2, 0]} material={drywallDark} castShadow={false} />

      {/* brand wall panel */}
      <mesh position={[cx-0.4, 1.85, -D/2+0.23]}>
        <planeGeometry args={[1.7, 0.85]} />
        <meshBasicMaterial map={brandTex} toneMapped={false} />
      </mesh>

      {/* meeting table + chairs */}
      <Box args={[2.1, 0.06, 0.9]} position={[cx, 1.06, 0.1]} material={walnut} />
      {[[-0.9,-0.2],[0.9,-0.2],[-0.9,0.4],[0.9,0.4]].map(([x,z])=>(
        <Box key={`${x}:${z}`} args={[0.08, 0.7, 0.08]} position={[cx+x, 0.72, z]} material={frameBlack} />
      ))}
      {[-0.7, 0, 0.7].map(x=>(
        <group key={x}>
          <Box args={[0.42, 0.07, 0.42]} position={[cx+x, 0.82, -0.75]} material={fabricGrey} castShadow={false} />
          <Box args={[0.42, 0.5, 0.07]} position={[cx+x, 1.1, -0.95]} material={fabricGrey} castShadow={false} />
        </group>
      ))}
      {/* credenza along the partition */}
      <Box args={[0.4, 0.62, 1.5]} position={[GLASS_X1-0.1, B+0.4, -0.4]} material={walnut} castShadow={false} />

      {/* pendants + warm fill so the interior glows through the glass */}
      {[-0.7, 0.7].map(x=>(
        <Box key={x} args={[0.26, 0.05, 0.26]} position={[cx+x, T-0.3, 0.1]} material={ledWarm} castShadow={false} />
      ))}
      <pointLight position={[cx, T-0.55, 0.2]} intensity={14} distance={7} decay={2} color={0xffdcae} />
    </group>
  );
}

export default function ExecutiveCabin(){
  const signTex = useMemo(() => signTexture(), []);
  const backMat = useMemo(() => cassetteMaterial(W), []);
  const sideMat = useMemo(() => cassetteMaterial(D), []);
  const slatMat = useMemo(() => slatMaterial(SLAT_X1 - SLAT_X0), []);
  const glassW = GLASS_X1 - GLASS_X0;
  const glassCx = (GLASS_X0 + GLASS_X1) / 2;
  const mullions = 5;

  return (
    <group>
      <Skid width={W} depth={D} pocketAt={[-2.4, 2.4]} />
      {/* adjustable feet */}
      {[-W/2+0.4, W/2-0.4].map(x => [-D/2+0.3, D/2-0.3].map(z => (
        <mesh key={`${x}:${z}`} position={[x, 0.04, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.08, 16]} />
          <primitive object={steelDark} attach="material" />
        </mesh>
      )))}
      {/* thin red chassis accent line */}
      <Box args={[W+0.22, 0.03, D+0.14]} position={[0, 0.27, 0]} material={redFin} castShadow={false} />

      <CabinInterior />

      {/* ---- front curtain wall (glass bay) ---- */}
      <group>
        <Box args={[glassW+0.1, 0.14, 0.16]} position={[glassCx, T-0.07, D/2]} material={frameBlack} />
        <Box args={[glassW+0.1, 0.14, 0.16]} position={[glassCx, B+0.07, D/2]} material={frameBlack} />
        {Array.from({length:mullions+1}).map((_,i)=>{
          const x = GLASS_X0 + (glassW/mullions)*i;
          return <Box key={i} args={[0.07, T-B, 0.13]} position={[x, (B+T)/2, D/2]} material={frameBlack} />;
        })}
        <mesh position={[glassCx, (B+T)/2, D/2-0.02]} renderOrder={2}>
          <planeGeometry args={[glassW-0.05, T-B-0.2]} />
          <primitive object={heroGlass} attach="material" />
        </mesh>
        {/* glass door, second bay from left: slim rail + long pull handle */}
        <Box args={[0.035, T-B-0.24, 0.02]} position={[GLASS_X0 + glassW/mullions, (B+T)/2, D/2+0.035]} material={frameBlack} />
        <mesh position={[GLASS_X0 + glassW/mullions + 0.22, 1.5, D/2+0.07]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.1, 12]} />
          <primitive object={frameBlack} attach="material" />
        </mesh>
      </group>

      {/* ---- red brand fin at the glass / slat junction ---- */}
      <Box args={[0.14, T-B+0.24, 0.3]} position={[GLASS_X1+0.02, (B+T)/2+0.06, D/2-0.02]} material={redFin} />

      {/* ---- wood-slat feature bay ---- */}
      <Box args={[SLAT_X1-SLAT_X0, T-B, 0.14]} position={[(SLAT_X0+SLAT_X1)/2, (B+T)/2, D/2-0.01]} material={slatMat} />
      {/* slim wall light on the slats */}
      <Box args={[0.07, 0.3, 0.07]} position={[(SLAT_X0+SLAT_X1)/2, 2.2, D/2+0.08]} material={ledWarm} castShadow={false} />

      {/* ---- sides + back: anthracite cassette panels ---- */}
      <Box args={[0.13, T-B, D]} position={[-W/2, (B+T)/2, 0]} material={sideMat} />
      <Box args={[0.13, T-B, D]} position={[W/2, (B+T)/2, 0]} material={sideMat} />
      <Box args={[W, T-B, 0.13]} position={[0, (B+T)/2, -D/2]} material={backMat} />
      {/* corner reveals */}
      {[-W/2-0.065, W/2+0.065].map(x=>(
        <Box key={x} args={[0.05, T-B+0.06, D+0.05]} position={[x, (B+T)/2, 0]} material={frameBlack} />
      ))}

      {/* ---- parapet roof with LED soffit ---- */}
      <Box args={[W+0.3, 0.16, D+0.3]} position={[0, T+0.08, 0]} material={roofMetal} />
      <Box args={[W+0.36, 0.26, 0.08]} position={[0, T+0.02, D/2+0.14]} material={frameBlack} />
      <Box args={[W+0.36, 0.26, 0.08]} position={[0, T+0.02, -D/2-0.14]} material={frameBlack} />
      <Box args={[0.08, 0.26, D+0.36]} position={[-W/2-0.14, T+0.02, 0]} material={frameBlack} />
      <Box args={[0.08, 0.26, D+0.36]} position={[W/2+0.14, T+0.02, 0]} material={frameBlack} />
      {/* continuous LED strip under the front eave */}
      <Box args={[glassW-0.2, 0.025, 0.05]} position={[glassCx, T-0.14, D/2+0.1]} material={ledStrip} castShadow={false} />
      {/* recessed downlights across the full front */}
      {[-2.9,-1.6,-0.3,1.0,2.3].map(x=>(
        <Box key={x} args={[0.14,0.03,0.14]} position={[x, T-0.03, D/2+0.16]} material={ledWarm} castShadow={false} />
      ))}

      {/* rooftop HVAC condenser, tucked to the back */}
      <group position={[W/2-1.1, T+0.35, -D/2+0.75]}>
        <Box args={[0.9, 0.42, 0.5]} position={[0,0,0]} material={steelDark} />
        <mesh position={[0, 0.02, 0.26]} rotation={[Math.PI/2,0,0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
          <primitive object={chassis} attach="material" />
        </mesh>
      </group>

      {/* signage above the door bay */}
      <mesh position={[glassCx+0.3, T+0.52, D/2+0.03]}>
        <planeGeometry args={[1.9, 0.48]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>

      <Downpipe x={-W/2-0.08} z={-D/2+0.1} />
      <Downpipe x={W/2+0.08} z={-D/2+0.1} />

      {/* ---- entry: steel step platform + slim railing ---- */}
      <group position={[GLASS_X0 + glassW/mullions + 0.3, 0, D/2+0.62]}>
        <Box args={[2.4, 0.13, 1.0]} position={[0, 0.2, 0]} material={stepPlate} />
        <Box args={[2.4, 0.13, 1.0]} position={[0, 0.07, 0.5]} material={stepPlate} />
        {[-1.15, 1.15].map(x=>(
          <group key={x}>
            {[-0.42, 0.42].map(z=>(
              <mesh key={z} position={[x, 0.62, z]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.75, 10]} />
                <primitive object={frameBlack} attach="material" />
              </mesh>
            ))}
            <mesh position={[x, 1.0, 0]} rotation={[Math.PI/2,0,0]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.9, 10]} />
              <primitive object={frameBlack} attach="material" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
