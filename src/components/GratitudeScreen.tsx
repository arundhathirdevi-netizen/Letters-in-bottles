import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Feather, Waves, Copy, Check, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { Letter } from '../types';
import oceanBottleMist from '../assets/images/ocean_bottle_mist_1789832856649.jpg';

interface GratitudeScreenProps {
  sentLetter: Letter;
  secretLinkUrl?: string;
  onWriteAnother: () => void;
  onReturnToOcean: () => void;
  onViewSpecialLetter?: (letter: Letter) => void;
}

export const GratitudeScreen: React.FC<GratitudeScreenProps> = ({
  sentLetter,
  secretLinkUrl,
  onWriteAnother,
  onReturnToOcean,
  onViewSpecialLetter,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!secretLinkUrl) return;
    navigator.clipboard.writeText(secretLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative min-h-[90vh] flex items-center justify-center p-6 sm:p-10 overflow-hidden"
    >
      {/* Background with calm drifting ocean bottle atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src={oceanBottleMist}
          alt="Vintage glass bottle drifting in tranquil fairytale sea waves"
          className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-[#12100e]/70 to-[#12100e]/85" />
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto text-center flex flex-col items-center">
        {/* Soft floating emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-16 h-16 rounded-full bg-[#fedac5]/15 border border-[#fedac5]/30 flex items-center justify-center mb-6 shadow-xl"
        >
          <span className="text-2xl">🕊️</span>
        </motion.div>

        {/* User Requested Headline: 'Thank you for leaving a piece of your heart here.' 🕊️✨ */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl text-[#faf6ed] font-normal tracking-tight leading-snug mb-4"
        >
          Thank you for leaving a piece of your heart here. 🕊️✨
        </motion.h2>

        {/* User Requested Message: 'Your words are now floating across the hands of random readers. May they bring warmth to whoever finds them.' 🌊🕯️ */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="text-base sm:text-lg text-[#d8cbbf] font-light max-w-xl leading-relaxed mb-8"
        >
          {sentLetter.isSpecial
            ? `Your letter for ${sentLetter.recipientName || 'your special someone'} has been sealed in an enchanted bottle with a custom wax seal. Share your dedicated secret link below!`
            : 'Your words are now floating across the hands of random readers. May they bring warmth to whoever finds them. 🌊🕯️'}
        </motion.p>

        {/* Special Someone Secret Link Box if Option B was chosen */}
        {sentLetter.isSpecial && secretLinkUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="w-full bg-[#1e1716]/90 border border-[#4d3638] rounded-xl p-5 mb-8 text-left shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-[#ffd5df] font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#ffd5df]" />
                Dedicated Secret Link for {sentLetter.recipientName}
              </span>
              <span className="text-[11px] text-[#c5ebd4] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Custom Envelope Ready
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 bg-[#120e0d] p-2.5 rounded-lg border border-[#3e2c2e]">
              <input
                id="secret-link-display"
                type="text"
                readOnly
                value={secretLinkUrl}
                className="w-full bg-transparent text-xs text-[#faf6ed] outline-none font-mono selection:bg-[#ffd5df]/30 truncate"
              />
              <button
                id="copy-secret-link-btn"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-md bg-[#ffd5df] hover:bg-[#ffe5ec] text-[#2c151b] text-xs font-medium flex items-center gap-1 transition cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2c151b]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {onViewSpecialLetter && (
              <div className="mt-3 flex justify-end">
                <button
                  id="preview-special-letter-btn"
                  onClick={() => onViewSpecialLetter(sentLetter)}
                  className="text-xs text-[#fedac5] hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview Sealed Envelope Animation</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* User Requested Buttons: [ Write Another Letter 🖋️ ] and [ Return to Ocean 🌊 ] */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* [ Write Another Letter 🖋️ ] */}
          <motion.button
            id="gratitude-write-another-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onWriteAnother}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#f9f4e8] hover:bg-[#fffcf5] text-[#221a15] font-medium text-sm tracking-wide shadow-lg transition cursor-pointer"
          >
            <Feather className="w-4 h-4 text-[#8a5340]" />
            <span>Write Another Letter</span>
            <span className="text-xs">🖋️</span>
          </motion.button>

          {/* [ Return to Ocean 🌊 ] */}
          <motion.button
            id="gratitude-return-ocean-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReturnToOcean}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2a221d]/80 hover:bg-[#382d26] text-[#faf6ed] border border-[#52443a]/80 hover:border-[#fedac5]/50 font-normal text-sm tracking-wide shadow-md transition cursor-pointer"
          >
            <Waves className="w-4 h-4 text-[#c5ebd4]" />
            <span>Return to Ocean</span>
            <span className="text-xs">🌊</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
