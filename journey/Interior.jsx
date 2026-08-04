import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CABIN } from './CabinExterior.jsx';
import { brandingTexture, makeScreen, glowTex } from './textures.js';
import {
  drywall, drywallDark, ceilingMat, woodFloor, walnut, walnutLight,
  whiteLaminate, fabricGrey, leafGreen, potMat, rugMat, aluminum,
  steelDark, blackMetal, glassMat, ledWarm, ledWhite, ledRed,
} from './materials.js';

function Box({ args, position, rotation, material, castShadow=true, receiveShadow=true }){
  return (
    <mesh position={position} rotation={rotation} castShadow={castShadow} receiveShadow={receiveShadow} material={material}>
      <boxGeometry args={args} />
    </mesh>
  );
}

/* ---------- interior drywall liner mirroring the exterior openings ---------- */
function Liner(){
  const { wallB:b, wallT:t, door, w1, w2 } = CABIN;
  const z = 2.155;
  const seg = (x0,x1,y0,y1)=>(
    <Box key={`${x0}~${y0}`} args={[x1-x0, y1-y0, 0.05]} position={[(x0+x1)/2,(y0+y1)/2,z]} material={drywall} castShadow={false} />
  );
  return (
    <group>
      {seg(-3.48, door.x0, b, t)}
      {seg(door.x0, door.x1, door.y1, t)}
      {seg(door.x1, w1.x0, b, t)}
      {seg(w1.x0, w1.x1, b, w1.y0)}
      {seg(w1.x0, w1.x1, w1.y1, t)}
      {seg(w1.x1, w2.x0, b, t)}
      {seg(w2.x0, w2.x1, b, w2.y0)}
      {seg(w2.x0, w2.x1, w2.y1, t)}
      {seg(w2.x1, 3.48, b, t)}
      {/* window reveals (inner sills) */}
      <Box args={[w1.x1-w1.x0, 0.05, 0.16]} position={[(w1.x0+w1.x1)/2, w1.y0-0.01, 2.2]} material={whiteLaminate} />
      <Box args={[w2.x1-w2.x0, 0.05, 0.16]} position={[(w2.x0+w2.x1)/2, w2.y0-0.01, 2.2]} material={whiteLaminate} />
      {/* side walls */}
      <Box args={[0.05, t-b, 4.36]} position={[-3.455,(b+t)/2,0]} material={drywallDark} castShadow={false} />
      <Box args={[0.05, t-b, 4.36]} position={[3.455,(b+t)/2,0]} material={drywall} castShadow={false} />
    </group>
  );
}

/* ---------- ceiling: panels, linear lights, LED cove, fan ---------- */
function Ceiling(){
  const fan = useRef();
  useFrame((_,dt)=>{ if(fan.current) fan.current.rotation.y += dt*1.6; });
  return (
    <group>
      <Box args={[6.9,0.06,4.32]} position={[0,3.32,0]} material={ceilingMat} castShadow={false} />
      {/* recessed linear fixtures */}
      {[-1.35,0.25,1.55].map(z=>(
        <group key={z} position={[0,3.285,z]}>
          <Box args={[2.6,0.05,0.18]} material={blackMetal} castShadow={false} />
          <Box args={[2.5,0.02,0.12]} position={[0,-0.025,0]} material={ledWhite} castShadow={false} />
        </group>
      ))}
      {/* warm LED cove around the perimeter */}
      <Box args={[6.7,0.025,0.05]} position={[0,3.26,2.08]} material={ledWarm} castShadow={false} />
      <Box args={[6.7,0.025,0.05]} position={[0,3.26,-2.08]} material={ledWarm} castShadow={false} />
      <Box args={[0.05,0.025,4.1]} position={[-3.38,3.26,0]} material={ledWarm} castShadow={false} />
      <Box args={[0.05,0.025,4.1]} position={[3.38,3.26,0]} material={ledWarm} castShadow={false} />
      {/* ceiling fan */}
      <group position={[-1.4,3.3,-0.6]}>
        <mesh material={blackMetal}>
          <cylinderGeometry args={[0.035,0.035,0.3,10]} />
        </mesh>
        <group ref={fan} position={[0,-0.17,0]}>
          <mesh material={blackMetal}>
            <cylinderGeometry args={[0.09,0.11,0.09,14]} />
          </mesh>
          {[0,1,2,3].map(i=>(
            <Box key={i} args={[0.9,0.015,0.14]} position={[Math.cos(i*Math.PI/2)*0.52,0,Math.sin(i*Math.PI/2)*0.52]} rotation={[0, -i*Math.PI/2, 0.06]} material={blackMetal} castShadow={false} />
          ))}
        </group>
      </group>
    </group>
  );
}

