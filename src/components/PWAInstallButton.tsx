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

  const sharedProductionUrl = 'https://ais-pre-aqz7o4tyrwgxpak7f2uxxd-732291586868.us-west2.run.app';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : sharedProductionUrl;
  const appUrl = (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1') || currentUrl.includes('webcontainer'))
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
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#3D5939] font-medium bg-[#91A98B]/20 border border-[#91A98B]/40 px-2.5 py-1 rounded-xl">
          <Check className="w-3.5 h-3.5 text-[#5D7C57]" />
          <span>Installed</span>
        </span>
      ) : isInstallable ? (
        <button
          type="button"
          onClick={handleNativeInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#91A98B] hover:bg-[#7D9977] rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[var(--color-primary-dark,#3A5235)] dark:text-[var(--color-primary,#86B880)] bg-[var(--color-primary,#91A98B)]/15 hover:bg-[var(--color-primary,#91A98B)]/25 rounded-xl transition-all border border-[var(--color-primary,#91A98B)]/30 whitespace-nowrap shrink-0 shadow-2xs active:scale-95 cursor-pointer"
          title="Install TinyBloom on Mobile (Android & iPhone)"
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {/* Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[#FFF9F0] dark:bg-[#1B2420] text-[var(--color-text-main)] rounded-3xl shadow-2xl border border-[#91A98B]/30 w-full max-w-lg overflow-hidden my-4 sm:my-6">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#91A98B]/20 flex items-center justify-between bg-white/70 dark:bg-[#141C18]/90">
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
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 bg-[#FFF9F0] dark:bg-[#1B2420]">
              {/* Native Prompt button if browser allows it */}
              {isInstallable && (
                <div className="p-4 bg-[#91A98B]/15 border border-[#91A98B]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#303832]">
                      1-Tap Installation Ready
                    </h4>
                    <p className="text-xs text-[#6E7B6C]">
                      Your browser supports instant standalone app installation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    className="px-4 py-2 bg-[#91A98B] text-white rounded-xl text-xs font-bold hover:bg-[#7D9977] shadow-xs transition-colors shrink-0"
                  >
                    Install Now
                  </button>
                </div>
              )}

              {/* Step 1: Open link on your phone */}
              <div>
                <h3 className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wider mb-2">
                  Step 1: Open TinyBloom on Your Phone
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-white border border-[#91A98B]/25 rounded-2xl">
                  {/* QR Code */}
                  <div className="bg-[#FFF9F0] p-2 rounded-xl border border-[#91A98B]/20 shadow-2xs shrink-0 text-center">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to open on phone"
                      className="w-24 h-24 mx-auto rounded-lg object-contain"
                    />
                    <span className="text-[10px] font-semibold text-[#6E7B6C] block mt-1">
                      Scan with Camera
                    </span>
                  </div>

                  {/* URL & Actions */}
                  <div className="w-full space-y-2">
                    <p className="text-xs text-[#6E7B6C]">
                      Or send this link to your phone (via WhatsApp or text):
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-[#FFF9F0] border border-[#91A98B]/30 rounded-xl">
                      <input
                        type="text"
                        readOnly
                        value={appUrl}
                        className="grow bg-transparent text-xs font-mono text-[#303832] focus:outline-hidden truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-stone-50 border border-[#91A98B]/30 rounded-lg text-xs font-semibold text-[#303832] transition-colors shrink-0 shadow-2xs"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-[#5D7C57]" />
                            <span className="text-[#5D7C57]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#6E7B6C]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#91A98B] text-white rounded-xl text-xs font-bold hover:bg-[#7D9977] transition-colors shadow-2xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share to Phone</span>
                      </button>
                      <a
                        href={appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-[#303832] border border-[#91A98B]/30 rounded-xl text-xs font-semibold hover:bg-[#FFF9F0] transition-colors"
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
                <h3 className="text-xs font-bold font-heading text-[#303832] uppercase tracking-wider mb-2">
                  Step 2: Add to App Screen (Android & iPhone)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Android / Samsung */}
                  <div className="p-3.5 rounded-2xl border border-[#91A98B]/25 bg-white space-y-1.5">
                    <span className="text-xs font-bold text-[#303832] block">
                      Samsung Internet / Chrome
                    </span>
                    <ol className="text-xs text-[#6E7B6C] space-y-1 list-decimal list-inside leading-relaxed">
                      <li>Tap browser menu (<strong>☰</strong> or <strong>⋮</strong>)</li>
                      <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong></li>
                      <li>Tap <strong>Install</strong></li>
                    </ol>
                  </div>

                  {/* iPhone (Safari) */}
                  <div className="p-3.5 rounded-2xl border border-[#91A98B]/25 bg-white space-y-1.5">
                    <span className="text-xs font-bold text-[#303832] block">
                      iPhone (Safari)
                    </span>
                    <ol className="text-xs text-[#6E7B6C] space-y-1 list-decimal list-inside leading-relaxed">
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
                  className="px-4 py-2 text-xs font-bold text-[#303832] bg-white border border-[#91A98B]/30 hover:bg-stone-50 rounded-xl transition-colors"
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
