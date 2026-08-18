const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quadcabinbackend.vercel.app/api/v1';
const apiUrlPath = new URL(API_URL).pathname.replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Lets Next's compiler tree-shake gsap per-submodule instead of pulling
  // its full barrel export into the client bundle — same output, smaller chunks.
  experimental: {
    optimizePackageImports: ['gsap'],
  },
  // Proxies browser requests for the CMS/quotes API to the backend so the
  // browser only ever hits this app's own origin — see lib/apiBase.js. The
  // backend doesn't send Access-Control-Allow-Origin, so calling it directly
  // from client-side code fails CORS; this rewrite avoids that entirely.
  async rewrites() {
    return [{ source: `${apiUrlPath}/:path*`, destination: `${API_URL}/:path*` }];
  },
  // CMS-managed redirects (admin panel -> Redirects). Next.js resolves this
  // once at build/config-eval time, not per-request, so a redirect added in
  // the admin panel only takes effect after the next deploy — not live.
  async redirects() {
    try {
      const response = await fetch(`${API_URL}/redirects`);
      if (!response.ok) return [];
      const payload = await response.json();
      return (payload.data || []).map((redirect) => ({
        source: redirect.from,
        destination: redirect.to,
        permanent: redirect.statusCode === 301,
      }));
    } catch {
      return [];
    }
  },
};

export default nextConfig;
