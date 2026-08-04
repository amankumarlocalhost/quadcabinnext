import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { journey, mapRange } from './scrollState.js';
import { corrugatedMaterial, signTexture } from './textures.js';
import {
  steelDark, aluminum, redPaint, concrete, chassis, roofMetal,
  glassMat, glassTint, blackMetal, ledWarm, whiteLaminate,
} from './materials.js';

/*
 * World layout (metres):
 *   ground y=0 · cabin footprint x ±3.6, z ±2.3 · walls y 0.35→3.35
 *   door opening x −2.71→−1.69 on the front wall (+z)
 *   windows W1 x 0.2→1.9 and W2 x 2.35→3.25, y 1.25→2.65
 */
export const CABIN = {
  wallB: 0.35, wallT: 3.35,
  door: { x0:-2.71, x1:-1.69, y0:0.35, y1:2.55 },
  w1: { x0:0.2, x1:1.9, y0:1.25, y1:2.65 },
  w2: { x0:2.35, x1:3.25, y0:1.25, y1:2.65 },
};

function Box({ args, position, material, rotation, castShadow=true, receiveShadow=true }){
  return (
    <mesh args={undefined} position={position} rotation={rotation} castShadow={castShadow} receiveShadow={receiveShadow} material={material}>
      <boxGeometry args={args} />
    </mesh>
  );
}

/* corrugated wall segment on the front/back wall (spans x, fixed z) */
function SegX({ x0, x1, y0, y1, z, thick=0.12 }){
  const w = x1-x0, h = y1-y0;
  const mat = useMemo(()=>corrugatedMaterial(w), [w]);
  return <Box args={[w,h,thick]} position={[(x0+x1)/2,(y0+y1)/2,z]} material={mat} />;
}
/* corrugated wall segment on side walls (spans z, fixed x) */
function SegZ({ z0, z1, y0, y1, x, thick=0.12 }){
  const d = z1-z0, h = y1-y0;
  const mat = useMemo(()=>{
    const m = corrugatedMaterial(d);
    return m;
  }, [d]);
  return <Box args={[thick,h,d]} position={[x,(y0+y1)/2,(z0+z1)/2]} material={mat} />;
}

function WindowUnit({ x0, x1, y0, y1, z=2.3, mullion=true }){
  const w = x1-x0, h = y1-y0, cx = (x0+x1)/2, cy = (y0+y1)/2;
  return (
    <group>
      {/* premium silver-aluminum frame */}
      <Box args={[w+0.12,0.07,0.16]} position={[cx,y1+0.02,z]} material={aluminum} />
      <Box args={[w+0.12,0.07,0.16]} position={[cx,y0-0.02,z]} material={aluminum} />
      <Box args={[0.07,h+0.1,0.16]} position={[x0-0.03,cy,z]} material={aluminum} />
      <Box args={[0.07,h+0.1,0.16]} position={[x1+0.03,cy,z]} material={aluminum} />
      {mullion && <Box args={[0.045,h-0.05,0.1]} position={[cx,cy,z]} material={aluminum} />}
      {/* glass */}
      <mesh position={[cx,cy,z-0.02]}>
        <planeGeometry args={[w-0.04,h-0.04]} />
        <primitive object={glassTint} attach="material" />
      </mesh>
      {/* sill */}
      <Box args={[w+0.2,0.04,0.2]} position={[cx,y0-0.07,z+0.05]} material={aluminum} />
    </group>
  );
}

