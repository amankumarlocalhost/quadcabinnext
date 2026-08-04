import * as THREE from 'three';

function makeTex(w, h, draw, colorSpace = THREE.SRGBColorSpace){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = colorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  return t;
}

function speckle(ctx, w, h, n, alpha){
  for(let i=0;i<n;i++){
    const g = 20 + Math.random()*60;
    ctx.fillStyle = `rgba(${g},${g},${g},${alpha*Math.random()})`;
    ctx.fillRect(Math.random()*w, Math.random()*h, 1+Math.random()*2, 1+Math.random()*2);
  }
}

/* derive a tangent-space normal map from a greyscale height canvas (Sobel) */
function heightToNormalMap(heightCanvas, strength = 1.4){
  const w = heightCanvas.width, h = heightCanvas.height;
  const hctx = heightCanvas.getContext('2d');
  const src = hctx.getImageData(0,0,w,h).data;
  const lum = (x,y)=>{
    const xi = (x+w)%w, yi = (y+h)%h; // wrap so tiling stays seamless
    const i = (yi*w+xi)*4;
    return src[i]/255;
  };
  const out = document.createElement('canvas'); out.width = w; out.height = h;
  const octx = out.getContext('2d');
  const img = octx.createImageData(w,h);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const tl=lum(x-1,y-1), t=lum(x,y-1), tr=lum(x+1,y-1);
      const l=lum(x-1,y),           r=lum(x+1,y);
      const bl=lum(x-1,y+1), b=lum(x,y+1), br=lum(x+1,y+1);
      const dx = (tr+2*r+br) - (tl+2*l+bl);
      const dy = (bl+2*b+br) - (tl+2*t+tr);
      let nx = -dx*strength, ny = -dy*strength, nz = 1;
      const len = Math.sqrt(nx*nx+ny*ny+nz*nz);
      nx/=len; ny/=len; nz/=len;
      const i = (y*w+x)*4;
      img.data[i]   = (nx*0.5+0.5)*255;
      img.data[i+1] = (ny*0.5+0.5)*255;
      img.data[i+2] = (nz*0.5+0.5)*255;
      img.data[i+3] = 255;
    }
  }
  octx.putImageData(img,0,0);
  const t = new THREE.CanvasTexture(out);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  return t;
}

