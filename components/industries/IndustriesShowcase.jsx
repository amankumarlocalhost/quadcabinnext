import { industries } from '@/lib/data/industries.js';
import IndustryRow from './IndustryRow.jsx';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

export default function IndustriesShowcase({ data }){
  const cms = useCmsSection('industries');
  const items = data || cms?.items || industries;
  return (
    <>
      {items.map((ind, i) => (
        <IndustryRow key={ind.id || ind.idx} {...ind} img={ind.image?.url || ind.img} imageAlt={ind.image?.alt} desc={ind.description || ind.desc} ctaLabelTemplate={cms?.ctaLabelTemplate} reverse={i % 2 === 1} even={i % 2 === 1} />
      ))}
    </>
  );
}
