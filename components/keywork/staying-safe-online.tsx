'use client';

// ============================================================
// STAYING SAFE ONLINE
// A one to one online safety session for a young person and
// their key worker, on a shared device.
//
// This is not a lesson. There is no score and no pass mark.
// Doing one section and closing is a complete session.
//
// Safeguarding rules built in:
//  - A large Stop control on every screen. One tap. No confirm.
//  - Help routes reachable from every screen.
//  - A quiet "this has happened to me" flag on every scenario,
//    which always alerts the home. It is never a setting.
//
// Data rules built in:
//  - Password practice never leaves the device.
//  - Scenario choices are never stored.
//  - The plan is stored only if the young person saves it.
// ============================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft, ChevronRight, LifeBuoy, Shield, Check, Lock,
  Eye, MessageSquareWarning, Users2, ClipboardList, Sparkles,
  Hand, AlertTriangle, Printer, Save, Trash2, Camera, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Track, TRACK_LABELS, AGREEMENTS, SAFEGUARDING_NOTICE, WARMUP,
  PASSWORDS, PHOTO_SCREEN, CRUELTY, MANIPULATION, PEOPLE,
  CLOSING_LINE, SECTION_IDS, SectionId, scenariosForTrack,
  Scenario, HELPLINES,
} from '@/lib/keywork/staying-safe-online-config';
import {
  SpeechProvider, SpeakButton, HelplineDrawer, StopButton, useSpeechCtx,
} from './keywork-shared';

