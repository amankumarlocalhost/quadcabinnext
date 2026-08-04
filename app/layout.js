import { Anton, Antonio, Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton-nf', display: 'swap' });
const antonio = Antonio({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-antonio-nf', display: 'swap' });
const barlow = Barlow({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-barlow-nf', display: 'swap' });
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-barlow-condensed-nf', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono-nf', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://quadcabins.com'),
  title: {
    default: 'Quad Cabins — Smart Spaces. Stronger Projects.',
    template: '%s | Quad Cabins',
  },
  description: 'Factory-built portable and modular cabins for construction, industrial and infrastructure sites across India.',
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'Quad Cabins',
    title: 'Quad Cabins — Smart Spaces. Stronger Projects.',
    description: 'Factory-built portable and modular cabins for construction, industrial and infrastructure sites across India.',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0b',
};

// Static Organization + WebSite structured data — rendered server-side so it
// ships in the initial HTML (unlike the CMS-driven page content, which is
// client-fetched and therefore invisible to crawlers that don't execute JS).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Quad Cabins',
  url: 'https://quadcabins.com',
  logo: 'https://quadcabins.com/icon-512.png',
  description: 'Factory-built portable and modular cabins for construction, industrial and infrastructure sites across India.',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Quad Cabins',
  url: 'https://quadcabins.com',
};

export default function RootLayout({ children }) {
  const fontVars = `${anton.variable} ${antonio.variable} ${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="en" className={fontVars}>
      <body className="box-border m-0 p-0 bg-[#050505] text-brand-white font-barlow [overflow-x:clip] w-full cursor-default">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
