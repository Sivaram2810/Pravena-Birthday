import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PLANETS } from '../data/content';

const ProgressMap: React.FC = () => {
  const { visitedPlanets, allPlanetsVisited, totalVisits, universeComplete, sessionCount } = useApp();
  const [open, setOpen] = useState(false);

  const visitedCount = visitedPlanets.size;
  const totalPlanets = PLANETS.length;
  const pct = Math.round((visitedCount / totalPlanets) * 100);

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 glass rounded-full p-2 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label="Open universe map"
      >
        {/* Progress ring */}
        <div className="relative" style={{ width: 24, height: 24 }}>
          <svg width="24" height="24" className="spin-slow absolute inset-0" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(247,215,116,0.15)" strokeWidth="2" />
            <circle
              cx="12" cy="12" r="10"
              fill="none"
              stroke={allPlanetsVisited ? '#f7d774' : '#9b7bff'}
              strokeWidth="2"
              strokeDasharray={`${pct * 0.628} 62.8`}
              strokeLinecap="round"
              transform="rotate(-90 12 12)"
            />
          </svg>
          <Map size={12} className="absolute inset-0 m-auto" style={{ color: allPlanetsVisited ? '#f7d774' : '#9b7bff' }} />
        </div>
        <span className="font-cinzel text-xs pr-1" style={{ color: allPlanetsVisited ? '#f7d774' : '#888', fontSize: 9, letterSpacing: '0.05em' }}>
          {visitedCount}/{totalPlanets}
        </span>
      </motion.button>

      {/* Map panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 modal-backdrop"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="relative glass rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ border: '1px solid rgba(155,123,255,0.3)' }}
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-white transition-colors"
                aria-label="Close map"
              >
                <X size={16} />
              </button>

              {/* Title */}
              <h2 className="font-cinzel text-center text-lg font-bold mb-1" style={{ color: '#f7d774' }}>
                🗺️ Universe Map
              </h2>
              <p className="font-cormorant text-center text-sm italic mb-5 text-gray-400">
                Your journey through the stars
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Worlds', value: `${visitedCount}/${totalPlanets}` },
                  { label: 'Visits', value: totalVisits },
                  { label: 'Sessions', value: sessionCount },
                ].map(stat => (
                  <div key={stat.label} className="glass-light rounded-2xl p-3 text-center">
                    <div className="font-cinzel text-lg font-bold" style={{ color: '#f7d774' }}>{stat.value}</div>
                    <div className="font-cinzel text-xs text-gray-500" style={{ fontSize: 9, letterSpacing: '0.05em' }}>{stat.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between mb-1.5">
                  <span className="font-cinzel text-xs text-gray-400" style={{ fontSize: 9 }}>EXPLORATION</span>
                  <span className="font-cinzel text-xs" style={{ color: '#9b7bff', fontSize: 9 }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #9b7bff, #f7d774)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Planet grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {PLANETS.map(planet => {
                  const visited = visitedPlanets.has(planet.id);
                  return (
                    <div
                      key={planet.id}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                      style={{
                        background: visited ? `${planet.color}18` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${visited ? planet.color + '44' : 'rgba(255,255,255,0.05)'}`,
                      }}
                      title={planet.label}
                    >
                      <span style={{ fontSize: 16, filter: visited ? 'none' : 'grayscale(1) opacity(0.3)' }}>
                        {planet.emoji}
                      </span>
                      <span className="font-cinzel text-center" style={{ fontSize: 7, color: visited ? planet.color : '#444', letterSpacing: '0.03em' }}>
                        {planet.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Completion message */}
              {universeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center glass-light rounded-2xl p-3"
                  style={{ border: '1px solid rgba(247,215,116,0.3)' }}
                >
                  <p className="font-cinzel text-sm" style={{ color: '#f7d774' }}>✨ Universe Complete</p>
                  <p className="font-cormorant text-xs italic text-gray-400 mt-0.5">
                    You have explored every world built for you.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressMap;
