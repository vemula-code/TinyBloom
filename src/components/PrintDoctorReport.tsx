import React from 'react';
import { BabyProfile, GrowthEntry, MetricUnit } from '../types/growth';
import { calculateAge, calculatePercentile, cmToInches, kgToLbsOz } from '../data/whoGrowthStandards';
import { Printer, X, Download } from 'lucide-react';

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:z-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-3xl overflow-hidden my-6 print:border-none print:shadow-none print:my-0 print:max-w-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50 print:hidden">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Pediatric Wellness Visit Report
            </h2>
            <p className="text-xs text-stone-500">
              Clean clinical growth trajectory summary for pediatricians
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-stone-900 print:p-6" id="printable-report">
          {/* Clinic Header */}
          <div className="border-b-2 border-stone-800 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                DTracker · Child Growth Record & WHO Percentiles
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Standard: World Health Organization (WHO) Child Growth Standards (0–24 Months)
              </p>
            </div>
            <div className="text-right text-xs text-stone-500 font-mono">
              Report Date: {new Date().toISOString().split('T')[0]}
            </div>
          </div>

          {/* Patient Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-xl text-xs border border-stone-200/80">
            <div>
              <span className="text-stone-400 font-medium block uppercase text-[10px]">Patient Name</span>
              <span className="font-bold text-stone-800 text-sm">{profile.name}</span>
            </div>
            <div>
              <span className="text-stone-400 font-medium block uppercase text-[10px]">Sex</span>
              <span className="font-semibold text-stone-800 capitalize">{profile.gender}</span>
            </div>
            <div>
              <span className="text-stone-400 font-medium block uppercase text-[10px]">Date of Birth</span>
              <span className="font-semibold text-stone-800 font-mono">{profile.birthDate}</span>
            </div>
            <div>
              <span className="text-stone-400 font-medium block uppercase text-[10px]">Current Age</span>
              <span className="font-semibold text-stone-800">{latestAge.displayStr}</span>
            </div>
          </div>

          {/* Growth Table */}
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Measurement Log & Calculated Percentiles
            </h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Age</th>
                    <th className="py-2.5 px-3">Weight ({unit === 'imperial' ? 'lbs/oz' : 'kg'})</th>
                    <th className="py-2.5 px-3">WHO Wt %</th>
                    <th className="py-2.5 px-3">Length ({unit === 'imperial' ? 'in' : 'cm'})</th>
                    <th className="py-2.5 px-3">WHO Ht %</th>
                    <th className="py-2.5 px-3">Head Cir.</th>
                    <th className="py-2.5 px-3">WHO HC %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {sortedEntries.map((entry) => {
                    const wP = entry.weightKg
                      ? calculatePercentile('weight', entry.weightKg, entry.ageMonths, profile.gender)
                      : null;
                    const hP = entry.heightCm
                      ? calculatePercentile('height', entry.heightCm, entry.ageMonths, profile.gender)
                      : null;
                    const hcP = entry.headCircumferenceCm
                      ? calculatePercentile('head', entry.headCircumferenceCm, entry.ageMonths, profile.gender)
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
                      <tr key={entry.id} className="hover:bg-stone-50/50">
                        <td className="py-2 px-3 font-mono">{entry.date}</td>
                        <td className="py-2 px-3 font-medium">
                          {entry.ageMonths === 0 ? 'Birth' : `${entry.ageMonths}m`}
                        </td>
                        <td className="py-2 px-3 font-mono font-medium">{wStr}</td>
                        <td className="py-2 px-3 font-medium text-teal-800">{wP ? wP.displayStr : '—'}</td>
                        <td className="py-2 px-3 font-mono font-medium">{hStr}</td>
                        <td className="py-2 px-3 font-medium text-teal-800">{hP ? hP.displayStr : '—'}</td>
                        <td className="py-2 px-3 font-mono font-medium">{hcStr}</td>
                        <td className="py-2 px-3 font-medium text-teal-800">{hcP ? hcP.displayStr : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical notes summary */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Recent Clinical & Parental Observations
            </h3>
            <div className="space-y-1.5 text-xs text-stone-700">
              {sortedEntries
                .filter((e) => e.notes || (e.milestones && e.milestones.length > 0))
                .slice(-3)
                .map((e) => (
                  <div key={e.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                    <span className="font-semibold text-stone-900">{e.date} ({e.ageMonths}m): </span>
                    {e.notes && <span>{e.notes} </span>}
                    {e.milestones && e.milestones.length > 0 && (
                      <span className="text-amber-800 font-medium italic">
                        [Milestones: {e.milestones.join(', ')}]
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Pediatrician Sign-off Box */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-stone-200 text-xs">
            <div>
              <div className="border-b border-stone-300 pb-8 text-stone-400">Physician / Clinic Notes:</div>
            </div>
            <div>
              <div className="border-b border-stone-300 pb-8 text-stone-400">Physician Signature & Date:</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
