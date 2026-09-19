import React from 'react';
import { Feather, Volume2, VolumeX, Compass } from 'lucide-react';
import { sounds } from '../utils/sound';

interface NavbarProps {
  onOpenWrite: () => void;
  onOpenRead: () => void;
  onScrollToHero: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bottlesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWrite,
  onOpenRead,
  onScrollToHero,
  soundEnabled,
  onToggleSound,
  bottlesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 transition-all duration-300 bg-[#141210]/70 backdrop-blur-md border-b border-[#3a322c]/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          id="brand-logo-btn"
          onClick={onScrollToHero}
          className="flex items-center gap-2.5 text-left group transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#fceddc]/15 flex items-center justify-center text-[#ffdfba] border border-[#fceddc]/20 group-hover:border-[#ffdfba]/40 transition">
            <Feather className="w-4 h-4 text-[#fedac5]" />
          </div>
          <div>
            <div className="font-serif-vintage text-lg tracking-wide text-[#faf6ed] font-medium group-hover:text-[#ffd7e2] transition">
              Letters in Bottles
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#baa494] -mt-0.5">
              handmade letters
            </div>
          </div>
        </button>

        {/* Action controls */}
        <div className="flex items-center gap-3 sm:gap-5 text-sm">
          {/* Scroll to The Beauty of Letters */}
          <button
            id="nav-art-letters-btn"
            onClick={() => {
              const el = document.getElementById('beauty-of-letters');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#baa494] hover:text-[#fedac5] transition cursor-pointer"
          >
            <span>The Art of Letters</span>
          </button>

          {/* Audio atmosphere toggle */}
          <button
            id="sound-toggle-btn"
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                sounds.soundEnabled = true;
                sounds.playOceanWave();
              }
            }}
            title={soundEnabled ? "Ambient sound on" : "Click to enable fairytale ocean audio"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#baa494] hover:text-[#faf6ed] bg-[#221c18]/70 border border-[#3c322b]/60 hover:border-[#baa494]/40 transition cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#c5ebd4]" />
                <span className="hidden sm:inline text-[#c5ebd4]">Ocean sounds</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#baa494]" />
                <span className="hidden sm:inline">Mute</span>
              </>
            )}
          </button>

          {/* Read section button */}
          <button
            id="nav-read-btn"
            onClick={onOpenRead}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs tracking-wide text-[#e9e1d5] hover:text-white bg-[#221c18]/80 hover:bg-[#2d2420] border border-[#403630] transition cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#fedac5]" />
            <span>Ocean Stream ({bottlesCount})</span>
          </button>

          {/* Cast button */}
          <button
            id="nav-write-btn"
            onClick={onOpenWrite}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs tracking-wide font-medium bg-[#fcf5e8] hover:bg-[#fff9ef] text-[#221b16] transition shadow-sm hover:shadow cursor-pointer"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Cast a Letter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
