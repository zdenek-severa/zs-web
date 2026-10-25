import { loadEnv } from 'vite';
import { resolveSite } from '../config/site.mjs';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
if (!resolveSite(env).configured) {
  console.error('Produkční build vyžaduje PUBLIC_SITE_URL v .env nebo v prostředí. Pro lokální vývoj použijte npm run build.');
  process.exit(1);
}
