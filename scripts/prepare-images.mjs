import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Only exported JPG/PNG images are used. Source PSD files are left untouched.
const source = process.argv[2] || 'C:/Users/plastictoy/Desktop/viz';
const sets = [
  ['MIKULČIN VRCH', 'mikulcin-vrch', 4], ['vila PEŠKOVA', 'vila-peskova', 5],
  ['Ludvik_XIII', 'ludvik-xiii', 3], ['DOMAMYSLICE', 'domamyslice', 5],
  ['rICANY mUZEUM', 'ricany-muzeum', 2], ['Rybarka', 'rybarka', 4],
  ['SVRATKA SIDLO FIRMY', 'svratka-sidlo', 3], ['SVRATKA UBYTOVANI', 'svratka-ubytovani', 5],
  ['AUKLAN OBALKA', 'auklan', 4], ['d1', 'jerex', 3],
];
const mapping = [];
for (const [folder, slug, count] of sets) {
  const directory = path.join(source, folder);
  const files = (await readdir(directory)).filter(file => /\.(jpe?g|png)$/i.test(file)).sort((a,b) => a.localeCompare(b, 'cs')).slice(0, count);
  if (files.length !== count) throw new Error(`Expected ${count} images in ${folder}, got ${files.length}`);
  await mkdir(`public/images/${slug}`, { recursive: true });
  for (const [i, file] of files.entries()) {
    const target = `public/images/${slug}/${String(i + 1).padStart(2, '0')}.webp`;
    await sharp(path.join(directory, file)).rotate().resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toFile(target);
    mapping.push({ source: `${folder}/${file}`, target });
    console.log(target);
  }
}
await writeFile('scripts/image-sources.json', JSON.stringify(mapping, null, 2) + '\n');
