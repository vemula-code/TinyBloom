import React, { useState } from 'react';
import { BabyProfile, Gender, GrowthEntry, MetricUnit } from '../types/growth';
import { TinyBloomLogo } from './TinyBloomLogo';
import { kgToLbsOz, cmToInches } from '../data/whoGrowthStandards';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  Check,
  Baby,
  Trash2,
  Lock,
  Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  onSaveProfile: (profile: BabyProfile) => void;
  entries: GrowthEntry[];
  onImportData: (profile: BabyProfile, entries: GrowthEntry[]) => void;
  onResetData: () => void;
  onOpenImportPastData?: () => void;
  unit: MetricUnit;
  onToggleUnit: (u: MetricUnit) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  entries,
  onImportData,
  onResetData,
  onOpenImportPastData,
  unit,
  onToggleUnit,
}) => {
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || 'My Baby',
      gender,
      birthDate,
    });
    setStatusMsg('Profile updated successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Export all data as JSON
  const handleExportJSON = () => {
    const backupData = {
      app: 'TinyBloom',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      profile: {
        ...profile,
        name,
        gender,
        birthDate,
      },
      entries,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinybloom-${name.toLowerCase().replace(/\s+/g, '-')}-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg('Backup downloaded to your device!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // Export records as CSV
  const handleExportCSV = () => {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const headers = [
      'Date',
      'Age (Months)',
      'Weight (kg)',
      'Weight (lbs/oz)',
      'Length (cm)',
      'Length (in)',
      'Head Circumference (cm)',
      'Head Circumference (in)',
      'Pediatrician Visit',
      'Milestones',
      'Notes',
    ];

    const rows = sorted.map((e) => {
      const wLbs = e.weightKg ? kgToLbsOz(e.weightKg).displayStr : '';
      const hIn = e.heightCm ? cmToInches(e.heightCm).toFixed(1) : '';
      const hcIn = e.headCircumferenceCm ? cmToInches(e.headCircumferenceCm).toFixed(1) : '';

      return [
        e.date,
        e.ageMonths.toFixed(1),
        e.weightKg?.toFixed(2) || '',
        `"${wLbs}"`,
        e.heightCm?.toFixed(1) || '',
        hIn,
        e.headCircumferenceCm?.toFixed(1) || '',
        hcIn,
        e.isPediatricianVisit ? 'Yes' : 'No',
        `"${(e.milestones || []).join('; ')}"`,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinybloom-${name.toLowerCase().replace(/\s+/g, '-')}-data-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg('CSV data exported successfully!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // Import JSON backup with validation
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('File does not contain valid JSON data.');
        }

        if (!parsed.entries || !Array.isArray(parsed.entries)) {
          throw new Error('Missing measurement entries array in backup file.');
        }

        // Validate entries structure
        const validEntries: GrowthEntry[] = parsed.entries.filter(
          (item: any) => item && typeof item.date === 'string'
        );

        if (validEntries.length === 0) {
          throw new Error('No valid growth entries found in backup file.');
        }

        const importedProfile: BabyProfile = {
          id: parsed.profile?.id || `baby-${Date.now()}`,
          name: parsed.profile?.name || name,
          gender: parsed.profile?.gender === 'girl' ? 'girl' : 'boy',
          birthDate: parsed.profile?.birthDate || birthDate,
          notes: parsed.profile?.notes || '',
        };

        const replaceConfirmed = window.confirm(
          `Valid backup found with ${validEntries.length} measurements for ${importedProfile.name}.\n\nDo you want to restore these records? This will update your current baby profile.`
        );

        if (replaceConfirmed) {
          onImportData(importedProfile, validEntries);
          setName(importedProfile.name);
          setGender(importedProfile.gender);
          setBirthDate(importedProfile.birthDate);
          setStatusMsg(`Successfully restored ${validEntries.length} records for ${importedProfile.name}!`);
          setTimeout(() => setStatusMsg(''), 4000);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to read file. Please verify JSON format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteAll = () => {
    onImportData(
      {
        id: `baby-${Date.now()}`,
        name: 'My Baby',
        gender: 'boy',
        birthDate: new Date().toISOString().split('T')[0],
      },
      []
    );
    setShowDeleteConfirm(false);
    setStatusMsg('All records have been completely wiped from this device.');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFF9F0] rounded-3xl shadow-2xl border border-[#91A98B]/30 w-full max-w-xl overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#91A98B]/20 flex items-center justify-between bg-white/70 shrink-0">
          <div className="flex items-center gap-3">
            <TinyBloomLogo size={36} />
            <div>
              <h2 className="text-base font-bold font-heading text-[#303832]">
                TinyBloom Settings & Privacy
              </h2>
              <p className="text-xs text-[#6E7B6C]">
                100% On-Device · Zero Cloud Tracking · Pure Local Control
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#FFF9F0]">
          {/* Status Message */}
          {statusMsg && (
            <div className="p-3 rounded-2xl bg-[#91A98B]/20 border border-[#91A98B]/40 text-xs text-[#3D5939] font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-[#5D7C57]" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-100 border border-red-200 text-xs text-red-800 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Privacy & Offline Guarantee Section */}
          <div className="rounded-2xl border border-[#91A98B]/30 bg-white p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#5D7C57] font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#5D7C57]" />
              <span>Absolute Privacy & Offline Guarantee</span>
            </div>
            <p className="text-xs text-[#6E7B6C] leading-relaxed">
              TinyBloom is designed from the ground up to keep your baby's personal records strictly on your device. There are <strong>no online databases</strong>, <strong>no accounts or passwords</strong>, <strong>no analytics tracking</strong>, and <strong>no third-party telemetry</strong>.
            </p>
            <div className="pt-2 text-[11px] text-[#6E7B6C] flex items-start gap-1.5 border-t border-[#91A98B]/15">
              <Info className="w-3.5 h-3.5 text-[#5D7C57] shrink-0 mt-0.5" />
              <span>
                <strong>Important:</strong> Because data is stored in your device’s private local storage, clearing your browser data or uninstalling the app will delete local records. We recommend downloading a backup copy periodically below!
              </span>
            </div>
          </div>

          {/* Baby Profile Details */}
          <form onSubmit={handleSubmitProfile} className="bg-white p-5 rounded-2xl border border-[#91A98B]/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wider">
                Baby Profile
              </h3>
              <span className="text-[11px] text-[#6E7B6C] font-mono">{entries.length} records</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#303832] mb-1">
                Baby's Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#FFF9F0]/60 border border-[#91A98B]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#91A98B] text-[#303832] font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#303832] mb-1">
                  Sex (For WHO standard curves)
                </label>
                <div className="grid grid-cols-2 p-1 bg-[#FFF9F0] border border-[#91A98B]/20 rounded-xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`py-1.5 rounded-lg transition-all ${
                      gender === 'boy'
                        ? 'bg-[#91A98B] text-white font-semibold shadow-2xs'
                        : 'text-[#303832] hover:text-[#5D7C57]'
                    }`}
                  >
                    Boy
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`py-1.5 rounded-lg transition-all ${
                      gender === 'girl'
                        ? 'bg-[#91A98B] text-white font-semibold shadow-2xs'
                        : 'text-[#303832] hover:text-[#5D7C57]'
                    }`}
                  >
                    Girl
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#303832] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FFF9F0]/60 border border-[#91A98B]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#91A98B] font-medium text-[#303832]"
                />
              </div>
            </div>

            {/* Units Toggle */}
            <div className="pt-2 flex items-center justify-between border-t border-[#91A98B]/15">
              <span className="text-xs font-semibold text-[#303832]">Preferred Measurement Units</span>
              <div className="flex items-center gap-1 bg-[#FFF9F0] border border-[#91A98B]/20 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => onToggleUnit('metric')}
                  className={`px-2.5 py-1 rounded-lg ${
                    unit === 'metric' ? 'bg-[#91A98B] text-white font-bold' : 'text-[#303832]'
                  }`}
                >
                  kg / cm
                </button>
                <button
                  type="button"
                  onClick={() => onToggleUnit('imperial')}
                  className={`px-2.5 py-1 rounded-lg ${
                    unit === 'imperial' ? 'bg-[#91A98B] text-white font-bold' : 'text-[#303832]'
                  }`}
                >
                  lb·oz / in
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#91A98B] hover:bg-[#7D9977] rounded-xl transition-all shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* Backup, Export & Restore */}
          <div className="bg-white p-5 rounded-2xl border border-[#91A98B]/30 space-y-3">
            <h3 className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wider">
              Local Data Backup & Freedom
            </h3>
            <p className="text-xs text-[#6E7B6C] leading-relaxed">
              Export your records to keep on your computer, external USB, or personal drive. You can restore your data onto any phone or tablet anytime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#91A98B]/30 bg-[#FFF9F0]/60 hover:bg-[#FFF9F0] text-[#303832] text-xs font-semibold transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#5D7C57]" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#91A98B]/30 bg-[#FFF9F0]/60 hover:bg-[#FFF9F0] text-[#303832] text-xs font-semibold transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#5D7C57]" />
                <span>Export Spreadsheet (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#91A98B]/30 bg-white hover:bg-[#FFF9F0] text-[#303832] text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-[#5D7C57]" />
                <span>Restore Backup (JSON)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              {onOpenImportPastData && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenImportPastData();
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#91A98B]/30 bg-[#FFF9F0]/60 hover:bg-[#FFF9F0] text-[#303832] text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[#5D7C57]" />
                  <span>Import Past Rows (Nara / Text)</span>
                </button>
              )}
            </div>
          </div>

          {/* Reset / Clear Data */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Restore authentic 7-month sample records for Dhruv?')) {
                  onResetData();
                  setStatusMsg("Restored sample records for Dhruv!");
                  setTimeout(() => setStatusMsg(''), 3000);
                }
              }}
              className="text-[#6E7B6C] hover:text-[#303832] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Sample Profile (Dhruv)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All Data & Start Fresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wipe Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 border border-red-200 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-[#303832]">
                Permanently delete all baby data?
              </h3>
              <p className="text-xs text-[#6E7B6C] mt-1 leading-relaxed">
                This will wipe all {entries.length} measurements and the profile from this device. Please ensure you have downloaded a backup if you need your records.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-[#303832] bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
              >
                Wipe Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
