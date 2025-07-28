
export const Projects = () => {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Homelab Project */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">Homelab Kubernetes Infrastructure</h3>
              <a href="https://github.com/sfcal/homelab" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <i className="fab fa-github text-2xl"></i>
              </a>
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
          
          {/* Network IDS Project */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">AI-Powered Network IDS</h3>
              <span className="text-gray-600 dark:text-gray-400">
                <i className="fas fa-shield-alt text-2xl"></i>
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Developed network intrusion detection systems using GAN-based neural networks for anomaly detection.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <i className="fas fa-brain text-indigo-500 mr-2"></i>
                <span>GAN-based anomaly detection</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-network-wired text-purple-500 mr-2"></i>
                <span>GNS3 virtual network simulations</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-docker text-blue-500 mr-2"></i>
                <span>Containerized deployment solution</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Python</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">TensorFlow</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Docker</span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">GNS3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};