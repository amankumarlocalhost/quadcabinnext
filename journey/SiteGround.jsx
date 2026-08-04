import { useMemo } from 'react';
import * as THREE from 'three';

/*
 * Construction-site terrain: compacted gravel + crushed stone with tire ruts,
 * dirt patches and dust. Fully procedural PBR (color/bump/roughness), gentle
 * height undulation that stays flat under the cabin, and instanced 3D stones.
 * Used by both the hero walkthrough and the Site Office showcase.
 */

function canvas(w, h){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}
function tex(c, colorSpace = THREE.SRGBColorSpace){
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = colorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

/* one tile = ~3m of compacted gravel */
function makeGravelMaps(){
  const S = 1024;
  const [cc, ctx] = canvas(S, S);
  const [bc, bctx] = canvas(S, S);

  // --- color: compacted earth base with tonal patches ---
  ctx.fillStyle = '#474239'; ctx.fillRect(0,0,S,S);
  bctx.fillStyle = '#787878'; bctx.fillRect(0,0,S,S);

  for(let i=0;i<14;i++){
    const x = Math.random()*S, y = Math.random()*S, r = 120+Math.random()*260;
    const warm = Math.random() > 0.5;
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0, warm ? 'rgba(86,72,55,0.28)' : 'rgba(78,78,80,0.25)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    // matching gentle mound in the height map
    const bg = bctx.createRadialGradient(x,y,0,x,y,r);
    bg.addColorStop(0, `rgba(${warm?150:110},${warm?150:110},${warm?150:110},0.2)`);
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    bctx.fillStyle = bg; bctx.beginPath(); bctx.arc(x,y,r,0,Math.PI*2); bctx.fill();
  }

  // --- crushed stone: thousands of shaded chips ---
  for(let i=0;i<5200;i++){
    const x = Math.random()*S, y = Math.random()*S;
    const r = 1 + Math.random()*3.2;
    const lum = 70 + Math.random()*80;
    const warmth = Math.random()*14;
    const rot = Math.random()*Math.PI;
    // shadow under the chip
    ctx.fillStyle = 'rgba(18,16,13,0.55)';
    ctx.beginPath(); ctx.ellipse(x+0.9, y+1.2, r*1.05, r*0.75, rot, 0, Math.PI*2); ctx.fill();
    // the chip
    ctx.fillStyle = `rgb(${Math.round(lum+warmth)},${Math.round(lum+warmth*0.6)},${Math.round(lum)})`;
    ctx.beginPath(); ctx.ellipse(x, y, r, r*0.72, rot, 0, Math.PI*2); ctx.fill();
    // top-left highlight
    ctx.fillStyle = `rgba(255,250,240,${0.05+Math.random()*0.08})`;
    ctx.beginPath(); ctx.ellipse(x-r*0.25, y-r*0.28, r*0.5, r*0.34, rot, 0, Math.PI*2); ctx.fill();
    // height: bright dot per stone
    const bl = 150 + Math.random()*105;
    bctx.fillStyle = `rgb(${bl},${bl},${bl})`;
    bctx.beginPath(); bctx.ellipse(x, y, r, r*0.72, rot, 0, Math.PI*2); bctx.fill();
  }
  // a few larger fist-size rocks in the mix
  for(let i=0;i<90;i++){
    const x = Math.random()*S, y = Math.random()*S, r = 4+Math.random()*4.5;
    const lum = 85+Math.random()*60, rot = Math.random()*Math.PI;
    ctx.fillStyle = 'rgba(15,13,11,0.6)';
    ctx.beginPath(); ctx.ellipse(x+1.6, y+2, r*1.08, r*0.8, rot, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = `rgb(${lum+10},${lum+5},${lum-4})`;
    ctx.beginPath(); ctx.ellipse(x, y, r, r*0.78, rot, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,238,0.11)';
    ctx.beginPath(); ctx.ellipse(x-r*0.3, y-r*0.3, r*0.5, r*0.36, rot, 0, Math.PI*2); ctx.fill();
    bctx.fillStyle = 'rgb(235,235,235)';
    bctx.beginPath(); bctx.ellipse(x, y, r, r*0.78, rot, 0, Math.PI*2); bctx.fill();
  }
  // concrete-dust film
  for(let i=0;i<2400;i++){
    const g = 140+Math.random()*70;
    ctx.fillStyle = `rgba(${g},${g},${g-6},${0.05*Math.random()})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1+Math.random()*3, 1+Math.random()*3);
  }

  // --- roughness: very rough, broken up ---
  const [rc, rctx] = canvas(256, 256);
  rctx.fillStyle = '#e8e8e8'; rctx.fillRect(0,0,256,256);
  for(let i=0;i<700;i++){
    const g = 190+Math.random()*60;
    rctx.fillStyle = `rgba(${g},${g},${g},${0.5*Math.random()})`;
    rctx.fillRect(Math.random()*256, Math.random()*256, 2+Math.random()*5, 2+Math.random()*5);
  }

  return {
    map: tex(cc),
    bump: tex(bc, THREE.NoColorSpace),
    rough: tex(rc, THREE.NoColorSpace),
  };
}

/* non-repeating 34m overlay: tire ruts, dirt patches, dust halo, edge fade */
function makeOverlay(){
  const S = 1024;                 // 34m → ~30px per metre
  const M = S/34;                 // px per metre
  const [c, ctx] = canvas(S, S);
  const cx = S/2, cz = S/2;       // cabin at the centre

  ctx.clearRect(0,0,S,S);

  // broad dirt patches
  for(let i=0;i<9;i++){
    const x = Math.random()*S, y = Math.random()*S, r = 60+Math.random()*150;
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba(52,42,30,0.30)');
    g.addColorStop(1,'rgba(52,42,30,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  // pale concrete-dust wash around the cabin entrance side
  const dust = ctx.createRadialGradient(cx-3*M, cz+4*M, 0, cx-3*M, cz+4*M, 8*M);
  dust.addColorStop(0,'rgba(190,185,172,0.16)');
  dust.addColorStop(1,'rgba(190,185,172,0)');
  ctx.fillStyle = dust; ctx.beginPath(); ctx.arc(cx-3*M, cz+4*M, 8*M, 0, Math.PI*2); ctx.fill();

  // tire ruts: a pair of curved tracks sweeping toward the cabin front
  function track(points, width){
    for(const offset of [-0.8*M, 0.8*M]){
      ctx.strokeStyle = 'rgba(16,14,12,0.5)';
      ctx.lineWidth = width; ctx.lineCap = 'round';
      ctx.beginPath();
      points.forEach(([x,y],i)=>{
        const px = x + offset, py = y;
        i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
      });
      ctx.stroke();
      // faint compacted centre line
      ctx.strokeStyle = 'rgba(70,64,55,0.35)';
      ctx.lineWidth = width*0.45;
      ctx.stroke();
    }
    // tread dashes
    ctx.strokeStyle = 'rgba(12,11,9,0.4)';
    ctx.lineWidth = 2;
    points.forEach(([x,y],i)=>{
      if(i%2) return;
      for(const offset of [-0.8*M, 0.8*M]){
        ctx.beginPath();
        ctx.moveTo(x+offset-width*0.45, y);
        ctx.lineTo(x+offset+width*0.45, y+3);
        ctx.stroke();
      }
    });
  }
  // curve arriving from bottom-right toward the cabin front (door side is -x, +z)
  const curve1 = [];
  for(let i=0;i<=22;i++){
    const u = i/22;
    curve1.push([ cx + (10 - 14*u*u)*M, cz + (15 - 9.5*u)*M ]);
  }
  track(curve1, 0.42*M);
  // a straighter older pass along the front of the cabin
  const curve2 = [];
  for(let i=0;i<=20;i++){
    const u = i/20;
    curve2.push([ cx + (-14 + 26*u)*M, cz + (6.4 + Math.sin(u*5)*0.5)*M ]);
  }
  track(curve2, 0.38*M);

  // scuffed foot-traffic wear in front of the steps
  const wear = ctx.createRadialGradient(cx-6.5*M, cz+8.5*M, 0, cx-6.5*M, cz+8.5*M, 2.6*M);
  wear.addColorStop(0,'rgba(30,26,21,0.35)');
  wear.addColorStop(1,'rgba(30,26,21,0)');
  ctx.fillStyle = wear; ctx.beginPath(); ctx.arc(cx-6.5*M, cz+8.5*M, 2.6*M, 0, Math.PI*2); ctx.fill();

  // darken toward the overlay edge so the site melts into the black backdrop
  const fade = ctx.createRadialGradient(cx,cz, 9*M, cx,cz, 16.6*M);
  fade.addColorStop(0,'rgba(5,5,5,0)');
  fade.addColorStop(1,'rgba(5,5,5,0.9)');
  ctx.fillStyle = fade; ctx.fillRect(0,0,S,S);

  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/* undulating plane, flat under the cabin so nothing clips the chassis/steps */
function makeTerrain(){
  const g = new THREE.PlaneGeometry(90, 90, 72, 72);
  const pos = g.attributes.position;
  for(let i=0;i<pos.count;i++){
    const x = pos.getX(i), y = pos.getY(i);       // plane space; y maps to -z after rotation
    const r = Math.hypot(x, y);
    const flat = THREE.MathUtils.smoothstep(r, 4.8, 9);   // 0 near cabin → 1 in the open
    const n =
      Math.sin(x*0.34 + 1.7) * Math.cos(y*0.27 + 0.4) +
      0.55 * Math.sin(x*0.85 + 3.1) * Math.sin(y*0.7 + 2.2) +
      0.3 * Math.sin(x*1.9) * Math.cos(y*1.6 + 1.1);
    pos.setZ(i, n * 0.085 * flat);
  }
  g.computeVertexNormals();
  return g;
}

/* scattered loose rocks (instanced) — kept clear of the cabin and entrance */
function Rocks({ count = 130 }){
  const { geometry, material, matrices, colors } = useMemo(()=>{
    const geometry = new THREE.DodecahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({ roughness:0.92, metalness:0.02, envMapIntensity:0.25 });
    const matrices = [];
    const colors = [];
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    let placed = 0, guard = 0;
    while(placed < count && guard++ < count*30){
      const ang = Math.random()*Math.PI*2;
      const rad = 5 + Math.pow(Math.random(), 1.4)*13;
      const x = Math.cos(ang)*rad, z = Math.sin(ang)*rad;
      if(Math.abs(x) < 4.6 && Math.abs(z) < 3.4) continue;            // cabin footprint
      if(x > -3.6 && x < -0.6 && z > 2.2 && z < 4.6) continue;        // entrance path
      const s = 0.035 + Math.pow(Math.random(), 2)*0.11;
      dummy.position.set(x, s*0.55, z);
      dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      dummy.scale.set(s*(0.7+Math.random()*0.7), s*(0.5+Math.random()*0.5), s*(0.7+Math.random()*0.7));
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      colors.push(col.setHSL(0.09, 0.05+Math.random()*0.08, 0.24+Math.random()*0.22).clone());
      placed++;
    }
    return { geometry, material, matrices, colors };
  }, [count]);

  return (
    <instancedMesh
      args={[geometry, material, matrices.length]}
      castShadow
      ref={(m)=>{
        if(!m) return;
        matrices.forEach((mat,i)=>m.setMatrixAt(i, mat));
        colors.forEach((c,i)=>m.setColorAt(i, c));
        m.instanceMatrix.needsUpdate = true;
        if(m.instanceColor) m.instanceColor.needsUpdate = true;
      }}
    />
  );
}

export default function SiteGround(){
  const { maps, overlayTex, terrain } = useMemo(()=>{
    const maps = makeGravelMaps();
    maps.map.repeat.set(11,11);
    maps.bump.repeat.set(11,11);
    maps.rough.repeat.set(11,11);
    return { maps, overlayTex: makeOverlay(), terrain: makeTerrain() };
  }, []);

  return (
    <group>
      {/* compacted gravel terrain */}
      <mesh geometry={terrain} rotation={[-Math.PI/2,0,0]} receiveShadow>
        <meshStandardMaterial
          map={maps.map}
          bumpMap={maps.bump}
          bumpScale={0.045}
          roughnessMap={maps.rough}
          roughness={0.96}
          metalness={0.02}
          envMapIntensity={0.22}
        />
      </mesh>
      {/* non-repeating wear layer: tire ruts, dirt, dust, edge fade */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.012,0]} receiveShadow>
        <planeGeometry args={[34,34]} />
        <meshStandardMaterial
          map={overlayTex}
          transparent
          depthWrite={false}
          roughness={1}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      <Rocks />
    </group>
  );
}
