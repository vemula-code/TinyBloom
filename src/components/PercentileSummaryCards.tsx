import React, { useMemo } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit, ChartType } from '../types/growth';
import { calculatePercentile, cmToInches, kgToLbsOz } from '../data/whoGrowthStandards';
import { Scale, Ruler, CircleDot, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

interface PercentileSummaryCardsProps {
  entries: GrowthEntry[];
  profile: BabyProfile;
  unit: MetricUnit;
  selectedMetric?: ChartType;
  onSelectMetric?: (metric: ChartType) => void;
}

export const PercentileSummaryCards: React.FC<PercentileSummaryCardsProps> = ({
  entries,
  profile,
  unit,
  selectedMetric = 'weight',
  onSelectMetric,
}) => {
  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries]);

  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  // Weight Data
  const weightData = useMemo(() => {
    if (!latest?.weightKg) return null;
    const currentVal = latest.weightKg;
    const pInfo = calculatePercentile('weight', currentVal, latest.ageMonths, profile.gender);

    let displayVal = `${currentVal.toFixed(2)} kg`;
    let gainStr = '';
    let isPositive = true;

    if (unit === 'imperial') {
      const { displayStr } = kgToLbsOz(currentVal);
      displayVal = displayStr;
    }

    if (previous?.weightKg) {
      const diffKg = currentVal - previous.weightKg;
      isPositive = diffKg >= 0;
      if (unit === 'imperial') {
        const diffLbs = diffKg * 2.20462;
        gainStr = diffLbs >= 0 ? `+${diffLbs.toFixed(1)} lbs` : `${diffLbs.toFixed(1)} lbs`;
      } else {
        const diffG = Math.round(diffKg * 1000);
        gainStr = diffG >= 0 ? `+${diffG} g` : `${diffG} g`;
      }
    }

    return {
      displayVal,
      percentile: pInfo.displayStr,
      status: pInfo.status,
      gainStr,
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  // Height / Length Data
  const heightData = useMemo(() => {
    if (!latest?.heightCm) return null;
    const currentVal = latest.heightCm;
    const pInfo = calculatePercentile('height', currentVal, latest.ageMonths, profile.gender);

    let displayVal = `${currentVal.toFixed(1)} cm`;
    let gainStr = '';
    let isPositive = true;

    if (unit === 'imperial') {
      const inches = cmToInches(currentVal);
      displayVal = `${inches.toFixed(1)} in`;
    }

    if (previous?.heightCm) {
      const diffCm = currentVal - previous.heightCm;
      isPositive = diffCm >= 0;
      if (unit === 'imperial') {
        const diffIn = cmToInches(diffCm);
        gainStr = diffIn >= 0 ? `+${diffIn.toFixed(1)} in` : `${diffIn.toFixed(1)} in`;
      } else {
        gainStr = diffCm >= 0 ? `+${diffCm.toFixed(1)} cm` : `${diffCm.toFixed(1)} cm`;
      }
    }

    return {
      displayVal,
      percentile: pInfo.displayStr,
      status: pInfo.status,
      gainStr,
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  // Head Circumference Data
  const headData = useMemo(() => {
    if (!latest?.headCircumferenceCm) return null;
    const currentVal = latest.headCircumferenceCm;
    const pInfo = calculatePercentile('head', currentVal, latest.ageMonths, profile.gender);

    let displayVal = `${currentVal.toFixed(1)} cm`;
    let gainStr = '';
    let isPositive = true;

    if (unit === 'imperial') {
      const inches = cmToInches(currentVal);
      displayVal = `${inches.toFixed(2)} in`;
    }

    if (previous?.headCircumferenceCm) {
      const diffCm = currentVal - previous.headCircumferenceCm;
      isPositive = diffCm >= 0;
      if (unit === 'imperial') {
        const diffIn = cmToInches(diffCm);
        gainStr = diffIn >= 0 ? `+${diffIn.toFixed(2)} in` : `${diffIn.toFixed(2)} in`;
      } else {
        gainStr = diffCm >= 0 ? `+${diffCm.toFixed(1)} cm` : `${diffCm.toFixed(1)} cm`;
      }
    }

    return {
      displayVal,
      percentile: pInfo.displayStr,
      status: pInfo.status,
      gainStr,
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold px-1">
        <span className="text-[var(--color-text-muted)] uppercase tracking-wider text-[11px]">
          Select Metric to View WHO Chart Below:
        </span>
        <span className="text-[11px] text-[var(--color-primary)] font-medium hidden sm:inline">
          Tap card to switch curve
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Weight */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('weight')}
          className={`bg-white dark:bg-[#1A221D] rounded-2xl p-4 sm:p-5 text-left transition-all border shadow-2xs relative group cursor-pointer ${
            selectedMetric === 'weight'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-sm bg-[var(--color-primary)]/5'
              : 'border-[var(--color-card-border,#E2E9E0)] hover:border-[var(--color-primary)]/60'
          }`}
        >
          {selectedMetric === 'weight' && (
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-bold text-white bg-[var(--color-primary)] px-2 py-0.5 rounded-full shadow-2xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>Chart Active</span>
            </span>
          )}

          <div className="flex items-center justify-between pb-2 border-b border-[var(--color-card-border,#E2E9E0)]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] flex items-center justify-center">
                <Scale className="w-4 h-4 text-[var(--color-primary)]" />
              </span>
              <span className="text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wide">
                Weight
              </span>
            </div>
            {weightData?.gainStr && (
              <span
                className={`text-xs font-semibold font-mono flex items-center gap-1 ${
                  weightData.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {weightData.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{weightData.gainStr}</span>
              </span>
            )}
          </div>

          <div className="pt-2.5">
            <div className="text-xl sm:text-2xl font-extrabold font-heading text-[var(--color-text-main)] tracking-tight">
              {weightData ? weightData.displayVal : '—'}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <span className="font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/15 px-2 py-0.5 rounded-full text-[11px]">
                {weightData?.percentile || 'No data'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{weightData?.status || 'Tap to log'}</span>
            </div>
          </div>
        </button>

        {/* Card 2: Length / Height */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('height')}
          className={`bg-white dark:bg-[#1A221D] rounded-2xl p-4 sm:p-5 text-left transition-all border shadow-2xs relative group cursor-pointer ${
            selectedMetric === 'height'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-sm bg-[var(--color-primary)]/5'
              : 'border-[var(--color-card-border,#E2E9E0)] hover:border-[var(--color-primary)]/60'
          }`}
        >
          {selectedMetric === 'height' && (
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-bold text-white bg-[var(--color-primary)] px-2 py-0.5 rounded-full shadow-2xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>Chart Active</span>
            </span>
          )}

          <div className="flex items-center justify-between pb-2 border-b border-[var(--color-card-border,#E2E9E0)]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Ruler className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              </span>
              <span className="text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wide">
                Length / Height
              </span>
            </div>
            {heightData?.gainStr && (
              <span
                className={`text-xs font-semibold font-mono flex items-center gap-1 ${
                  heightData.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {heightData.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{heightData.gainStr}</span>
              </span>
            )}
          </div>

          <div className="pt-2.5">
            <div className="text-xl sm:text-2xl font-extrabold font-heading text-[var(--color-text-main)] tracking-tight">
              {heightData ? heightData.displayVal : '—'}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <span className="font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/15 px-2 py-0.5 rounded-full text-[11px]">
                {heightData?.percentile || 'No data'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{heightData?.status || 'Tap to log'}</span>
            </div>
          </div>
        </button>

        {/* Card 3: Head Circumference */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('head')}
          className={`bg-white dark:bg-[#1A221D] rounded-2xl p-4 sm:p-5 text-left transition-all border shadow-2xs relative group cursor-pointer ${
            selectedMetric === 'head'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-sm bg-[var(--color-primary)]/5'
              : 'border-[var(--color-card-border,#E2E9E0)] hover:border-[var(--color-primary)]/60'
          }`}
        >
          {selectedMetric === 'head' && (
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-bold text-white bg-[var(--color-primary)] px-2 py-0.5 rounded-full shadow-2xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>Chart Active</span>
            </span>
          )}

          <div className="flex items-center justify-between pb-2 border-b border-[var(--color-card-border,#E2E9E0)]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-800 dark:text-sky-300 flex items-center justify-center">
                <CircleDot className="w-4 h-4 text-sky-700 dark:text-sky-400" />
              </span>
              <span className="text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wide">
                Head Size
              </span>
            </div>
            {headData?.gainStr && (
              <span
                className={`text-xs font-semibold font-mono flex items-center gap-1 ${
                  headData.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {headData.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{headData.gainStr}</span>
              </span>
            )}
          </div>

          <div className="pt-2.5">
            <div className="text-xl sm:text-2xl font-extrabold font-heading text-[var(--color-text-main)] tracking-tight">
              {headData ? headData.displayVal : '—'}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <span className="font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/15 px-2 py-0.5 rounded-full text-[11px]">
                {headData?.percentile || 'No data'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{headData?.status || 'Tap to log'}</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
