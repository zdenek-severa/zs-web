# SEO a indexace

## Současný stav: pouze localhost

Na lokální verzi se generuje `noindex, nofollow` a `robots.txt` s `Disallow: /`. Lokální `sitemap.xml` je platné XML s prázdným seznamem veřejných URL. Neodesílá tak do vyhledávačů adresy localhost ani smyšlenou doménu. Veřejný produkční build na Netlify používá doménu z `netlify.toml` a zapíná canonical adresy, JSON-LD a sitemap všech obsahových stránek.

## Co je připravené

- Každá stránka má vlastní title a description, jazyk `cs` a jeden stabilní hlavní nadpis H1. Všechen obsah a odkazy vznikají už ve statickém HTML, React není potřeba k jejich objevení.
- Open Graph a Twitter metadata obsahují popisek a absolutní URL odpovídajícího obrázku.
- Po nastavení domény se přidají canonical URL, `og:url` a JSON-LD: Person, WebSite, příslušná stránka, seznam projektů, CreativeWork a BreadcrumbList v detailech. Údaje neobsahují smyšlené recenze, ocenění ani data realizace.
- Ve veřejném produkčním buildu `robots.txt` povolí procházení včetně obrázků a CSS/JS a odkáže na absolutní URL `/sitemap.xml`.
- Sitemap automaticky převezme projekty ze `src/data/projects.ts`. Zahrnuje úvod, About, Contact, detaily projektů a jejich obrázky. Neobsahuje 404, parametry ani fragmenty. Neuvádí vymyšlené datum `lastmod`.
- Chybová stránka má vždy `noindex`. URL obsahu používají koncové lomítko.
- První hero obrázek má preload s vysokou prioritou. Obrázky v galerii a přehledu se načítají odloženě, lokální WebP soubory zůstávají zachované.

## Příprava veřejného nasazení

1. Zkopírujte `.env.example` jako `.env`.
2. Do `PUBLIC_SITE_URL` zadejte vlastní finální HTTPS doménu, například `https://www.vasedomena.cz`. Vyberte jednu variantu s `www` nebo bez něj.
3. Pro veřejnou produkci nastavte `PUBLIC_SITE_INDEXABLE=true`. Pro testovací nasazení ponechte `false`.
4. Spusťte `npm run build:production`. Tento příkaz odmítne chybějící finální doménu. Změna `.env` vyžaduje nové sestavení, případně restart vývojového serveru.
5. Nasaďte obsah `dist/`. Hosting musí vracet HTTP 404 pro neexistující stránky, nikoli HTTP 200 s chybovou stránkou. Na hostingu nastavte přesměrování HTTP na HTTPS a alternativní domény na zvolenou finální doménu. Adresy `/about` a `/about/index.html` směrujte na `/about/` (stejně i pro ostatní obsahové stránky).
6. Ověřte veřejné adresy `/robots.txt` a `/sitemap.xml` i HTTP stav obsahových stránek. Robots nesmí blokovat zdroje nutné pro vykreslení.
7. Ověřte vlastnictví domény v Google Search Console. Volitelná proměnná `PUBLIC_GOOGLE_SITE_VERIFICATION` podporuje ověření pomocí HTML meta tagu; pro vlastnost typu Doména použijte DNS záznam podle Search Console.
8. V Search Console odešlete `sitemap.xml` a použijte kontrolu URL na úvodu a vybraných detailech. Zde se také ověřuje skutečný stav indexace. Publikování sitemap ani validní HTML nezaručují zařazení nebo konkrétní pozici ve výsledcích hledání.

Pro Netlify je v `netlify.toml` připravená produkční doména `https://zs-web.netlify.app/`. Produkční kontext povoluje indexaci; testovací kontexty ji zakazují. Místní vývoj je nadále neindexovatelný. Stav veřejného nasazení ověřujte na této adrese po dokončení buildu. Odeslání do Search Console zatím provedeno nebylo.

## Kontroly

`npm run build` automaticky spouští kontrolu Astro/TypeScript, sestavení, HTML-validate, kontrolu místních odkazů a SEO/XML kontroly. Samostatné opakování nad hotovým `dist/`: `npm run validate`.

HTML-validate používá doporučená pravidla a preset pro formátovaný/generovaný HTML výstup. Je vypnutá pouze stylistická kontrola inline stylů, které Astro používá pro React islands; kontrola struktury HTML, atributů a přístupnosti zůstává aktivní. Jde o lokální validaci pomocí HTML-validate, nikoli o certifikaci W3C nebo měření Lighthouse.

Automatické SEO kontroly ověřují unikátní title a description, H1, jazyk, robots meta, canonical URL, sociální metadata a existenci obrázků, syntaxi a klíčové vazby JSON-LD, syntaxi XML, úplnost sitemap, neplatné odkazy a soulad s `robots.txt`. Kontrola JSON-LD nenahrazuje Google Rich Results Test na veřejné URL.

## Primární dokumentace

- [Google: vytváření a odesílání sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: canonical adresy](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Astro: nastavení finální adresy site](https://docs.astro.build/en/reference/configuration-reference/#site)
- [HTML-validate: lokální validátor HTML5](https://html-validate.org/usage/index.html)
