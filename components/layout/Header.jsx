'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

export default function Header({ onNavHome }){
  const cms = useCmsSection('header', 'global');
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const links = cms?.links || [
    { label:'Home', href:'/' }, { label:'Products', href:'/products' }, { label:'Industries', href:'/industries' },
    { label:'About Us', href:'/about' }, { label:'Contact', href:'/contact' },
  ];

  // close the menu on route change and lock page scroll while it is open
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = 'group relative py-[4px] font-barlow-condensed font-semibold text-[14.5px] tracking-[0.09em] uppercase text-brand-off transition-colors duration-[250ms] ease-in-out cursor-pointer hover:text-brand-white min-[901px]:max-[1366px]:text-[12.5px] min-[901px]:max-[1180px]:text-[11.5px] max-[900px]:text-[22px]';
  const underlineClass = 'absolute left-0 bottom-0 h-[2px] w-0 bg-brand-red transition-[width] duration-[250ms] ease-in-out group-hover:w-full';

  return (
    <header
      id="siteHeader"
      className={
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[78px] px-[34px] '
        + '[background:linear-gradient(180deg,rgba(10,10,11,0.92),rgba(10,10,11,0.55))] '
        + 'min-[901px]:max-[1366px]:px-[20px] max-[480px]:px-[18px] max-[390px]:px-[14px] '
        + (menuOpen ? 'max-[900px]:bg-brand-black max-[900px]:[background:none]' : '')
      }
    >
      <div className="relative h-full min-w-[180px] flex items-center min-[901px]:max-[1366px]:min-w-[96px] max-[480px]:min-w-[88px]">
        <img
          className="absolute left-0 top-1/2 -translate-y-1/2 block h-[130px] w-auto max-w-none min-[901px]:max-[1366px]:h-[96px] max-[480px]:h-[88px]"
          src={cms?.logo?.url || '/images/QC_Logo_on_Black (1).png'}
          alt={cms?.logo?.alt || 'Quad Cabins'}
        />
      </div>

      <nav
        className={
          'flex gap-[30px] min-[901px]:max-[1366px]:gap-[16px] min-[901px]:max-[1180px]:gap-[12px] '
          + (menuOpen
            ? 'max-[900px]:flex max-[900px]:fixed max-[900px]:inset-0 max-[900px]:top-0 max-[900px]:bg-brand-black max-[900px]:flex-col max-[900px]:justify-center max-[900px]:items-center max-[900px]:gap-[30px] max-[900px]:z-55 max-[900px]:h-dvh max-[900px]:animate-[mobile-menu-in_0.25s_ease_both]'
            : 'max-[900px]:hidden')
        }
      >
        {links.map((link) => link.href === '/'
          ? (
            <a className={navLinkClass} onClick={() => { closeMenu(); onNavHome?.(); }} key={link.href}>
              {link.label}
              <span aria-hidden="true" className={underlineClass} />
            </a>
          )
          : (
            <Link className={navLinkClass} href={link.href} onClick={closeMenu} key={link.href}>
              {link.label}
              <span aria-hidden="true" className={underlineClass} />
            </Link>
          ))}
      </nav>

      <Link
        className={
          'relative inline-flex items-center gap-[7px] font-barlow-condensed font-bold text-[12.5px] tracking-[0.06em] uppercase rounded-[6px] '
          + 'bg-gradient-to-b from-[#ee2a32] to-brand-red text-brand-white border-2 border-brand-red '
          + 'shadow-[0_8px_20px_-10px_rgba(225,27,35,0.9),inset_0_1px_0_0_rgba(255,255,255,0.18)] '
          + 'px-[16px] py-[8px] cursor-pointer transition-all duration-[220ms] ease-out '
          + 'hover:from-brand-red hover:to-brand-red-dark hover:border-brand-red-dark hover:-translate-y-[2px] '
          + 'hover:shadow-[0_12px_26px_-8px_rgba(225,27,35,1),inset_0_1px_0_0_rgba(255,255,255,0.18)] '
          + 'active:scale-[0.97] '
          + "after:content-['→'] after:inline-block after:transition-transform after:duration-300 after:ease-out hover:after:translate-x-[3px] "
          + 'min-[901px]:max-[1366px]:px-[13px] min-[901px]:max-[1366px]:py-[7px] min-[901px]:max-[1366px]:text-[11.5px] '
          + (menuOpen
            ? 'max-[900px]:inline-flex max-[900px]:fixed max-[900px]:left-1/2 max-[900px]:-translate-x-1/2 max-[900px]:z-56 max-[900px]:bottom-[48px] max-[900px]:text-[16px] max-[900px]:p-[14px_28px] max-[900px]:animate-[mobile-menu-in_0.25s_ease_both]'
            : 'max-[900px]:hidden')
        }
        href={cms?.cta?.href || '/contact'}
        onClick={closeMenu}
      >
        {cms?.cta?.label || 'Get Free Quote'}
      </Link>

      <div
        className="hidden max-[900px]:flex flex-col justify-center gap-[5px] cursor-pointer z-60 p-[10px] -m-[10px]"
        role="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className={'w-[24px] h-[2px] bg-brand-white transition-[transform,opacity] duration-[250ms] ease-in-out' + (menuOpen ? ' translate-y-[7px] rotate-45' : '')} />
        <span className={'w-[24px] h-[2px] bg-brand-white transition-[transform,opacity] duration-[250ms] ease-in-out' + (menuOpen ? ' opacity-0' : '')} />
        <span className={'w-[24px] h-[2px] bg-brand-white transition-[transform,opacity] duration-[250ms] ease-in-out' + (menuOpen ? ' -translate-y-[7px] -rotate-45' : '')} />
      </div>
    </header>
  );
}
