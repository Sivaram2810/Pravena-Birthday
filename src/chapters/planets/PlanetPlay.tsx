import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS, MEMORY_CARD_PAIRS } from '../../data/content';

// ── Quiz Game ─────────────────────────────────────────────────
const QuizGame: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[currentQ];

  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const percent = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="text-5xl mb-4">{score >= 4 ? '🏆' : score >= 2 ? '⭐' : '💛'}</div>
        <h3 className="font-cinzel text-xl font-bold" style={{ color: '#f7d774' }}>
          {score}/{QUIZ_QUESTIONS.length} Correct
        </h3>
        <p className="font-cormorant text-sm text-gray-400 italic mt-2">
          {score === QUIZ_QUESTIONS.length
            ? 'Perfect! You know our story by heart 💛'
            : score >= 3
              ? 'You remember so much of us 🌸'
              : 'Some memories are waiting to be revisited 🌙'}
        </p>
        <div className="w-full h-2 rounded-full mt-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #9b7bff, #f7d774)' }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <motion.button
          onClick={() => { setCurrentQ(0); setScore(0); setSelected(null); setAnswered(false); setFinished(false); }}
          className="mt-4 px-4 py-2 rounded-full font-cinzel text-xs"
          style={{ background: 'rgba(155,123,255,0.2)', border: '1px solid rgba(155,123,255,0.4)', color: '#9b7bff' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="font-cinzel text-xs text-gray-500">{currentQ + 1}/{QUIZ_QUESTIONS.length}</span>
        <span className="font-cinzel text-xs" style={{ color: '#f7d774' }}>Score: {score}</span>
      </div>
      <div className="w-full h-1 rounded-full mb-5" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${((currentQ) / QUIZ_QUESTIONS.length) * 100}%`, background: 'linear-gradient(to right, #9b7bff, #f7d774)', transition: 'width 0.4s' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-cormorant text-xl text-white italic mb-6 leading-relaxed">{q.question}</p>
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isSelected = selected === i;
              let bg = 'rgba(255,255,255,0.05)';
              let border = 'rgba(255,255,255,0.1)';
              if (answered) {
                if (isCorrect) { bg = 'rgba(100,255,150,0.1)'; border = 'rgba(100,255,150,0.5)'; }
                else if (isSelected) { bg = 'rgba(255,100,100,0.1)'; border = 'rgba(255,100,100,0.5)'; }
              }
              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="p-3 rounded-xl text-left font-cormorant text-base transition-all flex items-center gap-2"
                  style={{ background: bg, border: `1px solid ${border}`, color: 'white' }}
                  whileHover={!answered ? { scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                >
                  <span className="font-cinzel text-xs" style={{ color: '#9b7bff', minWidth: '20px' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                  {answered && isCorrect && <span className="ml-auto">✅</span>}
                  {answered && isSelected && !isCorrect && <span className="ml-auto">❌</span>}
                </motion.button>
              );
            })}
          </div>

          {answered && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <p className="font-cormorant text-sm text-gray-300 italic">{q.explanation}</p>
              <motion.button
                onClick={nextQuestion}
                className="mt-3 px-5 py-2 rounded-full font-cinzel text-xs"
                style={{ background: 'rgba(155,123,255,0.2)', border: '1px solid rgba(155,123,255,0.4)', color: '#9b7bff' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentQ + 1 < QUIZ_QUESTIONS.length ? 'Next →' : 'See Results'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Memory Flip Game ────────────────────────────────────────────
type CardState = {
  id: string;
  emoji: string;
  label: string;
  instanceId: string;
  flipped: boolean;
  matched: boolean;
};

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<CardState[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const initGame = () => {
    const pairs = [...MEMORY_CARD_PAIRS, ...MEMORY_CARD_PAIRS].map((c, i) => ({
      ...c,
      instanceId: `${c.id}-${i}`,
      flipped: false,
      matched: false,
    }));
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    setCards(pairs);
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => { initGame(); }, []);

  const handleCardClick = (instanceId: string) => {
    if (selected.length >= 2) return;
    const card = cards.find(c => c.instanceId === instanceId);
    if (!card || card.flipped || card.matched) return;

    const newSelected = [...selected, instanceId];
    const newCards = cards.map(c => c.instanceId === instanceId ? { ...c, flipped: true } : c);
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSelected.map(id => newCards.find(c => c.instanceId === id)!);
      if (a.id === b.id) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a.id ? { ...c, matched: true } : c));
          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newSelected.includes(c.instanceId) ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setTimeout(() => setWon(true), 400);
    }
  }, [cards]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-cinzel text-xs text-gray-500">Moves: {moves}</span>
        <motion.button
          onClick={initGame}
          className="font-cinzel text-xs px-3 py-1 rounded-full"
          style={{ border: '1px solid rgba(255,170,0,0.3)', color: '#ffaa00' }}
          whileHover={{ scale: 1.05 }}
        >
          Reset
        </motion.button>
      </div>

      {won ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-cinzel text-lg font-bold" style={{ color: '#ffaa00' }}>You matched everything!</p>
          <p className="font-cormorant text-sm text-gray-400 italic mt-1">Completed in {moves} moves 💛</p>
          <motion.button
            onClick={initGame}
            className="mt-4 px-4 py-2 rounded-full font-cinzel text-xs"
            style={{ background: 'rgba(255,170,0,0.2)', border: '1px solid rgba(255,170,0,0.4)', color: '#ffaa00' }}
            whileHover={{ scale: 1.05 }}
          >
            Play again
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 max-w-sm w-full">
          {cards.map(card => (
            <motion.button
              key={card.instanceId}
              onClick={() => handleCardClick(card.instanceId)}
              className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: card.flipped || card.matched
                  ? 'linear-gradient(135deg, rgba(255,170,0,0.15), rgba(255,170,0,0.08))'
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${card.matched ? 'rgba(255,170,0,0.6)' : card.flipped ? 'rgba(255,170,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
              }}
              whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
              whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
            >
              <AnimatePresence mode="wait">
                {card.flipped || card.matched ? (
                  <motion.span
                    key="front"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    className="text-2xl"
                  >
                    {card.emoji}
                  </motion.span>
                ) : (
                  <motion.span key="back" className="text-xl opacity-40">✦</motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Planet ─────────────────────────────────────────────────
const PlanetPlay: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'quiz' | 'memory' | null>(null);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ffaa00', textShadow: '0 0 30px rgba(255,170,0,0.5)' }}>
          🎮 PLAY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Games of love and memory</p>
      </motion.div>

      {!activeGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { id: 'quiz' as const, emoji: '❓', title: 'Relationship Quiz', desc: 'How well do you remember our story?', color: '#9b7bff' },
            { id: 'memory' as const, emoji: '🃏', title: 'Memory Match', desc: 'Find the matching pairs', color: '#ffaa00' },
          ].map(game => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame(game.id)}
              className="rounded-2xl p-6 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${game.color}12, ${game.color}06)`,
                border: `1px solid ${game.color}33`,
              }}
            >
              <div className="text-4xl mb-3">{game.emoji}</div>
              <h3 className="font-cinzel text-sm font-bold mb-1" style={{ color: game.color }}>{game.title}</h3>
              <p className="font-cormorant text-sm text-gray-400 italic">{game.desc}</p>
            </motion.div>
          ))}
        </div>
      )}

      {activeGame && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => setActiveGame(null)}
              className="font-cinzel text-xs px-3 py-1 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#888' }}
              whileHover={{ scale: 1.05 }}
            >
              ← Back
            </motion.button>
            <h3 className="font-cinzel text-sm font-bold" style={{ color: activeGame === 'quiz' ? '#9b7bff' : '#ffaa00' }}>
              {activeGame === 'quiz' ? 'Relationship Quiz' : 'Memory Match'}
            </h3>
          </div>

          <div
            className="rounded-3xl p-6"
            style={{
              background: activeGame === 'quiz'
                ? 'linear-gradient(135deg, rgba(155,123,255,0.08), rgba(155,123,255,0.04))'
                : 'linear-gradient(135deg, rgba(255,170,0,0.08), rgba(255,170,0,0.04))',
              border: `1px solid ${activeGame === 'quiz' ? 'rgba(155,123,255,0.2)' : 'rgba(255,170,0,0.2)'}`,
            }}
          >
            {activeGame === 'quiz' ? <QuizGame /> : <MemoryGame />}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlanetPlay;
