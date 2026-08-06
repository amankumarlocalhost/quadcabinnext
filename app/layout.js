import { Anton, Antonio, Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import PageLoader from '@/components/layout/PageLoader.jsx';
import { SITE_URL } from '@/lib/siteUrl.js';

const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton-nf', display: 'swap' });
const antonio = Antonio({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-antonio-nf', display: 'swap' });
const barlow = Barlow({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-barlow-nf', display: 'swap' });
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-barlow-condensed-nf', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono-nf', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE_URL),
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
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description: 'Factory-built portable and modular cabins for construction, industrial and infrastructure sites across India.',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Quad Cabins',
  url: SITE_URL,
};

// NAP (Name/Address/Phone) mirrors the fallback copy in components/layout/Footer.jsx —
// kept as static copy here (not CMS-driven) to match how Organization/WebSite are hardcoded above.
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Quad Cabins',
  url: SITE_URL,
  telephone: '+91 60039 03422',
  email: 'gm@socristo.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4th Floor, Royal Plaza, GS Road, Ganeshguri',
    addressLocality: 'Guwahati',
    postalCode: '781006',
    addressRegion: 'Assam',
    addressCountry: 'IN',
  },
};

export default function RootLayout({ children }) {
  const fontVars = `${anton.variable} ${antonio.variable} ${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="en" className={fontVars}>
      <body className="box-border m-0 p-0 bg-[#050505] text-brand-white font-barlow [overflow-x:clip] w-full cursor-default">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <PageLoader />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