// --------------------------------------------------------
// Small helpers
// --------------------------------------------------------
async function apiPost(url: string, body: any) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return null;
  }
}
async function apiPatch(url: string, body: any) {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Section titles for the progress reader.
const SECTION_TITLES: Record<SectionId, string> = {
  'start': 'Start',
  'warmup': 'Warm up',
  'passwords': 'Passwords',
  'giveaway': 'What a photo gives away',
  'cruelty': 'When people are cruel',
  'manipulation': 'Spotting manipulation',
  'scenario-1': 'Scenario one',
  'scenario-2': 'Scenario two',
  'scenario-3': 'Scenario three',
  'scenario-4': 'Scenario four',
  'people': 'People on your side',
  'plan': 'Your plan',
  'close': 'Close',
};

// --------------------------------------------------------
// Reusable card shell for one screen
// --------------------------------------------------------
function ScreenCard({
  icon, title, readAloud, children,
}: {
  icon?: React.ReactNode;
  title: string;
  readAloud?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          {icon}
          {title}
        </h2>
        {readAloud ? <SpeakButton text={readAloud} /> : null}
      </div>
      {children}
    </div>
  );
}

// A choice button that reveals a reply. No right or wrong.
function ChoiceReveal({
  label, reply, onChosen,
}: { label: string; reply: string; onChosen?: () => void }) {
  const [chosen, setChosen] = useState(false);
  const { speak } = useSpeechCtx();
  return (
    <div>
      <button
        type="button"
        onClick={() => { setChosen(true); onChosen?.(); }}
        className={`w-full rounded-xl border px-4 py-3 text-left text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${
          chosen
            ? 'border-purple-300 bg-purple-50 text-purple-900'
            : 'border-gray-200 bg-white text-gray-800 hover:border-purple-300 hover:bg-purple-50'
        }`}
        aria-pressed={chosen}
      >
        {label}
      </button>
      {chosen && (
        <div className="mt-2 flex items-start justify-between gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-900">
          <p className="leading-relaxed">{reply}</p>
          <SpeakButton text={reply} />
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------
// Screen 0: key worker start
// --------------------------------------------------------
function StartScreen({
  track, setTrack, onBegin,
}: { track: Track; setTrack: (t: Track) => void; onBegin: () => void }) {
  const agreementsText = AGREEMENTS.join('. ');
  return (
    <ScreenCard icon={<Shield className="h-7 w-7 text-purple-600" />} title="Before we start"
      readAloud={`${agreementsText}. ${SAFEGUARDING_NOTICE}`}>
      <p className="text-gray-700">Key worker, please read the three points below aloud together.</p>

      <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
        <ul className="space-y-2">
          {AGREEMENTS.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-lg font-medium text-gray-900">
              <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" /> {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm leading-relaxed text-amber-900">{SAFEGUARDING_NOTICE}</p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-gray-800">Key worker: choose a track</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['A', 'B'] as Track[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrack(t)}
              className={`rounded-xl border-2 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                track === t ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
              aria-pressed={track === t}
            >
              <div className="text-lg font-bold text-gray-900">{TRACK_LABELS[t].name}</div>
              <div className="text-sm text-gray-600">{TRACK_LABELS[t].ages}</div>
              <div className="mt-1 text-sm text-gray-500">{TRACK_LABELS[t].note}</div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">You can switch track later without losing progress.</p>
      </div>

      <div className="mt-6">
        <Button onClick={onBegin} className="h-14 w-full rounded-xl bg-purple-600 text-lg font-bold hover:bg-purple-700">
          Begin
        </Button>
      </div>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 1: warm up
// --------------------------------------------------------
function WarmupScreen({ track }: { track: Track }) {
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [motto, setMotto] = useState('');
  const [answer, setAnswer] = useState('');

  if (track === 'A') {
    const w = WARMUP.A;
    return (
      <ScreenCard icon={<Sparkles className="h-7 w-7 text-purple-600" />} title={w.title} readAloud={`${w.intro}`}>
        <p className="text-gray-700">{w.intro}</p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-800">A name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Type any name" />
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-gray-800">A power</p>
            <div className="flex flex-wrap gap-2">
              {w.powers.map((p) => (
                <button key={p} type="button" onClick={() => setPower(p)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${power === p ? 'border-purple-500 bg-purple-100 text-purple-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-purple-50'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-gray-800">A motto</p>
            <div className="flex flex-wrap gap-2">
              {w.mottos.map((m) => (
                <button key={m} type="button" onClick={() => setMotto(m)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${motto === m ? 'border-purple-500 bg-purple-100 text-purple-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-purple-50'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          {(name || power || motto) && (
            <div className="rounded-xl bg-purple-50 p-4 text-purple-900">
              <p className="font-semibold">{name || 'Your hero'} is ready.</p>
              {power && <p className="text-sm">Power: {power}</p>}
              {motto && <p className="text-sm">Motto: {motto}</p>}
            </div>
          )}
          <p className="text-xs text-gray-500">Nothing here is saved. It just gets us started.</p>
        </div>
      </ScreenCard>
    );
  }

  const w = WARMUP.B;
  return (
    <ScreenCard title={w.title} readAloud={`${w.intro} ${w.question}`}>
      <p className="text-gray-700">{w.intro}</p>
      <p className="mt-3 text-lg font-semibold text-gray-900">{w.question}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {w.options.map((o) => (
          <button key={o} type="button" onClick={() => setAnswer(o)}
            className={`rounded-xl border px-4 py-3 text-left text-base ${answer === o ? 'border-purple-500 bg-purple-50 text-purple-900' : 'border-gray-200 bg-white text-gray-800 hover:border-purple-300'}`}>
            {o}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">There is no right answer. Nothing here is saved.</p>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 2: passwords (input never leaves the device)
// --------------------------------------------------------
function passwordScore(pw: string): { score: number; label: string; colour: string } {
  if (!pw) return { score: 0, label: 'Type to see strength', colour: 'bg-gray-200' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/\s/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[A-Za-z]/.test(pw)) score++;
  score = Math.min(score, 4);
  const labels = ['Very weak', 'Weak', 'Okay', 'Strong', 'Very strong'];
  const colours = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-lime-500', 'bg-green-600'];
  return { score, label: labels[score], colour: colours[score] };
}

function PasswordsScreen() {
  const [pw, setPw] = useState('');
  const { score, label, colour } = passwordScore(pw);
  // Clear the box if the component ever unmounts.
  useEffect(() => () => { setPw(''); }, []);
  return (
    <ScreenCard icon={<Lock className="h-7 w-7 text-purple-600" />} title={PASSWORDS.title}
      readAloud={`${PASSWORDS.teachingPoints.join('. ')}. ${PASSWORDS.boundary}`}>
      <ul className="space-y-2">
        {PASSWORDS.teachingPoints.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-base text-gray-800">
            <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" /> {t}
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <label className="mb-1 block text-sm font-semibold text-gray-800">Try a password here</label>
        <input
          type="text"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="off"
          name="not-a-password"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="Type here to test strength"
        />
        <div className="mt-3" aria-live="polite">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div className={`h-full ${colour} transition-all`} style={{ width: `${(score / 4) * 100}%` }} />
          </div>
          <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-800">
          <Lock className="h-3.5 w-3.5" /> {PASSWORDS.privacyNote}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
        <p className="text-sm font-medium leading-relaxed text-rose-900">{PASSWORDS.boundary}</p>
      </div>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 3: what a photo gives away
// --------------------------------------------------------
function GiveawayScreen() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [controls, setControls] = useState<Record<string, boolean>>({});
  const toggleTell = (id: string) => setRevealed((r) => ({ ...r, [id]: !r[id] }));
  return (
    <ScreenCard icon={<Camera className="h-7 w-7 text-purple-600" />} title={PHOTO_SCREEN.title}
      readAloud={`${PHOTO_SCREEN.intro} ${PHOTO_SCREEN.publicByDefaultNote}`}>
      <p className="text-gray-700">{PHOTO_SCREEN.intro}</p>
      <div className="mt-4 space-y-4">
        {PHOTO_SCREEN.photos.map((photo) => (
          <div key={photo.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Camera className="h-4 w-4 text-purple-500" /> {photo.scene}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {photo.tells.map((t) => (
                <button key={t.id} type="button" onClick={() => toggleTell(t.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${revealed[t.id] ? 'border-purple-500 bg-purple-100 text-purple-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-purple-50'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mt-2 space-y-1">
              {photo.tells.filter((t) => revealed[t.id]).map((t) => (
                <p key={t.id} className="rounded-lg bg-white px-3 py-2 text-sm text-gray-700">{t.why}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-gray-800">Now set your privacy</p>
        <div className="space-y-2">
          {PHOTO_SCREEN.privacyControls.map((c) => (
            <button key={c.id} type="button"
              onClick={() => setControls((s) => ({ ...s, [c.id]: !s[c.id] }))}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:border-purple-300">
              <span>
                <span className="block text-base font-medium text-gray-900">{c.label}</span>
                <span className="block text-sm text-gray-600">{c.plain}</span>
              </span>
              <span className={`flex h-7 w-12 flex-shrink-0 items-center rounded-full px-1 transition ${controls[c.id] ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`h-5 w-5 rounded-full bg-white transition ${controls[c.id] ? 'translate-x-5' : ''}`} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm leading-relaxed text-amber-900">{PHOTO_SCREEN.publicByDefaultNote}</p>
      </div>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 4: when people are cruel
// --------------------------------------------------------
function CrueltyScreen({ track }: { track: Track }) {
  const title = track === 'B' ? CRUELTY.titleB : CRUELTY.titleA;
  return (
    <ScreenCard icon={<MessageSquareWarning className="h-7 w-7 text-purple-600" />} title={title}
      readAloud={`${CRUELTY.intro} ${CRUELTY.takeaways.join('. ')}`}>
      <p className="text-gray-700">{CRUELTY.intro}</p>
      <div className="mt-4 space-y-5">
        {CRUELTY.thread.map((step) => (
          <div key={step.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 rounded-lg bg-white px-4 py-3 text-base text-gray-900 shadow-sm">
              {step.message}
            </div>
            <div className="space-y-2">
              {step.choices.map((c) => (
                <ChoiceReveal key={c.id} label={c.label} reply={c.reply} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
        <p className="mb-2 text-sm font-semibold text-gray-800">Things to remember</p>
        <ul className="space-y-1">
          {CRUELTY.takeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 5: spotting manipulation
// --------------------------------------------------------
function ManipulationScreen() {
  const [week, setWeek] = useState(1);
  const stage = MANIPULATION.stages[week - 1];
  return (
    <ScreenCard icon={<AlertTriangle className="h-7 w-7 text-purple-600" />} title={MANIPULATION.title}
      readAloud={`${MANIPULATION.intro} ${MANIPULATION.point} ${MANIPULATION.signals.join('. ')}`}>
      <p className="text-gray-700">{MANIPULATION.intro}</p>

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
          <span>Week {stage.week}</span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800">{stage.label}</span>
        </div>
        <p className="mt-3 min-h-[3rem] text-lg text-gray-900">{stage.text}</p>
        <input
          type="range" min={1} max={8} value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          aria-label="Move through the weeks"
          className="mt-4 w-full accent-purple-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Week 1</span><span>Week 8</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
        <p className="text-base font-semibold leading-relaxed text-rose-900">{MANIPULATION.point}</p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-gray-800">Signals worth noticing</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MANIPULATION.signals.map((s, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-900">
              <Eye className="mt-0.5 h-4 w-4 flex-shrink-0" /> {s}
            </div>
          ))}
        </div>
      </div>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screens 6 to 9: scenarios, each with a quiet flag
// --------------------------------------------------------
function ScenarioScreen({
  scenario, track, onRaiseFlag,
}: {
  scenario: Scenario;
  track: Track;
  onRaiseFlag: (s: Scenario) => void;
}) {
  const [flagged, setFlagged] = useState(false);
  const supportLines = (scenario.supportHelplineIds || [])
    .map((id) => HELPLINES.find((h) => h.id === id))
    .filter(Boolean);

  const raise = () => {
    setFlagged(true);
    onRaiseFlag(scenario);
  };

  return (
    <ScreenCard icon={<Shield className="h-7 w-7 text-purple-600" />} title={scenario.title}
      readAloud={`${scenario.prompt}`}>
      <div className={`rounded-xl border p-4 ${scenario.sensitive ? 'border-rose-200 bg-rose-50' : 'border-gray-200 bg-gray-50'}`}>
        <p className="text-base text-gray-900">{scenario.prompt}</p>
      </div>

      <div className="mt-4 space-y-2">
        {scenario.choices.map((c) => (
          <ChoiceReveal key={c.id} label={c.label} reply={c.reply} />
        ))}
      </div>

      {supportLines.length > 0 && (
        <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-800">Help with this</p>
          <ul className="space-y-1 text-sm text-gray-700">
            {supportLines.map((h) => (
              <li key={h!.id}>
                <span className="font-semibold">{h!.name}. </span>{h!.what}
                {h!.phone ? <span> Call {h!.phone}.</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The quiet flag. Present on every scenario. */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        {!flagged ? (
          <button type="button" onClick={raise}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300">
            <Hand className="h-4 w-4 text-rose-500" /> This has happened to me
          </button>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-medium leading-relaxed text-rose-900">
              Thank you for telling us. This is not your fault. A member of staff here now knows, so they can support you. You are not on your own with this.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <SpeakButton text="Thank you for telling us. This is not your fault. A member of staff here now knows, so they can support you. You are not on your own with this." />
            </div>
          </div>
        )}
      </div>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 10: people on your side
// --------------------------------------------------------
function PeopleScreen({
  people, setPeople, onOpenHelp,
}: {
  people: string[];
  setPeople: (p: string[]) => void;
  onOpenHelp: () => void;
}) {
  const [text, setText] = useState('');
  const add = (name: string) => {
    const n = name.trim();
    if (!n) return;
    if (people.includes(n)) return;
    setPeople([...people, n]);
    setText('');
  };
  return (
    <ScreenCard icon={<Users2 className="h-7 w-7 text-purple-600" />} title={PEOPLE.title}
      readAloud={`${PEOPLE.intro} ${PEOPLE.noOneRoute.body} ${PEOPLE.noOneRoute.line}`}>
      <p className="text-gray-700">{PEOPLE.intro}</p>

      <div className="mt-4 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(text); }}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="Type a person" />
        <Button onClick={() => add(text)} className="rounded-xl bg-purple-600 px-5 hover:bg-purple-700">Add</Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PEOPLE.suggestions.map((s) => (
          <button key={s} type="button" onClick={() => add(s)}
            className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-50">
            + {s}
          </button>
        ))}
      </div>

      {people.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-gray-800">Your people</p>
          <div className="flex flex-wrap gap-2">
            {people.map((p) => (
              <span key={p} className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800">
                {p}
                <button type="button" aria-label={`Remove ${p}`} onClick={() => setPeople(people.filter((x) => x !== p))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-base font-semibold text-blue-900">{PEOPLE.noOneRoute.title}</p>
        <p className="mt-1 text-sm text-blue-900">{PEOPLE.noOneRoute.body}</p>
        <p className="mt-1 text-sm text-blue-900">{PEOPLE.noOneRoute.line}</p>
        <button type="button" onClick={onOpenHelp}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <LifeBuoy className="h-4 w-4" /> See help routes
        </button>
      </div>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 11: your plan (discard is the default)
// --------------------------------------------------------
const PLAN_ACTIONS = [
  'I will stop and take a breath.',
  'I will not reply on my own.',
  'I will screenshot before I delete.',
  'I will block or leave.',
  'I will tell a person on my side.',
  'I will use a help route.',
];

function PlanScreen({
  people, onSave, saved,
}: {
  people: string[];
  onSave: (planText: string) => void;
  saved: boolean;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (a: string) =>
    setPicked((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  const planText = useMemo(() => {
    const lines: string[] = ['My plan'];
    if (picked.length) {
      lines.push('If something goes wrong:');
      picked.forEach((p) => lines.push(`- ${p}`));
    }
    if (people.length) {
      lines.push('People I can tell:');
      people.forEach((p) => lines.push(`- ${p}`));
    }
    return lines.join('\n');
  }, [picked, people]);

  const print = () => {
    if (typeof window === 'undefined') return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<pre style="font-family:sans-serif;font-size:16px;white-space:pre-wrap;padding:24px">${planText.replace(/</g, '&lt;')}</pre>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <ScreenCard icon={<ClipboardList className="h-7 w-7 text-purple-600" />} title="Your plan"
      readAloud="Pick what you will do if something goes wrong. Then choose to save, print, or discard your plan.">
      <p className="text-gray-700">Pick what you will do if something goes wrong online.</p>
      <div className="mt-3 space-y-2">
        {PLAN_ACTIONS.map((a) => (
          <button key={a} type="button" onClick={() => toggle(a)}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-base ${picked.includes(a) ? 'border-purple-500 bg-purple-50 text-purple-900' : 'border-gray-200 bg-white text-gray-800 hover:border-purple-300'}`}>
            <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${picked.includes(a) ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-300'}`}>
              {picked.includes(a) && <Check className="h-3.5 w-3.5" />}
            </span>
            {a}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-1 text-sm font-semibold text-gray-800">Your plan so far</p>
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">{planText}</pre>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-sm text-amber-900">Your plan is not saved unless you choose to save it.</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button onClick={() => onSave(planText)} disabled={saved}
          className="h-12 rounded-xl bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" /> {saved ? 'Saved' : 'Save my plan'}
        </Button>
        <Button onClick={print} variant="outline" className="h-12 rounded-xl">
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button variant="outline" className="h-12 rounded-xl"
          onClick={() => setPicked([])}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-500">If you do nothing, your plan is discarded when you close.</p>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Screen 12: close
// --------------------------------------------------------
function CloseScreen({ track, onDone }: { track: Track; onDone: () => void }) {
  const [name, setName] = useState('');
  const [colour, setColour] = useState('purple');
  const colourMap: Record<string, string> = {
    purple: 'from-purple-500 to-purple-700',
    blue: 'from-blue-500 to-blue-700',
    green: 'from-green-500 to-green-700',
    orange: 'from-orange-500 to-orange-700',
  };

  if (track === 'A') {
    return (
      <ScreenCard icon={<Sparkles className="h-7 w-7 text-purple-600" />} title="You did it" readAloud={CLOSING_LINE}>
        <p className="text-gray-700">Design your certificate. Pick a colour and sign your name.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(colourMap).map((c) => (
            <button key={c} type="button" onClick={() => setColour(c)}
              className={`h-9 w-9 rounded-full bg-gradient-to-br ${colourMap[c]} ${colour === c ? 'ring-4 ring-offset-2 ring-purple-300' : ''}`}
              aria-label={`Choose ${c}`} />
          ))}
        </div>
        <div className={`mt-4 rounded-2xl bg-gradient-to-br ${colourMap[colour]} p-6 text-center text-white shadow-lg`}>
          <p className="text-sm uppercase tracking-wide opacity-90">Certificate</p>
          <p className="mt-1 text-2xl font-bold">Staying Safe Online</p>
          <p className="mt-4 text-sm opacity-90">Awarded to</p>
          <p className="text-xl font-semibold">{name || 'your name'}</p>
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="Sign your name" />
        <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
          <p className="text-sm leading-relaxed text-gray-800">{CLOSING_LINE}</p>
        </div>
        <Button onClick={onDone} className="mt-4 h-14 w-full rounded-xl bg-purple-600 text-lg font-bold hover:bg-purple-700">
          Done
        </Button>
      </ScreenCard>
    );
  }

  return (
    <ScreenCard title="You are done" readAloud={CLOSING_LINE}>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-base text-gray-900">You have worked through an online safety session.</p>
        <p className="mt-2 text-sm text-gray-700">You looked at passwords, privacy, cruelty online, manipulation, real scenarios, and who is on your side.</p>
      </div>
      <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
        <p className="text-sm leading-relaxed text-gray-800">{CLOSING_LINE}</p>
      </div>
      <Button onClick={onDone} className="mt-4 h-14 w-full rounded-xl bg-purple-600 text-lg font-bold hover:bg-purple-700">
        Done
      </Button>
    </ScreenCard>
  );
}

// --------------------------------------------------------
// Neutral screen shown after Stop
// --------------------------------------------------------
function NeutralScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
        <Check className="h-8 w-8 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">That is okay</h2>
      <p className="mt-2 max-w-sm text-gray-600">You stopped the session. That is completely fine. You can come back to it any time.</p>
      <Button onClick={onClose} className="mt-6 h-12 rounded-xl bg-purple-600 px-8 hover:bg-purple-700">Close</Button>
    </div>
  );
}

// --------------------------------------------------------
// Main orchestrator
// --------------------------------------------------------
function SessionInner({ onExit }: { onExit: () => void }) {
  const [track, setTrack] = useState<Track>('A');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [index, setIndex] = useState(0); // into SECTION_IDS
  const [completed, setCompleted] = useState<SectionId[]>([]);
  const [stopped, setStopped] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [people, setPeople] = useState<string[]>([]);
  const [planSaved, setPlanSaved] = useState(false);
  const [started, setStarted] = useState(false);

  const scenarios = useMemo(() => scenariosForTrack(track), [track]);
  const currentId = SECTION_IDS[index];

  const markComplete = useCallback((id: SectionId, next: SectionId[]) => {
    if (sessionId) {
      apiPatch('/api/keywork/session', { id: sessionId, sectionsCompleted: next });
    }
  }, [sessionId]);

  const goNext = useCallback(() => {
    setCompleted((prev) => {
      const next = prev.includes(currentId) ? prev : [...prev, currentId];
      markComplete(currentId, next);
      return next;
    });
    setIndex((i) => Math.min(i + 1, SECTION_IDS.length - 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentId, markComplete]);

  const goBack = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const begin = useCallback(async () => {
    setStarted(true);
    const res = await apiPost('/api/keywork/session', { track });
    if (res?.session?.id) setSessionId(res.session.id);
    goNext();
  }, [track, goNext]);

  const doStop = useCallback(() => {
    setStopped(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (sessionId) apiPatch('/api/keywork/session', { id: sessionId, exited: true, paused: true });
  }, [sessionId]);

  const switchTrack = useCallback((t: Track) => {
    setTrack(t);
    if (sessionId) apiPatch('/api/keywork/session', { id: sessionId, track: t });
  }, [sessionId]);

  const raiseFlag = useCallback((s: Scenario) => {
    apiPost('/api/keywork/flag', {
      sessionId, scenarioId: s.id, scenarioTitle: s.title, track,
    });
  }, [sessionId, track]);

  const savePlan = useCallback((planText: string) => {
    setPlanSaved(true);
    if (sessionId) apiPatch('/api/keywork/session', { id: sessionId, planSaved: true, planText });
  }, [sessionId]);

  const finish = useCallback(async () => {
    const next = completed.includes('close' as SectionId) ? completed : [...completed, 'close' as SectionId];
    setCompleted(next);
    if (sessionId) {
      await apiPatch('/api/keywork/session', { id: sessionId, sectionsCompleted: next, completed: true });
    }
    onExit();
  }, [sessionId, onExit, completed]);

  if (stopped) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <NeutralScreen onClose={onExit} />
      </div>
    );
  }

  // Render the current screen.
  let screen: React.ReactNode = null;
  if (currentId === 'start') {
    screen = <StartScreen track={track} setTrack={setTrack} onBegin={begin} />;
  } else if (currentId === 'warmup') {
    screen = <WarmupScreen track={track} />;
  } else if (currentId === 'passwords') {
    screen = <PasswordsScreen />;
  } else if (currentId === 'giveaway') {
    screen = <GiveawayScreen />;
  } else if (currentId === 'cruelty') {
    screen = <CrueltyScreen track={track} />;
  } else if (currentId === 'manipulation') {
    screen = <ManipulationScreen />;
  } else if (currentId.startsWith('scenario-')) {
    const n = Number(currentId.split('-')[1]) - 1;
    const s = scenarios[n];
    screen = s ? <ScenarioScreen key={s.id} scenario={s} track={track} onRaiseFlag={raiseFlag} /> : null;
  } else if (currentId === 'people') {
    screen = <PeopleScreen people={people} setPeople={setPeople} onOpenHelp={() => setHelpOpen(true)} />;
  } else if (currentId === 'plan') {
    screen = <PlanScreen people={people} onSave={savePlan} saved={planSaved} />;
  } else if (currentId === 'close') {
    screen = <CloseScreen track={track} onDone={finish} />;
  }

  const isStart = currentId === 'start';
  const isClose = currentId === 'close';
  const progress = Math.round(((index) / (SECTION_IDS.length - 1)) * 100);

  return (
    <div className="min-h-[70vh]">
      {/* Top bar: progress, track switch, help, Stop */}
      <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-purple-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-gray-700">
              {SECTION_TITLES[currentId]}
              <span className="ml-2 font-normal text-gray-400">Track {track}</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setHelpOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400">
                <LifeBuoy className="h-4 w-4" /> Help
              </button>
              <StopButton onStop={doStop} />
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-purple-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          {/* Track switch is available to the key worker at any time. */}
          {started && !isClose && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <RefreshCw className="h-3.5 w-3.5" /> Key worker can switch track:
              <button onClick={() => switchTrack('A')} className={`rounded-full px-2 py-0.5 ${track === 'A' ? 'bg-purple-100 font-semibold text-purple-800' : 'hover:bg-gray-100'}`}>A</button>
              <button onClick={() => switchTrack('B')} className={`rounded-full px-2 py-0.5 ${track === 'B' ? 'bg-purple-100 font-semibold text-purple-800' : 'hover:bg-gray-100'}`}>B</button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-1 pb-28">
        {screen}
      </div>

      {/* Bottom navigation. No timers, no auto advance. */}
      {!isClose && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <Button variant="outline" onClick={goBack} disabled={index === 0}
              className="h-12 rounded-xl px-5">
              <ChevronLeft className="mr-1 h-5 w-5" /> Back
            </Button>
            {!isStart && (
              <Button onClick={goNext}
                className="h-12 flex-1 rounded-xl bg-purple-600 text-base font-semibold hover:bg-purple-700">
                Next <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      <HelplineDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default function StayingSafeOnline({ onExit }: { onExit: () => void }) {
  return (
    <SpeechProvider>
      <SessionInner onExit={onExit} />
    </SpeechProvider>
  );
}
