import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { HER_PHOTOS, OUR_PHOTOS } from '../../data/content';

type Photo = typeof HER_PHOTOS[0];

const PhotoCard: React.FC<{
  photo: Photo;
  index: number;
  onClick: () => void;
  liked: boolean;
  onLike: (e: React.MouseEvent) => void;
}> = ({ photo, index, onClick, liked, onLike }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, type: 'spring', stiffness: 200, damping: 20 }}
    className="cursor-pointer rounded-2xl overflow-hidden relative group"
    style={{
      border: `1px solid ${photo.color}${photo.special ? '55' : '28'}`,
      boxShadow: photo.special ? `0 0 20px ${photo.color}22` : 'none',
    }}
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="aspect-square relative overflow-hidden">
      <img
        src={photo.url}
        alt={photo.label}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to top, ${photo.color}44, transparent 50%)` }}
      />

      {photo.special && (
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-cinzel"
          style={{ background: `${photo.color}33`, border: `1px solid ${photo.color}66`, fontSize: 8, color: photo.color, letterSpacing: '0.08em' }}
        >
          ✦ {photo.label}
        </div>
      )}

      <button
        onClick={onLike}
        className="absolute top-2 right-2 p-1.5 rounded-full transition-all"
        style={{ background: 'rgba(0,0,0,0.5)' }}
      >
        <Heart
          size={14}
          fill={liked ? '#ff7ab6' : 'none'}
          stroke={liked ? '#ff7ab6' : 'white'}
        />
      </button>
    </div>

    <div className="p-3" style={{ background: `linear-gradient(135deg, ${photo.color}08, transparent)` }}>
      <p className="font-cormorant text-sm text-gray-300 italic leading-snug">{photo.caption}</p>
      {!photo.special && (
        <p className="font-cinzel mt-1" style={{ color: photo.color, fontSize: 8, letterSpacing: '0.08em' }}>{photo.label}</p>
      )}
    </div>
  </motion.div>
);

const PlanetBloom: React.FC = () => {
  const [tab, setTab] = useState<'her' | 'us'>('her');
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Photo | null>(null);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const photos = tab === 'her' ? HER_PHOTOS : OUR_PHOTOS;

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ff7ab6', textShadow: '0 0 30px rgba(255,122,182,0.5)' }}>
          🌸 BLOOM
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Gallery of you, and of us</p>
      </motion.div>

      {/* Tab selector */}
      <div className="flex gap-3">
        {[
          { key: 'her', label: '✨ Her', count: HER_PHOTOS.length },
          { key: 'us', label: '💛 Us', count: OUR_PHOTOS.length },
        ].map(t => (
          <motion.button
            key={t.key}
            onClick={() => setTab(t.key as 'her' | 'us')}
            className="px-5 py-2 rounded-full font-cinzel text-xs tracking-wider flex items-center gap-2"
            style={{
              background: tab === t.key ? 'rgba(255,122,182,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(255,122,182,${tab === t.key ? 0.5 : 0.18})`,
              color: tab === t.key ? '#ff7ab6' : '#666',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.label}
            <span
              className="rounded-full px-1.5 py-0.5 font-cinzel"
              style={{ background: 'rgba(255,122,182,0.2)', fontSize: 8, color: '#ff7ab6' }}
            >
              {t.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {photos.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setSelected(photo)}
              liked={likedPhotos.has(photo.id)}
              onLike={(e) => toggleLike(photo.id, e)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 modal-backdrop"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden"
              style={{ border: `1px solid ${selected.color}44` }}
            >
              <img src={selected.url} alt={selected.label} className="w-full object-cover" style={{ maxHeight: '60vh' }} />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 rounded-full"
                style={{ background: 'rgba(5,8,22,0.85)' }}
              >
                <X size={16} className="text-gray-300" />
              </button>
              <div className="p-5" style={{ background: 'rgba(5,8,22,0.95)' }}>
                <p className="font-cinzel text-sm font-bold mb-1" style={{ color: selected.color }}>{selected.label}</p>
                <p className="font-cormorant text-base text-gray-200 italic leading-relaxed">{selected.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetBloom;