/* ---- corrugated sandwich panel, one tile = 1m of wall ---- */
const RIBS = 8;
export const wallColorTex = makeTex(1024, 2048, (ctx,w,h)=>{
  // slightly uneven base coat
  const base = ctx.createLinearGradient(0,0,0,h);
  base.addColorStop(0,'#edebe7');
  base.addColorStop(0.5,'#e9e7e2');
  base.addColorStop(1,'#e6e4de');
  ctx.fillStyle = base; ctx.fillRect(0,0,w,h);
  const rw = w/RIBS;
  for(let i=0;i<RIBS;i++){
    const x = i*rw;
    const grad = ctx.createLinearGradient(x,0,x+rw,0);
    grad.addColorStop(0,'rgba(0,0,0,0.12)');
    grad.addColorStop(0.18,'rgba(0,0,0,0.03)');
    grad.addColorStop(0.38,'rgba(255,255,255,0.09)');
    grad.addColorStop(0.62,'rgba(255,255,255,0.09)');
    grad.addColorStop(0.82,'rgba(0,0,0,0.04)');
    grad.addColorStop(1,'rgba(0,0,0,0.14)');
    ctx.fillStyle = grad; ctx.fillRect(x,0,rw,h);
  }
  // panel joint at tile edges
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0,0,3,h); ctx.fillRect(w-3,0,3,h);
  // faint vertical weather streaks
  for(let i=0;i<26;i++){
    const x = Math.random()*w, y0 = Math.random()*h*0.4, len = h*(0.15+Math.random()*0.4);
    const streak = ctx.createLinearGradient(0,y0,0,y0+len);
    streak.addColorStop(0,'rgba(90,85,75,0)');
    streak.addColorStop(0.5,`rgba(90,85,75,${0.03+Math.random()*0.05})`);
    streak.addColorStop(1,'rgba(90,85,75,0)');
    ctx.fillStyle = streak; ctx.fillRect(x,y0,1.5+Math.random()*2,len);
  }
  // fastener heads along top and bottom rails
  ctx.fillStyle = 'rgba(60,60,62,0.55)';
  for(let i=0;i<RIBS;i++){
    const x = i*rw + rw/2;
    ctx.beginPath(); ctx.arc(x, 26, 3.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, h-26, 3.5, 0, Math.PI*2); ctx.fill();
  }
  // rust bleed under each fastener head, running down with gravity
  ctx.fillStyle = 'rgba(120,60,25,1)';
  for(let i=0;i<RIBS;i++){
    const x = i*rw + rw/2;
    if(Math.random() > 0.55){
      const rl = 30 + Math.random()*90;
      const streak = ctx.createLinearGradient(0,26,0,26+rl);
      streak.addColorStop(0,`rgba(130,66,26,${0.25+Math.random()*0.2})`);
      streak.addColorStop(1,'rgba(130,66,26,0)');
      ctx.fillStyle = streak; ctx.fillRect(x-2.5,26,5,rl);
    }
    if(Math.random() > 0.6){
      const rl = 20 + Math.random()*60;
      const streak = ctx.createLinearGradient(0,h-26,0,h-26+rl);
      streak.addColorStop(0,`rgba(130,66,26,${0.2+Math.random()*0.18})`);
      streak.addColorStop(1,'rgba(130,66,26,0)');
      ctx.fillStyle = streak; ctx.fillRect(x-2.5,h-26,5,rl);
    }
  }
  // scattered paint chips / dings revealing dull metal underneath
  for(let i=0;i<10;i++){
    const x = Math.random()*w, y = h*0.3+Math.random()*h*0.65, r = 1.5+Math.random()*3;
    ctx.fillStyle = 'rgba(150,150,148,0.6)';
    ctx.beginPath(); ctx.ellipse(x,y,r,r*0.6,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(70,68,64,0.4)';
    ctx.beginPath(); ctx.ellipse(x+0.6,y+0.6,r*0.7,r*0.4,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
  }
  // grime gradient near the bottom
  const dirt = ctx.createLinearGradient(0,h*0.82,0,h);
  dirt.addColorStop(0,'rgba(60,55,45,0)');
  dirt.addColorStop(1,'rgba(60,55,45,0.18)');
  ctx.fillStyle = dirt; ctx.fillRect(0,0,w,h);
  speckle(ctx,w,h,600,0.06);
});
export const wallBumpTex = makeTex(512, 4, (ctx,w,h)=>{
  const rw = w/RIBS;
  for(let x=0;x<w;x++){
    const v = Math.round(128 + 110*Math.sin((x/rw)*Math.PI*2));
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x,0,1,h);
  }
}, THREE.NoColorSpace);
/* height profile (ribs + rivets) rendered at real aspect so the derived
   normal map carries correct slope in both directions, not just across ribs */
const wallHeightCanvas = document.createElement('canvas');
wallHeightCanvas.width = 1024; wallHeightCanvas.height = 1024;
(()=>{
  const ctx = wallHeightCanvas.getContext('2d');
  const rw = 1024/RIBS;
  for(let x=0;x<1024;x++){
    const v = Math.round(128 + 108*Math.sin((x/rw)*Math.PI*2));
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x,0,1,1024);
  }
  // fastener dimples read as small height pits
  ctx.fillStyle = 'rgb(70,70,70)';
  for(let i=0;i<RIBS;i++){
    const x = i*rw + rw/2;
    ctx.beginPath(); ctx.arc(x,52,8,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x,1024-52,8,0,Math.PI*2); ctx.fill();
  }
})();
export const wallNormalTex = heightToNormalMap(wallHeightCanvas, 2.2);
// roughness variation so highlights break up like painted steel
export const wallRoughTex = makeTex(512, 1024, (ctx,w,h)=>{
  ctx.fillStyle = '#8c8c8c'; ctx.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){
    const g = 110 + Math.random()*60;
    ctx.fillStyle = `rgba(${g},${g},${g},${0.4*Math.random()})`;
    ctx.fillRect(Math.random()*w, Math.random()*h, 2+Math.random()*5, 2+Math.random()*8);
  }
  const dirt = ctx.createLinearGradient(0,h*0.8,0,h);
  dirt.addColorStop(0,'rgba(200,200,200,0)');
  dirt.addColorStop(1,'rgba(200,200,200,0.5)');
  ctx.fillStyle = dirt; ctx.fillRect(0,0,w,h);
}, THREE.NoColorSpace);

