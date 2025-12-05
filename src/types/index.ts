export interface Project {
  id: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  icon?: string;
  featured?: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}

export type Theme = 'light' | 'dark';

export interface ScrollPosition {
  x: number;
  y: number;
}