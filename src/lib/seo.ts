import { resolveSite } from '../../config/site.mjs';

export const site = resolveSite(import.meta.env);
export const indexable = site.configured && import.meta.env.PROD && import.meta.env.PUBLIC_SITE_INDEXABLE !== 'false';
export const absoluteUrl = (pathname: string) => new URL(pathname, site.url).href;
export const person = {
  '@type': 'Person',
  '@id': absoluteUrl('/#person'),
  name: 'Zdeněk Severa',
  alternateName: 'Zdenek Severa',
  url: site.url,
  email: 'zdenek.severa@gmail.com',
  telephone: '+420724955557',
  identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: '03108040' },
};

export function escapeXml(text: string) {
  return text.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);
}
