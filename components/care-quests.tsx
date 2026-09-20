'use client';

/**
 * CareQuests — OKAYiT's flagship gamified learning adventure.
 *
 * Nine fun, age-appropriate quests, one per Quality Standard (Children's Homes
 * Regulations 2015 — the framework Ofsted inspects). Young people learn their
 * rights and what good care looks like through interactive quizzes with instant
 * feedback, earn XP / levels / badges, keep a daily streak, and share their own
 * voice in a reflection on every quest (evidence for the children's-views
 * standard). Everything is stored privately on the device.
 *
 * Trauma-informed, warm, and never alarming. Light-first, fully accessible,
 * and it gently reacts to today's mood check-in.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Trophy, Flame, Star, Lock,
  Sparkles, RotateCcw, PartyPopper, Award, Heart, Save, Check, X,
} from 'lucide-react';
import {
  QUESTS, Quest, levelForXp, MILESTONE_BADGES,
  XP_PER_CORRECT, XP_COMPLETE_BONUS, XP_REFLECTION,
} from '@/lib/quests-data';
import { useMoodResponse } from '@/lib/mood-response';

interface CareQuestsProps {
  onBack: () => void;
  user?: any;
}

interface QuestSave {
  completed: string[];
  xp: number;
  reflections: Record<string, string>;
  badges: string[];
  lastActiveDate: string;
  streak: number;
}

const STORAGE_KEY = 'okayit_quests';

const COLOURS: Record<Quest['colour'], { grad: string; soft: string; text: string; ring: string; chip: string }> = {
  purple: { grad: 'from-purple-500 to-fuchsia-500', soft: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200', chip: 'bg-purple-100 text-purple-700' },
  blue:   { grad: 'from-blue-500 to-sky-500',        soft: 'bg-blue-50',   text: 'text-blue-700',   ring: 'ring-blue-200',   chip: 'bg-blue-100 text-blue-700' },
  green:  { grad: 'from-emerald-500 to-green-500',   soft: 'bg-emerald-50',text: 'text-emerald-700',ring: 'ring-emerald-200',chip: 'bg-emerald-100 text-emerald-700' },
  pink:   { grad: 'from-pink-500 to-rose-500',       soft: 'bg-pink-50',   text: 'text-pink-700',   ring: 'ring-pink-200',   chip: 'bg-pink-100 text-pink-700' },
  orange: { grad: 'from-orange-500 to-amber-500',    soft: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200', chip: 'bg-orange-100 text-orange-700' },
  teal:   { grad: 'from-teal-500 to-cyan-500',       soft: 'bg-teal-50',   text: 'text-teal-700',   ring: 'ring-teal-200',   chip: 'bg-teal-100 text-teal-700' },
  amber:  { grad: 'from-amber-500 to-yellow-500',    soft: 'bg-amber-50',  text: 'text-amber-700',  ring: 'ring-amber-200',  chip: 'bg-amber-100 text-amber-700' },
  rose:   { grad: 'from-rose-500 to-pink-500',       soft: 'bg-rose-50',   text: 'text-rose-700',   ring: 'ring-rose-200',   chip: 'bg-rose-100 text-rose-700' },
  indigo: { grad: 'from-indigo-500 to-violet-500',   soft: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200', chip: 'bg-indigo-100 text-indigo-700' },
};

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function loadSave(): QuestSave {
  const empty: QuestSave = { completed: [], xp: 0, reflections: {}, badges: [], lastActiveDate: '', streak: 0 };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function persist(s: QuestSave) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch { /* ignore */ }
}

/** Recompute earned milestone badges from state. */
function computeBadges(s: QuestSave): string[] {
  const earned = new Set(s.badges);
  if (s.completed.length >= 1) earned.add('first-quest');
  if (s.completed.length >= 5) earned.add('halfway');
  if (s.completed.length >= QUESTS.length) earned.add('all-nine');
  if (Object.values(s.reflections).filter((r) => r && r.trim().length > 0).length >= 3) earned.add('voice');
  if (s.streak >= 3) earned.add('streak-3');
  return Array.from(earned);
}

