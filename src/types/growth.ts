export type Gender = 'boy' | 'girl';

export type MetricUnit = 'metric' | 'imperial';

export type ChartType = 'weight' | 'height' | 'head' | 'bmi';

export type ThemeMode = 'system' | 'light' | 'dark';
export type PaletteTheme =
  | 'apple-health'
  | 'huckleberry'
  | 'sage'
  | 'honey';

export interface BabyProfile {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  gestationalWeeks?: number; // e.g., 32 for preterm (default full term >= 37)
  birthWeightKg?: number;
  birthHeightCm?: number;
  birthHeadCircumferenceCm?: number;
  avatarUrl?: string;
  notes?: string;
}

export interface StoredBabyWorkspace {
  profile: BabyProfile;
  entries: GrowthEntry[];
  unit?: MetricUnit;
}

export interface GrowthEntry {
  id: string;
  date: string; // YYYY-MM-DD
  ageMonths: number; // e.g. 7.1
  weightKg?: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  milestones?: string[];
  notes?: string;
  photoUrl?: string;
  isPediatricianVisit?: boolean;
}

export interface WHOPercentileRow {
  month: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}
