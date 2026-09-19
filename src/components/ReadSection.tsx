import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Heart, Sparkles, Feather, Compass, CornerDownRight } from 'lucide-react';
import { Letter } from '../types';
import { STAMPS } from '../data/stamps';
import { sounds } from '../utils/sound';

interface ReadSectionProps {
  letters: Letter[];
  onClose: () => void;
  onReply: (inReplyTo: Letter) => void;
  onWriteNew: () => void;
  initialIndex?: number;
}

export const ReadSection: React.FC<ReadSectionProps> = ({
  letters,
  onClose,
  onReply,
  onWriteNew,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [likedLetters, setLikedLetters] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    letters.forEach((l) => {
      map[l.id] = l.likesCount || 12;
    });
    return map;
  });

  const currentLetter = letters[currentIndex % letters.length];
  const stamp = STAMPS.find((s) => s.id === currentLetter.stampId) || STAMPS[0];

  const handleNextLetter = () => {
    sounds.playPaperRustle();
    // Pick next letter smoothly
    setCurrentIndex((prev) => (prev + 1) % letters.length);
  };

  const handleToggleLike = (id: string) => {
    sounds.playStampAffix();
    setLikedLetters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setLikesCountMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + (likedLetters[id] ? -1 : 1),
    }));
  };

  const paperBackgroundClass = {
    cream: 'bg-[#fcf8f0] text-[#2c241e]',
    pink: 'bg-[#fef2f4] text-[#332227]',
    peach: 'bg-[#fdf4ed] text-[#33251e]',
    mint: 'bg-[#f1f9f4] text-[#1e2e26]',
  }[currentLetter.paperTexture || 'cream'];

  const fontClass = {
    cursive: 'font-handwriting text-2xl sm:text-3xl leading-[36px]',
    serif: 'font-serif-vintage text-lg sm:text-xl leading-relaxed',
    typewriter: 'font-mono text-sm sm:text-base leading-relaxed tracking-tight',
  }[currentLetter.fontStyle || 'cursive'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-auto flex flex-col items-center">
        {/* Navigation Bar */}
        <div className="w-full flex items-center justify-between mb-4 px-2 text-[#e2d7cb]">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#c5ebd4]" />
            <span className="font-serif-vintage text-lg text-[#faf6ed]">
              Bottle No. {currentIndex + 1} of {letters.length} in the Ocean
            </span>
          </div>

          <button
            id="close-read-section-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#baa494] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vintage Letter Parchment Display with Selected Stamp */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLetter.id}
            initial={{ opacity: 0, y: 16, rotate: -0.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -16, rotate: 0.5 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`relative w-full max-w-2xl min-h-[500px] p-8 sm:p-12 rounded-sm shadow-2xl parchment-paper ${paperBackgroundClass} border border-[#dfceba]/70 flex flex-col justify-between`}
          >
            {/* Top Right Corner: The Writer's Selected Postage Stamp as requested */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 select-none">
              <div className="relative rotate-1 hover:rotate-0 transition-transform duration-300">
                {/* Wavy Postmark Cancellation Lines */}
                <div className="absolute -left-12 -top-2 w-28 h-12 pointer-events-none opacity-45 mix-blend-multiply flex flex-col justify-center">
                  <div className="w-full h-[1px] bg-[#3a3028] mb-1" />
                  <div className="w-full h-[1px] bg-[#3a3028] mb-1" />
                  <div className="w-full h-[1px] bg-[#3a3028]" />
                  <span className="text-[7px] tracking-widest text-[#3a3028] uppercase font-mono mt-0.5">
                    {stamp.postmarkText}
                  </span>
                </div>

                {/* Perforated Stamp Edge */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 bg-[#fffcf5] p-1.5 rounded-xs shadow-md border-2 border-dashed border-[#d1bfab] overflow-hidden flex flex-col items-center">
                  <div className="relative w-full h-full overflow-hidden bg-stone-100 rounded-xs">
                    <img
                      src={stamp.imageUrl}
                      alt={stamp.name}
                      className="w-full h-full object-cover filter saturate-[1.05]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-[#2b221c]/70 text-[8px] text-[#faf6ed] text-center py-0.5 uppercase tracking-wider font-mono">
                      {stamp.denomination}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Letter Head */}
            <div className="mb-6 pr-24 sm:pr-32">
              <h3 className="font-serif-vintage text-2xl sm:text-3xl font-medium tracking-wide text-[#2e231c]">
                {currentLetter.title || 'A letter from the drift'}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#8c7a6e]">
                <span>{currentLetter.location || 'Somewhere quiet'}</span>
                <span>•</span>
                <span>{currentLetter.date}</span>
                {currentLetter.isSpecial && (
                  <span className="ml-1 text-[#a63d4a] font-medium flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    For {currentLetter.recipientName}
                  </span>
                )}
              </div>
            </div>

            {/* Letter Body Parchment */}
            <div className={`relative flex-1 parchment-lines my-2 ${fontClass} whitespace-pre-wrap`}>
              {currentLetter.content}
            </div>

            {/* Letter Sign-off */}
            <div className="mt-8 pt-4 border-t border-[#cca78f]/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-handwriting text-2xl text-[#6b584d]">—</span>
                <span className="font-handwriting text-2xl sm:text-3xl text-[#3b2e25]">
                  {currentLetter.senderName || 'An anonymous stranger'}
                </span>
              </div>

              {/* Heart warmth reaction */}
              <button
                id="letter-warmth-reaction-btn"
                onClick={() => handleToggleLike(currentLetter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  likedLetters[currentLetter.id]
                    ? 'bg-[#ffd5df] text-[#4f202a]'
                    : 'bg-[#ede3d3] hover:bg-[#e2d5c3] text-[#5e4e42]'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    likedLetters[currentLetter.id] ? 'fill-current text-[#a63d4a]' : ''
                  }`}
                />
                <span>
                  {likedLetters[currentLetter.id] ? 'Warmth Left' : 'Leave a Warm Hug'} (
                  {likesCountMap[currentLetter.id] || 0})
                </span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Controls & The Soft [ Read Next Letter 📖 ] button requested by user */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-5 px-2">
          <div className="flex items-center gap-2">
            {/* Reply button */}
            <button
              id="reply-in-bottle-btn"
              onClick={() => onReply(currentLetter)}
              className="px-4 py-2 rounded-full bg-[#271f1b] hover:bg-[#342a24] text-[#faf6ed] border border-[#483a31] text-xs font-normal tracking-wide flex items-center gap-1.5 transition cursor-pointer"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-[#fedac5]" />
              <span>Reply in a Bottle</span>
            </button>

            <button
              id="write-own-letter-btn"
              onClick={onWriteNew}
              className="px-4 py-2 rounded-full bg-[#271f1b] hover:bg-[#342a24] text-[#faf6ed] border border-[#483a31] text-xs font-normal tracking-wide flex items-center gap-1.5 transition cursor-pointer"
            >
              <Feather className="w-3.5 h-3.5 text-[#ffd5df]" />
              <span>Cast Your Own</span>
            </button>
          </div>

          {/* User Requested: soft [ Read Next Letter 📖 ] button */}
          <motion.button
            id="read-next-letter-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNextLetter}
            className="px-6 py-2.5 rounded-full bg-[#f9f4e8] hover:bg-[#fffdf9] text-[#221a15] font-medium text-sm tracking-wide flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#8a5340]" />
            <span>Read Next Letter</span>
            <span className="text-xs">📖</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
