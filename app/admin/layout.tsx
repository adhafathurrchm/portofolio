'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  User,
  Home,
  FileText,
  Briefcase,
  Mail,
  LogOut,
  ArrowLeft,
  Lock,
  Menu,
  X,
  Award,
  Layers,
  Cpu,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Halaman Awal (Hero)', icon: Home },
  { href: '/admin/about', label: 'Tentang Saya (Bio)', icon: User },
  { href: '/admin/services', label: 'Apa Yang Saya Kerjakan', icon: Layers },
  { href: '/admin/skills', label: 'Keahlian', icon: Cpu },
  { href: '/admin/competencies', label: 'Sertifikasi', icon: Award },
  { href: '/admin/resume', label: 'Riwayat', icon: FileText },
  { href: '/admin/portfolio', label: 'Portofolio', icon: Briefcase },
  { href: '/admin/messages', label: 'Pesan Masuk', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  // If on login page, render login children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-amber-400 space-y-4 p-4">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-extrabold uppercase tracking-widest text-xs">
          Memuat Dashboard CMS...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md w-full space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center mx-auto">
            <Lock size={24} />
          </div>
          <h2 className="text-lg font-extrabold text-white uppercase tracking-wider">
            AUTENTIKASI ADMIN DIPERLUKAN
          </h2>
          <p className="text-xs text-gray-400">
            Silakan masuk untuk mengakses Panel Admin CMS.
          </p>
          <Link
            href="/admin/login"
            className="block w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3 rounded-full text-xs uppercase tracking-wider transition-all"
          >
            KE HALAMAN MASUK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row font-body relative">
      <div className="md:hidden bg-black border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" />
          <h2 className="text-base font-extrabold text-amber-400 uppercase tracking-wider">
            PANEL ADMIN CMS
          </h2>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-gray-900 text-amber-400 rounded-lg border border-amber-400/30 hover:scale-105 transition-transform"
          aria-label="Toggle Admin Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 md:w-64 bg-black border-r border-gray-800 flex flex-col justify-between p-6 z-50 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-gray-800 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-amber-400 uppercase tracking-wider">
                PANEL ADMIN CMS
              </h2>
              <p className="text-[10px] text-gray-400 font-mono">
                {user.email}
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" />
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-lg'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <IconComp size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-gray-400 hover:text-amber-400 hover:bg-gray-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            <span>LIHAT SITUS PUBLIK</span>
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors uppercase tracking-wider"
          >
            <LogOut size={16} />
            <span>KELUAR</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto bg-gray-950">
        {children}
      </main>
    </div>
  );
}
