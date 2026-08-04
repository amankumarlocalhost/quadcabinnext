// Site-wide "thank you" confirmation shown after any contact/quote form
// submits successfully — same component used on Home, Products, Industries,
// About and Contact so the confirmation is consistent everywhere.
export default function Toast({ show, onClose, title = 'Thank You!', children }){
  return (
    <div
      className={
        'fixed inset-0 z-100 flex items-center justify-center bg-[rgba(5,5,5,0.72)] backdrop-blur-[6px] transition-opacity duration-300 ease-in-out '
        + (show ? 'pointer-events-auto opacity-100 visible' : 'pointer-events-none opacity-0 invisible delay-300')
      }
      onClick={onClose}
      aria-hidden={!show}
    >
      <div
        className={
          'relative bg-brand-panel border border-brand-line text-center w-[min(92vw,400px)] p-[42px_32px_34px] max-[390px]:p-[36px_24px_28px] border-t-[3px] border-t-brand-red shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(.2,.9,.3,1)] '
          + (show ? 'translate-y-0 scale-100' : 'translate-y-[14px] scale-[0.97]')
        }
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button type="button" className="absolute top-[10px] right-[12px] bg-transparent border-none text-brand-steel text-[22px] leading-none cursor-pointer transition-colors duration-200 ease-in-out p-[6px] hover:text-brand-white" onClick={onClose} aria-label="Close">&times;</button>
        <div className="mx-auto flex items-center justify-center rounded-full bg-brand-red text-brand-white w-[56px] h-[56px] mb-[18px]">
          <svg viewBox="0 0 52 52" width="30" height="30">
            <path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 17-17" />
          </svg>
        </div>
        <h3 className="font-anton uppercase tracking-[0.01em] text-brand-white text-[26px] mb-[10px]">{title}</h3>
        <p className="text-brand-off text-[15px] leading-[1.55] m-0">{children}</p>
      </div>
    </div>
  );
}
