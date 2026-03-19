// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: isDev ? [react(), keystatic()] : [react()]
});
