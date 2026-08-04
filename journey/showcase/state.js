// Mutable singleton for the /products showcase page — completely separate
// from the home page's `journey` (src/journey/scrollState.js) so the two
// scroll experiences never read or write each other's state.
export { mapRange, smootherstep } from '../scrollState.js';

export const showcase = {
  target: 0,      // raw scroll progress 0..1 over the pinned track
  p: 0,           // smoothed progress the 3D world reads
  loaded: 0,      // 0..1 intro timeline
  mainLoop: null, // setFrameloop for this page's canvas
};

export const SEGMENTS = 4; // Site Office, Labour, Conference, Storage

// [start, end) window for cabin index i, evenly dividing the track
export function segmentRange(i){
  return [i / SEGMENTS, (i + 1) / SEGMENTS];
}
