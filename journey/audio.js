import { useEffect, useRef, useState } from 'react';
import { journey, mapRange } from './scrollState.js';

/*
 * Optional sound design. Drop files into public/sounds/ to enable:
 *   door-open.mp3  · played when the door starts to swing
 *   ambience.mp3   · office room tone, loops, fades in once inside
 *   footsteps.mp3  · loops, volume follows camera motion inside
 * If the files are missing the hook stays silent and reports available:false.
 */
const FILES = {
  door: '/sounds/door-open.mp3',
  ambience: '/sounds/ambience.mp3',
  footsteps: '/sounds/footsteps.mp3',
};

async function exists(url){
  try{
    const res = await fetch(url, { method:'HEAD' });
    return res.ok && !(res.headers.get('content-type')||'').includes('text/html');
  }catch{ return false; }
}

export function useJourneyAudio(){
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const els = useRef({});
  const doorPlayed = useRef(false);
  const raf = useRef();

  useEffect(()=>{
    let alive = true;
    (async ()=>{
      const found = {};
      for(const [k,url] of Object.entries(FILES)){
        if(await exists(url)) found[k] = url;
      }
      if(!alive || Object.keys(found).length === 0) return;
      for(const [k,url] of Object.entries(found)){
        const a = new Audio(url);
        a.preload = 'auto';
        if(k !== 'door'){ a.loop = true; a.volume = 0; }
        els.current[k] = a;
      }
      setAvailable(true);
    })();
    return ()=>{ alive = false; };
  }, []);

  useEffect(()=>{
    if(!enabled){
      Object.values(els.current).forEach(a=>{ a.pause(); });
      cancelAnimationFrame(raf.current);
      return;
    }
    const { ambience, footsteps } = els.current;
    ambience?.play().catch(()=>{});
    footsteps?.play().catch(()=>{});
    const tick = ()=>{
      const p = journey.p;
      const inside = mapRange(p, 0.55, 0.68) * (1 - mapRange(p, 0.94, 1));
      if(ambience) ambience.volume = 0.45 * inside;
      if(footsteps) footsteps.volume = Math.min(0.4, journey.vel * 2.2) * inside;
      const door = els.current.door;
      if(door){
        if(p > 0.45 && p < 0.6 && !doorPlayed.current){
          doorPlayed.current = true;
          door.currentTime = 0;
          door.volume = 0.7;
          door.play().catch(()=>{});
        }
        if(p < 0.4) doorPlayed.current = false;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf.current);
  }, [enabled]);

  return { available, enabled, toggle: ()=>setEnabled(v=>!v) };
}
