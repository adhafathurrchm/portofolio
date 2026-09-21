'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Users, Award } from 'lucide-react';
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

      <div className="flex flex-wrap gap-3 mb-10">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative border-l-4 border-l-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {item.imageUrl && (
                <div className="img-fill-container w-full h-44 mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                  <Image
                    src={formatImageUrl(item.imageUrl)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectFit: 'cover' }}
                  />
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
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-600 text-sm font-semibold uppercase">
            No entries found in this category.
          </div>
        )}
      </div>
    </section>
  );
};
