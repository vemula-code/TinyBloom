import React, { useState } from 'react';
import { X, FileText, Upload, Check, AlertCircle, ArrowRight } from 'lucide-react';
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
2026-03-24, 7.6 lbs, 20 in, 13.8 in, Birth checkup
2026-04-24, 10.0 lbs, 21.7 in, 14.8 in, 1 month pediatrician visit
2026-05-24, 12.6 lbs, 23.1 in, 15.5 in, Smiling and cooing
2026-07-24, 15.5 lbs, 25.3 in, 16.4 in, 4 month checkup
2026-09-24, 17.7 lbs, 26.8 in, 17.1 in, Eating solids
2026-10-24, 18.5 lbs, 27.5 in, 17.4 in, 7 months today!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Import Past Growth Data (Nara Baby / Medical Logs)
              </h2>
              <p className="text-xs text-stone-500">
                Paste past rows or upload a CSV to automatically populate Dhruv's charts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Instructions & File Upload trigger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-stone-50 border border-stone-200/80 rounded-2xl">
            <p className="text-xs text-stone-600">
              Paste exported rows from Nara Baby, pediatrician visit portal, or spreadsheets below.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-stone-100 transition-colors shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
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
                className="px-2.5 py-1.5 text-[11px] font-medium text-orange-700 hover:text-orange-900 bg-orange-50 rounded-xl transition-colors"
              >
                Insert Example
              </button>
            </div>
          </div>

          {/* Textarea Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Raw Past Growth Log Text or CSV
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. 
2026-03-24, 7.6 lbs, 20 in, 13.8 in, Birth checkup
2026-04-24, 10.0 lbs, 21.7 in
2026-05-24, 12.6 lbs, 23.1 in
2026-07-24, 15.5 lbs, 25.3 in
2026-10-24, 18.5 lbs, 27.5 in"
              className="w-full p-3 font-mono text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-400 text-stone-800"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleParse}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
              >
                Preview Parsed Rows ({rawText.split('\n').filter(Boolean).length} lines)
              </button>
            </div>
          </div>

          {/* Parsed Results Preview */}
          {parsedResult && (
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Successfully Parsed {parsedResult.totalParsed} Measurement Entries
                </span>
                {parsedResult.errors.length > 0 && (
                  <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {parsedResult.errors.length} skipped
                  </span>
                )}
              </div>

              {/* Table of Parsed Items */}
              <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-xl text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 text-stone-700 font-semibold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Age</th>
                      <th className="py-2 px-3">Weight</th>
                      <th className="py-2 px-3">Length</th>
                      <th className="py-2 px-3">Head</th>
                      <th className="py-2 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
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
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="py-1.5 px-3 font-mono font-medium">{entry.date}</td>
                          <td className="py-1.5 px-3 text-stone-500">{entry.ageMonths === 0 ? 'Birth' : `${entry.ageMonths}m`}</td>
                          <td className="py-1.5 px-3 font-mono">{wStr}</td>
                          <td className="py-1.5 px-3 font-mono">{hStr}</td>
                          <td className="py-1.5 px-3 font-mono">{hcStr}</td>
                          <td className="py-1.5 px-3 text-stone-500 truncate max-w-[140px]">{entry.notes || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Import Mode: Merge or Replace */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-800 block">Import Mode:</span>
                  <span className="text-[11px] text-stone-500">
                    {importMode === 'merge' ? 'Combines with current logs without duplicates' : 'Replaces all existing logs with this imported set'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      importMode === 'merge' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                    }`}
                  >
                    Merge
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      importMode === 'replace' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                    }`}
                  >
                    Replace All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <p className="text-[11px] text-stone-400">
              Tip: You can also paste your raw text in the chat and I can bake it directly for you!
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!parsedResult || parsedResult.entries.length === 0}
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all shadow-xs"
              >
                <span>Import {parsedResult?.entries.length || 0} Entries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
