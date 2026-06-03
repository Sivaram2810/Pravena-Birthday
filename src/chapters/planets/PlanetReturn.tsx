import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DAILY_QUOTES, ANNIVERSARY_DATE, UNIVERSE_NAME } from '../../data/content';

const getTimeUntilNextBirthday = () => {
  const now = new Date();
  const nextBirthday = new Date(now.getFullYear(), 5, 4); // June 4
  if (nextBirthday <= now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const diff = nextBirthday.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
};

const getElapsedSince = (from: Date) => {
  const now = new Date();
  const diff = now.getTime() - from.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
};

const PlanetReturn: React.FC = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const dayOfMonth = today.getDate();

  // Use day of week for the rotating quote
  const todayQuote = DAILY_QUOTES[dayOfWeek];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[dayOfWeek];

  // Bonus quote rotates by day of month
  const bonusQuotes = [
    'You are the kind of person who makes ordinary days feel like special occasions.',
    'I think about you more than you know. More than I admit. Always.',
    'Every version of you — sleepy, silly, serious, soft — I love them all.',
    'You make me want to be the kind of person who deserves someone like you.',
    'The world got considerably brighter the day you decided to exist in it.',
    'You are not just someone I love. You are someone I genuinely admire.',
    'I would choose you in every universe, every timeline, every lifetime.',
    'Your laugh is my favorite sound. Your presence is my favorite place.',
    'You deserve every gentle thing. Every soft morning. Every good day.',
    'Even on your hardest days, you are still my favorite everything.',
  ];
  const bonusQuote = bonusQuotes[dayOfMonth % bonusQuotes.length];

  const [birthdayCountdown, setBirthdayCountdown] = useState(getTimeUntilNextBirthday());
  const [elapsed, setElapsed] = useState(getElapsedSince(ANNIVERSARY_DATE));

  useEffect(() => {
    const iv = setInterval(() => {
      setBirthdayCountdown(getTimeUntilNextBirthday());
      setElapsed(getElapsedSince(ANNIVERSARY_DATE));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>
          🌟 RETURN
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">A reason to come back every single day</p>
      </motion.div>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md rounded-3xl p-7 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,166,0,0.06))',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 0 40px rgba(255,215,0,0.06)',
        }}
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.12), transparent 70%)', transform: 'translate(30%, -30%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffd700' }} />
          <p className="font-cinzel text-xs tracking-widest" style={{ color: '#ffd700', fontSize: 9, letterSpacing: '0.2em' }}>
            {todayName.toUpperCase()} MESSAGE FOR {UNIVERSE_NAME.toUpperCase()}
          </p>
        </div>

        <p className="font-cormorant text-xl italic text-gray-100 leading-relaxed">
          {todayQuote.replace(`${todayName}: `, '')}
        </p>

        <p className="font-cinzel text-xs mt-4 text-gray-600" style={{ fontSize: 8, letterSpacing: '0.1em' }}>
          ↻ A new message each day of the week
        </p>
      </motion.div>

      {/* Bonus daily quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md rounded-2xl p-5"
        style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}
      >
        <p className="font-cinzel text-xs mb-2 text-gray-500" style={{ fontSize: 8, letterSpacing: '0.12em' }}>TODAY'S EXTRA</p>
        <p className="font-cormorant text-lg italic text-gray-300 leading-relaxed">
          "{bonusQuote}"
        </p>
      </motion.div>

      {/* Anniversary countup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md rounded-3xl p-6"
        style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}
      >
        <p className="font-cinzel text-xs text-center mb-4" style={{ color: '#ffd700', opacity: 0.7, letterSpacing: '0.15em', fontSize: 9 }}>
          ♾️ TOGETHER SINCE DEC 19, 2022
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: elapsed.days, label: 'DAYS' },
            { value: elapsed.hours, label: 'HRS' },
            { value: elapsed.minutes, label: 'MIN' },
            { value: elapsed.seconds, label: 'SEC' },
          ].map(({ value, label }) => (
            <motion.div
              key={label}
              className="rounded-xl p-2 flex flex-col items-center gap-0.5"
              style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}
              animate={label === 'SEC' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="font-cinzel text-xl font-bold" style={{ color: '#ffd700' }}>
                {String(value).padStart(2, '0')}
              </span>
              <span className="font-cinzel" style={{ fontSize: 7, color: '#888', letterSpacing: '0.08em' }}>{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Birthday countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md rounded-3xl p-6"
        style={{ background: 'rgba(255,122,182,0.05)', border: '1px solid rgba(255,122,182,0.2)' }}
      >
        <p className="font-cinzel text-xs text-center mb-4" style={{ color: '#ff7ab6', opacity: 0.7, letterSpacing: '0.15em', fontSize: 9 }}>
          🎂 NEXT BIRTHDAY COUNTDOWN — JUNE 4
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: birthdayCountdown.days, label: 'DAYS' },
            { value: birthdayCountdown.hours, label: 'HRS' },
            { value: birthdayCountdown.minutes, label: 'MIN' },
            { value: birthdayCountdown.seconds, label: 'SEC' },
          ].map(({ value, label }) => (
            <motion.div
              key={label}
              className="rounded-xl p-2 flex flex-col items-center gap-0.5"
              style={{ background: 'rgba(255,122,182,0.08)', border: '1px solid rgba(255,122,182,0.15)' }}
              animate={label === 'SEC' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="font-cinzel text-xl font-bold" style={{ color: '#ff7ab6' }}>
                {String(value).padStart(2, '0')}
              </span>
              <span className="font-cinzel" style={{ fontSize: 7, color: '#888', letterSpacing: '0.08em' }}>{label}</span>
            </motion.div>
          ))}
        </div>
        <p className="font-cormorant text-sm italic text-center mt-3 text-gray-500">
          Something wonderful is coming 🎂
        </p>
      </motion.div>

      {/* Come back note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center max-w-xs"
      >
        <p className="font-cormorant text-sm italic text-gray-600 leading-relaxed">
          Come back tomorrow. And the day after. This universe was built to grow with you.
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetReturn;
