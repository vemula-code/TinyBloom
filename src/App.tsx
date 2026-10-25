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
import { PWAInstallButton } from './components/PWAInstallButton';
import { ImportPastDataModal } from './components/ImportPastDataModal';
import { TinyBloomLogo } from './components/TinyBloomLogo';
import { BabyAvatar } from './components/BabyAvatar';
import { HeartfeltModal } from './components/HeartfeltModal';
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
  Palette
} from 'lucide-react';

export default function App() {
  // Local storage initialization with automatic migration from previous version
  const [profile, setProfile] = useState<BabyProfile>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_profile') || localStorage.getItem('naragrowth_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.birthDate) {
          return parsed;
        }
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [entries, setEntries] = useState<GrowthEntry[]>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_entries') || localStorage.getItem('naragrowth_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_GROWTH_ENTRIES;
    } catch {
      return DEFAULT_GROWTH_ENTRIES;
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

  // Apply theme classes and attributes to root document
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    root.setAttribute('data-palette', paletteTheme);

    try {
      localStorage.setItem('tinybloom_theme_mode', themeMode);
      localStorage.setItem('tinybloom_palette', paletteTheme);
    } catch (e) {
      console.error(e);
    }
  }, [themeMode, paletteTheme]);

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GrowthEntry | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHeartModalOpen, setIsHeartModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    setProfile(DEFAULT_PROFILE);
    setEntries(DEFAULT_GROWTH_ENTRIES);
  };

  const handleImportData = (newProfile: BabyProfile, newEntries: GrowthEntry[]) => {
    setProfile(newProfile);
    setEntries(newEntries);
  };

  const handleImportPastEntries = (newEntries: GrowthEntry[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setEntries(newEntries);
    } else {
      setEntries((prev) => {
        const map = new Map<string, GrowthEntry>();
        prev.forEach((e) => map.set(e.date, e));
        newEntries.forEach((e) => map.set(e.date, e));
        return Array.from(map.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      });
    }
    setToastMessage(`Imported ${newEntries.length} entries successfully!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentAge = calculateAge(profile.birthDate);

  return (
    <div className="min-h-screen bg-[var(--color-canvas,#FFF9F0)] text-[var(--color-text-main,#303832)] font-sans pb-20 transition-colors duration-250">
      {/* ========================================================
          STICKY TOP HEADER
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1D241F]/90 backdrop-blur-md border-b border-[var(--color-primary,#91A98B)]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity with Sprout Motif */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center text-left transition-opacity hover:opacity-90"
          >
            <TinyBloomLogo size={38} showText={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--color-text-muted,#6E7B6C)]">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`hover:text-[var(--color-text-main,#303832)] transition-colors ${
                activeTab === 'home'
                  ? 'text-[var(--color-text-main,#303832)] font-bold underline underline-offset-8 decoration-[var(--color-primary,#91A98B)] decoration-2'
                  : ''
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('growth')}
              className={`hover:text-[var(--color-text-main,#303832)] transition-colors ${
                activeTab === 'growth'
                  ? 'text-[var(--color-text-main,#303832)] font-bold underline underline-offset-8 decoration-[var(--color-primary,#91A98B)] decoration-2'
                  : ''
              }`}
            >
              WHO Charts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`hover:text-[var(--color-text-main,#303832)] transition-colors ${
                activeTab === 'story'
                  ? 'text-[var(--color-text-main,#303832)] font-bold underline underline-offset-8 decoration-[var(--color-primary,#91A98B)] decoration-2'
                  : ''
              }`}
            >
              Growth Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`hover:text-[var(--color-text-main,#303832)] transition-colors ${
                activeTab === 'history'
                  ? 'text-[var(--color-text-main,#303832)] font-bold underline underline-offset-8 decoration-[var(--color-primary,#91A98B)] decoration-2'
                  : ''
              }`}
            >
              History ({entries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nextsteps')}
              className={`hover:text-[var(--color-text-main,#303832)] transition-colors ${
                activeTab === 'nextsteps'
                  ? 'text-[var(--color-text-main,#303832)] font-bold underline underline-offset-8 decoration-[var(--color-primary,#91A98B)] decoration-2'
                  : ''
              }`}
            >
              Next Steps
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Day / Night Mode Toggle */}
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              title={themeMode === 'light' ? 'Switch to Night Mode (2 AM Feedings)' : 'Switch to Daylight Mode'}
              className="p-2 text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)] hover:bg-[var(--color-primary,#91A98B)]/10 rounded-xl transition-colors border border-[var(--color-primary,#91A98B)]/30"
            >
              {themeMode === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* A Letter to Parents / Our Story */}
            <button
              type="button"
              onClick={() => setIsHeartModalOpen(true)}
              title="A Letter to Parents · Why TinyBloom Exists"
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/40"
            >
              <Heart className="w-4 h-4 fill-rose-500" />
            </button>

            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              title="Doctor Visit Brief"
              className="p-2 text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)] hover:bg-[var(--color-primary,#91A98B)]/10 rounded-xl transition-colors border border-[var(--color-primary,#91A98B)]/30"
            >
              <Printer className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings & Themes"
              className="p-2 text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)] hover:bg-[var(--color-primary,#91A98B)]/10 rounded-xl transition-colors border border-[var(--color-primary,#91A98B)]/30"
            >
              <Settings className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
            </button>

            <PWAInstallButton />

            <button
              type="button"
              onClick={() => {
                setEditingEntry(null);
                setIsLogModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-white bg-[var(--color-primary,#91A98B)] hover:opacity-90 rounded-xl transition-all shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Growth</span>
              <span className="sm:hidden">Log</span>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Mobile Navigation Pills */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#91A98B]/20">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'home'
                ? 'bg-[#91A98B] text-white shadow-2xs'
                : 'text-[#6E7B6C] hover:bg-[#91A98B]/10'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('growth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'growth'
                ? 'bg-[#91A98B] text-white shadow-2xs'
                : 'text-[#6E7B6C] hover:bg-[#91A98B]/10'
            }`}
          >
            WHO Charts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'story'
                ? 'bg-[#91A98B] text-white shadow-2xs'
                : 'text-[#6E7B6C] hover:bg-[#91A98B]/10'
            }`}
          >
            Growth Story
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-[#91A98B] text-white shadow-2xs'
                : 'text-[#6E7B6C] hover:bg-[#91A98B]/10'
            }`}
          >
            History ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nextsteps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'nextsteps'
                ? 'bg-[#91A98B] text-white shadow-2xs'
                : 'text-[#6E7B6C] hover:bg-[#91A98B]/10'
            }`}
          >
            Next Steps
          </button>
        </div>

        {/* ========================================================
            TAB 1: HOME SCREEN
           ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Baby Profile Hero Banner */}
            <div className="bg-white dark:bg-[#1D241F] rounded-3xl border border-[var(--color-primary,#91A98B)]/30 p-5 sm:p-6 shadow-2xs relative overflow-hidden transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-4">
                  <BabyAvatar
                    avatarUrl={profile.avatarUrl || DEFAULT_AVATAR}
                    name={profile.name}
                    gender={profile.gender}
                    size="lg"
                    onClick={() => setIsSettingsOpen(true)}
                    showEditBadge={true}
                  />

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-[var(--color-text-main,#303832)]">
                        {profile.name}
                      </h1>
                      <span className="text-xs text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-semibold capitalize bg-[var(--color-primary,#91A98B)]/15 px-2 py-0.5 rounded-full">
                        {profile.gender}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted,#6E7B6C)]">
                      <span className="font-bold text-[var(--color-text-main,#303832)]">{currentAge.displayStr} old</span>
                      <span aria-hidden="true">·</span>
                      <span>Born {profile.birthDate}</span>
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(true)}
                        className="text-[11px] font-semibold text-[var(--color-primary,#91A98B)] underline decoration-[var(--color-primary,#91A98B)]/60 hover:opacity-80 transition-colors ml-0.5"
                      >
                        Edit
                      </button>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{entries.length} measurements</span>
                    </div>

                    <p className="mt-1 text-xs text-[var(--color-text-muted,#6E7B6C)] line-clamp-1 italic max-w-md">
                      {profile.notes || 'Every little milestone matters.'}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] bg-[var(--color-primary,#91A98B)]/15 border border-[var(--color-primary,#91A98B)]/30 px-2.5 py-1 rounded-xl w-fit">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary,#91A98B)] shrink-0" />
                        <span>100% On-Device · Zero Cloud Tracking</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsHeartModalOpen(true)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 px-2.5 py-1 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3 h-3 fill-rose-500" />
                        <span>Our Heartfelt Story</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Unit Switcher & Quick Actions */}
                <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#91A98B]/15">
                  <div className="flex items-center gap-1 bg-[#FFF9F0] border border-[#91A98B]/20 p-1 rounded-xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setUnit('metric')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        unit === 'metric'
                          ? 'bg-[#91A98B] text-white shadow-2xs font-bold'
                          : 'text-[#303832] hover:text-[#5D7C57]'
                      }`}
                    >
                      kg / cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('imperial')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        unit === 'imperial'
                          ? 'bg-[#91A98B] text-white shadow-2xs font-bold'
                          : 'text-[#303832] hover:text-[#5D7C57]'
                      }`}
                    >
                      lb·oz / in
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntry(null);
                      setIsLogModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#91A98B] hover:bg-[#7D9977] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Growth</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Metrics Overview (Top Stat Cards) */}
            <PercentileSummaryCards entries={entries} profile={profile} unit={unit} />

            {/* Growth Story Teaser & Action Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Growth Story Quick View */}
              <div className="bg-white rounded-3xl p-6 border border-[#91A98B]/30 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#5D7C57] font-semibold text-xs tracking-wider uppercase mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Growth Trajectory Story</span>
                  </div>
                  <h3 className="text-base font-bold font-heading text-[#303832]">
                    How is {profile.name} progressing?
                  </h3>
                  <p className="text-xs text-[#6E7B6C] mt-1.5 leading-relaxed">
                    View in-depth growth velocity, rate of change between checkups, and educational insights grounded in the official WHO Child Growth Standards.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#91A98B]/15 flex items-center justify-between">
                  <span className="text-xs text-[#6E7B6C] font-mono">
                    {entries.length} data points tracked
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('story')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#5D7C57] hover:text-[#3D5939] transition-colors"
                  >
                    <span>Read Growth Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Upcoming Pediatric Checkup & Next Steps */}
              <div className="bg-white rounded-3xl p-6 border border-[#91A98B]/30 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#9C5D47] font-semibold text-xs tracking-wider uppercase mb-1">
                    <Calendar className="w-4 h-4 text-[#F3C9B8]" />
                    <span>Next Milestone Stage</span>
                  </div>
                  <h3 className="text-base font-bold font-heading text-[#303832]">
                    Age-Appropriate Play & Checkup Prep
                  </h3>
                  <p className="text-xs text-[#6E7B6C] mt-1.5 leading-relaxed">
                    Bonding play activities, upcoming pediatrician exam discussion topics, and checklist items tailored for {currentAge.displayStr} old.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#91A98B]/15 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="text-xs text-[#6E7B6C] hover:text-[#303832] font-semibold"
                  >
                    Generate Doctor Brief
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('nextsteps')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#5D7C57] hover:text-[#3D5939] transition-colors"
                  >
                    <span>Explore Next Steps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Chart Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-heading text-[#303832]">
                  WHO Growth Curve (Quick Look)
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('growth')}
                  className="text-xs font-bold text-[#5D7C57] hover:underline"
                >
                  Open Full Interactive Charts &rarr;
                </button>
              </div>

              <GrowthChart
                entries={entries}
                chartType="weight"
                gender={profile.gender}
                unit={unit}
                babyName={profile.name}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: WHO INTERACTIVE GROWTH CHARTS
           ======================================================== */}
        {activeTab === 'growth' && (
          <div className="space-y-4">
            {/* Chart Submenu Bar */}
            <div className="bg-white rounded-3xl p-4 border border-[#91A98B]/30 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveChartType('weight')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeChartType === 'weight'
                      ? 'bg-[#91A98B] text-white shadow-2xs'
                      : 'bg-[#FFF9F0] text-[#303832] border border-[#91A98B]/30 hover:bg-[#91A98B]/10'
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
                      ? 'bg-[#91A98B] text-white shadow-2xs'
                      : 'bg-[#FFF9F0] text-[#303832] border border-[#91A98B]/30 hover:bg-[#91A98B]/10'
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
                      ? 'bg-[#91A98B] text-white shadow-2xs'
                      : 'bg-[#FFF9F0] text-[#303832] border border-[#91A98B]/30 hover:bg-[#91A98B]/10'
                  }`}
                >
                  <CircleDot className="w-3.5 h-3.5" />
                  <span>Head Circumference</span>
                </button>
              </div>

              <span className="text-xs text-[#6E7B6C]">
                Official WHO Standards (0–24 Months)
              </span>
            </div>

            <GrowthChart
              entries={entries}
              chartType={activeChartType}
              gender={profile.gender}
              unit={unit}
              babyName={profile.name}
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

      {/* Floating Bottom Quick Action on Mobile */}
      <div className="sm:hidden fixed bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-3 bg-white border border-[#91A98B]/40 text-[#303832] text-xs font-bold rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Printer className="w-4 h-4 text-[#5D7C57]" />
          <span>Report</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setEditingEntry(null);
            setIsLogModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-[#91A98B] text-white text-xs font-bold rounded-full shadow-lg shadow-[#91A98B]/30 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Log Growth</span>
        </button>
      </div>

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
        onSaveProfile={setProfile}
        entries={entries}
        onImportData={handleImportData}
        onResetData={handleResetData}
        onOpenImportPastData={() => setIsImportModalOpen(true)}
        unit={unit}
        onToggleUnit={setUnit}
        themeMode={themeMode}
        onToggleThemeMode={setThemeMode}
        paletteTheme={paletteTheme}
        onChangePaletteTheme={setPaletteTheme}
        onOpenHeartfeltModal={() => setIsHeartModalOpen(true)}
      />

      <HeartfeltModal
        isOpen={isHeartModalOpen}
        onClose={() => setIsHeartModalOpen(false)}
        babyName={profile.name}
      />

      <ImportPastDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        birthDate={profile.birthDate}
        unit={unit}
        onImport={handleImportPastEntries}
      />
    </div>
  );
}
