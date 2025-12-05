import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { SEO } from './components/SEO';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import './styles/globals.css';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AppProvider>
          <Router>
            <SEO />
            <div className="min-h-screen flex flex-col">
              <BackgroundGradient />
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomeContent />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                </Routes>
              </main>
              <Footer />
              <ScrollToTop />
            </div>
          </Router>
        </AppProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

const HomeContent = () => (
  <>
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