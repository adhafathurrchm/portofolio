'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Users, Award, Eye, X, Maximize2 } from 'lucide-react';
import { ResumeItem, ResumeCategory } from '@/types';
import { formatImageUrl } from '@/lib/gdrive';

interface ResumeSectionProps {
  resumeItems: ResumeItem[];
}

const categories: { id: ResumeCategory; label: string; icon: React.ElementType }[] = [
  { id: 'EXPERIENCE', label: 'Pengalaman', icon: Briefcase },
  { id: 'EDUCATION', label: 'Pendidikan', icon: GraduationCap },
  { id: 'ORGANIZATION', label: 'Organisasi', icon: Users },
  { id: 'AWARD', label: 'Penghargaan', icon: Award },
];

export const ResumeSection: React.FC<ResumeSectionProps> = ({ resumeItems }) => {
  const [activeCategory, setActiveCategory] = useState<ResumeCategory>('EXPERIENCE');
  const [selectedImageItem, setSelectedImageItem] = useState<ResumeItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageItem(null);
      }
    };
    if (selectedImageItem) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageItem]);

  const filteredItems = resumeItems.filter((item) => item.category === activeCategory);

  return (
    <section id="resume" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-widest">
          RIWAYAT
        </h2>
        <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* Centered Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
        {categories.map((cat) => {
          const IconComp = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 min-h-[44px] ${
                isActive
                  ? 'bg-amber-400 text-black shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-black hover:text-white border border-gray-200'
              }`}
            >
              <IconComp size={18} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Special Portfolio-Style Grid Layout for AWARD (Penghargaan) */}
      {activeCategory === 'AWARD' ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => {
              const imgUrl = item.imageUrl ? formatImageUrl(item.imageUrl) : '';
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedImageItem(item);
                    }
                  }}
                  onClick={() => setSelectedImageItem(item)}
                  className="group cursor-pointer bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-amber-400 transition-all duration-300 relative flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <div className="img-fill-container w-full h-56 overflow-hidden bg-gray-900 relative">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="absolute inset-0 w-full h-full object-cover hero-grayscale-img group-hover:scale-110 transition-transform duration-500"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 bg-gray-950 p-6">
                        <Award size={52} />
                        <span className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-400">
                          {item.title}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-amber-400 text-black p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center space-x-2 text-xs font-black uppercase tracking-wider">
                        <Eye size={20} />
                        <span>PRATINJAU FULLSCREEN</span>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 bg-black/80 text-amber-400 text-[10px] font-extrabold px-3 py-1 uppercase tracking-widest rounded-sm backdrop-blur-sm">
                      {item.period}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wide">
                        {item.title}
                      </h3>
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1 mb-2">
                        {item.subtitle}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-600 text-sm font-semibold uppercase">
              Belum ada data penghargaan.
            </div>
          )}
        </motion.div>
      ) : (
        /* Standard Layout for EXPERIENCE, EDUCATION, and ORGANIZATION */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => {
            const imgUrl = item.imageUrl ? formatImageUrl(item.imageUrl) : '';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative border-l-4 border-l-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {imgUrl && (
                    <div
                      onClick={() => setSelectedImageItem(item)}
                      className="img-fill-container w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group relative cursor-pointer"
                    >
                      <Image
                        src={imgUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-amber-400 text-black px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          <Maximize2 size={14} />
                          <span>FULLSCREEN</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <span className="inline-block bg-black text-amber-400 text-[10px] font-extrabold px-3 py-1 uppercase tracking-widest rounded-sm mb-3">
                    {item.period}
                  </span>

                  <h3 className="text-lg font-extrabold text-black uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1 mb-3">
                    {item.subtitle}
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-600 text-sm font-semibold uppercase">
              Belum ada data dalam kategori ini.
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImageItem && (
          <div
            onClick={() => setSelectedImageItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative border-2 border-amber-400 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedImageItem(null)}
                className="absolute top-4 right-4 z-10 bg-black text-amber-400 w-11 h-11 flex items-center justify-center rounded-full hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Close Lightbox Modal"
              >
                <X size={20} />
              </button>

              {selectedImageItem.imageUrl ? (
                <div className="img-fill-container w-full h-[350px] sm:h-[500px] bg-black relative flex items-center justify-center">
                  <Image
                    src={formatImageUrl(selectedImageItem.imageUrl)}
                    alt={selectedImageItem.title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-black flex flex-col items-center justify-center text-amber-400 p-6">
                  <Award size={64} />
                  <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-gray-400">
                    Pratinjau Penghargaan
                  </p>
                </div>
              )}

              <div className="p-6 sm:p-8 overflow-y-auto space-y-3 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="inline-block bg-amber-400 text-black text-xs font-black px-3 py-1 uppercase tracking-widest rounded-sm">
                    {selectedImageItem.period}
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">
                    {selectedImageItem.subtitle}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-black uppercase tracking-tight">
                  {selectedImageItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {selectedImageItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
