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
        <div className="relative bg-gradient-to-r from-[var(--color-primary,#4A7347)]/15 via-[#F3C9B8]/20 to-[#AFCDE0]/15 p-4 sm:p-5 border-b border-[var(--color-primary,#4A7347)]/20 shrink-0">
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
                <span>Our Story</span>
              </div>
              <h2 id="philosophy-title" className="text-base sm:text-lg font-bold font-heading text-[var(--color-text-main)] leading-tight">
                Why We Built TinyBloom
              </h2>
            </div>
          </div>
        </div>

        {/* Short, Simple & Honest Story */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 bg-[var(--color-canvas,#FAF8F3)] dark:bg-[#121714] text-xs sm:text-sm leading-relaxed text-[var(--color-text-main,#1B241C)]">
          
          {/* Paragraph 1: First-Time Parents Worrying */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-1.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-primary-dark,#2F4F2D)] dark:text-[var(--color-primary)] flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>When We Were First-Time Parents</span>
            </h3>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              When our first baby was born, we watched every checkup number with intense anxiety. At one visit, the doctor noted our baby was tracking on the lower percentile curve. We spent days stressing and worrying, wondering if our baby was eating enough or falling behind.
            </p>
          </div>

          {/* Paragraph 2: What We Realized */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-primary)]/10 dark:bg-white/5 border border-[var(--color-primary)]/20 shadow-2xs space-y-1.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-primary-dark,#2F4F2D)] dark:text-[var(--color-primary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>What We Learned from Pediatricians</span>
            </h3>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              Our pediatrician kindly reminded us: <strong>Percentiles are not exam scores or competitions.</strong> A baby growing along the 15th percentile is just as healthy and thriving as one on the 85th. Every child has their own unique genetics and natural pace. All that matters is steady, consistent progress along their own curve over time.
            </p>
          </div>

          {/* Paragraph 3: Why We Created TinyBloom */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--color-primary-dark,#2F4F2D)] dark:text-[var(--color-primary)] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>A Calm, Private Sanctuary for Families</span>
            </h3>
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              We looked for a simple app to track growth without anxiety, but only found apps filled with loud ads, scary red comparison alerts, and expensive monthly subscriptions.
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              So we built TinyBloom: <strong>100% private, offline-first on your device</strong>, with zero data harvesting, zero ads, and zero anxiety.
            </p>
          </div>

          {/* Warm Blessing */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs">
            <p className="italic">
              &ldquo;Trust your child&apos;s pace, trust your love, and enjoy every little milestone with {babyName}.&rdquo;
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[var(--color-card-border)] bg-white dark:bg-[#1B231F] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            100% On-Device &middot; No Cloud
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[var(--color-primary,#4A7347)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>Back to Growth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
