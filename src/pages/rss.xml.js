// The feed of posts, newest first.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('writing')).sort((a, b) => +b.data.date - +a.data.date);
  return rss({
    title: 'Samuel Calvert',
    description: 'Writing by Samuel Calvert.',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/writing/${post.id}/`,
    })),
  });
}
