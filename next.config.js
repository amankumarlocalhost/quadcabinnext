const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quadcabinbackend.vercel.app/api/v1';
const apiUrlPath = new URL(API_URL).pathname.replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Proxies browser requests for the CMS/quotes API to the backend so the
  // browser only ever hits this app's own origin — see lib/apiBase.js. The
  // backend doesn't send Access-Control-Allow-Origin, so calling it directly
  // from client-side code fails CORS; this rewrite avoids that entirely.
  async rewrites() {
    return [{ source: `${apiUrlPath}/:path*`, destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
