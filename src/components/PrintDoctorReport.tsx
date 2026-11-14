import React, { useState } from 'react';
import { BabyProfile, GrowthEntry, MetricUnit } from '../types/growth';
import {
  calculateAge,
  calculatePercentile,
  cmToInches,
  getCorrectedAgeMonths,
  isPretermProfile,
  formatAgeMonthsLabel,
  kgToLbsOz,
} from '../data/whoGrowthStandards';
import { TinyBloomLogo } from './TinyBloomLogo';
import { Printer, X, CheckSquare, Square, FileText, HelpCircle, Sparkles } from 'lucide-react';

interface PrintDoctorReportProps {
  profile: BabyProfile;
  entries: GrowthEntry[];
  unit: MetricUnit;
  onClose: () => void;
}

export const PrintDoctorReport: React.FC<PrintDoctorReportProps> = ({
  profile,
  entries,
  unit,
  onClose,
}) => {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latestAge = calculateAge(profile.birthDate);
  const preterm = isPretermProfile(profile.gestationalWeeks);
  const correctedMonthsNow = getCorrectedAgeMonths(latestAge.exactMonths, profile.gestationalWeeks);
  const latestEntry = sortedEntries[sortedEntries.length - 1];

  // Section visibility preferences
  const [includeProfile, setIncludeProfile] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeHistoryTable, setIncludeHistoryTable] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);

  // Retrieve saved questions
  const savedQuestions: string[] = (() => {
    try {
      const q = localStorage.getItem('tinybloom_doctor_questions');
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  })();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:z-auto">
      <div className="bg-[var(--color-card)] text-[var(--color-text-main)] rounded-3xl shadow-2xl border border-[var(--color-card-border)] w-full max-w-3xl overflow-hidden my-4 sm:my-6 print:border-none print:shadow-none print:my-0 print:max-w-none flex flex-col max-h-[92vh] print:max-h-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-4 border-b border-[var(--color-card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface)] print:hidden shrink-0">
          <div>
            <h2 className="text-base font-bold font-heading text-[var(--color-text-main)]">
              Doctor Visit Brief
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Generated 100% on-device · Customize sections and print or save to PDF
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[var(--color-primary)] hover:opacity-90 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-card)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customization Options Bar (Hidden on print) */}
        <div className="px-6 py-2.5 bg-[var(--color-card)] border-b border-[var(--color-card-border)] text-xs text-[var(--color-text-main)] flex items-center gap-4 flex-wrap print:hidden shrink-0">
          <span className="font-semibold text-[var(--color-text-muted)]">Include:</span>
          <button
            type="button"
            onClick={() => setIncludeProfile(!includeProfile)}
            className="flex items-center gap-1.5 hover:text-[var(--color-primary)] cursor-pointer"
          >
            {includeProfile ? <CheckSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" /> : <Square className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
            <span>Profile Details</span>
          </button>
          <button
            type="button"
            onClick={() => setIncludeSummary(!includeSummary)}
            className="flex items-center gap-1.5 hover:text-[var(--color-primary)] cursor-pointer"
          >
            {includeSummary ? <CheckSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" /> : <Square className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
            <span>Latest Summary</span>
          </button>
          <button
            type="button"
            onClick={() => setIncludeHistoryTable(!includeHistoryTable)}
            className="flex items-center gap-1.5 hover:text-[var(--color-primary)] cursor-pointer"
          >
            {includeHistoryTable ? <CheckSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" /> : <Square className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
            <span>Measurement Table</span>
          </button>
          <button
            type="button"
            onClick={() => setIncludeQuestions(!includeQuestions)}
            className="flex items-center gap-1.5 hover:text-[var(--color-primary)] cursor-pointer"
          >
            {includeQuestions ? <CheckSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" /> : <Square className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
            <span>Parent Questions ({savedQuestions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setIncludeNotes(!includeNotes)}
            className="flex items-center gap-1.5 hover:text-[var(--color-primary)] cursor-pointer"
          >
            {includeNotes ? <CheckSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" /> : <Square className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
            <span>Notes & Milestones</span>
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-[#303832] print:p-4 overflow-y-auto flex-1 bg-white keep-white" id="printable-report">
          {/* Clinic Header */}
          <div className="border-b-2 border-[#303832] pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <TinyBloomLogo size={42} />
              <div>
                <h1 className="text-xl font-bold font-heading tracking-tight text-[#303832]">
                  TinyBloom · Pediatric Visit Brief
                </h1>
                <p className="text-xs text-[#6E7B6C] mt-0.5">
                  Reference: Official World Health Organization (WHO) Child Growth Standards (0–24 Months)
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-[#6E7B6C] font-mono">
              <div>Date: {new Date().toISOString().split('T')[0]}</div>
              <div className="text-[10px] text-[#5D7C57] font-semibold mt-0.5">100% On-Device Record</div>
            </div>
          </div>

          {/* Patient Info Grid */}
          {includeProfile && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FAF9F6] p-4 rounded-2xl text-xs border border-[#91A98B]/30">
              <div>
                <span className="text-[#6E7B6C] font-semibold block uppercase text-[10px]">Patient Name</span>
                <span className="font-bold text-[#303832] text-sm">{profile.name}</span>
              </div>
              <div>
                <span className="text-[#6E7B6C] font-semibold block uppercase text-[10px]">Sex</span>
                <span className="font-semibold text-[#303832] capitalize">{profile.gender}</span>
              </div>
              <div>
                <span className="text-[#6E7B6C] font-semibold block uppercase text-[10px]">Date of Birth</span>
                <span className="font-semibold text-[#303832] font-mono">{profile.birthDate}</span>
              </div>
              <div>
                <span className="text-[#6E7B6C] font-semibold block uppercase text-[10px]">Age on Visit</span>
                <span className="font-bold text-[#5D7C57]">{latestAge.displayStr}</span>
                {preterm && (
                  <span className="block text-[10px] text-[#303832] mt-0.5">
                    Corrected: <strong>{formatAgeMonthsLabel(correctedMonthsNow)}</strong> ({profile.gestationalWeeks} wks)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Latest Metric Summary Banner */}
          {includeSummary && latestEntry && (
            <div className="p-4 rounded-2xl bg-[#91A98B]/10 border border-[#91A98B]/30 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#3D5939] flex items-center justify-between">
                <span>Latest Growth Metrics ({latestEntry.date})</span>
                <span className="font-mono text-[11px] font-normal text-[#6E7B6C]">
                  Logged at {latestAge.displayStr}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
                {/* Weight */}
                <div className="bg-white keep-white p-3 rounded-xl border border-[#91A98B]/20">
                  <span className="text-[#6E7B6C] block text-[11px]">Weight</span>
                  <span className="text-base font-extrabold font-mono text-[#303832]">
                    {latestEntry.weightKg
                      ? unit === 'imperial'
                        ? kgToLbsOz(latestEntry.weightKg).displayStr
                        : `${latestEntry.weightKg.toFixed(2)} kg`
                      : '—'}
                  </span>
                  {latestEntry.weightKg && (
                    <span className="block text-[10px] text-[#5D7C57] font-semibold mt-0.5">
                      {calculatePercentile('weight', latestEntry.weightKg, getCorrectedAgeMonths(latestEntry.ageMonths, profile.gestationalWeeks), profile.gender).displayStr}
                    </span>
                  )}
                </div>

                {/* Length */}
                <div className="bg-white keep-white p-3 rounded-xl border border-[#91A98B]/20">
                  <span className="text-[#6E7B6C] block text-[11px]">Length / Height</span>
                  <span className="text-base font-extrabold font-mono text-[#303832]">
                    {latestEntry.heightCm
                      ? unit === 'imperial'
                        ? `${cmToInches(latestEntry.heightCm).toFixed(1)} in`
                        : `${latestEntry.heightCm.toFixed(1)} cm`
                      : '—'}
                  </span>
                  {latestEntry.heightCm && (
                    <span className="block text-[10px] text-[#5D7C57] font-semibold mt-0.5">
                      {calculatePercentile('height', latestEntry.heightCm, getCorrectedAgeMonths(latestEntry.ageMonths, profile.gestationalWeeks), profile.gender).displayStr}
                    </span>
                  )}
                </div>

                {/* Head Size */}
                <div className="bg-white keep-white p-3 rounded-xl border border-[#91A98B]/20">
                  <span className="text-[#6E7B6C] block text-[11px]">Head Circumference</span>
                  <span className="text-base font-extrabold font-mono text-[#303832]">
                    {latestEntry.headCircumferenceCm
                      ? unit === 'imperial'
                        ? `${cmToInches(latestEntry.headCircumferenceCm).toFixed(1)} in`
                        : `${latestEntry.headCircumferenceCm.toFixed(1)} cm`
                      : '—'}
                  </span>
                  {latestEntry.headCircumferenceCm && (
                    <span className="block text-[10px] text-[#5D7C57] font-semibold mt-0.5">
                      {calculatePercentile('head', latestEntry.headCircumferenceCm, getCorrectedAgeMonths(latestEntry.ageMonths, profile.gestationalWeeks), profile.gender).displayStr}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Growth Table */}
          {includeHistoryTable && (
            <div>
              <h3 className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wider mb-2">
                Longitudinal Growth Table & WHO Percentiles
              </h3>
              <div className="border border-[#91A98B]/30 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] text-[#303832] font-semibold border-b border-[#91A98B]/20">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Age</th>
                      <th className="py-2 px-3">Weight ({unit === 'imperial' ? 'lbs/oz' : 'kg'})</th>
                      <th className="py-2 px-3">WHO Wt %</th>
                      <th className="py-2 px-3">Length ({unit === 'imperial' ? 'in' : 'cm'})</th>
                      <th className="py-2 px-3">WHO Ht %</th>
                      <th className="py-2 px-3">Head Circumference</th>
                      <th className="py-2 px-3">WHO HC %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#91A98B]/10">
                    {sortedEntries.map((entry) => {
                      const effAge = getCorrectedAgeMonths(entry.ageMonths, profile.gestationalWeeks);
                      const wP = entry.weightKg
                        ? calculatePercentile('weight', entry.weightKg, effAge, profile.gender)
                        : null;
                      const hP = entry.heightCm
                        ? calculatePercentile('height', entry.heightCm, effAge, profile.gender)
                        : null;
                      const hcP = entry.headCircumferenceCm
                        ? calculatePercentile('head', entry.headCircumferenceCm, effAge, profile.gender)
                        : null;

                      let wStr = entry.weightKg ? `${entry.weightKg.toFixed(2)} kg` : '—';
                      if (entry.weightKg && unit === 'imperial') {
                        wStr = kgToLbsOz(entry.weightKg).displayStr;
                      }

                      let hStr = entry.heightCm ? `${entry.heightCm.toFixed(1)} cm` : '—';
                      if (entry.heightCm && unit === 'imperial') {
                        hStr = `${cmToInches(entry.heightCm).toFixed(1)} in`;
                      }

                      let hcStr = entry.headCircumferenceCm ? `${entry.headCircumferenceCm.toFixed(1)} cm` : '—';
                      if (entry.headCircumferenceCm && unit === 'imperial') {
                        hcStr = `${cmToInches(entry.headCircumferenceCm).toFixed(1)} in`;
                      }

                      return (
                        <tr key={entry.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-mono">{entry.date}</td>
                          <td className="py-2 px-3 font-medium">
                            {entry.ageMonths === 0 ? 'Birth' : `${entry.ageMonths.toFixed(1)}m`}
                          </td>
                          <td className="py-2 px-3 font-mono font-medium">{wStr}</td>
                          <td className="py-2 px-3 font-semibold text-[#5D7C57]">{wP ? wP.displayStr : '—'}</td>
                          <td className="py-2 px-3 font-mono font-medium">{hStr}</td>
                          <td className="py-2 px-3 font-semibold text-[#5D7C57]">{hP ? hP.displayStr : '—'}</td>
                          <td className="py-2 px-3 font-mono font-medium">{hcStr}</td>
                          <td className="py-2 px-3 font-semibold text-[#5D7C57]">{hcP ? hcP.displayStr : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Parent Questions for the Doctor */}
          {includeQuestions && savedQuestions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#91A98B]/20">
              <h3 className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#5D7C57]" />
                <span>Parent Questions to Discuss During Visit</span>
              </h3>
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#91A98B]/30 space-y-1.5 text-xs text-[#303832]">
                {savedQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#5D7C57]">{idx + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical & Home Observations */}
          {includeNotes && (
            <div className="space-y-2 pt-2 border-t border-[#91A98B]/20">
              <h3 className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wider">
                Recent Home & Milestone Observations
              </h3>
              <div className="space-y-1.5 text-xs text-[#303832]">
                {sortedEntries
                  .filter((e) => e.notes || (e.milestones && e.milestones.length > 0))
                  .slice(-4)
                  .map((e) => (
                    <div key={e.id} className="p-2.5 rounded-xl bg-[#FAF9F6]/70 border border-[#91A98B]/20">
                      <span className="font-semibold text-[#303832]">{e.date} ({e.ageMonths.toFixed(1)}m): </span>
                      {e.notes && <span>{e.notes} </span>}
                      {e.milestones && e.milestones.length > 0 && (
                        <span className="text-[#6B5510] font-medium italic">
                          [Milestones: {e.milestones.join(', ')}]
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Physician Sign-off Box */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#303832]/30 text-xs">
            <div>
              <div className="border-b border-[#303832]/30 pb-10 text-[#6E7B6C]">Physician Clinical Notes:</div>
            </div>
            <div>
              <div className="border-b border-[#303832]/30 pb-10 text-[#6E7B6C]">Physician Signature & Date:</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
