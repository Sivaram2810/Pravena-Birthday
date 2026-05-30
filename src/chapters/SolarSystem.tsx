import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { PLANETS, UNIVERSE_NAME } from '../data/content';

// Orbit radii with comfortable spacing
const ORBIT_RADII = [130, 195, 265, 340, 415, 490];

// Sun photo
const SUN_PHOTO = 'https://i.postimg.cc/k5B5K2LB/Whats-App-Image-2026-05-28-at-7-15-28-AM.jpg';

// Desktop orbital planet
const OrbitalPlanet: React.FC<{
  planet: typeof PLANETS[0];
  orbitRadius: number;
  startAngle: number;
  visited: boolean;
  onClick: () => void;
}> = ({ planet, orbitRadius, startAngle, visited, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(startAngle);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    const speed = (2 * Math.PI) / (planet.speed * 60);

    const animate = () => {
      angleRef.current += speed;
      const x = Math.cos(angleRef.current) * orbitRadius;
      const y = Math.sin(angleRef.current) * orbitRadius * 0.42;
      setPos({ x, y });
      animIdRef.current = requestAnimationFrame(animate);
    };
    animIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animIdRef.current);
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
          className="rounded-full flex items-center justify-center relative"
          style={{
            width: planet.size,
            height: planet.size,
            background: `radial-gradient(circle at 35% 35%, ${planet.color}ee, ${planet.color}44)`,
            boxShadow: hovered
              ? `0 0 30px ${planet.color}cc, 0 0 60px ${planet.color}44, inset 0 0 20px rgba(255,255,255,0.12)`
              : visited
                ? `0 0 16px ${planet.color}88, 0 0 30px ${planet.color}33, inset 0 0 10px rgba(255,255,255,0.05)`
                : `0 0 10px ${planet.color}55, inset 0 0 8px rgba(255,255,255,0.04)`,
            border: `1px solid ${planet.color}${visited ? 'aa' : '66'}`,
            transition: 'box-shadow 0.3s ease',
          }}
          whileHover={{ scale: 1.35 }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ fontSize: planet.size * 0.42 }}>{planet.emoji}</span>

          {/* Atmosphere ring */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -4, border: `1px solid ${planet.color}33`, borderRadius: '50%' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity }}
          />

          {/* Visited indicator */}
          {visited && (
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 6, height: 6,
                background: planet.color,
                bottom: -2, right: -2,
                boxShadow: `0 0 6px ${planet.color}`,
              }}
            />
          )}
        </motion.button>

        {/* Hover label */}
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
                  border: `1px solid ${planet.color}55`,
                  boxShadow: `0 0 20px ${planet.color}22`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p className="font-cinzel text-xs font-bold" style={{ color: planet.color, letterSpacing: '0.05em' }}>
                  {planet.label}
                </p>
                <p className="font-cormorant text-xs text-gray-400 italic leading-tight mt-0.5">
                  {planet.description}
                </p>
                {visited && (
                  <p className="font-cinzel text-xs mt-1" style={{ color: planet.color, fontSize: 8, opacity: 0.7 }}>
                    ✓ visited
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Mobile planet card
const MobilePlanetCard: React.FC<{
  planet: typeof PLANETS[0];
  index: number;
  visited: boolean;
  onClick: () => void;
}> = ({ planet, index, visited, onClick }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, scale: 0, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: index * 0.04, type: 'spring', stiffness: 220, damping: 22 }}
    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl relative overflow-hidden"
    style={{
      background: `linear-gradient(135deg, ${planet.color}18, ${planet.color}08)`,
      border: `1px solid ${planet.color}${visited ? '55' : '33'}`,
    }}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.95 }}
  >
    <div
      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity rounded-2xl"
      style={{ background: `radial-gradient(circle at center, ${planet.color}22, transparent 70%)` }}
    />
    <span className="text-2xl relative z-10" style={{ filter: visited ? 'none' : 'brightness(0.7)' }}>
      {planet.emoji}
    </span>
    <span
      className="font-cinzel relative z-10 text-center"
      style={{ color: planet.color, fontSize: '9px', letterSpacing: '0.05em' }}
    >
      {planet.label}
    </span>
    {visited && (
      <div
        className="absolute top-1.5 right-1.5 rounded-full"
        style={{ width: 5, height: 5, background: planet.color, boxShadow: `0 0 4px ${planet.color}` }}
      />
    )}
  </motion.button>
);

