import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const updateActiveSection = () => {
      const sections = ['hero', 'projects'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', updateActiveSection);
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [isHomePage]);

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              SC
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 ml-auto">
              {isHomePage ? (
                <>
                  <a href="#projects" className={`transition-colors ${activeSection === 'projects' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                    Projects
                  </a>
                  <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Blog
                  </Link>
                  <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    CV
                  </a>
                </>
              ) : (
                <>
                  <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Home
                  </Link>
                  <Link to="/blog" className={`transition-colors ${location.pathname.startsWith('/blog') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                    Blog
                  </Link>
                  <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    CV
                  </a>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenu(!mobileMenu)} 
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-bars text-gray-600 dark:text-gray-300"></i>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                {isHomePage ? (
                  <>
                    <a href="#projects" onClick={() => setMobileMenu(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Projects
                    </a>
                    <Link to="/blog" onClick={() => setMobileMenu(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Blog
                    </Link>
                    <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenu(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      CV
                    </a>
                  </>
                ) : (
                  <>
                    <Link to="/" onClick={() => setMobileMenu(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Home
                    </Link>
                    <Link to="/blog" onClick={() => setMobileMenu(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Blog
                    </Link>
                    <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenu(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      CV
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};