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
  name: 'Dhruv',
  gender: 'boy',
  birthDate: '2026-03-28',
  birthWeightKg: 3.40, // 7 lb 8 oz
  birthHeightCm: 50.8, // 20 in
  birthHeadCircumferenceCm: 35.0, // 13.78 in
  avatarUrl: DEFAULT_AVATAR,
  notes: 'Born on March 28, 2026. Loving, tall boy (89th percentile height!) exploring sitting, babbling, and purees.',
};

export const DEFAULT_GROWTH_ENTRIES: GrowthEntry[] = [
  {
    id: 'dhruv-0',
    date: '2026-03-28',
    ageMonths: 0,
    weightKg: 3.40, // 7 lb 8 oz (55th %)
    heightCm: 50.8, // 20.0 in (69th %)
    headCircumferenceCm: 35.0,
    notes: 'Birth Day! Welcome to the world Dhruv. 7 lb 8 oz, 20 inches.',
    milestones: ['Birth Day'],
    isPediatricianVisit: true,
  },
  {
    id: 'dhruv-1',
    date: '2026-04-02',
    ageMonths: 0.2, // 5 days
    weightKg: 3.23, // 7 lb 2 oz (35th %)
    heightCm: 52.7, // 20.75 in (85th %)
    headCircumferenceCm: 35.0, // 13.78 in (51st %)
    notes: '5-day newborn checkup. Gaining momentum.',
    isPediatricianVisit: true,
  },
  {
    id: 'dhruv-2',
    date: '2026-04-06',
    ageMonths: 0.3, // 1w 2d
    weightKg: 3.40, // 7 lb 8 oz (38th %)
    notes: '1 week 2 days: Fully back to birth weight!',
  },
  {
    id: 'dhruv-3',
    date: '2026-04-14',
    ageMonths: 0.6, // 2w 3d
    weightKg: 3.69, // 8 lb 2 oz (36th %)
    notes: '2 weeks 3 days: Gaining beautifully.',
  },
  {
    id: 'dhruv-4',
    date: '2026-04-19',
    ageMonths: 0.7, // 3w 1d
    weightKg: 3.77, // 8 lb 5 oz (27th %)
    notes: '3 weeks old check-in.',
  },
  {
    id: 'dhruv-5',
    date: '2026-04-29',
    ageMonths: 1.0, // 1m 1d
    weightKg: 4.31, // 9 lb 8 oz (35th %)
    notes: '1 month milestone! Sweet social smiles appearing.',
    milestones: ['First social smile'],
    isPediatricianVisit: true,
  },
  {
    id: 'dhruv-6',
    date: '2026-05-07',
    ageMonths: 1.3, // 1m 1w 2d
    weightKg: 4.59, // 10 lb 2 oz (34th %)
    notes: 'Over 10 pounds!',
  },
  {
    id: 'dhruv-7',
    date: '2026-05-16',
    ageMonths: 1.6, // 1m 2w 4d
    weightKg: 4.71, // 10 lb 6 oz (23rd %)
    notes: 'Steady steady growth.',
  },
  {
    id: 'dhruv-8',
    date: '2026-05-23',
    ageMonths: 1.8, // 1m 3w 4d
    weightKg: 5.05, // 11 lb 2 oz (29th %)
    notes: 'Passing 11 lbs!',
  },
  {
    id: 'dhruv-9',
    date: '2026-06-03',
    ageMonths: 2.2, // 2m 6d
    weightKg: 5.24, // 11 lb 9 oz (23rd %)
    notes: '2 months old check-in.',
  },
  {
    id: 'dhruv-10',
    date: '2026-06-09',
    ageMonths: 2.4, // 2m 1w 5d
    weightKg: 5.61, // 12 lb 6 oz (33rd %)
    heightCm: 60.5, // 23.82 in (66th %)
    headCircumferenceCm: 39.0, // 15.35 in (27th %)
    notes: '2 month well-child visit. Vaccines done bravely!',
    milestones: ['Holds head steady during tummy time', 'Tracks faces and objects with eyes'],
    isPediatricianVisit: true,
  },
  {
    id: 'dhruv-11',
    date: '2026-06-21',
    ageMonths: 2.8, // 2m 3w 3d
    weightKg: 5.90, // 13 lb 0 oz (32nd %)
    heightCm: 61.5, // 24.2 in (62nd %)
    notes: '13 pounds milestone.',
  },
  {
    id: 'dhruv-12',
    date: '2026-07-15',
    ageMonths: 3.6, // 3m 2w 3d
    weightKg: 6.50, // 6.5 kg = 14 lb 5 oz (37th %)
    heightCm: 63.8, // 25.1 in (66th %)
    notes: '3.5 months: 6.5 kg and over 25 inches tall!',
  },
  {
    id: 'dhruv-13',
    date: '2026-07-29',
    ageMonths: 4.0, // 4m 1d
    weightKg: 6.60, // 6.6 kg = 14 lb 9 oz (29th %)
    notes: '4 months old today! Rolling tummy to back.',
    milestones: ['Rolls tummy to back', 'Reaches out and grasps toys'],
  },
  {
    id: 'dhruv-14',
    date: '2026-08-10',
    ageMonths: 4.4, // 4m 1w 6d
    weightKg: 6.89, // 15 lb 3 oz (33rd %)
    heightCm: 66.5, // 26.2 in (80th %)
    headCircumferenceCm: 43.0, // 43.0 cm (78th %)
    notes: '4 month wellness visit: Tall boy at 80th percentile for length!',
    milestones: ['Laughs and chuckles out loud'],
    isPediatricianVisit: true,
  },
  {
    id: 'dhruv-15',
    date: '2026-09-01',
    ageMonths: 5.1, // 5m 4d
    weightKg: 7.30, // 7.3 kg = 16 lb 1 oz (37th %)
    notes: '5 months old check-in: 7.3 kg.',
  },
  {
    id: 'dhruv-16',
    date: '2026-09-21',
    ageMonths: 5.8, // 5m 3w 3d
    weightKg: 7.80, // 7.8 kg = 17 lb 3 oz (47th %)
    notes: 'Almost 6 months: Gaining strong at 7.8 kg!',
    milestones: ['First taste of solid foods / puree', 'Babbles chains (ba-ba, da-da, ma-ma)'],
  },
  {
    id: 'dhruv-17',
    date: '2026-10-14',
    ageMonths: 6.5, // 6m 2w 2d (~7m)
    weightKg: 7.88, // 17 lb 6 oz (38th %)
    heightCm: 71.1, // 28.0 in (89th % - Long boy!)
    headCircumferenceCm: 44.5, // 44.5 cm (74th %)
    notes: '6.5 month checkup: Height 28 inches (89th percentile!), Head 44.5 cm (74th percentile), Weight 17 lb 6 oz. Sitting up steadily!',
    milestones: ['Sits steadily without hand support', 'Transfers toys from one hand to the other'],
    isPediatricianVisit: true,
  },
];
