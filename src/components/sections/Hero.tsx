import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center px-4 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
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
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
    <a 
      href="#projects" 
      className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      <span className="text-sm font-medium mb-2">Featured projects</span>
      <ChevronDown className="animate-bounce" />
    </a>
  </div>
);