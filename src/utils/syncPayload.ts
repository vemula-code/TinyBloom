import { BabyProfile, GrowthEntry } from '../types/growth';

export interface SyncDataPackage {
  v: number; // version
  p: {
    n: string; // name
    g: 'boy' | 'girl'; // gender
    b: string; // birthDate
    u?: 'metric' | 'imperial'; // measurement unit
    nt?: string; // notes
  };
  e: Array<{
    id?: string;
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

// Convert app data into a clean, minified, URL-safe payload
export function generateSyncUrl(
  profile: BabyProfile,
  entries: GrowthEntry[],
  unit?: 'metric' | 'imperial',
  baseUrl?: string
): string {
  const currentBase =
    baseUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : '');

  // Minify the data structure for URL safety (omitting empty/falsey fields)
  const pkg: SyncDataPackage = {
    v: 1,
    p: {
      n: profile.name || 'Baby',
      g: profile.gender || 'boy',
      b: profile.birthDate || new Date().toISOString().split('T')[0],
      ...(unit ? { u: unit } : {}),
      ...(profile.notes && profile.notes !== 'Track your baby’s milestones, weight, and height curves.' ? { nt: profile.notes } : {}),
    },
    e: entries.map((entry, idx) => {
      const item: SyncDataPackage['e'][0] = {
        id: entry.id || `entry-${idx}`,
        d: entry.date,
        m: entry.ageMonths,
      };
      if (entry.weightKg != null && !isNaN(entry.weightKg)) {
        item.w = Number(entry.weightKg.toFixed(2));
      }
      if (entry.heightCm != null && !isNaN(entry.heightCm)) {
        item.h = Number(entry.heightCm.toFixed(1));
      }
      if (entry.headCircumferenceCm != null && !isNaN(entry.headCircumferenceCm)) {
        item.c = Number(entry.headCircumferenceCm.toFixed(1));
      }
      if (entry.notes && entry.notes.trim()) {
        item.n = entry.notes.trim();
      }
      if (Array.isArray(entry.milestones) && entry.milestones.length > 0) {
        item.ms = entry.milestones;
      }
      if (entry.isPediatricianVisit) {
        item.pv = true;
      }
      return item;
    }),
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

// Decode the sync URL parameter back into GrowthEntry[], BabyProfile, and Unit
export function decodeSyncUrl(search: string): {
  profile: Partial<BabyProfile>;
  entries: GrowthEntry[];
  unit?: 'metric' | 'imperial';
} | null {
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

    if (!pkg || !pkg.p) {
      return null;
    }

    const profile: Partial<BabyProfile> = {
      name: pkg.p.n || 'Baby',
      gender: pkg.p.g || 'boy',
      birthDate: pkg.p.b || new Date().toISOString().split('T')[0],
      ...(pkg.p.nt ? { notes: pkg.p.nt } : {}),
    };

    const entries: GrowthEntry[] = Array.isArray(pkg.e)
      ? pkg.e.map((item, idx) => ({
          id: item.id || `sync-${idx}-${Date.now()}`,
          date: item.d,
          ageMonths: item.m,
          weightKg: item.w,
          heightCm: item.h,
          headCircumferenceCm: item.c,
          notes: item.n,
          milestones: item.ms,
          isPediatricianVisit: item.pv,
        }))
      : [];

    return {
      profile,
      entries,
      unit: pkg.p.u,
    };
  } catch (err) {
    console.error('Failed to decode sync URL:', err);
    return null;
  }
}
