import { Github, ExternalLink } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">{project.title}</h3>
        <div className="flex gap-3">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Github size={24} />
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ExternalLink size={24} />
            </a>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {project.description}
      </p>
      
      <div className="space-y-3 mb-6">
        {project.features.map((feature, index) => (
          <Feature key={index} text={feature} index={index} />
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <TechBadge key={tech} tech={tech} />
        ))}
      </div>
    </div>
  );
};

const Feature = ({ text, index }: { text: string; index: number }) => {
  const iconColors = ['text-indigo-500', 'text-purple-500', 'text-blue-500'];
  const icons = ['fa-cube', 'fa-code', 'fa-chart-line'];
  
  return (
    <div className="flex items-center text-sm">
      <i className={`fas ${icons[index % icons.length]} ${iconColors[index % iconColors.length]} mr-2`} />
      <span>{text}</span>
    </div>
  );
};

const TechBadge = ({ tech }: { tech: string }) => (
  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
    {tech}
  </span>
);