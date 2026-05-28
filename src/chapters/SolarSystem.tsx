import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANETS } from '../data/content';

interface SolarSystemProps {
  onPlanetSelect: (id: string) => void;
}

const SUN_PHOTO = 'https://i.postimg.cc/k5B5K2LB/Whats-App-Image-2026-05-28-at-7-15-28-AM.jpg';

// Orbit radii with generous spacing so no overlap
// Each orbit ring is well separated from the next
const ORBIT_RADII = [130, 210, 295, 385, 475, 560];

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
    const speed = (2 * Math.PI) / (planet.speed * 60);

    const animate = () => {
      angleRef.current += speed;
      const x = Math.cos(angleRef.current) * orbitRadius;
      const y = Math.sin(angleRef.current) * orbitRadius * 0.42; // elliptical
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
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

  // Distribute planets across orbits — 2-3 per orbit with natural staggered starts
  // so none appear in a line
  const orbitalPlanets = PLANETS.map((p, i) => {
    const orbitIndex = Math.floor(i / 2.4); // spread across 6 orbit rings
    const orbitIdx = Math.min(orbitIndex, ORBIT_RADII.length - 1);
    const planetsOnOrbit = Math.ceil(PLANETS.length / ORBIT_RADII.length);
    const posOnOrbit = i % planetsOnOrbit;
    // Natural staggered starting angles (not linear)
    const baseAngle = (orbitIdx * 1.1) + (posOnOrbit * ((Math.PI * 2) / planetsOnOrbit)) + (orbitIdx * 0.7);
    return {
      ...p,
      orbitRadius: ORBIT_RADII[orbitIdx],
      startAngle: baseAngle,
    };
  });

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
          {/* Orbital rings (elliptical) — more visible with soft glow */}
          {ORBIT_RADII.map((r, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: r * 2 + 40,
                height: (r * 2 + 40) * 0.42,
                border: '1px solid rgba(155,123,255,0.18)',
                borderRadius: '50%',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(155,123,255,0.08)',
              }}
            />
          ))}

          {/* Orbit ring soft glow layer */}
          {ORBIT_RADII.map((r, i) => (
            <div
              key={`glow-${i}`}
              className="absolute pointer-events-none"
              style={{
                width: r * 2 + 44,
                height: (r * 2 + 44) * 0.42,
                borderRadius: '50%',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: 'inset 0 0 6px rgba(155,123,255,0.06)',
                border: '1px solid rgba(247,215,116,0.04)',
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
                  border: `1px solid rgba(247,215,116,${0.12 / i})`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${10 + i * 5}px rgba(247,215,116,${0.08 / i})`,
                }}
                animate={{ scale: [1, 1 + i * 0.02, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

            {/* Sun glow */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 120,
                height: 120,
                background: 'radial-gradient(circle, rgba(247,215,116,0.3) 0%, transparent 70%)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, sunGlow, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Photo circle */}
            <div
              className="relative rounded-full overflow-hidden"
              style={{
                width: 88,
                height: 88,
                border: '2px solid rgba(247,215,116,0.6)',
                boxShadow: '0 0 30px rgba(247,215,116,0.4), 0 0 60px rgba(247,215,116,0.2)',
              }}
            >
              <img
                src={SUN_PHOTO}
                alt="Pravena"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center label */}
            <motion.p
              className="text-center font-cinzel mt-2 text-xs tracking-widest"
              style={{ color: '#f7d774', textShadow: '0 0 10px rgba(247,215,116,0.6)' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
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
        <div className="w-full px-4 pt-24 pb-8">
          {/* Sun center for mobile */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className="relative rounded-full overflow-hidden mb-2"
              style={{
                width: 72,
                height: 72,
                border: '2px solid rgba(247,215,116,0.6)',
                boxShadow: '0 0 20px rgba(247,215,116,0.4)',
              }}
            >
              <img src={SUN_PHOTO} alt="Pravena" className="w-full h-full object-cover" />
            </div>
            <p className="font-cinzel text-xs tracking-widest" style={{ color: '#f7d774' }}>PRAVENA</p>
            <p className="font-cormorant text-xs text-gray-500 italic mt-0.5">Center of everything</p>
          </motion.div>

          {/* Planet grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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

      {/* Floating hint for desktop */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.p
            className="font-cormorant text-xs text-gray-600 italic tracking-wide"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Hover a planet to discover its world · Click to enter
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

export default SolarSystem;
