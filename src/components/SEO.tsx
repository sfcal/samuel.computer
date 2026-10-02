import { useEffect } from 'react';

export const SITE_URL = 'https://samuel.computer';

const DEFAULT_TITLE = 'Samuel Calvert - Infrastructure Engineer';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  /** ISO date; when set, the page is marked up as an article/BlogPosting */
  publishedTime?: string;
}

// Update-in-place head manager: matches the static tags in index.html (so they
// are updated, not duplicated) and creates anything missing. Every route
// renders exactly one <SEO>, so the latest mount owns the whole set.
const upsertTag = (selector: string, create: () => HTMLElement, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
};

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) =>
  upsertTag(`meta[${attr}="${key}"]`, () => document.createElement('meta'), {
    [attr]: key,
    content,
  });

const removeTag = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

export const SEO = ({
  title = DEFAULT_TITLE,
  description = 'Computer Engineering professional specializing in infrastructure automation, networking, and systems troubleshooting.',
  keywords = ['infrastructure', 'DevOps', 'Kubernetes', 'cloud', 'engineering'],
  image = '/headshot.jpeg',
  url = SITE_URL,
  publishedTime,
}: SEOProps) => {
  useEffect(() => {
    const siteTitle = title === DEFAULT_TITLE ? title : `${title} | Samuel Calvert`;
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    document.title = siteTitle;

    upsertTag('link[rel="canonical"]', () => document.createElement('link'), {
      rel: 'canonical',
      href: url,
    });

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords.join(', '));

    upsertMeta('property', 'og:title', siteTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', absoluteImage);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', publishedTime ? 'article' : 'website');
    if (publishedTime) {
      upsertMeta('property', 'article:published_time', publishedTime);
    } else {
      removeTag('meta[property="article:published_time"]');
    }

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', siteTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', absoluteImage);

    const jsonLd = publishedTime
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description,
          datePublished: publishedTime,
          image: absoluteImage,
          mainEntityOfPage: url,
          author: {
            '@type': 'Person',
            name: 'Samuel Calvert',
            url: SITE_URL,
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Samuel Calvert',
          jobTitle: 'Infrastructure Engineer',
          url: SITE_URL,
          sameAs: [
            'https://github.com/sfcal',
            'https://linkedin.com/in/samuel-f-calvert',
          ],
        };

    upsertTag('script[type="application/ld+json"]', () => {
      const el = document.createElement('script');
      el.setAttribute('type', 'application/ld+json');
      return el;
    }, {});
    document.head.querySelector('script[type="application/ld+json"]')!.textContent =
      JSON.stringify(jsonLd);
  }, [title, description, keywords, image, url, publishedTime]);

  return null;
};
