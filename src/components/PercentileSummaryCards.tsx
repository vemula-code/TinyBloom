import React, { useMemo } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit, ChartType } from '../types/growth';
import { calculatePercentile, cmToInches, kgToLbsOz } from '../data/whoGrowthStandards';
import { Scale, Ruler, CircleDot, TrendingUp, TrendingDown } from 'lucide-react';

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
        gainStr = diffLbs >= 0 ? `+${diffLbs.toFixed(1)} lb` : `${diffLbs.toFixed(1)} lb`;
      } else {
        const diffG = Math.round(diffKg * 1000);
        gainStr = diffG >= 0 ? `+${diffG}g` : `${diffG}g`;
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
      displayVal = `${inches.toFixed(1)} in`;
    }

    if (previous?.headCircumferenceCm) {
      const diffCm = currentVal - previous.headCircumferenceCm;
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

  return (
    <div className="w-full">
      {/* 3 Metrics ALWAYS Side-by-Side in 3 columns on Mobile & Desktop */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full">
        {/* Metric 1: Weight */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('weight')}
          className={`flex flex-col justify-between p-2 sm:p-3.5 rounded-2xl text-left transition-all border relative cursor-pointer select-none active:scale-98 ${
            selectedMetric === 'weight'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 shadow-xs'
              : 'border-[var(--color-card-border,#E2E9E0)] bg-white dark:bg-[#1A221D] hover:border-[var(--color-primary)]/40 shadow-2xs'
          }`}
        >
          {/* Top row: Icon & Label */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 sm:gap-1.5 truncate">
              <span className={`p-1 rounded-lg shrink-0 ${selectedMetric === 'weight' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'}`}>
                <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </span>
              <span className="text-[10px] sm:text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wider truncate">
                Weight
              </span>
            </div>
            {selectedMetric === 'weight' && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-primary)] shrink-0 animate-pulse" />
            )}
          </div>

          {/* Middle: Big readable value */}
          <div className="my-1 sm:my-1.5">
            <span className="text-sm sm:text-lg font-extrabold font-heading text-[var(--color-text-main)] tracking-tight leading-tight block truncate">
              {weightData ? weightData.displayVal : '—'}
            </span>
          </div>

          {/* Bottom row: Percentile badge */}
          <div className="flex items-center justify-between gap-1 w-full text-[10px] sm:text-[11px]">
            <span className={`px-1.5 py-0.5 rounded-md font-semibold truncate ${selectedMetric === 'weight' ? 'bg-[var(--color-primary)] text-white font-bold' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'}`}>
              {weightData?.percentile || 'No data'}
            </span>
            {weightData?.gainStr && (
              <span className="hidden sm:inline font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {weightData.gainStr}
              </span>
            )}
          </div>
        </button>

        {/* Metric 2: Length / Height */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('height')}
          className={`flex flex-col justify-between p-2 sm:p-3.5 rounded-2xl text-left transition-all border relative cursor-pointer select-none active:scale-98 ${
            selectedMetric === 'height'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 shadow-xs'
              : 'border-[var(--color-card-border,#E2E9E0)] bg-white dark:bg-[#1A221D] hover:border-[var(--color-primary)]/40 shadow-2xs'
          }`}
        >
          {/* Top row: Icon & Label */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 sm:gap-1.5 truncate">
              <span className={`p-1 rounded-lg shrink-0 ${selectedMetric === 'height' ? 'bg-[var(--color-primary)] text-white' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'}`}>
                <Ruler className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </span>
              <span className="text-[10px] sm:text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wider truncate">
                Length
              </span>
            </div>
            {selectedMetric === 'height' && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-primary)] shrink-0 animate-pulse" />
            )}
          </div>

          {/* Middle: Big readable value */}
          <div className="my-1 sm:my-1.5">
            <span className="text-sm sm:text-lg font-extrabold font-heading text-[var(--color-text-main)] tracking-tight leading-tight block truncate">
              {heightData ? heightData.displayVal : '—'}
            </span>
          </div>

          {/* Bottom row: Percentile badge */}
          <div className="flex items-center justify-between gap-1 w-full text-[10px] sm:text-[11px]">
            <span className={`px-1.5 py-0.5 rounded-md font-semibold truncate ${selectedMetric === 'height' ? 'bg-[var(--color-primary)] text-white font-bold' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'}`}>
              {heightData?.percentile || 'No data'}
            </span>
            {heightData?.gainStr && (
              <span className="hidden sm:inline font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {heightData.gainStr}
              </span>
            )}
          </div>
        </button>

        {/* Metric 3: Head Circumference */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('head')}
          className={`flex flex-col justify-between p-2 sm:p-3.5 rounded-2xl text-left transition-all border relative cursor-pointer select-none active:scale-98 ${
            selectedMetric === 'head'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 shadow-xs'
              : 'border-[var(--color-card-border,#E2E9E0)] bg-white dark:bg-[#1A221D] hover:border-[var(--color-primary)]/40 shadow-2xs'
          }`}
        >
          {/* Top row: Icon & Label */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 sm:gap-1.5 truncate">
              <span className={`p-1 rounded-lg shrink-0 ${selectedMetric === 'head' ? 'bg-[var(--color-primary)] text-white' : 'bg-sky-500/15 text-sky-700 dark:text-sky-400'}`}>
                <CircleDot className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </span>
              <span className="text-[10px] sm:text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wider truncate">
                Head
              </span>
            </div>
            {selectedMetric === 'head' && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-primary)] shrink-0 animate-pulse" />
            )}
          </div>

          {/* Middle: Big readable value */}
          <div className="my-1 sm:my-1.5">
            <span className="text-sm sm:text-lg font-extrabold font-heading text-[var(--color-text-main)] tracking-tight leading-tight block truncate">
              {headData ? headData.displayVal : '—'}
            </span>
          </div>

          {/* Bottom row: Percentile badge */}
          <div className="flex items-center justify-between gap-1 w-full text-[10px] sm:text-[11px]">
            <span className={`px-1.5 py-0.5 rounded-md font-semibold truncate ${selectedMetric === 'head' ? 'bg-[var(--color-primary)] text-white font-bold' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'}`}>
              {headData?.percentile || 'No data'}
            </span>
            {headData?.gainStr && (
              <span className="hidden sm:inline font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {headData.gainStr}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
