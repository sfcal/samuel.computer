
export const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Homelab Project */}
          <a href="https://github.com/sfcal/homelab" target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">Homelab Kubernetes Infrastructure</h3>
                <i className="fab fa-github text-2xl text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"></i>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Complete infrastructure-as-code solution for multi-environment Kubernetes clusters running on Proxmox VMs.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <i className="fas fa-cube text-indigo-500 mr-2"></i>
                  <span>Multi-environment K8s clusters with GitOps</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-code text-purple-500 mr-2"></i>
                  <span>Terraform, Ansible, and FluxCD automation</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-chart-line text-blue-500 mr-2"></i>
                  <span>Prometheus/Grafana monitoring stack</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Kubernetes</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Terraform</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Ansible</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">GitOps</span>
              </div>
            </div>
          </a>
          
          {/* GBA Resume Project */}
          <a href="https://github.com/sfcal/gba-resume" target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">GBA Resume</h3>
                <i className="fab fa-github text-2xl text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"></i>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Game Boy Advance homebrew resume written in C++, with online emulator.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <i className="fas fa-paint-brush text-indigo-500 mr-2"></i>
                  <span>Custom graphics and animations</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-list text-purple-500 mr-2"></i>
                  <span>Interactive menu system</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-microchip text-blue-500 mr-2"></i>
                  <span>Product Design</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">C++</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Butano</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">GBAjs2</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">DevkitPro</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};