import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCircle2,
  QrCode,
  Smartphone,
  ShieldCheck,
  Heart,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import QRCode from 'qrcode';
import { BabyProfile, GrowthEntry } from '../types/growth';
import { generateSyncUrl } from '../utils/syncPayload';

interface PartnerSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  entries: GrowthEntry[];
  unit: 'metric' | 'imperial';
}

export const PartnerSyncModal: React.FC<PartnerSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  entries,
  unit,
}) => {
  const [syncUrl, setSyncUrl] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);
  const [hasNativeShare, setHasNativeShare] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setHasNativeShare(true);
    } else {
      setHasNativeShare(false);
    }

    const url = generateSyncUrl(profile, entries, unit);
    setSyncUrl(url);

    // Generate QR code for immediate in-person camera scanning
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: {
        dark: '#1B241C',
        light: '#FFFFFF',
      },
    })
      .then((dataUri) => {
        setQrCodeDataUrl(dataUri);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
      });
  }, [isOpen, profile, entries, unit]);

  if (!isOpen) return null;

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.name}’s Growth Tracker · TinyBloom`,
          text: `Hi! Here is ${profile.name}’s baby growth curves and milestone tracker. Open this link on your phone to sync everything instantly:`,
          url: syncUrl,
        });
      } else {
        await handleCopyLink();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        await handleCopyLink();
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(syncUrl);
      } else {
        window.prompt('Copy this sync link to send to your partner:', syncUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      window.prompt('Copy this sync link to send to your partner:', syncUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-sync-title"
    >
      <div className="bg-[var(--color-card)] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[var(--color-card-border)] text-[var(--color-text-main)] flex flex-col my-auto transition-colors">
        {/* Header Banner */}
        <div className="relative bg-[var(--color-primary-light)] p-4 sm:p-5 border-b border-[var(--color-card-border)] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-[var(--color-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] transition-colors shadow-2xs cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-[var(--color-primary)]/20" />
                <span>Private Co-Parent Sync</span>
              </div>
              <h2 id="partner-sync-title" className="text-base sm:text-lg font-bold font-heading text-[var(--color-text-main)] leading-tight">
                Sync with Spouse or Partner
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[75vh] bg-[var(--color-canvas)]">
          {/* Quick Explanation */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-card-border)] shadow-2xs space-y-2">
            <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
              When you send this link, your partner opens it on her phone and <strong>gets {profile.name}’s records immediately</strong>:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{entries.length} Measurements</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>WHO Growth Curves</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Milestone History</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant Merge</span>
              </div>
            </div>
          </div>

          {/* Primary Action 1: Send via WhatsApp / Messages / SMS (Direct Native Share) */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>Send Link via WhatsApp / Messages</span>
            </button>
            <p className="text-[11px] text-center text-[var(--color-text-muted)]">
              Opens WhatsApp, iMessage, SMS, or AirDrop directly to your partner
            </p>
          </div>

          {/* Primary Action 2: Copy Link */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-card)] hover:bg-[var(--color-surface)] text-[var(--color-text-main)] font-semibold text-xs border border-[var(--color-card-border)] flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer active:scale-98"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    ✨ Copied! Ready to paste into your chat
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                  <span>Copy Private Sync Link</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Action 3: In-Person QR Code Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="w-full py-2 px-3 rounded-xl bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span>{showQr ? 'Hide QR Code' : 'Together in person? Scan QR Code'}</span>
            </button>

            {showQr && qrCodeDataUrl && (
              <div className="mt-3 p-4 bg-white keep-white rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
                <img
                  src={qrCodeDataUrl}
                  alt="Sync QR Code"
                  className="w-52 h-52 object-contain rounded-lg"
                />
                <p className="text-xs text-stone-700 font-bold mt-2.5">
                  Point your partner’s phone camera here
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  It opens {profile.name}’s tracker and syncs in 1 second.
                </p>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <strong>100% Private &amp; Local:</strong> Measurements travel safely inside the link without going through any external server or third-party cloud.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[var(--color-card-border)] bg-[var(--color-card)] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            TinyBloom &middot; Private Offline Sync
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-surface)] hover:opacity-85 text-[var(--color-text-main)] text-xs font-bold rounded-xl transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
