'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Wind, Hand, Sparkles, Play, Pause, RotateCcw,
  Heart, Check, ChevronRight, Eye, Ear, Fingerprint, Wind as Nose, Cookie, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalmCornerProps {
  onBack: () => void;
}

/* ── Breathing patterns ── */
interface BreathPhase { label: string; seconds: number; scale: number; }
interface BreathPattern {
  id: string;
  name: string;
  desc: string;
  colour: string; // tailwind gradient stops
  phases: BreathPhase[];
}

const PATTERNS: BreathPattern[] = [
  {
    id: 'balance',
    name: 'Balance',
    desc: 'Box breathing, steady and even. Great for focus.',
    colour: 'from-sky-400 to-blue-500',
    phases: [
      { label: 'Breathe in', seconds: 4, scale: 1 },
      { label: 'Hold', seconds: 4, scale: 1 },
      { label: 'Breathe out', seconds: 4, scale: 0.55 },
      { label: 'Rest', seconds: 4, scale: 0.55 },
    ],
  },
  {
    id: 'calm',
    name: 'Calm',
    desc: '4‑7‑8 breathing, helps when you feel anxious or wired.',
    colour: 'from-violet-400 to-purple-500',
    phases: [
      { label: 'Breathe in', seconds: 4, scale: 1 },
      { label: 'Hold', seconds: 7, scale: 1 },
      { label: 'Breathe out', seconds: 8, scale: 0.5 },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean Wave',
    desc: 'Slow in, slower out, like waves on a beach.',
    colour: 'from-teal-400 to-emerald-500',
    phases: [
      { label: 'Breathe in', seconds: 4, scale: 1 },
      { label: 'Breathe out', seconds: 6, scale: 0.5 },
    ],
  },
  {
    id: 'relax',
    name: 'Let Go',
    desc: 'Gentle release, soften your shoulders as you breathe out.',
    colour: 'from-pink-400 to-rose-500',
    phases: [
      { label: 'Breathe in', seconds: 4, scale: 1 },
      { label: 'Hold', seconds: 2, scale: 1 },
      { label: 'Breathe out', seconds: 6, scale: 0.5 },
    ],
  },
];

const GROUNDING_STEPS = [
  { count: 5, sense: 'see', verb: 'can see', icon: Eye, colour: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/40', hint: 'Look around slowly. A colour, a shape, something far away…' },
  { count: 4, sense: 'touch', verb: 'can feel', icon: Fingerprint, colour: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/40', hint: 'Your feet on the floor, your clothes, something soft or cool…' },
  { count: 3, sense: 'hear', verb: 'can hear', icon: Ear, colour: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40', hint: 'Sounds near and far, even quiet ones.' },
  { count: 2, sense: 'smell', verb: 'can smell', icon: Nose, colour: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', hint: 'Take a gentle breath in through your nose.' },
  { count: 1, sense: 'taste', verb: 'can taste', icon: Cookie, colour: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40', hint: 'Or just notice the taste in your mouth right now.' },
];

const AFFIRMATIONS = [
  'You are safe right now, in this moment.',
  'It is okay to feel however you feel.',
  'This feeling will pass, like weather in the sky.',
  'You have got through hard days before.',
  'You matter, exactly as you are.',
  'You do not have to be okay all the time.',
  'Taking a moment for yourself is brave.',
  'You are allowed to ask for help.',
  'One small step is still a step forward.',
  'Your feelings make sense.',
  'You are more than your worst day.',
  'There are people who care about you.',
  'You are doing better than you think.',
  'Being kind to yourself is a kind of strength.',
  'You deserve calm and good things.',
  'Slow down. There is no rush right now.',
  'You can start again at any moment.',
  'Your best is enough today.',
  'You are not alone in this.',
  'Breathe. You have made it this far.',
];

type View = 'menu' | 'breathe' | 'ground' | 'affirm';

function vibrate(ms: number) {
  try { if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms); } catch {}
}

function recordSession(kind: string) {
  try {
    const raw = localStorage.getItem('okayit_calm_sessions');
    const data = raw ? JSON.parse(raw) : { total: 0, byKind: {} as Record<string, number>, lastDate: '' };
    data.total = (data.total || 0) + 1;
    data.byKind = data.byKind || {};
    data.byKind[kind] = (data.byKind[kind] || 0) + 1;
    data.lastDate = new Date().toISOString();
    localStorage.setItem('okayit_calm_sessions', JSON.stringify(data));
  } catch {}
}

export default function CalmCorner({ onBack }: CalmCornerProps) {
  const [view, setView] = useState<View>('menu');
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('okayit_calm_sessions');
      if (raw) setSessions(JSON.parse(raw).total || 0);
    } catch {}
  }, [view]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* soft animated ambient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="calm-blob absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="calm-blob calm-blob-2 absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="calm-blob calm-blob-3 absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-pink-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-6">
        <button
          onClick={() => (view === 'menu' ? onBack() : setView('menu'))}
          className="mb-4 inline-flex items-center gap-2 rounded-lg p-2 -ml-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">{view === 'menu' ? 'Back' : 'Calm Corner'}</span>
        </button>

        <AnimatePresence mode="wait">
          {view === 'menu' && <MenuView key="menu" sessions={sessions} onOpen={setView} />}
          {view === 'breathe' && <BreatheView key="breathe" onDone={() => setView('menu')} />}
          {view === 'ground' && <GroundView key="ground" onDone={() => setView('menu')} />}
          {view === 'affirm' && <AffirmView key="affirm" onDone={() => setView('menu')} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────  MENU  ───────────────────────── */
function MenuView({ sessions, onOpen }: { sessions: number; onOpen: (v: View) => void }) {
  const tools = [
    { id: 'breathe' as View, name: 'Breathing Room', desc: 'Follow the circle. Slow your breath, settle your body.', icon: Wind, grad: 'from-sky-400 to-blue-500' },
    { id: 'ground' as View, name: '5-4-3-2-1 Grounding', desc: 'Use your senses to come back to the here and now.', icon: Hand, grad: 'from-emerald-400 to-teal-500' },
    { id: 'affirm' as View, name: 'Kind Words', desc: 'Gentle reminders, one at a time, just for you.', icon: Sparkles, grad: 'from-violet-400 to-purple-500' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30"
        >
          <Heart className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Calm Corner</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">A quiet space that is just for you. There is no right or wrong way to be here, take your time.</p>
      </div>

      <div className="grid gap-4">
        {tools.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onOpen(t.id)}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 text-left shadow-sm backdrop-blur transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70"
          >
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.grad} shadow-md`}>
              <t.icon className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t.desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
          </motion.button>
        ))}
      </div>

      {sessions > 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          You have taken a calm moment {sessions} {sessions === 1 ? 'time' : 'times'}. That is looking after yourself. 💜
        </motion.p>
      )}

      <p className="mt-6 rounded-xl bg-purple-50 dark:bg-purple-950/40 p-4 text-center text-sm text-purple-800 dark:text-purple-200">
        If things feel too much and you need someone now, tap the <strong>Help Now</strong> button any time, someone is always there for you.
      </p>
    </motion.div>
  );
}

/* ─────────────────────────  BREATHE  ───────────────────────── */
function BreatheView({ onDone }: { onDone: () => void }) {
  const [pattern, setPattern] = useState<BreathPattern | null>(null);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [finished, setFinished] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const engineRef = useRef({ phase: 0, remaining: 0, cycles: 0 });
  const TARGET_CYCLES = 5;
  const FAV_KEY = 'okayit_calm_fav_pattern';
  const [favId, setFavId] = useState<string | null>(null);

  useEffect(() => {
    try { setFavId(localStorage.getItem(FAV_KEY)); } catch { /* ignore */ }
  }, []);

  const clearTick = () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };

  const start = (p: BreathPattern) => {
    clearTick();
    try { localStorage.setItem(FAV_KEY, p.id); setFavId(p.id); } catch { /* ignore */ }
    engineRef.current = { phase: 0, remaining: p.phases[0].seconds, cycles: 0 };
    setPattern(p);
    setPhaseIdx(0);
    setRemaining(p.phases[0].seconds);
    setCycles(0);
    setFinished(false);
    setRunning(true);
    vibrate(30);
  };

  useEffect(() => {
    if (!running || !pattern) { clearTick(); return; }
    clearTick();
    tickRef.current = setInterval(() => {
      const s = engineRef.current;
      if (s.remaining > 1) {
        s.remaining -= 1;
      } else {
        const next = (s.phase + 1) % pattern.phases.length;
        if (next === 0) {
          s.cycles += 1;
          if (s.cycles >= TARGET_CYCLES) {
            clearTick();
            setRunning(false);
            setFinished(true);
            recordSession('breathe');
            vibrate([60, 40, 60] as any);
            return;
          }
        }
        s.phase = next;
        s.remaining = pattern.phases[next].seconds;
        vibrate(25);
      }
      setPhaseIdx(s.phase);
      setRemaining(s.remaining);
      setCycles(s.cycles);
    }, 1000);
    return clearTick;
  }, [running, pattern]);

  useEffect(() => () => clearTick(), []);

  // Pattern picker
  if (!pattern) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        <h2 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Breathing Room</h2>
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          {favId ? 'Your usual rhythm is ready, or pick a different one, whatever feels right today.' : 'Pick a rhythm that feels right. You can change it any time.'}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[...PATTERNS].sort((a, b) => (a.id === favId ? -1 : b.id === favId ? 1 : 0)).map((p, i) => (
            <motion.button key={p.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => start(p)}
              className={`relative rounded-2xl border p-5 text-left shadow-sm backdrop-blur hover:shadow-md dark:bg-slate-800/70 ${p.id === favId ? 'border-purple-300 bg-purple-50/80 dark:border-purple-500/60' : 'border-slate-200 bg-white/80 dark:border-slate-700'}`}
            >
              {p.id === favId && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
                  <Star className="h-3 w-3 fill-current" /> Your usual
                </span>
              )}
              <div className={`mb-3 h-3 w-16 rounded-full bg-gradient-to-r ${p.colour}`} />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{p.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{p.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Nicely done.</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-300">You gave yourself a calm moment. Notice how your body feels now, maybe a little softer, a little slower.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => start(pattern)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <RotateCcw className="mr-2 h-4 w-4" /> Go again
          </Button>
          <Button variant="outline" onClick={onDone}>Back to Calm Corner</Button>
        </div>
      </motion.div>
    );
  }

  const phase = pattern.phases[phaseIdx];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-6">
      <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{pattern.name} · breath {Math.min(cycles + 1, TARGET_CYCLES)} of {TARGET_CYCLES}</p>

      <div className="relative flex h-72 w-72 items-center justify-center">
        {/* rings */}
        <motion.div
          className={`absolute h-full w-full rounded-full bg-gradient-to-br ${pattern.colour} opacity-20`}
          animate={{ scale: running ? phase.scale : 0.8 }}
          transition={{ duration: running ? phase.seconds : 0.4, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute h-2/3 w-2/3 rounded-full bg-gradient-to-br ${pattern.colour} opacity-40`}
          animate={{ scale: running ? phase.scale : 0.8 }}
          transition={{ duration: running ? phase.seconds : 0.4, ease: 'easeInOut' }}
        />
        <motion.div
          className={`flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br ${pattern.colour} shadow-xl`}
          animate={{ scale: running ? phase.scale : 0.8 }}
          transition={{ duration: running ? phase.seconds : 0.4, ease: 'easeInOut' }}
        >
          <div className="text-center text-white">
            <div className="text-xl font-semibold drop-shadow">{phase.label}</div>
            <div className="text-4xl font-bold tabular-nums drop-shadow">{remaining}</div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={() => { setRunning((r) => { const nr = !r; vibrate(20); return nr; }); }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {running ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Resume</>}
        </Button>
        <Button variant="outline" onClick={() => { setPattern(null); setRunning(false); clearTick(); }}>
          Change rhythm
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">Follow the circle as it grows and shrinks. There is no rush.</p>
    </motion.div>
  );
}

/* ─────────────────────────  GROUNDING  ───────────────────────── */
function GroundView({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [entries, setEntries] = useState<string[][]>(GROUNDING_STEPS.map(() => []));
  const [draft, setDraft] = useState('');
  const [done, setDone] = useState(false);

  const current = GROUNDING_STEPS[step];
  const filled = entries[step].length;

  const add = () => {
    const v = draft.trim();
    if (!v || filled >= current.count) return;
    setEntries((e) => e.map((arr, i) => (i === step ? [...arr, v] : arr)));
    setDraft('');
    vibrate(15);
  };

  const next = () => {
    if (step < GROUNDING_STEPS.length - 1) {
      setStep((s) => s + 1);
      setDraft('');
      vibrate(20);
    } else {
      setDone(true);
      recordSession('ground');
      vibrate([60, 40, 60] as any);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">You are here, now.</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-300">You brought your attention back to this moment. Whenever things feel far away or too fast, this is always here for you.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => { setStep(0); setEntries(GROUNDING_STEPS.map(() => [])); setDone(false); }} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <RotateCcw className="mr-2 h-4 w-4" /> Do it again
          </Button>
          <Button variant="outline" onClick={onDone}>Back to Calm Corner</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {/* progress dots */}
      <div className="mb-6 flex justify-center gap-2">
        {GROUNDING_STEPS.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-purple-500' : i < step ? 'w-2 bg-purple-300' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>

      <div className={`rounded-3xl ${current.bg} p-8 text-center`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
          <current.icon className={`h-8 w-8 ${current.colour}`} />
        </div>
        <div className="text-5xl font-bold text-slate-800 dark:text-white">{current.count}</div>
        <h2 className="mt-1 text-xl font-semibold text-slate-800 dark:text-white">things you {current.verb}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-300">{current.hint}</p>

        <div className="mx-auto mt-5 max-w-sm">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
              disabled={filled >= current.count}
              placeholder={filled >= current.count ? 'All noted, lovely' : 'Type one, then add…'}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            <Button onClick={add} disabled={!draft.trim() || filled >= current.count} className="bg-purple-500 text-white hover:bg-purple-600">Add</Button>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {entries[step].map((item, i) => (
              <motion.span key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                {item}
              </motion.span>
            ))}
            {Array.from({ length: Math.max(0, current.count - filled) }).map((_, i) => (
              <span key={`e${i}`} className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-sm text-slate-300 dark:border-slate-600 dark:text-slate-600">•</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={next} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          {step < GROUNDING_STEPS.length - 1 ? (filled === 0 ? 'Skip this one' : 'Next') : 'Finish'}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">You do not have to fill them all in, noticing is what matters.</p>
    </motion.div>
  );
}

/* ─────────────────────────  AFFIRMATIONS  ───────────────────────── */
function AffirmView({ onDone }: { onDone: () => void }) {
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState(0);

  useEffect(() => {
    const arr = AFFIRMATIONS.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
  }, []);

  const nextCard = () => {
    setIdx((i) => (i + 1) % (order.length || 1));
    setSeen((s) => {
      const ns = s + 1;
      if (ns === 3) recordSession('affirm');
      return ns;
    });
    vibrate(15);
  };

  const text = order.length ? AFFIRMATIONS[order[idx]] : AFFIRMATIONS[0];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-6">
      <h2 className="mb-1 text-center text-2xl font-bold text-slate-800 dark:text-white">Kind Words</h2>
      <p className="mb-8 text-center text-slate-600 dark:text-slate-300">Read it slowly. Let it land. Tap for another whenever you are ready.</p>

      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            onClick={nextCard}
            className="relative flex min-h-[16rem] w-full max-w-md items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-8 text-center shadow-xl shadow-purple-500/30"
          >
            <Sparkles className="absolute right-5 top-5 h-6 w-6 text-white/50" />
            <p className="text-2xl font-semibold leading-relaxed text-white">{text}</p>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={nextCard} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Another one <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onDone}>Back to Calm Corner</Button>
      </div>
    </motion.div>
  );
}
