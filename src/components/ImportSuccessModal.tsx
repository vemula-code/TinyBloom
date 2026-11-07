import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Baby,
  Ruler,
  Scale,
  Brain,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BabyProfile, ChartType, GrowthEntry } from '../types/growth';

export interface ImportSuccessSummary {
  totalCount: number;
  weightCount: number;
  heightCount: number;
  headCount: number;
  dateStart?: string;
  dateEnd?: string;
  minAgeMonths?: number;
  maxAgeMonths?: number;
  preferredChartType?: ChartType;
}

interface ImportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  summary: ImportSuccessSummary;
  onSelectChartType: (type: ChartType) => void;
}

export const ImportSuccessModal: React.FC<ImportSuccessModalProps> = ({
  isOpen,
  onClose,
  profile,
  summary,
  onSelectChartType,
}) => {
  if (!isOpen) return null;

  const handleGoToChart = (chartType: ChartType) => {
    onSelectChartType(chartType);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-success-title"
    >
      <div className="bg-white dark:bg-[#1B231F] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-500/40 text-[var(--color-text-main,#1B241C)] flex flex-col my-auto transition-colors animate-in zoom-in-95 duration-200">
        
        {/* Celebration Header */}
        <div className="relative bg-gradient-to-br from-emerald-500/20 via-[var(--color-primary,#4A7347)]/15 to-teal-500/10 p-5 text-center border-b border-emerald-500/20">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/80 dark:bg-[#2A342D] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white dark:hover:bg-[#323E36] transition-colors shadow-2xs cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-2.5 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Import Complete &amp; Plotted</span>
          </div>

          <h2 id="import-success-title" className="text-lg sm:text-xl font-bold font-heading text-[var(--color-text-main)]">
            Measurements Added!
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            <strong>{profile.name}</strong>’s records are now plotted accurately along the WHO curves
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 bg-[var(--color-canvas,#FAF8F3)] dark:bg-[#121714]">
          
          {/* Metrics summary cards */}
          <div className="grid grid-cols-3 gap-2">
            {/* Head Circumference Card */}
            <div
              onClick={() => handleGoToChart('head')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                summary.headCount > 0
                  ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/60 hover:border-purple-400 shadow-2xs'
                  : 'bg-white dark:bg-[#1B231F] border-[var(--color-card-border)] opacity-60'
              }`}
            >
              <div className="w-7 h-7 mx-auto rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-1">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-[var(--color-text-main)]">
                {summary.headCount}
              </div>
              <div className="text-[10px] font-semibold text-[var(--color-text-muted)] truncate">
                Head Size
              </div>
            </div>

            {/* Weight Card */}
            <div
              onClick={() => handleGoToChart('weight')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                summary.weightCount > 0
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400 shadow-2xs'
                  : 'bg-white dark:bg-[#1B231F] border-[var(--color-card-border)] opacity-60'
              }`}
            >
              <div className="w-7 h-7 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-1">
                <Scale className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-[var(--color-text-main)]">
                {summary.weightCount}
              </div>
              <div className="text-[10px] font-semibold text-[var(--color-text-muted)] truncate">
                Weight
              </div>
            </div>

            {/* Length / Height Card */}
            <div
              onClick={() => handleGoToChart('height')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                summary.heightCount > 0
                  ? 'bg-teal-50/80 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/60 hover:border-teal-400 shadow-2xs'
                  : 'bg-white dark:bg-[#1B231F] border-[var(--color-card-border)] opacity-60'
              }`}
            >
              <div className="w-7 h-7 mx-auto rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-1">
                <Ruler className="w-4 h-4" />
              </div>
              <div className="text-base font-bold text-[var(--color-text-main)]">
                {summary.heightCount}
              </div>
              <div className="text-[10px] font-semibold text-[var(--color-text-muted)] truncate">
                Length
              </div>
            </div>
          </div>

          {/* Details Pill Box */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800/80">
              <span className="text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Profile</span>
              </span>
              <span className="font-bold text-[var(--color-text-main)]">
                {profile.name} (DOB: {profile.birthDate})
              </span>
            </div>

            {summary.dateStart && summary.dateEnd && (
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800/80">
                <span className="text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>Checkup Dates</span>
                </span>
                <span className="font-semibold text-[var(--color-text-main)]">
                  {summary.dateStart} → {summary.dateEnd}
                </span>
              </div>
            )}

            {summary.maxAgeMonths !== undefined && (
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800/80">
                <span className="text-[var(--color-text-muted)]">Timeline Range</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {summary.minAgeMonths ?? 0}m – {summary.maxAgeMonths}m milestones
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Storage</span>
              </span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                100% Local on Device
              </span>
            </div>
          </div>

          {/* Direct Graph Switch Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => handleGoToChart(summary.preferredChartType || (summary.headCount > 0 ? 'head' : 'weight'))}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>View On Growth Chart</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleGoToChart('head')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  summary.headCount > 0
                    ? 'border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50'
                    : 'border-[var(--color-card-border)] text-[var(--color-text-muted)] hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Head Size</span>
              </button>

              <button
                type="button"
                onClick={() => handleGoToChart('weight')}
                className="flex-1 py-2 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Weight</span>
              </button>

              <button
                type="button"
                onClick={() => handleGoToChart('height')}
                className="flex-1 py-2 px-3 rounded-xl border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100/50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Length</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
