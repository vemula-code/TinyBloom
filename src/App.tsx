/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BabyProfile, ChartType, GrowthEntry, MetricUnit, ThemeMode, PaletteTheme } from './types/growth';
import { DEFAULT_PROFILE, DEFAULT_GROWTH_ENTRIES, DEFAULT_AVATAR } from './data/defaultData';
import { calculateAge } from './data/whoGrowthStandards';
import { GrowthChart } from './components/GrowthChart';
import { PercentileSummaryCards } from './components/PercentileSummaryCards';
import { GrowthStory } from './components/GrowthStory';
import { MeasurementHistory } from './components/MeasurementHistory';
import { NextStepsGuide } from './components/NextStepsGuide';
import { QuickLogModal } from './components/QuickLogModal';
import { PrintDoctorReport } from './components/PrintDoctorReport';
import { SettingsModal } from './components/SettingsModal';
import { ImportPastDataModal } from './components/ImportPastDataModal';
import { TinyBloomLogo } from './components/TinyBloomLogo';
import { BabyAvatar } from './components/BabyAvatar';
import { HeartfeltModal } from './components/HeartfeltModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PrivateGuaranteeModal } from './components/PrivateGuaranteeModal';
import { ScreenshotImportModal } from './components/ScreenshotImportModal';
import { decodeSyncUrl } from './utils/syncPayload';
import {
  Plus,
  Settings,
  Printer,
  Sparkles,
  Scale,
  Ruler,
  CircleDot,
  Heart,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Baby,
  Sun,
  Moon,
  Palette,
  Home as HomeIcon,
  Camera,
  Edit3
} from 'lucide-react';

// Helper: concise developmental stage summary for top header
function getBabyStageStorySummary(ageMonths: number): string {
  if (ageMonths < 1) return 'Newborn Cuddles';
  if (ageMonths < 2) return 'Social Smiles & Tracking';
  if (ageMonths < 4) return 'Chuckles & Head Steady';
  if (ageMonths < 6) return 'Rolling & Grasping';
  if (ageMonths < 9) return 'Sitting & First Tastes';
  if (ageMonths < 12) return 'Crawling & Waving';
  if (ageMonths < 18) return 'First Steps & Stacking';
  if (ageMonths < 24) return 'Running & Talking';
  return 'Stories & Curious Play';
}

