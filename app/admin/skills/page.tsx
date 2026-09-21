'use client';

import React, { useEffect, useState } from 'react';
import { getSkillsData, saveSkillItem, deleteSkillItem } from '@/lib/firestore';
import { SkillCategory } from '@/types';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, AlertCircle, Cpu } from 'lucide-react';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<SkillCategory> | null>(null);
  const [skillsCsvInput, setSkillsCsvInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchSkills = async () => {
    const data = await getSkillsData();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddNew = () => {
    setEditingItem({
      title: '',
      subtitle: 'Kompetensi Tambahan',
      iconName: 'Network',
      skills: [],
      order: skills.length + 1,
    });
    setSkillsCsvInput('');
    setStatus('idle');
  };

  const handleEdit = (item: SkillCategory) => {
    setEditingItem(item);
    setSkillsCsvInput((item.skills || []).join(', '));
    setStatus('idle');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title) return;

    setSaving(true);
    setStatus('idle');

    const updatedItem: Partial<SkillCategory> = {
      ...editingItem,
      skills: skillsCsvInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const ok = await saveSkillItem(updatedItem);
    setSaving(false);

    if (ok) {
      setStatus('success');
      setEditingItem(null);
      fetchSkills();
    } else {
      setStatus('error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori keahlian ini?')) return;
    const ok = await deleteSkillItem(id);
    if (ok) {
      fetchSkills();
    }
  };

  if (loading) {
    return (
      <div className="text-amber-400 font-bold uppercase tracking-widest text-sm py-12 text-center">
        Loading Data Keahlian...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            KEAHLIAN <span className="text-amber-400">MANAGER</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Kelola kategori keahlian teknis dan daftar skill/tools Anda.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center space-x-2 transition-all hover:scale-105 shrink-0"
        >
          <Plus size={18} />
          <span>TAMBAH KEAHLIAN</span>
        </button>
      </div>

      {status === 'success' && (
        <div className="flex items-center space-x-2 text-green-400 bg-green-950/60 border border-green-800 p-4 rounded-xl text-xs font-bold">
          <CheckCircle size={18} />
          <span>Data keahlian berhasil disimpan!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-950/60 border border-red-800 p-4 rounded-xl text-xs font-bold">
          <AlertCircle size={18} />
          <span>Terjadi kesalahan saat menyimpan data.</span>
        </div>
      )}

      {/* Editor Form */}
      {editingItem && (
        <form onSubmit={handleSave} className="bg-black p-6 sm:p-8 rounded-2xl border-2 border-amber-400 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <h2 className="text-base font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu size={20} />
              <span>{editingItem.id ? 'EDIT KATEGORI KEAHLIAN' : 'TAMBAH KATEGORI KEAHLIAN BARU'}</span>
            </h2>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                KATEGORI KEAHLIAN
              </label>
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="misal: Jaringan & Telekomunikasi"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                SUBTITLE / TAG
              </label>
              <input
                type="text"
                value={editingItem.subtitle || ''}
                onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                placeholder="misal: Kompetensi Utama"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                IKON LUCIDE
              </label>
              <select
                value={editingItem.iconName || 'Network'}
                onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Network">Network (Jaringan)</option>
                <option value="Server">Server (Hardware & IoT)</option>
                <option value="Layout">Layout (Desain & Visual)</option>
                <option value="Code">Code (Software & Tools)</option>
                <option value="Cpu">Cpu (Sistem Embedded)</option>
                <option value="ShieldCheck">ShieldCheck (Security)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              DAFTAR SKILL (DIPISAHKAN DENGAN KOMA)
            </label>
            <textarea
              rows={3}
              required
              value={skillsCsvInput}
              onChange={(e) => setSkillsCsvInput(e.target.value)}
              placeholder="Cisco & MikroTik, VLAN & IP Subnetting, Routing & Switching, Fiber Optic"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
            <p className="text-[10px] text-gray-500 mt-1 font-mono">
              Contoh: Cisco & MikroTik, VLAN & IP Subnetting, Fiber Optic
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center space-x-2 transition-transform hover:scale-105 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'SAVING...' : 'SIMPAN KEAHLIAN'}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-colors"
            >
              BATAL
            </button>
          </div>
        </form>
      )}

      {/* Skills List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((item) => (
          <div
            key={item.id}
            className="bg-black p-6 rounded-2xl border border-gray-800 space-y-4 hover:border-gray-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.subtitle || 'KEAHLIAN'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-gray-900 text-amber-400 hover:bg-amber-400 hover:text-black rounded-lg transition-colors"
                    title="Edit Keahlian"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-gray-900 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    title="Hapus Keahlian"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                {item.title}
              </h3>

              <div className="flex flex-wrap gap-2 mt-3">
                {(item.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-900 text-gray-200 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500 text-xs font-bold uppercase tracking-wider">
            Belum ada keahlian yang ditambahkan. Klik tombol "Tambah Keahlian" di atas.
          </div>
        )}
      </div>
    </div>
  );
}
