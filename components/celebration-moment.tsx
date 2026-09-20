'use client';

/**
 * CelebrationMoment — a gentle, trauma-informed celebration overlay.
 *
 * Shown briefly when a young person completes something meaningful
 * (a check-in, a reflection). Designed to feel warm and encouraging,
 * never loud or overwhelming. Fully respects reduced-motion: when the
 * user has calmer visuals enabled, we show a soft static message with
 * no moving particles.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, Sun, Smile } from 'lucide-react';

interface CelebrationMomentProps {
  show: boolean;
  /** Optional custom message. A kind default is chosen if omitted. */
  message?: string;
  /** Called when the celebration finishes (auto-dismiss). */
  onDone?: () => void;
  /** How long to stay on screen (ms). Default 2600. */
  duration?: number;
}

const KIND_MESSAGES = [
  'Well done for checking in ❤️',
  'Thank you for looking after yourself',
  'That took courage, nice one',
  'You showed up for yourself today',
  'Proud of you for that',
  'Every little step counts',
];

const ICONS = [Sparkles, Heart, Star, Sun, Smile];

export default function CelebrationMoment({ show, message, onDone, duration = 2600 }: CelebrationMomentProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setReduceMotion(document.documentElement.classList.contains('reduce-motion'));
    }
  }, [show]);

  // Pick a kind message once per show
  const chosen = useMemo(() => {
    if (message) return message;
    return KIND_MESSAGES[Math.floor(Math.random() * KIND_MESSAGES.length)];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, message]);

  // Particle definitions (deterministic per render so SSR is not involved — this is client-only)
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      Icon: ICONS[i % ICONS.length],
      x: (Math.random() * 2 - 1) * 160,
      y: -(Math.random() * 180 + 60),
      rotate: Math.random() * 180 - 90,
      delay: Math.random() * 0.25,
      scale: 0.6 + Math.random() * 0.7,
      color: ['text-pink-400', 'text-purple-400', 'text-amber-400', 'text-rose-400', 'text-fuchsia-400'][i % 5],
    }));
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-live="polite"
          role="status"
        >
          {/* Soft glow backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Particle burst (skipped when reduced motion) */}
          {!reduceMotion && (
            <div className="absolute" style={{ top: '50%', left: '50%' }}>
              {particles.map((p) => {
                const P = p.Icon;
                return (
                  <motion.div
                    key={p.id}
                    className={`absolute ${p.color}`}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 0 }}
                    animate={{ x: p.x, y: p.y, opacity: [0, 1, 1, 0], scale: p.scale, rotate: p.rotate }}
                    transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
                  >
                    <P className="w-6 h-6 fill-current" />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Message card */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl px-6 py-5 mx-6 max-w-xs text-center border border-purple-100"
            initial={{ scale: reduceMotion ? 1 : 0.7, opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: reduceMotion ? 1 : 0.9, opacity: 0 }}
            transition={{ type: reduceMotion ? 'tween' : 'spring', stiffness: 220, damping: 18 }}
          >
            <motion.div
              className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              animate={reduceMotion ? {} : { scale: [1, 1.12, 1] }}
              transition={{ duration: 1.2, repeat: 1 }}
            >
              <Heart className="w-7 h-7 text-white fill-white" />
            </motion.div>
            <p className="text-base font-bold text-gray-800">{chosen}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
