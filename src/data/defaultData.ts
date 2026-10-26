import { BabyProfile, GrowthEntry } from '../types/growth';
import defaultAvatarImg from '../assets/images/baby_portrait_gentle_1792885703662.jpg';

// Bundled portrait asset with public fallback
export const DEFAULT_AVATAR = defaultAvatarImg || '/assets/images/baby_portrait.jpg';
export const HERO_IMAGE = '/assets/images/baby_growth_hero_1792885704783.jpg';

export const PRESET_AVATARS = [
  { id: 'baby-portrait', label: 'Baby Portrait', url: DEFAULT_AVATAR },
  { id: 'sprout-badge', label: 'Sprout Baby', url: 'sprout' },
  { id: 'bear-badge', label: 'Cozy Bear', url: 'bear' },
  { id: 'lion-badge', label: 'Little Lion', url: 'lion' },
  { id: 'chick-badge', label: 'Sunny Chick', url: 'chick' },
];

/**
 * Generic Synthetic Demo Profile
 * Standard WHO 50th percentile benchmark figures (completely generic sample data).
 */
export const DEFAULT_PROFILE: BabyProfile = {
  id: 'demo-sample-baby',
  name: 'Sample Baby',
  gender: 'boy',
  birthDate: '2026-04-15',
  birthWeightKg: 3.30, // WHO 50th percentile at birth (7 lb 4 oz)
  birthHeightCm: 50.0, // WHO 50th percentile length at birth (19.7 in)
  birthHeadCircumferenceCm: 34.5, // WHO 50th percentile head circumference
  avatarUrl: DEFAULT_AVATAR,
  notes: 'Sample demo records following standard WHO 50th percentile trajectory.',
};

/**
 * Generic Synthetic Demo Growth Entries
 * 6 textbook clinical checkups matching standard WHO 50th percentile curves.
 */
export const DEFAULT_GROWTH_ENTRIES: GrowthEntry[] = [
  {
    id: 'sample-0',
    date: '2026-04-15',
    ageMonths: 0,
    weightKg: 3.30,
    heightCm: 50.0,
    headCircumferenceCm: 34.5,
    notes: 'Sample birth measurement · Standard WHO 50th percentile baseline',
    milestones: ['Birth Day'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-1',
    date: '2026-04-29',
    ageMonths: 0.5,
    weightKg: 3.55,
    notes: 'Sample 2-week checkup · Healthy feeding and weight progression',
    isPediatricianVisit: true,
  },
  {
    id: 'sample-2',
    date: '2026-05-15',
    ageMonths: 1.0,
    weightKg: 4.50,
    heightCm: 54.7,
    headCircumferenceCm: 37.3,
    notes: 'Sample 1-month pediatric visit · Social smiles & eye contact',
    milestones: ['First social smiles'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-3',
    date: '2026-06-15',
    ageMonths: 2.0,
    weightKg: 5.60,
    heightCm: 58.4,
    headCircumferenceCm: 39.1,
    notes: 'Sample 2-month wellness checkup · Holds head steady during tummy time',
    milestones: ['Holds head steady during tummy time', 'Tracks faces and objects'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-4',
    date: '2026-08-15',
    ageMonths: 4.0,
    weightKg: 7.00,
    heightCm: 63.9,
    headCircumferenceCm: 41.6,
    notes: 'Sample 4-month checkup · Rolling tummy to back and grasping toys',
    milestones: ['Rolls tummy to back', 'Reaches for and grasps toys'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-5',
    date: '2026-10-15',
    ageMonths: 6.0,
    weightKg: 7.90,
    heightCm: 67.6,
    headCircumferenceCm: 43.3,
    notes: 'Sample 6-month checkup · Sitting with support, babbling sounds',
    milestones: ['Sits with support', 'Babbling chains and playful laughs'],
    isPediatricianVisit: true,
  },
];
