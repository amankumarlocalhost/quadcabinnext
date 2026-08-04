import CabinImageSlider from './CabinImageSlider.jsx';
import {
  showcaseSectionClass, showcasePinClass, splitWrapClass, cardClass,
  modelTagClass, productH2Class, productDescClass, specListClass, specListItemClass, cardBtnGhostSpacedClass,
} from '@/lib/ui/classNames.js';

const EXTERIOR = '/images/site-office-exterior.webp';
const INTERIOR = '/images/site-office-interior.webp';
const FALLBACK_IMAGES = [
  { src: EXTERIOR, alt: 'Site Office Cabin exterior' },
  { src: INTERIOR, alt: 'Site Office Cabin interior' },
];

export default function SiteOfficeSection({ onGoTo, content, enquiryLabel }){
  const images = content?.images?.length ? content.images : FALLBACK_IMAGES;
  return (
    <section id="site-office" className={showcaseSectionClass}>
      <div className={showcasePinClass}>
        <div className="w-full mx-auto max-w-[1360px] [padding-left:clamp(18px,3vw,34px)] [padding-right:clamp(18px,3vw,34px)] flex justify-start">
          <div className={`${splitWrapClass} min-[901px]:flex-nowrap`}>
            <div className={`${cardClass} flex-1 basis-[400px] min-[901px]:basis-[420px] min-[901px]:min-w-0`}>
              <div className={modelTagClass}>{content?.model || 'MODEL 01 / SO-SERIES'}</div>
              <h2 className={productH2Class}>{content?.title || 'Site Office Cabin'}</h2>
              <p className={productDescClass}>{content?.description || "You just walked through it. A fully equipped mobile office for your project's command center — wired, insulated and ready to plug in the moment it lands on site."}</p>
              <ul className={specListClass}>
                {(content?.specs || ['Factory manufactured','Fast site delivery','Weatherproof & durable','Fully customizable']).map((spec) => <li key={spec} className={specListItemClass}>{spec}</li>)}
              </ul>
              <button className={cardBtnGhostSpacedClass} onClick={()=>onGoTo('#contact')} style={{ marginTop: '10px' }}>{enquiryLabel || 'Enquire About This Cabin'}</button>
            </div>
            <CabinImageSlider sectionId="site-office" images={images} fallbackAlt={content?.title || 'Site Office Cabin'} />
          </div>
        </div>
      </div>
    </section>
  );
}
