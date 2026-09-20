'use client';

// Persistent, calm Help control + the protective (crisis) route.
// The resting control is never alarm-red. The protective route takes over the
// whole screen and offers only helplines and the adult on shift.
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, X, Phone, ShieldAlert, HeartHandshake } from 'lucide-react';
import { HELPLINES, RESCUE } from './yp-config';

export function HelpButton({ onOpen, accent }: { onOpen: () => void; accent: string }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Get help"
      className="fixed right-4 bottom-28 z-[9997] inline-flex items-center gap-2 min-h-[48px] px-4 rounded-full text-white font-semibold text-[15px] yp-card-press"
      style={{ background: accent, boxShadow: 'var(--yp-shadow-md)' }}
    >
      <LifeBuoy className="w-5 h-5" aria-hidden="true" />
      <span>Help</span>
    </button>
  );
}

function CallRow({ line }: { line: typeof HELPLINES[number] }) {
  return (
    <a
      href={line.href}
      className="flex items-center gap-3 min-h-[56px] px-4 rounded-2xl yp-card"
    >
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full shrink-0 yp-tint2" style={{ color: 'var(--yp-ink)' }}>
        <Phone className="w-5 h-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>{line.name}</span>
        <span className="block text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>{line.number} · {line.line}</span>
      </span>
    </a>
  );
}

export function HelpSheet({
  open, onClose, onProtective, homeName,
}: { open: boolean; onClose: () => void; onProtective: () => void; homeName: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
          <motion.div
            role="dialog" aria-label="Get help"
            className="relative w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] overflow-hidden yp-elev"
            style={{ background: 'var(--yp-surface)' }}
            initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--yp-line)' }}>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5" style={{ color: RESCUE }} aria-hidden="true" />
                <h2 className="font-semibold text-[17px]" style={{ color: 'var(--yp-ink)' }}>Getting help</h2>
              </div>
              <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 rounded-full" style={{ color: 'var(--yp-ink-soft)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <p className="text-[15px]" style={{ color: 'var(--yp-ink-soft)' }}>
                An adult is on shift at {homeName || 'your home'} right now. You can go to them any time.
                These lines are free and private, and you will not get in trouble for calling.
              </p>
              {HELPLINES.map((l) => <CallRow key={l.name} line={l} />)}

              <button
                onClick={onProtective}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 min-h-[52px] rounded-2xl font-semibold text-white yp-card-press"
                style={{ background: RESCUE }}
              >
                <ShieldAlert className="w-5 h-5" aria-hidden="true" /> I do not feel safe right now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProtectiveRoute({ open, onClose, homeName }: { open: boolean; onClose: () => void; homeName: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog" aria-label="You are not alone"
          className="fixed inset-0 z-[10000] flex flex-col"
          style={{ background: '#2A1A08' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8 max-w-md w-full mx-auto">
            <h1 className="text-white text-2xl font-semibold">You are not on your own.</h1>
            <p className="mt-2 text-[16px]" style={{ color: '#F3E8D6' }}>
              There is an adult on shift at {homeName || 'your home'} right now. Go to them, or tap a line below. All calls are free.
            </p>
            <div className="mt-6 space-y-3">
              {HELPLINES.map((l) => (
                <a key={l.name} href={l.href}
                  className="flex items-center gap-3 min-h-[64px] px-4 rounded-2xl bg-white">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-full shrink-0" style={{ background: '#FDEBD3', color: RESCUE }}>
                    <Phone className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[17px]" style={{ color: '#23252B' }}>{l.name}</span>
                    <span className="block text-[14px]" style={{ color: '#5B5F6B' }}>{l.number} · {l.line}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="px-6 pb-8 max-w-md w-full mx-auto">
            <button onClick={onClose}
              className="w-full min-h-[52px] rounded-2xl font-semibold text-white border"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              I am OK for now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
