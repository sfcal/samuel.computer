import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { cp, readdir, writeFile } from 'fs/promises';
import matter from 'gray-matter';

const SITE_URL = 'https://samuel.computer';
const BLOG_DIR = path.resolve(__dirname, 'src/content/blog');

// Parse frontmatter at build time so the client never ships gray-matter or a Buffer polyfill
const markdownFrontmatter = (): Plugin => ({
  name: 'markdown-frontmatter',
  enforce: 'pre',
  transform(src, id) {
    if (!id.endsWith('.md')) return null;
    const { data, content: rawContent } = matter(src);
    // Posts reference images by their repo location (../../../public/assets/...)
    // so Obsidian and GitHub previews resolve them; the site serves public/ at
    // the root, so map them to site-absolute URLs here
    const content = rawContent.replace(/\]\((?:\.\.\/)+public\//g, '](/');
    const readingMinutes = Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
    return {
      code: [
        `export const data = ${JSON.stringify(data)};`,
        `export const content = ${JSON.stringify(content)};`,
        `export const readingMinutes = ${readingMinutes};`,
      ].join('\n'),
      map: null,
    };
  },
});

const generateSitemap = (): Plugin => ({
  name: 'generate-sitemap',
  closeBundle: async () => {
    const files = await readdir(BLOG_DIR);
    const slugs = files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
    const urls = ['/', '/blog', ...slugs.map((slug) => `/blog/${slug}`)];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map((url) => `  <url><loc>${SITE_URL}${url}</loc></url>`),
      '</urlset>',
      '',
    ].join('\n');
    await writeFile(path.resolve(__dirname, 'dist/sitemap.xml'), xml);
  },
});

// GitHub Pages serves 404.html for unknown paths; a copy of the SPA shell keeps
// deep links rendering (note: still with a 404 status — fix via Cloudflare rewrite)
const copy404 = (): Plugin => ({
  name: 'copy-404',
  closeBundle: async () => {
    await cp(
      path.resolve(__dirname, 'dist/index.html'),
      path.resolve(__dirname, 'dist/404.html')
    );
  },
});

export default defineConfig({
  plugins: [react(), markdownFrontmatter(), copy404(), generateSitemap()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
  publicDir: 'public',
});
