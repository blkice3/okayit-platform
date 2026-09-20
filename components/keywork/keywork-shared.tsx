'use client';

// Shared pieces for the Staying Safe Online session.
// One speech engine, a read aloud button, the always on
// help routes, and the persistent Stop control.

import React, { createContext, useContext } from 'react';
import { Volume2, VolumeX, Phone, Globe, LifeBuoy, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HELPLINES, Helpline } from '@/lib/keywork/staying-safe-online-config';
import { useSpeech } from './use-speech';

// ---- One shared speech engine for the whole session ----
type SpeechApi = ReturnType<typeof useSpeech>;
const SpeechCtx = createContext<SpeechApi | null>(null);

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const speech = useSpeech();
  return <SpeechCtx.Provider value={speech}>{children}</SpeechCtx.Provider>;
}

export function useSpeechCtx(): SpeechApi {
  const ctx = useContext(SpeechCtx);
  if (ctx) return ctx;
  // Safe fallback so the button never crashes.
  return { supported: false, speaking: false, speak: () => {}, stop: () => {} };
}

// ---- Read aloud button ----
export function SpeakButton({ text, label }: { text: string; label?: string }) {
  const { supported, speaking, speak } = useSpeechCtx();
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={label || 'Read this aloud'}
      className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3 py-1.5 text-sm font-medium text-purple-700 shadow-sm transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span>{speaking ? 'Stop reading' : 'Read aloud'}</span>
    </button>
  );
}

// ---- Help routes, reachable from every screen ----
function HelplineCard({ h }: { h: Helpline }) {
  return (
    <div className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-base font-bold text-gray-900">{h.name}</h4>
      </div>
      <p className="mt-1 text-sm text-gray-700">{h.what}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {h.phone && (
          <a
            href={`tel:${h.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <Phone className="h-4 w-4" /> Call {h.phone}
          </a>
        )}
        {h.web && (
          <a
            href={h.web}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 bg-white px-3 py-1.5 text-sm font-semibold text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <Globe className="h-4 w-4" /> Open website
          </a>
        )}
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-1 text-xs text-gray-600">
        <div><span className="font-semibold text-gray-800">When: </span>{h.hours}</div>
        <div><span className="font-semibold text-gray-800">Who for: </span>{h.ageEligibility}</div>
        <div><span className="font-semibold text-gray-800">How: </span>{h.contactMethods}</div>
      </dl>
    </div>
  );
}

export function HelplineDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <LifeBuoy className="h-5 w-5 text-purple-600" /> Get help now
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-700">
          These are free and private. You can use any of them, any time.
        </p>
        <div className="mt-2 space-y-3">
          {HELPLINES.map((h) => <HelplineCard key={h.id} h={h} />)}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- The persistent Stop control ----
// Large, always visible, one tap, no confirmation.
export function StopButton({ onStop }: { onStop: () => void }) {
  return (
    <button
      type="button"
      onClick={onStop}
      aria-label="Stop the session now"
      className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-base font-bold text-white shadow-lg transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300"
    >
      <X className="h-5 w-5" /> Stop
    </button>
  );
}
