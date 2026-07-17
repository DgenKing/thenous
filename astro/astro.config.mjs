import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSectionize from './src/lib/rehype-sectionize.mjs';

export default defineConfig({
  site: 'https://thenous.pages.dev',
  output: 'static',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: { rehypePlugins: [rehypeSectionize] },
});
