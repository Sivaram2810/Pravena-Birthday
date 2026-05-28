import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { HER_PHOTOS, OUR_PHOTOS } from '../../data/content';

type AnyPhoto = {
  id: string;
  url: string;
  caption: string;
  label: string;
  special: boolean;
};

const PlanetBloom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'her' | 'us'>('her');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  const photos: AnyPhoto[] = (activeTab === 'her' ? HER_PHOTOS : OUR_PHOTOS) as AnyPhoto[];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const nextPhoto = () => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : 0);
  const prevPhoto = () => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : 0);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#ff7ab6', textShadow: '0 0 30px rgba(255,122,182,0.5)' }}
        >
          🌸 BLOOM
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Every photo is a universe in itself
        </p>
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
            <span className="relative z-10">
              {tab === 'her' ? '✨ Her Gallery' : '💛 Our Story'}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Photo count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-cinzel text-xs tracking-widest text-gray-500"
      >
        {photos.length} {activeTab === 'her' ? 'moments' : 'memories'} preserved
      </motion.p>

      {/* Masonry Gallery */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl"
        style={{ columns: '2', columnGap: '12px' }}
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
            {/* Image */}
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-300 flex flex-col justify-between p-3"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                opacity: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
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
                    size={16}
                    fill={likedPhotos.has(photo.id) ? '#ff7ab6' : 'none'}
                    style={{ color: likedPhotos.has(photo.id) ? '#ff7ab6' : 'white' }}
                  />
                </motion.button>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {photo.special && <Star size={10} fill="#f7d774" className="text-yellow-300" />}
                  <span className="font-cinzel" style={{ color: '#f7d774', fontSize: '10px' }}>{photo.label}</span>
                </div>
                <p className="font-cormorant text-xs text-gray-200 italic leading-tight">{photo.caption}</p>
              </div>
            </div>

            {/* Special badge */}
            {photo.special && (
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(247,215,116,0.2)', border: '1px solid rgba(247,215,116,0.4)' }}
              >
                <Star size={8} fill="#f7d774" className="text-yellow-300" />
                <span style={{ fontSize: '8px', color: '#f7d774', fontFamily: 'Cinzel' }}>FAVOURITE</span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Birthday Time Capsule */}
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="rounded-3xl p-6 cursor-pointer relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(247,215,116,0.08), rgba(255,122,182,0.08))',
            border: '1px solid rgba(247,215,116,0.25)',
          }}
          onClick={() => setEnvelopeOpen(!envelopeOpen)}
          whileHover={{ borderColor: 'rgba(247,215,116,0.5)' }}
          animate={{ boxShadow: envelopeOpen ? '0 0 40px rgba(247,215,116,0.15)' : '0 0 0px transparent' }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 shimmer pointer-events-none" />

          <div className="flex items-center justify-center gap-3 mb-2 relative z-10">
            <motion.span
              className="text-3xl"
              animate={envelopeOpen ? { rotateY: 180, scale: 1.2 } : { rotateY: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
            >
              {envelopeOpen ? '💌' : '✉️'}
            </motion.span>
            <h3 className="font-cinzel text-lg" style={{ color: '#f7d774' }}>
              Birthday Time Capsule
            </h3>
          </div>

          <p className="font-cormorant text-center text-gray-400 italic text-sm relative z-10">
            {envelopeOpen ? 'Your letter from the stars...' : 'Click to open your birthday message'}
          </p>

          <AnimatePresence>
            {envelopeOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden relative z-10"
              >
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'rgba(5,8,22,0.7)',
                    border: '1px solid rgba(255,122,182,0.2)',
                  }}
                >
                  <p className="font-cormorant text-lg text-gray-100 leading-relaxed italic text-center">
                    "On the day you were born, the universe made its finest decision.
                    Every picture in this gallery is proof that light chooses you —
                    always has, always will.
                    <br /><br />
                    Happy birthday, Pravena.
                    You are, and will forever be, the most beautiful thing
                    I have ever had the privilege of knowing."
                  </p>
                  <p className="font-cinzel text-right text-sm mt-4" style={{ color: '#f7d774' }}>
                    — With all my stars 🌟
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.97)' }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="relative max-w-3xl w-full mx-4 flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={photos[lightboxIndex].url}
                  alt={photos[lightboxIndex].caption}
                  className="w-full max-h-[70vh] object-contain rounded-2xl"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {/* Navigation */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
                <button
                  className="pointer-events-auto glass rounded-full p-2 hover:bg-white/10 transition-colors"
                  onClick={e => { e.stopPropagation(); prevPhoto(); }}
                >
                  <ChevronLeft size={22} className="text-white" />
                </button>
                <button
                  className="pointer-events-auto glass rounded-full p-2 hover:bg-white/10 transition-colors"
                  onClick={e => { e.stopPropagation(); nextPhoto(); }}
                >
                  <ChevronRight size={22} className="text-white" />
                </button>
              </div>

              {/* Close */}
              <button
                className="absolute top-3 right-3 glass rounded-full p-2"
                onClick={closeLightbox}
              >
                <X size={16} className="text-white" />
              </button>

              {/* Caption */}
              <div className="mt-4 text-center px-4">
                {photos[lightboxIndex].special && (
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={12} fill="#f7d774" className="text-yellow-300" />
                    <span className="font-cinzel text-xs" style={{ color: '#f7d774' }}>
                      {photos[lightboxIndex].label}
                    </span>
                  </div>
                )}
                <p className="font-cormorant text-base text-gray-200 italic">
                  {photos[lightboxIndex].caption}
                </p>
                <p className="font-inter text-xs text-gray-600 mt-2">
                  {lightboxIndex + 1} / {photos.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetBloom;
