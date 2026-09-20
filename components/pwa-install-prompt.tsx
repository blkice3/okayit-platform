'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Plus, Smartphone } from 'lucide-react';
import Image from 'next/image';

const STORAGE_KEY = 'okayit-install-prompt-state-v1';
const DISMISS_DAYS = 14; // re-ask after this many days
const DELAY_MS = 25_000; // wait 25s after first interaction before prompting

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS
  // @ts-expect-error non-standard Safari property
  if (window.navigator.standalone) return true;
  // Others
  return window.matchMedia('(display-mode: standalone)').matches;
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua);
}

function isSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
}

function shouldShowBasedOnStorage(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const state = JSON.parse(raw) as { dismissedAt?: number; installed?: boolean };
    if (state.installed) return false;
    if (!state.dismissedAt) return true;
    const age = Date.now() - state.dismissedAt;
    return age > DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function persistState(state: { dismissedAt?: number; installed?: boolean }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'android' | 'ios' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalone()) return; // already installed, nothing to do
    if (!shouldShowBasedOnStorage()) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleBip = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      timer = setTimeout(() => {
        setMode('android');
        setShow(true);
      }, DELAY_MS);
    };

    const handleInstalled = () => {
      persistState({ installed: true });
      setShow(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBip);
    window.addEventListener('appinstalled', handleInstalled);

    // iOS Safari: no beforeinstallprompt – show our own prompt after delay
    if (isIOS() && isSafari()) {
      timer = setTimeout(() => {
        setMode('ios');
        setShow(true);
      }, DELAY_MS);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBip);
      window.removeEventListener('appinstalled', handleInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const close = (remember: boolean = true) => {
    setShow(false);
    if (remember) persistState({ dismissedAt: Date.now() });
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        persistState({ installed: true });
      } else {
        persistState({ dismissedAt: Date.now() });
      }
    } catch {
      /* ignore */
    } finally {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pwa-prompt"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 220 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[60] pointer-events-auto"
          role="dialog"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-desc"
        >
          <div className="relative bg-white rounded-2xl shadow-2xl border border-violet-100 overflow-hidden">
            <button
              aria-label="Close install prompt"
              onClick={() => close(true)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-5 pr-12">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md">
                  <Image
                    src="/icon-192x192.png"
                    alt="OKAYiT"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    id="pwa-install-title"
                    className="text-base font-bold text-gray-900 leading-tight"
                  >
                    Add OKAYiT to your home screen
                  </h3>
                  <p id="pwa-install-desc" className="mt-1 text-xs text-gray-600 leading-relaxed">
                    Open it instantly like an app, get splash screens, and work offline.
                  </p>
                </div>
              </div>

              {mode === 'android' && deferredPrompt && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => close(true)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition"
                  >
                    Not now
                  </button>
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow hover:shadow-lg active:scale-95 transition"
                  >
                    <Download className="w-4 h-4" />
                    Install
                  </button>
                </div>
              )}

              {mode === 'ios' && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-violet-50 p-3 text-xs text-violet-900 leading-relaxed">
                    <div className="flex items-center gap-2 font-semibold mb-2">
                      <Smartphone className="w-4 h-4" />
                      How to install on iPhone / iPad
                    </div>
                    <ol className="space-y-1.5 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-violet-200 text-violet-800 text-[10px] font-bold inline-flex items-center justify-center">1</span>
                        <span>Tap <Share className="inline w-3.5 h-3.5 align-text-bottom" /> <b>Share</b> in the Safari menu bar.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-violet-200 text-violet-800 text-[10px] font-bold inline-flex items-center justify-center">2</span>
                        <span>Scroll and tap <Plus className="inline w-3.5 h-3.5 align-text-bottom" /> <b>Add to Home Screen</b>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-violet-200 text-violet-800 text-[10px] font-bold inline-flex items-center justify-center">3</span>
                        <span>Tap <b>Add</b>, OKAYiT will appear on your home screen.</span>
                      </li>
                    </ol>
                  </div>
                  <button
                    onClick={() => close(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-violet-700 rounded-xl hover:bg-violet-50 transition"
                  >
                    Got it
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