export function corrugatedMaterial(widthM){
  const map = wallColorTex.clone(); map.repeat.set(widthM,1); map.needsUpdate = true;
  const normal = wallNormalTex.clone(); normal.repeat.set(widthM,1); normal.needsUpdate = true;
  const rough = wallRoughTex.clone(); rough.repeat.set(widthM,1); rough.needsUpdate = true;
  return new THREE.MeshPhysicalMaterial({
    map, normalMap:normal, normalScale:new THREE.Vector2(0.85,0.85), roughnessMap:rough,
    roughness:0.42, metalness:0.28, envMapIntensity:1.0,
    clearcoat:0.25, clearcoatRoughness:0.35,
  });
}

/* ---- luxury wooden flooring, one tile = 2m x 2m ---- */
export const woodFloorTex = makeTex(512, 512, (ctx,w,h)=>{
  const plankH = h/8;
  for(let r=0;r<8;r++){
    const y = r*plankH;
    const offset = (r%2)*w*0.33;
    const base = 118 + (r%3)*8;
    for(let seg=0;seg<3;seg++){
      const x0 = ((seg*w/3 + offset) % w);
      const tone = base + Math.random()*14 - 7;
      ctx.fillStyle = `rgb(${tone},${Math.round(tone*0.66)},${Math.round(tone*0.42)})`;
      ctx.fillRect(x0- w, y, w/3, plankH);
      ctx.fillRect(x0, y, w/3, plankH);
      // seams
      ctx.fillStyle = 'rgba(20,12,6,0.8)';
      ctx.fillRect(x0, y, 2, plankH);
    }
    ctx.fillStyle = 'rgba(20,12,6,0.9)';
    ctx.fillRect(0, y, w, 2);
    // grain
    ctx.strokeStyle = 'rgba(60,35,15,0.25)';
    for(let i=0;i<10;i++){
      ctx.beginPath();
      const gy = y + Math.random()*plankH;
      ctx.moveTo(0,gy);
      ctx.bezierCurveTo(w*0.3, gy+4*(Math.random()-0.5), w*0.6, gy+4*(Math.random()-0.5), w, gy);
      ctx.stroke();
    }
  }
});
woodFloorTex.repeat.set(3.5, 2.2);

export const woodFloorRough = makeTex(256, 256, (ctx,w,h)=>{
  ctx.fillStyle = '#5a5a5a'; ctx.fillRect(0,0,w,h);
  speckle(ctx,w,h,600,0.25);
}, THREE.NoColorSpace);
woodFloorRough.repeat.set(3.5, 2.2);

/* ---- roof standing seams ---- */
const ROOF_SEAMS = 8;
export const roofTex = makeTex(1024, 512, (ctx,w,h)=>{
  // light galvanized-silver standing-seam finish, not charcoal
  const base = ctx.createLinearGradient(0,0,0,h);
  base.addColorStop(0,'#c9ccd0'); base.addColorStop(1,'#bcbfc4');
  ctx.fillStyle = base; ctx.fillRect(0,0,w,h);
  for(let i=0;i<ROOF_SEAMS;i++){
    const x = i*(w/ROOF_SEAMS);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x,0,5,h);
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.fillRect(x+5,0,4,h);
  }
  // faint weather streaking running down from the ridge
  for(let i=0;i<22;i++){
    const x = Math.random()*w, y0 = 0, len = h*(0.3+Math.random()*0.6);
    const streak = ctx.createLinearGradient(0,y0,0,y0+len);
    streak.addColorStop(0,'rgba(120,120,118,0.14)');
    streak.addColorStop(1,'rgba(120,120,118,0)');
    ctx.fillStyle = streak; ctx.fillRect(x,y0,1.5+Math.random()*2.5,len);
  }
  speckle(ctx,w,h,500,0.06);
});
const roofHeightCanvas = document.createElement('canvas');
roofHeightCanvas.width = 1024; roofHeightCanvas.height = 512;
(()=>{
  const ctx = roofHeightCanvas.getContext('2d');
  ctx.fillStyle = 'rgb(128,128,128)'; ctx.fillRect(0,0,1024,512);
  const sw = 1024/ROOF_SEAMS;
  for(let i=0;i<ROOF_SEAMS;i++){
    const x = i*sw;
    ctx.fillStyle = 'rgb(210,210,210)'; ctx.fillRect(x,0,6,512);
    ctx.fillStyle = 'rgb(70,70,70)'; ctx.fillRect(x+6,0,4,512);
  }
})();
export const roofNormalTex = heightToNormalMap(roofHeightCanvas, 1.6);
export const roofRoughTex = makeTex(512, 256, (ctx,w,h)=>{
  ctx.fillStyle = '#8a8a8a'; ctx.fillRect(0,0,w,h);
  speckle(ctx,w,h,500,0.3);
}, THREE.NoColorSpace);

