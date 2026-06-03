import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { PLANETS, UNIVERSE_NAME } from '../data/content';

// Normalized orbit radii - good spacing
const ORBIT_RADII = [115, 170, 228, 290, 356, 422];

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
    // Uniform base speed — all planets move at similar pace
    const basePeriod = 50; // seconds per revolution (normalized)
    const speed = (2 * Math.PI) / (basePeriod * 60);

    const animate = () => {
      angleRef.current += speed;
      const x = Math.cos(angleRef.current) * orbitRadius;
      const y = Math.sin(angleRef.current) * orbitRadius * 0.38;
      setPos({ x, y });
      animIdRef.current = requestAnimationFrame(animate);
    };
    animIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animIdRef.current);
  }, [orbitRadius]);

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
              ? `0 0 28px ${planet.color}cc, 0 0 55px ${planet.color}44, inset 0 0 18px rgba(255,255,255,0.12)`
              : visited
                ? `0 0 14px ${planet.color}88, 0 0 28px ${planet.color}33`
                : `0 0 8px ${planet.color}55`,
            border: `1px solid ${planet.color}${visited ? 'aa' : '55'}`,
            transition: 'box-shadow 0.3s ease',
          }}
          whileHover={{ scale: 1.35 }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ fontSize: planet.size * 0.42 }}>{planet.emoji}</span>

          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -4, border: `1px solid ${planet.color}33`, borderRadius: '50%' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

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

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.8 }}
              className="absolute top-full mt-2 pointer-events-none z-50"
              style={{ minWidth: '130px' }}
            >
              <div
                className="px-3 py-2 rounded-xl text-center"
                style={{
                  background: 'rgba(5,8,22,0.97)',
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
                  <p className="font-cinzel mt-0.5" style={{ color: planet.color, fontSize: 8, opacity: 0.7 }}>
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
      border: `1px solid ${planet.color}${visited ? '55' : '28'}`,
    }}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="text-2xl relative z-10" style={{ filter: visited ? 'none' : 'brightness(0.65)' }}>
      {planet.emoji}
    </span>
    <span
      className="font-cinzel relative z-10 text-center"
      style={{ color: planet.color, fontSize: '8px', letterSpacing: '0.05em' }}
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

  useEffect(() => {
    const iv = setInterval(() => {
      setSunGlow(prev => prev === 1 ? 1.06 : 1);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Spread planets evenly across orbits
  const planetOrbits = PLANETS.map((planet, i) => ({
    ...planet,
    orbitRadius: ORBIT_RADII[planet.orbitIndex % ORBIT_RADII.length],
    startAngle: (i / PLANETS.length) * Math.PI * 2 + i * 0.5,
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
            className="absolute top-6 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div
              className="px-6 py-3 rounded-full font-cormorant text-base italic text-gray-300"
              style={{ background: 'rgba(5,8,22,0.85)', border: '1px solid rgba(247,215,116,0.2)', backdropFilter: 'blur(12px)' }}
            >
              Welcome to your universe, {UNIVERSE_NAME} ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universe complete banner */}
      <AnimatePresence>
        {universeComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div
              className="px-6 py-3 rounded-full font-cinzel text-xs tracking-widest"
              style={{ background: 'rgba(247,215,116,0.12)', border: '1px solid rgba(247,215,116,0.4)', color: '#f7d774', backdropFilter: 'blur(12px)' }}
            >
              ✦ Universe Complete — Every World Explored ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile ? (
        /* ── Mobile layout ── */
        <div className="w-full px-4 py-8 flex flex-col items-center gap-6">
          {/* Sun / portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: sunGlow }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="relative flex-shrink-0"
            style={{ zIndex: 20 }}
          >
            <div
              className="w-24 h-24 rounded-full overflow-hidden"
              style={{
                boxShadow: '0 0 40px rgba(247,215,116,0.5), 0 0 80px rgba(247,215,116,0.2)',
                border: '2px solid rgba(247,215,116,0.5)',
              }}
            >
              <img src={SUN_PHOTO} alt="Pravena" className="w-full h-full object-cover" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(247,215,116,0.2)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Name - always visible on mobile */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <p className="font-cinzel text-xs font-bold" style={{ color: '#f7d774', fontSize: 11, letterSpacing: '0.15em' }}>
                {UNIVERSE_NAME.toUpperCase()}
              </p>
            </div>
          </motion.div>

          <div className="mt-6 grid grid-cols-4 gap-2 w-full max-w-sm">
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
        /* ── Desktop orbital layout ── */
        <div
          className="relative flex items-center justify-center"
          style={{ width: '100vw', height: '100vh' }}
        >
          {/* SVG orbit rings - clearly visible faint glowing lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%', zIndex: 1 }}
          >
            {ORBIT_RADII.map((r, i) => {
              const rx = r;
              const ry = r * 0.38;
              const colors = ['#f7d774', '#ff7ab6', '#9b7bff', '#7be3ff', '#a8d8ea', '#8888aa'];
              return (
                <ellipse
                  key={i}
                  cx="50%"
                  cy="50%"
                  rx={rx}
                  ry={ry}
                  fill="none"
                  stroke={colors[i % colors.length]}
                  strokeWidth="0.7"
                  strokeOpacity="0.22"
                  strokeDasharray="4 6"
                />
              );
            })}
          </svg>

          {/* Sun / Central portrait - highest z-index to stay foreground */}
          <motion.div
            className="absolute flex flex-col items-center gap-2"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50,
            }}
            animate={{ scale: sunGlow }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: 96,
                height: 96,
                boxShadow: '0 0 60px rgba(247,215,116,0.6), 0 0 120px rgba(247,215,116,0.25)',
                border: '2px solid rgba(247,215,116,0.6)',
              }}
            >
              <img src={SUN_PHOTO} alt="Pravena" className="w-full h-full object-cover" />
            </div>

            {/* Glow rings around sun */}
            {[1.4, 1.7, 2.0].map((scale, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 96 * scale,
                  height: 96 * scale,
                  border: `1px solid rgba(247,215,116,${0.15 - i * 0.04})`,
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 3 + i, repeat: Infinity }}
              />
            ))}

            {/* Name label - always foreground */}
            <div
              className="rounded-full px-4 py-1 mt-1"
              style={{
                background: 'rgba(5,8,22,0.9)',
                border: '1px solid rgba(247,215,116,0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p
                className="font-cinzel text-xs font-bold"
                style={{ color: '#f7d774', letterSpacing: '0.2em', fontSize: 11 }}
              >
                {UNIVERSE_NAME.toUpperCase()}
              </p>
            </div>
          </motion.div>

          {/* Orbital planets — z-index kept below sun */}
          {planetOrbits.map((planet) => (
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
