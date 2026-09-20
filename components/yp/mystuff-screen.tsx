'use client';

// My Stuff: private, personal spaces + settings. One job: yours.
// No scores, no percentages, no comparison. A calm home for personal things.
import React, { useEffect, useState } from 'react';
import { BookLock, ShieldCheck, UserCircle2, Users, LineChart, Settings2, Type, ChevronRight, Sparkles } from 'lucide-react';
import { MOOD_STATES, type Skin, type TabId } from './yp-config';

interface MyStuffProps {
  accent: string;
  tint: string;
  homeName: string;
  skin: Skin;
  onSetSkin: (s: Skin) => void;
  onOpenContent: (key: string) => void;
  onSwitchTab: (t: TabId) => void;
}

interface Glimpse { date: string; moodLevel: number; }

function Row({ Icon, label, line, accent, onClick }: { Icon: any; label: string; line: string; accent: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 min-h-[64px] px-4 rounded-2xl yp-card yp-card-press text-left">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full shrink-0 yp-tint2" style={{ color: accent }}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>{label}</span>
        <span className="block text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>{line}</span>
      </span>
      <ChevronRight className="w-5 h-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
    </button>
  );
}

export default function MyStuffScreen({ accent, skin, onSetSkin, onOpenContent }: MyStuffProps) {
  const [glimpse, setGlimpse] = useState<Glimpse[] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('okayit_mood_history');
      const arr: any[] = raw ? JSON.parse(raw) : [];
      const last = arr.slice(-7).map((e) => ({ date: String(e.date), moodLevel: Number(e.moodLevel) || 3 }));
      setGlimpse(last);
    } catch { setGlimpse([]); }
  }, []);

  return (
    <div className="px-5 pt-6 pb-10 max-w-md mx-auto">
      <h1 className="text-[26px] tracking-tight" style={{ fontFamily: 'var(--yp-display)', color: 'var(--yp-ink)' }}>My stuff</h1>
      <p className="mt-1 text-[16px]" style={{ color: 'var(--yp-ink-soft)' }}>Your private spaces. Only you see these.</p>

      {/* A gentle glimpse of recent check-ins — weather, never a score */}
      <div className="mt-5 rounded-[26px] p-5 yp-tint" style={{ border: '1px solid var(--yp-line)' }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
          <h2 className="font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>Your recent days</h2>
        </div>
        {mounted && glimpse && glimpse.length > 0 ? (
          <>
            <div className="mt-3 flex items-end gap-2" aria-hidden="true">
              {glimpse.map((g, i) => {
                const s = MOOD_STATES.find((m) => m.level === g.moodLevel) || MOOD_STATES[2];
                const Icon = s.Icon;
                return (
                  <span key={i} className="inline-flex items-center justify-center w-9 h-9 rounded-full" style={{ background: 'var(--yp-surface)' }}>
                    <Icon className="w-5 h-5" style={{ color: accent }} />
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>A picture of how a few days have felt. There is no right or wrong here.</p>
          </>
        ) : (
          <p className="mt-2 text-[15px]" style={{ color: 'var(--yp-ink-soft)' }}>
            Once you check in on the Home tab, a gentle picture of your days will show here.
          </p>
        )}
        <button onClick={() => onOpenContent('mood-story')}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-2xl font-semibold text-white yp-card-press" style={{ background: accent }}>
          <LineChart className="w-5 h-5" aria-hidden="true" /> See my wellbeing story
        </button>
      </div>

      {/* Private spaces */}
      <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--yp-ink-soft)' }}>Private to you</h2>
      <div className="mt-3 space-y-3">
        <Row Icon={BookLock} label="My journal" line="Write anything, kept on this device" accent={accent} onClick={() => onOpenContent('journal')} />
        <Row Icon={ShieldCheck} label="My safety plan" line="Your steps for a tough moment" accent={accent} onClick={() => onOpenContent('safety')} />
        <Row Icon={UserCircle2} label="About me" line="Say who you are, in your words" accent={accent} onClick={() => onOpenContent('aboutme')} />
        <Row Icon={Users} label="People in my life" line="The people who matter to you" accent={accent} onClick={() => onOpenContent('people')} />
      </div>

      {/* Settings */}
      <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--yp-ink-soft)' }}>Settings</h2>
      <div className="mt-3 rounded-[22px] p-5 yp-card">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
          <h3 className="font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>How OKAYiT looks</h3>
        </div>
        <p className="mt-1 text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>Pick the feel that suits you. You can change this any time. Use the moon in the top corner to switch to dark.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {([
            { id: 'younger' as Skin, title: 'Bigger and friendlier', hint: 'Larger, warmer' },
            { id: 'older' as Skin, title: 'Calm and simple', hint: 'Quieter, cleaner' },
          ]).map((opt) => {
            const active = skin === opt.id;
            return (
              <button key={opt.id} onClick={() => onSetSkin(opt.id)} aria-pressed={active}
                className={`rounded-2xl p-4 text-left min-h-[76px] yp-card-press ${active ? 'yp-tint2' : ''}`}
                style={{ border: active ? `1px solid ${accent}` : '1px solid var(--yp-line)', background: active ? undefined : 'var(--yp-surface)' }}>
                <span className="block font-semibold text-[15px]" style={{ color: 'var(--yp-ink)' }}>{opt.title}</span>
                <span className="block text-[13px] mt-0.5" style={{ color: 'var(--yp-ink-soft)' }}>{opt.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => onOpenContent('accessibility')}
        className="mt-3 w-full flex items-center gap-3 min-h-[64px] px-4 rounded-2xl yp-card yp-card-press text-left">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full shrink-0 yp-tint2" style={{ color: accent }}>
          <Settings2 className="w-5 h-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>Accessibility</span>
          <span className="block text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>Text size, contrast, motion and more</span>
        </span>
        <ChevronRight className="w-5 h-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
      </button>
    </div>
  );
}
