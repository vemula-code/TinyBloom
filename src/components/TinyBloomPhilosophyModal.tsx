import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Sparkles,
  Award,
  Smile,
  Lock,
  Database,
  CloudOff,
  Baby,
  BookOpen,
  Share2,
  CheckCircle2,
  Feather,
  ArrowRight
} from 'lucide-react';
import { TinyBloomLogo } from './TinyBloomLogo';

interface TinyBloomPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyName?: string;
}

type TabKey = 'all' | 'intro' | 'privacy' | 'letter' | 'pediatric';

export const TinyBloomPhilosophyModal: React.FC<TinyBloomPhilosophyModalProps> = ({
  isOpen,
  onClose,
  babyName = 'Your Baby',
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="philosophy-title"
    >
      <div className="bg-white dark:bg-[#1D241F] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-main,#303832)] flex flex-col my-auto">
        
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-[var(--color-primary,#91A98B)]/20 via-[#F3C9B8]/25 to-[#AFCDE0]/20 p-5 sm:p-7 border-b border-[var(--color-primary,#91A98B)]/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-[#2A342D] text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)] hover:bg-white dark:hover:bg-[#323E36] transition-colors shadow-2xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <TinyBloomLogo size={40} showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] bg-[var(--color-primary,#91A98B)]/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Our Manifesto & Vision
                </span>
              </div>
              <h2 id="philosophy-title" className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-text-main,#303832)] mt-1">
                The TinyBloom Philosophy
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted,#6E7B6C)] italic max-w-xl">
            "Every little milestone matters. Growth is a gentle journey, not a competition, and your family's memories belong solely to you."
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[var(--color-primary,#91A98B)]/20 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                  : 'bg-white/80 dark:bg-[#202722] hover:bg-white text-[var(--color-text-muted,#6E7B6C)]'
              }`}
            >
              Overview & All Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('intro')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'intro'
                  ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                  : 'bg-white/80 dark:bg-[#202722] hover:bg-white text-[var(--color-text-muted,#6E7B6C)]'
              }`}
            >
              🌱 Introduction
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'privacy'
                  ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                  : 'bg-white/80 dark:bg-[#202722] hover:bg-white text-[var(--color-text-muted,#6E7B6C)]'
              }`}
            >
              🛡️ Private Local Storage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('letter')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'letter'
                  ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                  : 'bg-white/80 dark:bg-[#202722] hover:bg-white text-[var(--color-text-muted,#6E7B6C)]'
              }`}
            >
              💖 A Letter to Parents
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pediatric')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'pediatric'
                  ? 'bg-[var(--color-primary,#91A98B)] text-white font-bold shadow-2xs'
                  : 'bg-white/80 dark:bg-[#202722] hover:bg-white text-[var(--color-text-muted,#6E7B6C)]'
              }`}
            >
              📈 Growth Philosophy
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] text-xs sm:text-sm leading-relaxed text-[var(--color-text-main,#303832)]">
          
          {/* Section 1: Introduction to TinyBloom */}
          {(activeTab === 'all' || activeTab === 'intro') && (
            <section className="bg-white dark:bg-[#1D241F] p-5 sm:p-6 rounded-2xl border border-[var(--color-primary,#91A98B)]/25 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                <TinyBloomLogo size={24} showText={false} />
                <h3 className="text-base font-bold font-heading">
                  1. What is TinyBloom?
                </h3>
              </div>
              <p>
                <strong>TinyBloom</strong> is a calm, respectful, and privacy-first baby growth companion. We designed it specifically for parents who want clarity about their child's physical development without having to navigate cluttered interfaces, noisy advertisements, or predatory monthly subscriptions.
              </p>
              <p>
                The name <em>TinyBloom</em> is inspired by the quiet wonder of a growing seed: from a tiny tender sprout stretching toward the sun, into a lively bloom with a personality all its own. Just like flowers in a meadow, babies do not all bloom on the exact same calendar week. Each one unfolds in their own time, with their own gentle rhythm.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20">
                  <span className="font-bold block text-xs text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                    WHO Gold Standard
                  </span>
                  <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-1">
                    Powered by official World Health Organization Multicentre Growth Reference curves (0–36 months).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20">
                  <span className="font-bold block text-xs text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                    Pediatrician Ready
                  </span>
                  <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-1">
                    One-tap printout summary ready to show your doctor at well-child checkups.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20">
                  <span className="font-bold block text-xs text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                    Calm, Caring Aesthetics
                  </span>
                  <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-1">
                    Warm earth tones, night mode for 2 AM feedings, and zero flashing distractions.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: The Importance of Private Local-Only Storage */}
          {(activeTab === 'all' || activeTab === 'privacy') && (
            <section className="bg-white dark:bg-[#1D241F] p-5 sm:p-6 rounded-2xl border border-[var(--color-primary,#91A98B)]/25 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary,#91A98B)]" />
                <h3 className="text-base font-bold font-heading">
                  2. Why We Insist on 100% Private Local Storage
                </h3>
              </div>
              <p>
                Your baby's birth date, birth weight, photos, and growth measurements are not digital commodity data. They are among the most intimate, vulnerable records your family will ever create.
              </p>
              <p>
                In recent years, many commercial baby apps have turned parenthood into a monetized funnel: requiring user logins, uploading biometric histories to remote cloud databases, selling behavioral analytics to ad brokers, or locking historical growth charts behind recurring $9.99/month paywalls. If those servers are breached or the company shuts down, your memories and health records vanish.
              </p>

              <div className="rounded-2xl p-4 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>The 5 Architectural Pillars of TinyBloom Privacy</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-[#202722] rounded-xl border border-[var(--color-primary,#91A98B)]/15">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <CloudOff className="w-4 h-4 text-emerald-600" />
                      <span>Zero Cloud Servers</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                      All data lives strictly inside your browser's local sandbox on this physical device. No remote database ever receives a byte of baby data.
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#202722] rounded-xl border border-[var(--color-primary,#91A98B)]/15">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>No Accounts or Passwords</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                      No email sign-up, no OAuth tracking, and no corporate profile creation. You open the app and it just works immediately.
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#202722] rounded-xl border border-[var(--color-primary,#91A98B)]/15">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Share2 className="w-4 h-4 text-emerald-600" />
                      <span>Complete Data Portability</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                      Download standard JSON backups or CSV spreadsheets anytime to save on your computer or easily import onto a co-parent's phone.
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#202722] rounded-xl border border-[var(--color-primary,#91A98B)]/15">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>100% Offline Capability</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)]">
                      TinyBloom works seamlessly on airplanes, in rural clinics with no reception, or during power outages. All WHO charts are bundled locally.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Heartfelt Notes on Why This Exists for Parents */}
          {(activeTab === 'all' || activeTab === 'letter') && (
            <section className="bg-white dark:bg-[#1D241F] p-5 sm:p-6 rounded-2xl border border-[var(--color-primary,#91A98B)]/25 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500" />
                <h3 className="text-base font-bold font-heading text-[var(--color-text-main,#303832)]">
                  3. A Heartfelt Letter to Parents
                </h3>
              </div>
              <div className="space-y-3 italic text-stone-700 dark:text-stone-300">
                <p className="font-semibold not-italic text-sm text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                  Dear Parent of {babyName},
                </p>
                <p>
                  "They tell you that the days are long, but the years are short."
                </p>
                <p>
                  In the blur of the early weeks, time becomes elastic. You find yourself awake at 2:45 AM, rocking a warm little breathing miracle in the dark, counting the soft rhythm of their chest, and wondering if they are gaining enough weight, sleeping enough, and getting what they need.
                </p>
                <p>
                  Then one morning, you realize their newborn onesies don't snap anymore. The legs are too long. Their cheeks are plump and round. They look right into your eyes and burst into a toothless smile that melts every ounce of exhaustion you’ve carried.
                </p>
                <p>
                  TinyBloom exists to be a quiet companion for those fleeting, irreplaceable days. Not a noisy coach demanding you meet arbitrary quotas, but a warm journal where you can document each centimeter and pound, reflect on milestones with joy, and look back years from now at how beautifully your child flourished.
                </p>
                <div className="flex items-center gap-2 pt-1 not-italic font-medium text-xs text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                  <Feather className="w-4 h-4" />
                  <span>With love and solidarity for every parent on this journey.</span>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Pediatric Philosophy - Growth is a Journey, Not a Race */}
          {(activeTab === 'all' || activeTab === 'pediatric') && (
            <section className="bg-white dark:bg-[#1D241F] p-5 sm:p-6 rounded-2xl border border-[var(--color-primary,#91A98B)]/25 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                <Award className="w-5 h-5 text-[var(--color-primary,#91A98B)]" />
                <h3 className="text-base font-bold font-heading">
                  4. Pediatric Philosophy: Growth is a Journey, Not a Race
                </h3>
              </div>
              <div className="border-l-3 border-[var(--color-primary,#91A98B)] pl-4 py-1 space-y-2">
                <h4 className="font-bold text-xs sm:text-sm text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)]">
                  Understanding Percentiles Without Anxiety
                </h4>
                <p className="text-xs text-[var(--color-text-muted,#6E7B6C)]">
                  When you visit the pediatrician and hear numbers like "50th percentile" or "15th percentile," it is natural for parental instincts to wonder: <em>"Is higher better?"</em>
                </p>
                <p className="text-xs text-[var(--color-text-muted,#6E7B6C)]">
                  <strong>The short medical answer is: No.</strong> Percentiles are not test scores or grades. In a healthy population of 100 thriving children, half will naturally be below the 50th percentile, and half will be above it. A baby tracking along the 15th percentile with steady energy, wet diapers, and active curiosity is thriving just as brightly as a baby tracking along the 85th percentile.
                </p>
                <p className="text-xs text-[var(--color-text-muted,#6E7B6C)]">
                  What pediatricians look for is <em>curve consistency</em>—that {babyName} is following their own gentle arc over time. TinyBloom is built to give you that clarity and peace of mind.
                </p>
              </div>

              {/* Milestone guidance note */}
              <div className="p-4 rounded-xl bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border border-[var(--color-primary,#91A98B)]/20 text-xs text-[var(--color-text-muted,#6E7B6C)] flex items-start gap-2.5">
                <Smile className="w-4 h-4 text-[var(--color-primary,#91A98B)] shrink-0 mt-0.5" />
                <p>
                  Developmental milestones (sitting, babbling, grasping, walking) also happen across wide natural windows. Use our Universal Milestones Guide as playful inspiration, not a stressful test. Always consult your trusted pediatrician if you have specific clinical questions.
                </p>
              </div>
            </section>
          )}

          {/* Quick Helpful Actions */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary,#91A98B)]/10 via-[#F5D77A]/15 to-[#AFCDE0]/15 border border-[var(--color-primary,#91A98B)]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary,#91A98B)] shrink-0" />
              <span>
                Want to keep this app installed on your phone screen without browser bars?
              </span>
            </div>
            <span className="font-bold text-[var(--color-primary-dark,#3D5939)] dark:text-[var(--color-primary,#91A98B)] whitespace-nowrap">
              Use the Install / Add to Home Screen button
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1D241F] border-t border-[var(--color-primary,#91A98B)]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted,#6E7B6C)]">
            <TinyBloomLogo size={20} showText={false} />
            <span className="hidden sm:inline">TinyBloom · Every little milestone matters.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary,#91A98B)] hover:opacity-90 transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Close & Return to {babyName}'s Growth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
