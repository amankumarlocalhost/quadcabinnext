// Mutable singleton shared between the DOM scroll world (Lenis + ScrollTrigger)
// and the R3F frame loop. `target` is written by ScrollTrigger; `p` is the
// damped value the camera actually follows, so motion stays cinematic even
// when the wheel jumps.
export const journey = {
  target: 0,   // raw scroll progress 0..1 over the pinned journey
  p: 0,        // smoothed progress the 3D world reads
  vel: 0,      // |dp/dt| — used for footstep/motion cues
  loaded: 0,   // 0..1 intro timeline (lights on, camera settle)
  mainLoop: null, // setFrameloop for the hero canvas (registered by Experience)
};

export function mapRange(v, a, b, c = 0, d = 1){
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return c + (d - c) * t;
}

export function smootherstep(t){
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// piecewise keyframe sampler: keys = [{t, pos:[x,y,z], look:[x,y,z]}]
export function sampleKeys(keys, t, outPos, outLook){
  if(t <= keys[0].t){ outPos.set(...keys[0].pos); outLook.set(...keys[0].look); return; }
  const last = keys[keys.length-1];
  if(t >= last.t){ outPos.set(...last.pos); outLook.set(...last.look); return; }
  let i = 0;
  while(keys[i+1].t < t) i++;
  const a = keys[i], b = keys[i+1];
  const u = smootherstep((t - a.t) / (b.t - a.t));
  outPos.set(
    a.pos[0] + (b.pos[0]-a.pos[0])*u,
    a.pos[1] + (b.pos[1]-a.pos[1])*u,
    a.pos[2] + (b.pos[2]-a.pos[2])*u
  );
  outLook.set(
    a.look[0] + (b.look[0]-a.look[0])*u,
    a.look[1] + (b.look[1]-a.look[1])*u,
    a.look[2] + (b.look[2]-a.look[2])*u
  );
}
