export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  headline: string;
  description: string;
  images: string[];
};

const imageSet = (slug: string, count: number) => Array.from({ length: count }, (_, i) => `/images/${slug}/${String(i + 1).padStart(2, '0')}.webp`);

export const projects: Project[] = [
  { slug: 'mikulcin-vrch', name: 'Mikulčin vrch', category: 'Architektura · Horský dům', year: '2023', headline: 'V dialogu s krajinou.', description: 'Dvojice štítů, přírodní materiály a otevřené výhledy. Návrh horského domu pracuje s měřítkem okolní krajiny, rytmem dřevěné fasády a pevným kamenným soklem.', images: imageSet('mikulcin-vrch', 4) },
  { slug: 'vila-peskova', name: 'Vila Peškova', category: 'Architektura · Bydlení', year: '2023', headline: 'Prostor pro každodenní život.', description: 'Horizontální linie, světlé plochy a zahrada jako přirozené pokračování interiéru. Studie vily zkoumá vztah mezi soukromím domova a otevřeností obytného prostoru.', images: imageSet('vila-peskova', 5) },
  { slug: 'ludvik-xiii', name: 'Ludvík XIII', category: 'Interiér · Hraniční zámeček', year: '2025', headline: 'Současný detail. Historický prostor.', description: 'Měkké tvary, tlumené odstíny a světlo v historickém interiéru. Návrh nechává vyniknout charakter prostoru a doplňuje jej současným mobiliářem.', images: imageSet('ludvik-xiii', 3) },
  { slug: 'domamyslice', name: 'Domamyslice', category: 'Architektura · Bydlení', year: '2022', headline: 'Bydlení mezi domem a zahradou.', description: 'Soubor domů propojený zelení a klidnými venkovními prostory. Střídmá architektura vytváří rámec pro každodenní život a přirozené sousedské vztahy.', images: imageSet('domamyslice', 5) },
  { slug: 'ricany-muzeum', name: 'Muzeum Říčany', category: 'Architektura · Kultura', year: '2022', headline: 'Nová vrstva v příběhu místa.', description: 'Výrazná střecha a strukturovaná fasáda zasazují novou architekturu do městského prostředí. Studie hledá rovnováhu mezi současným výrazem a měřítkem okolní zástavby.', images: imageSet('ricany-muzeum', 2) },
  { slug: 'rybarka', name: 'Rybářka', category: 'Architektura · Bytový dům', year: '2025', headline: 'Město s místem pro zeleň.', description: 'Rytmus balkonů, světlo a velkorysé výhledy. Návrh bytového domu propojuje výraznou fasádu s pobytovou zelení a venkovním prostorem.', images: imageSet('rybarka', 4) },
  { slug: 'svratka-sidlo', name: 'Sídlo firmy, Svratka', category: 'Architektura · Administrativa', year: '2023', headline: 'Místo pro práci i setkávání.', description: 'Střídmé objemy a jasně čitelný vstup. Návrh firemního sídla pracuje s kontrastem materiálů, večerním světlem a vztahem budovy k okolnímu prostoru.', images: imageSet('svratka-sidlo', 3) },
  { slug: 'svratka-ubytovani', name: 'Ubytování, Svratka', category: 'Architektura · Ubytování', year: '2023', headline: 'Známé měřítko. Nový pohled.', description: 'Sedlové střechy a dřevěné fasády navazují na charakter místa. Studie ubytování rozvíjí tradiční tvarosloví prostřednictvím jednoduchých objemů a současného detailu.', images: imageSet('svratka-ubytovani', 5) },
  { slug: 'auklan', name: 'Auklan', category: 'Architektura · Studie', year: '2023', headline: 'Na rozhraní vody a krajiny.', description: 'Vrstvené objemy a otevřené terasy nad vodní hladinou. Architektonická studie zkoumá vztah stavby, jejího odrazu a širokého horizontu.', images: imageSet('auklan', 4) },
  { slug: 'jerex', name: 'Sídlo Jerex', category: 'Architektura · Administrativa', year: '2024', headline: 'Výrazná adresa v pohybu města.', description: 'Kompaktní objem a pravidelný rytmus fasády. Studie administrativní budovy pracuje s viditelností v městském prostředí a jasnou identitou vstupního prostoru.', images: imageSet('jerex', 3) },
];

export const featuredSlides = [projects[0], projects[1], projects[2], projects[4], projects[8]].map(p => ({ src: p.images[0], title: p.name, subtitle: p.category, href: `/work/${p.slug}/` }));
