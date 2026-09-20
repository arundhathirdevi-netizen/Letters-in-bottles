import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, Feather, CornerDownRight } from 'lucide-react';
import { Letter } from '../types';
import { STAMPS } from '../data/stamps';
import { sounds } from '../utils/sound';

interface SpecialLetterViewerProps {
  letter: Letter;
  onClose: () => void;
  onWriteBack?: () => void;
}

export const SpecialLetterViewer: React.FC<SpecialLetterViewerProps> = ({
  letter,
  onClose,
  onWriteBack,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const stamp = STAMPS.find((s) => s.id === letter.stampId) || STAMPS[0];

  const handleOpenEnvelope = () => {
    sounds.playPaperRustle();
    setIsOpen(true);
  };

  const envelopeColors = {
    pink: {
      outer: 'bg-[#ffd5df] border-[#f8a8bc]',
      flap: 'border-t-[#f8a8bc] border-l-transparent border-r-transparent',
      text: 'text-[#481e28]',
      seal: 'bg-[#a32e3d] text-[#ffccd3]',
    },
    peach: {
      outer: 'bg-[#fedac5] border-[#f8b28f]',
      flap: 'border-t-[#f8b28f] border-l-transparent border-r-transparent',
      text: 'text-[#4d281a]',
      seal: 'bg-[#a6432b] text-[#ffe1d4]',
    },
    mint: {
      outer: 'bg-[#c5ebd4] border-[#93d1ab]',
      flap: 'border-t-[#93d1ab] border-l-transparent border-r-transparent',
      text: 'text-[#163825]',
      seal: 'bg-[#1b5837] text-[#d4f3e2]',
    },
    cream: {
      outer: 'bg-[#fbf7ee] border-[#dfd2be]',
      flap: 'border-t-[#dfd2be] border-l-transparent border-r-transparent',
      text: 'text-[#3e3226]',
      seal: 'bg-[#7a2e37] text-[#fedac5]',
    },
  }[letter.envelopeColor || 'pink'];

  const sealIcons = {
    heart: '💖',
    rose: '🌹',
    shell: '🐚',
    star: '✨',
  }[letter.waxSeal || 'heart'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl my-auto flex flex-col items-center">
        {/* Close Button */}
        <button
          id="close-special-viewer-btn"
          onClick={onClose}
          className="absolute -top-10 right-0 p-1.5 rounded-full hover:bg-white/10 text-[#baa494] hover:text-white transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Sealed Envelope State */
            <motion.div
              key="envelope"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-[0.25em] text-[#ffd5df] font-light flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  A Sealed Letter Has Arrived For You
                </span>
                <h3 className="font-serif-vintage text-3xl text-[#faf6ed] mt-1">
                  {letter.recipientName || 'A Secret Recipient'}
                </h3>
              </div>

              {/* Physical Envelope Illustration with Stamp & Wax Seal */}
              <div
                onClick={handleOpenEnvelope}
                className={`relative w-80 sm:w-96 h-56 rounded-md shadow-2xl ${envelopeColors.outer} border-2 flex flex-col justify-between p-5 cursor-pointer transform hover:scale-105 transition-all duration-300 group`}
              >
                {/* Stamp affixed to envelope top right */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-14 h-16 bg-[#fffcf5] p-1 shadow-md border border-dashed border-[#d1bfab] overflow-hidden rotate-2">
                    <img
                      src={stamp.imageUrl}
                      alt={stamp.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Recipient calligraphy on envelope */}
                <div className="my-auto pl-4">
                  <div className="text-xs uppercase tracking-widest text-[#715243] font-mono">
                    Deliver To:
                  </div>
                  <div className={`font-handwriting text-3xl sm:text-4xl ${envelopeColors.text} mt-1 font-semibold`}>
                    {letter.recipientName || 'Beloved'}
                  </div>
                  <div className="text-[11px] text-[#715243] tracking-wide mt-1">
                    Via Digital Ocean Bottle Post
                  </div>
                </div>

                {/* Wax Seal Center button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div
                    className={`w-14 h-14 rounded-full ${envelopeColors.seal} shadow-xl border-2 border-white/30 flex items-center justify-center text-xl transform group-hover:scale-110 transition`}
                  >
                    {sealIcons}
                  </div>
                </div>

                <div className="text-center text-xs text-[#715243] tracking-wider uppercase group-hover:text-black transition">
                  Click wax seal to break & open letter 🕊️
                </div>
              </div>
            </motion.div>
          ) : (
            /* Unfolded Parchment Letter */
            <motion.div
              key="letter"
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full max-w-xl p-8 sm:p-12 rounded-sm shadow-2xl parchment-paper bg-[#fcf8f0] text-[#2c241e] border border-[#dfceba]/80"
            >
              {/* Affixed Stamp */}
              <div className="absolute top-6 right-6 z-20 select-none">
                <div className="w-18 h-22 sm:w-20 sm:h-24 bg-[#fffcf5] p-1 rounded-xs shadow-md border-2 border-dashed border-[#d1bfab] overflow-hidden">
                  <img
                    src={stamp.imageUrl}
                    alt={stamp.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Special Header */}
              <div className="mb-6 pr-24">
                <div className="text-xs uppercase tracking-widest text-[#a63d4a] font-medium flex items-center gap-1 mb-1">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  Special Letter for {letter.recipientName}
                </div>
                <h2 className="font-serif-vintage text-2xl sm:text-3xl text-[#2c221b] font-medium">
                  {letter.title || 'A letter just for you'}
                </h2>
                <div className="text-xs text-[#8c7b6f] mt-1">
                  {letter.date} • {letter.location || 'Written with love'}
                </div>
              </div>

              {/* Body */}
              <div className="parchment-lines font-handwriting text-2xl sm:text-3xl leading-[36px] whitespace-pre-wrap my-4 text-[#2f241d]">
                {letter.content}
              </div>

              {/* Sign-off */}
              <div className="mt-8 pt-4 border-t border-[#cca78f]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-handwriting text-2xl text-[#7a685c]">—</span>
                  <span className="font-handwriting text-2xl sm:text-3xl text-[#423228]">
                    {letter.senderName || 'Forever yours'}
                  </span>
                </div>

                {onWriteBack && (
                  <button
                    id="write-back-special-btn"
                    onClick={onWriteBack}
                    className="px-4 py-1.5 rounded-full bg-[#ffd5df] hover:bg-[#ffe5ec] text-[#411922] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>Send a Reply</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
