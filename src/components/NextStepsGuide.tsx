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
  ChevronRight
} from 'lucide-react';

interface NextStepsGuideProps {
  profile: BabyProfile;
}

interface AgeStageContent {
  range: string;
  minMonths: number;
  maxMonths: number;
  title: string;
  nextCheckup: string;
  playActivities: { title: string; desc: string }[];
  pediatricianTopics: string[];
  checklist: string[];
}

const AGE_STAGES: AgeStageContent[] = [
  {
    range: '0 – 2 Months',
    minMonths: 0,
    maxMonths: 2,
    title: 'The Fourth Trimester & Newborn Gentle Rhythms',
    nextCheckup: '2 Month Well-Child Visit',
    playActivities: [
      {
        title: 'Gentle Tummy Time',
        desc: 'Place baby on your chest or a firm mat for 2-3 minutes, 2 to 3 times a day while awake. Encourages neck and shoulder strength.',
      },
      {
        title: 'High-Contrast Tracking',
        desc: 'Hold black-and-white cards or slow-moving faces 8 to 12 inches from baby’s eyes and move side to side.',
      },
      {
        title: 'Soothing Voice & Touch',
        desc: 'Sing, talk, and narrate your day during diaper changes. Baby recognizes and finds comfort in familiar voices.',
      },
    ],
    pediatricianTopics: [
      'Feeding frequency (breastmilk or formula) and wet diaper counts',
      'Sleeping patterns and safe sleep environment (on back, firm mattress, empty crib)',
      '2-month routine immunizations (DTaP, IPV, Hib, PCV, Rotavirus)',
      'Colic, gas, or fussiness soothing strategies',
    ],
    checklist: [
      'Pack extra diapers, wipes, and change of clothes',
      'Record feeding and wet diaper notes from recent 24 hours',
      'Bring vaccination card / baby health record booklet',
      'Write down questions about weight gain trajectory',
    ],
  },
  {
    range: '2 – 4 Months',
    minMonths: 2,
    maxMonths: 4,
    title: 'Social Smiles, Coos & Visual Wonder',
    nextCheckup: '4 Month Well-Child Visit',
    playActivities: [
      {
        title: 'Conversation & Echoing',
        desc: 'Wait for baby to make sounds (coos, gurgles) and repeat them back with eye contact. Builds language foundations.',
      },
      {
        title: 'Reaching & Grasping Play',
        desc: 'Offer lightweight soft rattles or sensory rings just within reach so baby learns hand-eye coordination.',
      },
      {
        title: 'Side-to-Side Roll Practice',
        desc: 'Gently guide toys across their line of sight to encourage turning their head and shifting weight.',
      },
    ],
    pediatricianTopics: [
      'Head control during tummy time and upright holding',
      'Visual tracking of moving objects and smiling responsively',
      '4-month immunization booster doses',
      'Sleep consolidation and bedtime routines',
    ],
    checklist: [
      'Note any changes in stool consistency or spitting up',
      'Track daytime nap schedules and nighttime sleep length',
      'Prepare questions about upcoming 4-6 month milestones',
    ],
  },
  {
    range: '4 – 6 Months',
    minMonths: 4,
    maxMonths: 6,
    title: 'Rolling, Chuckles & Hand Coordination',
    nextCheckup: '6 Month Well-Child Visit',
    playActivities: [
      {
        title: 'Floor Mat Freedom',
        desc: 'Ample floor time allows baby to practice rolling from tummy to back and back to tummy freely.',
      },
      {
        title: 'Mirror Exploration',
        desc: 'Let baby look at their own face in an unbreakable baby mirror. Watch them smile and reach out.',
      },
      {
        title: 'Sensory Texture Touch',
        desc: 'Introduce soft silk, crinkle paper, smooth wood, and silicone teethers to explore through fingers and gums.',
      },
    ],
    pediatricianTopics: [
      'Readiness signs for starting solid foods (purees vs baby-led weaning)',
      'Fluoride and vitamin D supplementation guidelines',
      'Teething symptoms, swollen gums, and safe cooling teethers',
      '6-month vaccines and seasonal flu protection',
    ],
    checklist: [
      'List any family history of food allergies (peanuts, eggs, dairy)',
      'Ask pediatrician about high-chair posture and allergen introduction',
      'Review baby-proofing milestones (baby will be mobile soon!)',
    ],
  },
  {
    range: '6 – 9 Months',
    minMonths: 6,
    maxMonths: 9,
    title: 'Sitting Sturdy, Babbling & First Solids',
    nextCheckup: '9 Month Well-Child Visit',
    playActivities: [
      {
        title: 'Supported & Independent Sitting',
        desc: 'Place pillows around baby and place attractive toys between their feet to encourage balance without hands.',
      },
      {
        title: 'Peek-a-Boo Games',
        desc: 'Hide behind a cloth or hands. Teaches object permanence—the understanding that things still exist when unseen!',
      },
      {
        title: 'Cause-and-Effect Toys',
        desc: 'Stacking cups, soft blocks to knock down, and dropping toys to hear the sound.',
      },
    ],
    pediatricianTopics: [
      'Solid food variety, iron-rich foods, and self-feeding progress',
      'Transitioning to cup drinking and water sips with meals',
      'Separation anxiety and stranger awareness (healthy developmental signs)',
      'Oral health: cleaning first baby teeth with soft cloth or brush',
    ],
    checklist: [
      'Document foods baby has tried and tolerated',
      'Inspect home safety: outlet covers, stair gates, anchoring heavy furniture',
      'Note speech babbles (e.g., "ba-ba", "da-da", "ma-ma")',
    ],
  },
  {
    range: '9 – 12 Months',
    minMonths: 9,
    maxMonths: 12,
    title: 'Crawling, Cruising & Curiosity Everywhere',
    nextCheckup: '12 Month (1 Year) Milestone Visit',
    playActivities: [
      {
        title: 'Obstacle Course Crawling',
        desc: 'Place cushions, rolled blankets, and boxes on the floor for baby to climb over and navigate.',
      },
      {
        title: 'Pincer Grasp Challenges',
        desc: 'Offer safe finger foods (steamed peas, small banana cubes) to exercise the thumb-forefinger grasp.',
      },
      {
        title: 'Interactive Board Books',
        desc: 'Point to pictures, name animals, and let baby practice turning thick cardboard pages.',
      },
    ],
    pediatricianTopics: [
      'Transition from formula/breastmilk to whole milk or alternatives at 12 months',
      'Screen time recommendations (WHO recommends zero recreational screen time under 2)',
      'Walking progress and barefoot foot development',
      '12-month immunizations (MMR, Varicella, Hep A, PCV booster)',
    ],
    checklist: [
      'Ensure car seat is rear-facing and adjusted for current height and weight',
      'Review daily water intake and cup transition progress',
      'Write down questions regarding sleep transitions (2 naps to 1 nap)',
    ],
  },
  {
    range: '12 – 24 Months',
    minMonths: 12,
    maxMonths: 24,
    title: 'First Words, First Steps & Toddler Independence',
    nextCheckup: '15 / 18 / 24 Month Checkup',
    playActivities: [
      {
        title: 'Pretend Play & Sorting',
        desc: 'Toy spoons, dolls, shape sorters, and cardboard boxes fuel boundless toddler imagination.',
      },
      {
        title: 'Outdoor Nature Walks',
        desc: 'Collect leaves, touch tree bark, and walk on uneven grass to stimulate vestibular coordination.',
      },
      {
        title: 'Song, Rhyme & Dancing',
        desc: 'Clapping games, action songs (Wheels on the Bus), and movement build gross motor control.',
      },
    ],
    pediatricianTopics: [
      'Word count and communication development (pointing, waving, simple phrases)',
      'Healthy toddler eating boundaries and normal picky eating phases',
      'Tantrums, emotional regulation, and gentle boundary setting',
      'Vision and hearing screening checkpoints',
    ],
    checklist: [
      'Record approximate vocabulary and gesture communication',
      'Review dental checkup schedule (first dentist visit by 1 year)',
      'Ask about safety outdoors and toddler shoe selection',
    ],
  },
];

