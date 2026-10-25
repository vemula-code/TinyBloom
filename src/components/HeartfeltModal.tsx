import React from 'react';
import { X, Heart, ShieldCheck, Sparkles, Smartphone, Download, Award, Smile } from 'lucide-react';
import { TinyBloomLogo } from './TinyBloomLogo';

interface HeartfeltModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyName?: string;
}

export const HeartfeltModal: React.FC<HeartfeltModalProps> = ({
  isOpen,
  onClose,
  babyName = 'Your Baby',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#1D241F] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--color-primary,#91A98B)]/30 text-[var(--color-text-main,#303832)] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-[var(--color-primary,#91A98B)]/20 via-[#F3C9B8]/20 to-[#AFCDE0]/20 p-6 sm:p-8 border-b border-[var(--color-primary,#91A98B)]/20">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-[#2A342D] text-[var(--color-text-muted,#6E7B6C)] hover:text-[var(--color-text-main,#303832)] hover:bg-white dark:hover:bg-[#323E36] transition-colors shadow-2xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <TinyBloomLogo size={36} showText={false} />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] bg-[var(--color-primary,#91A98B)]/20 px-2 py-0.5 rounded-full">
                A Letter to Parents
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-text-main,#303832)]">
                Why TinyBloom Was Born
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted,#6E7B6C)] italic mt-1">
            "They tell you that the days are long, but the years are short."
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed text-[var(--color-text-main,#303832)]">
          {/* Heartfelt Note */}
          <div className="space-y-3">
            <p className="font-medium text-sm sm:text-base text-[var(--color-primary-dark,#3D5939)]">
              Dear Parent,
            </p>
            <p>
              One quiet night, you were holding a tiny, fragile bundle against your chest, learning the rhythm of newborn breaths and counting every single ounce gained. Then, before you know it, months slip by—and that same little human is sitting up, laughing out loud with tiny teeth, babbling whole conversations, and reaching for your hand with curious fingers.
            </p>
            <p>
              Every gram gained, every centimeter grown, and every little head-circumference checkup is a quiet miracle. It is tangible proof of love, of nourishment, and of how big your little heart is getting.
            </p>
            <p>
              When commercial baby tracking apps started putting growth charts, percentiles, and historical records behind paid monthly paywalls and collecting personal family data, we felt parents deserved better. Your child’s health milestones should never be locked behind a credit card or monetized by advertising companies.
            </p>
          </div>

          {/* Three Sacred Promises */}
          <div className="bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] rounded-2xl p-4 sm:p-5 border border-[var(--color-primary,#91A98B)]/25 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-dark,#3D5939)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
              <span>Our Sacred Promises to You</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white dark:bg-[#202722] rounded-xl border border-[var(--color-primary,#91A98B)]/20 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary,#91A98B)] mb-1.5" />
                <h4 className="font-bold text-xs">100% On-Device Privacy</h4>
                <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-1">
                  Zero cloud servers, zero ads, zero trackers. Your baby’s data stays exclusively on your phone.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#202722] rounded-xl border border-[var(--color-primary,#91A98B)]/20 shadow-2xs">
                <Award className="w-5 h-5 text-[var(--color-primary,#91A98B)] mb-1.5" />
                <h4 className="font-bold text-xs">Official WHO Standards</h4>
                <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-1">
                  Validated World Health Organization percentiles (0–24+ months) for Weight, Length, and Head Size.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#202722] rounded-xl border border-[var(--color-primary,#91A98B)]/20 shadow-2xs">
                <Heart className="w-5 h-5 text-[var(--color-primary,#91A98B)] mb-1.5" />
                <h4 className="font-bold text-xs">Completely Free Forever</h4>
                <p className="text-[11px] text-[var(--color-text-muted,#6E7B6C)] mt-1">
                  No subscriptions, no trials, no paywalls. Built with love for your family.
                </p>
              </div>
            </div>
          </div>

          {/* Pediatric Philosophy */}
          <div className="border-l-3 border-[var(--color-primary,#91A98B)] pl-4 py-1 space-y-1">
            <h4 className="font-bold text-xs text-[var(--color-primary-dark,#3D5939)]">
              Growth is a Journey, Not a Race
            </h4>
            <p className="text-xs text-[var(--color-text-muted,#6E7B6C)]">
              A percentile is simply a reference point, never a grade or a competition. Whether {babyName} tracks at the 15th percentile or the 85th percentile, what matters most is steady, healthy progression along their own unique curve.
            </p>
          </div>

          {/* Quick Helpful Tips */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-muted,#6E7B6C)]">
              Parent Tips:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-[var(--color-text-muted,#6E7B6C)]">
              <li>
                <strong>Install to Home Screen:</strong> Tap the "Install" button or your browser’s "Add to Home Screen" to use TinyBloom like a native app with zero browser bars.
              </li>
              <li>
                <strong>Share with Co-Parents:</strong> In Settings, use <em>Export Backup (JSON)</em> to back up or send records to your spouse’s phone anytime.
              </li>
              <li>
                <strong>Doctor Visit Brief:</strong> Tap the printer icon in the top header before checkups to view a formatted summary to show your pediatrician.
              </li>
              <li>
                <strong>Night Mode & Themes:</strong> Tap the Sun/Moon icon in the header for comfortable viewing during 2 AM feedings.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[var(--color-canvas,#FFF9F0)] dark:bg-[#161D18] border-t border-[var(--color-primary,#91A98B)]/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted,#6E7B6C)]">
            <Smile className="w-4 h-4 text-[var(--color-primary,#91A98B)]" />
            <span>Cherish every little moment with {babyName}.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary,#91A98B)] hover:opacity-90 transition-all shadow-2xs"
          >
            Back to TinyBloom
          </button>
        </div>
      </div>
    </div>
  );
};
