// What a post's Markdown means beyond the standard, applied at build time:
// LaTeX becomes MathML, Obsidian's foldable callouts become <details>, an .mp4
// written as an image becomes a <video>, and the hints in an image's title
// ("50%", "1280x720") set its size.
import temml from 'temml';

const VIDEO = /\.mp4$/i;
const COLUMN = 800;               // the widest a post's text column gets, in CSS pixels (.sheet in base.css)
const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// "50% 1280x720": a percentage caps the width on the page; WxH is a video's
// own size, and only a video's (a picture's is measured by the build)
function readHints(title) {
  const hints = {};
  for (const token of (title ?? '').trim().split(/\s+/)) {
    if (/^\d{1,3}%$/.test(token)) hints.maxWidth = token;
    else if (/^\d+x\d+$/.test(token)) [hints.width, hints.height] = token.split('x');
  }
  return hints;
}

const markdown = {
  name: 'post-markdown',

  inlineMath: node => ({ type: 'html', value: temml.renderToString(node.value) }),
  math: node => ({
    type: 'html',
    value: `<div class="eq">${temml.renderToString(node.value, { displayMode: true })}</div>`,
  }),

  // The hints come off the title, so they never show as a tooltip. A picture
  // keeps the cap on its width, and says how wide it will be drawn so the
  // browser can pick the smallest file that fills it; its own size is measured
  // by the build. A video, ![alt](clip.mp4 "1280x720"), is a silent loop that
  // stands in for an animated GIF at a fraction of the size: the post page
  // (pages/writing/[slug].astro) plays it while it is on screen, and without
  // that it waits behind its controls.
  image(node) {
    const { maxWidth, width, height } = readHints(node.title);
    const style = maxWidth && `max-width: ${maxWidth}`;
    if (VIDEO.test(node.url)) {
      const attrs = { src: `/writing/${node.url.replace(/^\.\//, '')}`, width, height, style, 'aria-label': node.alt };
      const html = Object.entries(attrs).filter(([, value]) => value).map(([name, value]) => ` ${name}="${escape(value)}"`).join('');
      return { type: 'html', value: `<video${html} muted loop playsinline preload="none" controls></video>` };
    }
    const share = parseFloat(maxWidth ?? 100) / 100;
    const sizes = `(min-width: ${COLUMN + 128}px) ${Math.round(COLUMN * share)}px, ${Math.round(90 * share)}vw`;
    return { ...node, title: null, data: { hProperties: { sizes, style } } };
  },

  // "> [!note]- Title" folds away under its title ("-" starts closed, "+" open)
  blockquote(node) {
    const [first, ...rest] = node.children;
    const text = first?.type === 'paragraph' && first.children[0]?.type === 'text' ? first.children[0].value : '';
    const marker = /^\[!\w+\]([+-])[ \t]*([^\n]*)\n?/.exec(text);
    if (!marker) return;
    const lead = [{ type: 'text', value: text.slice(marker[0].length) }, ...first.children.slice(1)];
    return {
      type: 'callout',
      data: { hName: 'details', hProperties: { open: marker[1] === '+' } },
      children: [
        { type: 'calloutTitle', data: { hName: 'summary' }, children: [{ type: 'text', value: marker[2] }] },
        { type: 'paragraph', children: lead },
        ...rest,
      ],
    };
  },
};

const html = {
  name: 'post-html',
  element: [
    {
      // links that leave the site open in a new tab
      filter: ['a'],
      visit(node, ctx) {
        if (!/^https?:/.test(node.properties.href)) return;
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noreferrer');
      },
    },
  ],
};

export const mdastPlugins = [markdown];
export const hastPlugins = [html];
