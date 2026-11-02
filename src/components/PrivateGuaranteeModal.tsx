import React from 'react';
import { X, ShieldCheck, Lock, Smartphone, Database, Ban, FileDown, CheckCircle2, Heart } from 'lucide-react';
import { GrowthEntry, BabyProfile } from '../types/growth';

interface PrivateGuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: GrowthEntry[];
  profile: BabyProfile;
}

export const PrivateGuaranteeModal: React.FC<PrivateGuaranteeModalProps> = ({
  isOpen,
  onClose,
  entries,
  profile,
}) => {
  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const backupData = {
      app: 'TinyBloom',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      entries,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinybloom-${profile.name.toLowerCase().replace(/\s+/g, '-')}-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-guarantee-title"
    >
      <div className="bg-white dark:bg-[#1B231F] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-emerald-500/30 text-[var(--color-text-main,#1B241C)] flex flex-col my-auto transition-colors">
        
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-emerald-500/15 via-[#91A98B]/20 to-[#AFCDE0]/20 p-4 sm:p-5 border-b border-emerald-500/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/80 dark:bg-[#2A342D] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white dark:hover:bg-[#323E36] transition-colors shadow-2xs cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-2xs shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>100% On-Device & Private</span>
              </div>
              <h2 id="privacy-guarantee-title" className="text-base sm:text-lg font-bold font-heading text-[var(--color-text-main)] leading-tight">
                Your Baby’s Privacy Guarantee
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 bg-[var(--color-canvas,#FAF8F3)] dark:bg-[#121714] text-xs sm:text-sm leading-relaxed text-[var(--color-text-main,#1B241C)]">
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Many commercial parenting apps monetize intimate infant health records, sell data to advertisers, or lock growth curves behind expensive subscriptions. TinyBloom is built on the complete opposite philosophy:
          </p>

          {/* Point 1: On-Device Storage */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[var(--color-text-main)]">
                Stored Exclusively on Your Phone
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                All measurements, notes, and milestones reside inside your device&apos;s browser memory (<code className="text-[10px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">localStorage</code>). No remote database collects or archives your baby&apos;s records.
              </p>
            </div>
          </div>

          {/* Point 2: Zero Cloud Accounts or Logins */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[var(--color-text-main)]">
                No Accounts, No Passwords, No Emails
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                You never need to sign up, provide an email address, or create a password. There are no corporate servers that could ever be breached or hacked.
              </p>
            </div>
          </div>

          {/* Point 3: Zero Trackers or Commercial Ads */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[var(--color-text-main)]">
                Zero Ads &amp; Zero Data Brokers
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                Zero Facebook tracking pixels, zero Google ad trackers, zero marketing analytics. Your nursery moments are not for sale.
              </p>
            </div>
          </div>

          {/* Point 4: Ephemeral Screenshot Parsing */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B231F] border border-[var(--color-card-border)] shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[var(--color-text-main)]">
                Screenshot Imports Are Ephemeral
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                When you upload a screenshot from Huckleberry, Sprout, or clinic papers to import historical growth, the image is analyzed in memory solely to extract measurement numbers, then immediately discarded.
              </p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{entries.length} measurements safely on this device</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 font-bold text-[11px] shadow-2xs hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--color-card-border)] bg-white dark:bg-[#1B231F] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>Built by parents for parents</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-xs cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
