import React, { useState } from 'react';
import { X, FileText, Upload, Check, AlertCircle, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { GrowthEntry, MetricUnit } from '../types/growth';
import { parsePastGrowthData } from '../utils/importer';
import { kgToLbsOz, cmToInches } from '../data/whoGrowthStandards';

interface ImportPastDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthDate: string;
  unit: MetricUnit;
  onImport: (newEntries: GrowthEntry[], mode: 'merge' | 'replace') => void;
}

export const ImportPastDataModal: React.FC<ImportPastDataModalProps> = ({
  isOpen,
  onClose,
  birthDate,
  unit,
  onImport,
}) => {
  const [rawText, setRawText] = useState('');
  const [parsedResult, setParsedResult] = useState<ReturnType<typeof parsePastGrowthData> | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  if (!isOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) return;
    const res = parsePastGrowthData(rawText, birthDate);
    setParsedResult(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setRawText(content);
        const res = parsePastGrowthData(content, birthDate);
        setParsedResult(res);
      };
      reader.readAsText(file);
    }
  };

  const handleConfirm = () => {
    if (parsedResult && parsedResult.entries.length > 0) {
      onImport(parsedResult.entries, importMode);
      onClose();
    }
  };

  const sampleCsvExample = `Date, Weight, Height, Head Circumference, Notes
2026-03-28, 7.6 lbs, 20.0 in, 13.8 in, Birth checkup
2026-04-02, 7.2 lbs, 20.7 in, 13.8 in, 5-day pediatric visit
2026-04-14, 8.2 lbs, 21.5 in, 14.2 in, Pediatrician check
2026-06-09, 12.4 lbs, 23.8 in, 15.3 in, 2 month well-visit
2026-08-10, 15.2 lbs, 26.2 in, 16.9 in, 4 month checkup
2026-10-14, 17.4 lbs, 28.0 in, 17.5 in, 6.5 month milestone`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[var(--color-card)] text-[var(--color-text-main)] rounded-3xl shadow-2xl border border-[var(--color-card-border)] w-full max-w-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-card-border)] flex items-center justify-between bg-[var(--color-card)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] flex items-center justify-center shadow-2xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-[var(--color-text-main)]">
                Import Past Growth Records
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                100% on-device parser · No data ever leaves your phone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-[var(--color-canvas)]">
          {/* Privacy Guarantee Banner */}
          <div className="flex items-center gap-2 p-3 bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30 rounded-2xl text-xs text-[var(--color-text-main)]">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span>
              <strong>Private & Local:</strong> Your records are parsed entirely inside your browser. No internet connection or cloud service is used.
            </span>
          </div>

          {/* Quick upload triggers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl shadow-2xs">
            <p className="text-xs text-[var(--color-text-main)]">
              Paste exported rows from Nara Baby, pediatrician visit notes, or spreadsheets below.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-canvas)] border border-[var(--color-card-border)] text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] rounded-xl text-xs font-semibold cursor-pointer hover:bg-[var(--color-surface)] transition-colors shadow-2xs">
                <FileText className="w-3.5 h-3.5" />
                <span>Upload CSV / TXT</span>
                <input
                  type="file"
                  accept=".csv,.txt,text/plain,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setRawText(sampleCsvExample);
                  const res = parsePastGrowthData(sampleCsvExample, birthDate);
                  setParsedResult(res);
                }}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] hover:opacity-80 bg-[var(--color-primary-light)] rounded-xl transition-opacity cursor-pointer"
              >
                Insert Sample
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Raw Past Growth Log Text or CSV
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. 
2026-03-28, 7.6 lbs, 20.0 in, 13.8 in, Birth Day
2026-04-02, 7.2 lbs, 20.7 in
2026-06-09, 12.4 lbs, 23.8 in
2026-10-14, 17.4 lbs, 28.0 in"
              className="w-full p-3 font-mono text-xs bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text-main)]"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleParse}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-2xs cursor-pointer"
              >
                Parse Rows ({rawText.split('\n').filter(Boolean).length} lines)
              </button>
            </div>
          </div>

          {/* Parsed Results Preview */}
          {parsedResult && (
            <div className="pt-2 border-t border-[var(--color-card-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  Successfully Parsed {parsedResult.totalParsed} Measurement Entries
                </span>
                {parsedResult.errors.length > 0 && (
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {parsedResult.errors.length} skipped
                  </span>
                )}
              </div>

              {/* Table of Parsed Items */}
              <div className="max-h-48 overflow-y-auto border border-[var(--color-card-border)] rounded-xl text-xs bg-[var(--color-card)]">
                <table className="w-full text-left">
                  <thead className="bg-[var(--color-surface)] text-[var(--color-text-main)] font-semibold sticky top-0 border-b border-[var(--color-card-border)]">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Age</th>
                      <th className="py-2 px-3">Weight</th>
                      <th className="py-2 px-3">Length</th>
                      <th className="py-2 px-3">Head</th>
                      <th className="py-2 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-card-border)]/50">
                    {parsedResult.entries.map((entry, idx) => {
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
                        <tr key={idx} className="hover:bg-[var(--color-surface)]/40">
                          <td className="py-1.5 px-3 font-mono font-medium">{entry.date}</td>
                          <td className="py-1.5 px-3 text-[var(--color-text-muted)]">{entry.ageMonths === 0 ? 'Birth' : `${entry.ageMonths.toFixed(1)}m`}</td>
                          <td className="py-1.5 px-3 font-mono">{wStr}</td>
                          <td className="py-1.5 px-3 font-mono">{hStr}</td>
                          <td className="py-1.5 px-3 font-mono">{hcStr}</td>
                          <td className="py-1.5 px-3 text-[var(--color-text-muted)] truncate max-w-[140px]">{entry.notes || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Import Mode: Merge or Replace */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[var(--color-card)] p-3 rounded-xl border border-[var(--color-card-border)]">
                <div>
                  <span className="text-xs font-bold text-[var(--color-text-main)] block">Import Mode:</span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {importMode === 'merge' ? 'Combines with current records without duplicates' : 'Replaces all records with this imported set'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[var(--color-canvas)] p-1 rounded-lg text-xs font-semibold border border-[var(--color-card-border)]">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      importMode === 'merge' ? 'bg-[var(--color-primary)] text-white shadow-2xs font-bold' : 'text-[var(--color-text-main)]'
                    }`}
                  >
                    Merge
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      importMode === 'replace' ? 'bg-[var(--color-primary)] text-white shadow-2xs font-bold' : 'text-[var(--color-text-main)]'
                    }`}
                  >
                    Replace All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-card-border)] bg-[var(--color-card)] flex items-center justify-between shrink-0">
          <p className="text-[11px] text-[var(--color-text-muted)]">
            All calculations and storage run locally on your device.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--color-text-main)] bg-[var(--color-surface)] hover:opacity-85 rounded-xl transition-opacity cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!parsedResult || parsedResult.entries.length === 0}
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>Import {parsedResult?.entries.length || 0} Entries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
