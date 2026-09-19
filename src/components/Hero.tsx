import React from 'react';
import { motion } from 'motion/react';
import { Feather, BookOpen, Waves, Sparkles } from 'lucide-react';
import vintageCityRain from '../assets/images/vintage_city_rain_1789832767884.jpg';

interface HeroProps {
  onOpenWrite: () => void;
  onOpenRead: () => void;
  bottlesCount: number;
}

export const Hero: React.FC<HeroProps> = ({ onOpenWrite, onOpenRead, bottlesCount }) => {
  return (
    <div className="relative min-h-[88vh] flex items-center justify-start overflow-hidden px-6 sm:px-12 md:px-20 py-16 md:py-24">
      {/* 35mm Vintage Film Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={vintageCityRain}
          alt="Vintage grainy city street on a rainy day"
          className="w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.08] saturate-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Soft atmospheric gradient & film grain vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12100e]/90 via-[#181310]/60 to-[#12100e]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-transparent to-[#12100e]/60" />
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      {/* Main Content Container without polaroid */}
      <div className="relative z-10 max-w-3xl w-full">
        {/* Editorial Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center text-left"
        >
          {/* Fairytale Tag / Title: handmade letters */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-6 h-[1px] bg-[#fedac5]/60" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#fedac5] font-light">
              handmade letters
            </span>
            <span className="w-6 h-[1px] bg-[#fedac5]/60" />
          </div>

          {/* Main Heading requested by user */}
          <h1 className="font-serif-vintage text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] font-normal text-[#faf6ed] tracking-tight mb-5 drop-shadow-sm">
            Drop your letter <br />
            <span className="italic font-light text-[#fdebd7]">into the digital ocean,</span> <br />
            <span className="text-[#f5ede2]">and find one in return.</span>
          </h1>

          {/* Subtitle with fairytale pastel touches */}
          <p className="max-w-xl text-base sm:text-lg text-[#d8cbbf] font-light leading-relaxed mb-9">
            An intimate sanctuary where thoughts are sealed in bottles and left to the drift.
            Every word carried by quiet digital waves finds someone who needs to hear it.
          </p>

          {/* Interactive Hero Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {/* [ Cast a Letter 🖋️ ] */}
            <motion.button
              id="hero-cast-letter-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenWrite}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#f9f4e8] hover:bg-[#fffcf5] text-[#221a15] font-medium text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4 text-[#8a5340]" />
              <span>Cast a Letter</span>
              <span className="text-xs">🖋️</span>
            </motion.button>

            {/* [ Read a Letter 📖 ] */}
            <motion.button
              id="hero-read-letter-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenRead}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2a221d]/85 hover:bg-[#382d26] text-[#faf6ed] border border-[#52443a]/70 hover:border-[#fedac5]/50 font-normal text-sm sm:text-base tracking-wide shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#ffd5df]" />
              <span>Read a Letter</span>
              <span className="text-xs">📖</span>
            </motion.button>
          </div>

          {/* Ocean ticker indicator */}
          <div className="flex flex-wrap items-center gap-3 mt-11 text-xs text-[#a99787]">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#201a16]/80 border border-[#3c3129]">
              <Waves className="w-3.5 h-3.5 text-[#c5ebd4] animate-pulse" />
              <span>{bottlesCount} bottles currently drifting in the ocean</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#fedac5]">
              <Sparkles className="w-3 h-3 text-[#ffd5df]" />
              <span>Free & anonymous worldwide</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