/* draws once immediately, then redraws when webfonts finish loading so the
   Anton wordmark renders crisp instead of the fallback font */
function makeFontTex(w, h, draw){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  const render = ()=>{ ctx.clearRect(0,0,w,h); draw(ctx,w,h); t.needsUpdate = true; };
  render();
  if(document.fonts?.ready) document.fonts.ready.then(render).catch(()=>{});
  return t;
}

/* the Quad Cabins mark: red square with clipped corner + black Q shape,
   drawn in 100x100 logo units, scaled by s */
function drawLogoMark(ctx, x, y, s){
  const poly = (pts, fill)=>{
    ctx.beginPath();
    pts.forEach(([px,py],i)=> i===0 ? ctx.moveTo(x+px*s, y+py*s) : ctx.lineTo(x+px*s, y+py*s));
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  };
  poly([[0,0],[62,0],[86,24],[86,86],[0,86]], '#e11b23');
  poly([[24,28],[58,28],[58,48],[90,94],[63,94],[51,68],[24,68]], '#0a0a0b');
}

/* ---- exterior signage ---- */
const signLogoImg = new Image();
signLogoImg.src = '/images/QC_Logo_on_White (1).png';
let signLogoBBox = null;

/* the source PNG has a lot of empty white margin around the mark itself;
   find the tight bounding box of the actual artwork so it can fill the sign */
