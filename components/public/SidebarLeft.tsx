'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X, User } from 'lucide-react';
import { Profile } from '@/types';
import { formatImageUrl } from '@/lib/gdrive';

interface SidebarLeftProps {
  profile: Profile;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const navItems = [
  { id: 'home', label: 'BERANDA' },
  { id: 'about', label: 'TENTANG SAYA' },
  { id: 'kompetensi', label: 'SERTIFIKASI' },
  { id: 'resume', label: 'RIWAYAT' },
  { id: 'portfolio', label: 'PORTOFOLIO' },
  { id: 'contact', label: 'KONTAK' },
];

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  profile,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const avatarSrc = formatImageUrl(profile.avatarUrl);

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 bg-black text-amber-400 p-3 rounded-full shadow-lg border border-amber-400/30 hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-amber-400 z-40 flex flex-col justify-between transition-transform duration-300 shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-black p-4 lg:p-6 flex flex-col items-center justify-center text-center relative border-b-4 border-amber-400">
          <div className="img-fill-container w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl mb-3 group">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={profile.fullName}
                fill
                sizes="112px"
                className="absolute inset-0 w-full h-full object-cover hero-grayscale-img group-hover:scale-110 transition-transform duration-300"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center text-amber-400">
                <User size={48} />
              </div>
            )}
          </div>
          <h2 className="text-base lg:text-lg font-black text-white uppercase tracking-wider">
            {profile?.fullName || ''}
          </h2>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-1">
            {profile?.roleBadges?.[0] || 'PORTFOLIO'}
          </p>
        </div>

        <nav className="flex-1 py-6 px-6 relative flex flex-col justify-start">
          <div className="absolute left-8 top-10 bottom-10 w-0.5 border-l-2 border-dashed border-black/30" />

          <ul className="space-y-6 relative pl-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="relative flex items-center">
                  <span
                    className={`absolute -left-[31px] w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-black border-amber-400 scale-125 shadow-md'
                        : 'bg-amber-400 border-black/40'
                    }`}
                  />
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-200 text-left rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400 ${
                      isActive
                        ? 'text-black translate-x-2 font-black border-b-2 border-black pb-0.5'
                        : 'text-black/70 hover:text-black hover:translate-x-1'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 bg-amber-500/20 text-center border-t border-black/10">
          <p className="text-[10px] font-bold text-black/70 tracking-widest uppercase">
            © {new Date().getFullYear()} {profile.fullName}
          </p>
        </div>
      </aside>
    </>
  );
};
