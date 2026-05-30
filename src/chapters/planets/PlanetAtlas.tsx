import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TIMELINE } from '../../data/content';

const PlanetAtlas: React.FC = () => {
  const [selectedMoment, setSelectedMoment] = useState<typeof TIMELINE[0] | null>(null);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#f7d774', textShadow: '0 0 30px rgba(247,215,116,0.5)' }}>
          🗺️ ATLAS
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">The map of every moment between us</p>
      </motion.div>

      <div className="w-full max-w-2xl relative">
        {/* Central line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(247,215,116,0.35) 10%, rgba(247,215,116,0.35) 90%, transparent)' }}
        />

        {TIMELINE.map((moment, i) => {
          const isRight = i % 2 === 0;
          return (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, x: isRight ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`relative flex ${isRight ? 'justify-start' : 'justify-end'} mb-8`}
              style={{ paddingLeft: isRight ? '0' : '50%', paddingRight: isRight ? '50%' : '0' }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-1/2 top-4 w-3 h-3 rounded-full -translate-x-1/2 z-10"
                style={{ background: moment.color, boxShadow: `0 0 10px ${moment.color}` }}
              />

              {/* Card */}
              <motion.div
                onClick={() => setSelectedMoment(moment)}
                className={`cursor-pointer rounded-2xl p-4 ${isRight ? 'mr-4' : 'ml-4'} w-full max-w-xs`}
                style={{
                  background: `linear-gradient(135deg, ${moment.color}0c, ${moment.color}05)`,
                  border: `1px solid ${moment.color}33`,
                }}
                whileHover={{ scale: 1.03, borderColor: `${moment.color}66` }}
                whileTap={{ scale: 0.98 }}
              >
                {moment.photo && (
                  <div className="rounded-xl overflow-hidden mb-3" style={{ maxHeight: 120 }}>
                    <img src={moment.photo.url} alt={moment.photo.label} className="w-full h-32 object-cover" loading="lazy" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{moment.icon}</span>
                  <span className="font-cinzel text-xs tracking-wider" style={{ color: moment.color }}>{moment.era}</span>
                </div>
                <p className="font-cinzel text-xs text-gray-500 mb-2">{moment.date}</p>
                <p className="font-cormorant text-sm text-gray-300 italic leading-relaxed">{moment.story}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 modal-backdrop" onClick={() => setSelectedMoment(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative glass rounded-3xl p-6 w-full max-w-sm"
              style={{ border: `1px solid ${selectedMoment.color}44` }}
            >
              <button onClick={() => setSelectedMoment(null)} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedMoment.icon}</span>
                <div>
                  <p className="font-cinzel text-sm font-bold" style={{ color: selectedMoment.color }}>{selectedMoment.era}</p>
                  <p className="font-cormorant text-xs text-gray-400 italic">{selectedMoment.date}</p>
                </div>
              </div>
              {selectedMoment.photo && (
                <div className="rounded-xl overflow-hidden mb-4">
                  <img src={selectedMoment.photo.url} alt={selectedMoment.photo.label} className="w-full h-40 object-cover" />
                </div>
              )}
              <p className="font-cormorant text-base text-gray-200 italic leading-relaxed">{selectedMoment.story}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetAtlas;
