import React, { useState } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit } from '../types/growth';
import {
  calculatePercentile,
  kgToLbsOz,
  cmToInches,
  calculateAge,
  formatOrdinal
} from '../data/whoGrowthStandards';
import {
  Scale,
  Ruler,
  CircleDot,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
  Calendar,
  Heart,
  ShieldCheck
} from 'lucide-react';

interface GrowthStoryProps {
  profile: BabyProfile;
  entries: GrowthEntry[];
  unit: MetricUnit;
  onOpenAddModal: () => void;
}

export const GrowthStory: React.FC<GrowthStoryProps> = ({
  profile,
  entries,
  unit,
  onOpenAddModal,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'height' | 'head'>('weight');

  // Sorted entries chronologically
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter entries having the selected metric
  const validEntries = sorted.filter((e) => {
    if (selectedMetric === 'weight') return e.weightKg !== undefined && e.weightKg > 0;
    if (selectedMetric === 'height') return e.heightCm !== undefined && e.heightCm > 0;
    if (selectedMetric === 'head') return e.headCircumferenceCm !== undefined && e.headCircumferenceCm > 0;
    return false;
  });

  const latest = validEntries[validEntries.length - 1];
  const previous = validEntries.length > 1 ? validEntries[validEntries.length - 2] : null;
  const first = validEntries[0];

  // Calculations
  let latestVal = 0;
  let prevVal = 0;
  let firstVal = 0;

  if (latest) {
    latestVal =
      selectedMetric === 'weight'
        ? latest.weightKg || 0
        : selectedMetric === 'height'
        ? latest.heightCm || 0
        : latest.headCircumferenceCm || 0;
  }

  if (previous) {
    prevVal =
      selectedMetric === 'weight'
        ? previous.weightKg || 0
        : selectedMetric === 'height'
        ? previous.heightCm || 0
        : previous.headCircumferenceCm || 0;
  }

  if (first) {
    firstVal =
      selectedMetric === 'weight'
        ? first.weightKg || 0
        : selectedMetric === 'height'
        ? first.heightCm || 0
        : first.headCircumferenceCm || 0;
  }

  const diffRecent = latest && previous ? latestVal - prevVal : null;
  const diffTotal = latest && first && validEntries.length > 1 ? latestVal - firstVal : null;

  // Days between latest and previous
  let daysBetween = 0;
  if (latest && previous) {
    const ms = new Date(latest.date).getTime() - new Date(previous.date).getTime();
    daysBetween = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  }

  // Percentiles
  const latestAge = latest ? calculateAge(profile.birthDate, latest.date) : null;
  const latestPercentile = latest
    ? calculatePercentile(selectedMetric, latestVal, latest.ageMonths, profile.gender)
    : null;

  // Formatting strings
  const formatValue = (val: number) => {
    if (selectedMetric === 'weight') {
      return unit === 'imperial'
        ? kgToLbsOz(val).displayStr
        : `${val.toFixed(2)} kg`;
    }
    return unit === 'imperial'
      ? `${cmToInches(val).toFixed(1)} in`
      : `${val.toFixed(1)} cm`;
  };

  const formatDelta = (delta: number) => {
    const sign = delta > 0 ? '+' : '';
    if (selectedMetric === 'weight') {
      if (unit === 'imperial') {
        const totalLbs = Math.abs(delta) * 2.20462;
        const lbs = Math.floor(totalLbs);
        const oz = Math.round((totalLbs - lbs) * 16 * 10) / 10;
        return `${sign}${delta >= 0 ? '' : '-'}${lbs > 0 ? `${lbs} lb ` : ''}${oz} oz`;
      }
      return `${sign}${(delta * 1000).toFixed(0)} g (${sign}${delta.toFixed(2)} kg)`;
    }
    if (unit === 'imperial') {
      return `${sign}${cmToInches(delta).toFixed(1)} in`;
    }
    return `${sign}${delta.toFixed(1)} cm`;
  };

  // Rule-based educational guidance (100% on-device local template)
  const generateNarrative = () => {
    if (!latest) {
      return `No ${selectedMetric} measurements recorded yet. Add your baby's first measurement to begin their growth story.`;
    }

    if (!previous) {
      return `Your first recorded ${selectedMetric} for ${profile.name} is ${formatValue(
        latestVal
      )} at ${latestAge?.displayStr || 'entry'}. The chart shows this is around the ${
        latestPercentile?.displayStr || '50th percentile'
      } on the official WHO standards. Growth is assessed across multiple visits over time, so log your next checkup to see their trajectory unfold.`;
    }

    const directionWord =
      diffRecent !== null && diffRecent > 0.05
        ? 'increased'
        : diffRecent !== null && diffRecent < -0.05
        ? 'slightly decreased'
        : 'remained steady';

    const recentChangeStr = diffRecent !== null ? formatDelta(diffRecent) : '';
    const totalGainStr = diffTotal !== null ? formatDelta(diffTotal) : '';

    return `${profile.name}’s recorded ${selectedMetric} ${directionWord} by ${recentChangeStr} over ${daysBetween} days (from ${previous.date} to ${latest.date}). Since the earliest log on ${first?.date}, total change is ${totalGainStr}.

On the WHO Child Growth Standards for ${profile.gender === 'boy' ? 'boys' : 'girls'}, this places ${profile.name} at the ${latestPercentile?.displayStr}. Children grow along their own unique percentile curves, and steady progress over time is what pediatricians watch for. Remember that percentiles are statistical reference points rather than a diagnosis of health.`;
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#91A98B]/30 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#5D7C57] font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Growth Story</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#303832]">
              Understanding {profile.name}’s Growth Journey
            </h2>
            <p className="text-xs text-[#6E7B6C] mt-1 max-w-xl">
              Understand how your baby’s measurements connect over time. Growth is evaluated through longitudinal trends, not single numbers.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F0] border border-[#91A98B]/30 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setSelectedMetric('weight')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedMetric === 'weight'
                  ? 'bg-[#91A98B] text-white shadow-2xs'
                  : 'text-[#303832] hover:bg-[#91A98B]/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Weight</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric('height')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedMetric === 'height'
                  ? 'bg-[#91A98B] text-white shadow-2xs'
                  : 'text-[#303832] hover:bg-[#91A98B]/10'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Length</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric('head')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedMetric === 'head'
                  ? 'bg-[#91A98B] text-white shadow-2xs'
                  : 'text-[#303832] hover:bg-[#91A98B]/10'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>Head</span>
            </button>
          </div>
        </div>
      </div>

      {validEntries.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 border border-[#91A98B]/30 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF9F0] text-[#5D7C57] flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-heading text-[#303832]">
            No {selectedMetric} records found
          </h3>
          <p className="text-xs text-[#6E7B6C] max-w-sm mx-auto">
            Log your baby's latest {selectedMetric} measurement to reveal their growth velocity, percentile comparisons, and milestone narrative.
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-[#91A98B] text-white rounded-xl text-xs font-bold hover:bg-[#7D9977] transition-all shadow-xs"
          >
            Add First {selectedMetric === 'weight' ? 'Weight' : selectedMetric === 'height' ? 'Length' : 'Head Size'}
          </button>
        </div>
      ) : (
        /* Detailed Metrics Story */
        <div className="space-y-6">
          {/* 3 Numerical Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Latest Recorded */}
            <div className="bg-white rounded-3xl p-5 border border-[#91A98B]/30 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E7B6C] block">
                  Latest Recorded Value
                </span>
                <div className="text-2xl font-extrabold font-heading text-[#303832] mt-1">
                  {formatValue(latestVal)}
                </div>
                <div className="text-xs text-[#6E7B6C] mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#91A98B]" />
                  <span>{latest?.date} ({latestAge?.displayStr})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#91A98B]/15 flex items-center justify-between text-xs">
                <span className="text-[#6E7B6C]">WHO Percentile:</span>
                <span className="font-bold text-[#5D7C57] bg-[#91A98B]/15 px-2.5 py-0.5 rounded-full">
                  {latestPercentile?.displayStr}
                </span>
              </div>
            </div>

            {/* Previous Recorded & Velocity */}
            <div className="bg-white rounded-3xl p-5 border border-[#91A98B]/30 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E7B6C] block">
                  Recent Velocity
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-extrabold font-heading text-[#303832]">
                    {diffRecent !== null ? formatDelta(diffRecent) : '—'}
                  </span>
                  {diffRecent !== null && (
                    <div className="p-1 rounded-lg bg-[#91A98B]/15 text-[#5D7C57]">
                      {diffRecent > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : diffRecent < 0 ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs text-[#6E7B6C] mt-1">
                  {previous
                    ? `From ${formatValue(prevVal)} on ${previous.date} (${daysBetween} days)`
                    : 'Log at least 2 entries to calculate velocity'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#91A98B]/15 text-xs text-[#6E7B6C] flex items-center justify-between">
                <span>Weekly Rate:</span>
                <span className="font-semibold text-[#303832]">
                  {diffRecent !== null && daysBetween > 0
                    ? `${formatDelta((diffRecent / daysBetween) * 7)} / wk`
                    : '—'}
                </span>
              </div>
            </div>

            {/* Total Gain Since Earliest */}
            <div className="bg-white rounded-3xl p-5 border border-[#91A98B]/30 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E7B6C] block">
                  Total Change Since Birth / First Log
                </span>
                <div className="text-2xl font-extrabold font-heading text-[#303832] mt-1">
                  {diffTotal !== null ? formatDelta(diffTotal) : formatValue(latestVal)}
                </div>
                <div className="text-xs text-[#6E7B6C] mt-1">
                  {first ? `Started at ${formatValue(firstVal)} on ${first.date}` : ''}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#91A98B]/15 text-xs text-[#6E7B6C] flex items-center justify-between">
                <span>Recorded Logs:</span>
                <span className="font-semibold text-[#303832]">
                  {validEntries.length} checkups
                </span>
              </div>
            </div>
          </div>

          {/* Educational Narrative Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#91A98B]/30 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F3C9B8]/40 text-[#9C5D47] flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold font-heading text-[#303832]">
                What this means for {profile.name}
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-[#303832] leading-relaxed whitespace-pre-line bg-[#FFF9F0]/60 p-5 rounded-2xl border border-[#91A98B]/20">
              {generateNarrative()}
            </div>

            {/* Disclaimer & Transparency */}
            <div className="flex items-start gap-2.5 text-[11px] text-[#6E7B6C] bg-white p-3 rounded-xl border border-stone-200/80">
              <Info className="w-4 h-4 text-[#91A98B] shrink-0 mt-0.5" />
              <span>
                <strong>Pediatric note:</strong> A baby who is naturally at the 25th percentile or the 85th percentile is just as healthy as one at the 50th, provided they grow along their own curve. If you have questions about feeding, growth rate, or curve shifts, discuss these measurements with your pediatrician.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
