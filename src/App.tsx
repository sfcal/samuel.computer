import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEO } from './components/SEO';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import NotFound from './components/NotFound';
import './styles/globals.css';

const Blog = lazy(() => import('./components/Blog'));
const BlogPost = lazy(() => import('./components/BlogPost'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollReset />
        <div className="min-h-screen flex flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg"
          >
            Skip to content
          </a>
          <BackgroundGradient />
          <Navbar />
          <main id="main" className="flex-1">
            <Suspense fallback={<div className="py-32"><LoadingSpinner size="lg" /></div>}>
              <Routes>
                <Route path="/" element={<HomeContent />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

// SPA navigation keeps the previous scroll position; start each route at the
// top. 'instant' bypasses the html scroll-behavior:smooth (no visible animation
// on route change), and POP navigations are skipped so the browser's native
// back/forward scroll restoration wins.
const ScrollReset = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, navigationType]);
  return null;
};

const HomeContent = () => (
  <>
    <SEO />
    <Hero />
    <Projects />
  </>
);

const BackgroundGradient = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950" />
    <div className="absolute inset-0">
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-gradient" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-gradient" style={{ animationDelay: '-10s' }} />
    </div>
  </div>
);

export default App;
