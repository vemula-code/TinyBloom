import React, { useState } from 'react';
import { BabyProfile, Gender, MetricUnit } from '../types/growth';
import { TinyBloomLogo } from './TinyBloomLogo';
import { BabyAvatar } from './BabyAvatar';
import { PRESET_AVATARS, DEFAULT_AVATAR } from '../data/defaultData';
import {
  Baby,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  Eye,
  X,
  Heart,
  Scale,
  Ruler
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSetup: (newProfile: BabyProfile, initialWeightKg?: number, initialHeightCm?: number) => void;
  onChooseSampleData: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteSetup,
  onChooseSampleData,
}) => {
  const [mode, setMode] = useState<'form' | 'choose'>('choose');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('boy');
  const [birthDate, setBirthDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [birthWeightInput, setBirthWeightInput] = useState('');
  const [birthHeightInput, setBirthHeightInput] = useState('');
  const [unit, setUnit] = useState<MetricUnit>('metric');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'My Baby';

    let weightKg: number | undefined;
    if (birthWeightInput) {
      const num = parseFloat(birthWeightInput);
      if (!isNaN(num) && num > 0) {
        weightKg = unit === 'imperial' ? num * 0.453592 : num;
      }
    }

    let heightCm: number | undefined;
    if (birthHeightInput) {
      const num = parseFloat(birthHeightInput);
      if (!isNaN(num) && num > 0) {
        heightCm = unit === 'imperial' ? num * 2.54 : num;
      }
    }

    const newProfile: BabyProfile = {
      id: `baby-${Date.now()}`,
      name: cleanName,
      gender,
      birthDate,
      birthWeightKg: weightKg,
      birthHeightCm: heightCm,
      avatarUrl,
      notes: notes.trim() || `Welcome to the world ${cleanName}!`,
    };

    onCompleteSetup(newProfile, weightKg, heightCm);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#1D241F] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-main,#303832)] flex flex-col my-auto">
        
        {/* Header Hero */}
        <div className="relative bg-gradient-to-r from-[var(--color-primary,#91A98B)]/20 via-[#F3C9B8]/25 to-[#AFCDE0]/20 p-5 sm:p-6 border-b border-[var(--color-primary,#91A98B)]/20 shrink-0 text-center sm:text-left">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-[#2A342D] text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)] hover:bg-white dark:hover:bg-[#323E36] transition-colors shadow-2xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
            <TinyBloomLogo size={42} showText={false} />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] bg-[var(--color-primary,#91A98B)]/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Welcome to TinyBloom
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-text-main,#303832)] mt-1">
                Every Little Milestone Matters
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
            A calm, 100% private, on-device baby growth tracker powered by official WHO standards. No cloud tracking, no accounts, and no subscriptions.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18]">
          
          {mode === 'choose' ? (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-medium text-[var(--color-text-main,#303832)] text-center sm:text-left">
                How would you like to begin with TinyBloom today?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Option 1: Set Up My Baby */}
                <button
                  type="button"
                  onClick={() => setMode('form')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1D241F] border-2 border-[var(--color-primary,#91A98B)] shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-[0.99]"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary,#91A98B)]/20 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center justify-center">
                      <Baby className="w-5 h-5" />
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                    <h3 className="text-base font-bold font-heading text-[var(--color-text-main,#303832)] group-hover:text-[var(--color-primary-dark,#3D5939)]">
                      Set Up My Baby
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
                      Enter your child's name, sex, and birth date to start a fresh, clean tracker just for them.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option 2: Explore Sample Data */}
                <button
                  type="button"
                  onClick={onChooseSampleData}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1D241F] border border-[var(--color-primary,#91A98B)]/30 hover:border-[var(--color-primary,#91A98B)] shadow-2xs hover:shadow-sm transition-all text-left flex flex-col justify-between group active:scale-[0.99]"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[#F5D77A]/30 text-[#8C6818] flex items-center justify-center">
                      <Eye className="w-5 h-5" />
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      Demo Mode
                    </span>
                    <h3 className="text-base font-bold font-heading text-[var(--color-text-main,#303832)]">
                      Explore Sample Data
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
                      Preview authentic WHO curves, percentiles, and printouts using generic sample records first.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted,#6E7B6C)] group-hover:text-[var(--color-text-main,#303832)]">
                    <span>Preview Demo Charts</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Privacy badge */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1D241F] border border-[var(--color-primary,#91A98B)]/20 flex items-center gap-3 text-xs text-[var(--color-text-muted,#6E7B6C)]">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p>
                  <strong>Private to your device:</strong> Whether you track your baby or explore sample data, nothing is transmitted to any cloud server or advertising network.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-bold font-heading text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                  <span>Enter Baby Details</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setMode('choose')}
                  className="text-xs text-[var(--color-text-muted,#6E7B6C)] hover:underline"
                >
                  ← Back to options
                </button>
              </div>

              {/* Baby Avatar Selector */}
              <div className="p-3 bg-white dark:bg-[#1D241F] rounded-2xl border border-[var(--color-primary,#91A98B)]/20 flex items-center gap-3">
                <BabyAvatar
                  avatarUrl={avatarUrl}
                  name={name || 'Baby'}
                  gender={gender}
                  size="md"
                />
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-[var(--color-text-main,#303832)] mb-1">
                    Choose Avatar Icon
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setAvatarUrl(av.url)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-medium border transition-all ${
                          avatarUrl === av.url
                            ? 'bg-[var(--color-primary,#91A98B)] text-white border-[var(--color-primary,#91A98B)] font-bold'
                            : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/20 text-[var(--color-text-muted,#6E7B6C)]'
                        }`}
                      >
                        {av.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Baby's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya, Liam, Leo, Aria"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#1D241F] border border-[var(--color-primary,#91A98B)]/35 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary,#91A98B)] font-medium"
                />
              </div>

              {/* Sex & DOB */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Sex (For WHO curves) *
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-white dark:bg-[#1D241F] border border-[var(--color-primary,#91A98B)]/20 rounded-xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setGender('boy')}
                      className={`py-1.5 rounded-lg transition-all ${
                        gender === 'boy'
                          ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                          : 'text-[var(--color-text-muted,#6E7B6C)]'
                      }`}
                    >
                      Boy
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('girl')}
                      className={`py-1.5 rounded-lg transition-all ${
                        gender === 'girl'
                          ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                          : 'text-[var(--color-text-muted,#6E7B6C)]'
                      }`}
                    >
                      Girl
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#1D241F] border border-[var(--color-primary,#91A98B)]/35 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary,#91A98B)] font-medium"
                  />
                </div>
              </div>

              {/* Optional starting measurements */}
              <div className="p-3.5 bg-white dark:bg-[#1D241F] rounded-2xl border border-[var(--color-primary,#91A98B)]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-text-main,#303832)]">
                    Birth Measurements (Optional)
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setUnit('metric')}
                      className={`px-2 py-0.5 rounded-md ${
                        unit === 'metric'
                          ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold'
                          : 'text-[var(--color-text-muted,#6E7B6C)]'
                      }`}
                    >
                      kg / cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('imperial')}
                      className={`px-2 py-0.5 rounded-md ${
                        unit === 'imperial'
                          ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold'
                          : 'text-[var(--color-text-muted,#6E7B6C)]'
                      }`}
                    >
                      lbs / in
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-[var(--color-text-muted,#6E7B6C)] mb-1">
                      Birth Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder={unit === 'metric' ? 'e.g. 3.4' : 'e.g. 7.5'}
                      value={birthWeightInput}
                      onChange={(e) => setBirthWeightInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[var(--color-text-muted,#6E7B6C)] mb-1">
                      Birth Length ({unit === 'metric' ? 'cm' : 'in'})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder={unit === 'metric' ? 'e.g. 50.8' : 'e.g. 20.0'}
                      value={birthHeightInput}
                      onChange={(e) => setBirthHeightInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('choose')}
                  className="px-4 py-2 text-xs font-semibold bg-stone-100 dark:bg-[#202722] rounded-xl hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[var(--color-primary,#91A98B)] hover:opacity-90 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Save & Start Tracking</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
