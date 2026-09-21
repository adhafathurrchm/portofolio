'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Home, FileText, Briefcase, Mail, ArrowUpRight, Layers, Cpu, Award } from 'lucide-react';
import { getProjectsData, getResumeData, getContactMessages, getProfileData, getServicesData } from '@/lib/firestore';
import { Profile } from '@/types';

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [resumeCount, setResumeCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const [prof, projs, res, msgs, servs] = await Promise.all([
        getProfileData(),
        getProjectsData(),
        getResumeData(),
        getContactMessages(),
        getServicesData(),
      ]);
      setProfile(prof);
      setProjectCount(projs.length);
      setResumeCount(res.length);
      setMessageCount(msgs.length);
      setServiceCount(servs.length);
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
          RINGKASAN <span className="text-amber-400">DASHBOARD</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Selamat datang kembali, {profile?.fullName || 'Admin'}! Kelola seluruh konten portofolio Anda di sini.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black p-6 rounded-2xl border border-gray-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              PROYEK PORTOFOLIO
            </p>
            <p className="text-4xl font-extrabold text-amber-400 mt-2">
              {projectCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="bg-black p-6 rounded-2xl border border-gray-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              ITEM RIWAYAT
            </p>
            <p className="text-4xl font-extrabold text-amber-400 mt-2">
              {resumeCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-black p-6 rounded-2xl border border-gray-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              BIDANG LAYANAN
            </p>
            <p className="text-4xl font-extrabold text-amber-400 mt-2">
              {serviceCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <Layers size={24} />
          </div>
        </div>

        <div className="bg-black p-6 rounded-2xl border border-gray-800 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              PESAN MASUK
            </p>
            <p className="text-4xl font-extrabold text-amber-400 mt-2">
              {messageCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <Mail size={24} />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <h2 className="text-xl font-extrabold uppercase tracking-wider text-white pt-4">
        PENGELOLAAN CEPAT
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/hero"
          className="bg-black p-6 rounded-2xl border border-gray-800 hover:border-amber-400 transition-all duration-300 group flex items-start justify-between shadow-lg"
        >
          <div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-2">
              <Home size={20} />
              <span>EDIT HALAMAN AWAL (HERO)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Perbarui teks sapaan, awalan nama (I'M/SAYA), nama lengkap, kata sorotan, lencana peran, dan foto hero.
            </p>
          </div>
          <ArrowUpRight size={24} className="text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link
          href="/admin/about"
          className="bg-black p-6 rounded-2xl border border-gray-800 hover:border-amber-400 transition-all duration-300 group flex items-start justify-between shadow-lg"
        >
          <div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-2">
              <User size={20} />
              <span>EDIT TENTANG SAYA (BIO)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Perbarui paragraf deskripsi diri (bio), foto avatar profil, serta alamat kontak dan link media sosial Anda.
            </p>
          </div>
          <ArrowUpRight size={24} className="text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link
          href="/admin/services"
          className="bg-black p-6 rounded-2xl border border-gray-800 hover:border-amber-400 transition-all duration-300 group flex items-start justify-between shadow-lg"
        >
          <div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-2">
              <Layers size={20} />
              <span>PENGELOLA APA YANG SAYA KERJAKAN</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Kelola daftar bidang pekerjaan, deskripsi, dan ikon utama.
            </p>
          </div>
          <ArrowUpRight size={24} className="text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link
          href="/admin/skills"
          className="bg-black p-6 rounded-2xl border border-gray-800 hover:border-amber-400 transition-all duration-300 group flex items-start justify-between shadow-lg"
        >
          <div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-2">
              <Cpu size={20} />
              <span>PENGELOLA KEAHLIAN</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Kelola kategori keahlian teknis dan daftar skill/tools.
            </p>
          </div>
          <ArrowUpRight size={24} className="text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link
          href="/admin/competencies"
          className="bg-black p-6 rounded-2xl border border-gray-800 hover:border-amber-400 transition-all duration-300 group flex items-start justify-between shadow-lg"
        >
          <div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-2">
              <Award size={20} />
              <span>PENGELOLA SERTIFIKASI</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Kelola sertifikat kualifikasi, tanggal terbit, dan gambar pratinjau.
            </p>
          </div>
          <ArrowUpRight size={24} className="text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link
          href="/admin/resume"
          className="bg-black p-6 rounded-2xl border border-gray-800 hover:border-amber-400 transition-all duration-300 group flex items-start justify-between shadow-lg"
        >
          <div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-2">
              <FileText size={20} />
              <span>PENGELOLA RIWAYAT</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Tambah atau edit Pendidikan, Pengalaman Kerja, Organisasi, dan Penghargaan.
            </p>
          </div>
          <ArrowUpRight size={24} className="text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link
          href="/admin/portfolio"
          className="bg-black p-6 rounded-2xl border border-gray-800 hover:border-amber-400 transition-all duration-300 group flex items-start justify-between shadow-lg"
        >
          <div>
            <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={20} />
              <span>PENGELOLA PORTOFOLIO</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Tambah proyek pameran baru, kategori, URL proyek, dan foto miniatur.
            </p>
          </div>
          <ArrowUpRight size={24} className="text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
