import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { HER_PHOTOS, OUR_PHOTOS } from '../../data/content';

type Photo = typeof HER_PHOTOS[0];

const PlanetBloom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'her' | 'us'>('her');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  const photos: Photo[] = activeTab === 'her' ? HER_PHOTOS as Photo[] : OUR_PHOTOS as Photo[];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextPhoto = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : 0), [photos.length]);
  const prevPhoto = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : 0), [photos.length]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ff7ab6', textShadow: '0 0 30px rgba(255,122,182,0.5)' }}>
          🌸 BLOOM
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Every photo is a universe in itself</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {(['her', 'us'] as const).map(tab => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-6 py-2 rounded-full font-cinzel text-sm transition-all relative"
            style={{ color: activeTab === tab ? 'white' : '#888' }}
            whileTap={{ scale: 0.97 }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #ff7ab6, #9b7bff)' }}
              />
            )}
            <span className="relative z-10">{tab === 'her' ? '❤️ Her Gallery' : '📸 Our Story'}</span>
          </motion.button>
        ))}
      </div>

      <p className="font-cinzel text-xs text-gray-500 tracking-widest">
        {photos.length} {activeTab === 'her' ? 'moments' : 'memories'} preserved
      </p>

      {/* Masonry gallery */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
        style={{ columns: window.innerWidth > 640 ? '3' : '2', columnGap: '12px' }}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="relative group cursor-pointer rounded-2xl overflow-hidden mb-3 break-inside-avoid"
            style={{ display: 'inline-block', width: '100%' }}
            onClick={() => openLightbox(i)}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* Special badge */}
            {photo.special && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(247,215,116,0.2)', border: '1px solid rgba(247,215,116,0.4)' }}>
                <Star size={8} fill="#f7d774" className="text-yellow-300" />
                <span style={{ color: '#f7d774', fontSize: 8 }} className="font-cinzel">{photo.label}</span>
              </div>
            )}

            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }}
            >
              <div className="flex justify-end">
                <motion.button
                  onClick={e => toggleLike(photo.id, e)}
                  className="p-2 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    size={14}
                    fill={likedPhotos.has(photo.id) ? '#ff7ab6' : 'none'}
                    style={{ color: likedPhotos.has(photo.id) ? '#ff7ab6' : 'white' }}
                  />
                </motion.button>
              </div>
              <p className="font-cormorant text-xs text-gray-200 italic leading-tight">{photo.caption}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 modal-backdrop" onClick={closeLightbox} />

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative z-10 max-w-lg w-full mx-4 rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(255,122,182,0.3)' }}
            >
              <img src={photos[lightboxIndex].url} alt={photos[lightboxIndex].caption} className="w-full max-h-80 object-cover" />
              <div className="glass p-4">
                <p className="font-cormorant text-base text-gray-200 italic">{photos[lightboxIndex].caption}</p>
                {photos[lightboxIndex].special && (
                  <p className="font-cinzel text-xs mt-1" style={{ color: '#f7d774', fontSize: 9 }}>⭐ {photos[lightboxIndex].label}</p>
                )}
              </div>
            </motion.div>

            <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 p-2 glass rounded-full text-white">
              <X size={16} />
            </button>
            <button onClick={prevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 glass rounded-full text-white">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextPhoto} className="absolute right-20 top-1/2 -translate-y-1/2 z-10 p-2 glass rounded-full text-white">
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetBloom;
