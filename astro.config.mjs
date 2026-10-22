import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig, sharpImageService } from 'astro/config';
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

  // pictures in posts are resized to a few widths so a phone downloads a small one.
  // Diagrams and charts go out as near-lossless WebP: ordinary lossy WebP
  // subsamples colour and smears thin coloured lines. Photos would balloon under
  // this, so src/markdown.js sends .jpg sources out as JPEG instead.
  image: {
    layout: 'constrained',
    service: sharpImageService({ webp: { nearLossless: true, quality: 60 } }),
  },

  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { math: true, smartPunctuation: false },
      mdastPlugins,
      hastPlugins,
    }),
  },
});
