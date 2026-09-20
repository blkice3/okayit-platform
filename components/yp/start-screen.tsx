'use client';

// Home — the premium hub. One question at the top (how are you feeling),
// then a calm, tidy menu of everything. No numbers, no progress bar, ever.
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check, Compass } from 'lucide-react';
import { useMoodResponse } from '@/lib/mood-response';
import {
  MOOD_STATES, MENU, GET_STARTED, greetingFor, firstNameOf, type Skin, type TabId,
} from './yp-config';

interface StartScreenProps {
  user: any;
  accent: string;
  homeName: string;
  homeId?: string | null;
  skin: Skin;
  onSwitchTab: (t: TabId) => void;
  onOpenContent: (key: string) => void;
  onNeedHelp: () => void;
}

interface NextStep { label: string; run: () => void; }

function recordMoodHistory(mood: string, moodLevel: number) {
  try {
    const KEY = 'okayit_mood_history';
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(KEY);
    const arr: any[] = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((e) => String(e.date).split('T')[0] === today);
    const entry = { date: new Date().toISOString(), mood, moodLevel };
    if (idx >= 0) arr[idx] = entry; else arr.push(entry);
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch { /* offline / private mode, fine */ }
}

export default function StartScreen({
  user, accent, homeName, skin, onSwitchTab, onOpenContent, onNeedHelp,
}: StartScreenProps) {
  const { today, setTodayMood, hydrated } = useMoodResponse();
  const [mounted, setMounted] = useState(false);
  const [hour, setHour] = useState(9);
  const [justPicked, setJustPicked] = useState<number | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHour(new Date().getHours());
  }, []);

  const firstName = firstNameOf(user);
  const answeredLevel = today?.level ?? justPicked ?? null;

  const nextStep: NextStep | null = useMemo(() => {
    if (answeredLevel == null) return null;
    if (answeredLevel <= 2) return { label: 'Talk to someone', run: onNeedHelp };
    if (answeredLevel === 3) return { label: 'Take a quiet moment', run: () => onOpenContent('calm') };
    return { label: 'Do something you enjoy', run: () => onSwitchTab('explore') };
  }, [answeredLevel, onNeedHelp, onOpenContent, onSwitchTab]);

  const reflectLine = useMemo(() => {
    if (answeredLevel == null) return '';
    const s = MOOD_STATES.find((m) => m.level === answeredLevel);
    return s ? s.reflect(firstName) : '';
  }, [answeredLevel, firstName]);

  const pick = (level: number, id: string) => {
    setJustPicked(level);
    setSkipped(false);
    setTodayMood(level, id);
    recordMoodHistory(id, level);
  };

  if (!mounted) {
    return <div className="min-h-[60vh]" aria-hidden="true" />;
  }

  const greeting = greetingFor(hour);
  const alreadyAnswered = hydrated && !!today && justPicked == null;
  const showReflection = answeredLevel != null;
  const younger = skin === 'younger';

  return (
    <div className="px-5 pt-6 pb-10 max-w-md mx-auto">
      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="text-[30px] leading-[1.1] tracking-tight"
        style={{ fontFamily: 'var(--yp-display)', color: 'var(--yp-ink)' }}
      >
        {greeting}{firstName ? `, ${firstName}` : ''}.
      </motion.h1>

      {/* The one question — a warm hero card, at the top */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="mt-5 rounded-[26px] p-5 yp-card yp-elev"
      >
        <p className={younger ? 'text-[23px]' : 'text-[21px]'} style={{ fontFamily: 'var(--yp-display)', color: 'var(--yp-ink)' }}>
          {younger ? 'How are you feeling today?' : 'How is today going?'}
        </p>

        <div className="mt-5 grid grid-cols-5 gap-2" role="group" aria-label="How are you feeling">
          {MOOD_STATES.map((m) => {
            const active = answeredLevel === m.level;
            const Icon = m.Icon;
            return (
              <button
                key={m.level}
                onClick={() => pick(m.level, m.id)}
                aria-pressed={active}
                aria-label={m.label}
                className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 yp-card-press transition-colors ${younger ? 'min-h-[86px]' : 'min-h-[74px]'}`}
                style={{
                  border: active ? `1px solid ${accent}` : '1px solid var(--yp-line)',
                  background: active ? accent : 'var(--yp-surface-2)',
                }}
              >
                <Icon className={younger ? 'w-8 h-8' : 'w-7 h-7'} style={{ color: active ? '#FFFFFF' : 'var(--yp-ink-soft)' }} aria-hidden="true" />
                <span className="text-[12px] font-medium" style={{ color: active ? '#FFFFFF' : 'var(--yp-ink-soft)' }}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reflection + the ONE next step */}
        {showReflection && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} aria-hidden="true" />
              <p className="text-[17px]" style={{ color: 'var(--yp-ink)' }}>
                {alreadyAnswered ? 'You checked in earlier today. ' : ''}{reflectLine}
              </p>
            </div>
            {nextStep && (
              <button
                onClick={nextStep.run}
                className="mt-4 w-full inline-flex items-center justify-between min-h-[52px] px-5 rounded-2xl font-semibold text-white yp-card-press"
                style={{ background: accent }}
              >
                <span>{nextStep.label}</span>
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
            {alreadyAnswered && (
              <button
                onClick={() => { setJustPicked(today!.level); }}
                className="mt-3 w-full text-[15px] font-medium"
                style={{ color: 'var(--yp-ink-soft)' }}
              >
                Change how I said I feel
              </button>
            )}
          </motion.div>
        )}

        {/* Skip — always allowed, never mentioned again */}
        {!showReflection && !skipped && (
          <button
            onClick={() => setSkipped(true)}
            className="mt-4 w-full text-center min-h-[44px] text-[15px] font-medium"
            style={{ color: 'var(--yp-ink-soft)' }}
          >
            I'd rather not say
          </button>
        )}
        {skipped && !showReflection && (
          <p className="mt-4 text-center text-[16px]" style={{ color: 'var(--yp-ink-soft)' }}>
            That's OK. This is here whenever you want it.
          </p>
        )}
      </motion.section>

      {/* Get started — four bright first steps */}
      <section className="mt-8">
        <h2 className="px-1 flex items-center gap-2 text-[17px] font-bold" style={{ color: 'var(--yp-ink)', fontFamily: 'var(--yp-display)' }}>
          <span className="text-[19px]" aria-hidden="true">✨</span>
          Get started
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {GET_STARTED.map((it, i) => {
            const Icon = it.Icon;
            return (
              <motion.button
                key={it.key}
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.03 * i }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenContent(it.key)}
                className="relative overflow-hidden text-left rounded-[24px] p-4 flex flex-col gap-3 min-h-[136px] text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${it.from}, ${it.to})` }}
              >
                <span aria-hidden="true" className="pointer-events-none absolute -right-5 -top-6 w-20 h-20 rounded-full bg-white/20" />
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm text-white">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <span className="mt-auto relative">
                  <span className="block font-bold text-[15px] leading-tight text-white">{it.label}</span>
                  <span className="block text-[13px] mt-0.5 leading-snug text-white/90">{it.line}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* The menu — every feature, in bright, playful groups */}
      {MENU.map((section, si) => (
        <section key={section.title} className="mt-8">
          <h2 className="px-1 flex items-center gap-2 text-[17px] font-bold" style={{ color: 'var(--yp-ink)', fontFamily: 'var(--yp-display)' }}>
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-[17px]"
              style={{ background: `color-mix(in srgb, ${section.tone} 18%, var(--yp-surface))` }}
              aria-hidden="true"
            >
              {section.emoji}
            </span>
            {section.title}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {section.items.map((it, i) => {
              const Icon = it.Icon;
              return (
                <motion.button
                  key={it.key}
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.02 * (i + si) }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onOpenContent(it.key)}
                  className="relative overflow-hidden text-left rounded-[22px] p-4 flex flex-col gap-3 min-h-[128px]"
                  style={{
                    background: `color-mix(in srgb, ${it.tone} 12%, var(--yp-surface))`,
                    border: `1px solid color-mix(in srgb, ${it.tone} 24%, transparent)`,
                    boxShadow: 'var(--yp-shadow-sm)',
                  }}
                >
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-sm" style={{ background: it.tone }}>
                    <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
                  </span>
                  <span className="mt-auto">
                    <span className="block font-semibold text-[15px] leading-tight" style={{ color: 'var(--yp-ink)' }}>{it.label}</span>
                    <span className="block text-[13px] mt-0.5 leading-snug" style={{ color: 'var(--yp-ink-soft)' }}>{it.line}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>
      ))}

      {/* Look around — a delightful, bright way into the house */}
      <button
        onClick={() => onSwitchTab('explore')}
        className="relative overflow-hidden mt-8 w-full flex items-center gap-3 min-h-[72px] px-5 rounded-[24px] text-left text-white shadow-lg yp-card-press"
        style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 55%, #06B6D4))` }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-8 w-24 h-24 rounded-full bg-white/15" />
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm text-white">
          <Compass className="w-6 h-6" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 relative">
          <span className="block font-bold text-[16px] text-white">Look around your home</span>
          <span className="block text-[14px] text-white/90">Wander the rooms at {homeName}</span>
        </span>
        <ChevronRight className="w-5 h-5 shrink-0 text-white" aria-hidden="true" />
      </button>
    </div>
  );
}
