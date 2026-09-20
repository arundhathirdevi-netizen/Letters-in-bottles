import React from 'react';
import { Feather, FolderHeart } from 'lucide-react';

interface NavbarProps {
  onOpenWrite?: () => void;
  onOpenRead?: () => void;
  onOpenMyLetters: () => void;
  onScrollToHero: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  bottlesCount?: number;
  myLettersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMyLetters,
  onScrollToHero,
  myLettersCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-4 transition-all duration-300 bg-[#141210]/70 backdrop-blur-md border-b border-[#3a322c]/50">
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
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          {/* Scroll to The Beauty of Letters */}
          <button
            id="nav-art-letters-btn"
            onClick={() => {
              const el = document.getElementById('beauty-of-letters');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#baa494] hover:text-[#fedac5] transition cursor-pointer"
          >
            <span>The Art of Letters</span>
          </button>

          {/* My Authored Letters button with delete management */}
          <button
            id="nav-my-letters-btn"
            onClick={onOpenMyLetters}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs tracking-wide text-[#fedac5] hover:text-white bg-[#2c1e19]/90 hover:bg-[#3d2922] border border-[#52372d] transition cursor-pointer"
            title="Manage and delete letters you have written"
          >
            <FolderHeart className="w-3.5 h-3.5 text-[#ffd5df]" />
            <span>My Letters{myLettersCount > 0 ? ` (${myLettersCount})` : ''}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
