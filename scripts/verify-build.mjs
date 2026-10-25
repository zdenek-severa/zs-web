import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await htmlFiles(file));
    else if (entry.name.endsWith('.html')) result.push(file);
  }
  return result;
}
let checked = 0;
const errors = [];
for (const file of await htmlFiles(root)) {
  const html = await readFile(file, 'utf8');
  for (const [, attribute, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const url = new URL(value, 'http://local');
    let target = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
    try {
      await stat(target);
      if (attribute === 'href' && url.hash && target.endsWith('.html')) {
        const targetHtml = await readFile(target, 'utf8');
        if (!targetHtml.includes(`id="${url.hash.slice(1)}"`)) throw new Error(`Missing anchor ${url.hash}`);
      }
      checked++;
    } catch { errors.push(`${path.relative(root, file)}: ${value}`); }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${checked} local links and asset references across all generated pages.`);
