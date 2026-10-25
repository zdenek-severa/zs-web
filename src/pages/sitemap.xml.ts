import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { absoluteUrl, escapeXml, indexable } from '../lib/seo';

export const GET: APIRoute = () => {
  const pages = indexable ? [
    { path: '/', images: [] as string[] },
    { path: '/about/', images: [] as string[] },
    { path: '/contact/', images: [] as string[] },
    ...projects.map(project => ({ path: `/work/${project.slug}/`, images: project.images })),
  ] : [];
  const urls = pages.map(page => `  <url>\n    <loc>${escapeXml(absoluteUrl(page.path))}</loc>${page.images.map(image => `\n    <image:image><image:loc>${escapeXml(absoluteUrl(image))}</image:loc></image:image>`).join('')}\n  </url>`).join('\n');
  // Do not invent lastmod dates. Add them only when real content modification dates are available.
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