/* ---------- reception: desk, backdrop with branding, monitor ---------- */
function Reception(){
  const brandTex = useMemo(()=>brandingTexture(), []);
  const screen = useMemo(()=>makeScreen(), []);
  const acc = useRef(0);
  useFrame((_,dt)=>{
    acc.current += dt;
    if(acc.current > 0.5){ acc.current = 0; screen.draw(); }
  });
  const floorY = 0.39;
  return (
    <group>
      {/* backdrop feature panel (separates reception from meeting zone) */}
      <group position={[0.42, floorY, 1.19]}>
        <Box args={[0.08, 2.3, 2.0]} position={[0,1.15,0]} material={drywallDark} />
        <mesh position={[-0.045,1.35,0]} rotation={[0,-Math.PI/2,0]}>
          <planeGeometry args={[1.9,0.95]} />
          <meshBasicMaterial map={brandTex} toneMapped={false} />
        </mesh>
        {/* red LED underline */}
        <Box args={[0.03,0.025,1.8]} position={[-0.05,0.78,0]} material={ledRed} castShadow={false} />
      </group>

      {/* desk — front panel faces the entrance */}
      <group position={[-0.75, floorY, 1.05]}>
        <Box args={[0.06,1.08,1.9]} position={[-0.35,0.54,0]} material={walnut} />
        <Box args={[0.75,0.05,2.0]} position={[0,1.1,0]} material={whiteLaminate} />
        <Box args={[0.6,0.04,1.7]} position={[0.1,0.72,0]} material={walnut} />
        <Box args={[0.05,0.7,1.7]} position={[0.35,0.36,0]} material={walnut} />
        {/* warm LED under the counter lip */}
        <Box args={[0.02,0.02,1.86]} position={[-0.39,1.02,0]} material={ledWarm} castShadow={false} />
        {/* monitor */}
        <group position={[0.08,1.12,0.35]} rotation={[0,Math.PI/2+0.5,0]}>
          <Box args={[0.5,0.32,0.02]} position={[0,0.33,0]} material={blackMetal} />
          <mesh position={[0,0.33,0.011]}>
            <planeGeometry args={[0.46,0.28]} />
            <meshBasicMaterial map={screen.tex} toneMapped={false} />
          </mesh>
          <Box args={[0.05,0.14,0.05]} position={[0,0.1,-0.02]} material={blackMetal} />
          <Box args={[0.2,0.02,0.14]} position={[0,0.02,-0.02]} material={blackMetal} />
        </group>
        {/* small desk plant */}
        <group position={[0.05,1.12,-0.65]}>
          <mesh material={potMat}><cylinderGeometry args={[0.06,0.05,0.09,10]} /></mesh>
          {[0,1,2,3,4].map(i=>(
            <mesh key={i} position={[0,0.1,0]} rotation={[0.5, i*1.25, 0]} material={leafGreen}>
              <coneGeometry args={[0.025,0.16,5]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* task chair behind the desk */}
      <OfficeChair position={[0.02, floorY, 0.55]} rotation={[0,Math.PI/2,0]} />

      {/* waiting bench against the front wall + rug */}
      <group position={[-0.7, floorY, 1.85]}>
        <Box args={[1.5,0.09,0.45]} position={[0,0.36,0]} material={walnut} />
        {[-0.45,0.05,0.55].map(x=>(
          <Box key={x} args={[0.42,0.1,0.4]} position={[x-0.05,0.44,0]} material={fabricGrey} />
        ))}
        <Box args={[0.05,0.36,0.4]} position={[-0.7,0.18,0]} material={steelDark} />
        <Box args={[0.05,0.36,0.4]} position={[0.7,0.18,0]} material={steelDark} />
      </group>
      <mesh position={[-1.35, floorY+0.008, 1.1]} rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[1.7,1.25]} />
        <primitive object={rugMat} attach="material" />
      </mesh>
    </group>
  );
}

function OfficeChair({ position, rotation=[0,0,0] }){
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0,0.02,0]} material={aluminum}><cylinderGeometry args={[0.24,0.26,0.035,16]} /></mesh>
      <mesh position={[0,0.25,0]} material={aluminum}><cylinderGeometry args={[0.03,0.03,0.44,8]} /></mesh>
      <Box args={[0.44,0.06,0.44]} position={[0,0.5,0]} material={fabricGrey} />
      <Box args={[0.42,0.52,0.07]} position={[0,0.82,-0.21]} rotation={[-0.12,0,0]} material={fabricGrey} />
    </group>
  );
}

