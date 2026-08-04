export default function sitemap() {
  const base = 'https://quadcabins.com';
  const routes = ['', '/products', '/about', '/contact', '/industries'];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
