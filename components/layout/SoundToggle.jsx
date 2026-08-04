export default function SoundToggle({ audio }){
  if(!audio.available) return null;
  return (
    <button
      className={
        'fixed right-[26px] bottom-[26px] z-40 font-mono text-[10px] tracking-[0.14em] bg-transparent border px-[14px] py-[9px] cursor-pointer transition-all duration-200 ease-in-out max-[480px]:right-[16px] max-[480px]:bottom-[16px] '
        + (audio.enabled ? 'text-brand-white border-brand-red' : 'text-brand-steel border-brand-line')
      }
      onClick={audio.toggle}
      aria-label="Toggle sound"
    >
      {audio.enabled ? 'SOUND ON' : 'SOUND OFF'}
    </button>
  );
}
