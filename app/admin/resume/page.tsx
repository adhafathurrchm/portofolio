'use client';

import React, { useEffect, useState } from 'react';
import { getResumeData, saveResumeItem, deleteResumeItem } from '@/lib/firestore';
import { ResumeItem, ResumeCategory } from '@/types';
import { Plus, Trash2, Edit2, Save, X, GraduationCap, Briefcase, Users, Award } from 'lucide-react';

const categories: { id: ResumeCategory; label: string; icon: React.ElementType }[] = [
  { id: 'EXPERIENCE', label: 'Pengalaman', icon: Briefcase },
  { id: 'EDUCATION', label: 'Pendidikan', icon: GraduationCap },
  { id: 'ORGANIZATION', label: 'Organisasi', icon: Users },
  { id: 'AWARD', label: 'Penghargaan', icon: Award },
];

export default function AdminResumePage() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ResumeCategory>('EXPERIENCE');
  const [editingItem, setEditingItem] = useState<Partial<ResumeItem> | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  async function fetchResume() {
    setLoading(true);
    const data = await getResumeData();
    setItems(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title || !editingItem.subtitle) return;

    const success = await saveResumeItem({
      ...editingItem,
      category: editingItem.category || activeTab,
    });

    if (success) {
      setEditingItem(null);
      fetchResume();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus item riwayat ini?')) {
      const ok = await deleteResumeItem(id);
      if (ok) fetchResume();
    }
  };

  const filteredItems = items.filter((item) => item.category === activeTab);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            PENGELOLA <span className="text-amber-400">RIWAYAT</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Kelola riwayat Pendidikan, Pengalaman Kerja, Organisasi, dan Penghargaan.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              category: activeTab,
              title: '',
              subtitle: '',
              period: '',
              description: '',
              order: items.length + 1,
            })
          }
          className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>TAMBAH ITEM RIWAYAT</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          const IconComp = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-amber-400 text-black shadow-lg scale-105'
                  : 'bg-black text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <IconComp size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Edit / Create Form Modal */}
      {editingItem && (
        <form onSubmit={handleSave} className="bg-black p-6 rounded-2xl border-2 border-amber-400 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              {editingItem.id ? 'EDIT ITEM RIWAYAT' : 'TAMBAH ITEM RIWAYAT'} ({categories.find(c => c.id === (editingItem.category || activeTab))?.label.toUpperCase()})
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
                JUDUL (POSISI / GELAR / PENGHARGAAN) *
              </label>
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="misal: IoT Engineer / Mahasiswa Teknik"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                SUBTITLE (INSTITUSI / PERUSAHAAN) *
              </label>
              <input
                type="text"
                required
                value={editingItem.subtitle || ''}
                onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                placeholder="misal: Politeknik Negeri Semarang"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                PERIODE / TAHUN *
              </label>
              <input
                type="text"
                required
                value={editingItem.period || ''}
                onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                placeholder="misal: 2024 - Sekarang"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                KATEGORI
              </label>
              <select
                value={editingItem.category || activeTab}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as ResumeCategory })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="EXPERIENCE">PENGALAMAN</option>
                <option value="EDUCATION">PENDIDIKAN</option>
                <option value="ORGANIZATION">ORGANISASI</option>
                <option value="AWARD">PENGHARGAAN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              URL FOTO / LOGO (GDRIVE / DIRECT URL)
            </label>
            <input
              type="text"
              value={editingItem.imageUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/... atau https://..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Link foto/logo opsional (misal: untuk Organisasi atau Penghargaan). Link Google Drive otomatis dikonversi!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              DESKRIPSI
            </label>
            <textarea
              rows={3}
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              placeholder="Ringkasan penjelasan mengenai peran atau pencapaian..."
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
              <span>SIMPAN ITEM</span>
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-amber-400 text-sm font-bold uppercase tracking-widest text-center py-8">
            Memuat Data Riwayat...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-black p-8 rounded-2xl border border-gray-800 text-center text-gray-500 text-xs uppercase tracking-wider font-bold">
            Belum ada item dalam kategori ini. Klik "TAMBAH ITEM RIWAYAT" di atas.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-black p-6 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-400/50 transition-colors"
            >
              <div className="space-y-1">
                <span className="inline-block bg-amber-400 text-black text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-widest rounded-sm">
                  {item.period}
                </span>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {item.subtitle}
                </p>
                <p className="text-xs text-gray-400 pt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 bg-gray-900 hover:bg-gray-800 text-amber-400 rounded-lg transition-colors"
                  title="Edit Item"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-gray-900 hover:bg-red-950 text-red-400 rounded-lg transition-colors"
                  title="Hapus Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
