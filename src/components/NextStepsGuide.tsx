import React, { useState, useEffect } from 'react';
import { BabyProfile } from '../types/growth';
import { calculateAge } from '../data/whoGrowthStandards';
import {
  Sparkles,
  Stethoscope,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Heart,
  HelpCircle,
  Lightbulb,
  Clock,
  ShieldCheck,
  ChevronRight,
  Layers,
  Smile,
  Activity,
  Award
} from 'lucide-react';

interface NextStepsGuideProps {
  profile: BabyProfile;
}

export interface AgeStageContent {
  id: string;
  range: string;
  ageLabel: string;
  minMonths: number;
  maxMonths: number;
  title: string;
  nextCheckup: string;
  highlight: string;
  milestoneCategories: {
    category: string;
    icon: string;
    items: string[];
  }[];
  playActivities: { title: string; desc: string }[];
  pediatricianTopics: string[];
  checklist: string[];
}

export const UNIVERSAL_AGE_STAGES: AgeStageContent[] = [
  {
    id: 'stage-0-1',
    range: '0 – 1 Month',
    ageLabel: 'Newborn',
    minMonths: 0,
    maxMonths: 1,
    title: 'Newborn Wonder & Gentle Rhythms',
    nextCheckup: '2–3 Day & 2-Week Newborn Well-Check',
    highlight: 'Learning your voice, practicing chest-to-chest tummy time, and regaining birth weight.',
    milestoneCategories: [
      {
        category: 'Physical & Motor',
        icon: '🏃',
        items: [
          'Briefly lifts head when placed on parent’s chest or tummy',
          'Keeps hands in small fists near face',
          'Strong sucking, rooting, and grasp reflexes',
        ],
      },
      {
        category: 'Vision & Social',
        icon: '👀',
        items: [
          'Focuses on faces 8–12 inches away',
          'Startles at loud noises (Moro reflex)',
          'Calms to familiar voices, gentle shushing, and swaddling',
        ],
      },
      {
        category: 'Feeding & Sleep',
        icon: '🍼',
        items: [
          'Feeds 8–12 times per 24 hours (every 2–3 hours)',
          'Regains original birth weight by 10–14 days',
          '6+ wet diapers and regular soft stools daily',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Skin-to-Skin Kangaroo Care',
        desc: 'Place baby tummy-down on your bare chest. Regulates baby temperature, heart rate, and fosters deep bonding.',
      },
      {
        title: 'High-Contrast Tracking',
        desc: 'Show high-contrast black and white cards 8–10 inches from eyes and move them slowly across their field of view.',
      },
      {
        title: 'Gentle Voice Narration',
        desc: 'Talk and sing during diaper changes. Newborns prefer higher-pitched rhythmic parent speech.',
      },
    ],
    pediatricianTopics: [
      'Weight regain milestone and feeding volume adequacy',
      'Safe sleep environment: on back, firm surface, room-sharing without bed-sharing',
      'Umbilical cord stump drying and circumcision healing (if applicable)',
      'Newborn screening test results and vitamin D supplementation (400 IU daily)',
    ],
    checklist: [
      'Document daily feeding times and wet diaper counts',
      'Schedule 2-week and 1-month well-baby visits',
      'Review signs of newborn jaundice (yellowing skin/eyes)',
      'Ensure car seat is installed correctly and rear-facing',
    ],
  },
  {
    id: 'stage-2',
    range: '2 Months',
    ageLabel: '2 Months',
    minMonths: 1,
    maxMonths: 2.5,
    title: 'First Social Smiles & Head Lifts',
    nextCheckup: '2-Month Well-Child Visit',
    highlight: 'Beaming real social smiles, lifting head 45 degrees, and cooing soft vowel sounds.',
    milestoneCategories: [
      {
        category: 'Social & Emotional',
        icon: '💛',
        items: [
          'Smiles responsively when you smile or talk to them',
          'Can briefly self-soothe by sucking on hand or fingers',
          'Looks at you attentively and tracks your face as you move',
        ],
      },
      {
        category: 'Motor & Movement',
        icon: '🏃',
        items: [
          'Lifts head and chest 45° during tummy time',
          'Makes smoother movements with arms and legs',
          'Opens hands briefly from fists',
        ],
      },
      {
        category: 'Speech & Hearing',
        icon: '🗣️',
        items: [
          'Coos with sweet vowel sounds ("ooh", "aah")',
          'Turns head toward familiar sounds and voices',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Conversational Echoes',
        desc: 'When baby coos, smile warmly and echo the exact sound back. Teaches turn-taking conversational rhythm.',
      },
      {
        title: 'Daily Tummy Time Fun',
        desc: 'Practice 3–5 minutes of tummy time, 3 times a day. Place a rolled towel under chest if they get tired.',
      },
      {
        title: 'Soft Wrist Rattles',
        desc: 'Place lightweight soft rattles on booties or wrists so baby learns their kicks create fun sounds.',
      },
    ],
    pediatricianTopics: [
      '2-Month routine immunizations (DTaP, IPV, Hib, PCV, Rotavirus, Hep B)',
      'Tummy time tolerance and neck strength progression',
      'Nighttime sleep intervals and colic/gas soothing techniques',
      'Postpartum mental health check-in for parents',
    ],
    checklist: [
      'Pack infant acetaminophen dosage chart provided by pediatrician',
      'Bring vaccination card',
      'Note daytime nap lengths and nighttime sleep stretch',
    ],
  },
  {
    id: 'stage-3',
    range: '3 Months',
    ageLabel: '3 Months',
    minMonths: 2.5,
    maxMonths: 3.5,
    title: 'Hands to Mouth & Curious Coos',
    nextCheckup: 'Pre-4 Month Wellness Check',
    highlight: 'Reaching toward dangling toys, bringing hands together, and babbling with delighted squeals.',
    milestoneCategories: [
      {
        category: 'Hands & Motor',
        icon: '🖐️',
        items: [
          'Brings hands together in front of body and into mouth',
          'Reaches out and swipes at dangling play-gym toys',
          'Holds head steady when supported upright in your arms',
        ],
      },
      {
        category: 'Communication',
        icon: '🗣️',
        items: [
          'Squeals with delight and makes varied pitch sounds',
          'Smiles at siblings, parents, and friendly faces',
          'Shows excitement by kicking legs and waving arms',
        ],
      },
      {
        category: 'Sensory',
        icon: '✨',
        items: [
          'Tracks objects through a full 180-degree semi-circle',
          'Enjoys listening to music and rhythmic lullabies',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Play Gym Reach & Bat',
        desc: 'Lay baby under a soft play arch with textured rings. Reaching coordinates binocular vision and arm muscles.',
      },
      {
        title: 'Aeroplane Lifts',
        desc: 'Lie on your back with knees bent; place baby tummy-down on your shins and gently sway. Strengthens core balance.',
      },
      {
        title: 'Sensory Texture Touch',
        desc: 'Gently stroke baby’s palms with silk, velvet, cotton, and smooth wood.',
      },
    ],
    pediatricianTopics: [
      'Head shape check (preventing positional plagiocephaly with varied head positioning)',
      'Drooling increase (normal salivary gland development, not always immediate teeth!)',
      'Sleep consolidation and self-soothing behaviors',
    ],
    checklist: [
      'Check play-gym for secure attachments',
      'Rotate baby’s head position in crib nightly',
      'Take 3-month milestone photos for memory book',
    ],
  },
  {
    id: 'stage-4',
    range: '4 Months',
    ageLabel: '4 Months',
    minMonths: 3.5,
    maxMonths: 4.5,
    title: 'Rolling, Belly Laughs & 4-Mo Checkup',
    nextCheckup: '4-Month Well-Child Visit',
    highlight: 'Rolling from tummy to back, grasping rattles firmly, and chuckling with real belly laughs.',
    milestoneCategories: [
      {
        category: 'Gross Motor',
        icon: '🏃',
        items: [
          'Pushes up on elbows or straight arms during tummy time',
          'Rolls over from tummy to back (and starts practicing back to tummy)',
          'Holds head completely steady without wobbling when sitting supported',
        ],
      },
      {
        category: 'Fine Motor & Hands',
        icon: '🖐️',
        items: [
          'Grasps a rattle and shakes it intentionally',
          'Uses both hands to explore toys and guide items to mouth',
        ],
      },
      {
        category: 'Social & Cognitive',
        icon: '😄',
        items: [
          'Laughs out loud when tickled or during peek-a-boo',
          'Expresses curiosity, boredom, or delight through distinct vocal tones',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Rolling Practice with Toys',
        desc: 'Place an enticing colorful toy just out of reach on their side to encourage rotating the hips and rolling over.',
      },
      {
        title: 'Baby Mirror Wonder',
        desc: 'Position an unbreakable mirror in front of baby during tummy time. Watch them smile at their reflection.',
      },
      {
        title: 'Gentle Bouncing Rhythms',
        desc: 'Hold baby supported around the ribs and let their feet touch your lap or floor with gentle bouncing.',
      },
    ],
    pediatricianTopics: [
      '4-Month vaccine boosters (DTaP, IPV, Hib, PCV, Rotavirus)',
      'Readiness signs for solid foods (usually recommended at around 6 months)',
      '4-month sleep regression (shifting into adult sleep cycles)',
      'Weight and length percentile curve trajectories',
    ],
    checklist: [
      'Lower crib mattress if baby is showing rolling or pushing up mastery',
      'Stop swaddling immediately once baby begins attempting to roll',
      'Prepare list of questions for 4-month checkup',
    ],
  },
  {
    id: 'stage-5',
    range: '5 Months',
    ageLabel: '5 Months',
    minMonths: 4.5,
    maxMonths: 5.5,
    title: 'Rolling Mastery & High-Chair Curiosity',
    nextCheckup: 'Pre-6 Month Milestone Prep',
    highlight: 'Rolling both ways, grabbing their own feet, and watching every bite you eat at the dinner table.',
    milestoneCategories: [
      {
        category: 'Motor Freedom',
        icon: '🏃',
        items: [
          'Rolls from front to back and back to front smoothly',
          'Grabs toes and brings feet up to mouth with glee',
          'Supports almost full body weight on legs when held upright',
        ],
      },
      {
        category: 'Feeding Curiosity',
        icon: '🥣',
        items: [
          'Stares intently at family members eating, opens mouth, and mimics chewing',
          'Shows diminishing tongue-thrust reflex in preparation for purees',
        ],
      },
      {
        category: 'Language',
        icon: '🗣️',
        items: [
          'Blows raspberries, creates bubbles with saliva, and plays with lip sounds ("m", "b")',
          'Responds to hearing their own name being called',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Foot Grasping Games',
        desc: 'Strip baby to diaper on a soft blanket. Let them explore kicking, catching their feet, and rolling.',
      },
      {
        title: 'Singing Action Rhymes',
        desc: 'Sing "Pat-a-Cake" or "The Itsy Bitsy Spider" while gently moving baby’s hands together.',
      },
      {
        title: 'Dinner Table Inclusion',
        desc: 'Sit baby in high chair (with towel roll support if needed) at the dinner table with a clean silicone spoon to hold.',
      },
    ],
    pediatricianTopics: [
      'Readiness milestones for first foods (head control, upright sitting, tongue thrust loss)',
      'Choosing between purees, mashed foods, or baby-led weaning solids',
      'Teething signs: swollen gums, biting on hard toys, excessive drool',
    ],
    checklist: [
      'Sanitize high chair and order soft silicone baby spoons',
      'Ensure floor play space is clean and clear of small choke hazards',
      'Baby-proof low drawers and dangling wires',
    ],
  },
  {
    id: 'stage-6',
    range: '6 Months',
    ageLabel: '6 Months',
    minMonths: 5.5,
    maxMonths: 6.5,
    title: 'Sitting Supported, First Solids & 6-Mo Visit',
    nextCheckup: '6-Month Well-Child Visit',
    highlight: 'Sitting with minimal tripod support, tasting first single-ingredient foods, and first tooth buds.',
    milestoneCategories: [
      {
        category: 'Gross Motor',
        icon: '🏃',
        items: [
          'Sits with hand support ("tripod sit") and brief unsupported balance',
          'Pivots in circles on tummy to reach favorite toys',
          'Passes toys from one hand to the other',
        ],
      },
      {
        category: 'First Foods & Solids',
        icon: '🥑',
        items: [
          'Ready for single-ingredient nutrient-rich purees or soft spears (sweet potato, avocado, oatmeal, banana)',
          'Takes sips of water from an open training cup or straw cup',
          'Shows clear signs of fullness (turns head away, closes mouth)',
        ],
      },
      {
        category: 'Social & Emotional',
        icon: '💛',
        items: [
          'Recognizes familiar faces and begins showing stranger awareness',
          'Responds to emotional tones in voice (gentle vs stern)',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Pillow-Fort Sitting',
        desc: 'Place a U-shaped nursing pillow behind baby while they sit on the rug playing with soft blocks.',
      },
      {
        title: 'Messy Taste Exploration',
        desc: 'Offer soft steamed sweet potato or mashed avocado on the high chair tray. Let them touch, smell, and mouth the food.',
      },
      {
        title: 'Object Transfer Practice',
        desc: 'Hand baby a block in one hand, then offer a second block. Watch them transfer the first block to accept the second.',
      },
    ],
    pediatricianTopics: [
      '6-Month vaccines and annual seasonal influenza vaccine',
      'Iron-rich solid food introduction (meat purees, fortified infant cereal, beans)',
      'Early allergen introduction (peanut butter thinned with breastmilk/formula, egg)',
      'Fluoride supplementation if tap water lacks adequate fluoride',
    ],
    checklist: [
      'Introduce one new single-ingredient food every 2–3 days to monitor allergies',
      'Clean baby gums/teeth daily with a soft silicone fingertip brush',
      'Prepare 6-month pediatrician questions',
    ],
  },
  {
    id: 'stage-7',
    range: '7 Months',
    ageLabel: '7 Months',
    minMonths: 6.5,
    maxMonths: 7.5,
    title: 'Independent Sitting, Two Lower Teeth & Consonants',
    nextCheckup: 'Mid-Year Growth Milestone Check',
    highlight: 'Sitting sturdy without hands, two cute lower central incisors emerging, and babbling "ba-ba" & "da-da".',
    milestoneCategories: [
      {
        category: 'Motor & Sitting',
        icon: '🏃',
        items: [
          'Sits independently without using hands for balance, freeing hands to play',
          'Pushes up onto hands and knees into bear crawl position or rocking back and forth',
          'Reaches across midline to grab objects with opposite hand',
        ],
      },
      {
        category: 'Teething & Speech',
        icon: '🦷',
        items: [
          'Two lower central incisor teeth commonly erupting',
          'Chains consonant babbles together: "ba-ba-ba", "da-da", "ma-ma"',
          'Uses voice to express happiness, eagerness, and mild protest',
        ],
      },
      {
        category: 'Cognitive',
        icon: '🧠',
        items: [
          'Understands object permanence: looks for dropped toys that fall to the floor',
          'Tracks moving balls across the room',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Independent Sitting Play',
        desc: 'Place several toys in a semi-circle around baby while sitting. Reaching in all directions builds core stability.',
      },
      {
        title: 'Chilled Teether Soothers',
        desc: 'Offer safe chilled silicone teethers or frozen breastmilk/puree popsicles to soothe tender emerging gums.',
      },
      {
        title: 'Drop & Find Game',
        desc: 'Drop a soft toy over high chair edge and enthusiastically say "Where did it go?". Helps baby learn gravity and permanence.',
      },
    ],
    pediatricianTopics: [
      'Teething pain management (safe cooling teethers vs avoiding numbing gels)',
      'Solid food variety expansion (texture progression from smooth purees to soft lumps)',
      'Sitting stability and pre-crawling movement styles (army crawl, scooting)',
    ],
    checklist: [
      'Brush new teeth twice daily with a grain-of-rice smear of fluoride toothpaste',
      'Ensure heavy floor lamps and televisions are securely anchored',
      'Record milestone date of first tooth in TinyBloom notes',
    ],
  },
  {
    id: 'stage-8',
    range: '8 Months',
    ageLabel: '8 Months',
    minMonths: 7.5,
    maxMonths: 8.5,
    title: 'Pincer Grasp, Peek-a-boo & Separation Warmth',
    nextCheckup: 'Pre-9 Month Checkup',
    highlight: 'Using thumb and pointer finger to pick up cheerios, playing peek-a-boo, and army crawling.',
    milestoneCategories: [
      {
        category: 'Fine Motor',
        icon: '🖐️',
        items: [
          'Develops crude pincer grasp (pads of thumb and index finger)',
          'Claps hands together and bangs two blocks together with glee',
          'Releases objects intentionally into open containers',
        ],
      },
      {
        category: 'Mobility',
        icon: '🏃',
        items: [
          'Army crawls or scoots forward across carpets',
          'Transitions smoothly between sitting and lying on tummy',
          'Pulls up onto furniture from knees',
        ],
      },
      {
        category: 'Social Awareness',
        icon: '💛',
        items: [
          'Plays peek-a-boo enthusiastically, pulling cloth off their own face',
          'Shows clear preference for primary caregivers and clings when strangers approach',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Finger Food Pincer Practice',
        desc: 'Scatter puffed grain cereals or soft steamed pea halves on high chair tray. Great workout for tiny fingers.',
      },
      {
        title: 'Stack & Knock Down',
        desc: 'Build tall towers of soft cups or foam blocks. Let baby giggle as they gleefully knock them down.',
      },
      {
        title: 'Cloth Peek-a-Boo',
        desc: 'Drape a lightweight muslin blanket over a favorite toy or your face. Watch baby eagerly pull it away.',
      },
    ],
    pediatricianTopics: [
      'Normal separation anxiety and establishing confident goodbye routines',
      'Finger foods and choking hazards (avoid whole grapes, popcorn, hot dogs, hard carrots)',
      'Transitioning to 2 consistent daytime naps',
    ],
    checklist: [
      'Lower crib mattress to lowest setting once baby starts pulling up on rails',
      'Install baby gates at top and bottom of all staircases',
      'Store all cleaning chemicals and medications in locked cabinets',
    ],
  },
  {
    id: 'stage-9',
    range: '9 Months',
    ageLabel: '9 Months',
    minMonths: 8.5,
    maxMonths: 9.5,
    title: 'Crawling, Pulling Up & 9-Month Visit',
    nextCheckup: '9-Month Well-Child Visit',
    highlight: 'Hands-and-knees crawling, pulling up to stand at the couch, and waving hello.',
    milestoneCategories: [
      {
        category: 'Gross Motor',
        icon: '🏃',
        items: [
          'Crawls on all fours with cross-body coordination',
          'Pulls to stand holding onto furniture or parent’s pants',
          'Can lower self down from standing with control (or safe plop)',
        ],
      },
      {
        category: 'Language & Gestures',
        icon: '🗣️',
        items: [
          'Understands the word "No" (even if they briefly pause and do it anyway!)',
          'Points to objects with index finger to show interest',
          'Waves "bye-bye" with hand',
        ],
      },
      {
        category: 'Cognitive',
        icon: '🧠',
        items: [
          'Searches actively for toys completely hidden under blankets',
          'Explores container physics (taking items out and putting them back in)',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Living Room Obstacle Course',
        desc: 'Place cushions, rolled yoga mats, and cardboard boxes on carpet for baby to climb over and navigate.',
      },
      {
        title: 'In-and-Out Basket Play',
        desc: 'Fill an open laundry basket with safe toys. Baby will love dumping them out and placing them back in.',
      },
      {
        title: 'Point & Name Board Books',
        desc: 'Point to animals, cars, and babies in thick cardboard books. Name each one with exaggerated sounds.',
      },
    ],
    pediatricianTopics: [
      '9-Month developmental screening questionnaire (ASQ-3)',
      'Hemoglobin / anemia blood prick check and lead exposure screening',
      'Transition from purees to soft family table foods',
      'Tooth brushing routines with tiny smear of fluoride toothpaste',
    ],
    checklist: [
      'Anchor tall dressers, TV stands, and bookshelves to wall studs',
      'Test smoke detectors and ensure outlet covers are on all sockets',
      'Prepare questions for 9-month well-child examination',
    ],
  },
  {
    id: 'stage-10-11',
    range: '10 – 11 Months',
    ageLabel: '10–11 Months',
    minMonths: 9.5,
    maxMonths: 11.5,
    title: 'Cruising Along Furniture & Waving Bye',
    nextCheckup: 'Pre-1 Year Milestone Check',
    highlight: 'Cruising along coffee tables, standing balanced for a few seconds alone, and saying "mama" / "dada".',
    milestoneCategories: [
      {
        category: 'Mobility & Cruise',
        icon: '🏃',
        items: [
          'Cruises smoothly sideways holding onto coffee table or couch',
          'Stands alone for 2–5 seconds without holding on',
          'Walks forward when holding both of your hands',
        ],
      },
      {
        category: 'Communication',
        icon: '🗣️',
        items: [
          'Says specific "Mama" or "Dada" to the correct parent',
          'Shakes head "no" and waves "bye-bye"',
          'Imitates parent coughs, tongue clicks, and funny expressions',
        ],
      },
      {
        category: 'Self-Care & Meals',
        icon: '🥣',
        items: [
          'Drinks water from an open cup held by parent or straw cup',
          'Holds finger foods with precision pincer grasp (tips of fingers)',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Two-Couch Bridge Cruise',
        desc: 'Position two sturdy chairs or cushions a few inches apart so baby practices letting go of one to reach the other.',
      },
      {
        title: 'Music & Clapping Songs',
        desc: 'Sing "If You’re Happy and You Know It" and encourage clapping hands and stomping tiny feet.',
      },
      {
        title: 'Hide the Sound',
        desc: 'Hide a ticking timer or soft music box under a towel and let baby crawl around tracking the auditory clue.',
      },
    ],
    pediatricianTopics: [
      'Footwear advice: barefoot is best indoors for balance and foot arch development!',
      'Transition plan from infant formula to pasteurized whole cow’s milk at 12 months',
      'Sleep transitions and maintaining consistent bedtime wind-down rituals',
    ],
    checklist: [
      'Plan 1st birthday well-child visit appointment',
      'Schedule first pediatric dental appointment (recommended by 1st birthday)',
      'Check shoe sizing (wide flexible barefoot-style shoes for outdoor walking)',
    ],
  },
  {
    id: 'stage-12',
    range: '12 Months (1 Year)',
    ageLabel: '12 Months · 1 Year',
    minMonths: 11.5,
    maxMonths: 14,
    title: 'First Steps, Birthday & Whole Milk',
    nextCheckup: '12-Month (1-Year) Well-Child Visit',
    highlight: 'Taking triumphant first independent steps, celebrating 1 year of life, and transitioning to family meals.',
    milestoneCategories: [
      {
        category: 'Gross Motor',
        icon: '🚶',
        items: [
          'Takes first wobbly independent steps or walks confidently',
          'Stands up from the middle of the floor without pulling on furniture',
          'Bends over from standing to pick up a toy and stands back up',
        ],
      },
      {
        category: 'Language & Words',
        icon: '🗣️',
        items: [
          'Has 1–3 clear words with meaning (e.g., "baba", "ball", "dog", "mama")',
          'Understands simple one-step verbal requests ("Come here", "Give to me")',
          'Uses pointing and looking to share attention with parents',
        ],
      },
      {
        category: 'Nutrition & Daily Life',
        icon: '🥛',
        items: [
          'Transitions from infant formula/breastmilk to whole cow’s milk (16–20 oz max/day) or fortified soy alternative',
          'Eats 3 family meals plus 2 healthy snacks daily at table',
          'Weans off bottles in favor of straw or open cups',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Push-Cart Walking Fun',
        desc: 'Offer a weighted wooden push-wagon or walker toy. Boosts walking confidence and upright posture.',
      },
      {
        title: 'Sensory Water Table Splashing',
        desc: 'Fill a shallow plastic tub with 1 inch of warm water and floating plastic cups on the porch or lawn.',
      },
      {
        title: 'Simple Shape & Ring Stacking',
        desc: 'Practice sliding 3–4 colorful rings onto a post. Celebrates hand-eye coordination milestones.',
      },
    ],
    pediatricianTopics: [
      '12-Month vaccines (MMR, Varicella, Hep A, PCV booster, Hib booster)',
      'WHO screen-time recommendation: zero recreational screen time for children under 2',
      'Whole milk volume limits (excess cow’s milk can cause iron-deficiency anemia)',
      '1-year growth chart audit: weight-for-age, length-for-age, and head circumference',
    ],
    checklist: [
      'Complete 1-year well-child examination and print TinyBloom report for doctor',
      'Replace bottles with straw cups and open cups',
      'Ensure family car seat remains rear-facing (AAP recommends rear-facing as long as possible, up to seat limits)',
    ],
  },
  {
    id: 'stage-15',
    range: '15 Months',
    ageLabel: '15 Months',
    minMonths: 14,
    maxMonths: 17,
    title: 'Climbing, Stacking Blocks & 5+ Words',
    nextCheckup: '15-Month Well-Child Visit',
    highlight: 'Climbing onto couches, stacking 2–3 wooden blocks, using spoons, and showing affection with hugs.',
    milestoneCategories: [
      {
        category: 'Motor & Climbing',
        icon: '🏃',
        items: [
          'Walks smoothly without holding on, rarely falling',
          'Attempts to run with stiff legs and wide stance',
          'Climbs onto low chairs, couches, and hearths',
        ],
      },
      {
        category: 'Fine Motor',
        icon: '🖐️',
        items: [
          'Stacks a tower of 2 to 3 wooden blocks',
          'Scribbles spontaneously with large crayons',
          'Drinks from a cup and attempts self-feeding with spoon',
        ],
      },
      {
        category: 'Social & Speech',
        icon: '💛',
        items: [
          'Speaks 3 to 5 clear words plus jargon conversation',
          'Shows affection with hugs, kisses, or patting parent gently',
          'Points to body parts when asked ("Where is your nose?")',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Crayon Scribble Mural',
        desc: 'Tape a huge sheet of brown butcher paper to the floor. Let toddler scribble freely with chubby beeswax crayons.',
      },
      {
        title: 'Soft Foam Step Climbing',
        desc: 'Create safe climbing courses using firm cushions and foam toddler stairs.',
      },
      {
        title: 'Pretend Play with Stuffed Animals',
        desc: 'Tuck a teddy bear into a small blanket and offer a toy spoon to "feed" the bear.',
      },
    ],
    pediatricianTopics: [
      '15-Month booster immunizations (DTaP booster)',
      'Picky eating phases and honoring toddler fullness cues',
      'Tantrum management: calm co-regulation and maintaining firm gentle boundaries',
    ],
    checklist: [
      'Store all small coin batteries and magnets in locked high areas',
      'Practice regular hand-washing before meals and after park play',
      'Verify rear-facing car seat height and weight limits',
    ],
  },
  {
    id: 'stage-18',
    range: '18 Months (1.5 Years)',
    ageLabel: '18 Months',
    minMonths: 17,
    maxMonths: 21,
    title: 'Word Explosion, Running & 18-Mo Visit',
    nextCheckup: '18-Month Well-Child Visit (Autism M-CHAT Screening)',
    highlight: 'Speaking 10–20 words, walking up stairs holding hands, eating with a spoon, and dancing to music.',
    milestoneCategories: [
      {
        category: 'Language Explosion',
        icon: '🗣️',
        items: [
          'Speaks 10 to 20+ words with meaning',
          'Points to show you something interesting across the room',
          'Understands simple multi-word phrases ("Put your shoes on")',
        ],
      },
      {
        category: 'Gross Motor',
        icon: '🏃',
        items: [
          'Runs confidently and stops without falling',
          'Kicks a large ball forward',
          'Walks up stairs with one hand held by parent',
        ],
      },
      {
        category: 'Fine Motor & Pretend',
        icon: '🧸',
        items: [
          'Stacks towers of 4 to 6 blocks',
          'Turns pages of a book one or two at a time',
          'Enjoys pretend play: pretending to talk on a toy phone or brush hair',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Ball Kick & Chase',
        desc: 'Kick a soft lightweight soccer ball across grass. Encourages single-leg balance and motor planning.',
      },
      {
        title: 'Sensory Sorting with Cups',
        desc: 'Sort large colorful pom-poms or wooden rings into matching colored bowls.',
      },
      {
        title: 'Interactive Action Songs',
        desc: 'Dance to "Head, Shoulders, Knees and Toes" together. Connects body part vocabulary to joyful movement.',
      },
    ],
    pediatricianTopics: [
      '18-Month formal autism screening (M-CHAT-R/F questionnaire)',
      'Speech milestone review: joint attention, pointing, and vocabulary count',
      'Hep A booster vaccination and dental checkup reminder',
      'Transitioning from 2 naps down to 1 afternoon nap',
    ],
    checklist: [
      'Complete M-CHAT developmental questionnaire before visit',
      'Review toddler sleep schedule (11–14 hours per 24 hours including afternoon nap)',
      'Note any food sensitivities or texture aversions',
    ],
  },
  {
    id: 'stage-24',
    range: '24 Months (2 Years)',
    ageLabel: '24 Months · 2 Years',
    minMonths: 21,
    maxMonths: 27,
    title: '2-Word Sentences, Jumping & Toddler Autonomy',
    nextCheckup: '24-Month (2-Year) Well-Child Visit',
    highlight: 'Speaking 50+ words, combining 2 words ("more milk", "big truck"), jumping with both feet off the floor.',
    milestoneCategories: [
      {
        category: 'Language & Grammar',
        icon: '🗣️',
        items: [
          'Uses 50+ single words consistently',
          'Combines 2 words into phrases: "more juice", "daddy go", "big car"',
          'Family understands 50% or more of toddler’s speech',
        ],
      },
      {
        category: 'Gross Motor',
        icon: '🏃',
        items: [
          'Jumps off the ground with both feet simultaneously',
          'Walks up and down stairs holding railing (two feet per step)',
          'Throws a ball overhand with coordination',
        ],
      },
      {
        category: 'Cognitive & Independence',
        icon: '🧠',
        items: [
          'Sorts shapes and colors into matching categories',
          'Follows two-step instructions ("Pick up the block and put it in the box")',
          'Shows strong desire for autonomy: "Me do it!"',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Playdough Sculpting & Rolling',
        desc: 'Roll, squish, and cut non-toxic playdough with plastic cookie cutters. Strengthens finger arches for writing.',
      },
      {
        title: 'Chalk Hopscotch & Jumping',
        desc: 'Draw circles on the driveway. Practice jumping with two feet into each circle.',
      },
      {
        title: 'Dress-Up & Hat Play',
        desc: 'Keep a bin of old hats, scarves, and soft shoes for dress-up pretend adventures.',
      },
    ],
    pediatricianTopics: [
      '2-Year physical exam, BMI calculation, and growth velocity review',
      'Second round autism screening and speech clarity check',
      'Screen time boundaries (educational co-viewing maximum 1 hr/day)',
      'Lead and lipid screening based on family risk factors',
    ],
    checklist: [
      'Review transition to toddler bed if child attempts climbing out of crib',
      'Transition from whole milk to 1% or skim milk as recommended by pediatrician',
      'Print complete 2-year TinyBloom growth history report',
    ],
  },
  {
    id: 'stage-30',
    range: '30 Months (2.5 Years)',
    ageLabel: '30 Months · 2.5 Years',
    minMonths: 27,
    maxMonths: 33,
    title: 'Potty Readiness, Pretend Play & Storytelling',
    nextCheckup: '30-Month Well-Child Visit',
    highlight: 'Expressing feelings with words, recognizing colors, showing potty interest, and jumping forward.',
    milestoneCategories: [
      {
        category: 'Language & Emotion',
        icon: '🗣️',
        items: [
          'Speaks in 3-word sentences ("I want cookie", "Doggy is running")',
          'Uses pronouns like "I", "me", and "you"',
          'Labels basic emotions: happy, sad, angry, sleepy',
        ],
      },
      {
        category: 'Toilet & Self-Help',
        icon: '🚽',
        items: [
          'Tells you when diaper is wet or soiled',
          'Shows interest in potty chair, flushing, and pulling pants up/down',
          'Washes and dries hands with supervision',
        ],
      },
      {
        category: 'Motor & Play',
        icon: '🎨',
        items: [
          'Builds block towers of 8 or more blocks',
          'Balances on one foot for 1 to 2 seconds',
          'Draws vertical and horizontal lines and circles',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Pretend Kitchen Cooking',
        desc: 'Stirring water in pots with wooden spoons, serving imaginary soup to stuffed animals.',
      },
      {
        title: 'Color Scavenger Hunt',
        desc: 'Say "Find me something blue!" and search around the playroom together for blue items.',
      },
      {
        title: 'Outdoor Tricycle / Balance Bike',
        desc: 'Introduce a low 3-wheel balance bike or tricycle with helmet to practice steering.',
      },
    ],
    pediatricianTopics: [
      '30-Month general developmental and language screening',
      'Potty training readiness and gentle non-pressured strategies',
      'Sleep hygiene: eliminating night awakenings and maintaining nap time',
    ],
    checklist: [
      'Read fun potty-training picture books together',
      'Schedule routine 6-month pediatric dentist cleaning',
      'Practice putting on slip-on shoes independently',
    ],
  },
  {
    id: 'stage-36',
    range: '36 Months (3 Years)',
    ageLabel: '36 Months · 3 Years',
    minMonths: 33,
    maxMonths: 48,
    title: 'Full Sentences, Tricycle Riding & Preschool Friends',
    nextCheckup: '3-Year Annual Well-Child Visit',
    highlight: 'Speaking in full sentences, pedaling a tricycle, understanding sharing with friends, and dressing with help.',
    milestoneCategories: [
      {
        category: 'Conversational Speech',
        icon: '🗣️',
        items: [
          'Speaks in full 4–5 word sentences; strangers understand 75% or more',
          'Asks constant curious questions: "Why?", "What is that?", "Where are we going?"',
          'Knows full name, age, and gender',
        ],
      },
      {
        category: 'Gross Motor Agility',
        icon: '🚴',
        items: [
          'Pedals a 3-wheel tricycle or balance bike smoothly',
          'Climbs jungle gym ladders and slides down safely',
          'Catches a large ball with both hands against chest',
        ],
      },
      {
        category: 'Social & Emotional',
        icon: '💛',
        items: [
          'Plays cooperatively with other children (sharing, taking turns)',
          'Shows empathy when seeing a friend cry',
          'Dresses and undresses self with minimal assistance (except tricky buttons/zippers)',
        ],
      },
    ],
    playActivities: [
      {
        title: 'Cardboard Box Fort Castle',
        desc: 'Turn a refrigerator box into a rocket ship or castle with washable markers and flashlights.',
      },
      {
        title: 'Safety Scissors & Paper Snips',
        desc: 'Let toddler practice cutting strips of colorful paper with blunt plastic safety scissors.',
      },
      {
        title: 'Story Acting & Role Play',
        desc: 'Act out fairy tales (Goldilocks or Three Little Pigs) using funny voices and body movements.',
      },
    ],
    pediatricianTopics: [
      '3-Year physical, vision chart screening, and hearing checks',
      'Blood pressure screening (starts routinely at age 3)',
      'Preschool readiness, emotional regulation, and social friendships',
      'Dental oral health, brushing twice daily with pea-sized fluoride toothpaste',
    ],
    checklist: [
      'Schedule 3-year annual well-child appointment',
      'Practice eye-chart matching games (E chart or animal shapes) before vision check',
      'Celebrate 3 magnificent years of growth and cherish every single milestone!',
    ],
  },
];

export const NextStepsGuide: React.FC<NextStepsGuideProps> = ({ profile }) => {
  const age = calculateAge(profile.birthDate);
  const currentMonths = age.exactMonths;

  // Find active stage based on baby's age
  const matchedStageIndex = UNIVERSAL_AGE_STAGES.findIndex(
    (s) => currentMonths >= s.minMonths && currentMonths < s.maxMonths
  );
  
  const initialIndex = matchedStageIndex >= 0 ? matchedStageIndex : 6; // default around 7 months
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(initialIndex);
  const [activeTab, setActiveTab] = useState<'milestones' | 'play' | 'pediatrician' | 'questions'>('milestones');

  const stage = UNIVERSAL_AGE_STAGES[selectedStageIdx] || UNIVERSAL_AGE_STAGES[0];

  // Local checklist saved to device
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_completed_milestones');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheck = (itemId: string) => {
    setCompletedItems((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem('tinybloom_completed_milestones', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Local doctor questions stored on device
  const [questions, setQuestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_doctor_questions');
      return saved
        ? JSON.parse(saved)
        : [
            `How is ${profile.name}’s weight and length trajectory progressing on the WHO curve?`,
            'Are there any nutritional adjustments recommended for this age?',
            'What upcoming motor milestones should we encourage over the next few months?',
          ];
    } catch {
      return [];
    }
  });

  const [newQuestionText, setNewQuestionText] = useState('');

  const addQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const next = [...questions, newQuestionText.trim()];
    setQuestions(next);
    setNewQuestionText('');
    try {
      localStorage.setItem('tinybloom_doctor_questions', JSON.stringify(next));
    } catch (err) {
      console.error(err);
    }
  };

  const removeQuestion = (idx: number) => {
    const next = questions.filter((_, i) => i !== idx);
    setQuestions(next);
    try {
      localStorage.setItem('tinybloom_doctor_questions', JSON.stringify(next));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Age Selector */}
      <div className="bg-white dark:bg-[#1D241F] rounded-3xl p-5 sm:p-6 border border-[var(--color-primary,#91A98B)]/30 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Universal Developmental Journey · 0 to 3 Years</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-text-main,#303832)]">
              {profile.name}’s Next Steps & Milestones
            </h2>
            <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] mt-0.5">
              Currently <strong className="text-[var(--color-text-main,#303832)]">{age.displayStr} old</strong>. Explore milestones from newborn up to 36 months.
            </p>
          </div>

          {/* Jump to current age button */}
          {matchedStageIndex >= 0 && matchedStageIndex !== selectedStageIdx && (
            <button
              type="button"
              onClick={() => setSelectedStageIdx(matchedStageIndex)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary,#91A98B)] hover:opacity-95 transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
            >
              <span>📍 Jump to {profile.name}’s Current Stage</span>
            </button>
          )}
        </div>

        {/* Horizontal Age Scroller (0 to 36 Months) */}
        <div className="mt-5 pt-4 border-t border-[var(--color-primary,#91A98B)]/20">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {UNIVERSAL_AGE_STAGES.map((s, idx) => {
              const isSelected = idx === selectedStageIdx;
              const isCurrent = idx === matchedStageIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-[var(--color-primary,#91A98B)] text-white border-[var(--color-primary,#91A98B)] shadow-2xs scale-102'
                      : isCurrent
                      ? 'bg-[var(--color-primary,#91A98B)]/15 border-[var(--color-primary,#91A98B)] text-[var(--color-primary-dark,#3D5939)]'
                      : 'bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-[var(--color-primary,#91A98B)]/20 text-[var(--color-text-muted,#6E7B6C)] hover:bg-[var(--color-primary,#91A98B)]/10'
                  }`}
                >
                  <span>{s.ageLabel}</span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Current Age" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Stage Detail Card */}
      <div className="bg-white dark:bg-[#1D241F] rounded-3xl p-5 sm:p-6 border border-[var(--color-primary,#91A98B)]/30 shadow-2xs space-y-6">
        {/* Stage Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-primary,#91A98B)]/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] bg-[var(--color-primary,#91A98B)]/20 px-2.5 py-0.5 rounded-full">
                {stage.range}
              </span>
              <span className="text-xs text-[var(--color-text-muted,#6E7B6C)] font-medium">
                {stage.nextCheckup}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-[var(--color-text-main,#303832)]">
              {stage.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted,#6E7B6C)] mt-1">
              {stage.highlight}
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--color-primary,#91A98B)]/20 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'milestones'
                ? 'bg-[var(--color-primary,#91A98B)] text-white shadow-2xs'
                : 'text-[var(--color-text-muted,#6E7B6C)] hover:bg-[var(--color-primary,#91A98B)]/10'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Milestone Checkpoints</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('play')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'play'
                ? 'bg-[var(--color-primary,#91A98B)] text-white shadow-2xs'
                : 'text-[var(--color-text-muted,#6E7B6C)] hover:bg-[var(--color-primary,#91A98B)]/10'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Developmental Play</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pediatrician')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pediatrician'
                ? 'bg-[var(--color-primary,#91A98B)] text-white shadow-2xs'
                : 'text-[var(--color-text-muted,#6E7B6C)] hover:bg-[var(--color-primary,#91A98B)]/10'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Well-Child Agenda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-[var(--color-primary,#91A98B)] text-white shadow-2xs'
                : 'text-[var(--color-text-muted,#6E7B6C)] hover:bg-[var(--color-primary,#91A98B)]/10'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Doctor Questions ({questions.length})</span>
          </button>
        </div>

        {/* TAB 1: MILESTONE CATEGORIES */}
        {activeTab === 'milestones' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stage.milestoneCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-2xl p-4 border border-[var(--color-primary,#91A98B)]/20 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.category}</span>
                  </div>
                  <ul className="space-y-2">
                    {cat.items.map((item, itemIdx) => {
                      const itemId = `${stage.id}-${idx}-${itemIdx}`;
                      const isDone = !!completedItems[itemId];
                      return (
                        <li
                          key={itemIdx}
                          onClick={() => toggleCheck(itemId)}
                          className="flex items-start gap-2 text-xs text-[var(--color-text-main,#303832)] cursor-pointer select-none group"
                        >
                          <span className="mt-0.5 shrink-0 text-[var(--color-primary,#91A98B)] group-hover:scale-110 transition-transform">
                            {isDone ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                            ) : (
                              <Square className="w-4 h-4 opacity-60" />
                            )}
                          </span>
                          <span className={isDone ? 'line-through opacity-60 text-xs' : 'text-xs'}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="text-[10px] text-[var(--color-text-muted,#6E7B6C)] italic pt-2 border-t border-[var(--color-primary,#91A98B)]/15">
                  Tap any item to check it off on your phone.
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DEVELOPMENTAL PLAY */}
        {activeTab === 'play' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stage.playActivities.map((act, idx) => (
              <div
                key={idx}
                className="bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-2xl p-4 border border-[var(--color-primary,#91A98B)]/20 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary,#91A98B)] shrink-0" />
                  <h4>{act.title}</h4>
                </div>
                <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] leading-relaxed">
                  {act.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: WELL-CHILD AGENDA */}
        {activeTab === 'pediatrician' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-2xl p-5 border border-[var(--color-primary,#91A98B)]/20 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                <span>Discussion Topics with Your Doctor</span>
              </h4>
              <ul className="space-y-2 text-xs text-[var(--color-text-main,#303832)]">
                {stage.pediatricianTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--color-primary,#91A98B)] font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-2xl p-5 border border-[var(--color-primary,#91A98B)]/20 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                <span>Visit Preparation Checklist</span>
              </h4>
              <ul className="space-y-2 text-xs text-[var(--color-text-main,#303832)]">
                {stage.checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: DOCTOR QUESTIONS NOTEPAD */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-2xl p-4 sm:p-5 border border-[var(--color-primary,#91A98B)]/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
                  <span>Questions to Ask Your Pediatrician</span>
                </h4>
                <span className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                  Printed automatically in Doctor Brief
                </span>
              </div>

              {/* Form to add question */}
              <form onSubmit={addQuestion} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. Is baby's feeding schedule typical? When to introduce eggs?"
                  className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-[#1D241F] border border-[var(--color-primary,#91A98B)]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,#91A98B)] text-[var(--color-text-main,#303832)] placeholder:text-[var(--color-text-muted,#6E7B6C)]/50"
                />
                <button
                  type="submit"
                  disabled={!newQuestionText.trim()}
                  className="px-4 py-2 bg-[var(--color-primary,#91A98B)] text-white text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              {/* Questions List */}
              <div className="space-y-2 pt-2">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-[#1D241F] rounded-xl border border-[var(--color-primary,#91A98B)]/20 flex items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[var(--color-primary,#91A98B)] shrink-0">
                        {idx + 1}.
                      </span>
                      <span className="text-[var(--color-text-main,#303832)] leading-relaxed">{q}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-stone-400 hover:text-red-500 p-1 rounded-lg transition-colors shrink-0"
                      title="Delete question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {questions.length === 0 && (
                  <p className="text-xs text-[var(--color-text-muted,#6E7B6C)] italic text-center py-2">
                    No custom questions yet. Add any questions you have for your baby's upcoming visit!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
