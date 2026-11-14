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
      <div className="bg-[var(--color-card)] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[var(--color-card-border)] text-[var(--color-text-main)] flex flex-col my-auto transition-colors">
        
        {/* Header Hero Banner */}
        <div className="relative bg-[var(--color-primary-light)] p-4 sm:p-5 border-b border-[var(--color-card-border)] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-[var(--color-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] transition-colors shadow-2xs cursor-pointer"
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
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 bg-[var(--color-canvas)] text-xs sm:text-sm leading-relaxed text-[var(--color-text-main)]">
          
          {/* Card 1: The First Baby & Confusing Lines */}
          <div className="p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-card-border)] shadow-2xs space-y-2">
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

          {/* Card 3: Why We Built TinyBloom (Trimmed & Direct) */}
          <div className="p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-card-border)] shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30 shrink-0" />
              <span>Why We Built TinyBloom</span>
            </div>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              When we looked for an app to track our baby&apos;s curves, most apps were either locked behind paid monthly subscriptions ($8–$15/mo) or packed with ads.
            </p>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              So we built TinyBloom: <strong>100% free, all local on your device</strong>, with zero ads, zero accounts, and zero cloud tracking. Your baby&apos;s data never leaves this phone.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Local &amp; Private</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Ads or Fees</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Clear WHO Curves</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Screenshot Importer</span>
              </div>
            </div>
          </div>

          {/* Personal Reassurance */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs text-center leading-relaxed font-medium">
            💛 To you and {babyName}: Every baby blooms at their own natural pace. You are doing a wonderful job.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[var(--color-card-border)] bg-[var(--color-card)] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            100% Free &middot; Zero Ads &middot; On-Device
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Back to Baby&apos;s Growth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
