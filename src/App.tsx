/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BabyProfile, ChartType, GrowthEntry, MetricUnit } from './types/growth';
import { DEFAULT_PROFILE, DEFAULT_GROWTH_ENTRIES, DEFAULT_AVATAR } from './data/defaultData';
import { calculateAge } from './data/whoGrowthStandards';
import { GrowthChart } from './components/GrowthChart';
import { PercentileSummaryCards } from './components/PercentileSummaryCards';
import { GrowthTimeline } from './components/GrowthTimeline';
import { MilestoneGuide } from './components/MilestoneGuide';
import { QuickLogModal } from './components/QuickLogModal';
import { PrintDoctorReport } from './components/PrintDoctorReport';
import { SettingsModal } from './components/SettingsModal';
import { Plus, Settings, Printer, Sparkles, Scale, Ruler, CircleDot, Heart } from 'lucide-react';

export default function App() {
  // Local storage initialization
  const [profile, setProfile] = useState<BabyProfile>(() => {
    try {
      const saved = localStorage.getItem('naragrowth_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [entries, setEntries] = useState<GrowthEntry[]>(() => {
    try {
      const saved = localStorage.getItem('naragrowth_entries');
      return saved ? JSON.parse(saved) : DEFAULT_GROWTH_ENTRIES;
    } catch {
      return DEFAULT_GROWTH_ENTRIES;
    }
  });

  const [unit, setUnit] = useState<MetricUnit>(() => {
    try {
      const saved = localStorage.getItem('naragrowth_unit');
      return (saved as MetricUnit) || 'metric';
    } catch {
      return 'metric';
    }
  });

  // UI View States
  const [activeTab, setActiveTab] = useState<'charts' | 'timeline' | 'guide'>('charts');
  const [activeChartType, setActiveChartType] = useState<ChartType>('weight');

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GrowthEntry | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('naragrowth_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('naragrowth_entries', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem('naragrowth_unit', unit);
    } catch (e) {
      console.error(e);
    }
  }, [unit]);

  // Handlers for entries
  const handleSaveEntry = (newEntry: GrowthEntry) => {
    setEntries((prev) => {
      const index = prev.findIndex((e) => e.id === newEntry.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Delete this measurement log?')) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
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

  // Baby current age calculation
  const currentAge = calculateAge(profile.birthDate);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-orange-100 selection:text-orange-900 pb-16">
      {/* ========================================================
          TOP BAR CONTRACT (3-Zone strict layout)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">
              N
            </span>
            <span>NaraGrowth</span>
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
            <button
              type="button"
              onClick={() => setActiveTab('charts')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'charts' ? 'text-stone-950 font-bold underline underline-offset-8 decoration-orange-500 decoration-2' : ''
              }`}
            >
              Growth Curves
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'timeline' ? 'text-stone-950 font-bold underline underline-offset-8 decoration-orange-500 decoration-2' : ''
              }`}
            >
              Monthly Journal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'guide' ? 'text-stone-950 font-bold underline underline-offset-8 decoration-orange-500 decoration-2' : ''
              }`}
            >
              7-Month Guide
            </button>
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Doctor Report
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditingEntry(null);
                setIsLogModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Growth</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Baby Profile Hero Banner */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={profile.avatarUrl || DEFAULT_AVATAR}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-stone-200/80 shadow-xs"
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                    {profile.name}
                  </h1>
                  <span className="text-xs text-stone-500 font-medium capitalize">
                    · {profile.gender}
                  </span>
                </div>

                {/* Clean unboxed metadata with typographic separators */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-stone-800">{currentAge.displayStr} old</span>
                  <span aria-hidden="true">·</span>
                  <span>Born {profile.birthDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{entries.length} measurements</span>
                </div>

                <p className="mt-1 text-xs text-stone-600 line-clamp-1 italic max-w-md">
                  {profile.notes || 'Growing beautifully on the WHO national growth curve.'}
                </p>
              </div>
            </div>

            {/* Right: Quick Unit Switcher & Settings */}
            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setUnit('metric')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    unit === 'metric'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  kg / cm
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('imperial')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    unit === 'imperial'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  lb·oz / in
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                title="Print Pediatrician Report"
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                title="Baby Profile & Data Backup"
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Current Metrics Overview (Top Stat Cards) */}
        <PercentileSummaryCards entries={entries} profile={profile} unit={unit} />

        {/* View Navigation Tabs (for mobile and desktop switching) */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('charts')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'charts'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            WHO National Growth Curves
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'timeline'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Monthly Timeline & Milestones ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>7-Month Pediatric Guide</span>
          </button>
        </div>

        {/* Tab 1: Interactive Growth Charts */}
        {activeTab === 'charts' && (
          <div className="space-y-4">
            {/* Chart Type Selector Sub-bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveChartType('weight')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeChartType === 'weight'
                    ? 'bg-orange-100 text-orange-950 border border-orange-300'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-orange-600" />
                <span>Weight-for-Age</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveChartType('height')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeChartType === 'height'
                    ? 'bg-teal-100 text-teal-950 border border-teal-300'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Ruler className="w-3.5 h-3.5 text-teal-600" />
                <span>Length-for-Age</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveChartType('head')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeChartType === 'head'
                    ? 'bg-sky-100 text-sky-950 border border-sky-300'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <CircleDot className="w-3.5 h-3.5 text-sky-600" />
                <span>Head Circumference</span>
              </button>
            </div>

            {/* SVG Interactive Growth Chart */}
            <GrowthChart
              entries={entries}
              chartType={activeChartType}
              gender={profile.gender}
              unit={unit}
              babyName={profile.name}
            />

            {/* Reassurance Callout */}
            <div className="bg-stone-100/70 border border-stone-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-stone-600">
              <Heart className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800">
                  Pediatric Growth Tip:
                </span>{' '}
                Babies are biologically unique and can grow healthily anywhere along the 3rd to 97th percentiles. What pediatricians look for is not being in the "highest" percentile, but consistently tracking along their own smooth curve over time.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Timeline & Milestones */}
        {activeTab === 'timeline' && (
          <GrowthTimeline
            entries={entries}
            gender={profile.gender}
            unit={unit}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
            onAddFirstEntry={() => {
              setEditingEntry(null);
              setIsLogModalOpen(true);
            }}
          />
        )}

        {/* Tab 3: 7-Month Pediatric Guide */}
        {activeTab === 'guide' && <MilestoneGuide />}
      </main>

      {/* Floating Bottom Quick Action on Mobile */}
      <div className="sm:hidden fixed bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => {
            setEditingEntry(null);
            setIsLogModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-stone-900 text-white text-xs font-bold rounded-full shadow-lg shadow-stone-900/20 active:scale-95 transition-transform"
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
      />
    </div>
  );
}
