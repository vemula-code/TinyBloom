import React, { useState, useEffect } from 'react';
import { getNextWellChildCheckup } from '../data/whoGrowthStandards';
import { Calendar, Plus, Trash2, FileText, ArrowRight, Stethoscope } from 'lucide-react';

interface CheckupPrepCardProps {
  ageMonths: number;
  babyName: string;
  onOpenReport: () => void;
  onOpenUniversalGuide: () => void;
}

const QUESTIONS_STORAGE_KEY = 'tinybloom_doctor_questions';

export const CheckupPrepCard: React.FC<CheckupPrepCardProps> = ({
  ageMonths,
  babyName,
  onOpenReport,
  onOpenUniversalGuide,
}) => {
  const nextCheckup = getNextWellChildCheckup(ageMonths);

  const [questions, setQuestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(QUESTIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    } catch {}
  }, [questions]);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setQuestions((prev) => [...prev, trimmed]);
    setDraft('');
  };

  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-[var(--color-card)] rounded-3xl p-4 sm:p-6 border border-[var(--color-card-border)] shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-card-border)] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-heading text-[var(--color-text-main)]">
              Checkup Prep · {nextCheckup.title}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Jot questions for {babyName}’s pediatrician — included automatically in Doctor Brief PDF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenReport}
            className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Doctor Brief PDF</span>
          </button>
          <button
            type="button"
            onClick={onOpenUniversalGuide}
            className="flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
          >
            <span>0–36m Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upcoming Well-Visit Focus & Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Focus topics for upcoming visit */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-card-border)] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-main)]">
            <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Typical {nextCheckup.title} Topics</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[var(--color-text-muted)]">
            {nextCheckup.checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Saved Questions for Doctor */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-canvas)] border border-[var(--color-card-border)] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--color-text-main)]">
              Questions for the Doctor ({questions.length})
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">Synced to PDF</span>
          </div>

          <form onSubmit={handleAddQuestion} className="flex items-center gap-1.5">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="e.g. Vitamin D drops? Starting finger foods?"
              className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] text-xs text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer shrink-0"
              aria-label="Add question"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {questions.length > 0 ? (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-0.5">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-card-border)] text-xs text-[var(--color-text-main)]"
                >
                  <span className="leading-snug">
                    <strong className="text-[var(--color-primary)] mr-1">{idx + 1}.</strong>
                    {q}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(idx)}
                    className="p-0.5 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer shrink-0"
                    title="Remove question"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[var(--color-text-muted)] italic">
              No saved questions yet. Add anything that comes to mind between visits!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
