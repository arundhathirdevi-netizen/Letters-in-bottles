import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Waves,
  Heart,
  Sparkles,
  Check,
  DollarSign,
  Mail,
  ShieldCheck,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { Letter } from '../types';
import { sounds } from '../utils/sound';
import { PaymentScreen } from './PaymentScreen';

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
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senderEmailError, setSenderEmailError] = useState('');
  const [envelopeColor, setEnvelopeColor] = useState<'pink' | 'peach' | 'mint' | 'cream'>('pink');
  const [waxSeal, setWaxSeal] = useState<'heart' | 'rose' | 'shell' | 'star'>('heart');
  const [paymentAmount, setPaymentAmount] = useState<1 | 2>(1);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);

  const handleSendFree = () => {
    sounds.playOceanWave();
    const finalLetter: Letter = {
      id: 'ocean-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: letterDraft.title || 'Whisper in a bottle',
      content: letterDraft.content || '',
      senderName: letterDraft.senderName || 'A quiet soul',
      location: letterDraft.location || 'Somewhere across the ocean',
      date: 'Floating today',
      stampId: letterDraft.stampId || 'baby-rose',
      fontStyle: letterDraft.fontStyle || 'cursive',
      paperTexture: letterDraft.paperTexture || 'cream',
      isSpecial: false,
      likesCount: 1,
      authorType: 'human', // Strictly human
      isRealUser: true,
    };
    onCastToOcean(finalLetter);
  };

  const handleProceedToPayment = () => {
    let hasError = false;

    // Validate your email
    const trimmedSender = senderEmail.trim();
    if (!trimmedSender || !trimmedSender.includes('@') || !trimmedSender.includes('.')) {
      setSenderEmailError('Please enter your email address so your loved one knows who wrote the letter.');
      hasError = true;
    } else {
      setSenderEmailError('');
    }

    // Validate loved one's email address
    const trimmedRecipient = recipientEmail.trim();
    if (!trimmedRecipient || !trimmedRecipient.includes('@') || !trimmedRecipient.includes('.')) {
      setEmailError("Please enter your loved one's email address to deliver the letter directly to them.");
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) return;

    sounds.playPaperRustle();
    setShowPaymentScreen(true);
  };

  if (showPaymentScreen) {
    return (
      <PaymentScreen
        paymentAmount={paymentAmount}
        recipientEmail={recipientEmail.trim()}
        senderEmail={senderEmail.trim()}
        recipientName={recipientName.trim()}
        onClose={onClose}
        onBack={() => setShowPaymentScreen(false)}
        onVerifyAndSend={(utrNumber: string) => {
          const finalLetter: Letter = {
            id: 'secret-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
            title: letterDraft.title || 'A sealed letter for you',
            content: letterDraft.content || '',
            senderName: letterDraft.senderName || 'Someone who cares',
            senderEmail: senderEmail.trim(),
            recipientName: recipientName.trim() || 'Beloved',
            recipientEmail: recipientEmail.trim(),
            location: letterDraft.location || 'From a fond heart',
            date: 'Sealed today with care',
            stampId: letterDraft.stampId || 'baby-rose',
            fontStyle: letterDraft.fontStyle || 'cursive',
            paperTexture: letterDraft.paperTexture || 'pink',
            isSpecial: true,
            envelopeColor,
            waxSeal,
            likesCount: 1,
            authorType: 'human',
            isRealUser: true,
            paymentAmount,
            paymentRecipient: 'Letters on Bottles (UPI Verified)',
            utrNumber,
          };

          onSendToSpecialSomeone(finalLetter, paymentAmount);
        }}
      />
    );
  }

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
            Cast it into the open digital ocean for wandering souls, or send it straight to your loved one&apos;s email mailbox.
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
                Sends anonymously to someone wandering the shore. Preserved as a pure human-written letter in the public ocean collection.
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
                  $1.00 or $2.00 USD
                </span>
              </div>
              <h3 className="font-serif-vintage text-xl text-[#faf6ed] font-medium">
                Option B: Send to a Loved One 💌💖
              </h3>
              <p className="text-xs text-[#baa494] mt-2 leading-relaxed">
                Delivered straight to your loved one&apos;s email mailbox. Includes a dedicated wax-sealed envelope and private secret bottle link.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#382d25] flex items-center gap-2 text-xs text-[#ffd5df]">
              <Mail className="w-4 h-4" />
              <span>Delivered to recipient&apos;s inbox</span>
            </div>
          </div>
        </div>

        {/* Option B Customization & Recipient Email Details */}
        {selectedOption === 'paid' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-5 rounded-md bg-[#231a19] border border-[#483435] text-left space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#443032] pb-2.5">
              <h4 className="font-serif-vintage text-lg text-[#ffd5df] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Loved One&apos;s Delivery & Envelope</span>
              </h4>
              <span className="text-[11px] text-[#c5ebd4] flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Recipient Inbox Verified
              </span>
            </div>

            {/* Strict Privacy Notice */}
            <div className="p-3 rounded-lg bg-[#201518] border border-[#52373e] text-xs text-[#ffd5df] flex items-start gap-2.5">
              <span className="text-base leading-none">🔒</span>
              <div className="leading-relaxed">
                <strong className="text-[#faf6ed] font-medium">100% Private & Confidential:</strong> This letter will be sent directly to your loved one&apos;s email address and will <span className="text-[#c5ebd4] font-semibold">NOT</span> be available to any strangers or anywhere in the public ocean.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Your Email Address (Required) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#ffd5df] mb-1.5 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ffd5df]" />
                    Your Email Address <span className="text-[#ff7597]">*</span>
                  </span>
                </label>
                <input
                  id="sender-email-input"
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={senderEmail}
                  onChange={(e) => {
                    setSenderEmail(e.target.value);
                    setSenderEmailError('');
                  }}
                  className={`w-full px-3.5 py-2.5 rounded bg-[#191211] border outline-none text-sm text-[#faf6ed] placeholder:text-[#8f797a] ${
                    senderEmailError ? 'border-[#ff7597] focus:border-[#ff7597]' : 'border-[#523d3e] focus:border-[#ffd5df]'
                  }`}
                />
                {senderEmailError && (
                  <p className="text-xs text-[#ff94aa] mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{senderEmailError}</span>
                  </p>
                )}
              </div>

              {/* Loved One's Email Address (Required) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#ffd5df] mb-1.5 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#c5ebd4]" />
                    Loved One&apos;s Email <span className="text-[#ff7597]">*</span>
                  </span>
                </label>
                <input
                  id="loved-one-email-input"
                  type="email"
                  required
                  placeholder="e.g. yourlovedone@gmail.com"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={`w-full px-3.5 py-2.5 rounded bg-[#191211] border outline-none text-sm text-[#faf6ed] placeholder:text-[#8f797a] ${
                    emailError ? 'border-[#ff7597] focus:border-[#ff7597]' : 'border-[#523d3e] focus:border-[#ffd5df]'
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-[#ff94aa] mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{emailError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Recipient's Name / Moniker */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#baa494] mb-1.5 font-medium">
                Recipient&apos;s Name / Moniker (Optional)
              </label>
              <input
                id="recipient-name-input"
                type="text"
                placeholder="e.g. Eleanor, Beloved Friend..."
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3.5 py-2 rounded bg-[#191211] border border-[#523d3e] focus:border-[#ffd5df] outline-none text-sm text-[#faf6ed] placeholder:text-[#8f797a]"
              />
            </div>

            {/* Custom Envelope Colors */}
            <div>
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
            <div>
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

            {/* Delivery Tier: ₹80 ($1) or ₹160 ($2) */}
            <div className="pt-3 border-t border-[#443032]">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <span className="text-xs uppercase tracking-wider text-[#baa494] font-medium">
                  Select Delivery Tier
                </span>
                <span className="text-[11px] text-[#c5ebd4] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#55d98d]" />
                  <span>Instant UPI QR Verification</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2.5">
                <button
                  type="button"
                  id="tier-1-dollar"
                  onClick={() => setPaymentAmount(1)}
                  className={`py-2 px-3 rounded text-sm font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    paymentAmount === 1
                      ? 'bg-[#ffd5df] text-[#29171b] border-[#ffd5df] shadow-sm font-semibold'
                      : 'bg-[#291c1d] text-[#e0c8cb] border-[#4f3639] hover:bg-[#332225]'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>₹80 / $1.00 (Gentle Drift)</span>
                </button>
                <button
                  type="button"
                  id="tier-2-dollar"
                  onClick={() => setPaymentAmount(2)}
                  className={`py-2 px-3 rounded text-sm font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    paymentAmount === 2
                      ? 'bg-[#ffd5df] text-[#29171b] border-[#ffd5df] shadow-sm font-semibold'
                      : 'bg-[#291c1d] text-[#e0c8cb] border-[#4f3639] hover:bg-[#332225]'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>₹160 / $2.00 (Golden Bottle)</span>
                </button>
              </div>

              {/* Seamless UPI QR Code Notification Box */}
              <div className="bg-[#181211] p-3.5 rounded-lg border border-[#523e40] text-xs text-[#baa494] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#fedac5] shrink-0" />
                  <span className="text-[#e2d3cb] text-xs leading-relaxed">
                    Next step opens the QR code to scan with Google Pay, PhonePe, or Paytm.
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-[#c5ebd4] shrink-0 bg-[#15251c] px-2.5 py-1 rounded border border-[#274f38]">
                  {paymentAmount === 1 ? '₹80 ($1)' : '₹160 ($2)'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
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
              onClick={handleProceedToPayment}
              className="px-7 py-3 rounded-full bg-[#ffd5df] hover:bg-[#ffe3eb] text-[#341820] font-medium text-sm tracking-wide flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <span>Continue to Payment ({paymentAmount === 1 ? '₹80 / $1.00' : '₹160 / $2.00'})</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
