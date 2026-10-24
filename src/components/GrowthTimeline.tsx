import React from 'react';
import { GrowthEntry, MetricUnit, Gender } from '../types/growth';
import { calculatePercentile, cmToInches, kgToLbsOz } from '../data/whoGrowthStandards';
import { Edit2, Trash2, Stethoscope, Sparkles, Calendar, Image as ImageIcon } from 'lucide-react';

interface GrowthTimelineProps {
  entries: GrowthEntry[];
  gender: Gender;
  unit: MetricUnit;
  onEdit: (entry: GrowthEntry) => void;
  onDelete: (id: string) => void;
  onAddFirstEntry: () => void;
}

export const GrowthTimeline: React.FC<GrowthTimelineProps> = ({
  entries,
  gender,
  unit,
  onEdit,
  onDelete,
  onAddFirstEntry,
}) => {
  // Sort descending by date (most recent first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-800">No Growth Records Logged Yet</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          Start recording monthly weight, height, and head circumference measurements to see WHO percentiles.
        </p>
        <button
          type="button"
          onClick={onAddFirstEntry}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors"
        >
          Add First Measurement
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => {
        // Formatted metrics
        const weightP = entry.weightKg
          ? calculatePercentile('weight', entry.weightKg, entry.ageMonths, gender)
          : null;
        const heightP = entry.heightCm
          ? calculatePercentile('height', entry.heightCm, entry.ageMonths, gender)
          : null;
        const headP = entry.headCircumferenceCm
          ? calculatePercentile('head', entry.headCircumferenceCm, entry.ageMonths, gender)
          : null;

        let weightStr = entry.weightKg ? `${entry.weightKg.toFixed(2)} kg` : null;
        if (entry.weightKg && unit === 'imperial') {
          weightStr = kgToLbsOz(entry.weightKg).displayStr;
        }

        let heightStr = entry.heightCm ? `${entry.heightCm.toFixed(1)} cm` : null;
        if (entry.heightCm && unit === 'imperial') {
          heightStr = `${cmToInches(entry.heightCm).toFixed(1)} in`;
        }

        let headStr = entry.headCircumferenceCm ? `${entry.headCircumferenceCm.toFixed(1)} cm` : null;
        if (entry.headCircumferenceCm && unit === 'imperial') {
          headStr = `${cmToInches(entry.headCircumferenceCm).toFixed(1)} in`;
        }

        return (
          <div
            key={entry.id}
            className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition-all hover:border-stone-300 relative"
          >
            {/* Top row: Age, Date, Doctor checkup, Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">
                  {entry.ageMonths === 0 ? 'Birth / Newborn' : `${entry.ageMonths} Months`}
                </span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500 font-mono">{entry.date}</span>
                {entry.isPediatricianVisit && (
                  <>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                      <Stethoscope className="w-3 h-3" />
                      Pediatrician Visit
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(entry)}
                  aria-label="Edit record"
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  aria-label="Delete record"
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle row: 3 Metric blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-b border-stone-100">
              {/* Weight */}
              <div>
                <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                  Weight
                </span>
                <div className="text-base font-bold text-stone-900 font-mono tabular-nums">
                  {weightStr || '—'}
                </div>
                {weightP && (
                  <span className="text-[11px] text-teal-700 font-medium">
                    {weightP.displayStr}
                  </span>
                )}
              </div>

              {/* Height */}
              <div>
                <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                  Length / Height
                </span>
                <div className="text-base font-bold text-stone-900 font-mono tabular-nums">
                  {heightStr || '—'}
                </div>
                {heightP && (
                  <span className="text-[11px] text-teal-700 font-medium">
                    {heightP.displayStr}
                  </span>
                )}
              </div>

              {/* Head Circumference */}
              <div>
                <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                  Head Circumference
                </span>
                <div className="text-base font-bold text-stone-900 font-mono tabular-nums">
                  {headStr || '—'}
                </div>
                {headP && (
                  <span className="text-[11px] text-teal-700 font-medium">
                    {headP.displayStr}
                  </span>
                )}
              </div>
            </div>

            {/* Notes & Milestones Content */}
            <div className="pt-3 flex flex-col md:flex-row gap-4">
              {/* Photo if present */}
              {entry.photoUrl && (
                <div className="shrink-0">
                  <img
                    src={entry.photoUrl}
                    alt="Growth moment"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-200 shadow-xs"
                  />
                </div>
              )}

              <div className="grow space-y-2">
                {/* Notes */}
                {entry.notes && (
                  <p className="text-xs text-stone-700 leading-relaxed bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                    {entry.notes}
                  </p>
                )}

                {/* Milestones tags */}
                {entry.milestones && entry.milestones.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 mr-1">
                      <Sparkles className="w-3 h-3" /> Milestones:
                    </span>
                    {entry.milestones.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
