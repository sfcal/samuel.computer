// The cards on the projects page, in order.
export const projects = [
  {
    title: 'Homelab Kubernetes Infrastructure',
    summary: 'Complete infrastructure-as-code solution for multi-environment Kubernetes clusters running on Proxmox VMs.',
    points: [
      'Multi-environment K8s clusters with GitOps',
      'Terraform, Ansible, and FluxCD automation',
      'Prometheus/Grafana monitoring stack',
    ],
    stack: ['Kubernetes', 'Terraform', 'Ansible', 'GitOps'],
    links: [
      { label: 'View code', href: 'https://github.com/sfcal/homelab' },
      { label: 'View docs', href: 'https://docs.5am.cloud/homelab/' },
    ],
  },
  {
    title: 'GBA Resume',
    summary: 'Game Boy Advance homebrew resume written in C++, with online emulator.',
    points: [
      'Custom graphics and animations',
      'Interactive menu system',
      'Product Design',
    ],
    stack: ['C++', 'Butano', 'GBAjs2', 'DevkitPro'],
    links: [
      { label: 'View code', href: 'https://github.com/sfcal/gba-resume' },
      { label: 'Play here', href: 'https://gba.samuel.computer' },
      { label: 'Read the write-up', href: '/writing/gba-resume/' },
    ],
  },
];
