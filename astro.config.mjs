import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import { resolveSite } from './config/site.mjs';

const env = { ...loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''), ...process.env };

export default defineConfig({
  site: resolveSite(env).url,
  trailingSlash: 'always',
  integrations: [react()],
  output: 'static',
});
