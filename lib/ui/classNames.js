// Shared Tailwind utility-class strings reused across many components.
// These are plain JS string constants, not a stylesheet — every value here
// is still just Tailwind utility classes applied via `className`, kept in
// one place purely to avoid retyping the same long string in 30+ files.

export const wrapClass =
  'w-full mx-auto max-w-[1360px] [padding-left:clamp(18px,3vw,34px)] [padding-right:clamp(18px,3vw,34px)] max-[390px]:px-[14px]';

export const sectionClass = 'relative min-h-screen flex items-center max-[768px]:min-h-0';

export const eyebrowClass = 'font-mono text-[12px] tracking-[0.18em] uppercase text-brand-red flex items-center gap-[10px] mb-[18px]';
export const eyebrowBarClass = 'w-[26px] h-[2px] bg-brand-red';

// Single border-width-only base — every variant below sets its OWN
// border-color utility. (Previously the base also carried `border-transparent`
// alongside a variant's `border-brand-white`/`border-[#111]`; two border-color
// utilities of equal specificity race in Tailwind's generated stylesheet, and
// transparent was winning — that's why the ghost buttons rendered with no
// visible border/outline at all.) The trailing arrow nudges on hover and
// `active:scale` gives every button the same tactile press feedback.
export const btnBaseClass = 'relative font-barlow-condensed font-bold text-[16px] tracking-[0.06em] uppercase cursor-pointer border-2 rounded-[8px] transition-all duration-[260ms] ease-out inline-flex items-center gap-[12px] p-[19px_38px] max-[480px]:p-[16px_26px] max-[480px]:text-[15px] max-[390px]:p-[14px_22px] max-[390px]:text-[14px] max-[320px]:p-[13px_18px] max-[320px]:text-[13px] max-[320px]:gap-[8px] after:content-["→"] after:inline-block after:transition-transform after:duration-300 after:ease-out hover:after:translate-x-[4px] active:scale-[0.97]';
export const btnPrimaryClass = `${btnBaseClass} bg-gradient-to-b from-[#ee2a32] to-brand-red border-brand-red text-brand-white shadow-[0_12px_30px_-12px_rgba(225,27,35,0.85),inset_0_1px_0_0_rgba(255,255,255,0.18)] hover:from-brand-red hover:to-brand-red-dark hover:border-brand-red-dark hover:shadow-[0_18px_38px_-10px_rgba(225,27,35,1),inset_0_1px_0_0_rgba(255,255,255,0.18)] hover:-translate-y-[3px]`;
export const btnGhostClass = `${btnBaseClass} border-brand-white/60 text-brand-white bg-white/[0.05] backdrop-blur-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:bg-brand-white hover:text-brand-black hover:border-brand-white hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.6)] hover:-translate-y-[3px]`;

export const cardClass = 'border border-brand-line max-w-[520px] text-[#111] bg-[rgba(230,230,228,0.92)] backdrop-blur-[10px] p-10 max-[480px]:p-[26px] max-[900px]:max-w-full';
export const cardHeadingClass = 'font-barlow-condensed font-bold text-[#111]';
export const cardBtnGhostClass = `${btnBaseClass} border-[#111]/60 text-[#111] bg-transparent hover:bg-[#111] hover:text-[#f7f7f5] hover:border-[#111] hover:shadow-[0_16px_34px_-16px_rgba(0,0,0,0.5)] hover:-translate-y-[3px]`;

export const h2Class = 'font-anton font-normal tracking-[0.01em] uppercase leading-[0.95]';
export const h3Class = 'font-anton font-normal tracking-[0.01em] uppercase leading-[0.95]';
export const h1Class = 'font-antonio font-bold tracking-[0.01em] uppercase leading-[0.95]';

export const scrollCueClass = 'absolute bottom-[38px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[8px] font-mono text-[11px] tracking-[0.16em] text-brand-steel uppercase';
export const scrollCueLineClass = 'w-px h-[34px] bg-gradient-to-b from-brand-red to-transparent animate-[pulse_1.8s_infinite]';

// ---- Product / Site Office showcase sections (pinned image walkthrough) ----
// `mh820:` / `mh660:` are short-viewport (laptop display-scaling) tweaks —
// Tailwind has no built-in max-height shorthand, so these use the full
// arbitrary media-feature variant syntax under the hood (see below).
const mh820 = '[@media(max-height:820px)]:';
const mh660 = '[@media(max-height:660px)]:';

