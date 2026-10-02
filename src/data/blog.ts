export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  image?: string;
  readingMinutes: number;
  content: string;
}

interface MarkdownModule {
  data: Record<string, unknown>;
  content: string;
  readingMinutes: number;
}

// Frontmatter is parsed at build time by the markdown-frontmatter plugin in vite.config.ts
const modules = import.meta.glob('../content/blog/*.md', {
  eager: true,
}) as Record<string, MarkdownModule>;

export const blogPosts: BlogPost[] = Object.entries(modules).map(([filePath, mod]) => {
  const { data, content, readingMinutes } = mod;
  const slug = filePath.split('/').pop()?.replace(/\.md$/, '') || '';

  return {
    slug,
    title: typeof data.title === 'string' ? data.title : '',
    date: typeof data.date === 'string' ? data.date : '',
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: typeof data.image === 'string' ? data.image : undefined,
    readingMinutes,
    content,
  };
});

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Frontmatter dates are date-only strings ("2025-07-30"), which parse as UTC
// midnight — format in UTC so the date doesn't shift a day west of Greenwich.
export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
