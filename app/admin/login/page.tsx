'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      router.push('/admin');
    } else {
      setError('Kredensial tidak valid. Gunakan akun Firebase Auth atau tombol Masuk Demo Instan di bawah.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-amber-400 selection:text-black">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top Decorative Amber Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg mb-4">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider">
            MASUK PANEL ADMIN CMS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Masuk untuk mengelola seluruh konten portofolio Anda
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              ALAMAT EMAIL
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              KATA SANDI
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'MEMPROSES MASUK...' : 'MASUK KE DASHBOARD'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <span className="relative bg-gray-900 px-3 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
            ATAU UJI COBA DEMO
          </span>
        </div>

        {/* Instant Demo Login Button */}
        <button
          type="button"
          onClick={demoLogin}
          className="w-full bg-gray-800 hover:bg-gray-700 text-amber-400 font-bold py-3 rounded-full text-xs uppercase tracking-wider border border-amber-400/30 flex items-center justify-center space-x-2 hover:scale-[1.02] transition-all"
        >
          <Sparkles size={16} />
          <span>MASUK DEMO INSTAN</span>
        </button>
      </div>
    </div>
  );
}