export const showcaseSectionClass = 'block h-[240vh] max-[900px]:h-auto';
export const showcasePinClass = `sticky top-0 h-screen flex items-center pt-[78px] pb-[24px] max-[900px]:relative max-[900px]:h-auto max-[900px]:py-[80px] ${mh820}pt-[90px] ${mh660}pt-[84px]`;
export const splitWrapClass = 'w-full flex items-center justify-between flex-wrap [gap:clamp(24px,3.5vw,44px)] max-[900px]:flex-col max-[900px]:items-stretch';
export const cabinViewerClass = `w-full min-w-0 relative h-[74vh] [mask-image:radial-gradient(112%_112%_at_50%_45%,#000_52%,transparent_90%)] [-webkit-mask-image:radial-gradient(112%_112%_at_50%_45%,#000_52%,transparent_90%)] max-[1319px]:[flex:1_1_100%] max-[1319px]:max-w-full max-[1319px]:h-[55vh] min-[1320px]:flex-1 min-[1320px]:basis-[60%] min-[1320px]:max-w-[820px] ${mh820}h-[min(70vh,calc(100vh-150px))] ${mh660}h-[min(64vh,calc(100vh-140px))]`;
export const cabinVisualClass = 'overflow-hidden bg-[#050505] rounded-[2px]';
export const cabinFrameClass = 'absolute inset-0 w-full h-full object-cover will-change-[transform,opacity] [backface-visibility:hidden]';
// These four are always rendered inside `cardClass` (a light-background
// card) in this app, so — matching the original stylesheet's
// `.card h2, .card p.desc, .card .spec-list li, .card .model-tag { color:#111 !important; }`
// override, which in practice is the *only* color that ever actually
// renders for them — they use dark text (#111) directly rather than the
// brand-steel/off/white tones their non-card selectors nominally specified.
export const modelTagClass = 'font-mono text-[12px] text-[#111] tracking-[0.1em] mb-[8px]';
export const productH2Class = `${h2Class} text-[#111] [font-size:clamp(30px,4.2vw,52px)] mb-[16px] ${mh820}[font-size:clamp(24px,5.2vh,44px)] ${mh820}mb-[12px] ${mh660}[font-size:clamp(22px,4.8vh,34px)]`;
export const productDescClass = `text-[#111] text-[16px] leading-[1.6] mb-[26px] ${mh820}text-[14.5px] ${mh820}leading-[1.55] ${mh820}mb-[18px] ${mh660}text-[13.5px] ${mh660}mb-[14px]`;
export const specListClass = `list-none grid mb-[8px] [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] gap-x-5 gap-y-3.5 ${mh820}gap-x-4 ${mh820}gap-y-2.5 ${mh660}gap-x-3.5 ${mh660}gap-y-2 max-[480px]:grid-cols-1`;
export const specListItemClass = `font-barlow-condensed text-[15px] font-semibold tracking-[0.02em] text-[#111] flex items-center gap-[9px] uppercase ${mh660}text-[13.5px] before:content-[''] before:w-[8px] before:h-[8px] before:bg-brand-red before:flex-none`;
export const cardBtnGhostSpacedClass = `${cardBtnGhostClass} ${mh820}p-[12px_22px] ${mh820}text-[13.5px]`;

// ---- contact form (reused on Home + Contact page) ----
export const contactFormClass = 'grid w-full border border-brand-line mt-10 [grid-template-columns:1fr_1fr] gap-[14px] max-w-[620px] bg-[rgba(17,17,19,0.85)] p-[30px] max-[900px]:grid-cols-1 max-[480px]:p-[20px]';
export const contactFormFieldClass = 'bg-brand-panel border border-brand-line text-brand-white font-barlow text-[14.5px] w-full transition-[border-color,box-shadow] duration-200 ease-in-out p-[13px_14px] max-[480px]:p-[14px] hover:border-white/28 focus:outline-2 focus:outline-brand-red focus:border-brand-red focus:shadow-[0_0_18px_rgba(225,27,35,0.18)]';
export const contactFormFullClass = 'col-span-full';

// wide contact-grid variant of the form (Contact + Products pages)
export const contactGridFormClass = 'grid w-full border border-brand-line [grid-template-columns:1fr_1fr] gap-[14px] bg-[rgba(17,17,19,0.85)] p-[30px] max-[900px]:grid-cols-1 max-[480px]:p-[20px] border-t-[3px] border-t-brand-red mt-0 max-w-none backdrop-blur-[14px] shadow-[0_40px_90px_-35px_rgba(0,0,0,0.65)] transition-shadow duration-300 ease-in-out focus-within:shadow-[0_40px_90px_-35px_rgba(0,0,0,0.65),0_0_0_1px_rgba(225,27,35,0.25),0_0_30px_rgba(225,27,35,0.08)]';

