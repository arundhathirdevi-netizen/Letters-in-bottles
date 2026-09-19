import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Feather, Check, Sparkles, Send } from 'lucide-react';
import { STAMPS } from '../data/stamps';
import { Stamp, Letter } from '../types';
import { sounds } from '../utils/sound';

interface LetterEditorProps {
  onClose: () => void;
  onProceedToSend: (letterDraft: Partial<Letter>) => void;
}

export const LetterEditor: React.FC<LetterEditorProps> = ({ onClose, onProceedToSend }) => {
  const [selectedStamp, setSelectedStamp] = useState<Stamp>(STAMPS[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [location, setLocation] = useState('Somewhere by the shore');
  const [fontStyle, setFontStyle] = useState<'cursive' | 'serif' | 'typewriter'>('cursive');
  const [paperTexture, setPaperTexture] = useState<'cream' | 'pink' | 'peach' | 'mint'>('cream');
  const [hasLinedPaper, setHasLinedPaper] = useState(true);

  const paperBackgroundClass = {
    cream: 'bg-[#fcf8f0] text-[#2c241e]',
    pink: 'bg-[#fef2f4] text-[#332227]',
    peach: 'bg-[#fdf4ed] text-[#33251e]',
    mint: 'bg-[#f1f9f4] text-[#1e2e26]',
  }[paperTexture];

  const fontClass = {
    cursive: 'font-handwriting text-2xl sm:text-3xl leading-[36px]',
    serif: 'font-serif-vintage text-lg sm:text-xl leading-relaxed',
    typewriter: 'font-mono text-sm sm:text-base leading-relaxed tracking-tight',
  }[fontStyle];

  const handleSelectStamp = (stamp: Stamp) => {
    setSelectedStamp(stamp);
    sounds.playStampAffix();
  };

  const handleContinue = () => {
    if (!content.trim()) return;
    onProceedToSend({
      title: title.trim() || 'A letter without a title',
      content: content.trim(),
      senderName: senderName.trim() || 'A quiet soul',
      location: location.trim() || 'From somewhere quiet',
      stampId: selectedStamp.id,
      fontStyle,
      paperTexture,
      date: 'Today at twilight',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl my-auto flex flex-col items-center">
        {/* Header Controls Bar */}
        <div className="w-full flex items-center justify-between mb-3 px-2 text-[#e2d7cb]">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-[#ffd5df]" />
            <span className="font-serif-vintage text-lg text-[#faf6ed]">
              Interactive Letter Sanctuary
            </span>
          </div>
          <button
            id="close-editor-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#d8cbbf] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parchment Editor Canvas */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Vintage Parchment Paper */}
          <div className="lg:col-span-8 w-full flex justify-center">
            <div
              className={`relative w-full max-w-2xl min-h-[560px] p-8 sm:p-12 rounded-sm shadow-2xl parchment-paper ${paperBackgroundClass} transition-colors duration-300 border border-[#dfceba]/60 flex flex-col`}
            >
              {/* Top Corner: Elegantly Affixed Vintage Stamp as requested */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 select-none group">
                <div className="relative rotate-1 hover:rotate-0 transition-transform duration-300">
                  {/* Postage Cancellation Postmark Overlay */}
                  <div className="absolute -left-12 -top-2 w-28 h-12 pointer-events-none opacity-40 mix-blend-multiply flex flex-col justify-center">
                    <div className="w-full h-[1px] bg-[#3a3028] mb-1" />
                    <div className="w-full h-[1px] bg-[#3a3028] mb-1" />
                    <div className="w-full h-[1px] bg-[#3a3028]" />
                    <span className="text-[7px] tracking-widest text-[#3a3028] uppercase font-mono mt-0.5">
                      {selectedStamp.postmarkText}
                    </span>
                  </div>

                  {/* Stamp Container with Perforated Realistic Borders */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 bg-[#fffcf5] p-1.5 rounded-xs shadow-md border-2 border-dashed border-[#d1bfab] overflow-hidden flex flex-col items-center">
                    <div className="relative w-full h-full overflow-hidden bg-stone-100 rounded-xs">
                      <img
                        src={selectedStamp.imageUrl}
                        alt={selectedStamp.name}
                        className="w-full h-full object-cover filter saturate-[1.05]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-[#2b221c]/70 text-[8px] text-[#faf6ed] text-center py-0.5 uppercase tracking-wider font-mono">
                        {selectedStamp.denomination}
                      </div>
                    </div>
                  </div>

                  {/* Stamp tooltip */}
                  <div className="absolute top-full right-0 mt-1 opacity-0 group-hover:opacity-100 transition text-[10px] text-[#6d5d51] whitespace-nowrap font-serif-vintage bg-[#faf7ef] px-2 py-0.5 rounded shadow-sm border border-[#e5d8c8]">
                    {selectedStamp.name}
                  </div>
                </div>
              </div>

              {/* Letter Header */}
              <div className="mb-6 pr-24 sm:pr-32">
                <input
                  id="letter-title-input"
                  type="text"
                  placeholder="Dear Stranger / Title of your letter..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-[#cca78f]/40 focus:border-[#a46e59] outline-none font-serif-vintage text-xl sm:text-2xl font-medium tracking-wide placeholder:text-[#ab998b] pb-1"
                />
                <div className="flex items-center gap-3 mt-2 text-xs text-[#8d7c6f]">
                  <input
                    id="letter-location-input"
                    type="text"
                    placeholder="Location (e.g. From a quiet cafe)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent border-b border-[#cca78f]/30 focus:border-[#a46e59] outline-none text-xs w-48 placeholder:text-[#ab998b]"
                  />
                  <span>•</span>
                  <span>Today</span>
                </div>
              </div>

              {/* Parchment Writing Text Area */}
              <div className="relative flex-1">
                <textarea
                  id="letter-content-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Pour your heart onto the parchment... Write of your quiet thoughts, a secret wish, an apology never spoken, or gentle words to comfort a stranger across the waves."
                  className={`w-full h-72 sm:h-80 bg-transparent resize-none outline-none ${fontClass} ${
                    hasLinedPaper ? 'parchment-lines' : ''
                  } placeholder:text-[#9e8c7e]/70 placeholder:font-serif-vintage`}
                />
              </div>

              {/* Letter Footer Sign-off */}
              <div className="mt-6 pt-4 border-t border-[#cca78f]/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-handwriting text-xl text-[#7a685c]">—</span>
                  <input
                    id="letter-sender-input"
                    type="text"
                    placeholder="Your pseudonym / name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="bg-transparent border-b border-[#cca78f]/40 focus:border-[#a46e59] outline-none font-handwriting text-xl sm:text-2xl text-[#4a3b32] placeholder:text-[#aa998d]"
                  />
                </div>

                <div className="text-xs text-[#8c7b6f] font-mono">
                  {content.trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            </div>
          </div>

          {/* Right Toolbar & Aesthetics Customizer */}
          <div className="lg:col-span-4 w-full flex flex-col gap-4">
            {/* Choose Your Stamp Toolbar as specifically requested */}
            <div className="bg-[#1e1916] rounded-md p-5 border border-[#3c3129] shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif-vintage text-lg text-[#faf6ed] flex items-center gap-2">
                  <span>Choose Your Stamp</span>
                  <span className="text-sm">🏷️</span>
                </h3>
                <span className="text-[11px] text-[#baa494] font-light">
                  Pinterest aesthetic
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {STAMPS.map((stamp) => {
                  const isSelected = selectedStamp.id === stamp.id;
                  return (
                    <button
                      key={stamp.id}
                      id={`select-stamp-${stamp.id}`}
                      onClick={() => handleSelectStamp(stamp)}
                      className={`relative p-1.5 rounded-sm flex flex-col items-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#fedac5]/20 ring-2 ring-[#fedac5] shadow-md'
                          : 'bg-[#28211b] hover:bg-[#342b24] border border-[#3e342c]'
                      }`}
                    >
                      <div className="relative w-full aspect-square rounded-xs overflow-hidden bg-stone-800">
                        <img
                          src={stamp.imageUrl}
                          alt={stamp.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#fedac5]/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-[#e0d3c5] text-center mt-1.5 truncate w-full">
                        {stamp.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#9f8e80] mt-3 leading-relaxed">
                Clicking any stamp places it with authentic vintage ink cancellation onto the top corner of your parchment!
              </p>
            </div>

            {/* Paper & Ink Customization (Pastels & Typography) */}
            <div className="bg-[#1e1916] rounded-md p-5 border border-[#3c3129] shadow-lg flex flex-col gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#baa494] block mb-2 font-medium">
                  Parchment Pastel Tone
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'cream', name: 'Cream Linen', bg: 'bg-[#fcf8f0]', border: 'border-[#dfd3be]' },
                    { id: 'pink', name: 'Baby Pink', bg: 'bg-[#ffd5df]', border: 'border-[#f8b4c5]' },
                    { id: 'peach', name: 'Soft Peach', bg: 'bg-[#fedac5]', border: 'border-[#f6bc9a]' },
                    { id: 'mint', name: 'Ocean Mint', bg: 'bg-[#c5ebd4]', border: 'border-[#9ed6b4]' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      id={`paper-color-${p.id}`}
                      onClick={() => setPaperTexture(p.id as typeof paperTexture)}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium text-[#2a221c] ${p.bg} ${p.border} border transition cursor-pointer flex items-center justify-center gap-1 ${
                        paperTexture === p.id ? 'ring-2 ring-white font-semibold' : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      {paperTexture === p.id && <Check className="w-3 h-3" />}
                      <span className="text-[11px]">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#baa494] block mb-2 font-medium">
                  Handwriting Style
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cursive', label: 'Cursive' },
                    { id: 'serif', label: 'Serif' },
                    { id: 'typewriter', label: 'Typewriter' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      id={`font-style-${f.id}`}
                      onClick={() => setFontStyle(f.id as typeof fontStyle)}
                      className={`py-1.5 px-2 rounded text-xs transition cursor-pointer ${
                        fontStyle === f.id
                          ? 'bg-[#fedac5] text-[#221b16] font-medium'
                          : 'bg-[#28211b] text-[#baa494] hover:text-white border border-[#3e342c]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lined paper toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#baa494]">Vintage Ruled Lines</span>
                <button
                  id="toggle-lines-btn"
                  onClick={() => setHasLinedPaper(!hasLinedPaper)}
                  className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                    hasLinedPaper
                      ? 'bg-[#fedac5]/20 text-[#fedac5] border border-[#fedac5]/40'
                      : 'bg-[#28211b] text-[#8e7e72] border border-[#3e342c]'
                  }`}
                >
                  {hasLinedPaper ? 'Lines On' : 'Blank'}
                </button>
              </div>
            </div>

            {/* Proceed to Send Button */}
            <motion.button
              id="editor-send-letter-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!content.trim()}
              onClick={handleContinue}
              className={`w-full py-4 rounded-full font-medium text-base tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                content.trim()
                  ? 'bg-[#f9f4e8] hover:bg-[#fffcf5] text-[#221a15]'
                  : 'bg-[#2f2722] text-[#716155] cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4 text-[#8a5340]" />
              <span>Send Letter</span>
              <Sparkles className="w-4 h-4 text-[#ffd5df]" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