/* ---------- meeting area: table, chairs, laptop, pendant, partition ---------- */
function MeetingArea(){
  const screen = useMemo(()=>makeScreen(), []);
  const acc = useRef(0.25);
  useFrame((_,dt)=>{
    acc.current += dt;
    if(acc.current > 0.5){ acc.current = 0; screen.draw(); }
  });
  const floorY = 0.39;
  return (
    <group>
      {/* glass partition along the walkway */}
      <group position={[1.08, floorY, -1.15]}>
        <Box args={[0.07,0.06,2.05]} position={[0,0.03,0]} material={steelDark} />
        <Box args={[0.07,0.06,2.05]} position={[0,2.25,0]} material={steelDark} />
        {[-1.0,0,1.0].map(z=>(
          <Box key={z} args={[0.05,2.24,0.05]} position={[0,1.14,z]} material={steelDark} />
        ))}
        <mesh position={[0,1.14,0]} rotation={[0,Math.PI/2,0]}>
          <planeGeometry args={[2.0,2.16]} />
          <primitive object={glassMat} attach="material" />
        </mesh>
      </group>

      {/* meeting table */}
      <group position={[2.25, floorY, -0.85]}>
        <Box args={[1.9,0.06,1.0]} position={[0,0.74,0]} material={walnut} />
        <Box args={[1.86,0.02,0.96]} position={[0,0.77,0]} material={walnutLight} />
        {[[-0.8,-0.38],[0.8,-0.38],[-0.8,0.38],[0.8,0.38]].map(([x,z],i)=>(
          <Box key={i} args={[0.07,0.74,0.07]} position={[x,0.37,z]} material={steelDark} />
        ))}
        {/* laptop — screen angled toward the camera path */}
        <group position={[-0.25,0.78,0.1]} rotation={[0,-1.15,0]}>
          <Box args={[0.34,0.015,0.24]} material={blackMetal} />
          {/* lid hinged at the back edge, opened ~110° */}
          <group position={[0,0.008,-0.12]} rotation={[-1.2,0,0]}>
            <Box args={[0.34,0.22,0.012]} position={[0,0.11,0]} material={blackMetal} />
            <mesh position={[0,0.11,0.008]}>
              <planeGeometry args={[0.31,0.19]} />
              <meshBasicMaterial map={screen.tex} toneMapped={false} />
            </mesh>
          </group>
        </group>
        {/* notepads + mugs */}
        <Box args={[0.2,0.01,0.28]} position={[0.35,0.785,-0.2]} rotation={[0,-0.2,0]} material={whiteLaminate} />
        <mesh position={[0.55,0.82,0.15]} material={whiteLaminate}><cylinderGeometry args={[0.035,0.03,0.08,10]} /></mesh>
        <mesh position={[-0.6,0.82,-0.25]} material={fabricGrey}><cylinderGeometry args={[0.035,0.03,0.08,10]} /></mesh>
      </group>

      {[[1.55,-1.5,0.6],[2.25,-1.6,0],[2.95,-1.5,-0.6],[1.55,-0.2,2.6],[2.25,-0.1,Math.PI],[2.95,-0.2,3.6]].map(([x,z,ry],i)=>(
        <OfficeChair key={i} position={[x,floorY,z]} rotation={[0,ry,0]} />
      ))}

      {/* pendant over the table */}
      <group position={[2.25,0,-0.85]}>
        <mesh position={[0,3.05,0]} material={blackMetal}><cylinderGeometry args={[0.01,0.01,0.55,6]} /></mesh>
        <mesh position={[0,2.76,0]} material={blackMetal}><cylinderGeometry args={[0.02,0.16,0.14,16]} /></mesh>
        <mesh position={[0,2.7,0]} material={ledWarm}><cylinderGeometry args={[0.13,0.13,0.02,16]} /></mesh>
      </group>
    </group>
  );
}

