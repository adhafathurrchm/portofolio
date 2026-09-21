'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import { Profile } from '@/types';
import { formatImageUrl } from '@/lib/gdrive';

interface HeroSectionProps {
  profile: Profile;
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onNavigate }) => {
  const heroImageSrc = formatImageUrl(profile.heroImageUrl);

  // Split name to highlight words in yellow outline / yellow bold
  const renderStyledName = (fullName: string = '', highlightWord: string = '') => {
    if (!fullName) return '';
    if (!highlightWord) return fullName;
    try {
      const escaped = highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = fullName.split(new RegExp(`(${escaped})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === highlightWord.toLowerCase() ? (
          <span key={i} className="text-amber-400 font-black tracking-wider">
            {part}
          </span>
        ) : (
          part
        )
      );
    } catch (err) {
      return fullName;
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-12 lg:py-0">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center items-start space-y-6"
        >
          <div className="text-xs font-black uppercase tracking-widest text-black">
            {profile?.greeting || 'HI THERE!'}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black uppercase tracking-tight leading-none">
            I'M {renderStyledName(profile?.fullName || '', profile?.highlightWords || '')}
          </h1>

          <div className="flex flex-wrap gap-2">
            {(profile?.roleBadges || []).map((badge, idx) => (
              <span
                key={idx}
                className="bg-amber-400 text-black text-xs font-extrabold px-4 py-1.5 uppercase tracking-widest rounded-sm shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-lg">
            {profile.bio}
          </p>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('about')}
              className="group inline-flex items-center space-x-3 bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-8 py-4 rounded-full text-xs uppercase tracking-widest shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400"
            >
              <span>SELENGKAPNYA TENTANG SAYA</span>
              {/* Arrow icon provides a visual cue pointing forward to the Next section */}
              <ArrowRight size={18} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:flex lg:col-span-5 img-fill-container bg-black min-h-[350px] lg:min-h-full items-center justify-center overflow-hidden border-t-4 lg:border-t-0 lg:border-l-4 border-amber-400"
        >
          {heroImageSrc ? (
            <Image
              src={heroImageSrc}
              alt={profile.fullName}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="absolute inset-0 w-full h-full object-cover hero-grayscale-img hover:scale-105 transition-transform duration-500"
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center text-amber-400 p-6">
              <User size={80} />
              <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-gray-400">
                Hero Photo
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