export const iconCardClass = 'group transition-[background,transform] duration-[250ms] ease-in-out bg-[rgba(17,17,19,0.75)] backdrop-blur-[2px] p-[34px_26px] hover:bg-brand-charcoal hover:-translate-y-1';
export const iconCardIconClass = 'w-[54px] h-[54px] flex items-center justify-center text-brand-red border border-brand-line mb-[20px] transition-[border-color,box-shadow] duration-[250ms] ease-in-out group-hover:border-brand-red group-hover:shadow-[0_0_16px_rgba(225,27,35,0.25)]';
export const iconCardTitleClass = 'font-barlow-condensed text-[19px] font-bold uppercase tracking-[0.02em] mb-[10px]';
export const iconCardDescClass = 'text-brand-off text-[14.5px] leading-[1.6]';

// ---- shared page-hero (About / Contact / Industries / Projects) ----
export const pageHeroSectionClass = 'min-h-screen overflow-hidden items-center relative flex';
export const pageHeroBgClass = 'absolute z-0 will-change-transform [inset:-10%_-5%] bg-[position:center_42%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.7)_brightness(0.55)_contrast(1.05)]';
export const pageHeroBgOverlayClass = 'absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.55)_45%,rgba(5,5,5,0.35)_70%,rgba(5,5,5,0.75)_100%),linear-gradient(180deg,rgba(5,5,5,0.4)_0%,rgba(5,5,5,0.15)_30%,rgba(5,5,5,0.9)_100%)]';
export const pageHeroCopyClass = 'relative z-1 max-w-[820px] pt-[78px] max-[900px]:pt-[100px]';
export const pageHeroH1Class = `${h1Class} [font-size:clamp(34px,7.8vw,74px)] mt-[16px]`;
export const pageHeroSubClass = 'text-[18px] text-brand-off max-w-[560px] mt-[22px]';
export const pageHeroCtasClass = 'flex gap-[16px] mt-[34px] flex-wrap';

// ---- About page ----
export const storyGridClass = 'grid items-center [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] gap-[64px] max-[900px]:grid-cols-1 max-[900px]:gap-[36px]';
export const storyMediaClass = 'overflow-hidden border border-brand-line bg-brand-panel aspect-[5/4]';
export const storyImgClass = 'w-full h-full object-cover [filter:saturate(0.8)_brightness(0.85)_contrast(1.05)]';
export const storyH2Class = `${h2Class} [font-size:clamp(28px,3.6vw,44px)] mb-[20px]`;
export const storyPClass = 'text-brand-off text-[16px] leading-[1.75] mb-[16px] last:mb-0';

export const whoGridClass = 'grid w-full bg-brand-line border border-brand-line [grid-template-columns:repeat(4,minmax(0,1fr))] gap-px max-[900px]:grid-cols-2 max-[560px]:grid-cols-1';
export const featureGridClass = 'grid w-full [grid-template-columns:repeat(4,minmax(0,1fr))] gap-[14px] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1';
export const featureCardClass = 'flex flex-col gap-[16px] border border-brand-line transition-[border-color,transform,background] duration-[250ms] ease-in-out p-[28px_22px] bg-[rgba(17,17,19,0.6)] hover:border-brand-red hover:-translate-y-1 hover:bg-[rgba(225,27,35,0.06)]';
export const featureCardTitleClass = 'font-barlow-condensed font-bold text-[15.5px] uppercase tracking-[0.02em] text-brand-white';

export const statsGridClass = 'grid text-center [grid-template-columns:repeat(4,minmax(0,1fr))] gap-[20px] max-[900px]:grid-cols-2 max-[900px]:gap-[28px_12px] max-[480px]:grid-cols-1 max-[480px]:gap-[20px]';
export const statItemClass = 'border-l border-brand-line p-[20px] first:border-l-0 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:first:border-t-0 max-[900px]:[&:nth-child(2)]:border-t-0 max-[480px]:border-t-0! max-[480px]:[&+&]:border-t max-[480px]:[&+&]:border-brand-line';
export const statNumClass = 'font-anton text-brand-red leading-none [font-size:clamp(36px,5vw,60px)]';
export const statLabelClass = 'font-mono text-[12px] tracking-[0.1em] uppercase text-brand-steel mt-[12px]';

