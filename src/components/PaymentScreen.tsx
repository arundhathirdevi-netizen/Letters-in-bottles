import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ShieldCheck, ArrowLeft, QrCode } from 'lucide-react';
import { sounds } from '../utils/sound';

interface PaymentScreenProps {
  paymentAmount: 1 | 2;
  recipientEmail?: string;
  senderEmail?: string;
  recipientName?: string;
  onClose: () => void;
  onBack?: () => void;
  onVerifyAndSend: (utrNumber: string) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  paymentAmount,
  recipientEmail,
  onClose,
  onBack,
  onVerifyAndSend,
}) => {
  // Required payment variable: strictly internal logic, never rendered in UI text
  const phoneNumber = "9947117171";

  // Dynamic automatic payment QR code image generation using official UPI URL syntax
  const qrCodeUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=" +
    phoneNumber +
    "@okaxis%26pn=Letters%20On%20A%20Bottle%20%26cu=INR";

  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Validate that exactly 12 characters/digits are typed
  const sanitizedUtr = utrNumber.replace(/[^0-9a-zA-Z]/g, '');
  const isValidUtr = sanitizedUtr.length === 12;

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict input length to max 12 digits/alphanumeric characters
    const val = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 12);
    setUtrNumber(val);
  };

  const handleVerify = () => {
    if (!isValidUtr || isVerifying) return;

    sounds.playPaperRustle();
    setIsVerifying(true);
    setConfirmationMessage("Thank you! Your payment reference has been recorded. Your letter is on its way!");

    // Allow user to read confirmation message briefly before finishing send
    setTimeout(() => {
      onVerifyAndSend(sanitizedUtr);
    }, 1800);
  };

  const formattedAmount = paymentAmount === 2 ? '₹160 / $2.00' : '₹80 / $1.00';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg my-auto bg-[#1b1512] border border-[#443329] rounded-xl p-6 sm:p-8 shadow-2xl text-[#faf6ed]">
        {/* Navigation Top Bar: Back & Close buttons */}
        <div className="flex items-center justify-between mb-4">
          {onBack ? (
            <button
              id="payment-back-btn"
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#baa494] hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            id="payment-close-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#baa494] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header & Privacy: Main title 'Letters on Bottles' at top */}
        <div className="text-center mb-6">
          <h1 className="font-serif-vintage text-2xl sm:text-3xl text-[#faf6ed] tracking-wide">
            Letters on Bottles
          </h1>
          <p className="text-xs sm:text-sm text-[#baa494] mt-1.5">
            Deliver your private sealed letter directly to{' '}
            <span className="text-[#ffd5df] font-medium">{recipientEmail || 'your loved one'}</span>
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#271d18] border border-[#4a362b] text-[11px] text-[#c5ebd4]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#55d98d]" />
            <span>Amount: <strong>{formattedAmount}</strong></span>
          </div>
        </div>

        {/* Dynamic UPI QR Code centered inside a clean card */}
        <div className="bg-[#140f0d] p-5 rounded-xl border border-[#392a21] shadow-inner mb-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-[#baa494] mb-3 font-mono">
            <QrCode className="w-3.5 h-3.5 text-[#fedac5]" />
            <span>Instant UPI Payment</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg inline-block shadow-md mx-auto">
            <img
              id="upi-qr-code-img"
              src={qrCodeUrl}
              alt="Letters on Bottles Payment QR Code"
              width={220}
              height={220}
              className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] object-contain block mx-auto"
            />
          </div>

          <p className="text-[11px] text-[#8e7b70] mt-3">
            Scan with any UPI application • Instant verification
          </p>
        </div>

        {/* Simple Instructions */}
        <div className="mb-6 space-y-2 bg-[#201814] p-4 rounded-lg border border-[#3e2e25]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#fedac5] mb-2">
            Payment Instructions
          </h2>
          <ol className="space-y-1.5 text-xs text-[#d8cbbf] list-decimal list-inside leading-relaxed">
            <li>Scan this QR code using Google Pay, PhonePe, or Paytm.</li>
            <li>Complete the payment.</li>
            <li>Enter your 12-digit UPI / UTR Transaction Reference Number below.</li>
          </ol>
        </div>

        {/* Input Box: 12-Digit Transaction / UTR Number */}
        <div className="mb-6 text-left">
          <label
            htmlFor="utr-number-input"
            className="block text-xs uppercase tracking-wider text-[#ffd5df] mb-2 font-medium flex items-center justify-between"
          >
            <span>12-Digit Transaction / UTR Number</span>
            <span className="text-[11px] font-mono text-[#baa494]">
              {sanitizedUtr.length}/12
            </span>
          </label>
          <input
            id="utr-number-input"
            type="text"
            maxLength={12}
            value={utrNumber}
            onChange={handleUtrChange}
            disabled={isVerifying || Boolean(confirmationMessage)}
            placeholder="e.g. 423456789012"
            className="w-full px-4 py-3 rounded-lg bg-[#140f0d] border border-[#523d3e] focus:border-[#ffd5df] focus:ring-1 focus:ring-[#ffd5df] outline-none text-base font-mono tracking-widest text-[#faf6ed] placeholder:text-[#6a5455] placeholder:tracking-normal placeholder:font-sans transition"
          />
          {utrNumber && !isValidUtr && (
            <p className="text-[11px] text-[#ff94aa] mt-1.5">
              Please enter all 12 digits of your reference number ({12 - sanitizedUtr.length} remaining).
            </p>
          )}
        </div>

        {/* Confirmation Message Display */}
        <AnimatePresence>
          {confirmationMessage && (
            <motion.div
              id="payment-confirmation-msg"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-3.5 rounded-lg bg-[#172b1e] border border-[#2b573a] text-center text-xs sm:text-sm text-[#c5ebd4] font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#55d98d] shrink-0" />
              <span>{confirmationMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button: 'Verify & Send Letter' */}
        <div>
          <button
            id="verify-and-send-letter-btn"
            type="button"
            disabled={!isValidUtr || isVerifying}
            onClick={handleVerify}
            className={`w-full py-3.5 px-6 rounded-full font-medium text-sm tracking-wide transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              isValidUtr && !isVerifying
                ? 'bg-[#fedac5] hover:bg-[#ffe5d6] text-[#2c1d14] font-semibold active:scale-[0.99]'
                : 'bg-[#2b221d] text-[#78665c] cursor-not-allowed border border-[#3e3129]'
            }`}
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-[#2c1d14] border-t-transparent rounded-full animate-spin" />
                <span>Recording reference &amp; sealing letter...</span>
              </>
            ) : (
              <span>Verify &amp; Send Letter</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