export const NextStepsGuide: React.FC<NextStepsGuideProps> = ({ profile }) => {
  const age = calculateAge(profile.birthDate);
  const currentMonths = age.exactMonths;

  // Find active stage
  const matchedStageIndex = AGE_STAGES.findIndex(
    (s) => currentMonths >= s.minMonths && currentMonths < s.maxMonths
  );
  const [selectedStageIdx, setSelectedStageIdx] = useState(
    matchedStageIndex >= 0 ? matchedStageIndex : 2
  );

  const stage = AGE_STAGES[selectedStageIdx] || AGE_STAGES[0];

  // Local doctor questions stored on device
  const [questions, setQuestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_doctor_questions');
      return saved ? JSON.parse(saved) : [
        'How is baby’s weight and length trajectory progressing on the WHO curve?',
        'Are there any nutritional adjustments recommended for this age?',
      ];
    } catch {
      return [];
    }
  });
  const [newQuestion, setNewQuestion] = useState('');

  // Checklist completion states
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('tinybloom_checklist_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tinybloom_doctor_questions', JSON.stringify(questions));
    } catch (e) {
      console.error(e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('tinybloom_checklist_state', JSON.stringify(checkedItems));
    } catch (e) {
      console.error(e);
    }
  }, [checkedItems]);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions([...questions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const toggleChecklist = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#91A98B]/30 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#5D7C57] font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Age Guidance</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#303832]">
              {profile.name}’s Next Steps ({age.displayStr} old)
            </h2>
            <p className="text-xs text-[#6E7B6C] mt-1">
              Age-based developmental play, pediatrician checkup prep, and custom questions for your doctor.
            </p>
          </div>

          {/* Current Stage Indicator */}
          <div className="bg-[#FFF9F0] border border-[#91A98B]/30 px-3.5 py-2 rounded-2xl flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-[#5D7C57]" />
            <div className="text-left text-xs">
              <span className="text-[#6E7B6C] block text-[10px]">Upcoming Visit</span>
              <span className="font-bold text-[#303832]">{stage.nextCheckup}</span>
            </div>
          </div>
        </div>

        {/* Stage Selector Pills */}
        <div className="mt-5 pt-4 border-t border-[#91A98B]/15 flex items-center gap-2 overflow-x-auto pb-1">
          {AGE_STAGES.map((s, idx) => {
            const isCurrent = idx === matchedStageIndex;
            const isSelected = idx === selectedStageIdx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedStageIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#91A98B] text-white shadow-2xs'
                    : 'bg-[#FFF9F0] text-[#303832] border border-[#91A98B]/20 hover:bg-[#91A98B]/10'
                }`}
              >
                <span>{s.range}</span>
                {isCurrent && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                    isSelected ? 'bg-white/30 text-white' : 'bg-[#91A98B]/20 text-[#3D5939]'
                  }`}>
                    Now
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Developmental Play & Pediatrician Checkup Prep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Play & Nurturing Activities */}
        <div className="bg-white rounded-3xl p-6 border border-[#91A98B]/30 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#91A98B]/20 text-[#3D5939] flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-[#303832]">
                Developmental Play Ideas
              </h3>
              <span className="text-[11px] text-[#6E7B6C]">
                Fun, loving activities to nurture motor and cognitive growth
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {stage.playActivities.map((act, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FFF9F0]/70 border border-[#91A98B]/20 space-y-1"
              >
                <div className="text-xs font-bold text-[#303832] flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#91A98B] text-white text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{act.title}</span>
                </div>
                <p className="text-xs text-[#6E7B6C] pl-6 leading-relaxed">
                  {act.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#6E7B6C] italic bg-[#FFF9F0] p-2.5 rounded-xl border border-[#91A98B]/15">
            Every baby develops at their own beautiful pace. These are fun bonding suggestions, not a clinical milestone test.
          </p>
        </div>

        {/* Card 2: Pediatrician Visit Checkpoints */}
        <div className="bg-white rounded-3xl p-6 border border-[#91A98B]/30 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F3C9B8]/40 text-[#9C5D47] flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-[#303832]">
                {stage.nextCheckup} Preparation
              </h3>
              <span className="text-[11px] text-[#6E7B6C]">
                Key topics doctors evaluate at this age
              </span>
            </div>
          </div>

          {/* Pediatrician topics list */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#6E7B6C] uppercase tracking-wider block">
              Common Discussion Points:
            </span>
            <ul className="space-y-1.5 text-xs text-[#303832]">
              {stage.pediatricianTopics.map((topic, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#FFF9F0]/60 p-2.5 rounded-xl border border-[#91A98B]/15">
                  <span className="text-[#5D7C57] font-bold mt-0.5">•</span>
                  <span className="leading-snug">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Appointment Checklist */}
          <div className="pt-2 border-t border-[#91A98B]/15 space-y-2">
            <span className="text-[11px] font-bold text-[#6E7B6C] uppercase tracking-wider block">
              Appointment Day Checklist:
            </span>
            <div className="space-y-1.5">
              {stage.checklist.map((item, idx) => {
                const isChecked = !!checkedItems[item];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleChecklist(item)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors hover:bg-[#FFF9F0]"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#5D7C57] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-300 shrink-0" />
                    )}
                    <span className={`leading-snug ${isChecked ? 'line-through text-[#6E7B6C]' : 'text-[#303832]'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Questions for Your Pediatrician Notepad (Automatically syncs into Doctor Brief!) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#91A98B]/30 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5D77A]/40 text-[#6B5510] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-[#303832]">
                Questions for {profile.name}’s Doctor
              </h3>
              <p className="text-xs text-[#6E7B6C]">
                Save questions here so you never forget during your visit. Automatically included in your Doctor Brief!
              </p>
            </div>
          </div>
          <span className="text-xs text-[#5D7C57] font-semibold bg-[#91A98B]/15 px-3 py-1 rounded-full shrink-0">
            {questions.length} saved
          </span>
        </div>

        {/* Question Add Form */}
        <form onSubmit={handleAddQuestion} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. When can we introduce peanut butter or eggs?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-[#FFF9F0]/60 border border-[#91A98B]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#91A98B] text-[#303832]"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#91A98B] hover:bg-[#7D9977] text-white rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Questions List */}
        {questions.length > 0 ? (
          <div className="divide-y divide-[#91A98B]/15 bg-[#FFF9F0]/50 rounded-2xl border border-[#91A98B]/20 overflow-hidden">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-3 flex items-center justify-between gap-3 hover:bg-[#FFF9F0] transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#91A98B]/30 text-[#5D7C57] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-[#303832] font-medium leading-relaxed">
                    {q}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="text-stone-300 hover:text-red-500 p-1 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#6E7B6C] bg-[#FFF9F0]/40 rounded-2xl border border-dashed border-[#91A98B]/30">
            No questions saved yet. Type any questions about sleep, feeding, or development above!
          </div>
        )}
      </div>
    </div>
  );
};
