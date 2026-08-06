import * as THREE from 'three';
import { roofTex, roofNormalTex, roofRoughTex, woodFloorTex, woodFloorRough, rugTex } from './textures.js';

/* subtle micro-roughness noise so flat metal panels don't read as
   perfectly-clean CG plastic — reused (tiled) across the small hardware bits */
function noiseTex(size, base, spread){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = `rgb(${base},${base},${base})`; ctx.fillRect(0,0,size,size);
  for(let i=0;i<size*size*0.4;i++){
    const g = base + (Math.random()-0.5)*spread;
    ctx.fillStyle = `rgba(${g},${g},${g},0.5)`;
    ctx.fillRect(Math.random()*size, Math.random()*size, 1, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6,6);
  return t;
}
const hardwareRough = noiseTex(64, 150, 70);

export const steelDark = new THREE.MeshStandardMaterial({color:0x232326, roughness:0.42, roughnessMap:hardwareRough, metalness:0.7, envMapIntensity:1.05});
/* satin/anodized aluminum — lower metalness than raw chrome so it reads as a
   consistent light silver under any environment, not a mirror that goes
   black whenever it isn't catching a highlight. Tightened roughness + added
   clearcoat gloss so it picks up crisper, more premium highlight streaks
   instead of a soft matte sheen. */
export const aluminum = new THREE.MeshPhysicalMaterial({
  color:0xdadde0, roughness:0.3, roughnessMap:hardwareRough, metalness:0.55, envMapIntensity:1.15,
  clearcoat:0.35, clearcoatRoughness:0.2,
});
export const blackMetal = new THREE.MeshStandardMaterial({color:0x121214, roughness:0.5, roughnessMap:hardwareRough, metalness:0.6, envMapIntensity:0.8});
/* premium automotive-style paint: higher clearcoat + lower clearcoat
   roughness reads as a glossy lacquered finish rather than flat matte paint */
export const redPaint = new THREE.MeshPhysicalMaterial({
  color:0xd91820, roughness:0.28, metalness:0.14, envMapIntensity:1.05,
  clearcoat:0.65, clearcoatRoughness:0.08,
});
export const concrete = new THREE.MeshStandardMaterial({color:0x8f8d88, roughness:0.95, metalness:0, envMapIntensity:0.25});
export const chassis = new THREE.MeshStandardMaterial({color:0x2a2b2f, roughness:0.68, metalness:0.5, envMapIntensity:0.5});
export const roofMetal = new THREE.MeshPhysicalMaterial({
  map:roofTex, normalMap:roofNormalTex, normalScale:new THREE.Vector2(0.7,0.7),
  roughnessMap:roofRoughTex, roughness:0.28, metalness:0.68, envMapIntensity:1.35,
  clearcoat:0.3, clearcoatRoughness:0.25,
});

export const glassMat = new THREE.MeshPhysicalMaterial({
  color:0xdcecf4, roughness:0.02, metalness:0,
  transparent:true, opacity:0.32, envMapIntensity:1.35,
  reflectivity:0.75, ior:1.52, side:THREE.DoubleSide, depthWrite:false, fog:false,
});
export const glassTint = new THREE.MeshPhysicalMaterial({
  color:0xa8cbe0, roughness:0.025, metalness:0,
  transparent:true, opacity:0.26, envMapIntensity:1.3,
  reflectivity:0.7, ior:1.52, side:THREE.DoubleSide, depthWrite:false, fog:false,
});

/* interior */
export const drywall = new THREE.MeshStandardMaterial({color:0xe8e6e1, roughness:0.85, metalness:0, envMapIntensity:0.25});
export const drywallDark = new THREE.MeshStandardMaterial({color:0x202226, roughness:0.85, metalness:0, envMapIntensity:0.25});
export const ceilingMat = new THREE.MeshStandardMaterial({color:0xf1efe9, roughness:0.9, metalness:0, envMapIntensity:0.2});
export const woodFloor = new THREE.MeshStandardMaterial({
  map:woodFloorTex, roughnessMap:woodFloorRough,
  roughness:0.55, metalness:0.05, envMapIntensity:0.6,
});
export const walnut = new THREE.MeshStandardMaterial({color:0x5a3d28, roughness:0.45, metalness:0.05, envMapIntensity:0.6});
export const walnutLight = new THREE.MeshStandardMaterial({color:0x8a6647, roughness:0.5, metalness:0.05, envMapIntensity:0.5});
export const whiteLaminate = new THREE.MeshStandardMaterial({color:0xd8d5cd, roughness:0.5, metalness:0.05, envMapIntensity:0.4});
export const fabricGrey = new THREE.MeshStandardMaterial({color:0x565a61, roughness:0.95, metalness:0, envMapIntensity:0.2});
export const fabricRed = new THREE.MeshStandardMaterial({color:0xb0161d, roughness:0.9, metalness:0, envMapIntensity:0.25});
export const leafGreen = new THREE.MeshStandardMaterial({color:0x2f6b34, roughness:0.8, metalness:0, envMapIntensity:0.3, side:THREE.DoubleSide});
export const potMat = new THREE.MeshStandardMaterial({color:0x2a2b2e, roughness:0.6, metalness:0.2, envMapIntensity:0.4});
export const rugMat = new THREE.MeshStandardMaterial({map:rugTex, roughness:0.95, metalness:0, envMapIntensity:0.15});

/* emissives */
export const ledWarm = new THREE.MeshStandardMaterial({color:0xfff1d8, emissive:0xffdba4, emissiveIntensity:1.7, roughness:0.4});
export const ledWhite = new THREE.MeshStandardMaterial({color:0xffffff, emissive:0xf4f1e8, emissiveIntensity:1.8, roughness:0.4});
export const ledRed = new THREE.MeshStandardMaterial({color:0xff2a30, emissive:0xe11b23, emissiveIntensity:2.0, roughness:0.4});
