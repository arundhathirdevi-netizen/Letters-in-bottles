import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Heart, Sparkles, Feather, Compass, CornerDownRight, Shuffle, Trash2, AlertTriangle } from 'lucide-react';
import { Letter } from '../types';
import { STAMPS } from '../data/stamps';
import { sounds } from '../utils/sound';
import { likeLetterInCollection, isMyAuthoredLetter, deleteLetterFromCollection } from '../utils/lettersApi';

interface ReadSectionProps {
  letters: Letter[];
  onClose: () => void;
  onReply: (inReplyTo: Letter) => void;
  onWriteNew: () => void;
  onDeleteLetter?: (letterId: string) => void;
  initialIndex?: number;
}

export const ReadSection: React.FC<ReadSectionProps> = ({
  letters,
  onClose,
  onReply,
  onWriteNew,
  onDeleteLetter,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [likedLetters, setLikedLetters] = useState<Record<string, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    letters.forEach((l) => {
      map[l.id] = l.likesCount || 12;
    });
    return map;
  });

  // Keep index synchronized whenever a new random index is selected
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < letters.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, letters.length]);

  if (letters.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      >
        <div className="relative w-full max-w-lg bg-[#1b1614] border border-[#3e322a] rounded-xl p-8 text-center text-[#faf6ed] shadow-2xl">
          <button
            id="close-empty-read-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-[#baa494] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-full bg-[#fedac5]/15 border border-[#fedac5]/30 flex items-center justify-center mx-auto mb-5 text-2xl">
            🌊
          </div>
          <h3 className="font-serif-vintage text-2xl sm:text-3xl text-[#faf6ed] mb-3">
            The ocean is quiet right now
          </h3>
          <p className="text-sm text-[#baa494] leading-relaxed mb-6 font-light">
            We preserve this digital ocean purely for human hearts — no AI-generated letters are kept here.
            Be the first someone to write a genuine letter and release it to the tide!
          </p>
          <div className="flex justify-center gap-3">
            <button
              id="empty-read-write-btn"
              onClick={onWriteNew}
              className="px-6 py-2.5 rounded-full bg-[#fedac5] hover:bg-[#ffe4d4] text-[#241a15] font-medium text-sm flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Feather className="w-4 h-4" />
              <span>Cast the First Letter 🖋️</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentLetter = letters[currentIndex % letters.length] || letters[0];
  const stamp = STAMPS.find((s) => s.id === currentLetter?.stampId) || STAMPS[0];

  // Draw another random letter from the ocean collection
  const handleNextLetter = () => {
    sounds.playPaperRustle();
    if (letters.length <= 1) return;
    let nextIndex = Math.floor(Math.random() * letters.length);
    if (nextIndex === currentIndex) {
      nextIndex = (currentIndex + 1) % letters.length;
    }
    setCurrentIndex(nextIndex);
  };

  const handleToggleLike = (id: string) => {
    sounds.playStampAffix();
    const isLiked = likedLetters[id];
    setLikedLetters((prev) => ({
      ...prev,
      [id]: !isLiked,
    }));
    setLikesCountMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + (isLiked ? -1 : 1),
    }));
    if (!isLiked) {
      likeLetterInCollection(id);
    }
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

  const isAuthor = isMyAuthoredLetter(currentLetter.id);

  const handleDeleteCurrentLetter = async () => {
    setIsDeleting(true);
    sounds.playPaperRustle();
    const res = await deleteLetterFromCollection(currentLetter.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);

    if (res.success) {
      if (onDeleteLetter) {
        onDeleteLetter(currentLetter.id);
      }
      setDeleteNotice('Your letter has been withdrawn and dissolved from the ocean.');
      setTimeout(() => {
        setDeleteNotice(null);
        if (letters.length <= 1) {
          onClose();
        } else {
          setCurrentIndex((prev) => Math.max(0, Math.min(prev, letters.length - 2)));
        }
      }, 1200);
    } else {
      setDeleteNotice(res.message || 'Only the author who wrote this letter can delete it.');
      setTimeout(() => setDeleteNotice(null), 3000);
    }
  };

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
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#c5ebd4]" />
              <span className="font-serif-vintage text-base sm:text-lg text-[#faf6ed]">
                Bottle No. {currentIndex + 1} of {letters.length}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#fedac5] bg-[#29201a] px-2.5 py-0.5 rounded-full border border-[#48372b]">
              <Sparkles className="w-3 h-3 text-[#ffd5df]" />
              <span>Drawn at random from the ocean</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#c5ebd4] bg-[#192b20] px-2 py-0.5 rounded-full border border-[#2e523c]">
              <Heart className="w-3 h-3 text-[#c5ebd4]" />
              <span>Written by someone • Pure human words</span>
            </span>
            {isAuthor && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#ffd5df] bg-[#3d1e23] px-2.5 py-0.5 rounded-full border border-[#692d37]">
                <Feather className="w-3 h-3 text-[#ffd5df]" />
                <span>You wrote this letter</span>
              </span>
            )}
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

              <div className="flex items-center gap-2">
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

                {/* Author-only delete letter button */}
                {isAuthor && (
                  <button
                    id="delete-my-letter-reader-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#fde8e8] hover:bg-[#fbd5d5] text-[#9b1c1c] border border-[#f8b4b4] transition cursor-pointer shadow-xs"
                    title="Only you can delete this letter because you wrote it"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete My Letter 🗑️</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Delete notification notice */}
        {deleteNotice && (
          <div className="w-full max-w-2xl mt-3 p-3 rounded-lg bg-[#2b191c] border border-[#6f2930] text-xs text-[#fedac5] text-center">
            {deleteNotice}
          </div>
        )}

        {/* Author Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl mt-4 p-5 rounded-lg bg-[#221617] border border-[#6b2c32] shadow-xl text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-[#521c22] text-[#fca5a5] shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif-vintage text-lg text-[#faf6ed]">
                    Withdraw your letter from the ocean?
                  </h4>
                  <p className="text-xs text-[#d1b5b8] mt-1 leading-relaxed font-light">
                    Only you (the author) can delete this letter. Once deleted, it will dissolve permanently from the ocean collection and cannot be recovered by anyone.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      id="confirm-delete-reader-btn"
                      disabled={isDeleting}
                      onClick={handleDeleteCurrentLetter}
                      className="px-4 py-2 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <span>Dissolving letter...</span>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Permanently Delete Letter 🗑️</span>
                        </>
                      )}
                    </button>
                    <button
                      id="cancel-delete-reader-btn"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3.5 py-2 rounded-full text-xs text-[#baa494] hover:text-white transition cursor-pointer"
                    >
                      Cancel & Keep Letter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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

          {/* Draw another random letter from the ocean collection */}
          <motion.button
            id="read-next-letter-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNextLetter}
            className="px-6 py-2.5 rounded-full bg-[#f9f4e8] hover:bg-[#fffdf9] text-[#221a15] font-medium text-sm tracking-wide flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#8a5340]" />
            <span>Draw Another Random Bottle</span>
            <span className="text-xs">🌊</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
