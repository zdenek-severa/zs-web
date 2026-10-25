import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parseDocument, DomUtils } from 'htmlparser2';
import { XMLParser } from 'fast-xml-parser';
import { SyntaxValidator } from 'fast-xml-validator';
import { loadEnv } from 'vite';
import { resolveSite } from '../config/site.mjs';

const root = path.resolve('dist');
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const site = resolveSite(env);
const indexable = site.configured && env.PUBLIC_SITE_INDEXABLE !== 'false';
const expectedPages = new Set();
const titles = new Set();
const descriptions = new Set();
let count = 0;

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(file));
    else if (entry.name.endsWith('.html')) result.push(file);
  }
  return result;
}

for (const file of await files(root)) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const document = parseDocument(await readFile(file, 'utf8'));
  const elements = name => DomUtils.getElementsByTagName(name, document.children, true);
  const meta = (name, attribute = 'name') => elements('meta').filter(element => element.attribs[attribute] === name);
  const oneMeta = (name, attribute = 'name') => {
    const found = meta(name, attribute);
    assert.equal(found.length, 1, `${relative}: expected one ${name} meta tag`);
    assert.ok(found[0].attribs.content?.trim(), `${relative}: empty ${name}`);
    return found[0].attribs.content;
  };
  const is404 = relative === '404.html';
  const pathname = relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;
  const canonical = new URL(pathname, site.url).href;
  const canonicalTags = elements('link').filter(element => element.attribs.rel === 'canonical');
  assert.equal(elements('html')[0]?.attribs.lang, 'cs', `${relative}: document language`);
  assert.equal(elements('h1').length, 1, `${relative}: expected one stable H1`);
  assert.equal(elements('title').length, 1, `${relative}: expected one title`);
  const title = DomUtils.textContent(elements('title')[0]);
  const description = oneMeta('description');
  assert.ok(title.length > 10 && title.length < 100, `${relative}: title length`);
  assert.ok(description.length > 50 && description.length < 350, `${relative}: description length`);
  assert.ok(!titles.has(title), `${relative}: duplicate title`);
  assert.ok(!descriptions.has(description), `${relative}: duplicate description`);
  titles.add(title); descriptions.add(description);
  const robots = oneMeta('robots');
  assert.equal(robots.includes('noindex'), !indexable || is404, `${relative}: incorrect indexability`);
  oneMeta('viewport');
  assert.equal(oneMeta('og:title', 'property'), title);
  assert.equal(oneMeta('og:description', 'property'), description);
  oneMeta('og:image:alt', 'property');
  assert.equal(oneMeta('twitter:card'), 'summary_large_image');
  for (const image of [oneMeta('og:image', 'property'), oneMeta('twitter:image')]) {
    const url = new URL(image);
    assert.equal(url.origin, new URL(site.url).origin, `${relative}: external social image`);
    assert.ok((await stat(path.join(root, decodeURIComponent(url.pathname)))).isFile(), `${relative}: social image missing`);
  }
  for (const image of elements('img')) assert.ok('alt' in image.attribs, `${relative}: image missing alt`);

  const jsonLd = elements('script').filter(element => element.attribs.type === 'application/ld+json');
  if (site.configured && !is404) {
    assert.equal(canonicalTags.length, 1, `${relative}: missing or duplicate canonical`);
    assert.equal(canonicalTags[0].attribs.href, canonical, `${relative}: wrong canonical`);
    assert.equal(oneMeta('og:url', 'property'), canonical);
    assert.equal(jsonLd.length, 1, `${relative}: missing JSON-LD`);
    const data = JSON.parse(DomUtils.textContent(jsonLd[0]));
    assert.equal(data['@context'], 'https://schema.org');
    const graph = data['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'Person'));
    assert.ok(graph.some(item => item['@type'] === 'WebSite'));
    assert.ok(graph.some(item => item['@id'] === `${canonical}#webpage`));
    if (pathname.startsWith('/work/')) {
      const breadcrumbs = graph.find(item => item['@type'] === 'BreadcrumbList');
      assert.equal(breadcrumbs?.itemListElement.at(-1).item, canonical, `${relative}: breadcrumb target`);
      assert.ok(graph.some(item => item['@type'] === 'CreativeWork'));
    }
  } else {
    assert.equal(canonicalTags.length, 0, `${relative}: local or 404 canonical must be absent`);
    assert.equal(jsonLd.length, 0, `${relative}: local or 404 JSON-LD must be absent`);
  }
  if (indexable && !is404) expectedPages.add(canonical);
  count++;
}

const xml = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
assert.equal(SyntaxValidator.validate(xml), true, 'Sitemap must be well-formed XML');
const sitemap = new XMLParser({ ignoreAttributes: false, isArray: name => ['url', 'image:image'].includes(name) }).parse(xml);
assert.equal(sitemap.urlset['@_xmlns'], 'http://www.sitemaps.org/schemas/sitemap/0.9');
const sitemapPages = new Set();
let imageCount = 0;
for (const entry of sitemap.urlset.url || []) {
  const url = new URL(entry.loc);
  assert.equal(url.origin, new URL(site.url).origin);
  assert.equal(url.protocol, 'https:');
  assert.ok(!url.search && !url.hash && url.pathname.endsWith('/'));
  assert.ok(!sitemapPages.has(url.href), `Duplicate sitemap URL: ${url.href}`);
  assert.ok(expectedPages.has(url.href), `Unexpected sitemap URL: ${url.href}`);
  assert.ok((await stat(path.join(root, url.pathname, 'index.html'))).isFile());
  sitemapPages.add(url.href);
  for (const image of entry['image:image'] || []) {
    const imageUrl = new URL(image['image:loc']);
    assert.equal(imageUrl.origin, url.origin);
    assert.ok((await stat(path.join(root, decodeURIComponent(imageUrl.pathname)))).isFile());
    imageCount++;
  }
}
assert.deepEqual(sitemapPages, expectedPages, 'Sitemap must contain exactly all indexable pages');
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /^User-agent: \*$/m);
if (indexable) {
  assert.match(robots, /^Allow: \/$/m);
  assert.ok(!/^Disallow: \/$/m.test(robots));
  assert.ok(robots.includes(`Sitemap: ${new URL('/sitemap.xml', site.url).href}`));
  assert.ok(imageCount > 0, 'Image sitemap must contain project images');
} else {
  assert.match(robots, /^Disallow: \/$/m);
  assert.ok(!/^Sitemap:/m.test(robots));
}
console.log(`SEO verified: ${count} HTML pages, ${sitemapPages.size} indexable sitemap URLs, ${imageCount} project images. Mode: ${indexable ? 'public' : 'local / noindex'}.`);
