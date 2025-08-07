import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getPostBySlug } from '../data/blog';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Helper function to safely render children from ReactMarkdown
  const renderChildren = (children: any) => {
    if (Array.isArray(children)) {
      return (
        <>
          {children.map((child, index) => {
            if (typeof child === 'object' && child !== null) {
              return <React.Fragment key={index}>{child}</React.Fragment>;
            }
            return child;
          })}
        </>
      );
    }
    return children;
  };
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">

      <header className="mb-12">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
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
              <Tag className="w-3 h-3" />
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
          prose-pre:text-sm prose-pre:leading-relaxed
          prose-ul:list-disc prose-ul:pl-6
          prose-li:text-gray-700 dark:prose-li:text-gray-300"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
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
              // Explicitly render headings - ensure children are properly rendered as React nodes
              h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{renderChildren(children)}</h1>,
              h2: ({ children }) => <h2 className="text-3xl font-bold mt-6 mb-3">{renderChildren(children)}</h2>,
              h3: ({ children }) => <h3 className="text-2xl font-bold mt-4 mb-2">{renderChildren(children)}</h3>,
              h4: ({ children }) => <h4 className="text-xl font-bold mt-3 mb-2">{renderChildren(children)}</h4>,
              h5: ({ children }) => <h5 className="text-lg font-bold mt-2 mb-1">{renderChildren(children)}</h5>,
              h6: ({ children }) => <h6 className="text-base font-bold mt-2 mb-1">{renderChildren(children)}</h6>,
              ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{renderChildren(children)}</ul>,
              li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{renderChildren(children)}</li>
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
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>
    </article>
  );
};

export default BlogPost;