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

export const DEFAULT_PROFILE: BabyProfile = {
  id: 'baby-main',
  name: 'Baby',
  gender: 'boy',
  birthDate: '2026-03-28',
  birthWeightKg: 3.40, // 7 lb 8 oz
  birthHeightCm: 50.8, // 20 in
  birthHeadCircumferenceCm: 35.0, // 13.78 in
  avatarUrl: DEFAULT_AVATAR,
  notes: 'Born on March 28, 2026. Happy and thriving, exploring sitting, babbling, and first purees.',
};

export const DEFAULT_GROWTH_ENTRIES: GrowthEntry[] = [
  {
    id: 'sample-0',
    date: '2026-03-28',
    ageMonths: 0,
    weightKg: 3.40, // 7 lb 8 oz (50th %)
    heightCm: 50.8, // 20.0 in (55th %)
    headCircumferenceCm: 35.0,
    notes: 'Birth Day! Welcome to the world. 7 lb 8 oz, 20 inches.',
    milestones: ['Birth Day'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-1',
    date: '2026-04-04',
    ageMonths: 0.25, // 1 week
    weightKg: 3.32, // 7 lb 5 oz
    notes: '1 week check-in: Feeding well, regaining birth weight.',
  },
  {
    id: 'sample-2',
    date: '2026-04-11',
    ageMonths: 0.5, // 2 weeks
    weightKg: 3.55, // 7 lb 13 oz
    notes: '2-week checkup: Fully surpassed birth weight!',
    isPediatricianVisit: true,
  },
  {
    id: 'sample-3',
    date: '2026-04-25',
    ageMonths: 0.9, // ~4 weeks
    weightKg: 3.95, // 8 lb 11 oz
    notes: 'Steady weekly gain (~0.4 kg every 2 weeks).',
  },
  {
    id: 'sample-4',
    date: '2026-05-02',
    ageMonths: 1.15, // 1 month
    weightKg: 4.40, // 9 lb 11 oz
    heightCm: 54.8, // 21.6 in
    headCircumferenceCm: 37.2,
    notes: '1 month milestone! Beautiful social smiles appearing.',
    milestones: ['First social smile'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-5',
    date: '2026-05-18',
    ageMonths: 1.7, // ~7 weeks
    weightKg: 4.90, // 10 lb 13 oz
    notes: 'Steady steady growth, tracking along the healthy curve.',
  },
  {
    id: 'sample-6',
    date: '2026-06-01',
    ageMonths: 2.1, // 2 months
    weightKg: 5.45, // 12 lb 0 oz
    heightCm: 58.4, // 23.0 in
    headCircumferenceCm: 39.1,
    notes: '2-month checkup: Brave with vaccines! Lifting head 45 degrees in tummy time.',
    milestones: ['Holds head steady during tummy time', 'Tracks faces and objects with eyes'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-7',
    date: '2026-06-18',
    ageMonths: 2.7,
    weightKg: 5.95, // 13 lb 2 oz
    notes: '13-pound milestone reached!',
  },
  {
    id: 'sample-8',
    date: '2026-07-02',
    ageMonths: 3.2,
    weightKg: 6.40, // 14 lb 2 oz
    heightCm: 61.8, // 24.3 in
    notes: '3 months: Chuckling out loud and discovering little hands.',
    milestones: ['Laughs and chuckles out loud'],
  },
  {
    id: 'sample-9',
    date: '2026-07-22',
    ageMonths: 3.8,
    weightKg: 6.80, // 15 lb 0 oz
    notes: '15 pounds! Reaching for dangling toys.',
  },
  {
    id: 'sample-10',
    date: '2026-08-05',
    ageMonths: 4.3, // 4 months
    weightKg: 7.15, // 15 lb 12 oz
    heightCm: 64.6, // 25.4 in
    headCircumferenceCm: 42.0,
    notes: '4-month wellness visit: Strong neck and rolling tummy to back.',
    milestones: ['Rolls tummy to back', 'Reaches out and grasps toys'],
    isPediatricianVisit: true,
  },
  {
    id: 'sample-11',
    date: '2026-08-25',
    ageMonths: 4.9,
    weightKg: 7.50, // 16 lb 8 oz
    notes: 'Gaining smoothly (~0.5 kg every 3 weeks).',
  },
  {
    id: 'sample-12',
    date: '2026-09-15',
    ageMonths: 5.6,
    weightKg: 7.80, // 17 lb 3 oz
    heightCm: 67.2, // 26.5 in
    notes: 'Almost 6 months: Sitting with light tripod hand support.',
    milestones: ['First taste of puree', 'Babbles chains (ba-ba, da-da)'],
  },
  {
    id: 'sample-13',
    date: '2026-10-12',
    ageMonths: 6.5,
    weightKg: 8.15, // 17 lb 15 oz (~18 lbs)
    heightCm: 69.5, // 27.4 in
    headCircumferenceCm: 43.8,
    notes: '6-month checkup: Sitting steadily without hand support, passing toys hand-to-hand!',
    milestones: ['Sits steadily without hand support', 'Transfers toys from one hand to the other'],
    isPediatricianVisit: true,
  },
];
