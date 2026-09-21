'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Smartphone, Server, Award, Layers, Printer, Network, Radio, Cpu, ShieldCheck } from 'lucide-react';
import { Profile, Service, SkillCategory } from '@/types';
import { initialSkills } from '@/lib/mock-data';

interface AboutSectionProps {
  profile: Profile;
  services: Service[];
  skills?: SkillCategory[];
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Layout,
  Smartphone,
  Server,
  Award,
  Layers,
  Printer,
  Network,
  Radio,
  Cpu,
  ShieldCheck,
};

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, services, skills }) => {
  const skillsList = (skills && skills.length > 0) ? skills : initialSkills;

  return (
    <section id="about" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-widest">
          TENTANG <span className="text-amber-500">SAYA</span>
        </h2>
        <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">
          Saya <span className="text-amber-500 font-extrabold">{profile?.fullName || ''}</span>, {(profile?.roleBadges || []).join(' / ')}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {profile?.bio || ''}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h3 className="text-2xl font-black text-black uppercase tracking-wider mb-6 text-center flex items-center justify-center gap-3">
          <span className="w-8 h-1 bg-amber-400 inline-block" />
          APA YANG SAYA KERJAKAN?
          <span className="w-8 h-1 bg-amber-400 inline-block" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const IconComp = iconMap[service.iconName] || Network;
            return (
              <div
                key={service.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 flex items-start space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold flex-shrink-0">
                  <IconComp size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-black uppercase tracking-wide">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Keahlian Subsection */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <h3 className="text-2xl font-black text-black uppercase tracking-wider mb-8 text-center flex items-center justify-center gap-3">
            <span className="w-8 h-1 bg-amber-400 inline-block" />
            KEAHLIAN
            <span className="w-8 h-1 bg-amber-400 inline-block" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillsList.map((skillCat) => {
              const IconComp = iconMap[skillCat.iconName] || Network;
              return (
                <div key={skillCat.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-amber-400 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-black text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-black uppercase tracking-wide">{skillCat.title}</h4>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{skillCat.subtitle}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(skillCat.skills || []).map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 hover:bg-amber-400 text-gray-800 hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
