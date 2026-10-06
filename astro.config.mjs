import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { hastPlugins, mdastPlugins } from './src/markdown.js';

// The three typefaces, served from this site: the Latin files of the
// @fontsource packages, in just the weights the pages use.
function font(name, cssVariable, weights, fallbacks) {
  const slug = name.toLowerCase().replaceAll(' ', '-');
  return {
    provider: fontProviders.local(),
    name, cssVariable, fallbacks,
    optimizedFallbacks: false,        // a missing glyph (an arrow, say) should come from the system face, not a stand-in
    options: {
      variants: weights.map(weight => ({
        weight,
        style: 'normal',
        src: [`./node_modules/@fontsource/${slug}/files/${slug}-latin-${weight}-normal.woff2`],
      })),
    },
  };
}

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

  fonts: [
    font('Inter', '--font-sans', [400, 700], ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif']),
    font('JetBrains Mono', '--font-mono', [400, 700], ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace']),
    font('DynaPuff', '--font-display', [700], ['Arial Rounded MT Bold', 'system-ui', 'sans-serif']),
  ],
});