function getContentBBox(img){
  const oc = document.createElement('canvas'); oc.width = img.naturalWidth; oc.height = img.naturalHeight;
  const octx = oc.getContext('2d');
  octx.drawImage(img, 0, 0);
  const { data } = octx.getImageData(0, 0, oc.width, oc.height);
  let minX = oc.width, minY = oc.height, maxX = 0, maxY = 0;
  for(let y=0; y<oc.height; y++){
    for(let x=0; x<oc.width; x++){
      const i = (y*oc.width + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
      const isBg = a < 10 || (r > 245 && g > 245 && b > 245);
      if(!isBg){
        if(x < minX) minX = x; if(x > maxX) maxX = x;
        if(y < minY) minY = y; if(y > maxY) maxY = y;
      }
    }
  }
  if(maxX < minX || maxY < minY) return { x:0, y:0, w:oc.width, h:oc.height };
  return { x:minX, y:minY, w:maxX-minX+1, h:maxY-minY+1 };
}

export function signTexture(){
  const w = 2048, h = 576;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;

  const draw = ()=>{
    ctx.clearRect(0,0,w,h);
    ctx.setTransform(2,0,0,2,0,0); // draw at 2x for a sharper sign up close
    ctx.fillStyle = '#f7f7f5'; ctx.fillRect(0,0,1024,288);
    ctx.strokeStyle = '#c9c9c4'; ctx.lineWidth = 6; ctx.strokeRect(3,3,1018,282);

    if(signLogoImg.complete && signLogoImg.naturalWidth && signLogoBBox){
      const { x:sx, y:sy, w:sw, h:sh } = signLogoBBox;
      const maxW = 860, maxH = 210;
      const scale = Math.min(maxW/sw, maxH/sh);
      const dw = sw*scale, dh = sh*scale;
      ctx.drawImage(signLogoImg, sx, sy, sw, sh, 60, 24 + (maxH-dh)/2, dw, dh);
    } else {
      drawLogoMark(ctx, 52, 44, 2.05);
      ctx.fillStyle = '#0a0a0b';
      ctx.font = "96px 'Anton', Impact, 'Arial Black', sans-serif";
      ctx.textBaseline='middle';
      ctx.fillText('QUAD CABINS', 300, 128);
    }

    ctx.font = "600 34px Arial, sans-serif";
    ctx.fillStyle = '#66665f';
    ctx.fillText('PORTABLE  ·  MODULAR  ·  ON-SITE', 62, 260);
    t.needsUpdate = true;
  };

  if(signLogoImg.complete && signLogoImg.naturalWidth && !signLogoBBox){
    signLogoBBox = getContentBBox(signLogoImg);
  }
  draw();
  if(!signLogoImg.complete || !signLogoBBox){
    signLogoImg.addEventListener('load', ()=>{ signLogoBBox = getContentBBox(signLogoImg); draw(); }, { once:true });
  }
  if(document.fonts?.ready) document.fonts.ready.then(draw).catch(()=>{});
  return t;
}

/* ---- interior wall branding ---- */
export function brandingTexture(){
  return makeFontTex(1024, 512, (ctx,w,h)=>{
    ctx.fillStyle = '#17181a'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#e11b23'; ctx.fillRect(60,140,26,26);
    ctx.fillStyle = '#f3f2ee';
    ctx.font = "110px 'Anton', Impact, 'Arial Black', sans-serif";
    ctx.textBaseline = 'top';
    ctx.fillText('QUAD', 60, 190);
    ctx.fillText('CABINS', 60, 300);
    ctx.fillStyle = '#8b8f94';
    ctx.font = "500 30px 'JetBrains Mono', monospace";
    ctx.fillText('SMART SPACES. STRONGER PROJECTS.', 62, 436);
    ctx.fillStyle = '#e11b23'; ctx.fillRect(60, 420, 420, 3);
  });
}

/* ---- animated screen (laptop / reception monitor) ---- */
export function makeScreen(){
  const c = document.createElement('canvas'); c.width = 256; c.height = 160;
  const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  let tick = 0;
  function draw(){
    tick++;
    ctx.fillStyle = '#0c0f14'; ctx.fillRect(0,0,256,160);
    ctx.fillStyle = '#12161d'; ctx.fillRect(0,0,256,24);
    ctx.fillStyle = '#e11b23'; ctx.fillRect(10,8,8,8);
    ctx.fillStyle = '#3a4150';
    ctx.fillRect(28,10,60,5);
    // fake dashboard bars, drift over time
    for(let i=0;i<6;i++){
      const hgt = 30 + 55*Math.abs(Math.sin(tick*0.4 + i*1.3));
      ctx.fillStyle = i===2 ? '#e11b23' : '#2d6cdf';
      ctx.fillRect(18 + i*30, 140 - hgt, 18, hgt);
    }
    // text lines
    ctx.fillStyle = '#242a35';
    for(let i=0;i<3;i++) ctx.fillRect(150, 40+i*16, 90 - (i*17)%40, 6);
    // blinking cursor
    if(tick % 2 === 0){ ctx.fillStyle = '#e6e6e6'; ctx.fillRect(150, 92, 8, 10); }
    tex.needsUpdate = true;
  }
  draw();
  return { tex, draw };
}

/* ---- soft radial glow sprite (steam / dust / rays) ---- */
export const glowTex = makeTex(128, 128, (ctx,w,h)=>{
  const g = ctx.createRadialGradient(w/2,h/2,2, w/2,h/2,w/2);
  g.addColorStop(0,'rgba(255,255,255,0.9)');
  g.addColorStop(0.4,'rgba(255,255,255,0.28)');
  g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
});

/* ---- vertical light-ray gradient ---- */
export const rayTex = makeTex(128, 256, (ctx,w,h)=>{
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'rgba(255,244,224,0.55)');
  g.addColorStop(0.6,'rgba(255,244,224,0.12)');
  g.addColorStop(1,'rgba(255,244,224,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  // soften the sides
  const side = ctx.createLinearGradient(0,0,w,0);
  side.addColorStop(0,'rgba(5,5,5,1)');
  side.addColorStop(0.25,'rgba(5,5,5,0)');
  side.addColorStop(0.75,'rgba(5,5,5,0)');
  side.addColorStop(1,'rgba(5,5,5,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = side; ctx.fillRect(0,0,w,h);
});

/* ---- rug ---- */
export const rugTex = makeTex(256, 256, (ctx,w,h)=>{
  ctx.fillStyle = '#26282c'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = '#3a3d43'; ctx.lineWidth = 10; ctx.strokeRect(14,14,w-28,h-28);
  ctx.strokeStyle = '#e11b23'; ctx.lineWidth = 3; ctx.strokeRect(30,30,w-60,h-60);
  speckle(ctx,w,h,900,0.12);
});
