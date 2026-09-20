import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Clock, Compass, Quote, Mail, Send } from 'lucide-react';

interface BeautyOfLettersProps {
  onOpenWrite?: () => void;
  onOpenRead?: () => void;
}

export const BeautyOfLetters: React.FC<BeautyOfLettersProps> = () => {
  const beautyPillars = [
    {
      icon: Clock,
      title: 'The Slowness of Thought',
      subtitle: 'An antidote to instant noise',
      description:
        'In an era of rapid typing and disposable pings, a letter demands that we sit still. It invites us to pause, breathe, and gather thoughts into ink with honesty that cannot be rushed.',
      tag: 'Patience',
    },
    {
      icon: Heart,
      title: 'The Warmth of Imperfection',
      subtitle: 'Words that remember human hands',
      description:
        'Unlike polished screen pixels, paper carries the cadence of breathing, hesitations, crossing-outs, and warmth. Every fold and ink stroke holds a quiet piece of the sender’s presence.',
      tag: 'Vulnerability',
    },
    {
      icon: Compass,
      title: 'The Magic of the Drift',
      subtitle: 'Surrendering to the ocean tide',
      description:
        'Sealing a letter into a bottle is an act of gentle faith. You release your words into the digital sea without demanding an instant reply, trusting they will reach the soul who needs them most.',
      tag: 'Serendipity',
    },
    {
      icon: Sparkles,
      title: 'An Intimacy Across Oceans',
      subtitle: 'Quiet companionship in solitude',
      description:
        'A letter is a whispered conversation across unseen distances. To unfold someone’s sealed message is to receive an unprompted gift of empathy—a reminder that none of us are ever truly alone.',
      tag: 'Connection',
    },
  ];

  return (
    <section
      id="beauty-of-letters"
      className="relative py-20 md:py-28 px-6 sm:px-12 md:px-20 bg-gradient-to-b from-[#12100e] via-[#161311] to-[#12100e] border-t border-[#29221d] overflow-hidden"
    >
      {/* Background ambient warm glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#fedac5]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#ffd5df]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Chapter Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-[1px] bg-[#fedac5]/50" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#fedac5] font-light">
              Chapter II • The Lost Art
            </span>
            <span className="w-8 h-[1px] bg-[#fedac5]/50" />
          </div>

          <h2 className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl text-[#faf6ed] tracking-tight leading-tight">
            The Quiet Beauty of <br />
            <span className="italic text-[#fedac5]">Writing Letters</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[#d8cbbf] font-light leading-relaxed">
            Long before messages vanished into instant feeds, people preserved their heartbeats on paper.
            A letter is not merely correspondence—it is an enduring vessel of tenderness, memory, and presence.
          </p>
        </div>

        {/* 4 Pillars of Letter Writing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {beautyPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-lg p-7 sm:p-8 bg-[#1a1512]/90 border border-[#382d25] hover:border-[#fedac5]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Decorative corner postmark tick */}
                <div className="absolute top-4 right-5 text-[10px] uppercase font-mono tracking-widest text-[#8a7667]">
                  No. 0{idx + 1} • {pillar.tag}
                </div>

                <div>
                  <div className="w-11 h-11 rounded-full bg-[#2a211a] border border-[#483a30] group-hover:border-[#fedac5]/50 flex items-center justify-center text-[#fedac5] mb-5 transition-colors">
                    <Icon className="w-5 h-5 text-[#ffd5df] group-hover:scale-110 transition-transform" />
                  </div>

                  <h3 className="font-serif-vintage text-2xl text-[#faf6ed] tracking-wide mb-1">
                    {pillar.title}
                  </h3>

                  <div className="text-xs font-mono tracking-wider uppercase text-[#c49a85] mb-3">
                    {pillar.subtitle}
                  </div>

                  <p className="text-sm sm:text-base text-[#bda998] font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#31251e] flex items-center text-[11px] text-[#8e7b6d] font-light">
                  <span className="italic">Written to outlast the moment</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Vintage Parchment Quote Banner (without buttons) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-lg p-8 sm:p-12 parchment-paper bg-[#fbf7ee] text-[#2c221a] shadow-2xl border border-[#d9c5af] text-center max-w-3xl mx-auto"
        >
          {/* Subtle vintage wax seal in corner */}
          <div className="absolute -top-4 -right-2 hidden sm:flex w-12 h-12 rounded-full bg-[#962d3e] text-[#ffd5df] shadow-md border border-white/30 items-center justify-center text-sm rotate-12">
            ♥
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#8a5340] mb-3 font-mono">
              <Quote className="w-3.5 h-3.5" />
              <span>A note on human connection</span>
            </div>

            <p className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#36271e] leading-snug">
              &ldquo;More than kisses, letters mingle souls; for thus friends absent speak.&rdquo;
            </p>

            <div className="text-xs uppercase tracking-widest text-[#786150] mt-3 font-medium">
              — John Donne, 1597
            </div>

            <p className="text-xs sm:text-sm text-[#5f493b] mt-4 leading-relaxed font-light">
              Every word you write here floats into the worldwide digital ocean, waiting for someone to find it on their shore.
            </p>
          </div>
        </motion.div>

        {/* Creator Feedback & Suggestions Box */}
        <motion.div
          id="creator-feedback-box"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 max-w-xl mx-auto rounded-xl p-6 sm:p-7 bg-[#1c1613] border border-[#403127] text-center shadow-lg relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-full bg-[#fedac5]/10 border border-[#fedac5]/30 flex items-center justify-center text-[#fedac5] mx-auto mb-3.5">
            <Mail className="w-4 h-4 text-[#fedac5]" />
          </div>

          <h4 className="font-serif-vintage text-lg sm:text-xl text-[#faf6ed] tracking-wide">
            Feedback &amp; Suggestions
          </h4>

          <p className="text-xs sm:text-sm text-[#bcaaa0] mt-1.5 leading-relaxed font-light max-w-md mx-auto">
            Have thoughts, reflections, or suggestions for Letters in Bottles? We&apos;d love to hear from you.
          </p>

          <div className="mt-4 p-3 rounded-lg bg-[#140f0d] border border-[#32261e] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#fedac5] font-mono select-all">
              <span>✉️</span>
              <span className="font-medium">arundhathi.r.devi@gmail.com</span>
            </div>

            <div className="w-full sm:w-auto">
              <a
                id="send-feedback-email-link"
                href="mailto:arundhathi.r.devi@gmail.com?subject=Feedback%20%26%20Suggestions%20for%20Letters%20in%20Bottles"
                className="w-full sm:w-auto px-4 py-1.5 rounded-full text-xs font-medium text-[#1c1613] bg-[#fedac5] hover:bg-[#ffe5d6] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <span>Send Feedback</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
