import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Waves, Heart, Sparkles, Check, Link as LinkIcon, DollarSign, Lock, ShieldCheck } from 'lucide-react';
import { Letter } from '../types';
import { sounds } from '../utils/sound';

interface SendingOptionsModalProps {
  letterDraft: Partial<Letter>;
  onClose: () => void;
  onCastToOcean: (letter: Letter) => void;
  onSendToSpecialSomeone: (letter: Letter, paymentTier: number) => void;
}

export const SendingOptionsModal: React.FC<SendingOptionsModalProps> = ({
  letterDraft,
  onClose,
  onCastToOcean,
  onSendToSpecialSomeone,
}) => {
  const [selectedOption, setSelectedOption] = useState<'free' | 'paid'>('free');
  const [recipientName, setRecipientName] = useState('');
  const [envelopeColor, setEnvelopeColor] = useState<'pink' | 'peach' | 'mint' | 'cream'>('pink');
  const [waxSeal, setWaxSeal] = useState<'heart' | 'rose' | 'shell' | 'star'>('heart');
  const [paymentAmount, setPaymentAmount] = useState<1 | 2>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleSendFree = () => {
    sounds.playOceanWave();
    const finalLetter: Letter = {
      id: 'ocean-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: letterDraft.title || 'Whisper in a bottle',
      content: letterDraft.content || '',
      senderName: letterDraft.senderName || 'An anonymous stranger',
      location: letterDraft.location || 'Somewhere across the ocean',
      date: 'Floating today',
      stampId: letterDraft.stampId || 'baby-rose',
      fontStyle: letterDraft.fontStyle || 'cursive',
      paperTexture: letterDraft.paperTexture || 'cream',
      isSpecial: false,
      likesCount: 1,
    };
    onCastToOcean(finalLetter);
  };

  const handleSendPaid = () => {
    setIsProcessingPayment(true);
    sounds.playPaperRustle();
    setTimeout(() => {
      setIsProcessingPayment(false);
      const finalLetter: Letter = {
        id: 'secret-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        title: letterDraft.title || 'A sealed letter for you',
        content: letterDraft.content || '',
        senderName: letterDraft.senderName || 'Someone who cares',
        recipientName: recipientName.trim() || 'My Dearest',
        location: letterDraft.location || 'From a fond heart',
        date: 'Sealed today with care',
        stampId: letterDraft.stampId || 'baby-rose',
        fontStyle: letterDraft.fontStyle || 'cursive',
        paperTexture: letterDraft.paperTexture || 'pink',
        isSpecial: true,
        envelopeColor,
        waxSeal,
        likesCount: 1,
      };
      onSendToSpecialSomeone(finalLetter, paymentAmount);
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl my-auto bg-[#1a1512] border border-[#3e322a] rounded-lg p-6 sm:p-8 shadow-2xl text-[#faf6ed]">
        {/* Close Button */}
        <button
          id="close-send-options-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-[#baa494] hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#fedac5] font-light">
            Choose Your Destination
          </span>
          <h2 className="font-serif-vintage text-3xl text-[#faf6ed] mt-1">
            Where shall your letter drift?
          </h2>
          <p className="text-sm text-[#baa494] mt-1">
            Choose whether to release it anonymously into the digital ocean or seal a dedicated secret link for someone special.
          </p>
        </div>

        {/* The Two Main Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Option A (Free): Cast into the Digital Ocean */}
          <div
            id="option-ocean-card"
            onClick={() => setSelectedOption('free')}
            className={`p-5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
              selectedOption === 'free'
                ? 'bg-[#251e19] border-[#c5ebd4] ring-1 ring-[#c5ebd4]'
                : 'bg-[#201a16] border-[#382e26] hover:border-[#4d3f35]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[#c5ebd4]/15 border border-[#c5ebd4]/30 flex items-center justify-center text-[#c5ebd4]">
                  <Waves className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#c5ebd4]/20 text-[#c5ebd4]">
                  Free
                </span>
              </div>
              <h3 className="font-serif-vintage text-xl text-[#faf6ed] font-medium">
                Option A: Cast into the Digital Ocean 🌊
              </h3>
              <p className="text-xs text-[#baa494] mt-2 leading-relaxed">
                Sends anonymously to a random stranger in the world. Your letter will drift softly through the open waters for anyone wandering the shore to find and read.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#382d25] flex items-center gap-2 text-xs text-[#c5ebd4]">
              <Check className="w-4 h-4" />
              <span>Immediate anonymous drift</span>
            </div>
          </div>

          {/* Option B (Paid - $1.00 or $2.00): Send to a Special Someone */}
          <div
            id="option-special-card"
            onClick={() => setSelectedOption('paid')}
            className={`p-5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
              selectedOption === 'paid'
                ? 'bg-[#291c1c] border-[#ffd5df] ring-1 ring-[#ffd5df]'
                : 'bg-[#201a16] border-[#382e26] hover:border-[#4d3f35]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[#ffd5df]/15 border border-[#ffd5df]/30 flex items-center justify-center text-[#ffd5df]">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ffd5df]/20 text-[#ffd5df]">
                  $1.00 or $2.00
                </span>
              </div>
              <h3 className="font-serif-vintage text-xl text-[#faf6ed] font-medium">
                Option B: Send to a Special Someone 💌💖
              </h3>
              <p className="text-xs text-[#baa494] mt-2 leading-relaxed">
                Generates a dedicated secret link & custom envelope for a loved one. The small fee goes directly to support the creator&apos;s bank account and keep the ocean floating.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#382d25] flex items-center gap-2 text-xs text-[#ffd5df]">
              <Sparkles className="w-4 h-4" />
              <span>Custom wax seal & private link</span>
            </div>
          </div>
        </div>

        {/* Detailed Config for Option B when selected */}
        {selectedOption === 'paid' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-5 rounded-md bg-[#231a19] border border-[#483435] text-left"
          >
            <h4 className="font-serif-vintage text-lg text-[#ffd5df] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Customize the Secret Envelope</span>
            </h4>

            {/* Recipient's Name */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-[#baa494] mb-1.5 font-medium">
                Recipient&apos;s Name / Moniker
              </label>
              <input
                id="recipient-name-input"
                type="text"
                placeholder="e.g. For Eleanor, My Dearest, Darling..."
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-[#191211] border border-[#523d3e] focus:border-[#ffd5df] outline-none text-sm text-[#faf6ed] placeholder:text-[#8f797a]"
              />
            </div>

            {/* Custom Envelope Colors */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-[#baa494] mb-1.5 font-medium">
                Envelope Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'pink', label: 'Baby Pink', color: 'bg-[#ffd5df] text-[#422129]' },
                  { id: 'peach', label: 'Honey Peach', color: 'bg-[#fedac5] text-[#42291d]' },
                  { id: 'mint', label: 'Sea Mint', color: 'bg-[#c5ebd4] text-[#1a3827]' },
                  { id: 'cream', label: 'Soft Cream', color: 'bg-[#fbf7ee] text-[#3d3228]' },
                ].map((env) => (
                  <button
                    key={env.id}
                    type="button"
                    id={`envelope-color-${env.id}`}
                    onClick={() => setEnvelopeColor(env.id as typeof envelopeColor)}
                    className={`py-1.5 px-2 rounded text-xs font-medium border transition cursor-pointer flex items-center justify-center gap-1 ${
                      env.color
                    } ${
                      envelopeColor === env.id
                        ? 'ring-2 ring-white border-transparent font-bold'
                        : 'opacity-70 hover:opacity-100 border-transparent'
                    }`}
                  >
                    {envelopeColor === env.id && <Check className="w-3 h-3" />}
                    <span>{env.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wax Seal Symbol */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-[#baa494] mb-1.5 font-medium">
                Wax Seal Stamp Impression
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'heart', label: 'Heart 💖' },
                  { id: 'rose', label: 'Rose 🌹' },
                  { id: 'shell', label: 'Shell 🐚' },
                  { id: 'star', label: 'Star ✨' },
                ].map((seal) => (
                  <button
                    key={seal.id}
                    type="button"
                    id={`wax-seal-${seal.id}`}
                    onClick={() => setWaxSeal(seal.id as typeof waxSeal)}
                    className={`py-1.5 px-2 rounded text-xs transition cursor-pointer border ${
                      waxSeal === seal.id
                        ? 'bg-[#a3323e] text-white border-[#f898a3] font-medium shadow'
                        : 'bg-[#2e2021] text-[#d4babb] border-[#4b3537] hover:bg-[#3d2a2c]'
                    }`}
                  >
                    {seal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Donation / Price Selection: $1.00 or $2.00 */}
            <div className="pt-2 border-t border-[#443032]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#baa494] font-medium">
                  Select Delivery Tier
                </span>
                <span className="text-[11px] text-[#c5ebd4] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Bank Account Support Verified
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="tier-1-dollar"
                  onClick={() => setPaymentAmount(1)}
                  className={`py-2 px-3 rounded text-sm font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    paymentAmount === 1
                      ? 'bg-[#ffd5df] text-[#29171b] border-[#ffd5df]'
                      : 'bg-[#291c1d] text-[#e0c8cb] border-[#4f3639]'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>$1.00 USD (Gentle Drift)</span>
                </button>
                <button
                  type="button"
                  id="tier-2-dollar"
                  onClick={() => setPaymentAmount(2)}
                  className={`py-2 px-3 rounded text-sm font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    paymentAmount === 2
                      ? 'bg-[#ffd5df] text-[#29171b] border-[#ffd5df]'
                      : 'bg-[#291c1d] text-[#e0c8cb] border-[#4f3639]'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>$2.00 USD (Golden Bottle)</span>
                </button>
              </div>
              <p className="text-[11px] text-[#baa494] mt-2">
                Funds proceed directly to bank account for hosting costs and handwritten card archival.
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            id="cancel-send-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-[#baa494] hover:text-white transition cursor-pointer"
          >
            Back to Editor
          </button>

          {selectedOption === 'free' ? (
            <motion.button
              id="confirm-ocean-cast-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendFree}
              className="px-7 py-3 rounded-full bg-[#c5ebd4] hover:bg-[#d8f3dc] text-[#14281e] font-medium text-sm tracking-wide flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Waves className="w-4 h-4" />
              <span>Cast into the Digital Ocean 🌊</span>
            </motion.button>
          ) : (
            <motion.button
              id="confirm-special-send-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessingPayment}
              onClick={handleSendPaid}
              className="px-7 py-3 rounded-full bg-[#ffd5df] hover:bg-[#ffe3eb] text-[#341820] font-medium text-sm tracking-wide flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#341820] border-t-transparent rounded-full animate-spin" />
                  <span>Sealing Envelope (${paymentAmount}.00)...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  <span>Send to a Special Someone (${paymentAmount}.00) 💌💖</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
