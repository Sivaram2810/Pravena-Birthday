import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const SCROLL_TEXT = `Chapter I — The Signal

Before I knew what patience was, I sent one message.
You said don't message again.
I messaged again.

That was the beginning.

∙ ∙ ∙

Chapter II — The Wait

For three months I learned you.
Not in a rush. Not with expectations.
Just... slowly. Like reading a book you never want to end.

Memes. Laugh emojis. Silence. Then, one day —
conversation.

The kind that doesn't stop.

∙ ∙ ∙

Chapter III — The Question

I asked who you liked.
You said no one.
You asked mine.

I told the truth.

"You."

You were shocked. I was terrified.
But I meant it.

∙ ∙ ∙

Chapter IV — November

You admitted it.
That you felt something too.

I didn't say anything dramatic.
I just... waited.
Because I knew the real moment was still coming.

∙ ∙ ∙

Chapter V — December 18th

Around 2 PM.
I asked the question properly.

You needed time.

I gave it to you without hesitation.

∙ ∙ ∙

Chapter VI — December 19th, 5:30 AM

We were talking. You said bye.
I said bye.

Then —

"Love you."

I sat there. I read it again.
I read it seven times.

I went to the biology exam and barely wrote anything.
Every time I looked up, I saw you.
Every time you caught me staring, you laughed.

That laugh.
That morning.
That exam I nearly failed for you.

∙ ∙ ∙

Chapter VII — Since Then

We have had our ups and downs.
We have had our quiet days and our loud ones.
We have had the kind of moments that don't fit into words.

But they all led here.

To this app. This birthday. This moment.

∙ ∙ ∙

P.S. — I would choose you again in every version of this story.
Every single one.

— Sivaram 💛`;

const PlanetScroll: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(progress);
  };

  const paragraphs = SCROLL_TEXT.split('\n').filter(line => line !== undefined);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#d4a843', textShadow: '0 0 30px rgba(212,168,67,0.5)' }}
        >
          📜 SCROLL
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Our story, written in stars</p>
      </motion.div>

      {/* Scroll progress indicator */}
      <div className="w-full max-w-2xl">
        <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${scrollProgress * 100}%`,
              background: scrollProgress > 0.8 ? '#f7d774' : '#8b7355',
              transition: 'width 0.1s, background 1s',
            }}
          />
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full max-w-2xl rounded-3xl overflow-y-auto relative"
        style={{
          height: '60vh',
          background: scrollProgress < 0.5
            ? 'linear-gradient(135deg, #2a1810, #1a0f05)'
            : 'linear-gradient(135deg, #1a0a05, #050816)',
          border: `1px solid ${scrollProgress > 0.8 ? 'rgba(247,215,116,0.3)' : 'rgba(139,90,43,0.3)'}`,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(139,90,43,0.5) transparent',
          transition: 'background 1s, border-color 1s',
        }}
      >
        {/* Parchment texture lines */}
        {scrollProgress < 0.3 && Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-4 right-4 pointer-events-none"
            style={{
              top: `${i * 3.5}%`,
              height: 1,
              background: 'rgba(139,90,43,0.08)',
            }}
          />
        ))}

        <div className="p-8 md:p-12">
          {/* Quill icon */}
          <div className="text-2xl mb-6 text-center">
            {scrollProgress < 0.5 ? '🖋️' : '✨'}
          </div>

          {paragraphs.map((para, i) => {
            const isChapterHeader = para.startsWith('Chapter');
            const isPS = para.startsWith('P.S.');
            const isDivider = para.includes('∙ ∙ ∙');

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.01 }}
                className="mb-2"
              >
                {isChapterHeader ? (
                  <h2
                    className="font-cinzel text-sm font-bold mt-6 mb-3 tracking-widest"
                    style={{
                      color: scrollProgress > 0.4 ? '#f7d774' : '#8b7355',
                      textShadow: scrollProgress > 0.4 ? '0 0 10px rgba(247,215,116,0.4)' : 'none',
                      transition: 'color 1s, text-shadow 1s',
                    }}
                  >
                    {para}
                  </h2>
                ) : isDivider ? (
                  <div className="text-center my-6">
                    <span className="font-cinzel text-sm text-gray-600">∙ ∙ ∙</span>
                  </div>
                ) : isPS ? (
                  <p
                    className="font-cormorant text-lg italic mt-4"
                    style={{ color: '#f7d774' }}
                  >
                    {para}
                  </p>
                ) : (
                  <p
                    className="font-cormorant text-base leading-relaxed"
                    style={{
                      color: scrollProgress > 0.6 ? '#e0d0c0' : '#c0a080',
                      transition: 'color 1s',
                      lineHeight: '1.9rem',
                    }}
                  >
                    {para}
                  </p>
                )}
              </motion.div>
            );
          })}

          {/* End flourish */}
          <div
            className="mt-8 pt-6 flex flex-col items-center gap-2"
            style={{ borderTop: scrollProgress > 0.8 ? '1px solid rgba(247,215,116,0.2)' : '1px solid rgba(139,90,43,0.2)' }}
          >
            <span className="text-2xl">{scrollProgress > 0.8 ? '🌌' : '🕊️'}</span>
            <p
              className="font-cinzel text-xs tracking-widest"
              style={{ color: scrollProgress > 0.8 ? '#f7d774' : '#8b7355' }}
            >
              — FINIS —
            </p>
          </div>
        </div>
      </div>

      <motion.p
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="font-cormorant text-xs text-gray-600 italic"
      >
        Scroll to unfold our story
      </motion.p>
    </div>
  );
};

export default PlanetScroll;
