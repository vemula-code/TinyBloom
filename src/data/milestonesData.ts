export interface MilestoneItem {
  id: string;
  label: string;
  category: 'motor' | 'feeding' | 'social' | 'sleep' | 'teeth';
  monthRange: string;
}

export const COMMON_MILESTONES: MilestoneItem[] = [
  // 0 - 3 months
  { id: 'first_smile', label: 'First social smile', category: 'social', monthRange: '1-2m' },
  { id: 'lifts_head', label: 'Holds head steady during tummy time', category: 'motor', monthRange: '2-3m' },
  { id: 'tracks_faces', label: 'Tracks faces and objects with eyes', category: 'social', monthRange: '1-3m' },

  // 4 - 6 months
  { id: 'rolls_front_back', label: 'Rolls tummy to back', category: 'motor', monthRange: '4-5m' },
  { id: 'rolls_back_front', label: 'Rolls back to tummy', category: 'motor', monthRange: '5-6m' },
  { id: 'first_solid_food', label: 'First taste of solid foods / puree', category: 'feeding', monthRange: '4-6m' },
  { id: 'laughs_giggles', label: 'Laughs and chuckles out loud', category: 'social', monthRange: '3-5m' },
  { id: 'grasps_toys', label: 'Reaches out and grasps toys', category: 'motor', monthRange: '4-5m' },

  // 7 - 9 months (The user's baby is 7 months!)
  { id: 'sits_unsupported', label: 'Sits steadily without hand support', category: 'motor', monthRange: '6-8m' },
  { id: 'first_tooth', label: 'First tooth appeared (bottom incisor)', category: 'teeth', monthRange: '6-8m' },
  { id: 'transfers_objects', label: 'Transfers toys from one hand to the other', category: 'motor', monthRange: '6-7m' },
  { id: 'babbles_consonants', label: 'Babbles chains (ba-ba, da-da, ma-ma)', category: 'social', monthRange: '6-8m' },
  { id: 'eats_finger_foods', label: 'Enjoys soft finger foods & mashes', category: 'feeding', monthRange: '6-8m' },
  { id: 'peek_a_boo', label: 'Plays peek-a-boo and looks for dropped items', category: 'social', monthRange: '7-9m' },
  { id: 'sippy_cup', label: 'Drinks small sips of water from an open/straw cup', category: 'feeding', monthRange: '6-8m' },
  { id: 'army_crawl', label: 'Scoots / army crawls on belly', category: 'motor', monthRange: '7-9m' },
  { id: 'responds_to_name', label: 'Turns and smiles when name is spoken', category: 'social', monthRange: '6-7m' },

  // 9 - 12 months
  { id: 'pulls_to_stand', label: 'Pulls up to standing at furniture', category: 'motor', monthRange: '8-10m' },
  { id: 'pincer_grasp', label: 'Pincer grasp with thumb & pointer finger', category: 'motor', monthRange: '9-11m' },
  { id: 'waves_bye', label: 'Waves bye-bye and claps hands', category: 'social', monthRange: '9-12m' },
  { id: 'first_steps', label: 'First independent walking steps', category: 'motor', monthRange: '11-14m' },
];

export interface SevenMonthGuideSection {
  title: string;
  iconName: string;
  summary: string;
  tips: string[];
}

export const SEVEN_MONTH_PEDIATRIC_GUIDE: SevenMonthGuideSection[] = [
  {
    title: 'Growth & Physical Changes',
    iconName: 'Activity',
    summary: 'Growth velocity naturally tapers slightly between 6–12 months compared to early infancy, averaging 85–140 grams (3–5 oz) per week and ~1.2 cm per month.',
    tips: [
      'Weight doubling has typically occurred by month 5–6; tracking along their individual WHO percentile curve is the gold standard.',
      'Head circumference growth reflects brain expansion—pediatricians look for smooth trajectory along the same percentile channel.',
      'Muscle tone strengthens as core stability allows independent sitting with hands free to play.'
    ]
  },
  {
    title: 'Solid Foods & Nutrition',
    iconName: 'Utensils',
    summary: 'At 7 months, breast milk or formula remains primary, with 2 to 3 complementary solid meals of varied textures introduced daily.',
    tips: [
      'Focus on iron-rich foods (pureed meats, beans, iron-fortified oatmeal) to replenish natural stores.',
      'Introduce safe finger foods: steamed broccoli florets, ripe banana spears, soft avocado chunks, or quartered soft berries.',
      'Offer 2–4 oz of water with meals in an open cup or weighted straw cup to practice oral motor coordination.',
      'Continue introducing top allergens (peanut butter thinned with puree, egg, dairy, sesame) one at a time.'
    ]
  },
  {
    title: 'Sleep & Night Rhythm',
    iconName: 'Moon',
    summary: 'Most 7-month-olds sleep 12–14 total hours daily, with 2 to 3 daytime naps and longer overnight consolidated stretches.',
    tips: [
      'Wake windows typically range from 2 to 3 hours between naps.',
      'A temporary sleep regression around 7 months can happen due to motor development (practicing sitting up in the crib) or teething.',
      'Establish a calming, predictable bedtime sequence (bath, quiet book, feeding, dim lights).'
    ]
  },
  {
    title: 'Pediatrician Visit Checkpoints',
    iconName: 'Stethoscope',
    summary: 'Key topics to discuss with your doctor at the 6-month or 9-month well-child examination.',
    tips: [
      'Review WHO weight, length, and head circumference percentiles on the growth curve.',
      'Fluoride supplementation if tap water is unfluoridated, and brushing newly emerging teeth with a smear of fluoride toothpaste.',
      'Vision and hearing screening responses (babbling consonant sounds, tracking sounds from across the room).',
      'Safety check: baby-proofing as mobility increases (anchoring heavy furniture, baby gates on stairs, socket covers).'
    ]
  }
];
