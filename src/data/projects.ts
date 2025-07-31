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
    id: 'gba-resume',
    title: 'GBA Resume',
    description: 'Game Boy Advance homebrew resume written in C, showcasing low-level programming skills.',
    features: [
      'Custom graphics and animations',
      'Interactive menu system',
      'Hardware-optimized rendering'
    ],
    technologies: ['C', 'Assembly', 'GBA SDK', 'DevkitPro'],
    githubUrl: 'https://github.com/sfcal/gba-resume',
    icon: 'gamepad'
  }
];