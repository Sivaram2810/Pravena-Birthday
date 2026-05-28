import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SCROLL_LETTER } from '../../data/content';

const PlanetScroll: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Background transitions from day to night based on scroll
  const dayColor = `rgba(254,243,200,${1 - scrollProgress})`;
  const nightOverlay = `rgba(5,8,22,${scrollProgress * 0.8})`;

  const paragraphs = SCROLL_LETTER.split('\n\n').filter(p => p.trim());

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 flex-shrink-0"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#d4a96a', textShadow: '0 0 30px rgba(212,169,106,0.5)' }}
        >
          📜 SCROLL
        </h1>
        <p className="font-cormorant text-gray-300 mt-1 italic">The letter that never ends</p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-0.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="h-full"
          style={{
            width: `${scrollProgress * 100}%`,
            background: 'linear-gradient(to right, #d4a96a, #f7d774)',
          }}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto custom-scroll relative"
        style={{
          background: `linear-gradient(to bottom, ${dayColor}, rgba(20, 10, 40, ${scrollProgress * 0.9}))`,
          transition: 'background 0.3s ease',
        }}
      >
        {/* Night overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: nightOverlay,
            transition: 'background 0.3s ease',
          }}
        />

        {/* Stars appearing as night falls */}
        {scrollProgress > 0.5 && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="fixed rounded-full pointer-events-none"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              background: 'white',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: (scrollProgress - 0.5) * 2 * (0.2 + Math.random() * 0.5),
            }}
          />
        ))}

        {/* Parchment paper */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-8 py-8">
          {/* Parchment background */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: scrollProgress < 0.5
                ? `linear-gradient(135deg, #f5e6c8, #ede0c4, #f0e0c0)`
                : `linear-gradient(135deg, rgba(45,27,105,0.8), rgba(20,10,50,0.9))`,
              transition: 'background 1s ease',
              padding: '2rem 2.5rem',
            }}
          >
            {/* Parchment texture lines */}
            {scrollProgress < 0.3 && Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  height: '1px',
                  background: 'rgba(139,90,43,0.05)',
                  top: `${i * 5 + 2}%`,
                }}
              />
            ))}

            {/* Quill icon */}
            <div className="text-center mb-6">
              <span className="text-4xl">{scrollProgress < 0.5 ? '🖋️' : '✨'}</span>
            </div>

            {paragraphs.map((para, i) => {
              const isChapterHeader = para.startsWith('Chapter');
              const isPS = para.startsWith('P.S.');

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-6"
                >
                  {isChapterHeader ? (
                    <h2
                      className="font-cinzel text-lg font-bold mb-3 text-center"
                      style={{
                        color: scrollProgress < 0.4 ? '#5a3010' : '#f7d774',
                        textShadow: scrollProgress > 0.4 ? '0 0 10px rgba(247,215,116,0.4)' : 'none',
                      }}
                    >
                      {para}
                    </h2>
                  ) : para.includes('∙ ∙ ∙') ? (
                    <div className="text-center my-4">
                      <span
                        style={{ color: scrollProgress < 0.5 ? '#8b7355' : '#9b7bff', letterSpacing: '0.5em' }}
                      >
                        ∙ ∙ ∙
                      </span>
                    </div>
                  ) : (
                    <p
                      className="font-cormorant text-base md:text-lg leading-relaxed"
                      style={{
                        color: scrollProgress < 0.4 ? '#3d2b1f' : scrollProgress < 0.7 ? '#c0b090' : '#e0d8f0',
                        fontStyle: isPS ? 'italic' : 'normal',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      {para}
                    </p>
                  )}
                </motion.div>
              );
            })}

            {/* End flourish */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8 pt-6"
              style={{ borderTop: scrollProgress > 0.8 ? '1px solid rgba(247,215,116,0.2)' : '1px solid rgba(139,90,43,0.2)' }}
            >
              <span className="text-3xl">
                {scrollProgress > 0.8 ? '🌌' : '🕊️'}
              </span>
              <p
                className="font-cinzel text-sm mt-2 tracking-widest"
                style={{ color: scrollProgress > 0.8 ? '#f7d774' : '#8b7355' }}
              >
                — FINIS —
              </p>
            </motion.div>
          </div>

          {/* Scroll percentage */}
          <motion.div
            className="fixed top-24 right-4 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          >
            <div
              className="w-1 rounded-full overflow-hidden"
              style={{ height: 80, background: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="w-full rounded-full transition-all"
                style={{
                  height: `${scrollProgress * 100}%`,
                  background: 'linear-gradient(to bottom, #d4a96a, #9b7bff)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlanetScroll;
