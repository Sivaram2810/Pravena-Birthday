import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { OUR_PHOTOS } from '../../data/content';

const timeline = [
  {
    id: 'truth-dare',
    era: 'The Beginning',
    date: 'Truth or Dare',
    icon: '🎲',
    story: 'It started as a joke — a dare. I told her not to take it seriously. She told me not to message again.',
    photo: null,
  },
  {
    id: 'memes',
    era: 'The Patient Wait',
    date: '3 Months of Trying',
    icon: '📱',
    story: 'Memes. ShareChat forwards. Laugh emojis. Slowly, carefully, I kept building the bridge one message at a time.',
    photo: null,
  },
  {
    id: 'conversation',
    era: 'The Flow',
    date: 'When It Finally Clicked',
    icon: '💬',
    story: 'One day, conversation just started flowing naturally. No effort. Just us, talking like we\'d always known each other.',
    photo: null,
  },
  {
    id: 'truth',
    era: 'The Confession',
    date: 'I Told the Truth',
    icon: '💛',
    story: 'During a dare conversation, she asked my crush. I said: "You." She got completely shocked.',
    photo: null,
  },
  {
    id: 'november',
    era: 'November',
    date: 'She Admitted It',
    icon: '🍂',
    story: 'She told me she had a crush on me. I waited patiently. Because I knew the real moment was still coming.',
    photo: null,
  },
  {
    id: 'proposal',
    era: 'December 18, 2022',
    date: '~2:00 PM',
    icon: '💍',
    story: 'I formally proposed. She said she needed time. I gave it to her without hesitation.',
    photo: null,
  },
  {
    id: 'love-you',
    era: 'December 19, 2022',
    date: '5:30 AM',
    icon: '🌅',
    story: 'We were talking before her biology exam. Before she left — she said "Love you." I nearly forgot how to breathe.',
    photo: null,
  },
  {
    id: 'first-date',
    era: 'First Date',
    date: 'The Beginning of Everything',
    icon: '🌟',
    story: 'Our very first date ever. The beginning of us.',
    photo: OUR_PHOTOS[0],
  },
  {
    id: 'her-birthday',
    era: 'Her Birthday',
    date: 'A Special Day',
    icon: '🎂',
    story: 'On her birthday — a small, quick, perfect little date.',
    photo: OUR_PHOTOS[1],
  },
  {
    id: 'my-birthday',
    era: 'My Birthday',
    date: 'Our Last Meetup',
    icon: '💙',
    story: 'Our last meetup — on my birthday. A memory I hold forever.',
    photo: OUR_PHOTOS[2],
  },
];

const PlanetAtlas: React.FC = () => {
  const [selectedMoment, setSelectedMoment] = useState<typeof timeline[0] | null>(null);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#f7d774', textShadow: '0 0 30px rgba(247,215,116,0.5)' }}
        >
          🟡 ATLAS
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">The map of every moment between us</p>
      </motion.div>

      {/* Timeline */}
      <div className="w-full max-w-3xl relative">
        {/* Central line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(247,215,116,0.3) 10%, rgba(247,215,116,0.3) 90%, transparent)' }}
        />

        {timeline.map((moment, i) => {
          const isRight = i % 2 === 0;

          return (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, x: isRight ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative flex ${isRight ? 'justify-start' : 'justify-end'} mb-8`}
              style={{ paddingLeft: isRight ? '0' : '50%', paddingRight: isRight ? '50%' : '0' }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-1/2 top-4 w-3 h-3 rounded-full -translate-x-1/2 z-10"
                style={{ background: '#f7d774', boxShadow: '0 0 8px rgba(247,215,116,0.6)' }}
              />

              {/* Card */}
              <motion.div
                onClick={() => setSelectedMoment(moment)}
                className={`cursor-pointer rounded-2xl p-4 ${isRight ? 'mr-4' : 'ml-4'} w-full max-w-xs`}
                style={{
                  background: 'linear-gradient(135deg, rgba(247,215,116,0.06), rgba(247,215,116,0.02))',
                  border: '1px solid rgba(247,215,116,0.2)',
                }}
                whileHover={{ scale: 1.03, borderColor: 'rgba(247,215,116,0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                {moment.photo && (
                  <div className="rounded-xl overflow-hidden mb-3" style={{ maxHeight: 120 }}>
                    <img src={moment.photo.url} alt={moment.photo.label} className="w-full h-32 object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{moment.icon}</span>
                  <span className="font-cinzel text-xs tracking-wider" style={{ color: '#f7d774' }}>{moment.era}</span>
                </div>
                <p className="font-cinzel text-xs text-gray-500 mb-2">{moment.date}</p>
                <p className="font-cormorant text-sm text-gray-300 italic leading-relaxed">{moment.story}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setSelectedMoment(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-lg w-full rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a1005, #0d0a05)', border: '1px solid rgba(247,215,116,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              {selectedMoment.photo && (
                <div style={{ maxHeight: 250, overflow: 'hidden' }}>
                  <img src={selectedMoment.photo.url} alt={selectedMoment.photo.label} className="w-full object-cover" style={{ maxHeight: 250 }} />
                </div>
              )}
              <div className="p-6 relative">
                <button
                  onClick={() => setSelectedMoment(null)}
                  className="absolute top-4 right-4 p-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <X size={16} className="text-gray-400" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedMoment.icon}</span>
                  <span className="font-cinzel text-sm font-bold" style={{ color: '#f7d774' }}>{selectedMoment.era}</span>
                </div>
                <p className="font-cinzel text-xs text-gray-500 mb-3">{selectedMoment.date}</p>
                <p className="font-cormorant text-lg text-gray-200 italic leading-relaxed">{selectedMoment.story}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetAtlas;
