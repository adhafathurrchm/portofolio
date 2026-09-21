'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCompetenciesData, saveCompetencyItem, deleteCompetencyItem } from '@/lib/firestore';
import { Competency } from '@/types';
import { Plus, Trash2, Edit2, Save, X, Award } from 'lucide-react';
import { formatImageUrl } from '@/lib/gdrive';

export default function AdminCompetenciesPage() {
  const [items, setItems] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<Competency> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const data = await getCompetenciesData();
    setItems(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title) return;

    const success = await saveCompetencyItem(editingItem);
    if (success) {
      setEditingItem(null);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
      const ok = await deleteCompetencyItem(id);
      if (ok) fetchData();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            PENGELOLA <span className="text-amber-400">SERTIFIKASI</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Kelola Sertifikat Kualifikasi, Gambar Sertifikat, Penerbit, dan Keterangan.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              issuer: '',
              issueDate: '',
              category: 'Networking',
              imageUrl: '',
              credentialUrl: '',
              description: '',
              order: items.length + 1,
            })
          }
          className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>TAMBAH SERTIFIKAT BARU</span>
        </button>
      </div>

      {/* Edit / Create Form Modal */}
      {editingItem && (
        <form onSubmit={handleSave} className="bg-black p-6 rounded-2xl border-2 border-amber-400 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              {editingItem.id ? 'EDIT SERTIFIKAT' : 'TAMBAH SERTIFIKAT BARU'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                JUDUL SERTIFIKAT *
              </label>
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="misal: Sertifikat Keahlian Network Technician"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                PENERBIT / INSTITUSI (ISSUER)
              </label>
              <input
                type="text"
                value={editingItem.issuer || ''}
                onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                placeholder="misal: Diskominfo / Cisco / BNSP"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                TAHUN / TANGGAL TERBIT
              </label>
              <input
                type="text"
                value={editingItem.issueDate || ''}
                onChange={(e) => setEditingItem({ ...editingItem, issueDate: e.target.value })}
                placeholder="misal: 2024"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                KATEGORI
              </label>
              <input
                type="text"
                value={editingItem.category || ''}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                placeholder="Networking / IoT / Telecom / Security"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              LINK GAMBAR SERTIFIKAT (GDRIVE / DIRECT URL) *
            </label>
            <input
              type="text"
              value={editingItem.imageUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/... atau https://..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Link Google Drive share secara otomatis dikonversi agar gambar sertifikat langsung muncul!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              DESKRIPSI SERTIFIKAT *
            </label>
            <textarea
              rows={3}
              required
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              placeholder="Rincian kompetensi dan keahlian yang tercantum dalam sertifikat..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white"
            >
              BATAL
            </button>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <Save size={16} />
              <span>SIMPAN SERTIFIKAT</span>
            </button>
          </div>
        </form>
      )}

      {/* Certificates List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-amber-400 text-sm font-bold uppercase tracking-widest text-center py-8">
            Memuat Data Sertifikasi...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-black p-8 rounded-2xl border border-gray-800 text-center text-gray-500 text-xs uppercase tracking-wider font-bold">
            Belum ada sertifikat. Klik "TAMBAH SERTIFIKAT BARU".
          </div>
        ) : (
          items.map((item) => {
            const certImg = formatImageUrl(item.imageUrl);
            return (
              <div
                key={item.id}
                className="bg-black p-6 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-400/50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {certImg ? (
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-800 bg-gray-900 shrink-0">
                      <Image src={certImg} alt={item.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-900 text-amber-400 flex items-center justify-center shrink-0 border border-gray-800">
                      <Award size={28} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-widest rounded-sm">
                        {item.category || 'Sertifikasi'}
                      </span>
                      {item.issuer && (
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          • {item.issuer} ({item.issueDate || '2024'})
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 bg-gray-900 hover:bg-gray-800 text-amber-400 rounded-lg transition-colors"
                    title="Edit Sertifikat"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-gray-900 hover:bg-red-950 text-red-400 rounded-lg transition-colors"
                    title="Hapus Sertifikat"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
