# Zdenek Severa — portfolio

Prezentační web v Astro. React zajišťuje úvodní prezentaci i prezentace v detailech projektů. Výstup je statický a lze jej umístit na běžný webhosting.

## Spuštění

Vyžaduje Node.js 24 LTS. V této pracovní složce je přenosný Node v `../.tools/`; na Windows lze web spustit dvojklikem na `dev.cmd` a sestavit přes `build.cmd`, bez změny systémové instalace.

```sh
npm install
npm run dev
```

Vývojová adresa: http://localhost:4321

```sh
npm run build
npm run preview
```

Produkční soubory vzniknou ve složce `dist/`. Build zahrnuje kontrolu TypeScriptu, Astro, výsledného HTML, místních odkazů, SEO metadat a sitemap XML.

Kontrola vnitřních odkazů a souborů po sestavení: `node scripts/verify-build.mjs`.

## SEO a indexace

Postup a rozsah ověření jsou v [SEO.md](SEO.md). Místní vývoj: `robots.txt` zakazuje procházení, stránky mají `noindex` a sitemap nemá veřejné URL. Veřejná sitemap, canonical adresy a strukturovaná data vzniknou při `npm run build:production` s nastaveným `PUBLIC_SITE_URL`. Netlify tuto hodnotu nastavuje přes `netlify.toml`. Vývojový server zůstává neindexovatelný i s nastavenou doménou. Search Console zatím není nastavená.

## Obsah a nastavení

- `src/data/projects.ts`: názvy, popisy, roky, pořadí projektů a pět úvodních snímků. Popisy jsou redakční návrhy podle vizualizací; nejsou doplněny neověřené údaje o realizaci, investorovi nebo autorství.
- `src/components/Slideshow.tsx`: React prezentace, interval 3 sekundy, nejvýše 5 snímků, ruční přepínání a pozastavení. Přechod počká na načtení dalšího snímku. Mimo obrazovku a na skryté kartě se prezentace zastaví. Respektuje snížený pohyb.
- `src/styles/global.css`: barvy, rozvržení, plynulé prolínání 1,5 s a pomalé přiblížení.
- Kontaktní údaje jsou v `src/layouts/Layout.astro` a `src/pages/contact.astro`.

Fotografie jsou lokální optimalizované WebP exporty ze složky `C:/Users/plastictoy/Desktop/viz`; originály se nemění. Případný nový export: `node scripts/prepare-images.mjs "C:/Users/plastictoy/Desktop/viz"`. Mapování originálů je v `scripts/image-sources.json`.

## Typografie

Inspirace používá RM Pro Light a Regular. CSS nyní odkazuje na stejné fonty na serveru reference a má systémový fallback. Před veřejným nasazením zajistěte vlastní webovou licenci RM Pro, uložte licencované WOFF2 do `public/fonts/` a změňte URL v `@font-face` na lokální. Dostupnost externího fontu závisí na původním serveru.

## Ověřené kontaktní údaje

Zdeněk Severa, IČO 03108040 — ověřeno přes veřejné API ARES. Telefon +420 724 955 557 a e-mail zdenek.severa@gmail.com zadal uživatel. Na webu nejsou uváděny další registrační údaje.

Místní vývoj používá Astro dev server. Nastavení veřejného nasazení na Netlify je uvedené níže.

## Netlify

`netlify.toml` v kořeni repozitáře nastavuje Node.js 24, sestavení `npm run build:production` a publikovanou složku `dist`. Kořen repozitáře už obsahuje `package.json`; v Netlify nezadávejte další podsložku `zs-web`.

Produkční adresa je `https://zs-web.netlify.app/`. Produkční build má povolenou indexaci; Deploy Previews a branch deploys zůstávají `noindex`. Při změně finální domény aktualizujte `PUBLIC_SITE_URL` v konfiguraci. Lokální vývoj dál používá localhost a vypnutou indexaci.

Netlify musí být propojené s tímto GitHub repozitářem a produkční větví `main`. Nový push pak spustí sestavení. Při ručním nahrávání publikujte obsah sestavené složky `dist`, nikoli zdrojový repozitář.

# zs-web
