'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, Info, Sparkles, Sun, Heart } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

interface MoodEntry {
  date: string;
  mood: string;
  moodLevel: number;
}

const STORAGE_KEY = 'okayit_mood_history';

const moodLabels: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: 'Really Low', emoji: '😢', color: '#ef4444' },
  2: { label: 'Struggling', emoji: '😔', color: '#f97316' },
  3: { label: 'Okay', emoji: '😐', color: '#eab308' },
  4: { label: 'Good', emoji: '🙂', color: '#84cc16' },
  5: { label: 'Amazing', emoji: '😄', color: '#22c55e' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MoodTrendsProps {
  onBack: () => void;
}

export default function MoodTrends({ onBack }: MoodTrendsProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setEntries(parsed.sort((a: MoodEntry, b: MoodEntry) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
      }
    } catch { /* empty */ }
    setMounted(true);
  }, []);

  const filteredEntries = entries.filter(e => {
    if (timeRange === 'all') return true;
    const days = timeRange === '7d' ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(e.date) >= cutoff;
  });

  const chartData = filteredEntries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    moodLevel: e.moodLevel,
    mood: e.mood,
    fullDate: e.date,
  }));

  const avgMood = filteredEntries.length > 0
    ? Math.round((filteredEntries.reduce((sum, e) => sum + e.moodLevel, 0) / filteredEntries.length) * 10) / 10
    : 0;

  const mostCommonMood = filteredEntries.length > 0
    ? (() => {
        const counts: Record<number, number> = {};
        filteredEntries.forEach(e => { counts[e.moodLevel] = (counts[e.moodLevel] || 0) + 1; });
        return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
      })()
    : 0;

  // ── Trend direction: compare earlier half vs recent half ──
  const trend = (() => {
    if (filteredEntries.length < 4) return null;
    const mid = Math.floor(filteredEntries.length / 2);
    const earlier = filteredEntries.slice(0, mid);
    const recent = filteredEntries.slice(mid);
    const avg = (arr: MoodEntry[]) => arr.reduce((s, e) => s + e.moodLevel, 0) / arr.length;
    const diff = avg(recent) - avg(earlier);
    if (diff >= 0.4) return 'up';
    if (diff <= -0.4) return 'down';
    return 'steady';
  })();

  // ── Day-of-week averages ──
  const dayAverages = (() => {
    const buckets: Record<number, number[]> = {};
    filteredEntries.forEach(e => {
      const d = new Date(e.date).getDay();
      (buckets[d] ||= []).push(e.moodLevel);
    });
    return DAY_NAMES.map((name, i) => {
      const vals = buckets[i] || [];
      const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
      return { name, avg, count: vals.length };
    });
  })();

  const brightestDay = (() => {
    const withData = dayAverages.filter(d => d.count > 0);
    if (withData.length < 2) return null;
    return withData.reduce((best, d) => (d.avg > best.avg ? d : best));
  })();

  // ── Warm narrative ──
  const storyLine = (() => {
    if (filteredEntries.length === 0) return '';
    if (filteredEntries.length < 3) {
      return 'You have made a start. Every time you check in, you are getting to know yourself a little better.';
    }
    const parts: string[] = [];
    if (trend === 'up') parts.push('Things have been looking a little brighter lately, that is really good to see.');
    else if (trend === 'down') parts.push('It looks like things have felt a bit heavier recently. That is okay, hard patches happen, and you do not have to carry them alone.');
    else parts.push('Your mood has been fairly steady. Steady can be a good, safe place to be.');
    if (avgMood >= 4) parts.push('On the whole you have been feeling good.');
    else if (avgMood <= 2.5) parts.push('It has been a tougher stretch, remember the Help Now button and the people around you are always there.');
    return parts.join(' ');
  })();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const m = moodLabels[d.moodLevel];
      return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm p-2 text-xs">
          <p className="font-bold text-gray-700 dark:text-slate-200">{d.date}</p>
          <p className="mt-0.5 text-gray-600 dark:text-slate-300">{m?.emoji} {m?.label}</p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) return null;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColour = trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-amber-600 dark:text-amber-400' : 'text-sky-600 dark:text-sky-400';
  const trendLabel = trend === 'up' ? 'Brighter' : trend === 'down' ? 'Heavier' : 'Steady';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 min-h-[44px] text-purple-600 dark:text-purple-300 text-sm font-bold flex items-center gap-1 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Menu
          </button>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-bold text-gray-800 dark:text-white">Your Wellbeing Story</span>
          </div>
          <div className="w-16" /> {/* spacer */}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">

          {entries.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600 dark:text-slate-200">Your story starts with a check-in</p>
              <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Each time you do a wellbeing check-in, it is saved here so you can gently see how you have been feeling over time. Only you can see this.
              </p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Time Range Filters */}
              <div className="flex gap-1.5 mb-4">
                {([['7d', 'Last 7 Days'], ['30d', 'Last 30 Days'], ['all', 'All Time']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setTimeRange(val)}
                    className={`px-3 py-2 min-h-[44px] rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      timeRange === val
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:border-purple-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Warm narrative story card */}
              {storyLine && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900/50 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed font-medium">{storyLine}</p>
                  </div>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{filteredEntries.length}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Check-ins</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{avgMood}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Average</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                  {trend ? (
                    <p className={`text-lg font-bold flex items-center justify-center gap-1 ${trendColour}`}>
                      <TrendIcon className="w-4 h-4" />
                    </p>
                  ) : (
                    <p className="text-lg font-bold">{moodLabels[mostCommonMood]?.emoji || ', '}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{trend ? trendLabel : 'Most Common'}</p>
                </div>
              </div>

              {/* Chart */}
              {filteredEntries.length > 1 ? (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 shadow-sm mb-4">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Your Mood Over Time</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} stroke="#9ca3af" />
                        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#9ca3af' }} stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone" dataKey="moodLevel" stroke="#8b5cf6" strokeWidth={2}
                          fill="url(#moodGradient)" dot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {[5, 4, 3, 2, 1].map(l => (
                      <span key={l} className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-0.5">
                        {moodLabels[l].emoji} {l}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Do one more check-in to see a chart of your mood over time.</p>
                </div>
              )}

              {/* Day-of-week rhythm */}
              {brightestDay && (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm mb-4">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Your Week at a Glance</h3>
                  <div className="flex items-end justify-between gap-1.5 h-24">
                    {dayAverages.map((d) => {
                      const heightPct = d.count > 0 ? Math.max(12, (d.avg / 5) * 100) : 0;
                      const colour = d.avg >= 4 ? '#22c55e' : d.avg >= 3 ? '#eab308' : d.avg > 0 ? '#f97316' : '#e5e7eb';
                      return (
                        <div key={d.name} className="flex flex-1 flex-col items-center gap-1">
                          <div className="flex w-full flex-1 items-end justify-center">
                            {d.count > 0 ? (
                              <motion.div
                                initial={{ height: 0 }} animate={{ height: `${heightPct}%` }} transition={{ duration: 0.5 }}
                                className="w-full max-w-[28px] rounded-t-md"
                                style={{ backgroundColor: colour }}
                                title={`${d.name}: avg ${d.avg.toFixed(1)}`}
                              />
                            ) : (
                              <div className="w-full max-w-[28px] rounded-t-md bg-gray-100 dark:bg-slate-700" style={{ height: '6px' }} />
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-gray-400 dark:text-slate-500">{d.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2.5">
                    <Sun className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                      {brightestDay.name === DAY_NAMES[new Date().getDay()]
                        ? `${brightestDay.name} tends to be one of your brighter days.`
                        : `${brightestDay.name} tends to be one of your brighter days. Noticing your patterns can help you plan for the days that feel harder.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Recent List */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">Recent Check-ins</h3>
                <div className="space-y-1.5">
                  {[...filteredEntries].reverse().slice(0, 10).map((e, i) => {
                    const m = moodLabels[e.moodLevel];
                    return (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <span className="text-lg">{m?.emoji}</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{m?.label}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m?.color }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Privacy footnote */}
              <div className="mt-4 flex items-start gap-2 px-1">
                <Info className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">
                  This is built only from your own wellbeing check-ins and stays private to you on this device.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
