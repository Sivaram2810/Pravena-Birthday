import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PLANETS } from '../data/content';

const ProgressMap: React.FC = () => {
  const { visitedPlanets, totalVisits, sessionCount, goToPlanet } = useApp();
  const [open, setOpen] = useState(false);

  const visitedCount = visitedPlanets.size;
  const totalPlanets = PLANETS.length;
  const pct = Math.round((visitedCount / totalPlanets) * 100);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full font-cinzel text-xs"
        style={{
          background: 'rgba(5,8,22,0.85)',
          border: '1px solid rgba(155,123,255,0.3)',
          color: '#9b7bff',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Map size={12} />
        <span style={{ fontSize: 9, letterSpacing: '0.08em' }}>
          {visitedCount}/{totalPlanets}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end justify-start p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(5,8,22,0.7)', backdropFilter: 'blur(10px)' }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="relative rounded-3xl p-5 w-full max-w-sm"
              style={{
                background: 'rgba(5,8,22,0.95)',
                border: '1px solid rgba(155,123,255,0.25)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-cinzel text-xs tracking-widest" style={{ color: '#9b7bff' }}>UNIVERSE MAP</p>
                <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-300">✕</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Worlds', value: `${visitedCount}/${totalPlanets}` },
                  { label: 'Visits', value: totalVisits },
                  { label: 'Sessions', value: sessionCount },
                ].map(stat => (
                  <div key={stat.label} className="text-center rounded-xl p-2" style={{ background: 'rgba(155,123,255,0.08)', border: '1px solid rgba(155,123,255,0.15)' }}>
                    <p className="font-cinzel text-sm font-bold" style={{ color: '#9b7bff' }}>{stat.value}</p>
                    <p className="font-cinzel text-xs text-gray-600" style={{ fontSize: 8, letterSpacing: '0.08em' }}>{stat.label.toUpperCase()}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #9b7bff, #f7d774)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              {/* Planet grid */}
              <div className="grid grid-cols-5 gap-2">
                {PLANETS.map(planet => (
                  <motion.button
                    key={planet.id}
                    onClick={() => { goToPlanet(planet.id); setOpen(false); }}
                    className="flex flex-col items-center gap-1 p-1.5 rounded-xl"
                    style={{
                      background: visitedPlanets.has(planet.id) ? `${planet.color}15` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${visitedPlanets.has(planet.id) ? planet.color + '44' : 'rgba(255,255,255,0.06)'}`,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={planet.label}
                  >
                    <span style={{ fontSize: 14, filter: visitedPlanets.has(planet.id) ? 'none' : 'brightness(0.4)' }}>
                      {planet.emoji}
                    </span>
                    {visitedPlanets.has(planet.id) && (
                      <div className="w-1 h-1 rounded-full" style={{ background: planet.color }} />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressMap;
