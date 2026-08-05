import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/industries', label: 'Industries' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 py-24 text-center bg-[#050505] text-brand-white">
      <span className="font-mono text-[13px] tracking-[0.2em] text-brand-steel uppercase">404</span>
      <h1 className="font-anton text-[clamp(32px,6vw,64px)] leading-none">Page not found</h1>
      <p className="max-w-[420px] text-brand-off text-[15px] leading-relaxed">
        The page you're looking for doesn't exist or may have moved. Try one of these instead.
      </p>
      <nav className="flex flex-wrap justify-center gap-4 mt-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-5 py-2.5 border border-brand-line rounded text-[14px] text-brand-white no-underline transition-colors duration-200 hover:border-brand-red hover:text-brand-red"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