export default function CareQuests({ onBack, user }: CareQuestsProps) {
  const [save, setSave] = useState<QuestSave>({ completed: [], xp: 0, reflections: {}, badges: [], lastActiveDate: '', streak: 0 });
  const [hydrated, setHydrated] = useState(false);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const { band } = useMoodResponse();

  const firstName = user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'friend';

  // Hydrate + update streak once on mount.
  useEffect(() => {
    const s = loadSave();
    const today = todayStr();
    if (s.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      s.streak = s.lastActiveDate === yesterday ? (s.streak || 0) + 1 : 1;
      s.lastActiveDate = today;
      s.badges = computeBadges(s);
      persist(s);
    }
    setSave(s);
    setHydrated(true);
  }, []);

  const update = (mutator: (draft: QuestSave) => void) => {
    setSave((prev) => {
      const draft: QuestSave = JSON.parse(JSON.stringify(prev));
      mutator(draft);
      draft.badges = computeBadges(draft);
      persist(draft);
      // Surface any brand-new badge for a celebratory toast.
      const before = new Set(prev.badges);
      const fresh = draft.badges.find((b) => !before.has(b));
      if (fresh) {
        setNewBadge(fresh);
        setTimeout(() => setNewBadge(null), 3600);
      }
      return draft;
    });
  };

  const lvl = useMemo(() => levelForXp(save.xp), [save.xp]);
  const progressPct = lvl.next === Infinity ? 100 : Math.min(100, Math.round(((save.xp - lvl.floor) / (lvl.next - lvl.floor)) * 100));
  const completedCount = save.completed.length;
  const overallPct = Math.round((completedCount / QUESTS.length) * 100);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
    );
  }

  // ---------------------------------------------------------------- Quest view
  if (activeQuest) {
    return (
      <QuestRunner
        quest={activeQuest}
        alreadyDone={save.completed.includes(activeQuest.id)}
        savedReflection={save.reflections[activeQuest.id] || ''}
        onExit={() => setActiveQuest(null)}
        onComplete={(correctCount, reflection) => {
          update((d) => {
            const first = !d.completed.includes(activeQuest.id);
            if (first) {
              d.completed.push(activeQuest.id);
              d.xp += correctCount * XP_PER_CORRECT + XP_COMPLETE_BONUS;
            }
            if (reflection && reflection.trim() && d.reflections[activeQuest.id] !== reflection) {
              if (!d.reflections[activeQuest.id]) d.xp += XP_REFLECTION;
              d.reflections[activeQuest.id] = reflection.trim();
            }
          });
        }}
      />
    );
  }

  // ------------------------------------------------------------------ Hub view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-700 transition-colors"
            aria-label="Back to menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-gray-900 leading-tight flex items-center gap-2">
              <span>Quests</span> <span className="text-xl">🎮</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">Learn your rights, have fun, level up</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-5">
        {/* Gamification banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-blue-600 p-5 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 opacity-20"><Trophy className="w-28 h-28" /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{lvl.emoji}</span>
              <p className="text-sm font-semibold text-white/90">
                Level {lvl.level}, {lvl.name}
              </p>
            </div>
            <p className="text-xs text-white/80 mb-3">
              {band === 'low'
                ? `Go gently today, ${firstName}. Even one quest counts. 💜`
                : `Nice one, ${firstName}! You've earned ${save.xp} XP so far.`}
            </p>

            {/* XP progress to next level */}
            <div className="h-2.5 rounded-full bg-white/25 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] text-white/80">{save.xp} XP</span>
              <span className="text-[11px] text-white/80">
                {lvl.next === Infinity ? 'Max level 🏆' : `${lvl.next - save.xp} XP to next level`}
              </span>
            </div>

            {/* Stat chips */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold">{completedCount}/{QUESTS.length} quests</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-bold">{save.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold">{save.badges.length} badges</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges shelf */}
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Badges</p>
          <div className="flex flex-wrap gap-2">
            {MILESTONE_BADGES.map((b) => {
              const earned = save.badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  title={b.desc}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-xs font-semibold transition-all ${
                    earned
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <span className={earned ? '' : 'grayscale opacity-60'}>{b.emoji}</span>
                  <span>{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quest grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-black text-gray-900">Choose your quest</p>
            <span className="text-xs font-semibold text-purple-600">{overallPct}% explored</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUESTS.map((quest, i) => {
              const c = COLOURS[quest.colour];
              const done = save.completed.includes(quest.id);
              return (
                <motion.button
                  key={quest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveQuest(quest)}
                  className={`relative text-left rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md p-4 transition-all overflow-hidden group`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${c.grad}`} />
                  {done && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                      <Check className="w-3 h-3" /> Done
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.grad} flex items-center justify-center text-2xl shadow-md mb-3`}>
                    <span>{quest.emoji}</span>
                  </div>
                  <div className={`inline-block text-[10px] font-bold rounded-full px-2 py-0.5 mb-1.5 ${c.chip}`}>
                    Standard {quest.standardNo}
                  </div>
                  <h3 className="text-sm font-black text-gray-900 leading-tight">{quest.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{quest.tagline}</p>
                  <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold ${c.text}`}>
                    {done ? 'Play again' : 'Start quest'}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* All-done celebration */}
        {completedCount === QUESTS.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 p-5 text-white text-center shadow-lg"
          >
            <PartyPopper className="w-8 h-8 mx-auto mb-2" />
            <p className="font-black text-lg">You've completed every quest! 🌟</p>
            <p className="text-sm text-white/90 mt-1">
              You now know all 9 standards of great care, and your rights. Amazing work, {firstName}!
            </p>
          </motion.div>
        )}
      </div>

      {/* New-badge toast */}
      <AnimatePresence>
        {newBadge && (() => {
          const b = MILESTONE_BADGES.find((x) => x.id === newBadge);
          if (!b) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-white shadow-2xl border border-amber-200 px-5 py-3 flex items-center gap-3"
            >
              <div className="text-3xl">{b.emoji}</div>
              <div>
                <p className="text-xs font-semibold text-amber-600">New badge unlocked!</p>
                <p className="text-sm font-black text-gray-900">{b.label}</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ===========================================================================
// Quest runner — intro → quiz (instant feedback) → reflection → complete
// ===========================================================================

function QuestRunner({
  quest,
  alreadyDone,
  savedReflection,
  onExit,
  onComplete,
}: {
  quest: Quest;
  alreadyDone: boolean;
  savedReflection: string;
  onExit: () => void;
  onComplete: (correctCount: number, reflection: string) => void;
}) {
  const c = COLOURS[quest.colour];
  type Stage = 'intro' | 'quiz' | 'reflect' | 'done';
  const [stage, setStage] = useState<Stage>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [reflection, setReflection] = useState(savedReflection);
  const [savedFlash, setSavedFlash] = useState(false);

  const question = quest.quiz[qIndex];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === question.correct) setCorrectCount((n) => n + 1);
  };

  const nextQuestion = () => {
    if (qIndex + 1 < quest.quiz.length) {
      setQIndex((n) => n + 1);
      setPicked(null);
    } else {
      setStage('reflect');
    }
  };

  const finish = () => {
    onComplete(correctCount, reflection);
    setStage('done');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-9 h-9 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-700 transition-colors"
            aria-label="Back to quests"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate flex items-center gap-1.5">
              <span>{quest.emoji}</span> {quest.title}
            </p>
            <p className="text-[11px] text-gray-500 truncate">Standard {quest.standardNo}: {quest.standardName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {stage === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className={`rounded-3xl bg-gradient-to-br ${c.grad} p-6 text-white shadow-lg text-center`}>
                <div className="text-5xl mb-2">{quest.emoji}</div>
                <h2 className="text-xl font-black">{quest.title}</h2>
                <p className="text-sm text-white/90 mt-1">{quest.tagline}</p>
              </div>

              <div className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-black text-gray-900 mb-3">What this means for YOU 👇</p>
                <ul className="space-y-2.5">
                  {quest.youShould.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-full ${c.soft} ${c.text} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{t}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setStage('quiz')}
                className={`mt-5 w-full rounded-2xl bg-gradient-to-r ${c.grad} text-white font-black py-3.5 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
              >
                {alreadyDone ? 'Play again' : "Let's go!"} <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* QUIZ */}
          {stage === 'quiz' && (
            <motion.div key={`quiz-${qIndex}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-2 mb-3">
                {quest.quiz.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i <= qIndex ? `bg-gradient-to-r ${c.grad}` : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Question {qIndex + 1} of {quest.quiz.length}</p>
              <h3 className="text-lg font-black text-gray-900 mt-1 mb-4 leading-snug">{question.q}</h3>

              <div className="space-y-2.5">
                {question.options.map((opt, i) => {
                  const isCorrect = i === question.correct;
                  const isPicked = picked === i;
                  let cls = 'bg-white border-gray-200 hover:border-purple-300 text-gray-800';
                  if (picked !== null) {
                    if (isCorrect) cls = 'bg-emerald-50 border-emerald-300 text-emerald-800';
                    else if (isPicked) cls = 'bg-rose-50 border-rose-300 text-rose-800';
                    else cls = 'bg-white border-gray-200 text-gray-400';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      className={`w-full text-left rounded-2xl border-2 px-4 py-3.5 font-semibold text-sm transition-all flex items-center justify-between gap-3 ${cls}`}
                    >
                      <span>{opt}</span>
                      {picked !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                      {picked !== null && isPicked && !isCorrect && <X className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {picked !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 rounded-2xl p-4 ${picked === question.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}
                  >
                    <p className={`text-sm font-bold ${picked === question.correct ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {picked === question.correct ? 'Spot on! 🎉' : 'Good try, here’s the idea 👇'}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{question.why}</p>
                    <button
                      onClick={nextQuestion}
                      className={`mt-3 w-full rounded-xl bg-gradient-to-r ${c.grad} text-white font-bold py-2.5 flex items-center justify-center gap-2`}
                    >
                      {qIndex + 1 < quest.quiz.length ? 'Next question' : 'Share your voice'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* REFLECT */}
          {stage === 'reflect' && (
            <motion.div key="reflect" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className={`rounded-2xl ${c.soft} border ${c.ring} ring-1 p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className={`w-5 h-5 ${c.text}`} />
                  <p className="text-sm font-black text-gray-900">Your voice</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{quest.reflectPrompt}</p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={4}
                  placeholder="Write as much or as little as you like… this is just for you."
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">Saved privately on your device. You can change it any time.</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1500); }}
                  className="flex-1 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 flex items-center justify-center gap-2 hover:border-purple-300 transition-colors"
                >
                  {savedFlash ? <><Check className="w-4 h-4 text-emerald-600" /> Noted</> : <><Save className="w-4 h-4" /> Save note</>}
                </button>
                <button
                  onClick={finish}
                  className={`flex-1 rounded-2xl bg-gradient-to-r ${c.grad} text-white font-black py-3 shadow-md flex items-center justify-center gap-2`}
                >
                  Finish quest <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* DONE */}
          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
              <div className={`rounded-3xl bg-gradient-to-br ${c.grad} p-8 text-white text-center shadow-lg relative overflow-hidden`}>
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="text-6xl mb-3"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-black">Quest complete!</h2>
                <p className="text-sm text-white/90 mt-1">
                  You got {correctCount}/{quest.quiz.length} and shared your thoughts. Brilliant!
                </p>
                {!alreadyDone && (
                  <div className="inline-flex items-center gap-1.5 mt-4 rounded-full bg-white/25 px-4 py-2">
                    <Star className="w-4 h-4" />
                    <span className="font-black">+{correctCount * XP_PER_CORRECT + XP_COMPLETE_BONUS} XP</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setStage('intro'); setQIndex(0); setPicked(null); setCorrectCount(0); }}
                  className="flex-1 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 flex items-center justify-center gap-2 hover:border-purple-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Replay
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-3 shadow-md flex items-center justify-center gap-2"
                >
                  More quests <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
