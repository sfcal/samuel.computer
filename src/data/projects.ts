export interface Project {
  id: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  icon: string;
}

export const projects: Project[] = [
  {
    id: 'homelab',
    title: 'Homelab Kubernetes Infrastructure',
    description: 'Complete infrastructure-as-code solution for multi-environment Kubernetes clusters running on Proxmox VMs.',
    features: [
      'Multi-environment K8s clusters with GitOps',
      'Terraform, Ansible, and FluxCD automation',
      'Prometheus/Grafana monitoring stack'
    ],
    technologies: ['Kubernetes', 'Terraform', 'Ansible', 'GitOps'],
    githubUrl: 'https://github.com/sfcal/homelab',
    icon: 'cube'
  },
  {
    id: 'network-ids',
    title: 'AI-Powered Network IDS',
    description: 'Developed network intrusion detection systems using GAN-based neural networks for anomaly detection.',
    features: [
      'GAN-based anomaly detection',
      'GNS3 virtual network simulations',
      'Containerized deployment solution'
    ],
    technologies: ['Python', 'TensorFlow', 'Docker', 'GNS3'],
    icon: 'shield'
  }
];