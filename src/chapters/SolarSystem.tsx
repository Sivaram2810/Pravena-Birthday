import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANETS } from '../data/content';

interface SolarSystemProps {
  onPlanetSelect: (id: string) => void;
}

const SUN_PHOTO = 'https://i.postimg.cc/k5B5K2LB/Whats-App-Image-2026-05-28-at-7-15-28-AM.jpg';

// Desktop orbital planet component
const OrbitalPlanet: React.FC<{
  planet: typeof PLANETS[0];
  orbitRadius: number;
  startAngle: number;
  onClick: () => void;
}> = ({ planet, orbitRadius, startAngle, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(startAngle);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animId: number;
    const speed = (2 * Math.PI) / (planet.speed * 60); // radians per frame

    const animate = () => {
      angleRef.current += speed;
      const x = Math.cos(angleRef.current) * orbitRadius;
      const y = Math.sin(angleRef.current) * orbitRadius * 0.5; // elliptical
      setPos({ x, y });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [orbitRadius, planet.speed]);

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
        zIndex: hovered ? 30 : 10,
      }}
    >
      <div className="relative flex flex-col items-center">
        <motion.button
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="rounded-full flex items-center justify-center text-lg relative"
          style={{
            width: planet.size,
            height: planet.size,
            background: `radial-gradient(circle at 35% 35%, ${planet.color}ee, ${planet.color}55)`,
            boxShadow: hovered
              ? `0 0 30px ${planet.color}cc, 0 0 60px ${planet.color}44, inset 0 0 20px rgba(255,255,255,0.1)`
              : `0 0 12px ${planet.color}66, inset 0 0 10px rgba(255,255,255,0.05)`,
            border: `1px solid ${planet.color}88`,
            transition: 'box-shadow 0.3s ease',
          }}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ fontSize: planet.size * 0.45 }}>{planet.emoji}</span>

          {/* Atmosphere ring */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -4,
              border: `1px solid ${planet.color}33`,
              borderRadius: '50%',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity }}
          />
        </motion.button>

        {/* Label */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.8 }}
              className="absolute top-full mt-2 pointer-events-none z-50"
              style={{ minWidth: '120px' }}
            >
              <div
                className="px-3 py-2 rounded-xl text-center"
                style={{
                  background: 'rgba(5,8,22,0.95)',
                  border: `1px solid ${planet.color}66`,
                  boxShadow: `0 0 20px ${planet.color}33`,
                }}
              >
                <p className="font-cinzel text-xs font-bold" style={{ color: planet.color }}>{planet.label}</p>
                <p className="font-cormorant text-xs text-gray-400 italic leading-tight mt-0.5">{planet.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Mobile grid item
const MobilePlanetCard: React.FC<{
  planet: typeof PLANETS[0];
  index: number;
  onClick: () => void;
}> = ({ planet, index, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${planet.color}18, ${planet.color}08)`,
        border: `1px solid ${planet.color}44`,
      }}
      whileHover={{ scale: 1.05, borderColor: planet.color }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow bg */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(circle at center, ${planet.color}22, transparent 70%)` }}
      />

      <span className="text-2xl relative z-10">{planet.emoji}</span>
      <span
        className="font-cinzel relative z-10"
        style={{ color: planet.color, fontSize: '9px', letterSpacing: '0.05em' }}
      >
        {planet.label}
      </span>
    </motion.button>
  );
};

