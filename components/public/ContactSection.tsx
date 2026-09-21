'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Instagram, Linkedin } from 'lucide-react';
import { Profile } from '@/types';
import { sendContactMessage } from '@/lib/firestore';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setStatus('idle');

    // 1. Save message to Firestore DB / Memory
    const success = await sendContactMessage(formData);
    setLoading(false);

    if (success) {
      setStatus('success');

      // 2. Direct Email Redirect (Launch Mail Client / mailto: link)
      const mailtoSubject = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const targetEmail = profile.contactInfo.email || 'fathur.dev@example.com';

      // Open user's default email client prefilled
      window.location.href = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus('error');
    }
  };

  const contactEmail = profile?.contactInfo?.email || 'dfadha1923@gmail.com';
  const contactLocation = profile?.contactInfo?.location || 'Semarang, Jawa Tengah, Indonesia';
  const instagramUrl = profile?.contactInfo?.instagram || 'https://instagram.com';
  const linkedinUrl = profile?.contactInfo?.linkedin || 'https://linkedin.com';

  return (
    <section id="contact" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-widest">
          HUBUNGI <span className="text-amber-500">SAYA</span>
        </h2>
        <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-4"
        >
          <a
            href={`mailto:${contactEmail}`}
            className="bg-black text-white p-6 rounded-2xl border border-gray-800 flex items-start space-x-4 shadow-lg hover:border-amber-400 transition-all duration-200 group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                ALAMAT EMAIL
              </h4>
              <p className="text-sm font-extrabold text-white mt-1 break-all group-hover:text-amber-400 transition-colors">
                {contactEmail}
              </p>
            </div>
          </a>

          <div className="bg-black text-white p-6 rounded-2xl border border-gray-800 flex items-start space-x-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                LOKASI / ALAMAT
              </h4>
              <p className="text-sm font-extrabold text-white mt-1">
                {contactLocation}
              </p>
            </div>
          </div>

          <div className="bg-black text-white p-6 rounded-2xl border border-gray-800 shadow-lg">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              HUBUNGAN MEDIA SOSIAL
            </h4>
            <div className="flex items-center space-x-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Profile"
                className="flex items-center space-x-3 bg-gray-900 hover:bg-amber-400 text-white hover:text-black px-5 py-3 rounded-xl border border-gray-800 transition-all duration-200 group flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px]"
              >
                <Instagram size={22} className="text-amber-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Instagram</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="flex items-center space-x-3 bg-gray-900 hover:bg-amber-400 text-white hover:text-black px-5 py-3 rounded-xl border border-gray-800 transition-all duration-200 group flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px]"
              >
                <Linkedin size={22} className="text-amber-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-extrabold uppercase tracking-wider">LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md"
        >
          <h3 className="text-xl font-extrabold text-black uppercase tracking-wider mb-2">
            KIRIM PESAN LANGSUNG
          </h3>
          <p className="text-xs text-gray-700 mb-6">
            Pesan akan terkirim langsung ke email {profile.contactInfo.email}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  NAMA ANDA *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  EMAIL ANDA *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@contoh.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                SUBJEK PESAN
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Pertanyaan Proyek / Kerjasama"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                PESAN ANDA *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tuliskan pesan atau penawaran proyek Anda..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="flex items-center space-x-2 text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg text-xs font-bold">
                <CheckCircle size={18} />
                <span>Pesan berhasil dikirim! Membuka aplikasi email...</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center space-x-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-xs font-bold">
                <AlertCircle size={18} />
                <span>Gagal mengirim pesan. Silakan coba lagi.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400 min-h-[44px]"
            >
              <span>{loading ? 'MENGIRIM...' : 'KIRIM KE EMAIL'}</span>
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
