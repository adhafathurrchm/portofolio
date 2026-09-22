'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProjectsData, saveProjectData, deleteProjectData } from '@/lib/firestore';
import { PortfolioProject } from '@/types';
import { Plus, Trash2, Edit2, Save, X, ExternalLink, Star } from 'lucide-react';

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const data = await getProjectsData();
    setProjects(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.thumbnailUrl) return;

    // If this project is selected as category representative for ALL, uncheck others in the same category
    if (editingProject.showInAll) {
      const currentCat = (editingProject.category || '').trim().toUpperCase();
      const otherProjectsInCat = projects.filter(
        (p) => p.id !== editingProject.id && (p.category || '').trim().toUpperCase() === currentCat && p.showInAll
      );
      for (const other of otherProjectsInCat) {
        await saveProjectData({ ...other, showInAll: false });
      }
    }

    const success = await saveProjectData(editingProject);
    if (success) {
      setEditingProject(null);
      fetchProjects();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      const ok = await deleteProjectData(id);
      if (ok) fetchProjects();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            PENGELOLA <span className="text-amber-400">PORTOFOLIO</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Tambah, edit, atau hapus proyek pameran portofolio Anda.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingProject({
              title: '',
              category: 'TELEKOMUNIKASI',
              thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
              description: '',
              projectUrl: '',
              repoUrl: '',
              featured: false,
              showInAll: false,
            })
          }
          className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>TAMBAH PROYEK BARU</span>
        </button>
      </div>

      {/* Create / Edit Form Modal */}
      {editingProject && (
        <form onSubmit={handleSave} className="bg-black p-6 rounded-2xl border-2 border-amber-400 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              {editingProject.id ? 'EDIT PROYEK' : 'TAMBAH PROYEK PORTOFOLIO'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                JUDUL PROYEK *
              </label>
              <input
                type="text"
                required
                value={editingProject.title || ''}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                placeholder="misal: Perakitan Perangkat Keras IoT"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                KATEGORI PROYEK *
              </label>
              <select
                required
                value={editingProject.category || 'TELEKOMUNIKASI'}
                onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
              >
                <option value="TELEKOMUNIKASI">TELEKOMUNIKASI</option>
                <option value="NETWORK">NETWORK</option>
                <option value="IOT">IOT</option>
                <option value="WEBSITE">WEBSITE</option>
                <option value="AUDIOVISUAL">AUDIOVISUAL</option>
                <option value="LAINNYA">LAINNYA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              URL GAMBAR MINIATUR / THUMBNAIL (MENDUKUNG GDRIVE & DIRECT LINK) *
            </label>
            <input
              type="text"
              required
              value={editingProject.thumbnailUrl || ''}
              onChange={(e) => setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/... atau https://..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                URL DEMO LANGSUNG (OPSIONAL)
              </label>
              <input
                type="text"
                value={editingProject.projectUrl || ''}
                onChange={(e) => setEditingProject({ ...editingProject, projectUrl: e.target.value })}
                placeholder="https://example.com/demo"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                URL REPOSITORI GITHUB (OPSIONAL)
              </label>
              <input
                type="text"
                value={editingProject.repoUrl || ''}
                onChange={(e) => setEditingProject({ ...editingProject, repoUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              DESKRIPSI PROYEK
            </label>
            <textarea
              rows={3}
              value={editingProject.description || ''}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              placeholder="Jelaskan fitur utama, teknologi yang digunakan, serta tujuan proyek..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <div className="flex items-center space-x-2 bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/30">
              <input
                type="checkbox"
                id="showInAllCheck"
                checked={editingProject.showInAll || false}
                onChange={(e) => setEditingProject({ ...editingProject, showInAll: e.target.checked })}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
              <label htmlFor="showInAllCheck" className="text-xs font-black text-amber-400 uppercase cursor-pointer">
                TAMPILKAN SEBAGAI SAMPUL KATEGORI DI TAB "ALL" (1 PER KATEGORI)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={editingProject.featured || false}
                onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
              <label htmlFor="featuredCheck" className="text-xs font-bold text-gray-300 uppercase cursor-pointer">
                Tandai sebagai Unggulan
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white"
            >
              BATAL
            </button>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <Save size={16} />
              <span>SIMPAN PROYEK</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="text-amber-400 text-sm font-bold uppercase tracking-widest text-center py-8">
          Memuat Proyek Portofolio...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-black p-8 rounded-2xl border border-gray-800 text-center text-gray-500 text-xs uppercase tracking-wider font-bold">
          Belum ada proyek. Klik "TAMBAH PROYEK BARU" untuk menambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-black rounded-2xl border border-gray-800 overflow-hidden flex flex-col justify-between hover:border-amber-400/50 transition-colors shadow-lg"
            >
              <div className="img-fill-container w-full h-48 bg-gray-900">
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 text-amber-400 text-[10px] font-extrabold px-2.5 py-1 uppercase tracking-widest rounded-sm">
                  {project.category}
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  {project.showInAll && (
                    <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm shadow-md">
                      SAMPUL TAB ALL
                    </span>
                  )}
                  {project.featured && (
                    <span className="bg-gray-900 text-white text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-widest rounded-sm flex items-center space-x-1 border border-gray-700">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>UNGGULAN</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                  <div className="flex items-center space-x-2">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1 uppercase"
                      >
                        <span>LIHAT DEMO</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-2 bg-gray-900 hover:bg-gray-800 text-amber-400 rounded-lg transition-colors"
                      title="Edit Proyek"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-gray-900 hover:bg-red-950 text-red-400 rounded-lg transition-colors"
                      title="Hapus Proyek"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
