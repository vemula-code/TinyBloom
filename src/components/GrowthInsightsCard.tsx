import React, { useMemo } from 'react';
import { BabyProfile, ChartType, GrowthEntry, MetricUnit } from '../types/growth';
import {
  calculatePercentile,
  cmToInches,
  getCorrectedAgeMonths,
  isPretermProfile,
  kgToLbsOz,
} from '../data/whoGrowthStandards';
import { ArrowRight, Heart, Sparkles, TrendingUp, Activity, Stethoscope } from 'lucide-react';

interface GrowthInsightsCardProps {
  profile: BabyProfile;
  entries: GrowthEntry[];
  activeChartType: ChartType;
  unit: MetricUnit;
  onOpenDetailedAnalysis: () => void;
  onOpenHistory: () => void;
}

export const GrowthInsightsCard: React.FC<GrowthInsightsCardProps> = ({
  profile,
  entries,
  activeChartType,
  unit,
  onOpenDetailedAnalysis,
  onOpenHistory,
}) => {
  const metricLabel =
    activeChartType === 'weight'
      ? 'Weight'
      : activeChartType === 'height'
      ? 'Length / Height'
      : 'Head Size';

  const preterm = isPretermProfile(profile.gestationalWeeks);

  const insights = useMemo(() => {
    const sorted = [...entries]
      .filter((e) => {
        if (activeChartType === 'weight') return e.weightKg !== undefined && e.weightKg > 0;
        if (activeChartType === 'height') return e.heightCm !== undefined && e.heightCm > 0;
        return e.headCircumferenceCm !== undefined && e.headCircumferenceCm > 0;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sorted.length === 0) {
      return null;
    }

    const getVal = (e: GrowthEntry) => {
      if (activeChartType === 'weight') return e.weightKg || 0;
      if (activeChartType === 'height') return e.heightCm || 0;
      return e.headCircumferenceCm || 0;
    };

    const latest = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

    const latestVal = getVal(latest);
    const latestEffAge = getCorrectedAgeMonths(latest.ageMonths, profile.gestationalWeeks);
    const latestPct = calculatePercentile(activeChartType, latestVal, latestEffAge, profile.gender);

    // Compute delta & pace against previous entry
    let deltaHeadline = 'First baseline measurement logged';
    let paceText = 'Add a second measurement to see growth pace';

    if (previous) {
      const prevVal = getVal(previous);
      const diff = latestVal - prevVal;
      const ms = new Date(latest.date).getTime() - new Date(previous.date).getTime();
      const days = Math.max(1, Math.round(ms / 86400000));

      if (activeChartType === 'weight') {
        if (unit === 'imperial') {
          const diffOz = Math.round(diff * 35.27396 * 10) / 10;
          const sign = diffOz >= 0 ? '+' : '';
          deltaHeadline = `${sign}${diffOz} oz since prior log`;
        } else {
          const diffG = Math.round(diff * 1000);
          const sign = diffG >= 0 ? '+' : '';
          deltaHeadline = `${sign}${diffG} g since prior log`;
        }

        if (days >= 4) {
          if (unit === 'imperial') {
            const ozPerWk = ((diff * 35.27396) / days) * 7;
            paceText = `${ozPerWk >= 0 ? '+' : ''}${ozPerWk.toFixed(1)} oz/wk over ${days}d`;
          } else {
            const gPerDay = Math.round((diff * 1000) / days);
            paceText = `${gPerDay >= 0 ? '+' : ''}${gPerDay} g/day over ${days}d`;
          }
        } else {
          paceText = `${days} day${days === 1 ? '' : 's'} apart`;
        }
      } else {
        if (unit === 'imperial') {
          const diffIn = cmToInches(diff);
          const sign = diffIn >= 0 ? '+' : '';
          deltaHeadline = `${sign}${diffIn.toFixed(1)} in since prior log`;
          if (days >= 14) {
            const inPerMo = (diffIn / days) * 30.4;
            paceText = `${inPerMo >= 0 ? '+' : ''}${inPerMo.toFixed(2)} in/mo over ${days}d`;
          } else {
            paceText = `Over ${days} day${days === 1 ? '' : 's'}`;
          }
        } else {
          const sign = diff >= 0 ? '+' : '';
          deltaHeadline = `${sign}${diff.toFixed(1)} cm since prior log`;
          if (days >= 14) {
            const cmPerMo = (diff / days) * 30.4;
            paceText = `${cmPerMo >= 0 ? '+' : ''}${cmPerMo.toFixed(1)} cm/mo over ${days}d`;
          } else {
            paceText = `Over ${days} day${days === 1 ? '' : 's'}`;
          }
        }
      }
    }

    // Percentile consistency over last up-to-4 measurements
    const windowEntries = sorted.slice(-4);
    const windowPcts = windowEntries.map((e) => {
      const effAge = getCorrectedAgeMonths(e.ageMonths, profile.gestationalWeeks);
      return calculatePercentile(activeChartType, getVal(e), effAge, profile.gender).percentile;
    });
    const minP = Math.min(...windowPcts);
    const maxP = Math.max(...windowPcts);
    const spread = maxP - minP;

    let bandSummary = `Currently at the ${latestPct.displayStr}`;
    let clinicalContext = `${profile.name} has 1 measurement logged so far. Logging over time reveals their personal percentile channel.`;

    if (windowPcts.length >= 2) {
      if (spread <= 14) {
        bandSummary = `Steady channel (${minP}th–${maxP}th %)`;
        clinicalContext = `${profile.name} is tracking very consistently along their own curve across the last ${windowPcts.length} entries—exactly what pediatricians look for.`;
      } else {
        bandSummary = `Range ${minP}th–${maxP}th % (now ${latestPct.percentile}th)`;
        clinicalContext = `Small shifts between measurements often reflect growth spurts or normal home vs. clinic scale differences. Look at the overall multi-month trend.`;
      }
    }

    const clinicCount = sorted.filter((e) => e.isPediatricianVisit).length;

    return {
      totalCount: sorted.length,
      clinicCount,
      latestFormatted:
        activeChartType === 'weight'
          ? unit === 'imperial'
            ? kgToLbsOz(latestVal).displayStr
            : `${latestVal.toFixed(2)} kg`
          : unit === 'imperial'
          ? `${cmToInches(latestVal).toFixed(1)} in`
          : `${latestVal.toFixed(1)} cm`,
      deltaHeadline,
      paceText,
      bandSummary,
      clinicalContext,
      recentLogs: sorted.slice(-3).reverse(),
    };
  }, [entries, activeChartType, unit, profile.gender, profile.name, profile.gestationalWeeks]);

  return (
    <div className="bg-[var(--color-card)] rounded-3xl p-4 sm:p-6 border border-[var(--color-card-border)] shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-card-border)] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-heading text-[var(--color-text-main)]">
              {profile.name}’s {metricLabel} Insights
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              {preterm
                ? `Computed using corrected age (${profile.gestationalWeeks} wks at birth)`
                : 'Live pace & trajectory computed from your measurements'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenHistory}
            className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] cursor-pointer"
          >
            All Logs ({entries.length})
          </button>
          <button
            type="button"
            onClick={onOpenDetailedAnalysis}
            className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Detailed Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real Computed Metrics Grid */}
      {insights ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-card-border)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                Recent Change &amp; Pace
              </span>
              <div className="text-sm font-bold text-[var(--color-text-main)] mt-0.5">
                {insights.deltaHeadline}
              </div>
              <div className="text-[11px] text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-semibold mt-0.5">
                {insights.paceText}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-card-border)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                WHO Curve Channel
              </span>
              <div className="text-sm font-bold text-[var(--color-text-main)] mt-0.5">
                {insights.bandSummary}
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1.5">
                <span>{insights.totalCount} total</span>
                {insights.clinicCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-semibold">
                      <Stethoscope className="w-3 h-3" />
                      {insights.clinicCount} clinic
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Reassuring Personalized Context */}
      <div className="p-3.5 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-card-border)] space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
          <span>Percentile Perspective</span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          {insights
            ? insights.clinicalContext
            : `Log your first ${metricLabel.toLowerCase()} measurement to unlock real pace tracking and WHO curve insights.`}
        </p>
      </div>
    </div>
  );
};
