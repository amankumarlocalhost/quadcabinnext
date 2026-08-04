import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { journey, mapRange } from './scrollState.js';
import { glowTex, rayTex } from './textures.js';

/* floating dust motes inside the cabin, visible in the light */
export function Dust({ count=260, driver=journey, appearAt=[0.5,0.7], fadeAt=[0.94,1] }){
  const points = useRef();
  const matRef = useRef();
  const { positions, seeds } = useMemo(()=>{
    const positions = new Float32Array(count*3);
    const seeds = new Float32Array(count);
    for(let i=0;i<count;i++){
      positions[i*3+0] = -3.2 + Math.random()*6.4;
      positions[i*3+1] = 0.5 + Math.random()*2.6;
      positions[i*3+2] = -2.0 + Math.random()*4.0;
      seeds[i] = Math.random()*Math.PI*2;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state)=>{
    const t = state.clock.elapsedTime;
    const pos = points.current.geometry.attributes.position;
    for(let i=0;i<count;i++){
      pos.array[i*3+0] += Math.sin(t*0.22 + seeds[i])*0.0007;
      pos.array[i*3+1] += Math.cos(t*0.18 + seeds[i]*1.7)*0.0005 + 0.0002;
      if(pos.array[i*3+1] > 3.2) pos.array[i*3+1] = 0.5;
    }
    pos.needsUpdate = true;
    // only really visible once you're inside
    if(matRef.current) matRef.current.opacity = 0.55 * mapRange(driver.p, appearAt[0], appearAt[1]) * (1 - mapRange(driver.p, fadeAt[0], fadeAt[1]));
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} map={glowTex} size={0.022} sizeAttenuation transparent opacity={0}
        depthWrite={false} blending={THREE.AdditiveBlending} color={0xffe9c8} />
    </points>
  );
}

/* fake volumetric blades of sunlight entering through the front windows */
export function LightRays({ driver=journey, appearAt=[0.5,0.68], fadeAt=[0.92,1] }){
  const group = useRef();
  useFrame(()=>{
    if(!group.current) return;
    const inside = mapRange(driver.p, appearAt[0], appearAt[1]);
    const fadeOut = 1 - mapRange(driver.p, fadeAt[0], fadeAt[1]);
    group.current.children.forEach(m=>{
      m.material.opacity = (0.05 + inside*0.30) * fadeOut;
    });
  });
  const blades = [
    { pos:[1.05,1.6,0.9], rot:[0.62,0.12,0], size:[1.7,3.1] },
    { pos:[1.35,1.5,0.4], rot:[0.62,0.1,0], size:[1.3,3.4] },
    { pos:[2.8,1.6,1.0], rot:[0.62,0.08,0], size:[0.95,3.0] },
  ];
  return (
    <group ref={group}>
      {blades.map((b,i)=>(
        <mesh key={i} position={b.pos} rotation={b.rot}>
          <planeGeometry args={b.size} />
          <meshBasicMaterial map={rayTex} transparent opacity={0} side={THREE.DoubleSide}
            depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
