export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-homelab-kubernetes-cluster',
    title: 'Building a Homelab Kubernetes Cluster',
    date: '2024-01-15',
    excerpt: 'My journey setting up a production-grade Kubernetes cluster in my homelab',
    tags: ['kubernetes', 'homelab', 'infrastructure'],
    content: `
# Building a Homelab Kubernetes Cluster

Setting up a Kubernetes cluster at home is a great way to learn container orchestration and experiment with cloud-native technologies. After months of planning and implementation, I've built a production-grade K8s cluster in my homelab that rivals many enterprise setups.

## Hardware Setup

I started with three Proxmox nodes, each running on dedicated hardware:

- **Node 1**: Dell OptiPlex 7070 (i5-9500, 32GB RAM, 1TB NVMe)
- **Node 2**: HP EliteDesk 800 G5 (i7-9700, 32GB RAM, 1TB NVMe) 
- **Node 3**: Lenovo ThinkCentre M75q (Ryzen 5 PRO 4650GE, 32GB RAM, 1TB NVMe)

Each node runs Proxmox VE 8.0, providing the hypervisor layer for my Kubernetes VMs.

## Network Architecture

The cluster operates on a dedicated VLAN (192.168.100.0/24) with:
- **Control Plane**: 3 VMs for HA control plane
- **Worker Nodes**: 6 VMs distributed across physical nodes
- **Load Balancer**: HAProxy for API server load balancing
- **Storage**: Longhorn for distributed block storage

## Infrastructure as Code

Everything is managed through GitOps:

\`\`\`yaml
# Example cluster configuration
apiVersion: cluster.x-k8s.io/v1beta1
kind: Cluster
metadata:
  name: homelab-cluster
  namespace: default
spec:
  clusterNetwork:
    pods:
      cidrBlocks: ["10.244.0.0/16"]
    services:
      cidrBlocks: ["10.96.0.0/12"]
\`\`\`

## Monitoring Stack

I deployed a comprehensive monitoring solution:
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **AlertManager** for alerting
- **Loki** for log aggregation

## Lessons Learned

Building this cluster taught me:
1. **Resource Planning**: Always overestimate memory requirements
2. **Network Segmentation**: Proper VLANs are crucial for security
3. **Backup Strategy**: Regular etcd backups saved me multiple times
4. **Documentation**: Keep everything documented for future you

The cluster now runs 50+ applications and has been stable for 8 months with 99.9% uptime.
    `
  }
];

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}