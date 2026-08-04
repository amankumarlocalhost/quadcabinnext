'use client';

import dynamic from 'next/dynamic';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, cardClass } from '@/lib/ui/classNames.js';

const ContactCabinScene = dynamic(() => import('@/journey/contact/ContactCabinScene.jsx'), { ssr: false });

export default function ContactHero(){
  const cms = useCmsSection('hero');
  const contacts = cms?.quickContact;
  return (
    <section id="contact-hero" className="min-h-screen relative overflow-hidden pt-[78px] max-[900px]:pt-[100px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none [background:radial-gradient(70%_55%_at_72%_60%,rgba(225,27,35,0.14),transparent_65%),radial-gradient(50%_45%_at_8%_15%,rgba(232,180,0,0.05),transparent_70%),repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_88px),repeating-linear-gradient(0deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_88px)]"
      />
      <div
        className="absolute z-0 will-change-transform [inset:-10%_-5%] bg-[position:center_42%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.7)_brightness(0.55)_contrast(1.05)]"
        data-parallax-bg
        style={{ backgroundImage: `url('${cms?.backgroundImage?.url || 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1920'}')` }}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.55)_45%,rgba(5,5,5,0.35)_70%,rgba(5,5,5,0.75)_100%),linear-gradient(180deg,rgba(5,5,5,0.4)_0%,rgba(5,5,5,0.15)_30%,rgba(5,5,5,0.9)_100%)]" />
      </div>
      <div className={`${wrapClass} relative z-1`}>
        <div className="relative z-1 items-center flex-wrap gap-[56px] flex max-[900px]:flex-col max-[900px]:items-stretch">
          <div
            className={`${cardClass} relative border-l-[3px] border-l-brand-red text-brand-white [flex:1_1_380px] max-w-[460px] p-11 bg-[rgba(17,17,19,0.6)] backdrop-blur-[18px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)] transition-[transform,box-shadow] duration-300 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_50px_110px_-30px_rgba(0,0,0,0.75),0_0_0_1px_rgba(225,27,35,0.18)] max-[900px]:max-w-full`}
            data-rise
          >
            {/* accent bar — replaces the old ::before pseudo-element */}
            <span aria-hidden="true" className="absolute top-0 -left-[3px] w-[3px] h-[56px] bg-gradient-to-b from-brand-red to-transparent" />
            <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-brand-red flex items-center gap-[10px] mb-[18px]"><span className="w-[26px] h-[2px] bg-brand-red"></span>{cms?.eyebrow || 'Get In Touch'}</div>
            <h1 className="font-antonio font-bold tracking-[0.01em] uppercase leading-[0.95] [font-size:clamp(40px,6vw,68px)] mt-[14px] text-brand-white">{cms?.heading || <>Let&apos;s Talk<br/><span className="text-brand-red">Cabins</span>.</>}</h1>
            <p className="text-[16.5px] mt-[18px] leading-[1.6] text-brand-off">
              {cms?.description || 'Tell us about your site and timeline — our team will get back with a configuration and a quote, usually within one business day.'}
            </p>
            <ul className="list-none flex flex-col gap-[20px] p-0 mt-8">
              {(contacts || [{ label:'Call', value:'+91 00000 00000', href:'tel:+910000000000' },{ label:'Email', value:'sales@quadcabins.in', href:'mailto:sales@quadcabins.in' },{ label:'Works', value:'Northeast India · Pan-India delivery' }]).map((item) => (
                <li key={item.label} className="group flex flex-col gap-[4px] border-l-2 border-brand-line pl-[16px] transition-[border-color,transform] duration-[250ms] ease-in-out hover:translate-x-[3px] hover:border-brand-red">
                  <span className="font-mono text-[11px] uppercase text-brand-steel tracking-[0.14em]">{item.label}</span>
                  {item.href
                    ? <a className="font-barlow-condensed font-semibold text-[20px] no-underline text-brand-white transition-colors duration-300 ease-in-out group-hover:text-brand-red" href={item.href}>{item.value}</a>
                    : <span className="font-barlow-condensed font-semibold text-[20px] no-underline text-brand-white">{item.value}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="relative flex-1 min-w-0 h-[640px] [mask-image:radial-gradient(115%_115%_at_50%_45%,#000_55%,transparent_92%)] [-webkit-mask-image:radial-gradient(115%_115%_at_50%_45%,#000_55%,transparent_92%)] max-[1280px]:h-[clamp(420px,56vh,640px)] max-[900px]:w-full max-[900px]:h-[52vh]"
            data-rise
          >
            <ContactCabinScene />
            <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.12em] uppercase text-brand-steel border border-brand-line whitespace-nowrap bottom-[6%] bg-[rgba(10,10,11,0.6)] px-[16px] py-[8px]">{cms?.modelCaption || 'Site Office Cabin — live 3D preview'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
