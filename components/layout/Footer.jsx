'use client';

import Link from 'next/link';
import { IconMapPin, IconPhone, IconMail } from '../about/icons.jsx';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

const usefulLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact Us', href: '/contact' },
];

const headerTitleClass = 'font-barlow-condensed font-bold text-[17px] tracking-[0.03em] uppercase text-brand-red m-0';
const colLinkClass = 'text-[14.5px] text-brand-off no-underline transition-colors duration-200 ease-in-out hover:text-brand-white';

export default function Footer(){
  const cms = useCmsSection('footer', 'global');
  return (
    <footer id="site-footer" className="relative z-10 bg-brand-black border-t border-brand-line block p-0">
      <div className="mx-auto grid max-w-[1360px] p-[40px_34px_40px] [grid-template-columns:1.4fr_0.8fr_1fr_0.9fr] [grid-auto-rows:min-content] gap-x-12 gap-y-0 max-[900px]:grid-cols-2 max-[900px]:gap-x-8 max-[560px]:grid-cols-1 max-[560px]:text-left max-[560px]:p-[48px_22px_36px] max-[480px]:p-[44px_18px_32px]">
        {/* 1: brand logo header */}
        <div className="flex items-end mb-[22px] max-[900px]:[grid-area:1/1] max-[560px]:[grid-area:1/1] max-[560px]:mb-[14px]">
          <img
            className="block h-[170px] w-auto -mt-[60px] max-[1024px]:h-[130px] max-[1024px]:-mt-[40px] max-[576px]:h-[100px] max-[576px]:-mt-[25px]"
            src={cms?.logo?.url || '/images/QC_Logo_on_Black (1).png'}
            alt="Quad Cabins"
          />
        </div>

        {/* 2: useful links title */}
        <div className="flex items-end mb-[22px] max-[900px]:[grid-area:1/2] max-[560px]:[grid-area:3/1] max-[560px]:mb-[14px]">
          <h4 className={headerTitleClass}>Useful Links</h4>
        </div>

        {/* 3: contact title */}
        <div className="flex items-end mb-[22px] max-[900px]:[grid-area:3/1] max-[560px]:[grid-area:5/1] max-[560px]:mb-[14px]">
          <h4 className={headerTitleClass}>Contact Us</h4>
        </div>

        {/* 4: parent unit title */}
        <div className="flex items-end mb-[22px] max-[900px]:[grid-area:4/1] max-[560px]:[grid-area:7/1] max-[560px]:mb-[14px]">
          <h4 className={headerTitleClass}>Quad Cabins is an unit of</h4>
        </div>

        {/* 5: brand description */}
        <div className="max-[900px]:[grid-area:2/1] max-[900px]:mb-[40px] max-[560px]:[grid-area:2/1] max-[560px]:mb-[34px]">
          <p className="text-brand-off text-[14.5px] leading-[1.75] max-w-[340px] -mt-10 max-[900px]:mt-0">
            {cms?.description || "Quad Cabins specializes in building customizable smart spaces according to the requirement of our clients and suit modern living. Our sturdy and innovative spaces offer you a comfortable workspace on any work site or under any climatic conditions."}
          </p>
        </div>

        {/* 6: useful links list */}
        <div className="max-[900px]:[grid-area:2/2] max-[900px]:mb-[40px] max-[560px]:[grid-area:4/1] max-[560px]:mb-[34px]">
          <ul className="list-none p-0 flex flex-col gap-[14px]">
            {usefulLinks.map((link) => (
              <li key={link.href}><Link className={colLinkClass} href={link.href}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* 7: contact list */}
        <div className="max-[900px]:[grid-area:3/1] max-[560px]:[grid-area:6/1] max-[560px]:mb-[34px]">
          <ul className="list-none p-0 flex flex-col gap-[14px]">
            <li className="flex items-start gap-[12px]">
              <IconMapPin className="flex-none w-[18px] h-[18px] text-brand-red mt-[2px]" />
              <span className={colLinkClass}>{cms?.address || '4th Floor, Royal Plaza, GS Road, Ganeshguri, Guwahati - 781006'}</span>
            </li>
            <li className="flex items-start gap-[12px]">
              <IconPhone className="flex-none w-[18px] h-[18px] text-brand-red mt-[2px]" />
              <a className={colLinkClass} href={`tel:${(cms?.phone || '+91 60039 03422').replace(/\s+/g,'')}`}>{cms?.phone || '+91 60039 03422'}</a>
            </li>
            <li className="flex items-start gap-[12px]">
              <IconMail className="flex-none w-[18px] h-[18px] text-brand-red mt-[2px]" />
              <a className={colLinkClass} href={`mailto:${cms?.email || 'gm@socristo.com'}`}>{cms?.email || 'gm@socristo.com'}</a>
            </li>
          </ul>
        </div>

        {/* 8: parent badge */}
        <div className="max-[900px]:[grid-area:4/2] max-[560px]:[grid-area:8/1]">
          <div className="flex items-center gap-[14px]">
            <div className="w-[52px] h-[52px] flex-none flex items-center justify-center bg-brand-yellow text-brand-black font-anton text-[26px] rounded-[6px]">S</div>
            <div className="flex flex-col leading-[1.3]">
              <strong className="font-barlow-condensed font-bold text-[17px] tracking-[0.03em] text-brand-yellow">SOCRISTO</strong>
              <span className="font-mono text-[11px] tracking-[0.14em] text-brand-steel">ENTERPRISE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-line mx-auto flex justify-between flex-wrap font-mono text-[11.5px] tracking-[0.04em] text-brand-steel p-[22px_34px] max-w-[1360px] gap-[10px] max-[560px]:flex-col max-[560px]:text-center max-[560px]:p-[20px_22px] max-[560px]:gap-[6px] max-[480px]:p-[16px_18px]">
        <div>{cms?.copyright || '© 2026 QUAD CABINS — PORTABLE & MODULAR CABIN MANUFACTURER'}</div>
        <div>{cms?.secondaryText || 'NORTHEAST INDIA · PAN-INDIA DELIVERY'}</div>
      </div>
    </footer>
  );
}
