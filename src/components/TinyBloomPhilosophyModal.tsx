import React from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Sparkles,
  Baby,
  Smile,
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
      <div className="bg-white dark:bg-[#1B231F] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[var(--color-primary,#4A7347)]/30 text-[var(--color-text-main,#1B241C)] flex flex-col my-auto transition-colors">
        
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-[var(--color-primary,#4A7347)]/15 via-[#F3C9B8]/20 to-[#AFCDE0]/15 p-5 sm:p-6 border-b border-[var(--color-primary,#4A7347)]/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-[#2A342D] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white dark:hover:bg-[#323E36] transition-colors shadow-2xs cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <TinyBloomLogo size={42} showText={false} />
            <div>
              <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                <span>Parent to Parent</span>
              </div>
              <h2 id="philosophy-title" className="text-lg sm:text-xl font-bold font-heading text-[var(--color-text-main)] leading-tight mt-0.5">
                Why We Built TinyBloom
              </h2>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-2 italic leading-relaxed">
            &ldquo;Every little milestone matters. Growth is a gentle, individual journey &mdash; not a competition.&rdquo;
          </p>
        </div>

        {/* Scrollable Heartfelt Letter */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-[var(--color-canvas,#FAF8F3)] dark:bg-[#121714] text-xs sm:text-sm leading-relaxed text-[var(--color-text-main,#1B241C)]">
          
          {/* Opening Personal Note */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-2.5">
            <h3 className="font-bold text-sm sm:text-base font-heading text-[var(--color-primary-dark,#2F4F2D)] dark:text-[var(--color-primary)] flex items-center gap-2">
              <Smile className="w-4 h-4 text-[var(--color-primary)]" />
              <span>To the parent reading this right now</span>
            </h3>
            <p>
              If you are reading this in the quiet hours of the night, holding a warm baby in your arms while wondering if you are doing everything right &mdash; please pause and take a deep breath. <strong>You are doing an incredible job</strong>, and {babyName} is so lucky to have you.
            </p>
            <p>
              Parenthood is filled with overwhelming love, but it can also be terrifyingly anxious. We built TinyBloom because we have sat in your exact shoes.
            </p>
          </div>

          {/* The Story Behind It */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text-main)] flex items-center gap-2">
              <Baby className="w-4 h-4 text-amber-600" />
              <span>The Checkup That Changed Everything</span>
            </h4>
            <p>
              We created TinyBloom after a routine pediatrician checkup that left us in tears. The nurse weighed our baby, scribbled down a number, and casually said: <em>&ldquo;She is tracking along the 18th percentile.&rdquo;</em>
            </p>
            <p>
              Nobody explained what that meant. We left the clinic with a pit in our stomach, terrified that our baby wasn&apos;t eating enough or falling behind. We went home, Googled in panic at 2 AM, and downloaded popular baby tracking apps.
            </p>
            <p>
              Instead of comfort, those apps made our anxiety ten times worse: they flashed scary red alerts, pushed formula ads, locked our child&apos;s records behind recurring $14/month paywalls, and shared our private family moments with marketing data brokers.
            </p>
          </div>

          {/* The Truth About Percentiles */}
          <div className="p-4 rounded-2xl bg-[var(--color-primary)]/10 dark:bg-white/5 border border-[var(--color-primary)]/20 space-y-2">
            <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text-main)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <span>The Truth We Wish Someone Had Told Us</span>
            </h4>
            <p className="font-medium text-[var(--color-text-main)]">
              <strong>Percentiles are not report cards. They are not athletic contests.</strong>
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              A baby growing happily along the 15th percentile is just as healthy, complete, and thriving as a baby on the 85th percentile. If you lined up 100 healthy children, baby #15 and baby #85 are both growing exactly as their unique genetics intended. What pediatricians actually look for is steady, consistent progression along their own line &mdash; never a race to the top.
            </p>
          </div>

          {/* How TinyBloom Genuinely Helps You */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
              How TinyBloom Protects You &amp; {babyName}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] space-y-1">
                <span className="font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>100% Private &amp; On-Device</span>
                </span>
                <p className="text-[11px] text-[var(--color-text-muted)] leading-snug">
                  Zero cloud servers, zero trackers, zero data harvesting. Your child&apos;s records and photos belong strictly to you.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] space-y-1">
                <span className="font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Zero Anxiety Design</span>
                </span>
                <p className="text-[11px] text-[var(--color-text-muted)] leading-snug">
                  No red alarm colors, no competitive charts, and no ads. Just gentle, objective World Health Organization guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Parting Blessing */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 space-y-2 text-xs">
            <p className="font-medium italic leading-relaxed">
              &ldquo;Babies bloom on their own timeline, like wildflowers in a meadow. Celebrate the little gummy smiles, the sleepy yawns, and the tiny milestone victories. They do not stay this small for long.&rdquo;
            </p>
            <p className="font-bold text-right text-[11px]">
              &mdash; With love and solidarity, from fellow parents
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--color-card-border)] bg-white dark:bg-[#1B231F] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            TinyBloom &middot; 100% Free &amp; Offline
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-primary,#4A7347)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Back to {babyName}&apos;s Growth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