// SolarSystem main
interface SolarSystemProps {
  onPlanetSelect: (id: string) => void;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ onPlanetSelect }) => {
  const { visitedPlanets, universeComplete } = useApp();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sunGlow, setSunGlow] = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Sun pulsing glow
  useEffect(() => {
    const iv = setInterval(() => {
      setSunGlow(prev => prev === 1 ? 1.06 : 1);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Hide welcome after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(false), 4500);
    return () => clearTimeout(t);
  }, []);

  // Assign orbits
  const planetOrbits = PLANETS.map((planet, i) => ({
    ...planet,
    orbitRadius: ORBIT_RADII[planet.orbitIndex % ORBIT_RADII.length],
    startAngle: (i / PLANETS.length) * Math.PI * 2 + (i * 0.7),
  }));

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Welcome overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 flex justify-center z-40 pointer-events-none px-4"
          >
            <div
              className="glass rounded-2xl px-6 py-3 text-center"
              style={{ borderColor: 'rgba(247,215,116,0.2)' }}
            >
              <p className="font-cinzel text-sm" style={{ color: '#f7d774', letterSpacing: '0.1em' }}>
                ✦ {UNIVERSE_NAME}'s Universe ✦
              </p>
              <p className="font-cormorant text-xs text-gray-400 italic mt-0.5">
                {isMobile ? 'Tap any world to explore' : 'Click any world to explore'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universe complete banner */}
      <AnimatePresence>
        {universeComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 left-0 right-0 flex justify-center z-40 pointer-events-none px-4"
          >
            <div
              className="glass rounded-2xl px-6 py-3 text-center"
              style={{ border: '1px solid rgba(247,215,116,0.4)', boxShadow: '0 0 30px rgba(247,215,116,0.1)' }}
            >
              <p className="font-cinzel text-sm" style={{ color: '#f7d774' }}>
                ✨ Universe Complete — Thank you for exploring every world
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile ? (
        /* ─── MOBILE GRID ─── */
        <div className="w-full px-4 py-20">
          {/* Sun card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center mb-8"
          >
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: 90, height: 90,
                boxShadow: '0 0 30px rgba(247,215,116,0.6), 0 0 80px rgba(247,215,116,0.2)',
                border: '2px solid rgba(247,215,116,0.5)',
              }}
            >
              <img src={SUN_PHOTO} alt={UNIVERSE_NAME} className="w-full h-full object-cover" />
            </div>
            <p className="font-cinzel text-sm mt-2 glow-gold" style={{ color: '#f7d774', letterSpacing: '0.2em' }}>
              {UNIVERSE_NAME.toUpperCase()}
            </p>
            <p className="font-cormorant text-xs text-gray-500 italic">The center of this universe</p>
          </motion.div>

          {/* Planet grid */}
          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
            {PLANETS.map((planet, i) => (
              <MobilePlanetCard
                key={planet.id}
                planet={planet}
                index={i}
                visited={visitedPlanets.has(planet.id)}
                onClick={() => onPlanetSelect(planet.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* ─── DESKTOP ORBITAL ─── */
        <div
          className="relative flex items-center justify-center"
          style={{ width: '100vw', height: '100vh' }}
        >
          {/* Orbit rings */}
          {ORBIT_RADII.map((r, i) => (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: r * 2,
                height: r * 2 * 0.42,
                border: `1px solid rgba(255,255,255,${0.03 + i * 0.005})`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          {/* Sun center */}
          <motion.div
            className="absolute z-20 flex flex-col items-center"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            animate={{ scale: [sunGlow, 1, sunGlow] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: 80, height: 80,
                boxShadow: '0 0 40px rgba(247,215,116,0.7), 0 0 100px rgba(247,215,116,0.25), 0 0 200px rgba(247,215,116,0.08)',
                border: '2px solid rgba(247,215,116,0.5)',
              }}
            >
              <img src={SUN_PHOTO} alt={UNIVERSE_NAME} className="w-full h-full object-cover" />
            </div>
            <p
              className="font-cinzel text-xs mt-2 tracking-widest"
              style={{ color: '#f7d774', textShadow: '0 0 20px rgba(247,215,116,0.8)', letterSpacing: '0.25em' }}
            >
              {UNIVERSE_NAME.toUpperCase()}
            </p>
          </motion.div>

          {/* Planets */}
          {planetOrbits.map(planet => (
            <OrbitalPlanet
              key={planet.id}
              planet={planet}
              orbitRadius={planet.orbitRadius}
              startAngle={planet.startAngle}
              visited={visitedPlanets.has(planet.id)}
              onClick={() => onPlanetSelect(planet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SolarSystem;