export default function App() {
  // Local storage initialization with automatic migration from previous version
  const [profile, setProfile] = useState<BabyProfile>(() => {
    try {
      const isWiped = localStorage.getItem('tinybloom_wiped') === 'true';
      const saved = localStorage.getItem('tinybloom_profile') || localStorage.getItem('naragrowth_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.birthDate) {
          if (parsed.id === 'demo-sample-baby' && (!parsed.avatarUrl || parsed.avatarUrl.includes('baby_portrait'))) {
            parsed.avatarUrl = DEFAULT_AVATAR;
          }
          return parsed;
        }
      }
      if (isWiped) {
        return {
          id: `baby-fresh`,
          name: 'My Baby',
          gender: 'boy',
          birthDate: new Date().toISOString().split('T')[0],
          avatarUrl: DEFAULT_AVATAR,
          notes: 'Private local baby tracker',
        };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [entries, setEntries] = useState<GrowthEntry[]>(() => {
    try {
      const isWiped = localStorage.getItem('tinybloom_wiped') === 'true';
      const saved = localStorage.getItem('tinybloom_entries') || localStorage.getItem('naragrowth_entries');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      if (isWiped) {
        return [];
      }
      return DEFAULT_GROWTH_ENTRIES;
    } catch {
      return [];
    }
  });

  const [unit, setUnit] = useState<MetricUnit>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_unit') || localStorage.getItem('naragrowth_unit');
      return (saved as MetricUnit) || 'metric';
    } catch {
      return 'metric';
    }
  });

  // Navigation tab states: 'home' | 'growth' | 'story' | 'history' | 'nextsteps'
  const [activeTab, setActiveTab] = useState<'home' | 'growth' | 'story' | 'history' | 'nextsteps'>('home');
  const [activeChartType, setActiveChartType] = useState<ChartType>('weight');

  // Appearance & Themes
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('tinybloom_theme_mode') as ThemeMode) || 'light';
    } catch {
      return 'light';
    }
  });

  const [paletteTheme, setPaletteTheme] = useState<PaletteTheme>(() => {
    try {
      return (localStorage.getItem('tinybloom_palette') as PaletteTheme) || 'sage';
    } catch {
      return 'sage';
    }
  });

  // Chart Timeline Range preference ('auto' | 6 | 12 | 18 | 24)
  const [chartTimelineRange, setChartTimelineRange] = useState<'auto' | 6 | 12 | 18 | 24>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_chart_range');
      if (saved === 'auto' || saved === '6' || saved === '12' || saved === '18' || saved === '24') {
        return saved === 'auto' ? 'auto' : (Number(saved) as 6 | 12 | 18 | 24);
      }
      return 'auto';
    } catch {
      return 'auto';
    }
  });

  const handleSetChartTimelineRange = (val: 'auto' | 6 | 12 | 18 | 24) => {
    setChartTimelineRange(val);
    try {
      localStorage.setItem('tinybloom_chart_range', String(val));
    } catch {}
  };

  // Apply theme classes and attributes to root document
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isSystemDark = mediaQuery.matches;
      const isDark =
        themeMode === 'dark' ||
        paletteTheme === 'midnight' ||
        (themeMode === 'system' && isSystemDark);

      if (isDark) {
        root.classList.add('dark');
        document.body.classList.add('dark');
        root.setAttribute('data-theme', 'midnight');
      } else {
        root.classList.remove('dark');
        document.body.classList.remove('dark');
        root.setAttribute('data-theme', paletteTheme);
      }

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#121714' : '#4A6E43');
      }
    };

    applyTheme();

    const handleSystemChange = () => {
      if (themeMode === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    try {
      localStorage.setItem('tinybloom_theme_mode', themeMode);
      localStorage.setItem('tinybloom_palette', paletteTheme);
    } catch (e) {
      console.error(e);
    }

    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode, paletteTheme]);

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GrowthEntry | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHeartModalOpen, setIsHeartModalOpen] = useState(false);
  const [isPrivateGuaranteeOpen, setIsPrivateGuaranteeOpen] = useState(false);
  const [isScreenshotImportOpen, setIsScreenshotImportOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      const hasSaved = localStorage.getItem('tinybloom_profile') || localStorage.getItem('naragrowth_profile');
      const hasCompleted = localStorage.getItem('tinybloom_onboarded');
      // If brand new user with no existing saved profile and no onboarding flag, open wizard!
      return !hasSaved && !hasCompleted;
    } catch {
      return false;
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCompleteOnboarding = (
    newProfile: BabyProfile,
    initialWeightKg?: number,
    initialHeightCm?: number
  ) => {
    setProfile(newProfile);
    if (initialWeightKg || initialHeightCm) {
      const birthEntry: GrowthEntry = {
        id: `entry-${Date.now()}`,
        date: newProfile.birthDate,
        ageMonths: 0,
        weightKg: initialWeightKg,
        heightCm: initialHeightCm,
        notes: `Birth Day! Welcome to the world ${newProfile.name}.`,
        milestones: ['Birth Day'],
        isPediatricianVisit: true,
      };
      setEntries([birthEntry]);
    } else {
      setEntries([]);
    }

    try {
      localStorage.setItem('tinybloom_onboarded', 'true');
    } catch (e) {
      console.error(e);
    }

    setIsOnboardingOpen(false);
    setToastMessage(`🌱 Welcome ${newProfile.name} to TinyBloom!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleChooseSampleData = () => {
    setProfile(DEFAULT_PROFILE);
    setEntries(DEFAULT_GROWTH_ENTRIES);
    try {
      localStorage.setItem('tinybloom_onboarded', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsOnboardingOpen(false);
    setToastMessage('✨ Loaded Baby’s sample records! You can start fresh for your own baby anytime.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Sync to local storage whenever state changes (100% on-device)
  useEffect(() => {
    try {
      localStorage.setItem('tinybloom_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('tinybloom_entries', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem('tinybloom_unit', unit);
    } catch (e) {
      console.error(e);
    }
  }, [unit]);

  // Handle partner URL sync if opened (?sync=...) or clean template (?fresh=true)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('fresh') === 'true') {
      const freshProf: BabyProfile = {
        id: `baby-${Date.now()}`,
        name: 'My Baby',
        gender: 'boy',
        birthDate: new Date().toISOString().split('T')[0],
        notes: 'Track your baby’s milestones, weight, and height curves.',
      };
      setProfile(freshProf);
      setEntries([]);
      setToastMessage('👶 Started a clean tracker for a new baby!');
      window.history.replaceState({}, document.title, window.location.pathname);
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }

    const result = decodeSyncUrl(window.location.search);
    if (result && result.entries.length > 0) {
      setEntries((prev) => {
        const merged = [...prev];
        for (const incoming of result.entries) {
          const idx = merged.findIndex((m) => m.id === incoming.id || m.date === incoming.date);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...incoming };
          } else {
            merged.push(incoming);
          }
        }
        merged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return merged;
      });

      if (result.profile.name) {
        setProfile((prev) => ({
          ...prev,
          ...result.profile,
        }));
      }

      setToastMessage(`✨ Successfully synced with your partner! ${result.entries.length} measurements loaded.`);
      window.history.replaceState({}, document.title, window.location.pathname);
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handlers for entries
  const handleSaveEntry = (newEntry: GrowthEntry) => {
    setEntries((prev) => {
      const index = prev.findIndex((e) => e.id === newEntry.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newEntry;
        return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      const added = [...prev, newEntry];
      return added.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    setEditingEntry(null);
    setToastMessage('Growth record saved to your device!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setToastMessage('Measurement deleted.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEditEntry = (entry: GrowthEntry) => {
    setEditingEntry(entry);
    setIsLogModalOpen(true);
  };

  const handleResetData = () => {
    localStorage.removeItem('tinybloom_wiped');
    setProfile(DEFAULT_PROFILE);
    setEntries(DEFAULT_GROWTH_ENTRIES);
  };

  const handleDeleteAll = () => {
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
    const freshProfile: BabyProfile = {
      id: `baby-${Date.now()}`,
      name: 'My Baby',
      gender: 'boy',
      birthDate: new Date().toISOString().split('T')[0],
      avatarUrl: DEFAULT_AVATAR,
      notes: 'Private baby growth tracker',
    };
    try {
      localStorage.setItem('tinybloom_profile', JSON.stringify(freshProfile));
    } catch (e) {
      console.error(e);
    }
    setProfile(freshProfile);
    setEntries([]);
    setToastMessage('🧹 All baby records wiped from device. Starting fresh!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleImportData = (newProfile: BabyProfile, newEntries: GrowthEntry[]) => {
    setProfile(newProfile);
    setEntries(newEntries);
  };

  const handleSaveProfile = (updatedProfile: BabyProfile) => {
    const isPreviousDemo = !updatedProfile.id || updatedProfile.id === 'demo-sample-baby' || updatedProfile.id === 'baby-main';
    const cleanProfile: BabyProfile = {
      ...updatedProfile,
      id: isPreviousDemo ? `baby-${Date.now()}` : updatedProfile.id,
    };
    setProfile(cleanProfile);
    try {
      localStorage.setItem('tinybloom_profile', JSON.stringify(cleanProfile));
      localStorage.setItem('tinybloom_onboarded', 'true');
      localStorage.removeItem('tinybloom_wiped');
    } catch (e) {
      console.error(e);
    }
    setToastMessage(`✨ Saved details for ${cleanProfile.name}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleImportPastEntries = (
    newEntries: GrowthEntry[],
    mode: 'merge' | 'replace',
    detectedProfile?: Partial<BabyProfile>
  ) => {
    const isCurrentDemo = profile.id === 'demo-sample-baby' || profile.name === 'Sample Baby';

    let finalEntries: GrowthEntry[] = [];
    if (mode === 'replace' || isCurrentDemo) {
      finalEntries = [...newEntries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else {
      const map = new Map<string, GrowthEntry>();
      entries.forEach((e) => map.set(e.date, e));
      newEntries.forEach((e) => map.set(e.date, e));
      finalEntries = Array.from(map.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    setEntries(finalEntries);

    let updatedProfile = { ...profile };
    let profileChanged = false;

    if (isCurrentDemo) {
      updatedProfile.id = `baby-${Date.now()}`;
      if (updatedProfile.name === 'Sample Baby') {
        updatedProfile.name = detectedProfile?.name || 'My Baby';
      }
      profileChanged = true;
    }
    if (detectedProfile?.name && (updatedProfile.name === 'My Baby' || updatedProfile.name === 'Sample Baby')) {
      updatedProfile.name = detectedProfile.name;
      profileChanged = true;
    }
    if (detectedProfile?.birthDate && isCurrentDemo) {
      updatedProfile.birthDate = detectedProfile.birthDate;
      profileChanged = true;
    }

    if (profileChanged) {
      setProfile(updatedProfile);
      try {
        localStorage.setItem('tinybloom_profile', JSON.stringify(updatedProfile));
      } catch (e) {
        console.error(e);
      }
    }

    try {
      localStorage.setItem('tinybloom_entries', JSON.stringify(finalEntries));
      localStorage.setItem('tinybloom_onboarded', 'true');
      localStorage.removeItem('tinybloom_wiped');
    } catch (e) {
      console.error(e);
    }

    setToastMessage(`✨ Successfully imported ${newEntries.length} records!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentAge = calculateAge(profile.birthDate);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--color-canvas,#FFF9F0)] text-[var(--color-text-main,#303832)] font-sans pb-28 sm:pb-24 transition-colors duration-250">
      {/* ========================================================
          STICKY TOP HEADER (Clean on Mobile, Full on Desktop)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-[var(--color-card)]/95 backdrop-blur-md border-b border-[var(--color-card-border)] text-[var(--color-text-main)] w-full max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-15 flex items-center justify-between gap-2">
          {/* Brand Identity + Heart "Our Story" right beside app name */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="flex items-center text-left transition-opacity hover:opacity-90 shrink-0"
            >
              <TinyBloomLogo size={34} showText={true} />
            </button>

            {/* Our Story Button: Simple heart symbol on mobile, expandable on sm+ */}
            <button
              type="button"
              onClick={() => setIsHeartModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/50 text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shadow-2xs cursor-pointer shrink-0"
              title="Our Story: Why we built TinyBloom (From first-time parents)"
              aria-label="Our Story"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
              <span className="hidden sm:inline">Our Story</span>
            </button>
          </div>

          {/* Right Header: Baby Details / Settings */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Profile & Settings */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--color-primary,#91A98B)]/10 hover:bg-[var(--color-primary,#91A98B)]/20 border border-[var(--color-primary,#91A98B)]/25 text-xs font-semibold text-[var(--color-text-main,#303832)] active:scale-95 transition-all cursor-pointer shrink-0"
              title="Manage baby profile, themes, export, and settings"
            >
              <Baby className="w-3.5 h-3.5 text-[var(--color-primary,#91A98B)] shrink-0" />
              <span className="font-bold truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[160px]">{profile.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-[#5D7C57] text-white px-4 py-2.5 text-center text-xs font-semibold shadow-xs flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#FFF9F0] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">
        {/* Sample Demo Mode Banner - Only shown when exploring initial demo records */}
        {(profile.id === 'demo-sample-baby' && profile.name === 'Sample Baby') && (
          <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 rounded-2xl px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5 text-xs shadow-2xs">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="text-sm shrink-0 select-none">🌱</span>
              <p className="text-xs text-[var(--color-text-main)] truncate">
                Exploring <strong>sample demo records</strong>. Ready to track your baby?
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-[var(--color-primary)] hover:opacity-90 shadow-2xs transition-all shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Baby className="w-3.5 h-3.5" />
              <span>Set Up Baby</span>
            </button>
          </div>
        )}

        {/* ========================================================
            TAB 1: HOME SCREEN
           ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Baby Profile Hero Card - Mobile-Optimized Native Layout */}
            <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-card-border)] p-3.5 sm:p-5 shadow-2xs relative overflow-hidden transition-colors space-y-3.5">
              
              {/* Avatar + Name & Age + Unit Switcher & Log Growth Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <BabyAvatar
                      avatarUrl={profile.avatarUrl || DEFAULT_AVATAR}
                      name={profile.name}
                      gender={profile.gender}
                      size="md"
                      onClick={() => setIsSettingsOpen(true)}
                      showEditBadge={true}
                    />
                  </div>

                  <div className="min-w-0">
                    {/* Name + Gender Pill + Edit Setup icon */}
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-base sm:text-xl font-bold font-heading tracking-tight text-[var(--color-text-main)] truncate">
                        {profile.name}
                      </h1>
                      <span className="text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] shrink-0">
                        {profile.gender}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Edit baby profile & setup"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Neatly Aligned Age & Birthdate */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs mt-0.5">
                      <span className="font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-lg text-[11px]">
                        {currentAge.displayStr} old
                      </span>
                      <span className="text-[var(--color-text-muted)] text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--color-primary)] shrink-0" />
                        <span>Born {(() => {
                          try {
                            const [y, m, d] = (profile.birthDate || '').split('-').map(Number);
                            if (y && m && d) {
                              return new Date(y, m - 1, d).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              });
                            }
                            return profile.birthDate;
                          } catch {
                            return profile.birthDate;
                          }
                        })()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right / Bottom on mobile: Unit Switcher beside Log Growth Button */}
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--color-card-border)]/40 shrink-0">
                  {/* Unit Switcher */}
                  <div className="flex items-center bg-[var(--color-canvas)] border border-[var(--color-card-border)] p-0.5 rounded-xl text-[11px] font-medium shrink-0">
                    <button
                      type="button"
                      onClick={() => setUnit('metric')}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        unit === 'metric'
                          ? 'bg-[var(--color-primary)] text-white shadow-2xs font-bold'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                      }`}
                    >
                      kg/cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('imperial')}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        unit === 'imperial'
                          ? 'bg-[var(--color-primary)] text-white shadow-2xs font-bold'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                      }`}
                    >
                      lb/in
                    </button>
                  </div>

                  {/* Log Growth Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntry(null);
                      setIsLogModalOpen(true);
                    }}
                    className="px-3 sm:px-3.5 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
                    title="Log new measurement"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Log Growth</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Minimized All-in-1 Baby Stage, Privacy & WHO Standards Strip */}
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-card-border)] p-2.5 sm:p-3 shadow-2xs text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                {/* Developmental Stage */}
                <button
                  type="button"
                  onClick={() => setActiveTab('story')}
                  className="flex items-center gap-1.5 text-left min-w-0 hover:opacity-85 transition-opacity cursor-pointer group"
                  title="View developmental milestones"
                >
                  <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                    <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 shrink-0 hidden sm:inline">
                    Stage:
                  </span>
                  <span className="font-bold text-[var(--color-text-main)] truncate text-[11px] sm:text-xs">
                    {getBabyStageStorySummary(currentAge.exactMonths)}
                  </span>
                  <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold shrink-0 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Milestones</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </button>

                {/* 100% Private Badge */}
                <button
                  type="button"
                  onClick={() => setIsPrivateGuaranteeOpen(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-[10px] sm:text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                  title="100% Local & On-Device (Tap to verify)"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Private</span>
                </button>
              </div>

              {/* WHO Standards Reassurance micro-line - completely visible without truncation */}
              <div className="flex items-start sm:items-center gap-1.5 pt-1.5 border-t border-[var(--color-card-border)]/60 text-[11px] leading-snug text-[var(--color-text-muted)]">
                <span className="shrink-0 text-xs select-none mt-0.5 sm:mt-0">🌱</span>
                <p className="flex-1 min-w-0">
                  <span className="font-bold text-[var(--color-text-main)] mr-1">WHO Standards:</span>
                  <span>Both 15th% &amp; 85th% are equally healthy. Zero comparison.</span>
                </p>
              </div>
            </div>

            {/* 1. Side-by-Side Metric Selector Cards (Weight, Length, Head) */}
            <PercentileSummaryCards
              entries={entries}
              profile={profile}
              unit={unit}
              selectedMetric={activeChartType}
              onSelectMetric={setActiveChartType}
            />

            {/* 2. Interactive WHO Growth Chart directly below the selected metric */}
            <GrowthChart
              entries={entries}
              chartType={activeChartType}
              gender={profile.gender}
              unit={unit}
              babyName={profile.name}
              babyAgeMonths={currentAge.exactMonths}
              timelineRange={chartTimelineRange}
              onOpenAddModal={() => {
                setEditingEntry(null);
                setIsLogModalOpen(true);
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* 3. Reassuring Progress & Growth Journey (Zero-Anxiety Parenting) */}
            <div className="bg-white dark:bg-[#1A221D] rounded-3xl p-5 sm:p-6 border border-[var(--color-card-border,#E2E9E0)] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-card-border,#E2E9E0)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-heading text-[var(--color-text-main)]">
                      How {profile.name} is Progressing ({activeChartType === 'weight' ? 'Weight' : activeChartType === 'height' ? 'Length / Height' : 'Head Size'})
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Gentle developmental trajectory and clinical perspective
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('story')}
                  className="text-xs font-bold text-[var(--color-primary)] hover:underline self-start sm:self-auto flex items-center gap-1"
                >
                  <span>Detailed Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Crucial Gentle Reassurance Banner - Don't Worry Message */}
              <div className="p-4 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-card-border,#E2E9E0)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                  <span>A Reminder for Parents: Growth is a Journey, Not a Race</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Every single baby is beautifully unique and grows at their own pace. A percentile is simply a statistical reference curve across thousands of infants—it is <strong>never a grade, a score, or a contest</strong>. Whether {profile.name} tracks along the 15th percentile or the 85th percentile, what pediatricians look for is steady, healthy progression along their own unique trajectory.
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] italic">
                  Normal daily or weekly fluctuations happen with growth spurts, active crawling, teething, or illness. Trust your instincts, cherish the small moments, and speak with your pediatrician if you ever want individualized medical guidance.
                </p>
              </div>
            </div>

            {/* 4. Current Milestone Stage & What's Next */}
            <div className="bg-white dark:bg-[#1A221D] rounded-3xl p-5 sm:p-6 border border-[var(--color-card-border,#E2E9E0)] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-card-border,#E2E9E0)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-heading text-[var(--color-text-main)]">
                      Current Milestone Stage · {currentAge.displayStr} Old
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Play activities, natural developmental windows, and checkup tips
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-[var(--color-card-border,#E2E9E0)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-canvas)] transition-colors"
                  >
                    Doctor Brief
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('nextsteps')}
                    className="flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
                  >
                    <span>Universal Guide (0–36m)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
                <div className="p-3.5 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-card-border,#E2E9E0)] space-y-1.5">
                  <span className="font-bold text-[var(--color-text-main)] block">
                    ✨ Things to Observe at this Stage
                  </span>
                  <p>
                    Watch for rolling, supported sitting, babbling chains of syllables, transferring toys hand-to-hand, and tracking loved ones with joyful smiles.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-card-border,#E2E9E0)] space-y-1.5">
                  <span className="font-bold text-[var(--color-text-main)] block">
                    🧸 Bonding Play to Try Today
                  </span>
                  <p>
                    Floor tummy time with mirrors, gentle peek-a-boo, exploring textured crinkle books, and conversational singing during daily diaper changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: WHO INTERACTIVE GROWTH CHARTS
           ======================================================== */}
        {activeTab === 'growth' && (
          <div className="space-y-4">
            {/* Chart Submenu Bar */}
            <div className="bg-white dark:bg-[#1A221D] rounded-3xl p-4 border border-[var(--color-card-border,#E2E9E0)] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-[var(--color-text-main)]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveChartType('weight')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeChartType === 'weight'
                      ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                      : 'bg-[var(--color-canvas)] text-[var(--color-text-main)] border border-[var(--color-card-border,#E2E9E0)] hover:bg-[var(--color-primary)]/10'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Weight-for-Age</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartType('height')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeChartType === 'height'
                      ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                      : 'bg-[var(--color-canvas)] text-[var(--color-text-main)] border border-[var(--color-card-border,#E2E9E0)] hover:bg-[var(--color-primary)]/10'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Length-for-Age</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartType('head')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeChartType === 'head'
                      ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                      : 'bg-[var(--color-canvas)] text-[var(--color-text-main)] border border-[var(--color-card-border,#E2E9E0)] hover:bg-[var(--color-primary)]/10'
                  }`}
                >
                  <CircleDot className="w-3.5 h-3.5" />
                  <span>Head Circumference</span>
                </button>
              </div>

              <span className="text-xs text-[var(--color-text-muted)]">
                Official WHO Standards (0–24 Months)
              </span>
            </div>

            <GrowthChart
              entries={entries}
              chartType={activeChartType}
              gender={profile.gender}
              unit={unit}
              babyName={profile.name}
              babyAgeMonths={currentAge.exactMonths}
            />
          </div>
        )}

        {/* ========================================================
            TAB 3: GROWTH STORY
           ======================================================== */}
        {activeTab === 'story' && (
          <GrowthStory
            profile={profile}
            entries={entries}
            unit={unit}
            onOpenAddModal={() => {
              setEditingEntry(null);
              setIsLogModalOpen(true);
            }}
          />
        )}

        {/* ========================================================
            TAB 4: MEASUREMENT HISTORY
           ======================================================== */}
        {activeTab === 'history' && (
          <MeasurementHistory
            profile={profile}
            entries={entries}
            unit={unit}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onOpenAddModal={() => {
              setEditingEntry(null);
              setIsLogModalOpen(true);
            }}
          />
        )}

        {/* ========================================================
            TAB 5: PERSONALIZED NEXT STEPS
           ======================================================== */}
        {activeTab === 'nextsteps' && <NextStepsGuide profile={profile} />}

        {/* ========================================================
            TINYBLOOM FOOTER WITH PHILOSOPHY & PRIVACY LINK
           ======================================================== */}
        <footer className="mt-12 pt-8 pb-10 border-t border-[var(--color-primary,#91A98B)]/20 text-center text-xs text-[var(--color-text-muted,#6E7B6C)] space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <TinyBloomLogo size={24} />
            <span className="text-[var(--color-primary,#91A98B)] font-bold">·</span>
            <span className="font-semibold italic text-[var(--color-text-main,#303832)]">
              Every little milestone matters.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1">
            <button
              type="button"
              onClick={() => setIsHeartModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-primary,#91A98B)]/15 hover:bg-[var(--color-primary,#91A98B)]/25 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-bold transition-all shadow-2xs"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>TinyBloom Philosophy & Local Privacy</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[var(--color-text-main,#303832)] font-medium transition-colors"
            >
              Settings & Backups
            </button>

            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>

            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="hover:text-[var(--color-text-main,#303832)] font-medium transition-colors"
            >
              Pediatrician Report
            </button>
          </div>

          <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] max-w-md mx-auto leading-relaxed pt-1">
            100% offline-first · Zero cloud trackers · Free forever for your family.
          </p>
        </footer>
      </main>

      {/* ========================================================
          BOTTOM NAVIGATION BAR (2 on left, + in center, 2 on right)
         ======================================================== */}
      <nav
        aria-label="Navigation"
        className="fixed bottom-0 sm:bottom-4 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md sm:rounded-2xl z-40 bg-[var(--color-card)]/95 backdrop-blur-md border-t sm:border border-[var(--color-card-border)] px-3 sm:px-4 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:py-2 flex items-center justify-around shadow-lg sm:shadow-2xl"
      >
        {/* Left 1: Home */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#86B880)] font-bold'
              : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
          }`}
        >
          <HomeIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Left 2: WHO Charts */}
        <button
          type="button"
          onClick={() => setActiveTab('growth')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'growth'
              ? 'text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#86B880)] font-bold'
              : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">WHO</span>
        </button>

        {/* Center: Elevated + Log Action */}
        <button
          type="button"
          onClick={() => {
            setEditingEntry(null);
            setIsLogModalOpen(true);
          }}
          className="-mt-5 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary,#91A98B)] hover:opacity-95 text-white shadow-md active:scale-95 transition-transform cursor-pointer"
          aria-label="Log Measurement"
          title="Log Measurement"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Right 1: Milestones & Development */}
        <button
          type="button"
          onClick={() => setActiveTab('story')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'story' || activeTab === 'nextsteps'
              ? 'text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#86B880)] font-bold'
              : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Milestones</span>
        </button>

        {/* Right 2: Settings & Tools (Measurement History, Themes, App Download, PDF Report) */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            isSettingsOpen
              ? 'text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#86B880)] font-bold'
              : 'text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)]'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Settings</span>
        </button>
      </nav>

      {/* Modals & Sheets */}
      <QuickLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
        birthDate={profile.birthDate}
        gender={profile.gender}
        defaultUnit={unit}
        onOpenScreenshotImport={() => setIsScreenshotImportOpen(true)}
      />

      <PrivateGuaranteeModal
        isOpen={isPrivateGuaranteeOpen}
        onClose={() => setIsPrivateGuaranteeOpen(false)}
        entries={entries}
        profile={profile}
      />

      <ScreenshotImportModal
        isOpen={isScreenshotImportOpen}
        onClose={() => setIsScreenshotImportOpen(false)}
        birthDate={profile.birthDate}
        profile={profile}
        existingEntries={entries}
        defaultUnit={unit}
        onImport={handleImportPastEntries}
      />

      {isReportOpen && (
        <PrintDoctorReport
          profile={profile}
          entries={entries}
          unit={unit}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        entries={entries}
        onImportData={handleImportData}
        onResetData={handleResetData}
        onDeleteAll={handleDeleteAll}
        onOpenImportPastData={() => setIsImportModalOpen(true)}
        unit={unit}
        onToggleUnit={setUnit}
        themeMode={themeMode}
        onToggleThemeMode={setThemeMode}
        paletteTheme={paletteTheme}
        onChangePaletteTheme={setPaletteTheme}
        onOpenHeartfeltModal={() => setIsHeartModalOpen(true)}
        onOpenOnboardingModal={() => setIsOnboardingOpen(true)}
        onNavigateToHistory={() => setActiveTab('history')}
        onEditEntry={handleEditEntry}
        onDeleteEntry={handleDeleteEntry}
        onOpenAddModal={() => setIsLogModalOpen(true)}
        chartTimelineRange={chartTimelineRange}
        onChangeChartTimelineRange={handleSetChartTimelineRange}
        onOpenScreenshotImport={() => setIsScreenshotImportOpen(true)}
      />

      <HeartfeltModal
        isOpen={isHeartModalOpen}
        onClose={() => setIsHeartModalOpen(false)}
        babyName={profile.name}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteSetup={handleCompleteOnboarding}
        onChooseSampleData={handleChooseSampleData}
      />

      <ImportPastDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        birthDate={profile.birthDate}
        unit={unit}
        onImport={handleImportPastEntries}
      />

      <PrivateGuaranteeModal
        isOpen={isPrivateGuaranteeOpen}
        onClose={() => setIsPrivateGuaranteeOpen(false)}
        entries={entries}
        profile={profile}
      />

      <ScreenshotImportModal
        isOpen={isScreenshotImportOpen}
        onClose={() => setIsScreenshotImportOpen(false)}
        birthDate={profile.birthDate}
        profile={profile}
        existingEntries={entries}
        defaultUnit={unit}
        onImport={(newEntries, mode, detectedProf) =>
          handleImportPastEntries(newEntries, mode, detectedProf)
        }
      />
    </div>
  );
}
