import React from 'react';
import { Sparkles, Heart, Baby, CheckCircle2, ArrowRight, Share2, Smartphone } from 'lucide-react';
import { BabyProfile, GrowthEntry } from '../types/growth';

interface PartnerSyncSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  entryCount: number;
}

export const PartnerSyncSuccessModal: React.FC<PartnerSyncSuccessModalProps> = ({
  isOpen,
  onClose,
  profile,
  entryCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sync-success-title"
    >
      <div className="bg-white dark:bg-[#1B231F] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-500/40 text-[var(--color-text-main,#1B241C)] flex flex-col my-auto transition-colors animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="relative bg-gradient-to-br from-emerald-500/20 via-[var(--color-primary)]/15 to-teal-500/10 p-5 text-center border-b border-emerald-500/20">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-2.5 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Partner Sync Complete</span>
          </div>
          <h2 id="sync-success-title" className="text-lg sm:text-xl font-bold font-heading text-[var(--color-text-main)]">
            Connected with your partner!
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            <strong>{profile.name}</strong>’s records are now loaded on your phone
          </p>
        </div>

        {/* Details Card */}
        <div className="p-5 space-y-4 bg-[var(--color-canvas,#FAF8F3)] dark:bg-[#121714]">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs text-[var(--color-text-muted)]">Baby&apos;s Name</span>
              <span className="text-xs font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                {profile.name}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs text-[var(--color-text-muted)]">Measurements Loaded</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg">
                {entryCount} {entryCount === 1 ? 'measurement' : 'measurements'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">Privacy &amp; Storage</span>
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                100% Local on this device
              </span>
            </div>
          </div>

          {/* Quick Tip for Home Screen */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Quick Tip:</strong> Tap <strong>Share &rarr; Add to Home Screen</strong> in your phone&apos;s browser so you can open {profile.name}&apos;s tracker with 1 tap anytime!
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-white dark:bg-[#1B231F] border-t border-[var(--color-card-border)] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <span>Open {profile.name}&apos;s Growth Curves</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
