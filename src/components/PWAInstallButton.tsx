import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { CuteBabyLogo } from './CuteBabyLogo';
import { Smartphone, Download, Check, X, Copy, ExternalLink, QrCode, Share2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isAndroid, isSamsung, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // App URL for sharing to phone
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
          title: 'DTracker - Dhruv’s Growth Tracker',
          text: 'Open DTracker on your phone to track Dhruv’s growth',
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
      {/* Top Bar / Mobile Header Trigger Button */}
      {isInstalled ? (
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
          <Check className="w-3.5 h-3.5" />
          <span>App Installed</span>
        </span>
      ) : isInstallable ? (
        <button
          type="button"
          onClick={handleNativeInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all border border-stone-200 whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
          <span>Install on Phone (Android & iPhone)</span>
        </button>
      )}

      {/* Samsung, Android & iPhone Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden my-6">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <CuteBabyLogo size={38} />
                <div>
                  <h2 className="text-base font-bold text-stone-900">
                    Install DTracker on Mobile (Android & iPhone)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Native Full-Screen App · Works Offline on Any Phone
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Native Prompt button if browser allows it */}
              {isInstallable && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-orange-950">
                      1-Tap Android Installation Ready
                    </h4>
                    <p className="text-xs text-orange-800">
                      Your browser supports instant WebAPK packaging.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 shadow-xs transition-colors shrink-0"
                  >
                    Install Now
                  </button>
                </div>
              )}

              {/* Step 1: Open link on your Samsung phone */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Step 1: Open DTracker on your Samsung Phone
                </h3>

                {/* Important notice about GitHub App */}
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 mb-3 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>💡</span>
                    <span>No GitHub App Needed:</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    The GitHub mobile app is only for viewing raw code files. You do not need to download or login to GitHub on your phone. Simply open the web link below in Chrome or Samsung Internet!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
                  {/* QR Code */}
                  <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs shrink-0 text-center">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to open on phone"
                      className="w-28 h-28 mx-auto rounded-lg object-contain"
                    />
                    <span className="text-[10px] font-medium text-stone-500 block mt-1">
                      Scan with Samsung Camera
                    </span>
                  </div>

                  {/* URL & Actions */}
                  <div className="w-full space-y-2">
                    <p className="text-xs text-stone-600">
                      Or copy and send this direct link to your phone (via WhatsApp, Quick Share, or text):
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-white border border-stone-200 rounded-xl">
                      <input
                        type="text"
                        readOnly
                        value={appUrl}
                        className="grow bg-transparent text-xs font-mono text-stone-700 focus:outline-hidden truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 transition-colors shrink-0 shadow-2xs"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-stone-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-colors shadow-xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Send / Share Link</span>
                      </button>
                      <a
                        href={appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold hover:bg-stone-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Direct</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Samsung Galaxy Instructions */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Step 2: Add to Samsung Apps & Home Screen
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Samsung Internet Browser */}
                  <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-1.5">
                    <span className="text-xs font-bold text-stone-900 block">
                      Samsung Internet
                    </span>
                    <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside leading-relaxed">
                      <li>Tap the <strong>☰ menu</strong> at bottom-right</li>
                      <li>Tap <strong>+ Add page to</strong></li>
                      <li>Choose <strong>App screen</strong> or <strong>Home screen</strong></li>
                      <li>Tap <strong>Install</strong></li>
                    </ol>
                  </div>

                  {/* Google Chrome on Android */}
                  <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-1.5">
                    <span className="text-xs font-bold text-stone-900 block">
                      Google Chrome
                    </span>
                    <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside leading-relaxed">
                      <li>Tap the <strong>⋮ three dots</strong> at top-right</li>
                      <li>Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>)</li>
                      <li>Tap <strong>Install</strong></li>
                      <li>Android generates the native app</li>
                    </ol>
                  </div>

                  {/* Apple iPhone (Safari) */}
                  <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-1.5 sm:col-span-2">
                    <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                      <span>🍎</span>
                      <span>Apple iPhone (Safari)</span>
                    </span>
                    <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside leading-relaxed">
                      <li>Open the link in <strong>Safari</strong> on your iPhone</li>
                      <li>Tap the <strong>Share button [↑]</strong> (the square with an arrow pointing up at the bottom)</li>
                      <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                      <li>Tap <strong>Add</strong> in the top-right corner to install</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Why WebAPK is better than a manual APK file */}
              <div className="p-3.5 bg-stone-100/80 rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-1">
                <span className="font-semibold text-stone-800 block">
                  Why this is better than downloading an untrusted APK file:
                </span>
                <p>
                  Android’s native WebAPK engine packages DTracker directly into your Samsung Galaxy’s app drawer with its own app icon, splash screen, zero browser address bar, and offline local storage. No developer mode, ADB commands, or APK installation warnings needed!
                </p>
              </div>

              {/* Close button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
