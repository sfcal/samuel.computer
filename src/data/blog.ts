import '../buffer-polyfill';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

// Load all markdown files from content/blog directory
const modules = import.meta.glob('../content/blog/*.{md,mdx}', { 
  eager: true, 
  query: '?raw', 
  import: 'default' 
});

export const blogPosts: BlogPost[] = Object.entries(modules).map(([filePath, content]) => {
  const { data, content: markdownContent } = matter(content as string);
  const slug = filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '') || '';
  
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    tags: Array.isArray(data.tags) ? data.tags.map((tag: any) => String(tag)) : [],
    content: markdownContent
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