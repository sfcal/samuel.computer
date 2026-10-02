import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from './SEO';

const NotFound = () => (
  <div className="flex items-center justify-center py-32">
    <SEO title="Page Not Found" />
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
