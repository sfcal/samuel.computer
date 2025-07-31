import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center px-4 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          <div className="flex-1 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-3xl md:text-4xl mb-4 font-normal">
                👋 Hi there! I&apos;m Samuel Calvert
              </span>
              <span className="block">3+ years building </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                infrastructure solutions
              </span>
              <span className="block">and backend systems.</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
              Support Engineer{' '}
              <a 
                href="https://haivision.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                @Haivision
              </a>
            </p>
            
            <div className="flex items-center gap-6 mb-12">
              <SocialLinks />
            </div>
          </div>
          
          <div className="relative order-first lg:order-last hidden md:block">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/50 dark:border-gray-700/50 shadow-2xl">
                <img 
                  src="/headshot.jpeg" 
                  alt="Samuel Calvert"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollIndicator />
    </section>
  );
};

const SocialLinks = () => {
  const links = [
    { href: 'mailto:hello@samuelcalvert.com', icon: 'fa-envelope' },
    { href: 'https://linkedin.com/in/samuel-f-calvert', icon: 'fa-linkedin' },
    { href: 'https://github.com/sfcal', icon: 'fa-github' },
  ];

  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.href.startsWith('mailto') ? undefined : '_blank'}
          rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
          className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <i className={`${link.icon === 'fa-envelope' ? 'fas' : 'fab'} ${link.icon} text-xl`} />
        </a>
      ))}
    </>
  );
};

const ScrollIndicator = () => (
  <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center animate-bounce">
    <a 
      href="#projects" 
      className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      <span className="text-sm font-medium mb-2 text-center">Featured projects</span>
      <ChevronDown />
    </a>
  </div>
);