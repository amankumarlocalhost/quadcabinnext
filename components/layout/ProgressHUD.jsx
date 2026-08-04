export default function ProgressHUD({ plateRef }){
  return (
    <div className="fixed inset-0 z-3 pointer-events-none max-[900px]:hidden">
      <div className="absolute w-[34px] h-[34px] border-2 border-brand-red opacity-90 top-[24px] left-[24px] border-r-0 border-b-0" />
      <div className="absolute w-[34px] h-[34px] border-2 border-brand-red opacity-90 top-[24px] right-[24px] border-l-0 border-b-0" />
      <div className="absolute w-[34px] h-[34px] border-2 border-brand-red opacity-90 bottom-[24px] left-[24px] border-r-0 border-t-0" />
      <div className="absolute w-[34px] h-[34px] border-2 border-brand-red opacity-90 bottom-[24px] right-[24px] border-l-0 border-t-0" />
      <div className="absolute left-[24px] bottom-[60px] font-mono text-[11px] tracking-[0.12em] text-brand-off uppercase flex items-center gap-[10px]">
        <span className="w-[7px] h-[7px] rounded-full bg-brand-red shadow-[0_0_8px_var(--red)]" />
        <span>QC — WALKTHROUGH</span>
        <span className="text-brand-red font-bold" ref={plateRef}>EXTERIOR</span>
      </div>
    </div>
  );
}
