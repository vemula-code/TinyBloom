import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Camera, Check, Stethoscope, Sparkles } from 'lucide-react';
import { Gender, GrowthEntry, MetricUnit } from '../types/growth';
import { calculateAge, calculatePercentile, cmToInches, inchesToCm, kgToLbsOz, lbsOzToKg } from '../data/whoGrowthStandards';
import { COMMON_MILESTONES } from '../data/milestonesData';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: GrowthEntry) => void;
  initialEntry?: GrowthEntry | null;
  birthDate: string;
  gender: Gender;
  defaultUnit: MetricUnit;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
  birthDate,
  gender,
  defaultUnit,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [unit, setUnit] = useState<MetricUnit>(defaultUnit);

  // Weight fields
  const [weightKgStr, setWeightKgStr] = useState<string>('');
  const [weightLbsStr, setWeightLbsStr] = useState<string>('');
  const [weightOzStr, setWeightOzStr] = useState<string>('');

  // Height / Length fields
  const [heightCmStr, setHeightCmStr] = useState<string>('');
  const [heightInStr, setHeightInStr] = useState<string>('');

  // Head circumference fields
  const [headCmStr, setHeadCmStr] = useState<string>('');
  const [headInStr, setHeadInStr] = useState<string>('');

  // Notes & Milestones
  const [notes, setNotes] = useState<string>('');
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [customMilestone, setCustomMilestone] = useState<string>('');
  const [isPediatricianVisit, setIsPediatricianVisit] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Sync unit when defaultUnit changes
  useEffect(() => {
    setUnit(defaultUnit);
  }, [defaultUnit]);

  // Load entry into form if editing
  useEffect(() => {
    if (initialEntry) {
      setDate(initialEntry.date);
      setNotes(initialEntry.notes || '');
      setSelectedMilestones(initialEntry.milestones || []);
      setIsPediatricianVisit(!!initialEntry.isPediatricianVisit);
      setPhotoUrl(initialEntry.photoUrl);

      if (initialEntry.weightKg !== undefined) {
        setWeightKgStr(initialEntry.weightKg.toString());
        const { lbs, oz } = kgToLbsOz(initialEntry.weightKg);
        setWeightLbsStr(lbs.toString());
        setWeightOzStr(oz.toString());
      } else {
        setWeightKgStr('');
        setWeightLbsStr('');
        setWeightOzStr('');
      }

      if (initialEntry.heightCm !== undefined) {
        setHeightCmStr(initialEntry.heightCm.toString());
        setHeightInStr(cmToInches(initialEntry.heightCm).toString());
      } else {
        setHeightCmStr('');
        setHeightInStr('');
      }

      if (initialEntry.headCircumferenceCm !== undefined) {
        setHeadCmStr(initialEntry.headCircumferenceCm.toString());
        setHeadInStr(cmToInches(initialEntry.headCircumferenceCm).toString());
      } else {
        setHeadCmStr('');
        setHeadInStr('');
      }
    } else {
      // Reset for new entry
      setDate(new Date().toISOString().split('T')[0]);
      setWeightKgStr('');
      setWeightLbsStr('');
      setWeightOzStr('');
      setHeightCmStr('');
      setHeightInStr('');
      setHeadCmStr('');
      setHeadInStr('');
      setNotes('');
      setSelectedMilestones([]);
      setCustomMilestone('');
      setIsPediatricianVisit(false);
      setPhotoUrl(undefined);
    }
  }, [initialEntry, isOpen]);

  // Handle unit conversion changes when user toggles
  const handleToggleUnit = (newUnit: MetricUnit) => {
    setUnit(newUnit);
  };

  // Convert on the fly
  const handleKgChange = (val: string) => {
    setWeightKgStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const { lbs, oz } = kgToLbsOz(num);
      setWeightLbsStr(lbs.toString());
      setWeightOzStr(oz.toString());
    } else {
      setWeightLbsStr('');
      setWeightOzStr('');
    }
  };

  const handleLbsOzChange = (lbsVal: string, ozVal: string) => {
    setWeightLbsStr(lbsVal);
    setWeightOzStr(ozVal);
    const lbs = parseFloat(lbsVal) || 0;
    const oz = parseFloat(ozVal) || 0;
    if (lbs > 0 || oz > 0) {
      const kg = lbsOzToKg(lbs, oz);
      setWeightKgStr(kg.toString());
    } else {
      setWeightKgStr('');
    }
  };

  const handleCmHeightChange = (val: string) => {
    setHeightCmStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setHeightInStr(cmToInches(num).toString());
    } else {
      setHeightInStr('');
    }
  };

  const handleInHeightChange = (val: string) => {
    setHeightInStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setHeightCmStr(inchesToCm(num).toString());
    } else {
      setHeightCmStr('');
    }
  };

  const handleCmHeadChange = (val: string) => {
    setHeadCmStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setHeadInStr(cmToInches(num).toString());
    } else {
      setHeadInStr('');
    }
  };

  const handleInHeadChange = (val: string) => {
    setHeadInStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setHeadCmStr(inchesToCm(num).toString());
    } else {
      setHeadCmStr('');
    }
  };

  // Computed age at selected date
  const ageInfo = useMemo(() => {
    return calculateAge(birthDate, date);
  }, [birthDate, date]);

  // Live WHO Percentile Preview
  const livePercentiles = useMemo(() => {
    const wKg = parseFloat(weightKgStr);
    const hCm = parseFloat(heightCmStr);
    const hcCm = parseFloat(headCmStr);

    return {
      weight: !isNaN(wKg) && wKg > 0 ? calculatePercentile('weight', wKg, ageInfo.exactMonths, gender) : null,
      height: !isNaN(hCm) && hCm > 0 ? calculatePercentile('height', hCm, ageInfo.exactMonths, gender) : null,
      head: !isNaN(hcCm) && hcCm > 0 ? calculatePercentile('head', hcCm, ageInfo.exactMonths, gender) : null,
    };
  }, [weightKgStr, heightCmStr, headCmStr, ageInfo.exactMonths, gender]);

  // Milestone toggling
  const toggleMilestone = (label: string) => {
    setSelectedMilestones((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const addCustomMilestone = () => {
    if (customMilestone.trim() && !selectedMilestones.includes(customMilestone.trim())) {
      setSelectedMilestones((prev) => [...prev, customMilestone.trim()]);
      setCustomMilestone('');
    }
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const wKg = parseFloat(weightKgStr);
    const hCm = parseFloat(heightCmStr);
    const hcCm = parseFloat(headCmStr);

    const newEntry: GrowthEntry = {
      id: initialEntry?.id || `entry-${Date.now()}`,
      date,
      ageMonths: ageInfo.exactMonths,
      weightKg: !isNaN(wKg) && wKg > 0 ? wKg : undefined,
      heightCm: !isNaN(hCm) && hCm > 0 ? hCm : undefined,
      headCircumferenceCm: !isNaN(hcCm) && hcCm > 0 ? hcCm : undefined,
      notes: notes.trim() || undefined,
      milestones: selectedMilestones.length > 0 ? selectedMilestones : undefined,
      isPediatricianVisit,
      photoUrl,
    };

    onSave(newEntry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFF9F0] rounded-3xl shadow-2xl border border-[#91A98B]/30 w-full max-w-2xl overflow-hidden my-4 sm:my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#91A98B]/20 flex items-center justify-between bg-white/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#91A98B] inline-block" />
              <h2 className="text-base font-bold font-heading text-[#303832] tracking-tight">
                {initialEntry ? 'Edit Growth Record' : 'Log New Growth Measurement'}
              </h2>
            </div>
            <p className="text-xs text-[#6E7B6C] mt-0.5">
              Age on date: <span className="font-semibold text-[#303832]">{ageInfo.displayStr}</span> ({gender === 'boy' ? 'Boy' : 'Girl'})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Date & Unit Segmented Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Measurement Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 text-stone-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Preferred Unit System
              </label>
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => handleToggleUnit('metric')}
                  className={`py-2 rounded-lg transition-all ${
                    unit === 'metric'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleUnit('imperial')}
                  className={`py-2 rounded-lg transition-all ${
                    unit === 'imperial'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Imperial (lb·oz / in)
                </button>
              </div>
            </div>
          </div>

          {/* Core Measurements Card */}
          <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Measurements & Instant WHO Percentiles
            </h3>

            {/* Weight */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">Weight</label>
                {livePercentiles.weight && (
                  <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    {livePercentiles.weight.displayStr} · {livePercentiles.weight.status}
                  </span>
                )}
              </div>

              {unit === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 8.42"
                    value={weightKgStr}
                    onChange={(e) => handleKgChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-mono text-stone-900 pr-12"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-mono">kg</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      placeholder="e.g. 18"
                      value={weightLbsStr}
                      onChange={(e) => handleLbsOzChange(e.target.value, weightOzStr)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-mono text-stone-900 pr-12"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-mono">lbs</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 9"
                      value={weightOzStr}
                      onChange={(e) => handleLbsOzChange(weightLbsStr, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-mono text-stone-900 pr-12"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-mono">oz</span>
                  </div>
                </div>
              )}
            </div>

            {/* Height / Length */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">Length / Height</label>
                {livePercentiles.height && (
                  <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    {livePercentiles.height.displayStr} · {livePercentiles.height.status}
                  </span>
                )}
              </div>

              {unit === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 69.8"
                    value={heightCmStr}
                    onChange={(e) => handleCmHeightChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-mono text-stone-900 pr-12"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-mono">cm</span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 27.5"
                    value={heightInStr}
                    onChange={(e) => handleInHeightChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-mono text-stone-900 pr-12"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-mono">in</span>
                </div>
              )}
            </div>

            {/* Head Circumference */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">Head Circumference</label>
                {livePercentiles.head && (
                  <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    {livePercentiles.head.displayStr} · {livePercentiles.head.status}
                  </span>
                )}
              </div>

              {unit === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 44.2"
                    value={headCmStr}
                    onChange={(e) => handleCmHeadChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-mono text-stone-900 pr-12"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-mono">cm</span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 17.4"
                    value={headInStr}
                    onChange={(e) => handleInHeadChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-mono text-stone-900 pr-12"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-mono">in</span>
                </div>
              )}
            </div>
          </div>

          {/* Pediatrician Checkup Toggle */}
          <label className="flex items-center gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
            <input
              type="checkbox"
              checked={isPediatricianVisit}
              onChange={(e) => setIsPediatricianVisit(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md border-stone-300 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs font-semibold text-blue-900">
                This is an official Pediatrician Well-Child Checkup
              </span>
            </div>
          </label>

          {/* Milestones Achieved */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Milestones & Discoveries
              </label>
              <span className="text-[11px] text-stone-400">
                {selectedMilestones.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2.5 max-h-36 overflow-y-auto p-1">
              {COMMON_MILESTONES.map((m) => {
                const isSelected = selectedMilestones.includes(m.label);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMilestone(m.label)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-medium'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-amber-700" />}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Milestone Adder */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add custom milestone (e.g. Loves waving at dog)"
                value={customMilestone}
                onChange={(e) => setCustomMilestone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomMilestone();
                  }
                }}
                className="grow px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
              <button
                type="button"
                onClick={addCustomMilestone}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes & Memories */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Monthly Notes, Feeding, Sleep & Pediatrician Guidance
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Loves sweet potato, started drinking from open silicone cup, sleep regression lasted 4 days then back to 7h stretches..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 text-stone-800"
            />
          </div>

          {/* Photo Moment Upload */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Attach Moment / Photo (Saved locally on your device)
            </label>
            {photoUrl ? (
              <div className="relative inline-block">
                <img
                  src={photoUrl}
                  alt="Milestone moment"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 object-cover rounded-xl border border-stone-200 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(undefined)}
                  className="absolute -top-2 -right-2 bg-stone-900 text-white rounded-full p-1 shadow-sm hover:bg-stone-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-3.5 py-2.5 border border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 text-stone-600 text-xs transition-colors">
                <Camera className="w-4 h-4 text-stone-400" />
                <span>Upload a cute photo for this month</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#91A98B]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#303832] hover:bg-[#91A98B]/10 bg-white border border-[#91A98B]/30 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#91A98B] hover:bg-[#7D9977] rounded-xl transition-all shadow-xs"
            >
              {initialEntry ? 'Update Record' : 'Save Growth Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
