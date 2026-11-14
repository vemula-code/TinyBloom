import React, { useState } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit } from '../types/growth';
import {
  calculatePercentile,
  calculateAge,
  kgToLbsOz,
  cmToInches,
} from '../data/whoGrowthStandards';
import {
  Calendar,
  Search,
  ArrowUpDown,
  Edit2,
  Trash2,
  Plus,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MeasurementHistoryProps {
  profile: BabyProfile;
  entries: GrowthEntry[];
  unit: MetricUnit;
  onEditEntry: (entry: GrowthEntry) => void;
  onDeleteEntry: (id: string) => void;
  onOpenAddModal: () => void;
}

export const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({
  profile,
  entries,
  unit,
  onEditEntry,
  onDeleteEntry,
  onOpenAddModal,
}) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'visits' | 'milestones'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter & Sort
  const filtered = entries
    .filter((e) => {
      if (filterType === 'visits' && !e.isPediatricianVisit) return false;
      if (filterType === 'milestones' && (!e.milestones || e.milestones.length === 0)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDate = e.date.includes(q);
        const matchesNotes = (e.notes || '').toLowerCase().includes(q);
        const matchesMilestones = (e.milestones || []).some((m) => m.toLowerCase().includes(q));
        return matchesDate || matchesNotes || matchesMilestones;
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const handleDelete = (id: string) => {
    onDeleteEntry(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[var(--color-card)] rounded-3xl p-6 border border-[var(--color-card-border)] shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-semibold text-xs tracking-wider uppercase mb-1">
              <Calendar className="w-4 h-4" />
              <span>Audit-Friendly Growth Log</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-text-main)]">
              Measurement History ({entries.length})
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              All growth entries recorded on this device. Edit, correct, or export anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Measurement</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t border-[var(--color-card-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search date, notes, or milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--color-canvas)] border border-[var(--color-card-border)] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text-main)]"
            />
          </div>

          {/* Filter Pills & Sort Toggle */}
          <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-[var(--color-canvas)] p-1 rounded-xl border border-[var(--color-card-border)] text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[var(--color-primary)] text-white font-semibold shadow-2xs'
                    : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface)]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('visits')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === 'visits'
                    ? 'bg-[var(--color-primary)] text-white font-semibold shadow-2xs'
                    : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface)]'
                }`}
              >
                Pediatrician Visits
              </button>
              <button
                type="button"
                onClick={() => setFilterType('milestones')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === 'milestones'
                    ? 'bg-[var(--color-primary)] text-white font-semibold shadow-2xs'
                    : 'text-[var(--color-text-main)] hover:bg-[var(--color-surface)]'
                }`}
              >
                Milestones
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-card-border)] hover:bg-[var(--color-surface)] text-[var(--color-text-main)] rounded-xl text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--color-card)] rounded-3xl p-6 border border-[var(--color-card-border)] max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-[var(--color-text-main)]">
                Delete this measurement?
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                This record will be permanently removed from your charts and history. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-xs font-semibold text-[var(--color-text-main)] bg-[var(--color-surface)] hover:opacity-85 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Cards / Table */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--color-card)] text-[var(--color-text-main)] rounded-3xl p-10 border border-[var(--color-card-border)] text-center space-y-3">
          <p className="text-sm font-semibold text-[var(--color-text-main)]">No matching records found.</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {searchQuery ? 'Try clearing your search terms.' : 'Start logging growth measurements above.'}
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE CARD VIEW: Clean, single-column responsive cards for phone screens */}
          <div className="block sm:hidden space-y-3">
            {filtered.map((entry) => {
              const age = calculateAge(profile.birthDate, entry.date);

              // Weight
              let weightStr = '—';
              let weightP = null;
              if (entry.weightKg) {
                weightStr =
                  unit === 'imperial'
                    ? kgToLbsOz(entry.weightKg).displayStr
                    : `${entry.weightKg.toFixed(2)} kg`;
                weightP = calculatePercentile('weight', entry.weightKg, entry.ageMonths, profile.gender);
              }

              // Height
              let heightStr = '—';
              let heightP = null;
              if (entry.heightCm) {
                heightStr =
                  unit === 'imperial'
                    ? `${cmToInches(entry.heightCm).toFixed(1)} in`
                    : `${entry.heightCm.toFixed(1)} cm`;
                heightP = calculatePercentile('height', entry.heightCm, entry.ageMonths, profile.gender);
              }

              // Head
              let headStr = '—';
              let headP = null;
              if (entry.headCircumferenceCm) {
                headStr =
                  unit === 'imperial'
                    ? `${cmToInches(entry.headCircumferenceCm).toFixed(1)} in`
                    : `${entry.headCircumferenceCm.toFixed(1)} cm`;
                headP = calculatePercentile('head', entry.headCircumferenceCm, entry.ageMonths, profile.gender);
              }

              return (
                <div
                  key={entry.id}
                  className="bg-[var(--color-card)] text-[var(--color-text-main)] rounded-2xl border border-[var(--color-card-border)] p-3.5 shadow-2xs space-y-2.5"
                >
                  {/* Card Header: Date, Age, Checkup & Action buttons */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--color-card-border)]/50">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[var(--color-text-main)]">
                        {entry.date}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)] font-medium bg-[var(--color-canvas)] px-1.5 py-0.5 rounded-md border border-[var(--color-card-border)]/60">
                        {age.displayStr} old
                      </span>
                      {entry.isPediatricianVisit && (
                        <span
                          title="Pediatrician Visit"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-700 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/50"
                        >
                          <Stethoscope className="w-2.5 h-2.5" />
                          <span>Clinic</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditEntry(entry)}
                        title="Edit measurement"
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(entry.id)}
                        title="Delete measurement"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3 Metric Blocks: Side-by-Side on Mobile */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-xl bg-[var(--color-canvas)]/70 border border-[var(--color-card-border)]/50">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] block truncate">
                        Weight
                      </span>
                      <div className="text-xs font-mono font-bold text-[var(--color-text-main)] truncate">
                        {weightStr}
                      </div>
                      {weightP && (
                        <div className="text-[9px] text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-semibold truncate">
                          {weightP.displayStr}
                        </div>
                      )}
                    </div>

                    <div className="p-1.5 rounded-xl bg-[var(--color-canvas)]/70 border border-[var(--color-card-border)]/50">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] block truncate">
                        Length
                      </span>
                      <div className="text-xs font-mono font-bold text-[var(--color-text-main)] truncate">
                        {heightStr}
                      </div>
                      {heightP && (
                        <div className="text-[9px] text-amber-700 dark:text-amber-400 font-semibold truncate">
                          {heightP.displayStr}
                        </div>
                      )}
                    </div>

                    <div className="p-1.5 rounded-xl bg-[var(--color-canvas)]/70 border border-[var(--color-card-border)]/50">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] block truncate">
                        Head
                      </span>
                      <div className="text-xs font-mono font-bold text-[var(--color-text-main)] truncate">
                        {headStr}
                      </div>
                      {headP && (
                        <div className="text-[9px] text-sky-700 dark:text-sky-400 font-semibold truncate">
                          {headP.displayStr}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes & Milestones */}
                  {(entry.notes || (entry.milestones && entry.milestones.length > 0)) && (
                    <div className="pt-1.5 border-t border-[var(--color-card-border)]/40 space-y-1 text-xs">
                      {entry.milestones && entry.milestones.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.milestones.map((m, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#F5D77A]/20 text-[#856514] dark:text-[#F5D77A] text-[9px] font-semibold border border-amber-300/40"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{m}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.notes && (
                        <p className="text-[11px] text-[var(--color-text-muted)] italic line-clamp-2">
                          &ldquo;{entry.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW: For tablet & desktop screens */}
          <div className="hidden sm:block bg-[var(--color-card)] text-[var(--color-text-main)] rounded-3xl border border-[var(--color-card-border)] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-canvas)] text-[var(--color-text-main)] font-heading font-bold border-b border-[var(--color-card-border)]">
                  <tr>
                    <th className="py-3 px-4">Date & Age</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Length</th>
                    <th className="py-3 px-4">Head Size</th>
                    <th className="py-3 px-4">Notes & Milestones</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-card-border)]/60">
                  {filtered.map((entry) => {
                    const age = calculateAge(profile.birthDate, entry.date);

                    // Weight
                    let weightStr = '—';
                    let weightP = null;
                    if (entry.weightKg) {
                      weightStr =
                        unit === 'imperial'
                          ? kgToLbsOz(entry.weightKg).displayStr
                          : `${entry.weightKg.toFixed(2)} kg`;
                      weightP = calculatePercentile('weight', entry.weightKg, entry.ageMonths, profile.gender);
                    }

                    // Height
                    let heightStr = '—';
                    let heightP = null;
                    if (entry.heightCm) {
                      heightStr =
                        unit === 'imperial'
                          ? `${cmToInches(entry.heightCm).toFixed(1)} in`
                          : `${entry.heightCm.toFixed(1)} cm`;
                      heightP = calculatePercentile('height', entry.heightCm, entry.ageMonths, profile.gender);
                    }

                    // Head
                    let headStr = '—';
                    let headP = null;
                    if (entry.headCircumferenceCm) {
                      headStr =
                        unit === 'imperial'
                          ? `${cmToInches(entry.headCircumferenceCm).toFixed(1)} in`
                          : `${entry.headCircumferenceCm.toFixed(1)} cm`;
                      headP = calculatePercentile('head', entry.headCircumferenceCm, entry.ageMonths, profile.gender);
                    }

                    return (
                      <tr key={entry.id} className="hover:bg-[var(--color-canvas)]/50 transition-colors">
                        {/* Date & Age */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                            {entry.date}
                            {entry.isPediatricianVisit && (
                              <span
                                title="Pediatrician Visit"
                                className="w-4 h-4 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] inline-flex items-center justify-center text-[10px]"
                              >
                                <Stethoscope className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                            {age.displayStr} old
                          </div>
                        </td>

                        {/* Weight */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-semibold text-[var(--color-text-main)]">{weightStr}</div>
                          {weightP && (
                            <div className="text-[10px] text-[var(--color-primary)] font-semibold">
                              {weightP.displayStr}
                            </div>
                          )}
                        </td>

                        {/* Length */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-semibold text-[var(--color-text-main)]">{heightStr}</div>
                          {heightP && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              {heightP.displayStr}
                            </div>
                          )}
                        </td>

                        {/* Head */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-semibold text-[var(--color-text-main)]">{headStr}</div>
                          {headP && (
                            <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                              {headP.displayStr}
                            </div>
                          )}
                        </td>

                        {/* Notes & Milestones */}
                        <td className="py-3 px-4">
                          <div className="space-y-1 max-w-xs">
                            {entry.milestones && entry.milestones.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {entry.milestones.map((m, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5D77A]/20 text-[#856514] dark:text-[#F5D77A] text-[10px] font-semibold"
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>{m}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                            {entry.notes && (
                              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 italic">
                                &ldquo;{entry.notes}&rdquo;
                              </p>
                            )}
                            {!entry.notes && (!entry.milestones || entry.milestones.length === 0) && (
                              <span className="text-[var(--color-text-muted)]/50">—</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onEditEntry(entry)}
                              title="Edit measurement"
                              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/15 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(entry.id)}
                              title="Delete measurement"
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
