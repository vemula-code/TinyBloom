import React, { useState } from 'react';
import { BabyProfile, Gender, GrowthEntry, MetricUnit, ThemeMode, PaletteTheme } from '../types/growth';
import { TinyBloomLogo } from './TinyBloomLogo';
import { BabyAvatar } from './BabyAvatar';
import { PRESET_AVATARS, DEFAULT_AVATAR } from '../data/defaultData';
import { kgToLbsOz, cmToInches } from '../data/whoGrowthStandards';
import { generateSyncUrl } from '../utils/syncPayload';
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
  Info,
  Sun,
  Moon,
  Palette,
  Heart,
  Camera,
  Sparkles,
  Share2,
  Copy
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
  themeMode: ThemeMode;
  onToggleThemeMode: (mode: ThemeMode) => void;
  paletteTheme: PaletteTheme;
  onChangePaletteTheme: (palette: PaletteTheme) => void;
  onOpenHeartfeltModal?: () => void;
  onOpenOnboardingModal?: () => void;
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
  themeMode,
  onToggleThemeMode,
  paletteTheme,
  onChangePaletteTheme,
  onOpenHeartfeltModal,
  onOpenOnboardingModal,
}) => {
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || DEFAULT_AVATAR);
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
      avatarUrl,
    });
    setStatusMsg('Profile updated successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Generate and copy private Co-Parent sync link
  const handleCopySyncLink = async () => {
    try {
      const activeProf: BabyProfile = {
        ...profile,
        name: name.trim() || profile.name,
        gender,
        birthDate,
        avatarUrl,
      };
      const url = generateSyncUrl(activeProf, entries);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setStatusMsg('✨ Private sync link copied to clipboard! Send to your partner.');
      } else {
        // Fallback for older browsers
        window.prompt('Copy this sync link to send to your partner:', url);
        setStatusMsg('Sync link generated!');
      }
      setTimeout(() => setStatusMsg(''), 4500);
    } catch (err: any) {
      setErrorMsg('Could not copy link to clipboard automatically.');
    }
  };

  // Handle local photo upload (100% on device, zero cloud)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        setStatusMsg('Photo loaded! Remember to click Save Profile Changes.');
        setTimeout(() => setStatusMsg(''), 3500);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Export all data as JSON
  const handleExportJSON = () => {
    const backupData = {
      app: 'TinyBloom',
      version: '2.1',
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
      const headIn = e.headCircumferenceCm
        ? cmToInches(e.headCircumferenceCm).toFixed(2)
        : '';

      return [
        `"${e.date}"`,
        e.ageMonths.toFixed(1),
        e.weightKg ? e.weightKg.toFixed(2) : '',
        `"${wLbs}"`,
        e.heightCm ? e.heightCm.toFixed(1) : '',
        `"${hIn}"`,
        e.headCircumferenceCm ? e.headCircumferenceCm.toFixed(1) : '',
        `"${headIn}"`,
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
    a.download = `tinybloom-${name.toLowerCase().replace(/\s+/g, '-')}-growth-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg('Spreadsheet (CSV) downloaded!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        const incomingEntries = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.entries)
          ? parsed.entries
          : [];

        if (incomingEntries.length === 0 && !parsed.profile) {
          throw new Error('No growth records found in this JSON backup.');
        }

        const validEntries: GrowthEntry[] = incomingEntries.filter(
          (item: any) =>
            item &&
            typeof item === 'object' &&
            typeof item.date === 'string' &&
            (item.weightKg != null || item.heightCm != null || item.headCircumferenceCm != null)
        );

        const newProfile: BabyProfile = {
          id: parsed.profile?.id || profile.id,
          name: parsed.profile?.name || profile.name,
          gender: parsed.profile?.gender || profile.gender,
          birthDate: parsed.profile?.birthDate || profile.birthDate,
          avatarUrl: parsed.profile?.avatarUrl || profile.avatarUrl,
          notes: parsed.profile?.notes || profile.notes,
        };

        if (
          window.confirm(
            `Restore backup with ${validEntries.length} measurements for ${newProfile.name}?`
          )
        ) {
          onImportData(newProfile, validEntries);
          setName(newProfile.name);
          setGender(newProfile.gender);
          setBirthDate(newProfile.birthDate);
          setAvatarUrl(newProfile.avatarUrl || DEFAULT_AVATAR);
          setStatusMsg(`Successfully restored ${validEntries.length} records!`);
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

  const palettes: { id: PaletteTheme; label: string; desc: string; color: string; border: string }[] = [
    {
      id: 'sage',
      label: 'Warm Sage Meadow',
      desc: 'Clean & natural Scandinavian styling (Default)',
      color: '#5D7C57',
      border: '#D9E3D6',
    },
    {
      id: 'linen',
      label: 'Warm Linen & Oatmeal',
      desc: 'Soft cashmere tones, high contrast, zero glare',
      color: '#8C6542',
      border: '#E8E2D8',
    },
    {
      id: 'midnight',
      label: 'Midnight Slumber',
      desc: 'Deep low-light mode for 2 AM feedings',
      color: '#1A221D',
      border: '#334237',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#1D241F] rounded-3xl shadow-2xl border border-[var(--color-primary,#91A98B)]/30 w-full max-w-xl overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col text-[var(--color-text-main,#303832)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-primary,#91A98B)]/20 flex items-center justify-between bg-white/70 dark:bg-[#1D241F]/90 shrink-0">
          <div className="flex items-center gap-3">
            <TinyBloomLogo size={36} />
            <div>
              <h2 className="text-base font-bold font-heading text-[var(--color-text-main,#303832)]">
                TinyBloom Settings & Customization
              </h2>
              <p className="text-xs text-[var(--color-text-muted,#6E7B6C)]">
                100% On-Device · Zero Cloud Tracking · Personal Themes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#2A342D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18]">
          {/* Status Message */}
          {statusMsg && (
            <div className="p-3 rounded-2xl bg-[var(--color-primary,#91A98B)]/20 border border-[var(--color-primary,#91A98B)]/40 text-xs text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-medium flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Theme & Palette Customization */}
          <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                <span>Appearance & Color Palette</span>
              </h3>
            </div>

            {/* Mode: Light vs Dark */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold">Mode</span>
              <div className="flex items-center gap-1 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => onToggleThemeMode('light')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    themeMode === 'light'
                      ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                      : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Daylight</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleThemeMode('dark')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    themeMode === 'dark'
                      ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                      : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Night (2 AM Feedings)</span>
                </button>
              </div>
            </div>

            {/* Top 3 App Themes */}
            <div>
              <span className="block text-xs font-semibold mb-2">App Color Theme (Top 3 Parenting App Styles)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {palettes.map((p) => {
                  const isCurrent = paletteTheme === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onChangePaletteTheme(p.id)}
                      className={`p-3 rounded-2xl text-xs font-medium border transition-all text-left flex flex-col gap-1.5 ${
                        isCurrent
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15 font-bold shadow-xs ring-2 ring-[var(--color-primary)]/30'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-[#202722] hover:bg-stone-100 dark:hover:bg-[#252e27]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white/40"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="font-bold text-xs truncate">{p.label}</span>
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)] line-clamp-2 leading-tight">
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Baby Profile Details & Avatar Selector */}
          <form
            onSubmit={handleSubmitProfile}
            className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-heading text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] uppercase tracking-wider flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                <span>Baby Profile & Avatar</span>
              </h3>
              <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] font-mono">
                {entries.length} records
              </span>
            </div>

            {/* Avatar Selection Area */}
            <div className="p-3 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-2xl border border-[var(--color-primary,#91A98B)]/20 flex flex-col sm:flex-row items-center gap-4">
              <BabyAvatar
                avatarUrl={avatarUrl}
                name={name}
                gender={gender}
                size="lg"
              />

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="block text-xs font-bold text-[var(--color-text-main,#303832)]">
                  Choose Avatar or Upload Baby Photo
                </span>
                
                {/* Preset Avatars */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatarUrl(av.url)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                        avatarUrl === av.url
                          ? 'bg-[var(--color-primary,#91A98B)] text-white border-[var(--color-primary,#91A98B)] shadow-2xs font-bold'
                          : 'bg-white dark:bg-[#202722] border-[var(--color-primary,#91A98B)]/20 hover:bg-[var(--color-primary,#91A98B)]/10 text-[var(--color-text-main,#303832)]'
                      }`}
                    >
                      {av.label}
                    </button>
                  ))}

                  {/* Upload button */}
                  <label className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border border-[var(--color-primary,#91A98B)]/30 bg-white dark:bg-[#202722] hover:bg-[var(--color-primary,#91A98B)]/10 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] cursor-pointer transition-colors shadow-2xs">
                    <Camera className="w-3 h-3" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted,#6E7B6C)] italic">
                  Photos stay 100% on this phone in private storage.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Baby's Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary,#91A98B)] text-[var(--color-text-main,#303832)] font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Sex (For WHO curves)
                </label>
                <div className="grid grid-cols-2 p-1 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20 rounded-xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`py-1.5 rounded-lg transition-all ${
                      gender === 'boy'
                        ? 'bg-[var(--color-primary,#91A98B)] text-white font-semibold shadow-2xs'
                        : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
                    }`}
                  >
                    Boy
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`py-1.5 rounded-lg transition-all ${
                      gender === 'girl'
                        ? 'bg-[var(--color-primary,#91A98B)] text-white font-semibold shadow-2xs'
                        : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
                    }`}
                  >
                    Girl
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary,#91A98B)] font-medium text-[var(--color-text-main,#303832)]"
                />
              </div>
            </div>

            {/* Units Toggle */}
            <div className="pt-2 flex items-center justify-between border-t border-[var(--color-primary,#91A98B)]/15">
              <span className="text-xs font-semibold">Preferred Measurement Units</span>
              <div className="flex items-center gap-1 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => onToggleUnit('metric')}
                  className={`px-2.5 py-1 rounded-lg ${
                    unit === 'metric'
                      ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold'
                      : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
                  }`}
                >
                  kg / cm
                </button>
                <button
                  type="button"
                  onClick={() => onToggleUnit('imperial')}
                  className={`px-2.5 py-1 rounded-lg ${
                    unit === 'imperial'
                      ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold'
                      : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
                  }`}
                >
                  lb·oz / in
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[var(--color-primary,#91A98B)] hover:opacity-90 rounded-xl transition-all shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* TinyBloom Philosophy Link Card */}
          {onOpenHeartfeltModal && (
            <div className="bg-gradient-to-r from-[var(--color-primary,#91A98B)]/20 via-[#F3C9B8]/25 to-[#AFCDE0]/20 p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#202722] shadow-2xs flex items-center justify-center shrink-0 border border-[var(--color-primary,#91A98B)]/20">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] bg-white/70 dark:bg-[#202722] px-2 py-0.5 rounded-md">
                      About Our Mission
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-text-main,#303832)] mt-1 font-heading">
                    TinyBloom Philosophy & Private Storage
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] mt-0.5 leading-relaxed">
                    Explore why TinyBloom was created, why 100% on-device private storage is essential for your child's data, and our heartfelt letter for parents.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHeartfeltModal();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-primary,#91A98B)] text-white hover:opacity-90 shadow-2xs transition-all shrink-0 self-start sm:self-auto flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Read Philosophy</span>
              </button>
            </div>
          )}

          {/* Share & Sync with Partner / Wife */}
          <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                <span>Share & Sync with Partner / Wife</span>
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                100% Private · Zero Cloud
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
              Want your partner or wife to have {name}’s latest records on her phone too? Tap <strong>Copy Sync Link</strong> and send it to her on WhatsApp or Messages. When she taps the link, all {entries.length} measurements load right into her phone!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopySyncLink}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-primary,#91A98B)]/15 hover:bg-[var(--color-primary,#91A98B)]/25 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] text-xs font-bold transition-all shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Sync Link for Partner</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] hover:opacity-90 text-[var(--color-text-main,#303832)] text-xs font-semibold transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[var(--color-primary,#91A98B)]" />
                <span>Send File via WhatsApp (JSON)</span>
              </button>
            </div>
          </div>

          {/* Backup, Export & Restore */}
          <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
              <span>Local Data Backup & Freedom</span>
            </h3>
            <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
              Export your records to keep on your computer or share with a co-parent. You can restore your data onto any phone or tablet anytime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] hover:opacity-90 text-[var(--color-text-main,#303832)] text-xs font-semibold transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[var(--color-primary,#91A98B)]" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] hover:opacity-90 text-[var(--color-text-main,#303832)] text-xs font-semibold transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--color-primary,#91A98B)]" />
                <span>Export Spreadsheet (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-white dark:bg-[#202722] hover:bg-[var(--color-canvas,#FFF9F0)] text-[var(--color-text-main,#303832)] text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-[var(--color-primary,#91A98B)]" />
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
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] hover:opacity-90 text-[var(--color-text-main,#303832)] text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[var(--color-primary,#91A98B)]" />
                  <span>Import Past Rows (Nara / Text)</span>
                </button>
              )}
            </div>
          </div>

          {/* Reset / Setup New Baby / Clear Data */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              {onOpenOnboardingModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOnboardingModal();
                  }}
                  className="text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] hover:underline font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Baby className="w-3.5 h-3.5" />
                  <span>Set Up a New Baby</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Restore authentic sample records for Dhruv?')) {
                    onResetData();
                    setStatusMsg("Restored sample demo records for Dhruv!");
                    setTimeout(() => setStatusMsg(''), 3000);
                  }
                }}
                className="text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Sample Profile (Dhruv)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All Data & Start Fresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wipe Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1D241F] rounded-3xl p-6 border border-red-200 dark:border-red-900 max-w-sm w-full shadow-2xl space-y-4 text-[var(--color-text-main,#303832)]">
            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">
                Permanently delete all baby data?
              </h3>
              <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] mt-1 leading-relaxed">
                This will wipe all {entries.length} measurements and the profile from this device. Please ensure you have downloaded a backup if you need your records.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold bg-stone-100 dark:bg-[#202722] rounded-xl hover:bg-stone-200"
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
