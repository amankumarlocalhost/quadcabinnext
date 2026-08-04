import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, storyGridClass, storyMediaClass, storyImgClass, eyebrowClass, eyebrowBarClass, storyH2Class, storyPClass } from '@/lib/ui/classNames.js';

export default function OurStorySection(){
  const cms = useCmsSection('story');
  return (
    <section id="our-story" className="min-h-0 py-[120px]">
      <div className={`${wrapClass} ${storyGridClass}`}>
        <div className={storyMediaClass} data-reveal>
          <img className={storyImgClass} src={cms?.image?.url || '/images/site-office-interior.webp'} alt={cms?.image?.alt || 'Inside a Quad Cabins site office'} loading="lazy" />
        </div>
        <div data-reveal>
          <div className={eyebrowClass}><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Our Story'}</div>
          <h2 className={storyH2Class}>{cms?.heading || 'From a single workshop to a full-scale cabin works.'}</h2>
          {(cms?.paragraphs || ['Quad Cabins started with a simple frustration: site teams were losing weeks waiting on slow, poorly built site infrastructure. We set out to fix that — building portable cabins in a controlled factory environment instead of on muddy, unpredictable sites.','That focus on precision manufacturing became our identity. Every unit that leaves our works is built to the same standard, tested before dispatch, and backed by a team that treats durability and finish as non-negotiable.','Today we deliver customized modular solutions across construction, infrastructure, mining and industrial sectors — still driven by the same goal we started with: faster site setup, without cutting corners.']).map((paragraph, index) => <p className={storyPClass} key={index}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}
