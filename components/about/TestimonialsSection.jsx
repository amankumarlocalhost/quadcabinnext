'use client';

import { useEffect, useState } from 'react';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import {
  wrapClass, eyebrowClass, eyebrowBarClass, h2Class,
  testimonialCarouselClass, testimonialTrackClass, testimonialCardClass,
  tRatingClass, tReviewClass, tNameClass, tCompanyClass, carouselDotsClass, carouselDotClass,
} from '@/lib/ui/classNames.js';

const testimonials = [
  {
    name: 'Rakesh Mehta',
    company: 'NH-27 Highway Works',
    photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200',
    review: 'Site office cabins arrived fully finished and were operational within a day of delivery. Build quality is well above what we expected at this price.',
  },
  {
    name: 'Sunita Rao',
    company: 'Zenith Mining Co.',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    review: 'We needed a 40-bed labour camp on a tight deadline. Quad Cabins delivered on schedule and the units have held up through two monsoons.',
  },
  {
    name: 'Arvind Nair',
    company: 'Coastal Infra Ltd.',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    review: 'Customization was easy to work with — they adjusted the layout to fit our corridor site without any delay to the manufacturing timeline.',
  },
];

function Stars(){
  return (
    <div className={tRatingClass} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
    </div>
  );
}

export default function TestimonialsSection(){
  const cms = useCmsSection('testimonials');
  const contentTestimonials = cms?.items?.length ? cms.items : testimonials;
  const [active, setActive] = useState(0);

  useEffect(()=>{
    const id = setInterval(()=>setActive(a => (a + 1) % contentTestimonials.length), 5500);
    return ()=>clearInterval(id);
  }, [contentTestimonials.length]);

  return (
    <section id="testimonials" className="min-h-0 py-[100px]">
      <div className={`${wrapClass} flex-col items-start`}>
        <div className={eyebrowClass} data-reveal><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Client Testimonials'}</div>
        <h2 className={`${h2Class} mb-[40px]`} data-reveal>{cms?.heading || 'Trusted on site, project after project.'}</h2>

        <div className={testimonialCarouselClass} data-reveal>
          <div className={testimonialTrackClass} style={{ transform: `translateX(-${active * 100}%)` }}>
            {contentTestimonials.map(t => (
              <div className={testimonialCardClass} key={t.name}>
                <Stars />
                <p className={tReviewClass}>&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-[14px]">
                  <img className="w-[48px] h-[48px] rounded-full object-cover border border-brand-line" src={t.photo?.url || t.photo} alt={t.photo?.alt || t.name} />
                  <div>
                    <div className={tNameClass}>{t.name}</div>
                    <div className={tCompanyClass}>{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={carouselDotsClass}>
            {contentTestimonials.map((t, i) => (
              <button
                key={t.name}
                className={carouselDotClass + (i === active ? ' bg-brand-red scale-120' : '')}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={()=>setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
