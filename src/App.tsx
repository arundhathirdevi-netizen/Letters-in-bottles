import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LetterEditor } from './components/LetterEditor';
import { SendingOptionsModal } from './components/SendingOptionsModal';
import { GratitudeScreen } from './components/GratitudeScreen';
import { ReadSection } from './components/ReadSection';
import { SpecialLetterViewer } from './components/SpecialLetterViewer';
import { EnvelopeCard } from './components/EnvelopeCard';
import { BeautyOfLetters } from './components/BeautyOfLetters';
import { INITIAL_LETTERS } from './data/initialLetters';
import { Letter } from './types';
import { STAMPS } from './data/stamps';
import { sounds } from './utils/sound';
import { Waves, Heart, Feather, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'letters_in_bottles_ocean_v1';

export default function App() {
  const [letters, setLetters] = useState<Letter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_LETTERS;
  });

  const [activeModal, setActiveModal] = useState<
    'none' | 'write' | 'send-options' | 'gratitude' | 'read' | 'special-view'
  >('none');
  const [readInitialIndex, setReadInitialIndex] = useState<number>(0);
  const [currentDraft, setCurrentDraft] = useState<Partial<Letter>>({});
  const [lastSentLetter, setLastSentLetter] = useState<Letter | null>(null);
  const [secretLinkUrl, setSecretLinkUrl] = useState<string>('');
  const [specialViewingLetter, setSpecialViewingLetter] = useState<Letter | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
    } catch {
      // LocalStorage quota safe
    }
  }, [letters]);

  // Check URL params for dedicated secret links (Option B: ?bottle=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bottleId = params.get('bottle');
      if (bottleId) {
        // Find existing or decode if encoded in query
        const found = letters.find((l) => l.id === bottleId);
        if (found) {
          setSpecialViewingLetter(found);
          setActiveModal('special-view');
        } else {
          const encoded = params.get('data');
          if (encoded) {
            try {
              const decodedLetter = JSON.parse(decodeURIComponent(escape(atob(encoded))));
              setSpecialViewingLetter(decodedLetter);
              setActiveModal('special-view');
            } catch {
              // fallback
            }
          }
        }
      }
    } catch {
      // url param safe
    }
  }, [letters]);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.soundEnabled = nextState;
  };

  const handleOpenWrite = () => {
    sounds.playPaperRustle();
    setCurrentDraft({});
    setActiveModal('write');
  };

  const handleOpenRead = (index = 0) => {
    sounds.playOceanWave();
    setReadInitialIndex(index);
    setActiveModal('read');
  };

  const handleProceedToSend = (draft: Partial<Letter>) => {
    setCurrentDraft(draft);
    setActiveModal('send-options');
  };

  const handleCastToOcean = (newLetter: Letter) => {
    setLetters((prev) => [newLetter, ...prev]);
    setLastSentLetter(newLetter);
    setSecretLinkUrl('');
    setActiveModal('gratitude');
  };

  const handleSendToSpecialSomeone = (newLetter: Letter) => {
    setLetters((prev) => [newLetter, ...prev]);
    setLastSentLetter(newLetter);

    // Generate dedicated secret link with encoded payload for loved ones
    const baseUrl = window.location.origin + window.location.pathname;
    const jsonStr = JSON.stringify(newLetter);
    const encodedPayload = btoa(unescape(encodeURIComponent(jsonStr)));
    const fullSecretLink = `${baseUrl}?bottle=${newLetter.id}&data=${encodedPayload}`;

    setSecretLinkUrl(fullSecretLink);
    setActiveModal('gratitude');
  };

  const handleReplyToLetter = (inReplyTo: Letter) => {
    sounds.playPaperRustle();
    setCurrentDraft({
      title: `In reply to: "${inReplyTo.title || 'a letter from the drift'}"`,
      content: `Dear ${inReplyTo.senderName || 'friend across the waves'},\n\nI found your bottle drifting along the shoreline... `,
      paperTexture: inReplyTo.paperTexture === 'pink' ? 'peach' : 'pink',
      stampId: 'baby-rose',
    });
    setActiveModal('write');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#12100e] text-[#f7f4ed]">
      {/* Top Navbar */}
      <Navbar
        onOpenWrite={handleOpenWrite}
        onOpenRead={handleOpenRead}
        onScrollToHero={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        bottlesCount={letters.length}
      />

      {/* Hero Section matching screenshot */}
      <main className="flex-1">
        <Hero
          onOpenWrite={handleOpenWrite}
          onOpenRead={handleOpenRead}
          bottlesCount={letters.length}
        />

        {/* 2nd Page / Chapter: The Quiet Beauty of Writing Letters */}
        <BeautyOfLetters
          onOpenWrite={handleOpenWrite}
          onOpenRead={() => handleOpenRead(0)}
        />

        {/* Digital Ocean Drifting Letters Carousel / Preview Section */}
        <section className="relative py-16 px-6 max-w-6xl mx-auto border-t border-[#29221d]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#fedac5] font-light">
                Digital Ocean Currents
              </span>
              <h2 className="font-serif-vintage text-2xl sm:text-3xl text-[#faf6ed] mt-1">
                Bottles currently washing ashore
              </h2>
              <p className="text-xs sm:text-sm text-[#bcaaa0] mt-1 font-light">
                Each letter is sealed inside a vintage envelope. Click any envelope to uncork and read.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="ocean-read-all-btn"
                onClick={() => handleOpenRead(0)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-[#e5d8cb] hover:text-white bg-[#221a16] border border-[#3f3229] hover:border-[#fedac5]/40 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#ffd5df]" />
                <span>Open Reader View</span>
              </button>
            </div>
          </div>

          {/* Envelopes Grid - strictly shows sealed envelopes without revealing words */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {letters.slice(0, 3).map((letter, idx) => (
              <EnvelopeCard
                key={letter.id}
                letter={letter}
                index={idx}
                onClick={() => handleOpenRead(idx)}
              />
            ))}
          </div>

          {/* Fairytale Ocean Bottom Bar */}
          <div className="mt-12 p-8 rounded-lg bg-[#191412] border border-[#322721] text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#c5ebd4]/10 border border-[#c5ebd4]/20 flex items-center justify-center text-[#c5ebd4] mb-3">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="font-serif-vintage text-xl sm:text-2xl text-[#faf6ed]">
              Every letter is an act of gentle courage.
            </h3>
            <p className="text-xs sm:text-sm text-[#b19f90] max-w-lg mt-2 leading-relaxed font-light">
              Cast your words into the digital tide for free, or seal an enchanted custom envelope with a secret link for someone special.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <button
                id="footer-cast-letter-btn"
                onClick={handleOpenWrite}
                className="px-6 py-2.5 rounded-full bg-[#f9f4e8] hover:bg-white text-[#221a15] text-xs font-medium tracking-wide flex items-center gap-2 shadow transition cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Cast a Letter 🖋️</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2a221d] text-center text-xs text-[#8c7b6e]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-vintage text-sm text-[#faf6ed]">Letters in Bottles</span>
            <span>•</span>
            <span className="text-[#a49182]">handmade letters for wandering hearts</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#8c7b6e]">
            <span>Baby Pink • Peach • Ocean Mint</span>
            <span>•</span>
            <span className="text-[#c5ebd4]">Digital Ocean Free Drift</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* Interactive Letter Writing Editor */}
        {activeModal === 'write' && (
          <LetterEditor
            onClose={() => setActiveModal('none')}
            onProceedToSend={handleProceedToSend}
          />
        )}

        {/* Sending Options: Option A (Ocean) vs Option B (Special Someone) */}
        {activeModal === 'send-options' && (
          <SendingOptionsModal
            letterDraft={currentDraft}
            onClose={() => setActiveModal('write')}
            onCastToOcean={handleCastToOcean}
            onSendToSpecialSomeone={handleSendToSpecialSomeone}
          />
        )}

        {/* Post-Send Gratitude Screen */}
        {activeModal === 'gratitude' && lastSentLetter && (
          <GratitudeScreen
            sentLetter={lastSentLetter}
            secretLinkUrl={secretLinkUrl}
            onWriteAnother={handleOpenWrite}
            onReturnToOcean={() => setActiveModal('none')}
            onViewSpecialLetter={(letter) => {
              setSpecialViewingLetter(letter);
              setActiveModal('special-view');
            }}
          />
        )}

        {/* Read Section */}
        {activeModal === 'read' && (
          <ReadSection
            letters={letters}
            initialIndex={readInitialIndex}
            onClose={() => setActiveModal('none')}
            onReply={handleReplyToLetter}
            onWriteNew={handleOpenWrite}
          />
        )}

        {/* Special Letter Sealed Envelope Viewer */}
        {activeModal === 'special-view' && specialViewingLetter && (
          <SpecialLetterViewer
            letter={specialViewingLetter}
            onClose={() => setActiveModal('none')}
            onWriteBack={handleOpenWrite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
