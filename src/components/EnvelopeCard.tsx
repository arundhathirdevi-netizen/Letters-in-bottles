import React from 'react';
import { motion } from 'motion/react';
import { Letter } from '../types';
import { STAMPS } from '../data/stamps';
import { Sparkles, Mail, Heart, Compass } from 'lucide-react';

interface EnvelopeCardProps {
  letter: Letter;
  index: number;
  onClick: () => void;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ letter, index, onClick }) => {
  const stamp = STAMPS.find((s) => s.id === letter.stampId) || STAMPS[index % STAMPS.length];

  // Palette styling for different pastel envelope tones
  const envelopePalette = {
    cream: {
      bg: 'bg-[#faf4e6]',
      border: 'border-[#dfcdb7]',
      crease: '#d2be9f',
      accent: 'text-[#614b3a]',
      recipientText: 'text-[#2e2319]',
      waxBg: 'bg-[#852a38] text-[#fddcdb]',
      waxRing: 'ring-[#a33748]',
      tagBg: 'bg-[#f0e4d0]/90 text-[#544031]',
    },
    pink: {
      bg: 'bg-[#faeaee]',
      border: 'border-[#f2becb]',
      crease: '#e4a5b4',
      accent: 'text-[#6b3a47]',
      recipientText: 'text-[#381a23]',
      waxBg: 'bg-[#962d3e] text-[#fce2e8]',
      waxRing: 'ring-[#b2394e]',
      tagBg: 'bg-[#f5d5de]/90 text-[#612735]',
    },
    peach: {
      bg: 'bg-[#faf0e6]',
      border: 'border-[#f2ccb3]',
      crease: '#e2b496',
      accent: 'text-[#70422c]',
      recipientText: 'text-[#361e12]',
      waxBg: 'bg-[#9c4028] text-[#feddce]',
      waxRing: 'ring-[#b84e33]',
      tagBg: 'bg-[#f5dac5]/90 text-[#63301a]',
    },
    mint: {
      bg: 'bg-[#edf6f0]',
      border: 'border-[#bfe0cc]',
      crease: '#a0ccb0',
      accent: 'text-[#335641]',
      recipientText: 'text-[#162e21]',
      waxBg: 'bg-[#22573a] text-[#d6f5e3]',
      waxRing: 'ring-[#2b6d49]',
      tagBg: 'bg-[#d8eedf]/90 text-[#214731]',
    },
  }[letter.envelopeColor || letter.paperTexture || (['cream', 'pink', 'peach', 'mint'][index % 4] as 'cream' | 'pink' | 'peach' | 'mint')];

  // Wax seal emblem
  const waxEmblem = {
    heart: '♥',
    rose: '✿',
    shell: '🐚',
    star: '✦',
  }[letter.waxSeal || (['heart', 'rose', 'shell', 'star'][index % 4] as 'heart' | 'rose' | 'shell' | 'star')];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`relative rounded-md ${envelopePalette.bg} border-2 ${envelopePalette.border} shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden p-5 flex flex-col justify-between min-h-[300px] group`}
      role="button"
      tabIndex={0}
      aria-label={`Sealed letter bottle #${index + 1}`}
    >
      {/* Delicate vintage airmail patterned top & bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d97c7c]/40 via-[#82a5c5]/40 to-[#d97c7c]/40 opacity-70" />
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#82a5c5]/40 via-[#d97c7c]/40 to-[#82a5c5]/40 opacity-70" />

      {/* Fold Crease Shadow lines mimicking a real folded envelope */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-55 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top triangular flap creases meeting at wax seal center */}
        <line x1="0" y1="0" x2="50%" y2="45%" stroke={envelopePalette.crease} strokeWidth="1.2" strokeDasharray="3 2" />
        <line x1="100%" y1="0" x2="50%" y2="45%" stroke={envelopePalette.crease} strokeWidth="1.2" strokeDasharray="3 2" />
        {/* Bottom fold creases */}
        <line x1="0" y1="100%" x2="50%" y2="45%" stroke={envelopePalette.crease} strokeWidth="0.8" opacity="0.6" />
        <line x1="100%" y1="100%" x2="50%" y2="45%" stroke={envelopePalette.crease} strokeWidth="0.8" opacity="0.6" />
      </svg>

      {/* Top Header Row: Bottle Label + Postage Stamp */}
      <div className="relative z-10 flex items-start justify-between">
        {/* Bottle & Postal Mark Tag */}
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase ${envelopePalette.tagBg} shadow-xs border border-black/5`}>
            <Compass className="w-2.5 h-2.5 opacity-70" />
            Bottle #{index + 1} • {letter.date || 'Drifting'}
          </span>
          
          {/* Postmark stamp seal */}
          <div className="mt-1 flex items-center gap-1.5 text-[9px] uppercase tracking-wider opacity-65 font-mono text-[#5a483a]">
            <span>Poste Restante</span>
            <span>•</span>
            <span>Ocean Tide</span>
          </div>
        </div>

        {/* Real Vintage Postage Stamp with cancellation postmark lines */}
        <div className="relative group-hover:rotate-2 transition-transform duration-300">
          {/* Circular postmark cancellation stamp */}
          <div className="absolute -left-6 -top-2 z-20 w-12 h-12 rounded-full border border-black/30 flex items-center justify-center pointer-events-none rotate-[-12deg] opacity-75">
            <div className="w-10 h-10 rounded-full border border-dashed border-black/25 flex flex-col items-center justify-center text-[7px] font-mono leading-[8px] text-center uppercase text-[#4d3a2d]">
              <span>OCEAN</span>
              <span>DRIFT</span>
            </div>
          </div>

          {/* Wavy cancellation ink lines */}
          <div className="absolute -left-5 top-4 z-20 pointer-events-none opacity-60 text-[10px] text-[#4d3a2d] font-serif leading-none select-none">
            <span className="tracking-tighter">≈≈≈≈≈</span>
          </div>

          {/* Stamp Frame */}
          <div className="w-13 h-16 bg-[#fffdf8] p-1 rounded-xs shadow-md border-2 border-dashed border-[#cfbeab] overflow-hidden bg-cover">
            <img
              src={stamp.imageUrl}
              alt={stamp.name}
              className="w-full h-full object-cover filter contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Middle Center Section: Wax Seal + Addressee Calligraphy (NO LETTER TEXT) */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        {/* Addressee handwritten calligraphy */}
        <div className="w-full text-center px-4 py-2">
          <div className="text-[10px] uppercase tracking-[0.2em] font-mono opacity-65 mb-0.5 text-[#6c5545]">
            Deliver To
          </div>
          <div className={`font-serif-vintage text-2xl sm:text-3xl ${envelopePalette.recipientText} tracking-tight font-normal leading-snug`}>
            {letter.recipientName || 'A Kind Stranger'}
          </div>
          <div className="text-xs italic text-[#786150] font-light mt-0.5">
            Carried across the digital tide
          </div>
        </div>

        {/* Embossed Wax Seal Centerpiece */}
        <div className="relative mt-2">
          <motion.div
            whileHover={{ scale: 1.12 }}
            className={`w-11 h-11 rounded-full ${envelopePalette.waxBg} shadow-lg ring-2 ${envelopePalette.waxRing} flex items-center justify-center text-sm font-serif select-none transition-transform`}
          >
            <span className="drop-shadow-sm font-semibold">{waxEmblem}</span>
          </motion.div>
          {/* Subtle wax drip sheen */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-black/15 blur-[1px]" />
        </div>
      </div>

      {/* Bottom Footer Section: Sender & Open Letter Prompt */}
      <div className="relative z-10 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-[#826e5f]">
            Dispatched by
          </span>
          <span className={`font-handwriting text-lg ${envelopePalette.recipientText}`}>
            ~ {letter.senderName || 'Anonymous Drifter'}
          </span>
        </div>

        {/* Hover Call-to-action button badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 group-hover:bg-black/10 border border-black/10 text-[11px] font-medium text-[#423328] transition-colors">
          <Mail className="w-3 h-3 text-[#962d3e]" />
          <span>Uncork & Read</span>
        </div>
      </div>
    </motion.div>
  );
};
