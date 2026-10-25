import React, { useState } from 'react';
import { BabyProfile, Gender, GrowthEntry } from '../types/growth';
import { X, Download, Upload, RotateCcw, User, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  onSaveProfile: (profile: BabyProfile) => void;
  entries: GrowthEntry[];
  onImportData: (profile: BabyProfile, entries: GrowthEntry[]) => void;
  onResetData: () => void;
  onOpenImportPastData?: () => void;
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
}) => {
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [importStatus, setImportStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || 'My Baby',
      gender,
      birthDate,
      avatarUrl: avatarUrl || undefined,
    });
    onClose();
  };

  // Export all data as JSON
  const handleExportJSON = () => {
    const backupData = {
      app: 'DTracker',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: {
        ...profile,
        name,
        gender,
        birthDate,
        avatarUrl,
      },
      entries,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dtracker-${name.toLowerCase() || 'dhruv'}-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.entries && Array.isArray(parsed.entries)) {
          const importedProfile = parsed.profile || profile;
          onImportData(importedProfile, parsed.entries);
          setName(importedProfile.name || 'Dhruv');
          setGender(importedProfile.gender || 'boy');
          setBirthDate(importedProfile.birthDate || '2026-03-24');
          setImportStatus(`Successfully restored ${parsed.entries.length} measurements!`);
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('Invalid backup file format.');
        }
      } catch (err) {
        setImportStatus('Failed to read file. Please verify JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
              D
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {name}’s Profile & Data Freedom
              </h2>
              <p className="text-xs text-stone-500">
                DTracker · 100% Free · No Subscriptions · Export & Own Your Data
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Form */}
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Baby Profile Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Baby’s Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 text-stone-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sex (For WHO curves)
                </label>
                <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`py-2 rounded-lg transition-all ${
                      gender === 'boy'
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Boy
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`py-2 rounded-lg transition-all ${
                      gender === 'girl'
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Girl
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 font-medium text-stone-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* Samsung Mobile / Android Installation Section */}
          <div className="pt-5 border-t border-stone-100 space-y-2.5">
            <div className="flex items-center gap-2 text-orange-600">
              <span className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center text-xs font-bold">
                📱
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Install as App on Samsung Phone (WebAPK)
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              DTracker is a certified Progressive Web App. When opened in <strong>Samsung Internet</strong> or <strong>Chrome</strong> on your phone, you can install it with 1 tap: tap the browser menu (<strong>⋮</strong> or <strong>☰</strong>) &rarr; <strong>“Install app”</strong> or <strong>“Add page to App screen”</strong>. Android packages it as a standalone app with Dhruv’s icon on your phone!
            </p>
          </div>

          {/* Backup & Data Freedom */}
          <div className="pt-5 border-t border-stone-100 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Data Ownership & Backup
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Unlike Nara Baby and commercial apps that put your family's records behind paywalls, all your baby's logs are stored securely right in your browser. You can export a full backup at any time.
            </p>

            {importStatus && (
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-medium">
                {importStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>Export Full Backup (JSON)</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Import Backup (JSON)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            {onOpenImportPastData && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenImportPastData();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-bold transition-colors"
              >
                <Upload className="w-4 h-4 text-orange-600" />
                <span>Import / Paste Past Logs from Nara Baby (CSV or Text)</span>
              </button>
            )}
          </div>

          {/* Reset / Sample data */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              {entries.length} growth entries logged
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset back to default 7-month sample data?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample 7m Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
