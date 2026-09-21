'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types';
import { formatImageUrl } from '@/lib/gdrive';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const visibleTestimonials = testimonials.filter((t) => t.isVisible !== false);

  return (
    <section id="testimonials" className="py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-widest">
          TESTI<span className="text-amber-500">MONIALS</span>
        </h2>
        <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* Grid of Testimonials (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleTestimonials.map((item, idx) => {
          const avatarUrl = formatImageUrl(item.avatarUrl);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-black text-white p-6 sm:p-8 rounded-2xl border border-gray-800 relative flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 shadow-xl group"
            >
              {/* Quote Icon background watermark */}
              <Quote
                size={60}
                className="absolute top-4 right-6 text-gray-800 group-hover:text-amber-400/20 transition-colors pointer-events-none"
              />

              {/* Testimonial Quote Content */}
              <p className="text-sm sm:text-base text-gray-300 italic leading-relaxed relative z-10 mb-6">
                "{item.quote}"
              </p>

              {/* Client Info & Rating Stars */}
              <div className="flex items-center space-x-4 border-t border-gray-800 pt-4">
                <div className="img-fill-container w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={item.clientName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-base uppercase">
                      {item.clientName.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white uppercase tracking-wide">
                    {item.clientName}
                  </h4>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    {item.clientRole}
                  </p>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mt-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
