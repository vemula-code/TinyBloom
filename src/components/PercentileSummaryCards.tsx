import React, { useMemo } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit, ChartType } from '../types/growth';
import { calculatePercentile, cmToInches, getCorrectedAgeMonths, kgToLbsOz } from '../data/whoGrowthStandards';
import { Scale, Ruler, CircleDot } from 'lucide-react';

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
    const effAge = getCorrectedAgeMonths(latest.ageMonths, profile.gestationalWeeks);
    const pInfo = calculatePercentile('weight', currentVal, effAge, profile.gender);

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
      percentile: `${pInfo.percentile}%`,
      percentileFull: pInfo.displayStr,
      status: pInfo.status,
      gainStr,
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  // Height / Length Data
  const heightData = useMemo(() => {
    if (!latest?.heightCm) return null;
    const currentVal = latest.heightCm;
    const effAge = getCorrectedAgeMonths(latest.ageMonths, profile.gestationalWeeks);
    const pInfo = calculatePercentile('height', currentVal, effAge, profile.gender);

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
      percentile: `${pInfo.percentile}%`,
      percentileFull: pInfo.displayStr,
      status: pInfo.status,
      gainStr,
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  // Head Circumference Data
  const headData = useMemo(() => {
    if (!latest?.headCircumferenceCm) return null;
    const currentVal = latest.headCircumferenceCm;
    const effAge = getCorrectedAgeMonths(latest.ageMonths, profile.gestationalWeeks);
    const pInfo = calculatePercentile('head', currentVal, effAge, profile.gender);

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
      percentile: `${pInfo.percentile}%`,
      percentileFull: pInfo.displayStr,
      status: pInfo.status,
      gainStr,
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  return (
    <div className="w-full">
      {/* 3 Metrics ALWAYS Side-by-Side in 3 columns on Mobile & Desktop */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full">
        {/* Metric 1: Weight */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('weight')}
          className={`flex flex-col justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-xl text-left transition-all border relative cursor-pointer select-none active:scale-98 ${
            selectedMetric === 'weight'
              ? 'border-[var(--color-primary)] ring-1.5 ring-[var(--color-primary)]/40 bg-[var(--color-primary-light)] shadow-xs'
              : 'border-[var(--color-card-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/40 shadow-2xs'
          }`}
        >
          {/* Top row: Icon & Label */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 min-w-0">
              <span className={`p-0.5 rounded shrink-0 ${selectedMetric === 'weight' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'}`}>
                <Scale className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold font-heading text-[var(--color-text-muted)] uppercase tracking-wide truncate">
                Weight
              </span>
            </div>
            {selectedMetric === 'weight' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
            )}
          </div>

          {/* Value + Percentile Badge (zero truncation) */}
          <div className="mt-1 flex items-baseline justify-between gap-1 w-full min-w-0">
            <span className="text-[12px] sm:text-sm font-extrabold font-heading text-[var(--color-text-main)] tracking-tight whitespace-nowrap">
              {weightData ? weightData.displayVal : '—'}
            </span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${selectedMetric === 'weight' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]'}`}>
              <span className="sm:hidden">{weightData?.percentile || '—'}</span>
              <span className="hidden sm:inline">{weightData?.percentileFull || '—'}</span>
            </span>
          </div>
        </button>

        {/* Metric 2: Length / Height */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('height')}
          className={`flex flex-col justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-xl text-left transition-all border relative cursor-pointer select-none active:scale-98 ${
            selectedMetric === 'height'
              ? 'border-[var(--color-primary)] ring-1.5 ring-[var(--color-primary)]/40 bg-[var(--color-primary-light)] shadow-xs'
              : 'border-[var(--color-card-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/40 shadow-2xs'
          }`}
        >
          {/* Top row: Icon & Label */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 min-w-0">
              <span className={`p-0.5 rounded shrink-0 ${selectedMetric === 'height' ? 'bg-[var(--color-primary)] text-white' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'}`}>
                <Ruler className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold font-heading text-[var(--color-text-muted)] uppercase tracking-wide truncate">
                Length
              </span>
            </div>
            {selectedMetric === 'height' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
            )}
          </div>

          {/* Value + Percentile Badge (zero truncation) */}
          <div className="mt-1 flex items-baseline justify-between gap-1 w-full min-w-0">
            <span className="text-[12px] sm:text-sm font-extrabold font-heading text-[var(--color-text-main)] tracking-tight whitespace-nowrap">
              {heightData ? heightData.displayVal : '—'}
            </span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${selectedMetric === 'height' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]'}`}>
              <span className="sm:hidden">{heightData?.percentile || '—'}</span>
              <span className="hidden sm:inline">{heightData?.percentileFull || '—'}</span>
            </span>
          </div>
        </button>

        {/* Metric 3: Head Circumference */}
        <button
          type="button"
          onClick={() => onSelectMetric && onSelectMetric('head')}
          className={`flex flex-col justify-between py-1.5 px-2 sm:py-2 sm:px-3 rounded-xl text-left transition-all border relative cursor-pointer select-none active:scale-98 ${
            selectedMetric === 'head'
              ? 'border-[var(--color-primary)] ring-1.5 ring-[var(--color-primary)]/40 bg-[var(--color-primary-light)] shadow-xs'
              : 'border-[var(--color-card-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/40 shadow-2xs'
          }`}
        >
          {/* Top row: Icon & Label */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 min-w-0">
              <span className={`p-0.5 rounded shrink-0 ${selectedMetric === 'head' ? 'bg-[var(--color-primary)] text-white' : 'bg-sky-500/15 text-sky-700 dark:text-sky-400'}`}>
                <CircleDot className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold font-heading text-[var(--color-text-muted)] uppercase tracking-wide truncate">
                Head
              </span>
            </div>
            {selectedMetric === 'head' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
            )}
          </div>

          {/* Value + Percentile Badge (zero truncation) */}
          <div className="mt-1 flex items-baseline justify-between gap-1 w-full min-w-0">
            <span className="text-[12px] sm:text-sm font-extrabold font-heading text-[var(--color-text-main)] tracking-tight whitespace-nowrap">
              {headData ? headData.displayVal : '—'}
            </span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${selectedMetric === 'head' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]'}`}>
              <span className="sm:hidden">{headData?.percentile || '—'}</span>
              <span className="hidden sm:inline">{headData?.percentileFull || '—'}</span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
