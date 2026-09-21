'use client';

import React, { useEffect, useState } from 'react';
import { getProfileData, saveProfileData } from '@/lib/firestore';
import { Profile } from '@/types';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roleBadgesInput, setRoleBadgesInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfileData();
      setProfile(data);
      setRoleBadgesInput(data.roleBadges.join(', '));
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
        Memuat Data Profil...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
          PENGELOLA PROFIL & <span className="text-amber-400">BIO</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Edit informasi pribadi publik, paragraf bio, lencana peran, dan media foto Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-black p-6 sm:p-8 rounded-2xl border border-gray-800 space-y-6 shadow-xl">
        {/* Basic Info Group */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 border-b border-gray-800 pb-2">
            1. IDENTITAS DIRI
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
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                KATA SOROTAN (WARNA KUNING)
              </label>
              <input
                type="text"
                value={profile.highlightWords}
                onChange={(e) => setProfile({ ...profile, highlightWords: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                LENCANA PERAN (DIPISAH KOMA)
              </label>
              <input
                type="text"
                value={roleBadgesInput}
                onChange={(e) => setRoleBadgesInput(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              PARAGRAF BIO
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Media URLs */}
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 border-b border-gray-800 pb-2">
            2. URL MEDIA FOTO
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                URL FOTO AVATAR (MENDUKUNG GDRIVE & LINK DIRECT)
              </label>
              <input
                type="text"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/... atau link langsung"
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
        </div>

        {/* Contact Info Group */}
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 border-b border-gray-800 pb-2">
            3. DETAIL KONTAK
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                EMAIL
              </label>
              <input
                type="email"
                value={profile.contactInfo.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactInfo: { ...profile.contactInfo, email: e.target.value },
                  })
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                NO. TELEPON / WHATSAPP
              </label>
              <input
                type="text"
                value={profile.contactInfo.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactInfo: { ...profile.contactInfo, phone: e.target.value },
                  })
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                LOKASI / KOTA
              </label>
              <input
                type="text"
                value={profile.contactInfo.location}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactInfo: { ...profile.contactInfo, location: e.target.value },
                  })
                }
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Status Notifications */}
        {status === 'success' && (
          <div className="flex items-center space-x-2 text-green-400 bg-green-950/60 border border-green-800 p-3 rounded-lg text-xs font-bold">
            <CheckCircle size={18} />
            <span>Perubahan profil berhasil disimpan!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-950/60 border border-red-800 p-3 rounded-lg text-xs font-bold">
            <AlertCircle size={18} />
            <span>Terjadi kesalahan saat menyimpan perubahan profil.</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</span>
        </button>
      </form>
    </div>
  );
}
