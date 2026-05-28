import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OUR_PHOTOS, HER_PHOTOS } from '../../data/content';

const timeline = [
  {
    id: 'beginning',
    era: 'The Beginning',
    icon: '🌱',
    color: '#9b7bff',
    photo: OUR_PHOTOS[0],
    story: 'Our very first date. I was nervous. You were effortless. The beginning of everything.',
  },
  {
    id: 'firstphone',
    era: 'First Connection',
    icon: '📱',
    color: '#aaddff',
    photo: HER_PHOTOS.find(p => p.id === 'firstphone')!,
    story: 'The first picture you sent after getting your first phone. That small act meant everything to me.',
  },
  {
    id: 'saree',
    era: 'A Moment Frozen in Time',
    icon: '✨',
    color: '#ff7ab6',
    photo: HER_PHOTOS.find(p => p.id === 'saree1')!,
    story: 'You wore a saree. I forgot how to breathe for a moment. I still haven\'t fully recovered.',
  },
  {
    id: 'gift',
    era: 'The Gift',
    icon: '🎁',
    color: '#f7d774',
    photo: HER_PHOTOS.find(p => p.id === 'gifttop')!,
    story: 'Seeing you wear something I gave you — no feeling in the world compares to that.',
  },
  {
    id: 'birthday_date',
    era: 'Her Birthday',
    icon: '🎂',
    color: '#ff7ab6',
    photo: OUR_PHOTOS.find(p => p.id === 'bday_date')!,
    story: 'On her birthday, she still made time for us. Small dates become the biggest memories.',
  },
  {
    id: 'mybday',
    era: 'My Birthday — Our Last Meetup',
    icon: '💙',
    color: '#4488ff',
    photo: OUR_PHOTOS.find(p => p.id === 'last_meetup1')!,
    story: 'Our last meetup. My birthday. Her presence was the only gift that mattered.',
  },
  {
    id: 'saree2',
    era: 'College Festival',
    icon: '🌸',
    color: '#ff7ab6',
    photo: HER_PHOTOS.find(p => p.id === 'saree2')!,
    story: 'She wore a saree again for her college festival. As breathtaking as the first time.',
  },
  {
    id: 'ai',
    era: 'A Gaze Worth Everything',
    icon: '🌌',
    color: '#9b7bff',
    photo: OUR_PHOTOS.find(p => p.id === 'ai_special')!,
    story: 'Even in an AI-generated image, the pose was real — she looking at me with all the love in the world.',
  },
];

const PlanetAtlas: React.FC = () => {
  const [selectedMoment, setSelectedMoment] = useState<typeof timeline[0] | null>(null);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#f7d774', textShadow: '0 0 30px rgba(247,215,116,0.5)' }}
        >
          🟡 ATLAS
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          The map of every moment between us
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="w-full max-w-3xl relative">
        {/* Central line */}
        <div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(247,215,116,0.4), transparent)', transform: 'translateX(-50%)' }}
        />

        <div className="flex flex-col gap-6">
          {timeline.map((moment, i) => {
            if (!moment.photo) return null;
            const isRight = i % 2 === 0;

            return (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex ${isRight ? 'md:justify-end' : 'md:justify-start'} justify-end md:pr-0 pr-0`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full z-10"
                  style={{
                    background: moment.color,
                    boxShadow: `0 0 10px ${moment.color}88`,
                    transform: 'translate(-50%, 0)',
                  }}
                />

                {/* Card */}
                <motion.div
                  className="w-full md:w-5/12 ml-10 md:ml-0 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${moment.color}44`,
                  }}
                  whileHover={{ scale: 1.02, borderColor: moment.color + '88' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMoment(moment)}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={moment.photo.url}
                      alt={moment.era}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
                    />
                    <div className="absolute bottom-2 left-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{moment.icon}</span>
                        <span className="font-cinzel text-xs font-bold" style={{ color: moment.color }}>
                          {moment.era}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-cormorant text-sm text-gray-400 italic line-clamp-3 leading-relaxed">
                      {moment.story}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setSelectedMoment(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="max-w-lg w-full rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0d0a20, #050816)',
                border: `1px solid ${selectedMoment.color}66`,
                boxShadow: `0 0 60px ${selectedMoment.color}33`,
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src={selectedMoment.photo.url}
                  alt={selectedMoment.era}
                  className="w-full h-full object-cover object-top"
                />
                <div style={{ background: 'linear-gradient(to top, rgba(13,10,32,1) 0%, transparent 60%)' }} className="absolute inset-0" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedMoment.icon}</span>
                  <h3 className="font-cinzel text-lg font-bold" style={{ color: selectedMoment.color }}>
                    {selectedMoment.era}
                  </h3>
                </div>
                <p className="font-cormorant text-base text-gray-200 italic leading-relaxed">
                  {selectedMoment.story}
                </p>
                <button
                  onClick={() => setSelectedMoment(null)}
                  className="mt-4 px-4 py-2 rounded-full font-cinzel text-xs"
                  style={{ color: selectedMoment.color, border: `1px solid ${selectedMoment.color}44` }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetAtlas;
