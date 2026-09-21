import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, Eye } from 'lucide-react';
import { PortfolioProject } from '@/types';
import { formatImageUrl } from '@/lib/gdrive';

interface PortfolioSectionProps {
  projects: PortfolioProject[];
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-widest">
          PORT<span className="text-amber-500">FOLIO</span>
        </h2>
        <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 min-h-[44px] ${
              selectedCategory === cat
                ? 'bg-amber-400 text-black shadow-md font-extrabold scale-105'
                : 'bg-white text-gray-700 hover:bg-black hover:text-white border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project) => {
            const thumbUrl = formatImageUrl(project.thumbnailUrl);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-amber-400 transition-all duration-300 relative flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <div className="img-fill-container w-full h-56 overflow-hidden bg-gray-900">
                  <Image
                    src={thumbUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="absolute inset-0 w-full h-full object-cover hero-grayscale-img group-hover:scale-110 transition-transform duration-500"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-amber-400 text-black p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye size={24} />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/80 text-amber-400 text-[10px] font-extrabold px-3 py-1 uppercase tracking-widest rounded-sm backdrop-blur-sm">
                    {project.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wide">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative border-2 border-amber-400 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 bg-black text-amber-400 w-11 h-11 flex items-center justify-center rounded-full hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Close Project Modal"
              >
                <X size={20} />
              </button>

              <div className="img-fill-container w-full h-72 sm:h-80 bg-black">
                <Image
                  src={formatImageUrl(selectedProject.thumbnailUrl)}
                  alt={selectedProject.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <span className="inline-block bg-amber-400 text-black text-xs font-black px-3 py-1 uppercase tracking-widest rounded-sm">
                  {selectedProject.category}
                </span>

                <h3 className="text-2xl font-extrabold text-black uppercase tracking-tight">
                  {selectedProject.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                  {selectedProject.projectUrl && (
                    <a
                      href={selectedProject.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 min-h-[44px]"
                    >
                      <span>VIEW PROJECT LINK</span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {selectedProject.repoUrl && (
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-black hover:bg-gray-900 text-white font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 min-h-[44px]"
                    >
                      <span>VIEW REPO / GDRIVE</span>
                      <Github size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
