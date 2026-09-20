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
import { MyLettersModal } from './components/MyLettersModal';
import { INITIAL_LETTERS } from './data/initialLetters';
import { Letter } from './types';
import { STAMPS } from './data/stamps';
import { sounds } from './utils/sound';
import { fetchLettersCollection, saveLetterToCollection, sendLetterToLovedOneApi, getMyAuthoredLetters, purgeTrialLetters, fetchPrivateLetter } from './utils/lettersApi';
import { Waves, Heart, Feather, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'letters_in_bottles_ocean_v1';

export default function App() {
  const [letters, setLetters] = useState<Letter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Strictly show human letters and purge trial dearest test letters
          const humanLetters = parsed.filter((l: Letter) => {
            const isSeedOrAi = l.id?.startsWith('bottle-seed') || l.authorType === 'ai';
            const isTrialDearest =
              l.recipientName?.toLowerCase().includes('dearest') ||
              l.title?.toLowerCase().includes('dearest') ||
              l.content?.toLowerCase().includes('dearest') ||
              l.id?.includes('trial');
            return !isSeedOrAi && !isTrialDearest;
          });
          if (humanLetters.length > 0) return humanLetters;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeModal, setActiveModal] = useState<
    'none' | 'write' | 'send-options' | 'gratitude' | 'read' | 'special-view' | 'my-letters'
  >('none');
  const [readInitialIndex, setReadInitialIndex] = useState<number>(0);
  const [authoredCount, setAuthoredCount] = useState<number>(() => getMyAuthoredLetters().length);
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

  // Fetch letters from the server collection so letters written by all random visitors appear
  useEffect(() => {
    let isMounted = true;
    async function loadOceanCollection() {
      // Purge any trial dearest letters permanently on load
      await purgeTrialLetters();
      if (isMounted) {
        setAuthoredCount(getMyAuthoredLetters().length);
      }

      const serverLetters = await fetchLettersCollection();
      if (isMounted && serverLetters) {
        // Strictly filter to ensure no AI letters and no trial dearest letters are shown
        const humanLetters = serverLetters.filter((l) => {
          const isSeedOrAi = l.id.startsWith('bottle-seed') || l.authorType === 'ai';
          const isDearestTrial =
            l.recipientName?.toLowerCase().includes('dearest') ||
            l.title?.toLowerCase().includes('dearest') ||
            l.content?.toLowerCase().includes('dearest') ||
            l.id?.includes('trial');
          return !isSeedOrAi && !isDearestTrial;
        });

        setLetters((localLetters) => {
          const combined = [...humanLetters];
          for (const local of localLetters) {
            if (!combined.some((l) => l.id === local.id)) {
              const isSeedOrAi = local.id.startsWith('bottle-seed') || local.authorType === 'ai';
              const isDearestTrial =
                local.recipientName?.toLowerCase().includes('dearest') ||
                local.title?.toLowerCase().includes('dearest') ||
                local.content?.toLowerCase().includes('dearest') ||
                local.id?.includes('trial');
              if (!isSeedOrAi && !isDearestTrial) {
                combined.unshift(local);
              }
            }
          }
          return combined;
        });
      }
    }
    loadOceanCollection();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check URL params for dedicated secret links (Option B: ?bottle=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bottleId = params.get('bottle');
      if (bottleId) {
        // Find existing or decode if encoded in query
        const found = letters.find((l) => l.id === bottleId);
        if (found) {
          const isDearestTrial =
            found.recipientName?.toLowerCase().includes('dearest') ||
            found.title?.toLowerCase().includes('dearest') ||
            found.content?.toLowerCase().includes('dearest') ||
            found.id?.includes('trial');
          if (isDearestTrial) {
            window.history.replaceState({}, '', window.location.pathname);
            return;
          }
          setSpecialViewingLetter(found);
          setActiveModal('special-view');
        } else {
          const encoded = params.get('data');
          if (encoded) {
            try {
              const decodedLetter = JSON.parse(decodeURIComponent(escape(atob(encoded))));
              const isDearestTrial =
                decodedLetter?.recipientName?.toLowerCase().includes('dearest') ||
                decodedLetter?.title?.toLowerCase().includes('dearest') ||
                decodedLetter?.content?.toLowerCase().includes('dearest') ||
                decodedLetter?.id?.includes('trial');
              if (isDearestTrial) {
                window.history.replaceState({}, '', window.location.pathname);
                return;
              }
              setSpecialViewingLetter(decodedLetter);
              setActiveModal('special-view');
            } catch {
              // fallback
            }
          } else {
            // Load private sealed letter directly from server archive for loved one
            fetchPrivateLetter(bottleId).then((privateLetter) => {
              if (privateLetter) {
                const isDearestTrial =
                  privateLetter.recipientName?.toLowerCase().includes('dearest') ||
                  privateLetter.title?.toLowerCase().includes('dearest') ||
                  privateLetter.content?.toLowerCase().includes('dearest') ||
                  privateLetter.id?.includes('trial');
                if (!isDearestTrial) {
                  setSpecialViewingLetter(privateLetter);
                  setActiveModal('special-view');
                }
              }
            });
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

  // Show a random letter whenever people select "Read a letter"
  const handleOpenRandomRead = () => {
    sounds.playOceanWave();
    if (letters.length > 0) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      setReadInitialIndex(randomIndex);
    }
    setActiveModal('read');
  };

  // Show specific letter (e.g. when selecting a specific envelope card)
  const handleOpenReadByIndex = (index: number) => {
    sounds.playOceanWave();
    setReadInitialIndex(index);
    setActiveModal('read');
  };

  const handleProceedToSend = (draft: Partial<Letter>) => {
    setCurrentDraft(draft);
    setActiveModal('send-options');
  };

  // Save the letter written by people into the ocean collection
  const handleCastToOcean = (newLetter: Letter) => {
    setLetters((prev) => [newLetter, ...prev]);
    setLastSentLetter(newLetter);
    setSecretLinkUrl('');
    setActiveModal('gratitude');
    // Persist to server collection
    saveLetterToCollection(newLetter);
    setAuthoredCount(getMyAuthoredLetters().length + 1);
  };

  const handleSendToSpecialSomeone = async (newLetter: Letter, paymentTier: number) => {
    // Letters sent to loved ones are strictly private and NEVER added to the public ocean collection
    setLastSentLetter(newLetter);

    // Generate dedicated secret link with encoded payload for loved ones
    const baseUrl = window.location.origin + window.location.pathname;
    const jsonStr = JSON.stringify(newLetter);
    const encodedPayload = btoa(unescape(encodeURIComponent(jsonStr)));
    const fullSecretLink = `${baseUrl}?bottle=${newLetter.id}&data=${encodedPayload}`;

    setSecretLinkUrl(fullSecretLink);
    setActiveModal('gratitude');

    // Dispatch directly to loved one's email address & record payment
    const sendResult = await sendLetterToLovedOneApi(newLetter, fullSecretLink, paymentTier);
    setAuthoredCount(getMyAuthoredLetters().length + 1);

    // If direct mailto link is returned, trigger it so email is dispatched directly
    if (sendResult?.mailtoUrl) {
      try {
        const mailWin = window.open(sendResult.mailtoUrl, '_blank');
        if (!mailWin) {
          window.location.href = sendResult.mailtoUrl;
        }
      } catch {
        // popup fallback safe
      }
    }
  };

  const handleLetterDeleted = (letterId: string) => {
    setLetters((prev) => prev.filter((l) => l.id !== letterId));
    setAuthoredCount(getMyAuthoredLetters().length);
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
        onOpenRead={handleOpenRandomRead}
        onOpenMyLetters={() => setActiveModal('my-letters')}
        onScrollToHero={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        bottlesCount={letters.length}
        myLettersCount={authoredCount}
      />

      {/* Hero Section matching screenshot */}
      <main className="flex-1">
        <Hero
          onOpenWrite={handleOpenWrite}
          onOpenRead={handleOpenRandomRead}
          bottlesCount={letters.length}
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
                Each letter is sealed inside a vintage envelope. Click any envelope to uncork, or draw a random bottle.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="ocean-read-all-btn"
                onClick={handleOpenRandomRead}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-[#e5d8cb] hover:text-white bg-[#221a16] border border-[#3f3229] hover:border-[#fedac5]/40 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#ffd5df]" />
                <span>Draw Random Letter</span>
              </button>
            </div>
          </div>

          {/* Envelopes Grid - strictly shows sealed envelopes without revealing words */}
          {letters.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-lg bg-[#181311] border border-[#382b24] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#fedac5]/10 border border-[#fedac5]/20 flex items-center justify-center text-[#fedac5] mb-4 text-xl">
                🌊
              </div>
              <h3 className="font-serif-vintage text-xl sm:text-2xl text-[#faf6ed]">
                The ocean is quiet and waiting for real human hearts
              </h3>
              <p className="text-xs sm:text-sm text-[#b19f90] max-w-md mt-2 leading-relaxed font-light">
                No AI letters drift in this sea. We only display letters written by real people.
                Be the first someone to cast a handwritten letter into the waters.
              </p>
              <button
                id="cast-first-ocean-btn"
                onClick={handleOpenWrite}
                className="mt-5 px-6 py-2.5 rounded-full bg-[#fedac5] hover:bg-[#ffe4d4] text-[#221a15] text-xs font-medium tracking-wide flex items-center gap-2 shadow transition cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Cast the First Letter 🖋️</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {letters.slice(0, 3).map((letter, idx) => (
                <EnvelopeCard
                  key={letter.id}
                  letter={letter}
                  index={idx}
                  onClick={() => handleOpenReadByIndex(idx)}
                />
              ))}
            </div>
          )}
        </section>

        {/* The Quiet Beauty of Writing Letters (Placed at the end) */}
        <BeautyOfLetters />
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
            onDeleteLetter={handleLetterDeleted}
          />
        )}

        {/* My Authored Letters Manager & Secure Deletion Modal */}
        {activeModal === 'my-letters' && (
          <MyLettersModal
            allLetters={letters}
            onClose={() => setActiveModal('none')}
            onViewLetter={(letter) => {
              const idx = letters.findIndex((l) => l.id === letter.id);
              setReadInitialIndex(idx >= 0 ? idx : 0);
              setActiveModal('read');
            }}
            onLetterDeleted={handleLetterDeleted}
            onOpenWrite={handleOpenWrite}
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
