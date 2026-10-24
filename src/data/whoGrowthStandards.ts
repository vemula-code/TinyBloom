import { Gender, WHOPercentileRow, ChartType } from '../types/growth';

// WHO Child Growth Standards (0 to 24 months)
// Source: World Health Organization (WHO) Child Growth Standards / CDC recommended standard

export const WHO_WEIGHT_BOYS: WHOPercentileRow[] = [
  { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
  { month: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.8 },
  { month: 2, p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.1 },
  { month: 3, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 8.0 },
  { month: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.7 },
  { month: 5, p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.3 },
  { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
  { month: 7, p3: 6.7, p15: 7.4, p50: 8.3, p85: 9.2, p97: 10.3 },
  { month: 8, p3: 6.9, p15: 7.7, p50: 8.6, p85: 9.6, p97: 10.7 },
  { month: 9, p3: 7.1, p15: 7.9, p50: 8.9, p85: 9.9, p97: 11.0 },
  { month: 10, p3: 7.4, p15: 8.2, p50: 9.2, p85: 10.2, p97: 11.4 },
  { month: 11, p3: 7.6, p15: 8.4, p50: 9.4, p85: 10.5, p97: 11.7 },
  { month: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 12.0 },
  { month: 14, p3: 8.1, p15: 9.0, p50: 10.1, p85: 11.3, p97: 12.6 },
  { month: 16, p3: 8.4, p15: 9.4, p50: 10.5, p85: 11.8, p97: 13.1 },
  { month: 18, p3: 8.8, p15: 9.7, p50: 10.9, p85: 12.2, p97: 13.7 },
  { month: 20, p3: 9.1, p15: 10.1, p50: 11.3, p85: 12.7, p97: 14.2 },
  { month: 22, p3: 9.4, p15: 10.5, p50: 11.8, p85: 13.2, p97: 14.7 },
  { month: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.3 },
];

export const WHO_WEIGHT_GIRLS: WHOPercentileRow[] = [
  { month: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { month: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.5 },
  { month: 2, p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.6 },
  { month: 3, p3: 4.5, p15: 5.2, p50: 5.8, p85: 6.6, p97: 7.5 },
  { month: 4, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.3, p97: 8.2 },
  { month: 5, p3: 5.4, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.8 },
  { month: 6, p3: 5.7, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.3 },
  { month: 7, p3: 6.0, p15: 6.8, p50: 7.6, p85: 8.6, p97: 9.8 },
  { month: 8, p3: 6.3, p15: 7.0, p50: 7.9, p85: 9.0, p97: 10.2 },
  { month: 9, p3: 6.5, p15: 7.3, p50: 8.2, p85: 9.3, p97: 10.5 },
  { month: 10, p3: 6.7, p15: 7.5, p50: 8.5, p85: 9.6, p97: 10.9 },
  { month: 11, p3: 6.9, p15: 7.7, p50: 8.7, p85: 9.9, p97: 11.2 },
  { month: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.5 },
  { month: 14, p3: 7.4, p15: 8.3, p50: 9.4, p85: 10.6, p97: 12.1 },
  { month: 16, p3: 7.7, p15: 8.7, p50: 9.8, p85: 11.1, p97: 12.6 },
  { month: 18, p3: 8.1, p15: 9.1, p50: 10.2, p85: 11.6, p97: 13.2 },
  { month: 20, p3: 8.4, p15: 9.5, p50: 10.6, p85: 12.1, p97: 13.7 },
  { month: 22, p3: 8.7, p15: 9.8, p50: 11.0, p85: 12.5, p97: 14.3 },
  { month: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.0, p97: 14.8 },
];

export const WHO_HEIGHT_BOYS: WHOPercentileRow[] = [
  { month: 0, p3: 46.1, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.7 },
  { month: 1, p3: 50.8, p15: 52.8, p50: 54.7, p85: 56.7, p97: 58.6 },
  { month: 2, p3: 54.4, p15: 56.4, p50: 58.4, p85: 60.4, p97: 62.4 },
  { month: 3, p3: 57.3, p15: 59.4, p50: 61.4, p85: 63.5, p97: 65.5 },
  { month: 4, p3: 59.7, p15: 61.8, p50: 63.9, p85: 66.0, p97: 68.0 },
  { month: 5, p3: 61.7, p15: 63.8, p50: 65.9, p85: 68.0, p97: 70.1 },
  { month: 6, p3: 63.3, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.9 },
  { month: 7, p3: 64.8, p15: 67.0, p50: 69.2, p85: 71.3, p97: 73.5 },
  { month: 8, p3: 66.2, p15: 68.4, p50: 70.6, p85: 72.8, p97: 75.0 },
  { month: 9, p3: 67.5, p15: 69.7, p50: 72.0, p85: 74.2, p97: 76.5 },
  { month: 10, p3: 68.7, p15: 71.0, p50: 73.3, p85: 75.6, p97: 77.9 },
  { month: 11, p3: 69.9, p15: 72.2, p50: 74.5, p85: 76.9, p97: 79.2 },
  { month: 12, p3: 71.0, p15: 73.4, p50: 75.7, p85: 78.1, p97: 80.5 },
  { month: 14, p3: 73.1, p15: 75.6, p50: 78.0, p85: 80.5, p97: 83.0 },
  { month: 16, p3: 75.0, p15: 77.6, p50: 80.2, p85: 82.7, p97: 85.4 },
  { month: 18, p3: 76.9, p15: 79.6, p50: 82.3, p85: 85.0, p97: 87.7 },
  { month: 20, p3: 78.6, p15: 81.4, p50: 84.2, p85: 87.0, p97: 89.8 },
  { month: 22, p3: 80.3, p15: 83.2, p50: 86.0, p85: 88.9, p97: 91.9 },
  { month: 24, p3: 81.7, p15: 84.8, p50: 87.8, p85: 90.9, p97: 93.9 },
];

export const WHO_HEIGHT_GIRLS: WHOPercentileRow[] = [
  { month: 0, p3: 45.4, p15: 47.3, p50: 49.1, p85: 51.0, p97: 52.9 },
  { month: 1, p3: 49.8, p15: 51.7, p50: 53.7, p85: 55.6, p97: 57.6 },
  { month: 2, p3: 53.0, p15: 55.0, p50: 57.1, p85: 59.1, p97: 61.1 },
  { month: 3, p3: 55.6, p15: 57.7, p50: 59.8, p85: 61.9, p97: 64.0 },
  { month: 4, p3: 57.8, p15: 60.0, p50: 62.1, p85: 64.3, p97: 66.4 },
  { month: 5, p3: 59.6, p15: 61.8, p50: 64.0, p85: 66.2, p97: 68.5 },
  { month: 6, p3: 61.2, p15: 63.5, p50: 65.7, p85: 68.0, p97: 70.3 },
  { month: 7, p3: 62.7, p15: 65.0, p50: 67.3, p85: 69.6, p97: 71.9 },
  { month: 8, p3: 64.0, p15: 66.4, p50: 68.7, p85: 71.1, p97: 73.5 },
  { month: 9, p3: 65.3, p15: 67.7, p50: 70.1, p85: 72.6, p97: 75.0 },
  { month: 10, p3: 66.5, p15: 69.0, p50: 71.5, p85: 73.9, p97: 76.4 },
  { month: 11, p3: 67.7, p15: 70.3, p50: 72.8, p85: 75.3, p97: 77.8 },
  { month: 12, p3: 68.9, p15: 71.4, p50: 74.0, p85: 76.6, p97: 79.2 },
  { month: 14, p3: 71.0, p15: 73.7, p50: 76.4, p85: 79.1, p97: 81.7 },
  { month: 16, p3: 73.0, p15: 75.8, p50: 78.6, p85: 81.4, p97: 84.2 },
  { month: 18, p3: 74.9, p15: 77.8, p50: 80.7, p85: 83.6, p97: 86.5 },
  { month: 20, p3: 76.7, p15: 79.7, p50: 82.7, p85: 85.7, p97: 88.7 },
  { month: 22, p3: 78.4, p15: 81.5, p50: 84.6, p85: 87.7, p97: 90.8 },
  { month: 24, p3: 80.0, p15: 83.2, p50: 86.4, p85: 89.6, p97: 92.8 },
];

export const WHO_HEAD_BOYS: WHOPercentileRow[] = [
  { month: 0, p3: 31.9, p15: 33.2, p50: 34.5, p85: 35.8, p97: 37.0 },
  { month: 1, p3: 34.9, p15: 36.1, p50: 37.3, p85: 38.6, p97: 39.8 },
  { month: 2, p3: 36.8, p15: 38.0, p50: 39.1, p85: 40.3, p97: 41.5 },
  { month: 3, p3: 38.1, p15: 39.3, p50: 40.5, p85: 41.7, p97: 42.9 },
  { month: 4, p3: 39.2, p15: 40.4, p50: 41.6, p85: 42.8, p97: 44.0 },
  { month: 5, p3: 40.1, p15: 41.3, p50: 42.6, p85: 43.8, p97: 45.0 },
  { month: 6, p3: 40.9, p15: 42.1, p50: 43.3, p85: 44.6, p97: 45.8 },
  { month: 7, p3: 41.5, p15: 42.7, p50: 44.0, p85: 45.3, p97: 46.5 },
  { month: 8, p3: 42.0, p15: 43.3, p50: 44.5, p85: 45.8, p97: 47.0 },
  { month: 9, p3: 42.5, p15: 43.8, p50: 45.0, p85: 46.3, p97: 47.5 },
  { month: 10, p3: 42.9, p15: 44.2, p50: 45.4, p85: 46.7, p97: 47.9 },
  { month: 11, p3: 43.2, p15: 44.5, p50: 45.8, p85: 47.1, p97: 48.3 },
  { month: 12, p3: 43.5, p15: 44.8, p50: 46.1, p85: 47.4, p97: 48.6 },
  { month: 14, p3: 44.0, p15: 45.3, p50: 46.6, p85: 47.9, p97: 49.2 },
  { month: 16, p3: 44.4, p15: 45.8, p50: 47.1, p85: 48.4, p97: 49.7 },
  { month: 18, p3: 44.7, p15: 46.1, p50: 47.4, p85: 48.8, p97: 50.1 },
  { month: 20, p3: 45.0, p15: 46.4, p50: 47.8, p85: 49.2, p97: 50.5 },
  { month: 22, p3: 45.3, p15: 46.7, p50: 48.1, p85: 49.5, p97: 50.8 },
  { month: 24, p3: 45.5, p15: 47.0, p50: 48.3, p85: 49.8, p97: 51.1 },
];

export const WHO_HEAD_GIRLS: WHOPercentileRow[] = [
  { month: 0, p3: 31.5, p15: 32.7, p50: 33.9, p85: 35.1, p97: 36.2 },
  { month: 1, p3: 34.2, p15: 35.3, p50: 36.5, p85: 37.7, p97: 38.8 },
  { month: 2, p3: 35.9, p15: 37.1, p50: 38.3, p85: 39.5, p97: 40.6 },
  { month: 3, p3: 37.2, p15: 38.4, p50: 39.5, p85: 40.7, p97: 41.9 },
  { month: 4, p3: 38.2, p15: 39.4, p50: 40.6, p85: 41.8, p97: 43.0 },
  { month: 5, p3: 39.0, p15: 40.2, p50: 41.5, p85: 42.7, p97: 43.9 },
  { month: 6, p3: 39.7, p15: 40.9, p50: 42.2, p85: 43.5, p97: 44.6 },
  { month: 7, p3: 40.2, p15: 41.5, p50: 42.8, p85: 44.1, p97: 45.3 },
  { month: 8, p3: 40.7, p15: 42.0, p50: 43.4, p85: 44.7, p97: 45.8 },
  { month: 9, p3: 41.2, p15: 42.5, p50: 43.8, p85: 45.1, p97: 46.3 },
  { month: 10, p3: 41.5, p15: 42.9, p50: 44.2, p85: 45.6, p97: 46.8 },
  { month: 11, p3: 41.9, p15: 43.2, p50: 44.6, p85: 46.0, p97: 47.2 },
  { month: 12, p3: 42.2, p15: 43.5, p50: 44.9, p85: 46.3, p97: 47.5 },
  { month: 14, p3: 42.7, p15: 44.0, p50: 45.5, p85: 46.9, p97: 48.1 },
  { month: 16, p3: 43.1, p15: 44.5, p50: 46.0, p85: 47.4, p97: 48.6 },
  { month: 18, p3: 43.5, p15: 44.9, p50: 46.4, p85: 47.8, p97: 49.1 },
  { month: 20, p3: 43.8, p15: 45.2, p50: 46.7, p85: 48.2, p97: 49.5 },
  { month: 22, p3: 44.1, p15: 45.5, p50: 47.0, p85: 48.5, p97: 49.8 },
  { month: 24, p3: 44.4, p15: 45.8, p50: 47.2, p85: 48.8, p97: 50.1 },
];

export function getWHOTable(type: ChartType, gender: Gender): WHOPercentileRow[] {
  if (type === 'weight') {
    return gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
  }
  if (type === 'height') {
    return gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
  }
  // Default to head
  return gender === 'boy' ? WHO_HEAD_BOYS : WHO_HEAD_GIRLS;
}

// Convert between metric and imperial
export function kgToLbsOz(kg: number): { lbs: number; oz: number; displayStr: string } {
  const totalLbs = kg * 2.20462262;
  const lbs = Math.floor(totalLbs);
  const oz = Math.round((totalLbs - lbs) * 16 * 10) / 10;
  return {
    lbs,
    oz,
    displayStr: `${lbs} lb ${oz} oz`,
  };
}

export function lbsOzToKg(lbs: number, oz: number = 0): number {
  const totalLbs = Number(lbs || 0) + Number(oz || 0) / 16;
  return Math.round((totalLbs / 2.20462262) * 100) / 100;
}

export function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

// Format ordinal (e.g. 50th, 1st, 2nd, 3rd)
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Calculate exact percentile for a measurement based on WHO table
export function calculatePercentile(
  type: ChartType,
  value: number, // in kg or cm
  ageMonths: number,
  gender: Gender
): { percentile: number; displayStr: string; status: string } {
  if (value <= 0 || ageMonths < 0) {
    return { percentile: 50, displayStr: '50th %', status: 'Average' };
  }

  const table = getWHOTable(type, gender);
  
  // Find neighboring months in table
  const clampedAge = Math.min(Math.max(ageMonths, 0), 24);
  let lower = table[0];
  let upper = table[table.length - 1];

  for (let i = 0; i < table.length - 1; i++) {
    if (clampedAge >= table[i].month && clampedAge <= table[i + 1].month) {
      lower = table[i];
      upper = table[i + 1];
      break;
    }
  }

  // Linear interpolation for age
  const t = upper.month === lower.month ? 0 : (clampedAge - lower.month) / (upper.month - lower.month);
  const p3 = lower.p3 + (upper.p3 - lower.p3) * t;
  const p15 = lower.p15 + (upper.p15 - lower.p15) * t;
  const p50 = lower.p50 + (upper.p50 - lower.p50) * t;
  const p85 = lower.p85 + (upper.p85 - lower.p85) * t;
  const p97 = lower.p97 + (upper.p97 - lower.p97) * t;

  let calculatedP = 50;
  if (value <= p3) {
    calculatedP = Math.max(1, Math.round((value / p3) * 3));
  } else if (value <= p15) {
    calculatedP = Math.round(3 + ((value - p3) / (p15 - p3)) * 12);
  } else if (value <= p50) {
    calculatedP = Math.round(15 + ((value - p15) / (p50 - p15)) * 35);
  } else if (value <= p85) {
    calculatedP = Math.round(50 + ((value - p50) / (p85 - p50)) * 35);
  } else if (value <= p97) {
    calculatedP = Math.round(85 + ((value - p85) / (p97 - p85)) * 12);
  } else {
    calculatedP = Math.min(99, Math.round(97 + ((value - p97) / (p97 * 0.1)) * 2));
  }

  let status = 'Typical / On Track';
  if (calculatedP < 5) status = 'Below 5th % (Track with MD)';
  else if (calculatedP < 15) status = 'Slightly lean (Normal)';
  else if (calculatedP <= 85) status = 'Typical / Balanced';
  else if (calculatedP < 95) status = 'Above average (Healthy)';
  else status = 'Above 95th % (Healthy)';

  return {
    percentile: calculatedP,
    displayStr: `${formatOrdinal(calculatedP)} percentile`,
    status,
  };
}

// Calculate age in months and days between two dates
export function calculateAge(birthDateStr: string, targetDateStr: string = new Date().toISOString().split('T')[0]): {
  months: number;
  days: number;
  exactMonths: number;
  displayStr: string;
} {
  const birth = new Date(birthDateStr);
  const target = new Date(targetDateStr);
  
  if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
    return { months: 7, days: 0, exactMonths: 7, displayStr: '7 months' };
  }

  const diffMs = target.getTime() - birth.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const exactMonths = Math.round((diffDays / 30.4375) * 10) / 10;
  
  let months = target.getMonth() - birth.getMonth() + (12 * (target.getFullYear() - birth.getFullYear()));
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  let displayStr = '';
  if (months < 1) {
    const weeks = Math.floor(diffDays / 7);
    const remDays = diffDays % 7;
    displayStr = weeks > 0 ? `${weeks} wk ${remDays} d` : `${diffDays} days`;
  } else if (months < 24) {
    displayStr = days > 0 ? `${months} mo ${days} d` : `${months} months`;
  } else {
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    displayStr = remMonths > 0 ? `${years} yr ${remMonths} mo` : `${years} years`;
  }

  return {
    months: Math.max(0, months),
    days: Math.max(0, days),
    exactMonths: Math.max(0, exactMonths),
    displayStr,
  };
}
