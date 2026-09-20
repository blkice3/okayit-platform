'use client';

/**
 * MoodResponse — a lightweight, privacy-first, app-wide system that lets the
 * WHOLE platform gently respond to a young person's most recent daily check-in.
 *
 * How it works:
 *  - When a check-in completes, `setTodayMood(level, moodId)` is called.
 *  - The outcome is stored in localStorage (date-stamped, resets each new day)
 *    so no personal data leaves the device.
 *  - A `data-mood` attribute is set on <html> so styling anywhere can respond.
 *  - Any component can read the current mood via `useMoodResponse()` and adapt
 *    its content (tailored resources, tone, colour) to how the child is feeling.
 *
 * Trauma-informed: tone is always warm and never alarming, even for low moods.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type MoodBand = 'low' | 'mid' | 'high';

export interface TodayMood {
  level: number; // 1-5
  moodId: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
}

const STORAGE_KEY = 'okayit_today_mood';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function bandForLevel(level: number): MoodBand {
  if (level <= 2) return 'low';
  if (level === 3) return 'mid';
  return 'high';
}

function applyAmbient(band: MoodBand | null) {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  if (band) el.setAttribute('data-mood', band);
  else el.removeAttribute('data-mood');
}

interface MoodResponseValue {
  today: TodayMood | null;
  band: MoodBand | null;
  hydrated: boolean;
  setTodayMood: (level: number, moodId: string) => void;
  clearTodayMood: () => void;
}

const MoodResponseContext = createContext<MoodResponseValue | null>(null);

export function MoodResponseProvider({ children }: { children: React.ReactNode }) {
  const [today, setToday] = useState<TodayMood | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: TodayMood = JSON.parse(raw);
        if (parsed && parsed.date === todayStr()) {
          setToday(parsed);
          applyAmbient(bandForLevel(parsed.level));
        } else {
          localStorage.removeItem(STORAGE_KEY);
          applyAmbient(null);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setTodayMood = useCallback((level: number, moodId: string) => {
    const val: TodayMood = {
      level,
      moodId,
      date: todayStr(),
      timestamp: new Date().toISOString(),
    };
    setToday(val);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch {
      /* storage full */
    }
    applyAmbient(bandForLevel(level));
  }, []);

  const clearTodayMood = useCallback(() => {
    setToday(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    applyAmbient(null);
  }, []);

  const band = today ? bandForLevel(today.level) : null;

  return (
    <MoodResponseContext.Provider value={{ today, band, hydrated, setTodayMood, clearTodayMood }}>
      {/* Subtle, whole-app ambient wash that reflects today's mood (behind content). */}
      <div className="mood-ambient" aria-hidden="true" />
      {children}
    </MoodResponseContext.Provider>
  );
}

export function useMoodResponse(): MoodResponseValue {
  const ctx = useContext(MoodResponseContext);
  if (!ctx) {
    // Graceful no-op fallback if used outside the provider
    return {
      today: null,
      band: null,
      hydrated: false,
      setTodayMood: () => {},
      clearTodayMood: () => {},
    };
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Presentation config — what the platform says & suggests for each mood band.
// ---------------------------------------------------------------------------

export interface MoodSuggestion {
  sectionId: string;
  label: string;
  reason: string;
}

export interface MoodConfig {
  band: MoodBand;
  emoji: string;
  label: string;
  headline: string;
  message: string;
  /** Tailwind gradient for accents, e.g. 'from-indigo-500 to-blue-500' */
  accentGradient: string;
  /** Soft light background tint, e.g. 'bg-indigo-50' */
  softBg: string;
  softBgDark: string;
  border: string;
  textAccent: string;
  suggestions: MoodSuggestion[];
  /** A short, gently fun 'boost' idea for today. */
  boost: string;
}

const MOOD_LABELS: Record<number, string> = {
  5: 'amazing',
  4: 'good',
  3: 'okay',
  2: 'a bit low',
  1: 'really low',
};

const MOOD_EMOJIS: Record<number, string> = {
  5: '😄',
  4: '🙂',
  3: '😐',
  2: '😔',
  1: '💜',
};

export function getMoodConfig(level: number, name: string = 'friend'): MoodConfig {
  const band = bandForLevel(level);
  const label = MOOD_LABELS[level] || 'okay';
  const emoji = MOOD_EMOJIS[level] || '😐';
  const firstName = name && name !== 'Guest' ? name : 'friend';

  if (band === 'low') {
    return {
      band,
      emoji,
      label,
      headline: `Thank you for being honest, ${firstName}.`,
      message:
        "Hard days are allowed, and you don't have to get through them on your own. Let's take the next few minutes gently.",
      accentGradient: 'from-indigo-500 to-sky-500',
      softBg: 'bg-indigo-50',
      softBgDark: 'dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800',
      textAccent: 'text-indigo-700 dark:text-indigo-300',
      suggestions: [
        { sectionId: 'calm-corner', label: 'Calm Corner', reason: 'Breathe and settle in a quiet space' },
        { sectionId: 'support-center', label: 'Get Help Anytime', reason: 'Someone to talk to, any time' },
        { sectionId: 'safety-plan', label: 'My Safety Plan', reason: 'Your people and places that help' },
      ],
      boost: 'One small kind thing counts today — a glass of water, a favourite song, or one slow breath. 💜',
    };
  }

  if (band === 'mid') {
    return {
      band,
      emoji,
      label,
      headline: `Doing okay is okay, ${firstName}.`,
      message:
        "A steady day is a good place to be. If you fancy it, here are a couple of things that might lift it a little.",
      accentGradient: 'from-amber-500 to-orange-500',
      softBg: 'bg-amber-50',
      softBgDark: 'dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      textAccent: 'text-amber-700 dark:text-amber-300',
      suggestions: [
        { sectionId: 'calm-corner', label: 'Calm Corner', reason: 'A gentle reset whenever you need it' },
        { sectionId: 'reflection-toolkit', label: 'Reflection Space', reason: 'Think it through, your way' },
        { sectionId: 'family-gaming', label: 'Games & Fun', reason: 'A little play goes a long way' },
      ],
      boost: 'Tiny-win idea: tidy one small thing, or message someone you like. Small steps, big difference. ✨',
    };
  }

  return {
    band,
    emoji,
    label,
    headline: `Love that you're feeling ${label}, ${firstName}! 🎉`,
    message:
      "Brilliant — let's make the most of a good day, and maybe capture it so you can look back on it later.",
    accentGradient: 'from-emerald-500 to-green-500',
    softBg: 'bg-emerald-50',
    softBgDark: 'dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    textAccent: 'text-emerald-700 dark:text-emerald-300',
    suggestions: [
      { sectionId: 'family-gaming', label: 'Games & Fun', reason: 'Ride the good-day wave' },
      { sectionId: 'reflection-toolkit', label: 'Capture the Moment', reason: 'Note what made today good' },
      { sectionId: 'achievements', label: 'My Certificates', reason: 'See how far you have come' },
    ],
    boost: 'Good-day challenge: do one thing future-you will thank you for. 🌟',
  };
}
