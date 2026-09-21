import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Maximize2, X, CheckCircle2 } from 'lucide-react';
import { Competency } from '@/types';
import { formatImageUrl } from '@/lib/gdrive';

interface CompetencySectionProps {
  competencies: Competency[];
}

export const CompetencySection: React.FC<CompetencySectionProps> = ({ competencies }) => {
  const [selectedCert, setSelectedCert] = useState<Competency | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  return (
    <section id="kompetensi" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-widest">
          SERTIFIKASI
        </h2>
        <p className="text-gray-700 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-medium uppercase tracking-wider">
          Sertifikat Kualifikasi & Pelatihan
        </p>
        <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {competencies.map((item, idx) => {
          const certImg = formatImageUrl(item.imageUrl);

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="img-fill-container w-full h-52 bg-gray-900 overflow-hidden group">
                  {certImg ? (
                    <Image
                      src={certImg}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 bg-black">
                      <Award size={48} />
                      <span className="text-xs font-bold uppercase tracking-widest mt-2">Sertifikat Keahlian</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 p-4 backdrop-blur-xs">
                    <button
                      onClick={() => setSelectedCert(item)}
                      className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 flex items-center space-x-1.5 text-xs uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400 min-h-[44px]"
                      title="Lihat Pratinjau Sertifikat"
                    >
                      <Maximize2 size={16} />
                      <span>PRATINJAU</span>
                    </button>
                  </div>

                  {item.category && (
                    <span className="absolute top-3 left-3 bg-black/80 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/40 backdrop-blur-md">
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 text-amber-600 mb-2">
                    <CheckCircle2 size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest">
                      {item.issuer || 'Sertifikat Keahlian'} {item.issueDate && `• ${item.issueDate}`}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-black uppercase tracking-wide leading-snug mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCert(item)}
                  className="text-xs font-black uppercase tracking-wider text-black hover:text-amber-600 transition-colors flex items-center space-x-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                >
                  <span>LIHAT GAMBAR SERTIFIKAT</span>
                  <Maximize2 size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black text-white max-w-4xl w-full rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <div className="p-4 sm:p-6 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    {selectedCert.issuer || 'SERTIFIKAT KEAHLIAN'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
                    {selectedCert.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-11 h-11 flex items-center justify-center bg-gray-900 hover:bg-amber-400 hover:text-black rounded-full text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  aria-label="Close Lightbox Modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="img-fill-container w-full h-[350px] sm:h-[500px] overflow-hidden bg-gray-950 flex items-center justify-center p-4">
                {selectedCert.imageUrl ? (
                  <Image
                    src={formatImageUrl(selectedCert.imageUrl)}
                    alt={selectedCert.title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <Award size={64} className="mx-auto text-amber-400 mb-4" />
                    <p className="text-sm font-bold uppercase">Gambar Sertifikat Tidak Tersedia</p>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6 bg-gray-950 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                  {selectedCert.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
