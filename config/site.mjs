/**
 * One source of truth for canonical URLs, robots.txt and the sitemap.
 * @param {Record<string, string | boolean | undefined>} env
 */
export function resolveSite(env) {
  const input = typeof env.PUBLIC_SITE_URL === 'string' ? env.PUBLIC_SITE_URL.trim() : '';
  if (!input) return { url: 'http://localhost:4321/', configured: false };
  let url;
  try { url = new URL(input); } catch { throw new Error('PUBLIC_SITE_URL musí být úplná HTTPS adresa finální domény.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('PUBLIC_SITE_URL musí být HTTPS adresa domény bez cesty, přihlašovacích údajů, parametrů nebo fragmentu.');
  }
  if (url.hostname === 'localhost' || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.local') || /^[\d.:]+$/.test(url.hostname)) {
    throw new Error('PUBLIC_SITE_URL musí odkazovat na veřejnou doménu, nikoli na lokální adresu.');
  }
  return { url: url.href, configured: true };
}