export const testimonialCarouselClass = 'w-full overflow-hidden max-w-[760px]';
export const testimonialTrackClass = 'flex transition-transform duration-[550ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)]';
export const testimonialCardClass = 'flex-none border border-brand-line basis-full bg-[rgba(17,17,19,0.72)] p-10 max-[900px]:p-[28px] backdrop-blur-[10px]';
export const tRatingClass = 'text-brand-yellow text-[15px] mb-[18px] tracking-[3px]';
export const tReviewClass = 'text-brand-off text-[17px] leading-[1.7] italic mb-[26px]';
export const tNameClass = 'font-barlow-condensed font-bold uppercase text-[15px]';
export const tCompanyClass = 'font-mono text-[11.5px] text-brand-steel mt-[2px]';
export const carouselDotsClass = 'flex gap-[10px] mt-[24px]';
export const carouselDotClass = 'w-[9px] h-[9px] rounded-full border-none bg-brand-line cursor-pointer p-0 transition-[background,transform] duration-[250ms] ease-in-out';

// ---- Industries page ----
export const pageHeroFlexClass = 'flex items-start justify-between gap-[24px] min-[901px]:max-[1366px]:gap-[20px] max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-[8px]';
export const trustStripClass = 'flex gap-0 flex-nowrap mt-[52px] max-[1024px]:flex-wrap max-[1024px]:[row-gap:20px] max-[900px]:mt-[36px] max-[900px]:flex-wrap max-[900px]:gap-y-[20px]';
export const trustItemClass = 'border-r border-brand-line pr-[26px] mr-[26px] last:border-r-0 last:mr-0 last:pr-0 max-[480px]:pr-[16px] max-[480px]:mr-[16px]';
export const trustNumClass = 'font-anton text-brand-red leading-none [font-size:clamp(26px,3.2vw,38px)]';
export const trustLabelClass = 'font-mono text-[10.5px] tracking-[0.08em] uppercase text-brand-steel leading-[1.4] mt-[8px] max-w-[110px]';
export const industriesHighlightsClass = "mt-[24px] max-w-[440px] max-[900px]:mt-[18px] max-[480px]:hidden";
export const industriesHighlightItemClass = "relative text-[14px] text-brand-off leading-[1.5] pl-[20px] [&+&]:mt-[9px] before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-[9px] before:h-[1.5px] before:bg-brand-red";
export const industriesHeroVisualClass = 'relative z-1 flex-none pointer-events-auto w-[min(46vw,680px)] mt-[78px] min-[901px]:max-[1366px]:w-[min(38vw,460px)] max-[900px]:mx-auto max-[900px]:mt-[26px] max-[900px]:w-[min(94vw,440px)]';
export const industriesHeroFrameClass = "relative aspect-[5/4] [&>canvas]:w-full! [&>canvas]:h-full! [&>canvas]:block";
export const industriesHeroHintClass = 'absolute left-1/2 bottom-[6px] -translate-x-1/2 pointer-events-none select-none font-mono text-[10px] tracking-[0.16em] uppercase text-brand-off/80 border border-white/16 rounded-full px-[14px] py-[7px] bg-[rgba(10,10,11,0.45)] backdrop-blur-[6px] opacity-0 animate-[hint-fade_0.6s_ease_forwards] [animation-delay:1.1s]';

export const industryMediaClass = 'group relative flex-1 min-w-0 overflow-hidden border border-brand-line aspect-[16/11] max-[900px]:aspect-[16/10]';
export const industryMediaImgClass = 'w-full h-full object-cover [filter:saturate(0.72)_brightness(0.66)_contrast(1.06)] scale-[1.04] transition-[transform,filter] duration-[700ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.12] group-hover:[filter:saturate(0.95)_brightness(0.76)_contrast(1.08)]';
export const idxBadgeClass = 'absolute top-[18px] left-[18px] z-1 font-mono text-[12px] tracking-[0.1em] text-brand-red border border-brand-line bg-[rgba(10,10,11,0.65)] p-[7px_13px]';
export const industryCopyClass = 'flex-1 basis-[400px] max-w-[520px] max-[900px]:max-w-full';
export const industryH2Class = `${h2Class} [font-size:clamp(28px,3.6vw,42px)] mb-[18px]`;
export const industryDescClass = 'text-brand-off text-[16px] leading-[1.75] mb-[24px]';
export const industryTagsClass = 'flex flex-wrap gap-[10px] mb-[30px]';
export const industryTagClass = 'font-mono text-[11.5px] tracking-[0.06em] uppercase text-brand-off border border-brand-line transition-[border-color,color] duration-200 ease-in-out p-[8px_13px] hover:border-brand-red hover:text-brand-white';
export const industryStatRowClass = 'flex items-center gap-[18px] mb-[30px]';
export const industryStatNumClass = 'font-anton text-[46px] text-brand-red leading-none min-w-[86px]';
export const industryStatLabelClass = 'font-mono text-[11px] tracking-[0.06em] uppercase text-brand-steel leading-[1.4] max-w-[150px]';
