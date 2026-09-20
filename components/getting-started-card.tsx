'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Trophy, Users, Sparkles, Check, ChevronDown, ChevronUp, X, PartyPopper
} from 'lucide-react';

const STORAGE_KEY = 'okayit_getting_started';

interface GettingStartedState {
  done: string[];
  dismissed: boolean;
  collapsed: boolean;
}

interface GettingStartedCardProps {
  onMenuSelect: (section: string) => void;
  onReplayTour?: () => void;
  userName?: string;
}

type Step = {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  bg: string;
  border: string;
  iconColor: string;
  textColor: string;
  ringColor: string;
  section?: string;
  replay?: boolean;
};

const STEPS: Step[] = [
  {
    id: 'checkin',
    label: 'Check in with your feelings',
    desc: 'Tell us how your day is going',
    icon: Heart,
    bg: 'bg-pink-50', border: 'border-pink-200', iconColor: 'text-pink-500', textColor: 'text-pink-700', ringColor: 'ring-pink-300',
    section: 'personal-wellbeing',
  },
  {
    id: 'quest',
    label: 'Try your first Quest',
    desc: 'Fun challenges that help you learn',
    icon: Trophy,
    bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-500', textColor: 'text-purple-700', ringColor: 'ring-purple-300',
    section: 'care-quests',
  },
  {
    id: 'team',
    label: 'Meet your team',
    desc: 'See who is here to support you',
    icon: Users,
    bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', textColor: 'text-blue-700', ringColor: 'ring-blue-300',
    section: 'meet-team',
  },
  {
    id: 'tour',
    label: 'Take the guided tour',
    desc: 'A quick look around, whenever you like',
    icon: Sparkles,
    bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', textColor: 'text-green-700', ringColor: 'ring-green-300',
    replay: true,
  },
];

export default function GettingStartedCard({ onMenuSelect, onReplayTour, userName = 'Friend' }: GettingStartedCardProps) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<GettingStartedState>({ done: [], dismissed: false, collapsed: false });

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          done: Array.isArray(parsed.done) ? parsed.done : [],
          dismissed: !!parsed.dismissed,
          collapsed: !!parsed.collapsed,
        });
      }
    } catch {}
  }, []);

  const persist = useCallback((next: GettingStartedState) => {
    setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const markDone = useCallback((id: string) => {
    setState(prev => {
      if (prev.done.includes(id)) return prev;
      const next = { ...prev, done: [...prev.done, id] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const handleStepClick = useCallback((step: Step) => {
    markDone(step.id);
    if (step.replay && onReplayTour) {
      onReplayTour();
    } else if (step.section) {
      onMenuSelect(step.section);
    }
  }, [markDone, onMenuSelect, onReplayTour]);

  const dismiss = useCallback(() => {
    persist({ ...state, dismissed: true });
  }, [persist, state]);

  const toggleCollapse = useCallback(() => {
    persist({ ...state, collapsed: !state.collapsed });
  }, [persist, state]);

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted) return null;
  if (state.dismissed) return null;

  const completedCount = STEPS.filter(s => state.done.includes(s.id)).length;
  const allDone = completedCount === STEPS.length;
  const pct = Math.round((completedCount / STEPS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
          {allDone ? (
            <PartyPopper className="w-5 h-5 text-purple-500" />
          ) : (
            <Sparkles className="w-5 h-5 text-purple-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-purple-800 leading-tight">
            {allDone ? `Nice one, ${userName}!` : `Let's get started, ${userName}`}
          </p>
          <p className="text-xs text-gray-600 font-medium leading-tight mt-0.5">
            {allDone ? 'You have found your way around. Explore anytime.' : 'A few gentle first steps, no rush at all'}
          </p>
        </div>
        <button
          onClick={toggleCollapse}
          className="w-7 h-7 rounded-lg hover:bg-white/70 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label={state.collapsed ? 'Expand getting started' : 'Collapse getting started'}
        >
          {state.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <button
          onClick={dismiss}
          className="w-7 h-7 rounded-lg hover:bg-white/70 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Hide getting started"
          title="Hide this"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-purple-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-bold text-purple-600 flex-shrink-0">{completedCount}/{STEPS.length}</span>
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence initial={false}>
        {!state.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const done = state.done.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      done
                        ? 'bg-white/60 border-gray-200 opacity-70 hover:opacity-100'
                        : `${step.bg} ${step.border} hover:shadow-md`
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${done ? 'bg-green-500' : 'bg-white'}`}>
                      {done ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className={`w-4 h-4 ${step.iconColor}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-tight ${done ? 'text-gray-500 line-through decoration-gray-300' : step.textColor}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-500 font-medium leading-tight mt-0.5 truncate">{step.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
