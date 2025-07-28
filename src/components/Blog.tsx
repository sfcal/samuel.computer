import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { getAllPosts } from '../data/blog';

const Blog: React.FC = () => {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Thoughts on infrastructure, DevOps, and technology
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                </div>

                <Link to={`/blog/${post.slug}`} className="group">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
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

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium group"
                >
                  Read more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
    </div>
  );
};

export default Blog;