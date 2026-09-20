import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Eye, Heart, Mail, Waves, AlertTriangle, Feather, Check } from 'lucide-react';
import { Letter, AuthoredLetterRecord } from '../types';
import { deleteLetterFromCollection, getMyAuthoredLetters } from '../utils/lettersApi';
import { sounds } from '../utils/sound';

interface MyLettersModalProps {
  allLetters: Letter[];
  onClose: () => void;
  onViewLetter: (letter: Letter) => void;
  onLetterDeleted: (letterId: string) => void;
  onOpenWrite: () => void;
}

export const MyLettersModal: React.FC<MyLettersModalProps> = ({
  allLetters,
  onClose,
  onViewLetter,
  onLetterDeleted,
  onOpenWrite,
}) => {
  const [authoredRecords, setAuthoredRecords] = useState<AuthoredLetterRecord[]>(() =>
    getMyAuthoredLetters()
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Match local authored records with actual letters in memory/collection
  const myLetters = authoredRecords.map((rec) => {
    const matched = allLetters.find((l) => l.id === rec.id);
    return {
      record: rec,
      letter: matched,
    };
  });

  const handleDelete = async (id: string, token: string) => {
    setIsDeleting(true);
    sounds.playPaperRustle();
    const result = await deleteLetterFromCollection(id, token);
    setIsDeleting(false);
    setConfirmDeleteId(null);

    if (result.success) {
      setAuthoredRecords((prev) => prev.filter((r) => r.id !== id));
      onLetterDeleted(id);
      setNotification('Your letter was withdrawn and dissolved from the ocean.');
      setTimeout(() => setNotification(null), 3500);
    } else {
      setNotification(result.message || 'Failed to delete letter.');
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl my-auto bg-[#181311] border border-[#3e3028] rounded-xl p-6 sm:p-8 shadow-2xl text-[#faf6ed]">
        {/* Close Button */}
        <button
          id="close-my-letters-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-[#baa494] hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#fedac5] font-light">
              Author Management
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3d2720] text-[#fedac5] border border-[#5a3a2e]">
              Author Only
            </span>
          </div>
          <h2 className="font-serif-vintage text-2xl sm:text-3xl text-[#faf6ed]">
            Letters You&apos;ve Written
          </h2>
          <p className="text-xs sm:text-sm text-[#bcaaa0] mt-1 font-light leading-relaxed">
            Only you can delete letters you have written. You can withdraw any letter from the digital ocean whenever you wish.
          </p>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-3 rounded-lg bg-[#2c1d1d] border border-[#78393d] text-xs text-[#fedac5] flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#c5ebd4] shrink-0" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List of Letters */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {myLetters.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-[#1f1714] border border-[#382b24]">
              <div className="w-10 h-10 rounded-full bg-[#fedac5]/10 border border-[#fedac5]/20 flex items-center justify-center text-[#fedac5] mx-auto mb-3">
                <Feather className="w-4 h-4" />
              </div>
              <h3 className="font-serif-vintage text-lg text-[#faf6ed]">
                You haven&apos;t written any letters yet
              </h3>
              <p className="text-xs text-[#9d897c] mt-1 max-w-sm mx-auto font-light leading-relaxed">
                When you cast a letter into the ocean or seal one for a loved one, it will appear here so you can manage or delete it at any time.
              </p>
              <button
                id="my-letters-write-btn"
                onClick={() => {
                  onClose();
                  onOpenWrite();
                }}
                className="mt-4 px-5 py-2 rounded-full bg-[#f9f4e8] hover:bg-white text-[#221a15] text-xs font-medium tracking-wide transition cursor-pointer"
              >
                Write Your First Letter 🖋️
              </button>
            </div>
          ) : (
            myLetters.map(({ record, letter }) => {
              const displayTitle = letter?.title || record.title || 'A gentle whisper';
              const displayDate = letter?.date || record.date;
              const isSpecial = letter?.isSpecial;

              return (
                <div
                  key={record.id}
                  className="p-4 rounded-lg bg-[#201815] border border-[#3a2c25] hover:border-[#523e34] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif-vintage text-base text-[#faf6ed] truncate">
                        {displayTitle}
                      </span>
                      {isSpecial ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#ffd5df] bg-[#3a1d23] px-2 py-0.5 rounded-full border border-[#5e2f38] shrink-0">
                          <Mail className="w-2.5 h-2.5" />
                          <span>Loved One</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#c5ebd4] bg-[#1a2d21] px-2 py-0.5 rounded-full border border-[#2b4c37] shrink-0">
                          <Waves className="w-2.5 h-2.5" />
                          <span>Ocean Drift</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#9e8a7d]">
                      <span>{displayDate}</span>
                      {letter && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#fedac5]">
                            <Heart className="w-3 h-3 text-[#fca5a5] fill-current" />
                            <span>{letter.likesCount || 1} warmth</span>
                          </span>
                        </>
                      )}
                    </div>

                    {letter?.content && (
                      <p className="text-xs text-[#847265] mt-1.5 line-clamp-1 italic font-serif">
                        &ldquo;{letter.content}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {letter && (
                      <button
                        id={`view-my-letter-${record.id}`}
                        onClick={() => {
                          onClose();
                          onViewLetter(letter);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#2c221e] hover:bg-[#3d2f2a] text-[#faf6ed] text-xs flex items-center gap-1.5 transition cursor-pointer border border-[#483730]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#fedac5]" />
                        <span>Read</span>
                      </button>
                    )}

                    <button
                      id={`delete-my-letter-${record.id}`}
                      onClick={() => setConfirmDeleteId(record.id)}
                      className="px-3 py-1.5 rounded-full bg-[#3d1a1d] hover:bg-[#522126] text-[#fca5a5] text-xs flex items-center gap-1.5 transition cursor-pointer border border-[#6b2c32]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {confirmDeleteId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-5 rounded-lg bg-[#2a1719] border border-[#752a32] text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-[#521c22] text-[#fca5a5] shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif-vintage text-base text-[#faf6ed]">
                    Withdraw and delete this letter?
                  </h4>
                  <p className="text-xs text-[#d1b5b8] mt-1 leading-relaxed font-light">
                    Only you can delete this letter because you are the author. Once dissolved, this letter will be permanently erased from the ocean collection and mailbox archives.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      id="confirm-delete-author-btn"
                      disabled={isDeleting}
                      onClick={() => {
                        const rec = authoredRecords.find((r) => r.id === confirmDeleteId);
                        if (rec) handleDelete(rec.id, rec.deleteToken);
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <span>Dissolving letter...</span>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Permanently Delete 🗑️</span>
                        </>
                      )}
                    </button>
                    <button
                      id="cancel-delete-author-btn"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3.5 py-1.5 rounded-full text-xs text-[#baa494] hover:text-white transition cursor-pointer"
                    >
                      Keep Letter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#2e231c] flex items-center justify-between text-xs text-[#806f63]">
          <span>Security: Protected by your browser&apos;s author key.</span>
          <button
            onClick={onClose}
            className="text-[#fedac5] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};