const SolarSystem: React.FC<SolarSystemProps> = ({ onPlanetSelect }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sunGlow, setSunGlow] = useState(1);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSunGlow(0.8 + Math.random() * 0.4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Use subset of planets with unique orbit radii for desktop
  const orbitalPlanets = PLANETS.slice(0, 12).map((p, i) => ({
    ...p,
    orbitRadius: 100 + Math.floor(i / 4) * 80 + (i % 4) * 20,
    startAngle: (i / 12) * Math.PI * 2,
  }));

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <motion.div
        className="absolute top-6 left-0 right-0 text-center z-20 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1
          className="font-cinzel text-xl md:text-4xl font-bold tracking-widest"
          style={{
            color: '#f7d774',
            textShadow: '0 0 30px rgba(247,215,116,0.6), 0 0 60px rgba(247,215,116,0.3)',
          }}
        >
          PRAVENA'S UNIVERSE
        </h1>
        <p className="font-cormorant text-sm md:text-lg text-gray-400 mt-1 italic">
          She is the center. Everything else orbits her.
        </p>
      </motion.div>

      {/* ── DESKTOP: True Solar System ── */}
      {!isMobile && (
        <div className="relative w-full h-screen flex items-center justify-center">
          {/* Orbital rings (elliptical) */}
          {[100, 180, 260, 340].map((r, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: r * 2 + 40,
                height: (r * 2 + 40) * 0.5,
                border: '1px solid rgba(155,123,255,0.06)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          {/* Sun — Pravena's photo */}
          <div className="absolute z-30" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            {/* Corona rings */}
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 100 + i * 35,
                  height: 100 + i * 35,
                  background: `radial-gradient(circle, rgba(247,215,116,${0.12 - i * 0.025}) 0%, transparent 70%)`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.05 + i * 0.03, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              />
            ))}

            {/* Aura ring */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 130,
                height: 130,
                border: '2px solid rgba(247,215,116,0.3)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Photo */}
            <motion.div
              className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer"
              style={{
                boxShadow: `0 0 ${40 * sunGlow}px rgba(247,215,116,${0.7 * sunGlow}), 0 0 ${80 * sunGlow}px rgba(247,215,116,${0.3 * sunGlow})`,
                border: '3px solid rgba(247,215,116,0.9)',
              }}
              animate={{ scale: sunGlow > 1.1 ? 1.03 : 1 }}
              transition={{ duration: 1.5 }}
            >
              <img src={SUN_PHOTO} alt="Pravena" className="w-full h-full object-cover object-top" />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(247,215,116,0.15), transparent 60%)' }}
              />
            </motion.div>

            <motion.p
              className="font-cinzel text-xs tracking-[0.3em] text-center mt-2"
              style={{ color: '#f7d774', textShadow: '0 0 15px rgba(247,215,116,1)' }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              PRAVENA
            </motion.p>
          </div>

          {/* Planets */}
          {orbitalPlanets.map(planet => (
            <OrbitalPlanet
              key={planet.id}
              planet={planet}
              orbitRadius={planet.orbitRadius}
              startAngle={planet.startAngle}
              onClick={() => onPlanetSelect(planet.id)}
            />
          ))}
        </div>
      )}

      {/* ── MOBILE: Grid Layout ── */}
      {isMobile && (
        <div className="w-full flex flex-col items-center gap-6 pt-28 pb-8 px-4">
          {/* Sun */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative">
              {/* Glow rings */}
              {[1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 80 + i * 30,
                    height: 80 + i * 30,
                    background: `radial-gradient(circle, rgba(247,215,116,${0.15 - i * 0.05}) 0%, transparent 70%)`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2 + i, repeat: Infinity }}
                />
              ))}
              <div
                className="w-20 h-20 rounded-full overflow-hidden relative"
                style={{
                  boxShadow: '0 0 30px rgba(247,215,116,0.7)',
                  border: '3px solid rgba(247,215,116,0.9)',
                }}
              >
                <img src={SUN_PHOTO} alt="Pravena" className="w-full h-full object-cover object-top" />
              </div>
            </div>
            <p className="font-cinzel text-xs tracking-[0.3em]" style={{ color: '#f7d774' }}>PRAVENA</p>
            <p className="font-cormorant text-xs text-gray-500 italic">The Center of Everything</p>
          </motion.div>

          {/* Planet grid */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
            {PLANETS.map((planet, i) => (
              <MobilePlanetCard
                key={planet.id}
                planet={planet}
                index={i}
                onClick={() => onPlanetSelect(planet.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      <motion.p
        className="absolute bottom-4 left-0 right-0 text-center font-cormorant text-sm text-gray-600 italic"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {isMobile ? 'Tap any planet to explore' : 'Click any planet to begin'}
      </motion.p>
    </div>
  );
};

export default SolarSystem;
