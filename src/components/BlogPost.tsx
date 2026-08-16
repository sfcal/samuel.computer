import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SEO, SITE_URL } from './SEO';
import { getPostBySlug, formatPostDate } from '../data/blog';

SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('python', python);

// Media hints ride the markdown title field, e.g. ![alt](src "50% 1256x769"):
// a percentage caps the display width, WxH declares intrinsic dimensions so the
// browser can reserve space before the file loads.
const parseMediaTitle = (title?: string) => {
  let maxWidth: string | undefined;
  let width: number | undefined;
  let height: number | undefined;
  for (const token of (title ?? '').trim().split(/\s+/)) {
    if (/^\d{1,3}%$/.test(token)) {
      maxWidth = token;
    } else if (/^\d+x\d+$/.test(token)) {
      [width, height] = token.split('x').map(Number);
    }
  }
  return { maxWidth, width, height };
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="flex items-center justify-center py-32">
        <SEO title="Post Not Found" />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`${SITE_URL}/blog/${post.slug}`}
        image={post.image}
        publishedTime={post.date}
      />

      <header className="mb-12">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{formatPostDate(post.date)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
            >
              <Tag className="w-3 h-3" aria-hidden="true" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </header>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="prose prose-gray dark:prose-invert max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400
          prose-code:text-indigo-600 dark:prose-code:text-indigo-400
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800
          prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-code:text-sm
          prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
          prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
          prose-pre:text-sm prose-pre:leading-relaxed"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      fontSize: '0.875rem',
                      padding: '0.75rem',
                      margin: '0.5rem 0'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // Custom link renderer to open external links in new tab
              a({ node, children, href, ...props }) {
                const isExternal = href?.startsWith('http');
                return (
                  <a
                    href={href}
                    {...props}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                );
              },
              // Centered media with size hints from the markdown title (see parseMediaTitle)
              img({ src, alt, title }) {
                const { maxWidth, width, height } = parseMediaTitle(title);
                const style = maxWidth ? { maxWidth } : undefined;
                if (src && /\.(mp4|webm)$/i.test(src)) {
                  return (
                    <video
                      src={src}
                      width={width}
                      height={height}
                      className="mx-auto block h-auto max-w-full rounded-lg"
                      style={style}
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-label={alt}
                    />
                  );
                }
                return (
                  <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto block h-auto max-w-full rounded-lg"
                    style={style}
                  />
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Blog
        </Link>
      </div>
    </article>
  );
};

export default BlogPost;
