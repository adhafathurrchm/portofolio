'use client';

import React, { useEffect, useState } from 'react';
import { getProfileData, saveProfileData } from '@/lib/firestore';
import { Profile } from '@/types';
import { Save, CheckCircle, AlertCircle, Home, Sparkles } from 'lucide-react';

export default function AdminHeroPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [namePrefixInput, setNamePrefixInput] = useState("I'M");
  const [roleBadgesInput, setRoleBadgesInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfileData();
      setProfile(data);
      setNamePrefixInput(data.namePrefix ?? "I'M");
      setRoleBadgesInput((data.roleBadges || []).join(', '));
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setStatus('idle');

    const updatedProfile: Profile = {
      ...profile,
      namePrefix: namePrefixInput.trim(),
      roleBadges: roleBadgesInput.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const ok = await saveProfileData(updatedProfile);
    setSaving(false);

    if (ok) {
      setStatus('success');
      setProfile(updatedProfile);
    } else {
      setStatus('error');
    }
  };

  if (loading || !profile) {
    return (
      <div className="text-amber-400 font-bold uppercase tracking-widest text-sm py-12 text-center">
        Memuat Data Halaman Awal...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
          <Home className="text-amber-400" size={32} />
          <span>EDIT HALAMAN AWAL <span className="text-amber-400">(HERO SECTION)</span></span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Atur teks sapaan, awalan nama (I'M / SAYA), nama lengkap, kata sorotan, lencana peran, dan foto hero layar utama.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-black p-6 sm:p-8 rounded-2xl border border-gray-800 space-y-6 shadow-xl">
        {/* Hero Section Fields */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 border-b border-gray-800 pb-2 flex items-center gap-2">
            <Sparkles size={18} />
            <span>KONTEN LAYAR UTAMA (HERO)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                TEKS SAPAAN (GREETING)
              </label>
              <input
                type="text"
                value={profile.greeting}
                onChange={(e) => setProfile({ ...profile, greeting: e.target.value })}
                placeholder="misal: HALO, SAYA atau HALO!!"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                AWALAN NAMA (NAME PREFIX)
              </label>
              <input
                type="text"
                value={namePrefixInput}
                onChange={(e) => setNamePrefixInput(e.target.value)}
                placeholder="misal: I'M atau SAYA atau kosongkan"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Teks yang muncul sebelum nama Anda di judul besar (misal: "I'M" atau "SAYA").
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                NAMA LENGKAP
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                KATA SOROTAN (WARNA KUNING)
              </label>
              <input
                type="text"
                value={profile.highlightWords}
                onChange={(e) => setProfile({ ...profile, highlightWords: e.target.value })}
                placeholder="Kata dalam nama yang di-highlight kuning"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              LENCANA PERAN (DIPISAH KOMA)
            </label>
            <input
              type="text"
              value={roleBadgesInput}
              onChange={(e) => setRoleBadgesInput(e.target.value)}
              placeholder="misal: MAHASISWA TEKNIK TELEKOMUNIKASI, IOT & NETWORKING"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              URL FOTO HERO (MENDUKUNG GDRIVE & LINK DIRECT)
            </label>
            <input
              type="text"
              value={profile.heroImageUrl}
              onChange={(e) => setProfile({ ...profile, heroImageUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/... atau link langsung"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Status Notifications */}
        {status === 'success' && (
          <div className="flex items-center space-x-2 text-green-400 bg-green-950/60 border border-green-800 p-3 rounded-lg text-xs font-bold">
            <CheckCircle size={18} />
            <span>Perubahan Halaman Awal berhasil disimpan!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-950/60 border border-red-800 p-3 rounded-lg text-xs font-bold">
            <AlertCircle size={18} />
            <span>Terjadi kesalahan saat menyimpan perubahan.</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN HERO'}</span>
        </button>
      </form>
    </div>
  );
}
