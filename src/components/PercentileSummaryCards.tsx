import React, { useMemo } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit } from '../types/growth';
import { calculatePercentile, cmToInches, kgToLbsOz } from '../data/whoGrowthStandards';
import { Scale, Ruler, CircleDot, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries]);

  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  // Weight
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

  // Height / Length
  const heightData = useMemo(() => {
    if (!latest?.heightCm) return null;
    const currentVal = latest.heightCm;
    const pInfo = calculatePercentile('height', currentVal, latest.ageMonths, profile.gender);

    let displayVal = `${currentVal.toFixed(1)} cm`;
    let gainStr = '';
    let isPositive = true;

    if (unit === 'imperial') {
      displayVal = `${cmToInches(currentVal).toFixed(1)} in`;
    }

    if (previous?.heightCm) {
      const diffCm = currentVal - previous.heightCm;
      isPositive = diffCm >= 0;
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
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  // Head Circumference
  const headData = useMemo(() => {
    if (!latest?.headCircumferenceCm) return null;
    const currentVal = latest.headCircumferenceCm;
    const pInfo = calculatePercentile('head', currentVal, latest.ageMonths, profile.gender);

    let displayVal = `${currentVal.toFixed(1)} cm`;
    let gainStr = '';
    let isPositive = true;

    if (unit === 'imperial') {
      displayVal = `${cmToInches(currentVal).toFixed(1)} in`;
    }

    if (previous?.headCircumferenceCm) {
      const diffCm = currentVal - previous.headCircumferenceCm;
      isPositive = diffCm >= 0;
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
      isPositive,
    };
  }, [latest, previous, unit, profile.gender]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Weight Card */}
      <div className="bg-white rounded-3xl border border-[#91A98B]/30 p-5 shadow-2xs transition-all hover:border-[#91A98B]/50">
        <div className="flex items-center justify-between pb-3 border-b border-[#91A98B]/15">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#91A98B]/20 text-[#3D5939] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wide">
              Weight
            </span>
          </div>
          {weightData?.gainStr && (
            <span
              className={`text-xs font-semibold font-mono flex items-center gap-1 ${
                weightData.isPositive ? 'text-[#5D7C57]' : 'text-amber-700'
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

        <div className="pt-3">
          <div className="text-2xl font-extrabold font-heading text-[#303832] tracking-tight">
            {weightData ? weightData.displayVal : '—'}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#6E7B6C]">
            <span className="font-bold text-[#5D7C57] bg-[#91A98B]/15 px-2 py-0.5 rounded-full">
              {weightData?.percentile || 'No data'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{weightData?.status || 'Add log'}</span>
          </div>
        </div>
      </div>

      {/* Length / Height Card */}
      <div className="bg-white rounded-3xl border border-[#91A98B]/30 p-5 shadow-2xs transition-all hover:border-[#91A98B]/50">
        <div className="flex items-center justify-between pb-3 border-b border-[#91A98B]/15">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#F3C9B8]/40 text-[#9C5D47] flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wide">
              Length / Height
            </span>
          </div>
          {heightData?.gainStr && (
            <span
              className={`text-xs font-semibold font-mono flex items-center gap-1 ${
                heightData.isPositive ? 'text-[#5D7C57]' : 'text-amber-700'
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

        <div className="pt-3">
          <div className="text-2xl font-extrabold font-heading text-[#303832] tracking-tight">
            {heightData ? heightData.displayVal : '—'}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#6E7B6C]">
            <span className="font-bold text-[#5D7C57] bg-[#91A98B]/15 px-2 py-0.5 rounded-full">
              {heightData?.percentile || 'No data'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{heightData?.status || 'Add log'}</span>
          </div>
        </div>
      </div>

      {/* Head Circumference Card */}
      <div className="bg-white rounded-3xl border border-[#91A98B]/30 p-5 shadow-2xs transition-all hover:border-[#91A98B]/50 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between pb-3 border-b border-[#91A98B]/15">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#AFCDE0]/40 text-[#326180] flex items-center justify-center">
              <CircleDot className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wide">
              Head Circumference
            </span>
          </div>
          {headData?.gainStr && (
            <span
              className={`text-xs font-semibold font-mono flex items-center gap-1 ${
                headData.isPositive ? 'text-[#5D7C57]' : 'text-amber-700'
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

        <div className="pt-3">
          <div className="text-2xl font-extrabold font-heading text-[#303832] tracking-tight">
            {headData ? headData.displayVal : '—'}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#6E7B6C]">
            <span className="font-bold text-[#5D7C57] bg-[#91A98B]/15 px-2 py-0.5 rounded-full">
              {headData?.percentile || 'No data'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{headData?.status || 'Add log'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
