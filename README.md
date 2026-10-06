# samuel.computer

My website: a night sky that scrolls into day, a projects page, and writing.
Built with [Astro](https://astro.build) into plain static files.

```bash
npm install
npm run dev        # http://localhost:4321, rebuilds as you edit
npm run build      # the finished site, in dist/
npm run preview    # serve dist/ to check it
```

Needs Node 22.12 or newer.

## Where things are

```
src/
  content/writing/     posts: one Markdown file each, pictures in a folder of the same name
  data/projects.js     the cards on the projects page
  pages/               one file per page (index, projects, writing, a post, 404, the feed)
  layouts/Base.astro   the head, the header bar and the sky that every page shares
  styles/              base.css (every page), home.css (the scene), pages.css (cards and posts)
  scripts/             sky.js, cow.js and glass.js run on every page; home/ is the scene
  markdown.js          what the build adds to Markdown: maths, callouts, videos, image sizes
public/                served as they are: cv.pdf, icons, robots.txt
```

## Writing a post

Add `src/content/writing/my-post.md`. It appears at `/writing/my-post/`, in the
list and in the feed.

```markdown
---
title: "My Post"
date: "2026-10-05"
excerpt: "One line for the list and for link previews."
tags: ["math"]
image: "./my-post/cover.png"    # optional: the picture shown when the post is shared
---

Inline maths $b^{x+y}$ and display maths between $$ lines, written in LaTeX.

![What the picture shows](./my-post/figure.png "65%")

![A clip, looping silently](./my-post/clip.mp4 "1280x720")

> [!note]- A callout that folds away
> Hidden until opened. Use `+` instead of `-` to start open.
```

- Pictures (PNG, JPEG, GIF, WebP) live in `src/content/writing/my-post/` and are
  referenced by relative path, so they also show in Obsidian and on GitHub. The
  build converts them to WebP at several widths; animated GIFs stay animated.
- A percentage in a picture's title caps how wide it is drawn.
- A video must be an `.mp4`, and its title must give its size as `WIDTHxHEIGHT`.
- Maths becomes MathML at build time, so pages need no script to show it.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. In the repository's settings, Pages must
have **Source: GitHub Actions**, and the custom domain is set there too. The
site expects to be served from the root of its domain (`site` in
`astro.config.mjs`).

`Dockerfile` and `nginx.conf` build the same `dist/` into an nginx image;
`.github/workflows/build-and-push.yml` pushes that image to GHCR.
