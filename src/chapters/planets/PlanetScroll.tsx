import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SCROLL_LETTER, SENDER_NAME, UNIVERSE_NAME } from '../../data/content';

const PlanetScroll: React.FC = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lines = SCROLL_LETTER.split('\n');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Progressive reveal — line by line
  useEffect(() => {
    if (lineIndex < lines.length) {
      const line = lines[lineIndex];
      setCharCount(0);
      setTyping(true);
      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setCharCount(i);
        if (i >= line.length) {
          clearInterval(intervalRef.current!);
          setTyping(false);
          setTimeout(() => setLineIndex(prev => prev + 1), line === '' ? 100 : 300);
        }
      }, line === '' ? 1 : 18);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [lineIndex]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lineIndex, charCount]);

  const renderLine = (idx: number) => {
    if (idx > lineIndex) return null;
    const line = lines[idx];
    if (idx < lineIndex) return line;
    return line.slice(0, charCount) + (typing && idx === lineIndex ? '|' : '');
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#d4b8ff', textShadow: '0 0 30px rgba(212,184,255,0.5)' }}>
          📖 SCROLL
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">A letter written across universes</p>
        <p className="font-cinzel text-xs text-gray-600 mt-1">For {UNIVERSE_NAME.toUpperCase()} — from {SENDER_NAME.toUpperCase()}</p>
      </motion.div>

      {/* Letter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-lg glass rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(212,184,255,0.25)' }}
      >
        {/* Paper texture header */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ background: 'rgba(212,184,255,0.08)', borderBottom: '1px solid rgba(212,184,255,0.1)' }}
        >
          <span className="font-cinzel text-xs" style={{ color: '#d4b8ff', fontSize: 9, letterSpacing: '0.1em' }}>
            PERSONAL TRANSMISSION — ENCRYPTED
          </span>
          <span className="font-cinzel text-xs text-gray-600" style={{ fontSize: 9 }}>
            {lineIndex}/{lines.length} lines
          </span>
        </div>

        {/* Letter content */}
        <div
          ref={scrollRef}
          className="px-6 py-6 overflow-y-auto"
          style={{ maxHeight: 480, scrollbarWidth: 'thin' }}
        >
          {lines.slice(0, lineIndex + 1).map((line, i) => {
            const rendered = renderLine(i);
            if (rendered === null) return null;

            const isEmpty = line === '';
            const isHeader = line.startsWith('Dear') || line.startsWith('—') || line.startsWith('P.S.');
            const isSignature = line.startsWith('— ');

            return (
              <div key={i} className={isEmpty ? 'mb-3' : 'mb-1'}>
                {!isEmpty && (
                  <p
                    className={`font-cormorant leading-relaxed ${
                      isHeader ? 'text-base font-bold' :
                      isSignature ? 'text-sm italic mt-2' : 'text-sm italic'
                    }`}
                    style={{
                      color: isHeader ? '#d4b8ff' : isSignature ? '#9b7bff' : '#c8c8d8',
                    }}
                  >
                    {rendered}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Completion */}
      {lineIndex >= lines.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-cormorant text-lg italic text-gray-400">
            The letter has found you. ✨
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PlanetScroll;
