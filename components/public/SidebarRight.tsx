'use client';

import React from 'react';
import { Home, User, Briefcase, FileText, Send, Cpu } from 'lucide-react';

interface SidebarRightProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const iconNavItems = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'about', label: 'Tentang Saya', icon: User },
  { id: 'kompetensi', label: 'Sertifikasi', icon: Cpu },
  { id: 'resume', label: 'Riwayat', icon: FileText },
  { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
  { id: 'contact', label: 'Kontak', icon: Send },
];

export const SidebarRight: React.FC<SidebarRightProps> = ({
  activeSection,
  onNavigate,
}) => {
  return (
    <aside className="hidden lg:flex fixed top-0 right-0 h-full w-16 bg-amber-400 z-40 flex-col items-center justify-center space-y-6 shadow-xl border-l border-amber-500/20">
      {iconNavItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            title={item.label}
            className={`p-3 rounded-full transition-all duration-300 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400 ${
              isActive
                ? 'bg-black text-amber-400 scale-110 shadow-lg'
                : 'text-black hover:bg-black/20 hover:scale-105'
            }`}
          >
            <IconComponent size={20} />
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-black text-amber-400 text-xs font-bold px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap uppercase tracking-wider">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
};
