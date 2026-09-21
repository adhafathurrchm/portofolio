'use client';

import React, { useEffect, useState } from 'react';
import { getContactMessages, deleteContactMessage } from '@/lib/firestore';
import { ContactMessage } from '@/types';
import { Trash2, Mail, Calendar, User } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const data = await getContactMessages();
    setMessages(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      const ok = await deleteContactMessage(id);
      if (ok) fetchMessages();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
          PESAN <span className="text-amber-400">MASUK</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Tinjau pesan dan pertanyaan yang dikirimkan oleh pengunjung melalui formulir kontak.
        </p>
      </div>

      {loading ? (
        <div className="text-amber-400 text-sm font-bold uppercase tracking-widest text-center py-8">
          Memuat Pesan Masuk...
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-black p-12 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center space-y-3">
          <Mail size={40} className="text-gray-600" />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">
            Kotak Masuk Anda Kosong
          </p>
          <p className="text-xs text-gray-600 max-w-sm">
            Pesan yang dikirimkan melalui formulir kontak publik akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-black p-6 rounded-2xl border border-gray-800 space-y-3 hover:border-amber-400/50 transition-colors shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center font-extrabold text-sm uppercase">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                      <User size={14} className="text-amber-400" />
                      <span>{msg.name}</span>
                    </h3>
                    <p className="text-xs text-amber-400 font-mono">
                      {msg.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(msg.createdAt).toLocaleString('id-ID')}</span>
                  </span>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 bg-gray-900 hover:bg-red-950 text-red-400 rounded-lg transition-colors"
                    title="Hapus Pesan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {msg.subject && (
                <p className="text-xs font-extrabold text-amber-400 uppercase tracking-wide">
                  Subjek: {msg.subject}
                </p>
              )}

              <p className="text-sm text-gray-300 leading-relaxed bg-gray-950 p-4 rounded-xl border border-gray-900">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
