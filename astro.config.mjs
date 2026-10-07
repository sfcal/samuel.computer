import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { hastPlugins, mdastPlugins } from './src/markdown.js';

export default defineConfig({
  site: 'https://samuel.computer',
  trailingSlash: 'always',
  integrations: [sitemap()],

  // where the previous site kept its posts
  redirects: {
    '/blog': '/writing',
    '/blog/[slug]': '/writing/[slug]',
  },

  // the styles are small: put them in the page and save a request
  build: { inlineStylesheets: 'always' },

  // pictures in posts are resized to a few widths so a phone downloads a small one
  image: { layout: 'constrained' },

  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { math: true, smartPunctuation: false },
      mdastPlugins,
      hastPlugins,
    }),
  },
});
