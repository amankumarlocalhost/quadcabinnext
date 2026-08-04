// Fills the same frame the 3D canvas will mount into, shown by next/dynamic
// while the three.js/fiber/drei chunk downloads and parses. Without this the
// frame is blank (or just page background) for the ~1-2s it takes that chunk
// to arrive, which reads as "stuck" even though the rest of the page is live.
export default function CabinLoading(){
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <div className="relative w-[64px] h-[64px]">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-red animate-spin [animation-duration:0.9s]" />
      </div>
    </div>
  );
}
