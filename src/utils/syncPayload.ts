import { BabyProfile, GrowthEntry } from '../types/growth';

export interface SyncDataPackage {
  v: number; // version
  p: {
    n: string; // name
    g: 'boy' | 'girl'; // gender
    b: string; // birthDate
  };
  e: Array<{
    id: string;
    d: string; // date
    m: number; // ageMonths
    w?: number; // weightKg
    h?: number; // heightCm
    c?: number; // headCircumferenceCm
    n?: string; // notes
    ms?: string[]; // milestones
    pv?: boolean; // isPediatricianVisit
  }>;
}

// Convert app data into a compressed, URL-safe payload
export function generateSyncUrl(
  profile: BabyProfile,
  entries: GrowthEntry[],
  baseUrl?: string
): string {
  const currentBase = baseUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '');

  // Minify the data structure for URL safety
  const pkg: SyncDataPackage = {
    v: 1,
    p: {
      n: profile.name,
      g: profile.gender,
      b: profile.birthDate,
    },
    e: entries.map((entry) => ({
      id: entry.id,
      d: entry.date,
      m: entry.ageMonths,
      w: entry.weightKg,
      h: entry.heightCm,
      c: entry.headCircumferenceCm,
      n: entry.notes,
      ms: entry.milestones,
      pv: entry.isPediatricianVisit,
    })),
  };

  try {
    const jsonStr = JSON.stringify(pkg);
    // Base64 encoding compatible with UTF-8
    const base64 = btoa(encodeURIComponent(jsonStr));
    const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${currentBase}?sync=${urlSafe}`;
  } catch (err) {
    console.error('Failed to generate sync URL:', err);
    return currentBase;
  }
}

// Decode the sync URL parameter back into GrowthEntry[] and BabyProfile
export function decodeSyncUrl(search: string): { profile: Partial<BabyProfile>; entries: GrowthEntry[] } | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const syncParam = params.get('sync');
  if (!syncParam) return null;

  try {
    // Restore base64 padding and standard chars
    let base64 = syncParam.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonStr = decodeURIComponent(atob(base64));
    const pkg: SyncDataPackage = JSON.parse(jsonStr);

    if (!pkg || !Array.isArray(pkg.e)) {
      return null;
    }

    const profile: Partial<BabyProfile> = {
      name: pkg.p?.n || 'Dhruv',
      gender: pkg.p?.g || 'boy',
      birthDate: pkg.p?.b || '2026-03-28',
    };

    const entries: GrowthEntry[] = pkg.e.map((item, idx) => ({
      id: item.id || `sync-${idx}-${Date.now()}`,
      date: item.d,
      ageMonths: item.m,
      weightKg: item.w,
      heightCm: item.h,
      headCircumferenceCm: item.c,
      notes: item.n,
      milestones: item.ms,
      isPediatricianVisit: item.pv,
    }));

    return { profile, entries };
  } catch (err) {
    console.error('Failed to decode sync URL:', err);
    return null;
  }
}
