import CabinImageSlider from './CabinImageSlider.jsx';
import {
  showcaseSectionClass, showcasePinClass, splitWrapClass, cardClass,
  modelTagClass, productH2Class, productDescClass, specListClass, specListItemClass, cardBtnGhostSpacedClass,
} from '@/lib/ui/classNames.js';

export default function ProductSection({ id, right, model, title, desc, specs, images, onGoTo, enquiryLabel }){
  return (
    <section id={id} className={showcaseSectionClass}>
      <div className={showcasePinClass}>
        <div className={`w-full mx-auto max-w-[1360px] [padding-left:clamp(18px,3vw,34px)] [padding-right:clamp(18px,3vw,34px)] flex ${right ? 'justify-end' : 'justify-start'}`}>
          <div className={`${splitWrapClass} min-[1320px]:flex-nowrap ${right ? 'min-[1320px]:flex-row-reverse' : ''}`}>
            <div className={`${cardClass} flex-1 basis-[400px] min-[1320px]:basis-[420px] min-[1320px]:min-w-0`}>
              <div className={modelTagClass}>{model}</div>
              <h2 className={productH2Class}>{title}</h2>
              <p className={`${productDescClass}`}>{desc}</p>
              <ul className={specListClass}>
                {(specs || []).map(spec => <li key={spec} className={specListItemClass}>{spec}</li>)}
              </ul>
              <button className={cardBtnGhostSpacedClass} onClick={()=>onGoTo('#contact')} style={{ marginTop: '10px' }}>{enquiryLabel || 'Enquire About This Cabin'}</button>
            </div>
            <CabinImageSlider sectionId={id} images={images} fallbackAlt={title} />
          </div>
        </div>
      </div>
    </section>
  );
}
