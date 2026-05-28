import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

const VAULT_CODE = 'SARA'; // The password

const PlanetX: React.FC = () => {
  const [layer, setLayer] = useState<1 | 2 | 3>(1);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleUnlock = () => {
    if (codeInput.toUpperCase() === VAULT_CODE) {
      setLayer(2);
      setCodeError(false);
    } else {
      setCodeError(true);
      setAttempts(a => a + 1);
      if (attempts >= 2) setShowHint(true);
      setTimeout(() => setCodeError(false), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#ff4444', textShadow: '0 0 30px rgba(139,0,0,0.6)' }}
        >
          🎁 PLANET X
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          The hidden chamber. Only for you.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Layer 1: Vault */}
        {layer === 1 && (
          <motion.div
            key="vault"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: 90 }}
            className="w-full max-w-md"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a0505, #0d0808)',
                border: '2px solid rgba(139,0,0,0.4)',
                boxShadow: '0 0 60px rgba(139,0,0,0.2)',
              }}
            >
              {/* Vault door design */}
              <div className="p-8 flex flex-col items-center gap-6">
                {/* Lock icon */}
                <motion.div
                  animate={{ rotate: codeError ? [-5, 5, -5, 5, 0] : 0 }}
                  className="relative"
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, #3d0000, #1a0000)',
                      border: '3px solid rgba(139,0,0,0.6)',
                      boxShadow: codeError ? '0 0 30px rgba(255,0,0,0.5)' : '0 0 20px rgba(139,0,0,0.3)',
                    }}
                  >
                    <Lock size={40} style={{ color: codeError ? '#ff4444' : '#cc0000' }} />
                  </div>
                  {/* Vault handle circles */}
                  {[0, 90, 180, 270].map(deg => (
                    <div
                      key={deg}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: '#cc0000',
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${deg}deg) translateX(50px) translate(-50%, -50%)`,
                      }}
                    />
                  ))}
                </motion.div>

                <div className="text-center">
                  <h3 className="font-cinzel text-lg font-bold text-white mb-1">VAULT ACCESS</h3>
                  <p className="font-cormorant text-gray-400 italic text-sm">
                    Enter the secret code to unlock
                  </p>
                </div>

                {/* Code input */}
                <div className="w-full relative">
                  <input
                    type={showCode ? 'text' : 'password'}
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                    placeholder="Enter code..."
                    className="w-full p-4 rounded-xl text-center font-cinzel text-xl text-white placeholder-gray-600 tracking-widest"
                    style={{
                      background: codeError ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${codeError ? 'rgba(255,0,0,0.5)' : 'rgba(139,0,0,0.3)'}`,
                      outline: 'none',
                    }}
                    maxLength={10}
                  />
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <AnimatePresence>
                  {codeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-cinzel text-xs text-red-400 tracking-widest"
                    >
                      ACCESS DENIED
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Hint */}
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-cormorant text-sm text-gray-500 italic text-center"
                  >
                    Hint: It's what he calls you 💛
                  </motion.p>
                )}

                <motion.button
                  onClick={handleUnlock}
                  className="w-full py-3 rounded-xl font-cinzel text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #8b0000, #cc0000)',
                    color: 'white',
                    boxShadow: '0 0 20px rgba(139,0,0,0.3)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(139,0,0,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Unlock size={16} />
                    UNLOCK VAULT
                  </div>
                </motion.button>

                {!showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs font-cinzel text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    Need a hint?
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Layer 2: Confession Room */}
        {layer === 2 && (
          <motion.div
            key="confession"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="w-full max-w-2xl"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #050210, #0a0520)',
                border: '1px solid rgba(155,123,255,0.4)',
                boxShadow: '0 0 60px rgba(155,123,255,0.2)',
              }}
            >
              <div className="p-8 flex flex-col items-center gap-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
                >
                  <Unlock size={40} style={{ color: '#9b7bff' }} />
                </motion.div>

                <div className="text-center">
                  <div className="text-2xl mb-2">🗝️</div>
                  <h3 className="font-cinzel text-xl font-bold" style={{ color: '#9b7bff' }}>
                    THE CONFESSION ROOM
                  </h3>
                  <p className="font-cormorant text-gray-400 italic text-sm mt-1">
                    Access granted. For Sara's eyes only.
                  </p>
                </div>

                <div
                  className="w-full p-6 rounded-2xl"
                  style={{ background: 'rgba(155,123,255,0.08)', border: '1px solid rgba(155,123,255,0.2)' }}
                >
                  <p className="font-cormorant text-lg text-gray-100 italic leading-relaxed text-center">
                    "This was supposed to be a simple birthday message.
                    <br /><br />
                    It became a universe.
                    <br /><br />
                    Because that is what you do to everything.
                    You make ordinary things extraordinary just by existing near them.
                    <br /><br />
                    I built this for you because words were not enough.
                    No words have ever been enough.
                    <br /><br />
                    So I built you a whole sky instead."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {[
                    { emoji: '💛', text: 'From the very first day, it was always you.' },
                    { emoji: '🌌', text: 'In a universe of infinite choices, I choose you.' },
                    { emoji: '✨', text: 'You make me want to be better, always.' },
                    { emoji: '🔐', text: 'This place was built just for you, Sara.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(155,123,255,0.15)' }}
                    >
                      <div className="text-xl mb-1">{item.emoji}</div>
                      <p className="font-cormorant text-xs text-gray-300 italic">{item.text}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => setLayer(3)}
                  className="px-8 py-3 rounded-full font-cinzel text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #9b7bff, #ff7ab6)',
                    color: 'white',
                    boxShadow: '0 0 20px rgba(155,123,255,0.4)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Continue to the final chamber →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Layer 3: Future Vision */}
        {layer === 3 && (
          <motion.div
            key="future"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a1520, #051025)',
                border: '1px solid rgba(247,215,116,0.3)',
                boxShadow: '0 0 60px rgba(247,215,116,0.15)',
              }}
            >
              <div className="p-8 flex flex-col items-center gap-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  ✨
                </motion.div>

                <div className="text-center">
                  <h3 className="font-cinzel text-xl font-bold" style={{ color: '#f7d774' }}>
                    FUTURE VISION
                  </h3>
                  <p className="font-cormorant text-gray-400 italic text-sm mt-1">
                    What the stars see for you
                  </p>
                </div>

                <div className="w-full space-y-3">
                  {[
                    { icon: '🌟', title: 'Great Things', text: 'The universe has reserved extraordinary things for you. They are coming.' },
                    { icon: '💛', title: 'Endless Love', text: 'You will always be loved. Unconditionally. Irreversibly. Completely.' },
                    { icon: '🌸', title: 'Your Bloom', text: 'Every version of you that is still becoming — I am already proud of her.' },
                    { icon: '🔐', title: 'Locked Until Then', text: 'More is coming. This universe will grow. Wait for it.', locked: true },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: item.locked ? 'rgba(255,255,255,0.02)' : 'rgba(247,215,116,0.06)',
                        border: `1px solid ${item.locked ? 'rgba(255,255,255,0.08)' : 'rgba(247,215,116,0.2)'}`,
                        opacity: item.locked ? 0.6 : 1,
                      }}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-cinzel text-sm font-bold" style={{ color: item.locked ? '#666' : '#f7d774' }}>
                            {item.title}
                          </p>
                          {item.locked && <Lock size={10} className="text-gray-600" />}
                        </div>
                        <p className="font-cormorant text-sm text-gray-400 italic mt-0.5">{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-center"
                >
                  <p className="font-cormorant text-lg text-gray-300 italic">
                    "The best of your story is still being written."
                  </p>
                  <p className="font-cinzel text-xs mt-2" style={{ color: '#f7d774' }}>
                    — With infinite love, always 💛
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetX;