export function CabinDoor({ driver = journey, handleAt = [0.20,0.27], swingAt = [0.24,0.39] }){
  const hinge = useRef();
  const handle = useRef();
  const { y0, y1 } = CABIN.door;
  const h = y1-y0;

  useFrame(()=>{
    const p = driver.p;
    // handle presses down just before the door swings, then releases
    const grab = mapRange(p, handleAt[0], handleAt[1]);
    if(handle.current) handle.current.rotation.z = -Math.sin(Math.PI*Math.min(1,grab)) * 0.85;
    // door swings inward with a heavy, natural ease
    const u = mapRange(p, swingAt[0], swingAt[1]);
    const e = u<0.5 ? 4*u*u*u : 1-Math.pow(-2*u+2,3)/2; // easeInOutCubic
    if(hinge.current) hinge.current.rotation.y = e * 1.92;
  });

  return (
    <group ref={hinge} position={[CABIN.door.x0, y0, 2.24]}>
      {/* leaf — spans local x 0.03→0.99. Premium storefront style: slim silver
          aluminum frame around a tall glass pane, red brand kick plate */}
      <group position={[0.51, h/2, 0]}>
        {/* frame */}
        <Box args={[0.96, h-0.04, 0.055]} material={aluminum} />
        {/* tall glass pane */}
        <mesh position={[0,0.14,0.032]}>
          <planeGeometry args={[0.8,h-0.62]} />
          <primitive object={glassMat} attach="material" />
        </mesh>
        <Box args={[0.84,h-0.58,0.02]} position={[0,0.14,0.028]} material={aluminum} />
        <Box args={[0.78,h-0.64,0.028]} position={[0,0.14,0.033]} material={aluminum} />
        {/* red brand kick plate */}
        <Box args={[0.9,0.24,0.02]} position={[0,-(h/2)+0.16,0.033]} material={redPaint} />
        <Box args={[0.9,0.014,0.024]} position={[0,-(h/2)+0.29,0.034]} material={aluminum} />
        {/* handle assembly (outside) */}
        <group ref={handle} position={[0.38,0.02,0.05]}>
          <Box args={[0.05,0.16,0.03]} material={aluminum} />
          <Box args={[0.17,0.032,0.03]} position={[-0.07,0.045,0.015]} material={aluminum} />
        </group>
        {/* handle (inside) */}
        <Box args={[0.16,0.03,0.03]} position={[0.32,0.06,-0.05]} material={aluminum} />
        {/* hinges on the leaf edge */}
        {[0.7,0,-0.7].map((y,i)=>(
          <Box key={i} args={[0.03,0.11,0.05]} position={[-0.46,y,0.03]} material={aluminum} />
        ))}
      </group>
    </group>
  );
}

