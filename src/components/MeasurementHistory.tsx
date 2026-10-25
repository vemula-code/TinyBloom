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
      <div className="bg-white rounded-3xl p-6 border border-[#91A98B]/30 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#5D7C57] font-semibold text-xs tracking-wider uppercase mb-1">
              <Calendar className="w-4 h-4" />
              <span>Audit-Friendly Growth Log</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#303832]">
              Measurement History ({entries.length})
            </h2>
            <p className="text-xs text-[#6E7B6C] mt-1">
              All growth entries recorded on this device. Edit, correct, or export anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#91A98B] hover:bg-[#7D9977] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Measurement</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t border-[#91A98B]/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search date, notes, or milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFF9F0]/60 border border-[#91A98B]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#91A98B] text-[#303832]"
            />
          </div>

          {/* Filter Pills & Sort Toggle */}
          <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-[#FFF9F0] p-1 rounded-xl border border-[#91A98B]/20 text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-[#91A98B] text-white font-semibold shadow-2xs'
                    : 'text-[#303832] hover:bg-[#91A98B]/10'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('visits')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === 'visits'
                    ? 'bg-[#91A98B] text-white font-semibold shadow-2xs'
                    : 'text-[#303832] hover:bg-[#91A98B]/10'
                }`}
              >
                Pediatrician Visits
              </button>
              <button
                type="button"
                onClick={() => setFilterType('milestones')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === 'milestones'
                    ? 'bg-[#91A98B] text-white font-semibold shadow-2xs'
                    : 'text-[#303832] hover:bg-[#91A98B]/10'
                }`}
              >
                Milestones
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#91A98B]/30 hover:bg-[#91A98B]/10 text-[#303832] rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#5D7C57]" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] rounded-3xl p-6 border border-[#91A98B]/40 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-[#303832]">
                Delete this measurement?
              </h3>
              <p className="text-xs text-[#6E7B6C] mt-1">
                This record will be permanently removed from your charts and history. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#303832] bg-white border border-stone-200 hover:bg-stone-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Table / List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#91A98B]/30 text-center space-y-3">
          <p className="text-sm font-semibold text-[#303832]">No matching records found.</p>
          <p className="text-xs text-[#6E7B6C]">
            {searchQuery ? 'Try clearing your search terms.' : 'Start logging growth measurements above.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#91A98B]/30 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F0] text-[#303832] font-heading font-bold border-b border-[#91A98B]/20">
                <tr>
                  <th className="py-3 px-4">Date & Age</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">Length</th>
                  <th className="py-3 px-4">Head Size</th>
                  <th className="py-3 px-4">Notes & Milestones</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#91A98B]/10">
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
                    <tr key={entry.id} className="hover:bg-[#FFF9F0]/60 transition-colors">
                      {/* Date & Age */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#303832] flex items-center gap-1.5">
                          {entry.date}
                          {entry.isPediatricianVisit && (
                            <span
                              title="Pediatrician Visit"
                              className="w-4 h-4 rounded-full bg-[#91A98B]/20 text-[#3D5939] inline-flex items-center justify-center text-[10px]"
                            >
                              <Stethoscope className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6E7B6C] mt-0.5">
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
                          <div className="text-[10px] text-[var(--color-primary)] font-semibold">
                            {heightP.displayStr}
                          </div>
                        )}
                      </td>

                      {/* Head */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-semibold text-[var(--color-text-main)]">{headStr}</div>
                        {headP && (
                          <div className="text-[10px] text-[var(--color-primary)] font-semibold">
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
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5D77A]/30 text-[#6B5510] text-[10px] font-semibold"
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{m}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          {entry.notes && (
                            <p className="text-xs text-[#6E7B6C] line-clamp-2 italic">
                              "{entry.notes}"
                            </p>
                          )}
                          {!entry.notes && (!entry.milestones || entry.milestones.length === 0) && (
                            <span className="text-[#6E7B6C]/50">—</span>
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
                            className="p-1.5 rounded-lg text-[#6E7B6C] hover:text-[#303832] hover:bg-[#91A98B]/15 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(entry.id)}
                            title="Delete measurement"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
      )}
    </div>
  );
};
