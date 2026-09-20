'use client';

/**
 * MoodResponseBanner — the platform's warm, adaptive response to today's check-in.
 *
 * - Before a check-in: a gentle invitation to check in.
 * - After a check-in: an encouraging, mood-tailored message with a few
 *   suggested places to go next, plus a small 'boost' idea for the day.
 *
 * Colour and tone shift with the mood band but stay calm and readable in
 * both light and dark mode. Fully respects reduced-motion via CSS.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { useMoodResponse, getMoodConfig } from '@/lib/mood-response';

interface MoodResponseBannerProps {
  userName?: string;
  onSelect: (sectionId: string) => void;
  /** Section id that opens the daily check-in. */
  checkInSectionId?: string;
  className?: string;
}

export default function MoodResponseBanner({
  userName = 'friend',
  onSelect,
  checkInSectionId = 'personal-wellbeing',
  className = '',
}: MoodResponseBannerProps) {
  const { today, hydrated } = useMoodResponse();

  // Avoid a hydration flash — render nothing until we've read localStorage.
  if (!hydrated) return null;

  // No check-in yet today — a gentle, no-pressure invitation.
  if (!today) {
    return (
      <motion.button
        type="button"
        onClick={() => onSelect(checkInSectionId)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full text-left rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/30 p-4 shadow-sm hover:shadow-md transition-all ${className}`}
        aria-label="Start today's check-in"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              How are you feeling today, {userName}?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              A quick check-in, no pressure, just you and how today feels.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-500 dark:text-purple-300 flex-shrink-0" />
        </div>
      </motion.button>
    );
  }

  const cfg = getMoodConfig(today.level, userName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${cfg.border} ${cfg.softBg} ${cfg.softBgDark} p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.accentGradient} flex items-center justify-center shadow-md flex-shrink-0 text-xl`}
          aria-hidden="true"
        >
          <span>{cfg.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100 leading-snug">
            {cfg.headline}
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
            {cfg.message}
          </p>
        </div>
      </div>

      {/* Mood-tailored suggestions */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cfg.suggestions.map((s) => (
          <button
            key={s.sectionId}
            type="button"
            onClick={() => onSelect(s.sectionId)}
            className="text-left rounded-xl bg-white/80 dark:bg-gray-900/50 border border-white/60 dark:border-gray-700 px-3 py-2.5 hover:bg-white dark:hover:bg-gray-800 transition-colors group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{s.label}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${cfg.textAccent} group-hover:translate-x-0.5 transition-transform flex-shrink-0`} />
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">{s.reason}</p>
          </button>
        ))}
      </div>

      {/* Fun daily 'boost' */}
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-white/70 dark:bg-gray-900/40 px-3 py-2">
        <Sparkles className={`w-4 h-4 ${cfg.textAccent} flex-shrink-0 mt-0.5`} />
        <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">{cfg.boost}</p>
      </div>

      {/* Re-check-in link */}
      <button
        type="button"
        onClick={() => onSelect(checkInSectionId)}
        className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold ${cfg.textAccent} hover:underline`}
      >
        <RefreshCw className="w-3 h-3" />
        Feelings changed? Check in again
      </button>
    </motion.div>
  );
}
