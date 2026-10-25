import React, { useState } from 'react';
import { BabyProfile, Gender, GrowthEntry } from '../types/growth';
import { CuteBabyLogo } from './CuteBabyLogo';
import { generateSyncUrl } from '../utils/syncPayload';
import { DEFAULT_PROFILE, DEFAULT_GROWTH_ENTRIES } from '../data/defaultData';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Share2,
  Users,
  Link2,
  Check,
  Baby,
  HelpCircle,
  Sparkles,
  Camera,
  HeartHandshake
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
  const [copiedSyncLink, setCopiedSyncLink] = useState(false);
  const [showSharingFaq, setShowSharingFaq] = useState(false);

  // New Baby Creation state
  const [isCreatingNewBaby, setIsCreatingNewBaby] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [newBabyGender, setNewBabyGender] = useState<Gender>('boy');
  const [newBabyBirthDate, setNewBabyBirthDate] = useState(
    new Date().toISOString().split('T')[0]
  );

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

  const handleStartFreshForNewBaby = (e: React.FormEvent) => {
    e.preventDefault();
    const freshProfile: BabyProfile = {
      id: `baby-${Date.now()}`,
      name: newBabyName.trim() || 'My Baby',
      gender: newBabyGender,
      birthDate: newBabyBirthDate,
      notes: `Born on ${newBabyBirthDate}.`,
    };
    onImportData(freshProfile, []);
    setName(freshProfile.name);
    setGender(freshProfile.gender);
    setBirthDate(freshProfile.birthDate);
    setIsCreatingNewBaby(false);
    setImportStatus(`Created fresh profile for ${freshProfile.name}!`);
    setTimeout(() => {
      setImportStatus('');
      onClose();
    }, 1500);
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

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dtracker-${name.toLowerCase() || 'dhruv'}-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share backup directly to partner via WhatsApp / Quick Share
  const handleShareToPartner = async () => {
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

    const jsonStr = JSON.stringify(backupData, null, 2);
    const fileName = `dtracker-${name.toLowerCase() || 'dhruv'}-backup.json`;
    const file = new File([jsonStr], fileName, { type: 'application/json' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${name}’s Growth Backup`,
          text: `Here is ${name}’s latest growth data for DTracker. Open DTracker on your phone, tap Settings, and choose 'Import Backup' to sync!`,
        });
        return;
      } catch {
        // Fallback
      }
    }
    handleExportJSON();
  };

  // 1-Tap WhatsApp / Browser Sync Link
  const handleShareSyncLink = async () => {
    const syncUrl = generateSyncUrl(profile, entries);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}’s Growth Sync`,
          text: `Tap this link on your phone to instantly update ${name}’s growth records in DTracker:`,
          url: syncUrl,
        });
        return;
      } catch {
        // Fallback
      }
    }
    navigator.clipboard.writeText(syncUrl);
    setCopiedSyncLink(true);
    setTimeout(() => setCopiedSyncLink(false), 3500);
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
      } catch {
        setImportStatus('Failed to read file. Please verify JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <CuteBabyLogo size={36} />
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {name}’s Tracker & Settings
              </h2>
              <p className="text-xs text-stone-500">
                100% Private · No Login Required · Offline Ready
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {importStatus && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-600" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* How Sharing with 3+ People Works FAQ Card */}
          <div className="rounded-2xl border border-orange-200/90 bg-orange-50/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-800 font-bold text-xs">
                <HelpCircle className="w-4 h-4 text-orange-600" />
                <span>How Sharing & Privacy Works (Giving Link to 3 People)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSharingFaq(!showSharingFaq)}
                className="text-xs text-orange-700 font-semibold underline hover:text-orange-900"
              >
                {showSharingFaq ? 'Hide details' : 'How does it work?'}
              </button>
            </div>

            {showSharingFaq ? (
              <div className="text-xs text-stone-700 space-y-2 pt-1 border-t border-orange-200/60 leading-relaxed">
                <p>
                  <strong>1. Is my baby's data secure?</strong>
                  <br />
                  Yes, 100%! All measurements exist solely on your phone's private storage (<code>localStorage</code>). Nothing is ever sent to a public database or server.
                </p>
                <p>
                  <strong>2. If I share with Wife or Family (to track Dhruv together):</strong>
                  <br />
                  Tap the <strong>“1-Tap Sync to Wife/Husband (WhatsApp Link)”</strong> button below. When they tap the link on their phone, Dhruv's latest measurements are safely copied to their phone with 1 tap.
                </p>
                <p>
                  <strong>3. If I share with a Friend who has their OWN baby:</strong>
                  <br />
                  They can tap <strong>“Start Fresh for Another Baby”</strong> below. That clears Dhruv's entries on their device only and gives them a completely clean tracker for their child!
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-stone-600">
                Data is stored privately on your phone. You can sync Dhruv’s latest records with family via WhatsApp, or let friends start a fresh baby profile.
              </p>
            )}
          </div>

          {/* Profile Form */}
          {!isCreatingNewBaby ? (
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Baby Profile Details
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewBaby(true)}
                  className="flex items-center gap-1 text-xs text-orange-700 hover:text-orange-900 font-semibold"
                >
                  <Baby className="w-3.5 h-3.5" />
                  <span>+ Start Fresh for Another Baby</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Baby’s Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-400 text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sex (For WHO curves)
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setGender('boy')}
                      className={`py-1.5 rounded-lg transition-all ${
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
                      className={`py-1.5 rounded-lg transition-all ${
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
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-medium text-stone-800"
                  />
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            /* Create New Fresh Baby Profile Form (For friends / new baby) */
            <form onSubmit={handleStartFreshForNewBaby} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <Baby className="w-4 h-4 text-orange-600" />
                  <span>Start Fresh for Another Baby</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewBaby(false)}
                  className="text-xs text-stone-500 hover:text-stone-700"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-stone-500">
                This sets up a clean, blank slate for a friend or second baby. You can always restore Dhruv’s 18+ records below anytime!
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  New Baby's Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam, Maya"
                  value={newBabyName}
                  onChange={(e) => setNewBabyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Sex</label>
                  <div className="grid grid-cols-2 p-1 bg-stone-200/80 rounded-xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setNewBabyGender('boy')}
                      className={`py-1 rounded-lg ${newBabyGender === 'boy' ? 'bg-white font-bold' : 'text-stone-600'}`}
                    >
                      Boy
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewBabyGender('girl')}
                      className={`py-1 rounded-lg ${newBabyGender === 'girl' ? 'bg-white font-bold' : 'text-stone-600'}`}
                    >
                      Girl
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Date</label>
                  <input
                    type="date"
                    required
                    value={newBabyBirthDate}
                    onChange={(e) => setNewBabyBirthDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNewBaby(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
                >
                  Create Fresh Baby Profile
                </button>
              </div>
            </form>
          )}

          {/* Two-Phone Sync (Husband & Wife) */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <div className="flex items-center gap-2 text-orange-600">
              <Users className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Sync with Wife / Husband (No Gmail Needed)
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              To keep both phones in sync, tap the button below and send the link to your partner on WhatsApp. When they open it, their phone updates instantly with all measurements!
            </p>
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleShareSyncLink}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
              >
                {copiedSyncLink ? (
                  <>
                    <Check className="w-4 h-4 text-orange-200" />
                    <span>Sync Link Copied! Send it on WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>1-Tap Sync to Wife/Husband (WhatsApp Link)</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShareToPartner}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Send Backup File</span>
                </button>
                <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-stone-500" />
                  <span>Import Backup File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* AI Screenshot & Past Data Import trigger */}
          {onOpenImportPastData && (
            <div className="pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenImportPastData();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100/80 text-orange-950 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-200/80 text-orange-800 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">
                      Import from Nara Baby Screenshots (AI Scanner)
                    </span>
                    <span className="text-[11px] text-orange-700">
                      Upload chart photos or paste CSV to transcribe 30+ logs
                    </span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          {/* Backup & Data Freedom */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Data Ownership & Backup
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              All logs are stored safely in your browser. You can export a JSON file anytime to save on your computer or Google Drive.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>Export JSON Backup</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset / Sample data */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              {entries.length} growth entries logged
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Restore Dhruv's authentic 18 Nara Baby growth records?")) {
                  onResetData();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Dhruv's Authentic Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
