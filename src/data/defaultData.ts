import { BabyProfile, GrowthEntry } from '../types/growth';

// Generated portrait asset
export const DEFAULT_AVATAR = '/src/assets/images/baby_portrait_gentle_1792885703662.jpg';
export const HERO_IMAGE = '/src/assets/images/baby_growth_hero_1792885704783.jpg';

export const DEFAULT_PROFILE: BabyProfile = {
  id: 'baby-main',
  name: 'Leo',
  gender: 'boy',
  birthDate: '2026-03-24',
  birthWeightKg: 3.45,
  birthHeightCm: 50.5,
  birthHeadCircumferenceCm: 35.0,
  avatarUrl: DEFAULT_AVATAR,
  notes: 'Born at 39 weeks. Happy, curious little explorer who loves morning babbling and watching trees sway!',
};

export const DEFAULT_GROWTH_ENTRIES: GrowthEntry[] = [
  {
    id: 'entry-0',
    date: '2026-03-24',
    ageMonths: 0,
    weightKg: 3.45,
    heightCm: 50.5,
    headCircumferenceCm: 35.0,
    notes: 'Welcome to the world! Natural birth, healthy APGAR scores 9/10. Sweetest tiny yawn.',
    milestones: ['First day in world'],
    isPediatricianVisit: true,
  },
  {
    id: 'entry-1',
    date: '2026-04-24',
    ageMonths: 1.0,
    weightKg: 4.55,
    heightCm: 55.2,
    headCircumferenceCm: 37.6,
    notes: '1-month checkup. Gaining weight steadily on breast milk! Loves tummy time on daddy’s chest.',
    milestones: ['First social smile', 'Holds head steady during tummy time'],
    isPediatricianVisit: true,
  },
  {
    id: 'entry-2',
    date: '2026-05-24',
    ageMonths: 2.0,
    weightKg: 5.75,
    heightCm: 58.6,
    headCircumferenceCm: 39.4,
    notes: '2-month vaccines done like a champ. Starting to coo with happy vowels and tracks mobile toys.',
    milestones: ['Tracks faces and objects with eyes', 'Laughs and chuckles out loud'],
    isPediatricianVisit: true,
  },
  {
    id: 'entry-3',
    date: '2026-07-24',
    ageMonths: 4.0,
    weightKg: 7.05,
    heightCm: 64.2,
    headCircumferenceCm: 41.8,
    notes: '4-month pediatrician checkup. Doubled birth weight! Reaching for wooden rattle with both hands.',
    milestones: ['Rolls tummy to back', 'Reaches out and grasps toys'],
    isPediatricianVisit: true,
  },
  {
    id: 'entry-4',
    date: '2026-09-24',
    ageMonths: 6.0,
    weightKg: 8.05,
    heightCm: 68.1,
    headCircumferenceCm: 43.5,
    notes: 'Half a year old! Pediatrician gave green light for solids. Tried avocado puree and sweet potato.',
    milestones: ['Rolls back to tummy', 'First taste of solid foods / puree', 'Babbles chains (ba-ba, da-da, ma-ma)'],
    isPediatricianVisit: true,
  },
  {
    id: 'entry-5',
    date: '2026-10-24',
    ageMonths: 7.0,
    weightKg: 8.42,
    heightCm: 69.8,
    headCircumferenceCm: 44.2,
    notes: '7 months today! Sitting without support for long play stretches. First tiny bottom tooth popped through!',
    milestones: ['Sits steadily without hand support', 'First tooth appeared (bottom incisor)', 'Transfers toys from one hand to the other'],
    isPediatricianVisit: false,
  },
];
