import React, { useMemo } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit } from '../types/growth';
import { calculatePercentile, cmToInches, kgToLbsOz } from '../data/whoGrowthStandards';
import { TrendingUp, Scale, Ruler, CircleDot } from 'lucide-react';

interface PercentileSummaryCardsProps {
  entries: GrowthEntry[];
  profile: BabyProfile;
  unit: MetricUnit;
}

export const PercentileSummaryCards: React.FC<PercentileSummaryCardsProps> = ({
  entries,
  profile,
  unit,
}) => {
  // Sort entries chronologically
  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries]);

  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  // Weight card calculations
  const weightData = useMemo(() => {
    if (!latest?.weightKg) return null;
    const currentVal = latest.weightKg;
    const pInfo = calculatePercentile('weight', currentVal, latest.ageMonths, profile.gender);
    
    let displayVal = `${currentVal.toFixed(2)} kg`;
    let gainStr = '';

    if (unit === 'imperial') {
      const { displayStr } = kgToLbsOz(currentVal);
      displayVal = displayStr;
    }

    if (previous?.weightKg) {
      const diffKg = currentVal - previous.weightKg;
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
    };
  }, [latest, previous, unit, profile.gender]);

  // Height card calculations
  const heightData = useMemo(() => {
    if (!latest?.heightCm) return null;
    const currentVal = latest.heightCm;
    const pInfo = calculatePercentile('height', currentVal, latest.ageMonths, profile.gender);

    let displayVal = `${currentVal.toFixed(1)} cm`;
    let gainStr = '';

    if (unit === 'imperial') {
      displayVal = `${cmToInches(currentVal).toFixed(1)} in`;
    }

    if (previous?.heightCm) {
      const diffCm = currentVal - previous.heightCm;
      if (unit === 'imperial') {
        const diffIn = diffCm / 2.54;
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
    };
  }, [latest, previous, unit, profile.gender]);

  // Head circumference card calculations
  const headData = useMemo(() => {
    if (!latest?.headCircumferenceCm) return null;
    const currentVal = latest.headCircumferenceCm;
    const pInfo = calculatePercentile('head', currentVal, latest.ageMonths, profile.gender);

    let displayVal = `${currentVal.toFixed(1)} cm`;
    let gainStr = '';

    if (unit === 'imperial') {
      displayVal = `${cmToInches(currentVal).toFixed(1)} in`;
    }

    if (previous?.headCircumferenceCm) {
      const diffCm = currentVal - previous.headCircumferenceCm;
      if (unit === 'imperial') {
        const diffIn = diffCm / 2.54;
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
    };
  }, [latest, previous, unit, profile.gender]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Weight Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition-all hover:border-stone-300">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
              Weight
            </span>
          </div>
          {weightData?.gainStr && (
            <span className="text-xs font-medium text-emerald-700 font-mono">
              {weightData.gainStr}
            </span>
          )}
        </div>

        <div className="pt-3">
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums tracking-tight">
            {weightData ? weightData.displayVal : '—'}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-teal-700">{weightData?.percentile || '—'}</span>
            <span aria-hidden="true">·</span>
            <span>{weightData?.status || 'No data'}</span>
          </div>
        </div>
      </div>

      {/* Length / Height Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition-all hover:border-stone-300">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
              Length / Height
            </span>
          </div>
          {heightData?.gainStr && (
            <span className="text-xs font-medium text-emerald-700 font-mono">
              {heightData.gainStr}
            </span>
          )}
        </div>

        <div className="pt-3">
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums tracking-tight">
            {heightData ? heightData.displayVal : '—'}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-teal-700">{heightData?.percentile || '—'}</span>
            <span aria-hidden="true">·</span>
            <span>{heightData?.status || 'No data'}</span>
          </div>
        </div>
      </div>

      {/* Head Circumference Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition-all hover:border-stone-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CircleDot className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
              Head Circumference
            </span>
          </div>
          {headData?.gainStr && (
            <span className="text-xs font-medium text-emerald-700 font-mono">
              {headData.gainStr}
            </span>
          )}
        </div>

        <div className="pt-3">
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums tracking-tight">
            {headData ? headData.displayVal : '—'}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-teal-700">{headData?.percentile || '—'}</span>
            <span aria-hidden="true">·</span>
            <span>{headData?.status || 'No data'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
