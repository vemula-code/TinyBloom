import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { TinyBloomLogo } from './TinyBloomLogo';
import { Smartphone, Download, Check, X, Copy, ExternalLink, Share2 } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const sharedProductionUrl = 'https://ais-dev-aqz7o4tyrwgxpak7f2uxxd-732291586868.us-west2.run.app';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : sharedProductionUrl;
  const appUrl = (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1') || currentUrl.includes('webcontainer') || currentUrl.includes('ais-pre'))
    ? sharedProductionUrl
    : currentUrl;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(appUrl)}&margin=1`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TinyBloom - Every Little Milestone Matters',
          text: 'Open TinyBloom on your phone to track baby growth with official WHO curves',
          url: appUrl,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (!success) {
      setShowModal(true);
    }
  };

  return (
    <>
      {isInstalled ? (
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] font-medium bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30 px-2.5 py-1 rounded-xl">
          <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>Installed</span>
        </span>
      ) : isInstallable ? (
        <button
          type="button"
          onClick={handleNativeInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[var(--color-primary)] hover:opacity-90 rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] bg-[var(--color-primary-light)] hover:opacity-85 rounded-xl transition-all border border-[var(--color-primary)]/30 whitespace-nowrap shrink-0 shadow-2xs active:scale-95 cursor-pointer"
          title="Install TinyBloom on Mobile (Android & iPhone)"
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {/* Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[var(--color-card)] text-[var(--color-text-main)] rounded-3xl shadow-2xl border border-[var(--color-card-border)] w-full max-w-lg overflow-hidden my-4 sm:my-6">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--color-card-border)] flex items-center justify-between bg-[var(--color-card)]">
              <div className="flex items-center gap-3">
                <TinyBloomLogo size={36} />
                <div>
                  <h2 className="text-base font-bold font-heading text-[var(--color-text-main)]">
                    Install TinyBloom on Mobile
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Native Standalone PWA · Offline First · Android & iPhone
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 bg-[var(--color-canvas)]">
              {/* Native Prompt button if browser allows it */}
              {isInstallable && (
                <div className="p-4 bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-text-main)]">
                      1-Tap Installation Ready
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Your browser supports instant standalone app installation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold hover:opacity-90 shadow-xs transition-opacity shrink-0 cursor-pointer"
                  >
                    Install Now
                  </button>
                </div>
              )}

              {/* Step 1: Open link on your phone */}
              <div>
                <h3 className="text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wider mb-2">
                  Step 1: Open TinyBloom on Your Phone
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl">
                  {/* QR Code */}
                  <div className="bg-white keep-white p-2 rounded-xl border border-[var(--color-card-border)] shadow-2xs shrink-0 text-center">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to open on phone"
                      className="w-24 h-24 mx-auto rounded-lg object-contain"
                    />
                    <span className="text-[10px] font-semibold text-slate-600 block mt-1">
                      Scan with Camera
                    </span>
                  </div>

                  {/* URL & Actions */}
                  <div className="w-full space-y-2">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Or send this link to your phone (via WhatsApp or text):
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-[var(--color-canvas)] border border-[var(--color-card-border)] rounded-xl">
                      <input
                        type="text"
                        readOnly
                        value={appUrl}
                        className="grow bg-transparent text-xs font-mono text-[var(--color-text-main)] focus:outline-hidden truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[var(--color-card)] hover:bg-[var(--color-surface)] border border-[var(--color-card-border)] rounded-lg text-xs font-semibold text-[var(--color-text-main)] transition-colors shrink-0 shadow-2xs cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-[var(--color-primary)]" />
                            <span className="text-[var(--color-primary)]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[var(--color-text-muted)]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-2xs cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share to Phone</span>
                      </button>
                      <a
                        href={appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--color-card)] text-[var(--color-text-main)] border border-[var(--color-card-border)] rounded-xl text-xs font-semibold hover:bg-[var(--color-surface)] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Add to Home Screen Instructions */}
              <div>
                <h3 className="text-xs font-bold font-heading text-[var(--color-text-main)] uppercase tracking-wider mb-2">
                  Step 2: Add to App Screen (Android & iPhone)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Android / Samsung */}
                  <div className="p-3.5 rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] space-y-1.5">
                    <span className="text-xs font-bold text-[var(--color-text-main)] block">
                      Samsung Internet / Chrome
                    </span>
                    <ol className="text-xs text-[var(--color-text-muted)] space-y-1 list-decimal list-inside leading-relaxed">
                      <li>Tap browser menu (<strong>☰</strong> or <strong>⋮</strong>)</li>
                      <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong></li>
                      <li>Tap <strong>Install</strong></li>
                    </ol>
                  </div>

                  {/* iPhone (Safari) */}
                  <div className="p-3.5 rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] space-y-1.5">
                    <span className="text-xs font-bold text-[var(--color-text-main)] block">
                      iPhone (Safari)
                    </span>
                    <ol className="text-xs text-[var(--color-text-muted)] space-y-1 list-decimal list-inside leading-relaxed">
                      <li>Tap the <strong>Share icon [↑]</strong> at bottom</li>
                      <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                      <li>Tap <strong>Add</strong> at top-right</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[var(--color-text-main)] bg-[var(--color-surface)] hover:opacity-85 rounded-xl transition-opacity cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
