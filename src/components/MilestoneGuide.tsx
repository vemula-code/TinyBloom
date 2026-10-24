import React, { useState } from 'react';
import { SEVEN_MONTH_PEDIATRIC_GUIDE } from '../data/milestonesData';
import { Baby, Utensils, Moon, Stethoscope, Activity, CheckSquare, Square, Info } from 'lucide-react';

export const MilestoneGuide: React.FC = () => {
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const checkupQuestions = [
    'How is my baby’s growth percentile tracking since birth / 6 months?',
    'Are we on the right schedule with finger foods vs puree textures?',
    'Should we introduce a fluoride supplement if our community water is filtered?',
    'When should we expect the first teeth, and how should we clean them?',
    'Is the current sleep routine and 2-to-3 nap schedule age-appropriate?',
    'What developmental red flags should I watch for regarding motor skills or babbling?',
  ];

  const toggleQuestion = (index: number) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-emerald-600" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-indigo-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-4 h-4 text-sky-600" />;
      default:
        return <Activity className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
          <Baby className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 tracking-tight">
            7-Month Development & Pediatric Checkup Guide
          </h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Around 7 months, babies experience significant motor breakthroughs (independent sitting, hand-to-hand object transfer), culinary adventures with finger foods, and interactive social babbles. Here is clinical guidance aligned with AAP and WHO recommendations.
          </p>
        </div>
      </div>

      {/* Guide Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SEVEN_MONTH_PEDIATRIC_GUIDE.map((section, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
                {getIcon(section.iconName)}
              </span>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {section.title}
              </h4>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {section.summary}
            </p>

            <ul className="space-y-2 pt-1 border-t border-stone-100">
              {section.tips.map((tip, tipIdx) => (
                <li key={tipIdx} className="text-xs text-stone-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Pediatrician Checkup Questions Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Pediatrician Visit Checklist (6–9 Month Checkup)
              </h4>
              <p className="text-[11px] text-stone-500">
                Tap items to mark as asked during your baby's doctor appointment
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {checkupQuestions.map((q, qIdx) => {
            const isChecked = !!checkedQuestions[qIdx];
            return (
              <button
                key={qIdx}
                type="button"
                onClick={() => toggleQuestion(qIdx)}
                className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                  isChecked
                    ? 'bg-blue-50/50 border-blue-200 text-stone-800'
                    : 'bg-stone-50/50 border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                )}
                <span className={isChecked ? 'line-through text-stone-500' : ''}>
                  {q}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