export default function CabinExterior({ driver = journey, doorHandleAt, doorSwingAt }){
  const signTex = useMemo(()=>signTexture(), []);
  const { wallB:b, wallT:t, door, w1, w2 } = CABIN;

  return (
    <group>
      {/* ---------- chassis ---------- */}
      <Box args={[7.4,0.18,4.8]} position={[0,0.26,0]} material={chassis} />
      {[-1.9,1.9].map(z=>(
        <Box key={z} args={[7.45,0.14,0.18]} position={[0,0.1,z]} material={chassis} />
      ))}
      {[-2.2,2.2].map(x=>(
        <Box key={x} args={[0.4,0.12,4.84]} position={[x,0.1,0]} material={steelDark} />
      ))}

      {/* ---------- front wall with openings ---------- */}
      <SegX x0={-3.6} x1={door.x0} y0={b} y1={t} z={2.24} />
      <SegX x0={door.x0} x1={door.x1} y0={door.y1} y1={t} z={2.24} />
      <SegX x0={door.x1} x1={w1.x0} y0={b} y1={t} z={2.24} />
      <SegX x0={w1.x0} x1={w1.x1} y0={b} y1={w1.y0} z={2.24} />
      <SegX x0={w1.x0} x1={w1.x1} y0={w1.y1} y1={t} z={2.24} />
      <SegX x0={w1.x1} x1={w2.x0} y0={b} y1={t} z={2.24} />
      <SegX x0={w2.x0} x1={w2.x1} y0={b} y1={w2.y0} z={2.24} />
      <SegX x0={w2.x0} x1={w2.x1} y0={w2.y1} y1={t} z={2.24} />
      <SegX x0={w2.x1} x1={3.6} y0={b} y1={t} z={2.24} />

      {/* door frame — silver aluminum */}
      <Box args={[0.09,door.y1-door.y0+0.08,0.18]} position={[door.x0-0.02,(door.y0+door.y1)/2,2.24]} material={aluminum} />
      <Box args={[0.09,door.y1-door.y0+0.08,0.18]} position={[door.x1+0.02,(door.y0+door.y1)/2,2.24]} material={aluminum} />
      <Box args={[door.x1-door.x0+0.16,0.09,0.18]} position={[(door.x0+door.x1)/2,door.y1+0.03,2.24]} material={aluminum} />

      {/* windows */}
      <WindowUnit {...w1} />
      <WindowUnit {...w2} mullion={false} />

      {/* half-lowered venetian blinds behind window 1 */}
      <group position={[(w1.x0+w1.x1)/2, 0, 2.16]}>
        <Box args={[w1.x1-w1.x0-0.08, 0.07, 0.07]} position={[0, w1.y1-0.05, 0]} material={whiteLaminate} castShadow={false} />
        {[0,1,2,3,4,5,6].map(i=>(
          <Box key={i} args={[w1.x1-w1.x0-0.12, 0.018, 0.05]} position={[0, w1.y1-0.14-i*0.075, 0]}
               rotation={[0.35,0,0]} material={whiteLaminate} castShadow={false} />
        ))}
      </group>

      {/* door threshold plate */}
      <Box args={[door.x1-door.x0+0.06, 0.03, 0.14]} position={[(door.x0+door.x1)/2, door.y0+0.01, 2.3]} material={aluminum} />

      {/* electrical junction box + conduit beside the door */}
      <group position={[-1.45, 0, 2.31]}>
        <Box args={[0.2, 0.26, 0.09]} position={[0, 1.35, 0]} material={aluminum} />
        <Box args={[0.14, 0.03, 0.05]} position={[0, 1.51, 0.01]} material={steelDark} />
        <mesh position={[0, 0.9, 0]} castShadow material={steelDark}>
          <cylinderGeometry args={[0.02, 0.02, 0.65, 8]} />
        </mesh>
      </group>

      {/* ---------- rear glass curtain wall ---------- */}
      <group>
        <Box args={[7.2,0.1,0.12]} position={[0,t-0.03,-2.24]} material={aluminum} />
        <Box args={[7.2,0.1,0.12]} position={[0,b+0.03,-2.24]} material={aluminum} />
        {[-3.55,-2.37,-1.19,0,1.19,2.37,3.55].map(x=>(
          <Box key={x} args={[0.08,t-b,0.1]} position={[x,(b+t)/2,-2.24]} material={aluminum} />
        ))}
        <mesh position={[0,(b+t)/2,-2.24]}>
          <planeGeometry args={[7.1,t-b-0.1]} />
          <primitive object={glassTint} attach="material" />
        </mesh>
      </group>

      {/* ---------- side walls ---------- */}
      <SegZ z0={-2.3} z1={2.3} y0={b} y1={t} x={-3.54} />
      <SegZ z0={-2.3} z1={2.3} y0={b} y1={t} x={3.54} />

      {/* corner posts — brushed aluminum cladding with a slim red brand inlay */}
      {[-3.58,3.58].map(x=>[-2.28,2.28].map(z=>{
        const ix = x<0 ? 0.075 : -0.075;
        return (
          <group key={x+':'+z}>
            <Box args={[0.15,t-b+0.06,0.15]} position={[x,(b+t)/2,z]} material={aluminum} />
            <Box args={[0.02,t-b+0.02,0.02]} position={[x+ix,(b+t)/2,z]} material={redPaint} />
          </group>
        );
      }))}

      {/* red skirt — perimeter strips only (a solid box would show through as the interior floor) */}
      <Box args={[7.24,0.2,0.09]} position={[0,0.46,2.28]} material={redPaint} />
      <Box args={[7.24,0.2,0.09]} position={[0,0.46,-2.28]} material={redPaint} />
      <Box args={[0.09,0.2,4.64]} position={[-3.58,0.46,0]} material={redPaint} />
      <Box args={[0.09,0.2,4.64]} position={[3.58,0.46,0]} material={redPaint} />

      {/* ---------- roof: light galvanized-silver standing-seam deck, aluminum edge trim ---------- */}
      <Box args={[7.5,0.14,4.9]} position={[0,3.44,0]} material={roofMetal} />
      <Box args={[7.56,0.2,0.06]} position={[0,3.42,2.44]} material={aluminum} />
      <Box args={[7.56,0.2,0.06]} position={[0,3.42,-2.44]} material={aluminum} />
      <Box args={[0.06,0.2,4.92]} position={[-3.76,3.42,0]} material={aluminum} />
      <Box args={[0.06,0.2,4.92]} position={[3.76,3.42,0]} material={aluminum} />
      {[-3.35,3.35].map(x=>[-2.05,2.05].map(z=>(
        <group key={x+'~'+z} position={[x,3.53,z]}>
          <Box args={[0.15,0.07,0.15]} material={aluminum} />
          <mesh position={[0,0.08,0]} castShadow material={aluminum}>
            <torusGeometry args={[0.05,0.015,8,18]} />
          </mesh>
        </group>
      )))}

      {/* ---------- entry steps ---------- */}
      <Box args={[1.3,0.17,0.8]} position={[-2.2,0.085,2.75]} material={concrete} />
      <Box args={[1.2,0.17,0.45]} position={[-2.2,0.26,2.58]} material={concrete} />

      {/* ---------- signage above door ---------- */}
      <mesh position={[-2.2,2.95,2.32]}>
        <planeGeometry args={[1.7,0.48]} />
        <meshBasicMaterial map={signTex} toneMapped={false} />
      </mesh>

      {/* wall lamp over the door */}
      <group position={[-2.2,2.68,2.36]}>
        <Box args={[0.34,0.06,0.12]} material={blackMetal} />
        <Box args={[0.28,0.02,0.08]} position={[0,-0.035,0]} material={ledWarm} />
      </group>

      {/* ---------- AC unit on right wall ---------- */}
      <group position={[3.68,2.2,0.6]}>
        <Box args={[0.34,0.5,0.7]} material={aluminum} />
        {[0,1,2,3].map(i=>(
          <Box key={i} args={[0.02,0.4,0.06]} position={[0.17,0,-0.24+i*0.16]} material={steelDark} />
        ))}
        <Box args={[0.3,0.04,0.6]} position={[0.02,-0.29,0]} material={steelDark} />
      </group>

      {/* downpipes at opposite corners */}
      <mesh position={[3.66,1.85,2.2]} castShadow material={aluminum}>
        <cylinderGeometry args={[0.045,0.045,3.0,10]} />
      </mesh>
      <mesh position={[-3.66,1.85,-2.2]} castShadow material={aluminum}>
        <cylinderGeometry args={[0.045,0.045,3.0,10]} />
      </mesh>

      {/* roof vent with rain cap */}
      <group position={[1.4, 3.53, -0.6]}>
        <mesh material={steelDark}><cylinderGeometry args={[0.2,0.23,0.04,16]} /></mesh>
        <mesh position={[0,0.14,0]} castShadow material={aluminum}><cylinderGeometry args={[0.11,0.11,0.26,14]} /></mesh>
        <mesh position={[0,0.3,0]} castShadow material={steelDark}><cylinderGeometry args={[0.17,0.09,0.08,14]} /></mesh>
      </group>

      <CabinDoor driver={driver} {...(doorHandleAt ? {handleAt:doorHandleAt} : {})} {...(doorSwingAt ? {swingAt:doorSwingAt} : {})} />
    </group>
  );
}