/* ---------- coffee corner ---------- */
function CoffeeCorner(){
  const steam = useRef([]);
  useFrame((state)=>{
    const t = state.clock.elapsedTime;
    steam.current.forEach((s,i)=>{
      if(!s) return;
      const u = ((t*0.35 + i*0.25) % 1);
      s.position.y = 1.32 + u*0.55;
      s.position.x = -3.02 + Math.sin(t*2 + i*2)*0.02;
      s.material.opacity = 0.3 * Math.sin(Math.PI*u);
      s.scale.setScalar(0.08 + u*0.16);
    });
  });
  const floorY = 0.39;
  return (
    <group>
      {/* counter along the left wall */}
      <group position={[-3.12, floorY, -1.25]}>
        <Box args={[0.6,0.85,1.7]} position={[0,0.425,0]} material={walnut} />
        <Box args={[0.66,0.05,1.78]} position={[0,0.88,0]} material={whiteLaminate} />
        {/* upper shelf with warm LED */}
        <Box args={[0.3,0.04,1.5]} position={[0.14,1.75,0]} material={walnut} />
        <Box args={[0.26,0.02,1.4]} position={[0.14,1.72,0]} material={ledWarm} castShadow={false} />
        {/* cups on the shelf */}
        {[-0.5,-0.28,-0.06,0.16].map(z=>(
          <mesh key={z} position={[0.14,1.82,z]} material={whiteLaminate}><cylinderGeometry args={[0.035,0.03,0.07,10]} /></mesh>
        ))}
      </group>
      {/* coffee machine */}
      <group position={[-3.05, floorY+0.9, -0.7]}>
        <Box args={[0.32,0.42,0.3]} position={[0,0.21,0]} material={blackMetal} />
        <Box args={[0.28,0.06,0.26]} position={[0,0.45,0]} material={steelDark} />
        <Box args={[0.1,0.08,0.08]} position={[0.03,0.18,0.17]} material={aluminum} />
        <mesh position={[0.03,0.05,0.17]} material={whiteLaminate}><cylinderGeometry args={[0.04,0.035,0.09,10]} /></mesh>
        <Box args={[0.06,0.02,0.02]} position={[-0.08,0.3,0.16]} material={ledRed} castShadow={false} />
      </group>
      {/* steam sprites */}
      {[0,1,2].map(i=>(
        <sprite key={i} ref={el=>steam.current[i]=el} position={[-3.02,1.4,-0.53]} scale={[0.1,0.1,0.1]}>
          <spriteMaterial map={glowTex} transparent opacity={0.25} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

/* ---------- plants with gentle sway ---------- */
function Plant({ position, scale=1 }){
  const leaves = useRef();
  const phase = useMemo(()=>Math.random()*Math.PI*2, []);
  useFrame((state)=>{
    if(leaves.current){
      const t = state.clock.elapsedTime;
      leaves.current.rotation.z = Math.sin(t*0.8 + phase)*0.025;
      leaves.current.rotation.x = Math.cos(t*0.6 + phase)*0.02;
    }
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0,0.2,0]} castShadow material={potMat}>
        <cylinderGeometry args={[0.17,0.13,0.4,12]} />
      </mesh>
      <group ref={leaves} position={[0,0.4,0]}>
        <mesh position={[0,0.3,0]} material={walnut}><cylinderGeometry args={[0.02,0.03,0.6,6]} /></mesh>
        {[0,1,2,3,4,5,6].map(i=>(
          <mesh key={i} position={[Math.cos(i*0.9)*0.12, 0.55+ (i%3)*0.16, Math.sin(i*0.9)*0.12]}
                rotation={[0.7+ (i%2)*0.3, i*0.9, 0]} castShadow material={leafGreen}>
            <coneGeometry args={[0.09,0.5,4]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- wall art on the right wall ---------- */
function WallArt(){
  return (
    <group>
      {[[3.42,1.9,1.5],[3.42,1.9,0.6]].map(([x,y,z],i)=>(
        <group key={i} position={[x,y,z]} rotation={[0,-Math.PI/2,0]}>
          <Box args={[0.55,0.75,0.03]} material={blackMetal} castShadow={false} />
          <Box args={[0.47,0.67,0.01]} position={[0,0,0.016]} material={i===0?fabricGrey:drywallDark} castShadow={false} />
          <Box args={[0.3,0.04,0.01]} position={[0,0.1-(i*0.15),0.022]} material={ledRed} castShadow={false} />
        </group>
      ))}
    </group>
  );
}

export default function Interior(){
  return (
    <group>
      {/* wooden floor */}
      <mesh position={[0,0.37,0]} receiveShadow material={woodFloor}>
        <boxGeometry args={[6.96,0.04,4.36]} />
      </mesh>
      <Liner />
      <Ceiling />
      <Reception />
      <MeetingArea />
      <CoffeeCorner />
      <WallArt />
      <Plant position={[3.0,0.39,1.75]} scale={1.15} />
      <Plant position={[-3.05,0.39,1.85]} scale={0.9} />
      <Plant position={[1.5,0.39,-1.95]} scale={0.85} />

      {/* interior lighting */}
      <pointLight position={[-1.2,3.0,1.0]} intensity={5} distance={8} decay={2} color={0xffe6c4} />
      <pointLight position={[2.2,2.9,-0.8]} intensity={4.2} distance={7} decay={2} color={0xffe2bd} />
      <pointLight position={[-2.9,2.4,-1.2]} intensity={3.2} distance={5} decay={2} color={0xffd9a3} />
    </group>
  );
}
