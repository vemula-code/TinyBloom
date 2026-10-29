import React, { useState } from 'react';
import { BabyProfile, Gender, GrowthEntry, MetricUnit, ThemeMode, PaletteTheme } from '../types/growth';
import { TinyBloomLogo } from './TinyBloomLogo';
import { BabyAvatar } from './BabyAvatar';
import { PWAInstallButton } from './PWAInstallButton';
import { MeasurementHistory } from './MeasurementHistory';
import { PRESET_AVATARS, DEFAULT_AVATAR } from '../data/defaultData';
import { kgToLbsOz, cmToInches } from '../data/whoGrowthStandards';
import { generateSyncUrl } from '../utils/syncPayload';
import {
  X,
  Download,
  Upload,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  Check,
  Baby,
  Trash2,
  Lock,
  Sun,
  Moon,
  Palette,
  Heart,
  Camera,
  Share2,
  Copy,
  Layers,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export type SettingsDepartment = 'profile' | 'theme' | 'history' | 'download' | 'install';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  onSaveProfile: (profile: BabyProfile) => void;
  entries: GrowthEntry[];
  onImportData: (profile: BabyProfile, entries: GrowthEntry[]) => void;
  onResetData: () => void;
  onDeleteAll?: () => void;
  onOpenImportPastData?: () => void;
  unit: MetricUnit;
  onToggleUnit: (u: MetricUnit) => void;
  themeMode: ThemeMode;
  onToggleThemeMode: (mode: ThemeMode) => void;
  paletteTheme: PaletteTheme;
  onChangePaletteTheme: (palette: PaletteTheme) => void;
  onOpenHeartfeltModal?: () => void;
  onOpenOnboardingModal?: () => void;
  onNavigateToHistory?: () => void;
  onEditEntry?: (entry: GrowthEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onOpenAddModal?: () => void;
  initialDepartment?: SettingsDepartment;
  chartTimelineRange?: 'auto' | 6 | 12 | 18 | 24;
  onChangeChartTimelineRange?: (range: 'auto' | 6 | 12 | 18 | 24) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  entries,
  onImportData,
  onResetData,
  onDeleteAll,
  onOpenImportPastData,
  unit,
  onToggleUnit,
  themeMode,
  onToggleThemeMode,
  paletteTheme,
  onChangePaletteTheme,
  onOpenHeartfeltModal,
  onOpenOnboardingModal,
  onNavigateToHistory,
  onEditEntry,
  onDeleteEntry,
  onOpenAddModal,
  initialDepartment = 'profile',
  chartTimelineRange = 'auto',
  onChangeChartTimelineRange,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<SettingsDepartment>(initialDepartment);
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || DEFAULT_AVATAR);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync internal form when profile prop changes
  React.useEffect(() => {
    setName(profile.name);
    setGender(profile.gender);
    setBirthDate(profile.birthDate);
    setAvatarUrl(profile.avatarUrl || DEFAULT_AVATAR);
  }, [profile]);

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
    setStatusMsg('✨ Profile updated successfully!');
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
        setStatusMsg('Photo loaded! Remember to tap Save Profile.');
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
      version: '2.2',
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
    a.download = `tinybloom-${(name || 'baby').toLowerCase().replace(/\s+/g, '-')}-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg('Full JSON backup downloaded to your device!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // Export CSV Spreadsheet
  const handleExportCSV = () => {
    if (entries.length === 0) {
      setErrorMsg('No entries to export yet.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

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
      'Doctor Notes',
    ];

    const rows = entries.map((e) => {
      const wLbs = e.weightKg ? kgToLbsOz(e.weightKg).displayStr : '';
      const hIn = e.heightCm ? cmToInches(e.heightCm).toFixed(2) : '';
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
    a.download = `tinybloom-${(name || 'baby').toLowerCase().replace(/\s+/g, '-')}-growth-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg('Clinical CSV spreadsheet downloaded!');
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
          name: parsed.profile?.name || 'My Baby',
          gender: parsed.profile?.gender || 'boy',
          birthDate: parsed.profile?.birthDate || new Date().toISOString().split('T')[0],
          avatarUrl: parsed.profile?.avatarUrl || DEFAULT_AVATAR,
          notes: parsed.profile?.notes || '',
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

  // Complete wipe & start fresh
  const handleConfirmDeleteAll = () => {
    if (onDeleteAll) {
      onDeleteAll();
    } else {
      try {
        localStorage.removeItem('tinybloom_profile');
        localStorage.removeItem('tinybloom_entries');
        localStorage.removeItem('tinybloom_completed_milestones');
        localStorage.removeItem('tinybloom_onboarded');
        localStorage.removeItem('naragrowth_profile');
        localStorage.removeItem('naragrowth_entries');
        localStorage.removeItem('naragrowth_completed_milestones');
        localStorage.setItem('tinybloom_entries', JSON.stringify([]));
        localStorage.setItem('tinybloom_wiped', 'true');
      } catch (e) {
        console.error(e);
      }
      const fresh: BabyProfile = {
        id: `baby-${Date.now()}`,
        name: 'My Baby',
        gender: 'boy',
        birthDate: new Date().toISOString().split('T')[0],
        avatarUrl: DEFAULT_AVATAR,
        notes: 'Private baby growth tracker',
      };
      onImportData(fresh, []);
    }

    setName('My Baby');
    setGender('boy');
    setBirthDate(new Date().toISOString().split('T')[0]);
    setAvatarUrl(DEFAULT_AVATAR);
    setShowDeleteConfirm(false);
    setStatusMsg('🧹 All baby records have been completely erased from this device.');
    setTimeout(() => {
      setStatusMsg('');
      onClose();
    }, 2000);
  };

  const palettes: { id: PaletteTheme; label: string; desc: string; color: string; border: string }[] = [
    {
      id: 'sage',
      label: 'Warm Sage Meadow',
      desc: 'Fresh eucalyptus, calm botanical hues & cream (Default)',
      color: '#5D7C57',
      border: '#D9E3D6',
    },
    {
      id: 'linen',
      label: 'Warm Linen & Oatmeal',
      desc: 'Cashmere earth tones, warm contrast, zero eye strain',
      color: '#8C6542',
      border: '#E8E2D8',
    },
    {
      id: 'midnight',
      label: 'Midnight Slumber',
      desc: 'High contrast deep theme engineered for 2 AM feedings',
      color: '#1A221D',
      border: '#334237',
    },
  ];

  const departments: { id: SettingsDepartment; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'profile', label: 'Baby Profile', icon: <Baby className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme & Style', icon: <Palette className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Layers className="w-4 h-4" />, badge: `${entries.length}` },
    { id: 'download', label: 'Data & Backup', icon: <Download className="w-4 h-4" /> },
    { id: 'install', label: 'Install App', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#1D241F] rounded-3xl shadow-2xl border border-[var(--color-primary,#91A98B)]/30 w-full max-w-2xl overflow-hidden h-[88vh] max-h-[660px] min-h-[520px] flex flex-col text-[var(--color-text-main,#303832)]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[var(--color-primary,#91A98B)]/20 flex items-center justify-between bg-white dark:bg-[#1D241F] shrink-0">
          <div className="flex items-center gap-3">
            <TinyBloomLogo size={34} />
            <div>
              <h2 className="text-base font-bold font-heading text-[var(--color-text-main,#303832)] leading-tight">
                Settings & Preferences
              </h2>
              <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                100% On-Device · Zero Cloud Tracking · Private
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#2A342D] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Departments Navigation Bar (Horizontal scrolling tabs) */}
        <div className="px-3 sm:px-5 py-2 border-b border-[var(--color-primary,#91A98B)]/15 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {departments.map((dept) => {
            const isActive = activeDepartment === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  setActiveDepartment(dept.id);
                  setShowDeleteConfirm(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[var(--color-primary,#5D7C57)] text-white shadow-xs'
                    : 'text-[var(--color-text-muted,#6E7B6C)] hover:bg-[var(--color-primary,#91A98B)]/10 hover:text-[var(--color-text-main,#303832)]'
                }`}
              >
                {dept.icon}
                <span>{dept.label}</span>
                {dept.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-[var(--color-primary,#91A98B)]/20 text-[var(--color-text-main,#303832)]'
                    }`}
                  >
                    {dept.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status & Error Toasts */}
        {statusMsg && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-[var(--color-primary,#91A98B)]/15 border border-[var(--color-primary,#91A98B)]/30 text-xs text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Department Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18]">
          
          {/* ========================================================
              DEPARTMENT 1: BABY PROFILE
             ======================================================== */}
          {activeDepartment === 'profile' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                    <span>Baby Information</span>
                  </h3>
                  <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">Stored only on this phone</span>
                </div>

                <form onSubmit={handleSubmitProfile} className="space-y-4">
                  {/* Avatar Picker & Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                      Baby Photo / Avatar
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <BabyAvatar
                          avatarUrl={avatarUrl}
                          name={name}
                          gender={gender}
                          size="lg"
                          className="border-2 border-[var(--color-primary,#91A98B)]/40 shadow-xs"
                        />
                        <label
                          htmlFor="settings-photo-upload"
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-primary,#5D7C57)] text-white flex items-center justify-center cursor-pointer shadow-xs hover:opacity-90"
                          title="Upload baby photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </label>
                        <input
                          id="settings-photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </div>

                      <div className="flex-1">
                        <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] block mb-1.5">
                          Tap camera icon to upload a photo, or select an illustration:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {PRESET_AVATARS.map((av) => (
                            <button
                              key={av.id}
                              type="button"
                              onClick={() => setAvatarUrl(av.url)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                                avatarUrl === av.url
                                  ? 'bg-[var(--color-primary,#5D7C57)] text-white shadow-2xs font-bold'
                                  : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] text-[var(--color-text-main,#303832)] border border-[var(--color-primary,#91A98B)]/30 hover:border-[var(--color-primary,#91A98B)]'
                              }`}
                            >
                              {av.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                      Baby’s Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya, Lucas, Baby"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] text-[var(--color-text-main,#303832)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#91A98B)]"
                      required
                    />
                  </div>

                  {/* Gender Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                      Sex Assigned at Birth (for WHO Standards)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender('boy')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          gender === 'boy'
                            ? 'bg-[#EBF3ED] text-[#2D5A38] border-[#2D5A38] shadow-xs'
                            : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                        }`}
                      >
                        👦 Boy Curve
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('girl')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          gender === 'girl'
                            ? 'bg-[#FDF2F0] text-[#9C5D47] border-[#9C5D47] shadow-xs'
                            : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                        }`}
                      >
                        👧 Girl Curve
                      </button>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] text-[var(--color-text-main,#303832)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#91A98B)]"
                      required
                    />
                  </div>

                  {/* Unit Preferences */}
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                      Preferred Measurement Units
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleUnit('metric')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          unit === 'metric'
                            ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                            : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                        }`}
                      >
                        Metric (kg, cm)
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleUnit('imperial')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          unit === 'imperial'
                            ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                            : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                        }`}
                      >
                        Imperial (lbs/oz, in)
                      </button>
                    </div>
                  </div>

                  {/* Growth Chart Timeline Range Preference */}
                  {onChangeChartTimelineRange && (
                    <div className="space-y-1.5 pt-2 border-t border-[var(--color-primary,#91A98B)]/20">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                          Growth Chart Timeline Range
                        </label>
                        <span className="text-[10px] text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-medium">
                          Auto: by baby&apos;s age
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                        Controls the time horizon on the WHO growth chart. By default, TinyBloom automatically adjusts: &lt;3m &rarr; 0–6m, 3–10m &rarr; 0–12m, &gt;10m &rarr; 0–24m.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onChangeChartTimelineRange('auto')}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col cursor-pointer ${
                            chartTimelineRange === 'auto'
                              ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                              : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                          }`}
                        >
                          <span className="font-bold flex items-center gap-1">✨ Auto (by Age)</span>
                          <span className="text-[9px] opacity-80 mt-0.5">Recommended</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onChangeChartTimelineRange(6)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col justify-center cursor-pointer ${
                            chartTimelineRange === 6
                              ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                              : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                          }`}
                        >
                          <span className="font-bold">0–6 Months</span>
                          <span className="text-[9px] opacity-80 mt-0.5">Newborn &amp; Infant</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onChangeChartTimelineRange(12)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col justify-center cursor-pointer ${
                            chartTimelineRange === 12
                              ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                              : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                          }`}
                        >
                          <span className="font-bold">0–12 Months</span>
                          <span className="text-[9px] opacity-80 mt-0.5">First Year Focus</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onChangeChartTimelineRange(18)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col justify-center cursor-pointer ${
                            chartTimelineRange === 18
                              ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                              : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                          }`}
                        >
                          <span className="font-bold">0–18 Months</span>
                          <span className="text-[9px] opacity-80 mt-0.5">Early Toddler</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onChangeChartTimelineRange(24)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex flex-col justify-center cursor-pointer ${
                            chartTimelineRange === 24
                              ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                              : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                          }`}
                        >
                          <span className="font-bold">0–24 Months</span>
                          <span className="text-[9px] opacity-80 mt-0.5">Full 2 Years</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Why We Built This App Shortcut */}
                  {onOpenHeartfeltModal && (
                    <div className="pt-2 border-t border-[var(--color-primary,#91A98B)]/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[var(--color-text-main,#303832)] block">
                          About TinyBloom
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                          Why we built this app (100% private, zero anxiety)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenHeartfeltModal}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/50 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                        <span>Our Story</span>
                      </button>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[var(--color-primary,#5D7C57)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================
              DEPARTMENT 2: THEME & COLOR PALETTE
             ======================================================== */}
          {activeDepartment === 'theme' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                    <span>Display Mode & Palette</span>
                  </h3>
                </div>

                {/* Mode: Light vs Dark vs Midnight */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                    Display Appearance
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleThemeMode('light')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                        themeMode === 'light'
                          ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                          : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Day / Light Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleThemeMode('dark')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                        themeMode === 'dark'
                          ? 'bg-[var(--color-primary,#5D7C57)] text-white border-[var(--color-primary,#5D7C57)] shadow-xs'
                          : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Night / Dark Mode</span>
                    </button>
                  </div>
                </div>

                {/* Color Palette Choices */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                    Color Palettes (Engineered for high readability)
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {palettes.map((p) => {
                      const isSelected = paletteTheme === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => onChangePaletteTheme(p.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[var(--color-primary,#5D7C57)] bg-[var(--color-primary,#91A98B)]/10 ring-2 ring-[var(--color-primary,#91A98B)]/40 shadow-xs'
                              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1D241F] hover:border-[var(--color-primary,#91A98B)]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-6 h-6 rounded-full shrink-0 shadow-2xs border border-white dark:border-stone-800"
                              style={{ backgroundColor: p.color }}
                            />
                            <div>
                              <span className="text-xs font-bold text-[var(--color-text-main,#303832)] block">
                                {p.label}
                              </span>
                              <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] block">
                                {p.desc}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[var(--color-primary,#5D7C57)] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              DEPARTMENT 3: MEASUREMENT HISTORY
             ======================================================== */}
          {activeDepartment === 'history' && (
            <div className="space-y-4">
              <MeasurementHistory
                profile={profile}
                entries={entries}
                unit={unit}
                onEditEntry={(e) => {
                  if (onEditEntry) {
                    onEditEntry(e);
                    onClose();
                  }
                }}
                onDeleteEntry={(id) => {
                  if (onDeleteEntry) {
                    onDeleteEntry(id);
                  }
                }}
                onOpenAddModal={() => {
                  if (onOpenAddModal) {
                    onOpenAddModal();
                    onClose();
                  }
                }}
              />
            </div>
          )}

          {/* ========================================================
              DEPARTMENT 4: DATA BACKUP & PRIVACY
             ======================================================== */}
          {activeDepartment === 'download' && (
            <div className="space-y-5 max-w-xl mx-auto">
              {/* Privacy Guarantee */}
              <div className="bg-white dark:bg-[#1D241F] p-4 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 flex items-start gap-3 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary,#5D7C57)] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-[var(--color-text-main,#303832)] block">
                    Zero Cloud Tracking Guarantee
                  </span>
                  <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
                    TinyBloom stores your baby’s measurements exclusively on this device. We do not transmit or sell personal health records. You own 100% of your data.
                  </p>
                </div>
              </div>

              {/* Download & Export Options */}
              <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-3.5 shadow-2xs">
                <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                  <span>Download & Export Records</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* CSV Spreadsheet */}
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="p-3.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] hover:border-[var(--color-primary,#91A98B)] flex flex-col justify-between text-left transition-all group"
                  >
                    <div>
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1.5" />
                      <span className="text-xs font-bold text-[var(--color-text-main,#303832)] block">
                        Spreadsheet (CSV)
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] block">
                        Open in Excel or print for your pediatrician
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] mt-3 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download CSV
                    </span>
                  </button>

                  {/* Full JSON Backup */}
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="p-3.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] hover:border-[var(--color-primary,#91A98B)] flex flex-col justify-between text-left transition-all group"
                  >
                    <div>
                      <Download className="w-5 h-5 text-blue-600 mb-1.5" />
                      <span className="text-xs font-bold text-[var(--color-text-main,#303832)] block">
                        JSON Data Archive
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] block">
                        Complete raw backup of profile & entries
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download Backup
                    </span>
                  </button>
                </div>

                {/* Restore Backup */}
                <div className="pt-2 border-t border-[var(--color-primary,#91A98B)]/15">
                  <label
                    htmlFor="settings-json-restore"
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[var(--color-primary,#91A98B)]/40 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] text-xs font-semibold text-[var(--color-text-main,#303832)] hover:border-[var(--color-primary,#91A98B)] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[var(--color-primary,#5D7C57)]" />
                    <span>Restore from JSON Backup File</span>
                  </label>
                  <input
                    id="settings-json-restore"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJSON}
                  />
                </div>
              </div>

              {/* Co-Parent Partner Sync Link */}
              <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[var(--color-primary,#5D7C57)]" />
                  <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                    Sync with Spouse or Partner
                  </h3>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
                  Generate a private, self-contained sync link containing your baby’s measurements. When your partner opens the link on their phone, the data merges instantly.
                </p>
                <button
                  type="button"
                  onClick={handleCopySyncLink}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-primary,#91A98B)]/15 hover:bg-[var(--color-primary,#91A98B)]/25 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-[var(--color-primary,#91A98B)]/30"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Private Partner Sync Link</span>
                </button>
              </div>

              {/* Danger Zone: Delete All Data & Start Fresh */}
              <div className="bg-red-50/70 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200 dark:border-red-900/50 space-y-3">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <Trash2 className="w-4 h-4" />
                  <h4 className="text-xs font-bold font-heading uppercase tracking-wider">
                    Delete All Data & Start Fresh
                  </h4>
                </div>
                <p className="text-[11px] text-red-600/90 dark:text-red-300/80 leading-relaxed">
                  Permanently erase all baby details, growth measurements, and local history from this device to start fresh.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="py-2 px-3.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete All Data & Start Fresh</span>
                  </button>
                ) : (
                  <div className="p-3 bg-white dark:bg-[#1D241F] rounded-xl border border-red-300 dark:border-red-800 space-y-2.5">
                    <span className="text-xs font-bold text-red-700 dark:text-red-400 block">
                      ⚠️ Are you completely sure? This will wipe all {entries.length} records immediately.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmDeleteAll}
                        className="py-2 px-4 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
                      >
                        Yes, Erase Everything
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="py-2 px-3 bg-stone-100 dark:bg-[#2A342D] text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold hover:bg-stone-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              DEPARTMENT 5: INSTALL APP ON PHONE
             ======================================================== */}
          {activeDepartment === 'install' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="bg-white dark:bg-[#1D241F] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F4E8] border border-[var(--color-primary,#91A98B)]/30 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/assets/images/tinybloom-emblem.png"
                      alt="TinyBloom Icon"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-heading text-[var(--color-text-main,#303832)]">
                      Install TinyBloom on your Phone
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                      Instant launch from your home screen · Works 100% offline
                    </p>
                  </div>
                </div>

                {/* 1-Tap PWA Install Button */}
                <div className="p-3 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-xl border border-[var(--color-primary,#91A98B)]/20">
                  <span className="text-[11px] font-semibold text-[var(--color-text-main,#303832)] block mb-2">
                    Android & Chrome 1-Tap Install:
                  </span>
                  <PWAInstallButton className="w-full justify-center" />
                </div>

                {/* Step by step iPhone / Apple Safari instructions */}
                <div className="space-y-2 pt-2 border-t border-[var(--color-primary,#91A98B)]/15">
                  <span className="text-xs font-bold text-[var(--color-text-main,#303832)] block flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[var(--color-primary,#5D7C57)]" />
                    <span>iPhone / iOS Safari Instructions</span>
                  </span>
                  <ol className="space-y-2 text-xs text-[var(--color-text-muted,#6E7B6C)]">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-primary,#5D7C57)]/15 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-bold flex items-center justify-center text-[11px] shrink-0">
                        1
                      </span>
                      <span>
                        Open this page in <strong>Safari</strong> on your iPhone.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-primary,#5D7C57)]/15 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-bold flex items-center justify-center text-[11px] shrink-0">
                        2
                      </span>
                      <span>
                        Tap the <strong>Share</strong> button at the bottom of the screen (the square icon with the arrow pointing up: ⎋).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-primary,#5D7C57)]/15 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-bold flex items-center justify-center text-[11px] shrink-0">
                        3
                      </span>
                      <span>
                        Scroll down and tap <strong>Add to Home Screen ⊞</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-primary,#5D7C57)]/15 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-bold flex items-center justify-center text-[11px] shrink-0">
                        4
                      </span>
                      <span>
                        Tap <strong>Add</strong> in the top right. TinyBloom with the beautiful sprout and baby icon is now on your home screen!
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-primary,#91A98B)]/20 bg-white dark:bg-[#1D241F] flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
            TinyBloom v2.2 · WHO 2006 Standards
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 dark:bg-[#2A342D] hover:bg-stone-200 dark:hover:bg-[#344238] font-bold text-[var(--color-text-main,#303832)] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
