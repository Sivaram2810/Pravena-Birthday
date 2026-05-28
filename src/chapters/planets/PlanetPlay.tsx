import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS, MEMORY_CARD_PAIRS, UNIVERSE_ANSWERS, WORD_PUZZLES } from '../../data/content';
import { useAppContext } from '../../contexts/AppContext';

type GameType = 'menu' | 'quiz' | 'memory' | 'universe' | 'puzzle';

// ── QUIZ ──────────────────────────────────────────────────────────
const QuizGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { setQuizScore } = useAppContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === QUIZ_QUESTIONS[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= QUIZ_QUESTIONS.length) {
      setQuizScore(score);
      setFinished(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">
          {score >= 4 ? '🏆' : score >= 2 ? '⭐' : '💛'}
        </div>
        <h2 className="font-cinzel text-3xl font-bold mb-2" style={{ color: '#f7d774' }}>
          {score}/{QUIZ_QUESTIONS.length}
        </h2>
        <p className="font-cormorant text-xl text-gray-300 italic mb-2">
          {score === QUIZ_QUESTIONS.length
            ? 'Perfect score! You know him completely 💛'
            : score >= 3
            ? 'You know him well, Sara 🌟'
            : 'Every answer holds a memory 💜'}
        </p>
        <motion.button
          onClick={onBack}
          className="mt-6 px-6 py-2 rounded-full font-cinzel text-sm"
          style={{ background: 'linear-gradient(135deg, #f7d774, #ff7ab6)', color: 'black' }}
          whileHover={{ scale: 1.05 }}
        >
          Back to Games
        </motion.button>
      </motion.div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-sm text-gray-400 font-cinzel hover:text-white">← Back</button>
        <span className="font-cinzel text-sm" style={{ color: '#f7d774' }}>
          {currentQ + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-1 rounded-full mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #f7d774, #ff7ab6)', width: `${((currentQ) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
        >
          <h3 className="font-cormorant text-xl text-white mb-6 leading-relaxed">{q.question}</h3>

          <div className="grid grid-cols-1 gap-3">
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
                  className="p-3 rounded-xl text-left font-cormorant text-base transition-all"
                  style={{ background: bg, border: `1px solid ${border}`, color: 'white' }}
                  whileHover={!answered ? { scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                >
                  <span className="font-cinzel text-xs mr-2" style={{ color: '#9b7bff' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                  {answered && isCorrect && <span className="ml-2">✅</span>}
                  {answered && isSelected && !isCorrect && <span className="ml-2">❌</span>}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl"
                style={{ background: 'rgba(155,123,255,0.1)', border: '1px solid rgba(155,123,255,0.3)' }}
              >
                <p className="font-cormorant text-sm text-gray-300 italic">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="mt-4 w-full py-3 rounded-xl font-cinzel text-sm"
              style={{ background: 'linear-gradient(135deg, #9b7bff, #ff7ab6)', color: 'white' }}
              whileHover={{ scale: 1.02 }}
            >
              {currentQ + 1 >= QUIZ_QUESTIONS.length ? 'See Results' : 'Next Question →'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── MEMORY FLIP ────────────────────────────────────────────────────
const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const allCards = [...MEMORY_CARD_PAIRS, ...MEMORY_CARD_PAIRS]
    .map((card, i) => ({ ...card, uid: `${card.id}-${i}`, flipped: false, matched: false }));
  
  const [cards, setCards] = useState(() => allCards.sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [checking, setChecking] = useState(false);
  const [won, setWon] = useState(false);

  const handleFlip = useCallback((uid: string) => {
    if (checking || flipped.length >= 2) return;
    const card = cards.find(c => c.uid === uid);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flipped, uid];
    setFlipped(newFlipped);
    setCards(prev => prev.map(c => c.uid === uid ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setChecking(true);
      const [a, b] = newFlipped.map(id => cards.find(c => c.uid === id)!);
      
      setTimeout(() => {
        if (a.id === b.id) {
          setCards(prev => prev.map(c => newFlipped.includes(c.uid) ? { ...c, matched: true } : c));
          setMatches(m => {
            const newM = m + 1;
            if (newM >= MEMORY_CARD_PAIRS.length) setWon(true);
            return newM;
          });
        } else {
          setCards(prev => prev.map(c => newFlipped.includes(c.uid) ? { ...c, flipped: false } : c));
        }
        setFlipped([]);
        setChecking(false);
      }, 800);
    }
  }, [cards, flipped, checking]);

  if (won) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-cinzel text-2xl font-bold mb-2" style={{ color: '#f7d774' }}>All matched!</h2>
        <p className="font-cormorant text-gray-300 italic mb-4">Just like us — perfectly paired 💛</p>
        <button onClick={onBack} className="px-6 py-2 rounded-full font-cinzel text-sm" style={{ background: 'linear-gradient(135deg, #f7d774, #ff7ab6)', color: 'black' }}>
          Back to Games
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-sm text-gray-400 font-cinzel hover:text-white">← Back</button>
        <span className="font-cinzel text-sm" style={{ color: '#f7d774' }}>{matches}/{MEMORY_CARD_PAIRS.length} matched</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <div
            key={card.uid}
            className="card-flip cursor-pointer"
            style={{ height: '70px' }}
            onClick={() => handleFlip(card.uid)}
          >
            <div className={`card-flip-inner w-full h-full ${card.flipped || card.matched ? 'flipped' : ''}`}>
              <div
                className="card-front w-full h-full rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9b7bff44, #ff7ab644)', border: '1px solid rgba(155,123,255,0.3)' }}
              >
                <span className="text-2xl">✨</span>
              </div>
              <div
                className="card-back w-full h-full rounded-xl flex flex-col items-center justify-center"
                style={{
                  background: card.matched ? 'linear-gradient(135deg, rgba(100,255,150,0.2), rgba(100,255,150,0.1))' : 'linear-gradient(135deg, #f7d77444, #ff7ab644)',
                  border: `1px solid ${card.matched ? 'rgba(100,255,150,0.5)' : 'rgba(247,215,116,0.3)'}`,
                }}
              >
                <span className="text-2xl">{card.emoji}</span>
                <span className="text-xs font-cinzel mt-0.5" style={{ color: '#f7d774', fontSize: '7px' }}>{card.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── UNIVERSE ORACLE ───────────────────────────────────────────────
const UniverseOracle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const askUniverse = () => {
    if (!question.trim()) return;
    setSpinning(true);
    setAnswer(null);
    setTimeout(() => {
      setAnswer(UNIVERSE_ANSWERS[Math.floor(Math.random() * UNIVERSE_ANSWERS.length)]);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full">
        <button onClick={onBack} className="text-sm text-gray-400 font-cinzel hover:text-white">← Back</button>
      </div>

      <div className="text-center">
        <div className="text-5xl mb-2">🔮</div>
        <h3 className="font-cinzel text-xl" style={{ color: '#9b7bff' }}>Ask The Universe</h3>
        <p className="font-cormorant text-sm text-gray-400 italic mt-1">The cosmos always has an answer</p>
      </div>

      <div className="w-full max-w-md">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && askUniverse()}
          placeholder="Type your question..."
          className="w-full p-3 rounded-xl text-white placeholder-gray-500 font-cormorant text-lg"
          style={{ background: 'rgba(155,123,255,0.1)', border: '1px solid rgba(155,123,255,0.3)', outline: 'none' }}
        />
        <motion.button
          onClick={askUniverse}
          className="w-full mt-3 py-3 rounded-xl font-cinzel text-sm"
          style={{ background: 'linear-gradient(135deg, #9b7bff, #ff7ab6)', color: 'white' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={spinning}
        >
          {spinning ? 'Consulting the stars...' : 'Ask ✨'}
        </motion.button>
      </div>

      <AnimatePresence>
        {spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' } }}
            className="text-5xl"
          >
            🌌
          </motion.div>
        )}
        {answer && !spinning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center p-6 rounded-2xl"
            style={{ background: 'rgba(155,123,255,0.1)', border: '1px solid rgba(155,123,255,0.3)' }}
          >
            <p className="font-cormorant text-xl text-gray-100 italic">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── WORD PUZZLE ────────────────────────────────────────────────────
const WordPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [allSolved, setAllSolved] = useState(false);

  const puzzle = WORD_PUZZLES[currentIdx];

  const handleGuess = () => {
    if (input.trim().toUpperCase() === puzzle.answer) {
      setSolved(true);
      setWrong(false);
    } else {
      setWrong(true);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= WORD_PUZZLES.length) {
      setAllSolved(true);
    } else {
      setCurrentIdx(i => i + 1);
      setInput('');
      setSolved(false);
      setWrong(false);
    }
  };

  if (allSolved) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8">
        <div className="text-6xl mb-4">💜</div>
        <h2 className="font-cinzel text-2xl font-bold mb-2" style={{ color: '#f7d774' }}>All unscrambled!</h2>
        <p className="font-cormorant text-gray-300 italic">The words of love always find their way 💛</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 rounded-full font-cinzel text-sm" style={{ background: 'linear-gradient(135deg, #f7d774, #ff7ab6)', color: 'black' }}>
          Back
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full">
        <button onClick={onBack} className="text-sm text-gray-400 font-cinzel hover:text-white">← Back</button>
        <span className="font-cinzel text-sm" style={{ color: '#f7d774' }}>{currentIdx + 1}/{WORD_PUZZLES.length}</span>
      </div>

      <div className="text-center">
        <p className="font-cormorant text-gray-400 italic text-sm mb-2">Unscramble the word</p>
        <div className="flex gap-2 justify-center">
          {puzzle.scrambled.split('').map((ch, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-10 h-10 flex items-center justify-center rounded-xl font-cinzel font-bold text-lg"
              style={{ background: 'rgba(155,123,255,0.2)', border: '1px solid rgba(155,123,255,0.4)', color: '#9b7bff' }}
            >
              {ch}
            </motion.div>
          ))}
        </div>
        <p className="font-cormorant text-gray-500 italic text-sm mt-3">Hint: {puzzle.hint}</p>
      </div>

      <AnimatePresence>
        {!solved ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xs flex flex-col gap-3">
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value.toUpperCase()); setWrong(false); }}
              onKeyDown={e => e.key === 'Enter' && handleGuess()}
              placeholder="Your answer..."
              className="w-full p-3 rounded-xl text-center font-cinzel text-lg text-white placeholder-gray-600"
              style={{ background: wrong ? 'rgba(255,100,100,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${wrong ? 'rgba(255,100,100,0.4)' : 'rgba(155,123,255,0.3)'}`, outline: 'none' }}
            />
            {wrong && <p className="text-center text-sm font-cormorant" style={{ color: '#ff7ab6' }}>Try again...</p>}
            <motion.button
              onClick={handleGuess}
              className="py-3 rounded-xl font-cinzel text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #9b7bff, #ff7ab6)' }}
              whileHover={{ scale: 1.02 }}
            >
              Unscramble ✨
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="text-4xl mb-2">🎊</div>
            <p className="font-cinzel text-2xl font-bold" style={{ color: '#f7d774' }}>{puzzle.answer}</p>
            <p className="font-cormorant text-gray-300 italic mt-1">{puzzle.hint}</p>
            <motion.button onClick={handleNext} className="mt-4 px-6 py-2 rounded-full font-cinzel text-sm" style={{ background: 'linear-gradient(135deg, #f7d774, #ff7ab6)', color: 'black' }} whileHover={{ scale: 1.05 }}>
              Next →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── MAIN PLANET PLAY ──────────────────────────────────────────────
const PlanetPlay: React.FC = () => {
  const [game, setGame] = useState<GameType>('menu');

  const games = [
    { id: 'quiz' as GameType, emoji: '🧠', title: 'Know Him Quiz', description: 'How well do you know him?', color: '#f7d774' },
    { id: 'memory' as GameType, emoji: '🃏', title: 'Memory Flip', description: 'Match the memories', color: '#ff7ab6' },
    { id: 'universe' as GameType, emoji: '🔮', title: 'Ask the Universe', description: 'Mystical answers await', color: '#9b7bff' },
    { id: 'puzzle' as GameType, emoji: '🔤', title: 'Unshuffle My Heart', description: 'Unscramble words of love', color: '#aaddff' },
  ];

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <AnimatePresence mode="wait">
        {game === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center gap-8"
          >
            <div className="text-center">
              <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#00ff88', textShadow: '0 0 30px rgba(0,255,136,0.4)' }}>
                🎮 PLAY
              </h1>
              <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Games built from love</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {games.map((g, i) => (
                <motion.button
                  key={g.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setGame(g.id)}
                  className="p-6 rounded-2xl text-left flex flex-col gap-2"
                  style={{ background: `rgba(${g.color === '#f7d774' ? '247,215,116' : g.color === '#ff7ab6' ? '255,122,182' : g.color === '#9b7bff' ? '155,123,255' : '170,221,255'}, 0.08)`, border: `1px solid ${g.color}44` }}
                  whileHover={{ scale: 1.02, background: `rgba(${g.color === '#f7d774' ? '247,215,116' : g.color === '#ff7ab6' ? '255,122,182' : g.color === '#9b7bff' ? '155,123,255' : '170,221,255'}, 0.15)` }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <h3 className="font-cinzel text-base font-bold" style={{ color: g.color }}>{g.title}</h3>
                  <p className="font-cormorant text-sm text-gray-400 italic">{g.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={game}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-2xl glass rounded-3xl overflow-hidden"
          >
            {game === 'quiz' && <QuizGame onBack={() => setGame('menu')} />}
            {game === 'memory' && <MemoryGame onBack={() => setGame('menu')} />}
            {game === 'universe' && <UniverseOracle onBack={() => setGame('menu')} />}
            {game === 'puzzle' && <WordPuzzle onBack={() => setGame('menu')} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetPlay;
