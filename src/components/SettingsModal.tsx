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
  QrCode,
  Layers,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export type SettingsDepartment = 'profile' | 'theme' | 'history' | 'download' | 'install';
export type PhotoPermissionMode = 'disabled' | 'limited' | 'full';

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
  onOpenPartnerSync?: () => void;
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
  onOpenScreenshotImport?: () => void;
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
  onOpenPartnerSync,
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
  onOpenScreenshotImport,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<SettingsDepartment>(initialDepartment);
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(profile.gestationalWeeks || 40);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || DEFAULT_AVATAR);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Photo & Document access permission mode (disabled by default for strict mobile privacy)
  const [photoPermission, setPhotoPermission] = useState<PhotoPermissionMode>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_photo_permission');
      if (saved === 'limited' || saved === 'full' || saved === 'disabled') {
        return saved as PhotoPermissionMode;
      }
    } catch {
      // fallback
    }
    return 'disabled';
  });

  const handleUpdatePhotoPermission = (mode: PhotoPermissionMode) => {
    setPhotoPermission(mode);
    try {
      localStorage.setItem('tinybloom_photo_permission', mode);
    } catch {
      // fallback
    }
    setStatusMsg(
      mode === 'disabled'
        ? 'Photo & Document scanner disabled (Zero device media access)'
        : mode === 'limited'
        ? 'Limited access enabled (Single screenshots read in-memory and discarded)'
        : 'Full photo access enabled for fast multi-screenshot imports'
    );
    setTimeout(() => setStatusMsg(''), 4000);
  };

  // Sync internal form when profile prop changes
  React.useEffect(() => {
    setName(profile.name);
    setGender(profile.gender);
    setBirthDate(profile.birthDate);
    setGestationalWeeks(profile.gestationalWeeks || 40);
    setAvatarUrl(profile.avatarUrl || DEFAULT_AVATAR);
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = (!profile.id || profile.id === 'demo-sample-baby' || profile.id === 'baby-main')
      ? `baby-${Date.now()}`
      : profile.id;

    const newProfile: BabyProfile = {
      ...profile,
      id: cleanId,
      name: name.trim() || 'My Baby',
      gender,
      birthDate,
      gestationalWeeks: gestationalWeeks < 37 ? gestationalWeeks : undefined,
      avatarUrl,
    };

    onSaveProfile(newProfile);
    try {
      localStorage.setItem('tinybloom_profile', JSON.stringify(newProfile));
      localStorage.setItem('tinybloom_onboarded', 'true');
      localStorage.removeItem('tinybloom_wiped');
    } catch (err) {
      console.error(err);
    }
    setStatusMsg(`✨ ${newProfile.name}’s profile saved to your device!`);
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
      const url = generateSyncUrl(activeProf, entries, unit);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setStatusMsg('✨ Private sync link copied to clipboard! Send to your partner on WhatsApp or Messages.');
      } else {
        window.prompt('Copy this sync link to send to your partner:', url);
        setStatusMsg('Sync link generated!');
      }
      setTimeout(() => setStatusMsg(''), 4500);
    } catch (err: any) {
      setErrorMsg('Could not copy link to clipboard automatically.');
    }
  };

  // Direct 1-tap share via WhatsApp, Messages, etc.
  const handleShareSyncLink = async () => {
    try {
      const activeProf: BabyProfile = {
        ...profile,
        name: name.trim() || profile.name,
        gender,
        birthDate,
        avatarUrl,
      };
      const url = generateSyncUrl(activeProf, entries, unit);
      if (navigator.share) {
        await navigator.share({
          title: `${activeProf.name}’s Growth Tracker · TinyBloom`,
          text: `Hi! Here is ${activeProf.name}’s baby growth curves and milestone tracker. Open this link on your phone to sync everything instantly:`,
          url,
        });
        setStatusMsg('✨ Shared with partner!');
      } else {
        await handleCopySyncLink();
      }
      setTimeout(() => setStatusMsg(''), 4500);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        await handleCopySyncLink();
      }
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

  const palettes: {
    id: PaletteTheme;
    label: string;
    tag: string;
    desc: string;
    color: string;
    canvasLight: string;
    canvasDark: string;
    badge: string;
  }[] = [
    {
      id: 'apple-health',
      label: 'Ocean Blue',
      tag: 'Top Health App',
      desc: 'Crisp sapphire blue, high-contrast slate & deep navy night mode',
      color: '#1D63DC',
      canvasLight: '#F4F7FB',
      canvasDark: '#0B111E',
      badge: 'Clinical',
    },
    {
      id: 'huckleberry',
      label: 'Calm Teal',
      tag: 'Top Parenting App',
      desc: 'Serene pediatric teal, clean porcelain & calm ocean slate',
      color: '#0E7490',
      canvasLight: '#F2F8F9',
      canvasDark: '#0A1518',
      badge: 'Clarity',
    },
    {
      id: 'sage',
      label: 'Botanical Sage',
      tag: 'Baby Nursery',
      desc: 'Gentle sprout sage, warm cream linen & soothing forest night',
      color: '#3D6E41',
      canvasLight: '#F7F6F1',
      canvasDark: '#101712',
      badge: 'Organic',
    },
    {
      id: 'honey',
      label: 'Warm Nursery',
      tag: 'Golden Oat',
      desc: 'Warm toasted oat, soft apricot glow & cozy cocoa night mode',
      color: '#B86B35',
      canvasLight: '#FBF7F2',
      canvasDark: '#17120E',
      badge: 'Cozy',
    },
  ];

  const departments: { id: SettingsDepartment; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'profile', label: 'Baby Profile', icon: <Baby className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme & Style', icon: <Palette className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Layers className="w-4 h-4" />, badge: `${entries.length}` },
    { id: 'download', label: 'Data & Privacy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'install', label: 'Install App', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[var(--color-card)] rounded-3xl shadow-2xl border border-[var(--color-card-border)] w-full max-w-2xl overflow-hidden h-[88vh] max-h-[660px] min-h-[520px] flex flex-col text-[var(--color-text-main)]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[var(--color-card-border)] flex items-center justify-between bg-[var(--color-card)] shrink-0">
          <div className="flex items-center gap-3">
            <TinyBloomLogo size={34} />
            <div>
              <h2 className="text-base font-bold font-heading text-[var(--color-text-main)] leading-tight">
                Settings & Preferences
              </h2>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                100% On-Device · Zero Cloud Tracking · Private
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Departments Navigation Bar (Horizontal scrolling tabs) */}
        <div className="px-3 sm:px-5 py-2 border-b border-[var(--color-card-border)] bg-[var(--color-canvas)] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[var(--color-canvas)]">
          
          {/* ========================================================
              DEPARTMENT 1: BABY PROFILE
             ======================================================== */}
          {activeDepartment === 'profile' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-card-border)] space-y-4 shadow-2xs">
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
                                  : 'bg-[var(--color-canvas)] text-[var(--color-text-main,#303832)] border border-[var(--color-primary,#91A98B)]/30 hover:border-[var(--color-primary,#91A98B)]'
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas)] text-[var(--color-text-main,#303832)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#91A98B)]"
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
                            : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                            : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas)] text-[var(--color-text-main,#303832)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#91A98B)]"
                      required
                    />
                  </div>

                  {/* Gestational Age at Birth (Optional Preterm Corrected Age) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold block text-[var(--color-text-main,#303832)]">
                        Gestational Age at Birth (Corrected Age)
                      </label>
                      {gestationalWeeks < 37 && (
                        <span className="text-[10px] font-bold text-[var(--color-primary)]">
                          Preterm Mode Active
                        </span>
                      )}
                    </div>
                    <select
                      value={gestationalWeeks}
                      onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas)] text-[var(--color-text-main,#303832)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#91A98B)]"
                    >
                      <option value={40}>Full Term (37–42 weeks · Standard WHO Age)</option>
                      {[36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24].map((w) => (
                        <option key={w} value={w}>
                          {w} weeks ({40 - w} weeks early · Plot corrected age)
                        </option>
                      ))}
                    </select>
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
                            : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                            : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                              : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                              : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                              : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                              : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                              : 'bg-[var(--color-canvas)] border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-muted,#6E7B6C)]'
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
                          First baby, what the curves actually mean &amp; why we built this
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
              <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                    <span>Display Mode & Palette</span>
                  </h3>
                </div>

                {/* Mode: Light vs Dark vs System */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold block text-[var(--color-text-main)]">
                    Display Appearance
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleThemeMode('system')}
                      className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        themeMode === 'system'
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs'
                          : 'bg-[var(--color-canvas)] border-[var(--color-card-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Phone System</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleThemeMode('light')}
                      className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs'
                          : 'bg-[var(--color-canvas)] border-[var(--color-card-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Day Light</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleThemeMode('dark')}
                      className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        themeMode === 'dark'
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs'
                          : 'bg-[var(--color-canvas)] border-[var(--color-card-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Nursery Dark</span>
                    </button>
                  </div>
                </div>

                {/* Color Palette Choices - 4 Curated Themes */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] flex items-center gap-1.5 uppercase tracking-wide">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Curated Color Themes</span>
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                        4 balanced styles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {palettes.map((p) => {
                        const isSelected = paletteTheme === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => onChangePaletteTheme(p.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] ring-2 ring-[var(--color-primary)]/30 shadow-xs'
                                : 'border-[var(--color-card-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface)]/40'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Dual Day / Dark + Accent swatch preview */}
                              <div className="w-9 h-9 rounded-xl shrink-0 overflow-hidden border border-[var(--color-card-border)] shadow-2xs relative flex flex-col">
                                <div className="flex-1 w-full" style={{ backgroundColor: p.canvasLight }} />
                                <div className="flex-1 w-full" style={{ backgroundColor: p.canvasDark }} />
                                <span
                                  className="w-4 h-4 rounded-full border-2 border-white shadow-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                  style={{ backgroundColor: p.color }}
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-[var(--color-text-main)]">
                                    {p.label}
                                  </span>
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
                                    {p.tag}
                                  </span>
                                </div>
                                <span className="text-[11px] text-[var(--color-text-muted)] block truncate mt-0.5">
                                  {p.desc}
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 ml-2 shadow-2xs">
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
              <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 flex items-start gap-3 shadow-2xs">
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

              {/* Photo & Document Scanner Permission Card (Mobile Permission Control - Disabled by Default) */}
              <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[var(--color-primary,#5D7C57)]" />
                      <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                        Photo &amp; Document Scanner Permission
                      </h3>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
                      To protect your privacy on mobile, scanner access is <strong>disabled by default</strong>. Choose your preferred access level before importing records.
                    </p>
                  </div>

                  {/* Current Status Badge */}
                  <div className="shrink-0">
                    {photoPermission === 'disabled' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-bold text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                        <Lock className="w-3 h-3 text-stone-500" />
                        Disabled
                      </span>
                    )}
                    {photoPermission === 'limited' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        Limited Access
                      </span>
                    )}
                    {photoPermission === 'full' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Access Allowed
                      </span>
                    )}
                  </div>
                </div>

                {/* Granular Permission Options (Mobile App Style) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[var(--color-text-main,#303832)] block">
                    Permission Access Level:
                  </span>

                  {/* 1. Disabled (Default) */}
                  <label
                    onClick={() => handleUpdatePhotoPermission('disabled')}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      photoPermission === 'disabled'
                        ? 'border-[var(--color-primary,#5D7C57)] bg-[var(--color-primary,#91A98B)]/10 ring-1 ring-[var(--color-primary,#91A98B)]/30'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="photo-permission-opt"
                      checked={photoPermission === 'disabled'}
                      onChange={() => handleUpdatePhotoPermission('disabled')}
                      className="mt-0.5 accent-[var(--color-primary,#5D7C57)]"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-[var(--color-text-main,#303832)] flex items-center justify-between">
                        <span>Disabled (Zero photo or camera access)</span>
                        <span className="text-[10px] text-stone-500 font-semibold">Default</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-0.5 leading-snug">
                        Scanner is locked. TinyBloom cannot request, open, or view photos or documents from your device.
                      </p>
                    </div>
                  </label>

                  {/* 2. Limited Access */}
                  <label
                    onClick={() => handleUpdatePhotoPermission('limited')}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      photoPermission === 'limited'
                        ? 'border-[var(--color-primary,#5D7C57)] bg-[var(--color-primary,#91A98B)]/10 ring-1 ring-[var(--color-primary,#91A98B)]/30'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="photo-permission-opt"
                      checked={photoPermission === 'limited'}
                      onChange={() => handleUpdatePhotoPermission('limited')}
                      className="mt-0.5 accent-[var(--color-primary,#5D7C57)]"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-[var(--color-text-main,#303832)] flex items-center justify-between">
                        <span>Limited Access (Selected Photos Only)</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">In-Memory Read</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-0.5 leading-snug">
                        Allows you to pick individual screenshots or clinic checkup sheets. Images are processed in temporary memory to read numbers and immediately erased.
                      </p>
                    </div>
                  </label>

                  {/* 3. Allow Access */}
                  <label
                    onClick={() => handleUpdatePhotoPermission('full')}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      photoPermission === 'full'
                        ? 'border-[var(--color-primary,#5D7C57)] bg-[var(--color-primary,#91A98B)]/10 ring-1 ring-[var(--color-primary,#91A98B)]/30'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="photo-permission-opt"
                      checked={photoPermission === 'full'}
                      onChange={() => handleUpdatePhotoPermission('full')}
                      className="mt-0.5 accent-[var(--color-primary,#5D7C57)]"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-[var(--color-text-main,#303832)] flex items-center justify-between">
                        <span>Allow Photo &amp; Document Access</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Full Access</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-0.5 leading-snug">
                        Permit fast imports from growth logs, checkup slips, or pediatrician visit summaries anytime.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Scanner Launch Button / Locked Banner */}
                <div className="pt-2 border-t border-[var(--color-primary,#91A98B)]/15">
                  {photoPermission === 'disabled' ? (
                    <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                        <Lock className="w-4 h-4 shrink-0 text-stone-400" />
                        <span>Scanner is disabled to guarantee mobile data privacy.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdatePhotoPermission('limited')}
                        className="text-[11px] font-bold text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] hover:underline shrink-0 cursor-pointer"
                      >
                        Enable Limited Access →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onOpenScreenshotImport) onOpenScreenshotImport();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98"
                      >
                        <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>📸 Launch Screenshot &amp; Document Scanner</span>
                      </button>
                      <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted,#6E7B6C)] px-1">
                        <span>Status: {photoPermission === 'limited' ? 'Limited (Selected Photos Only)' : 'Photo Access Granted'}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdatePhotoPermission('disabled')}
                          className="text-red-600 dark:text-red-400 hover:underline font-semibold cursor-pointer"
                        >
                          Revoke Permission
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Download & Export Options */}
              <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-3.5 shadow-2xs">
                <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                  <span>Download &amp; Export Records</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* CSV Spreadsheet */}
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="p-3.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas)] hover:border-[var(--color-primary,#91A98B)] flex flex-col justify-between text-left transition-all group"
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
                    className="p-3.5 rounded-xl border border-[var(--color-primary,#91A98B)]/30 bg-[var(--color-canvas)] hover:border-[var(--color-primary,#91A98B)] flex flex-col justify-between text-left transition-all group"
                  >
                    <div>
                      <Download className="w-5 h-5 text-blue-600 mb-1.5" />
                      <span className="text-xs font-bold text-[var(--color-text-main,#303832)] block">
                        JSON Data Archive
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] block">
                        Complete raw backup of profile &amp; entries
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download Backup
                    </span>
                  </button>
                </div>

                {/* Restore Backup */}
                <div className="pt-2 border-t border-[var(--color-primary,#91A98B)]/15 space-y-2">
                  <label
                    htmlFor="settings-json-restore"
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[var(--color-primary,#91A98B)]/40 bg-[var(--color-canvas)] text-xs font-semibold text-[var(--color-text-main,#303832)] hover:border-[var(--color-primary,#91A98B)] flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
              <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-emerald-500/30 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                      Sync with Spouse or Partner
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    Instant
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
                  Send a private sync link to your partner on WhatsApp or Messages. When she opens it on her phone, all of {name.trim() || profile.name}’s measurements and curves load immediately.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleShareSyncLink}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Send via WhatsApp / Messages</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySyncLink}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--color-primary,#91A98B)]/15 hover:bg-[var(--color-primary,#91A98B)]/25 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-[var(--color-primary,#91A98B)]/30 cursor-pointer active:scale-98"
                  >
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>Copy Sync Link</span>
                  </button>
                </div>
                {onOpenPartnerSync && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPartnerSync();
                    }}
                    className="w-full py-2 text-center text-[11px] font-semibold text-[var(--color-primary)] hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Together in person? Scan QR code with phone camera &rarr;</span>
                  </button>
                )}
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
                  <div className="p-3 bg-[var(--color-card)] rounded-xl border border-red-300 dark:border-red-800 space-y-2.5">
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
                        className="py-2 px-3 bg-[var(--color-surface)] text-[var(--color-text-main)] rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity"
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
              <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-primary,#91A98B)]/30 space-y-4 shadow-2xs">
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
                <div className="p-3 bg-[var(--color-canvas)] rounded-xl border border-[var(--color-primary,#91A98B)]/20">
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
        <div className="px-5 py-3 border-t border-[var(--color-card-border)] bg-[var(--color-card)] flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            TinyBloom v2.2 · WHO 2006 Standards
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--color-surface)] hover:opacity-85 font-bold text-[var(--color-text-main)] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
