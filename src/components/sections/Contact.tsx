
export const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Let&apos;s Connect
          </span>
        </h2>
        
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
            I&apos;m always interested in discussing infrastructure challenges, DevOps practices, or potential collaborations.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <a href="mailto:hello@samuelcalvert.com" className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
              <i className="fas fa-envelope text-indigo-600 dark:text-indigo-400 text-xl"></i>
              <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">hello@samuelcalvert.com</span>
            </a>
            
            <a href="https://github.com/sfcal" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
              <i className="fab fa-github text-indigo-600 dark:text-indigo-400 text-xl"></i>
              <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">github.com/sfcal</span>
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <a href="https://linkedin.com/in/samuel-f-calvert" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:-translate-y-0.5">
              <i className="fab fa-linkedin text-indigo-600 dark:text-indigo-400 text-2xl"></i>
            </a>
            <a href="./cv/cv.pdf" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:-translate-y-0.5">
              <i className="fas fa-file-pdf text-indigo-600 dark:text-indigo-400 text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};