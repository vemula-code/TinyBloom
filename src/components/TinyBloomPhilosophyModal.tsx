import React from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Sparkles,
  Baby,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { TinyBloomLogo } from './TinyBloomLogo';

interface TinyBloomPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyName?: string;
}

export const TinyBloomPhilosophyModal: React.FC<TinyBloomPhilosophyModalProps> = ({
  isOpen,
  onClose,
  babyName = 'your baby',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="philosophy-title"
    >
      <div className="bg-white dark:bg-[#1B231F] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[var(--color-primary,#4A7347)]/30 text-[var(--color-text-main,#1B241C)] flex flex-col my-auto transition-colors">
        
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-[var(--color-primary,#4A7347)]/15 via-[#F3C9B8]/25 to-[#AFCDE0]/20 p-4 sm:p-5 border-b border-[var(--color-primary,#4A7347)]/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/80 dark:bg-[#2A342D] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white dark:hover:bg-[#323E36] transition-colors shadow-2xs cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <TinyBloomLogo size={38} showText={false} />
            <div>
              <div className="flex items-center gap-1.5 text-rose-500 font-bold text-[11px] uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                <span>Our Real Story</span>
              </div>
              <h2 id="philosophy-title" className="text-base sm:text-lg font-bold font-heading text-[var(--color-text-main)] leading-tight">
                Why We Built TinyBloom
              </h2>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                From one first-time parent to another
              </p>
            </div>
          </div>
        </div>

        {/* Story Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 bg-[var(--color-canvas,#FAF8F3)] dark:bg-[#121714] text-xs sm:text-sm leading-relaxed text-[var(--color-text-main,#1B241C)]">
          
          {/* Card 1: The First Baby & Confusing Lines */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
              <Baby className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>Our First Baby &amp; Confusing Lines</span>
            </div>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              When we had our very first baby, we were completely new to everything. At doctor checkups, the pediatrician would measure our baby&apos;s weight and length, then hand us a growth chart filled with all these wavy curved lines—3%, 15%, 50%, 85%, 97%.
            </p>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              Honestly? <strong>We didn&apos;t get what any of those lines meant.</strong> When the doctor pointed out our baby was on the 15th percentile line, panic set in. We asked ourselves: <em>Does low mean bad? Is our baby not eating enough? Are we failing as parents? Why is another baby on the 85th line while ours is down here?</em> We lost sleep over numbers we didn&apos;t understand.
            </p>
          </div>

          {/* Card 2: What Those Lines Actually Mean */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 shadow-2xs space-y-2 text-emerald-950 dark:text-emerald-100">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>What Those Lines Actually Mean (Low ≠ Bad!)</span>
            </div>
            <p className="text-xs leading-relaxed">
              It took an honest, reassuring conversation with our pediatrician to learn what every parent deserves to know from day one:
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-emerald-900/90 dark:text-emerald-200 pl-1 leading-relaxed">
              <li>
                <strong>Percentiles are not grades in school.</strong> 90th% is not an A+, and 15th% is not an F.
              </li>
              <li>
                <strong>Low does NOT mean bad, and high does NOT mean good.</strong> Just like adults have different heights and builds, babies do too. A petite baby on the 15th line is 100% just as healthy, strong, and thriving as a baby on the 85th line.
              </li>
              <li>
                <strong>The curve is the only thing that matters:</strong> Is your baby steadily following their own natural curve over time? As long as their line stays steady, they are blooming perfectly.
              </li>
            </ul>
          </div>

          {/* Card 3: Looking for an App... Paid Subscriptions & Ads Everywhere */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Looking for an App: Paid Subscriptions &amp; Ads</span>
            </div>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              All we wanted was a calm, simple app on our phone to log checkups, see the lines clearly, and have peace of mind. But every app we downloaded was frustrating:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-[11px]">
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <strong>Expensive Subscriptions:</strong> Charging $8 to $15 every single month just to view a simple growth graph.
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <strong>Cluttered with Ads:</strong> Intrusive popups selling baby formulas and gear right when you&apos;re stressed.
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <strong>Cloud Harvesting:</strong> Demanding email signups and uploading your baby&apos;s private logs to corporate servers.
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                <strong>Data Lock-in:</strong> No way to import past doctor papers or screenshots without paying for their API.
              </div>
            </div>
          </div>

          {/* Card 4: Why We Built TinyBloom */}
          <div className="p-4 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 shadow-2xs space-y-2 text-[var(--color-text-main)]">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30 shrink-0" />
              <span>So We Built TinyBloom For All of Us</span>
            </div>
            <p className="text-xs leading-relaxed">
              We built TinyBloom to be the app we wished existed on day one:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% Free Forever:</strong> Zero subscriptions, zero paywalls. Everything is open.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Ads:</strong> No distractions, no sales pitches in your nursery.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% On-Device Privacy:</strong> Stored strictly on this phone. No accounts, no cloud servers.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Smart Screenshot Scan:</strong> Easily upload screenshots from other apps or doctor papers to auto-fill records without typing or paying for API links.</span>
              </div>
            </div>
          </div>

          {/* Personal Reassurance */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs text-center leading-relaxed font-medium">
            💛 To you and {babyName}: Every baby blooms at their own natural pace. You are doing a wonderful job.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[var(--color-card-border)] bg-white dark:bg-[#1B231F] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            100% Free &middot; Zero Ads &middot; On-Device
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-primary,#4A7347)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Back to Baby&apos;s Growth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
