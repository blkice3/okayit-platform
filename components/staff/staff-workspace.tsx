'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Activity, BookOpen, Eye, LogOut, Menu, X,
  ShieldCheck, AlertCircle, AlertTriangle, CheckCircle, Clock,
  RefreshCw, ChevronRight, Users, ArrowLeft, Building2, Loader2, Link2
} from 'lucide-react';
import { secureLogout } from '@/lib/secure-logout';
import OKAYiTLogo from '@/components/okayit-logo';

const AdminDashboard = dynamic(() => import('@/components/admin-dashboard'), {
  loading: () => <PanelLoading label="Loading wellbeing data" />,
  ssr: false,
});

const KeyWorkerResources = dynamic(() => import('@/components/keyworker-resources'), {
  loading: () => <PanelLoading label="Loading key worker toolkit" />,
  ssr: false,
});

const YoungPersonExperience = dynamic(() => import('@/components/comprehensive-experience-wrapper'), {
  loading: () => <PanelLoading label="Loading young person view" />,
  ssr: false,
});

const GuideLinksManager = dynamic(() => import('@/components/guide-links-manager'), {
  loading: () => <PanelLoading label="Loading guide links" />,
  ssr: false,
});

function PanelLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">{label}…</span>
      </div>
    </div>
  );
}

type PanelId = 'overview' | 'wellbeing' | 'toolkit' | 'guide-links' | 'yp-view';

interface NavItem {
  id: PanelId;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const NAV: NavItem[] = [
  { id: 'overview', label: 'Shift Overview', desc: 'Today at a glance', icon: LayoutDashboard },
  { id: 'wellbeing', label: 'Wellbeing & Alerts', desc: 'Check-ins, RAG, reports', icon: Activity },
  { id: 'toolkit', label: 'Key Worker Toolkit', desc: 'Guidance and practice', icon: BookOpen },
  { id: 'guide-links', label: 'Guide Links', desc: 'Issue and revoke guide links', icon: Link2 },
  { id: 'yp-view', label: 'Young Person View', desc: 'See what they see', icon: Eye },
];

interface StaffSummary {
  red: number;
  amber: number;
  green: number;
  total: number;
}

interface AttentionRow {
  alertId: string;
  alertLevel: string;
  status: string;
  displayName: string;
  home: string;
  moodLevel: number;
  mood: string;
  minutesSince: number;
}

interface StaffWorkspaceProps {
  user?: any;
  session?: any;
}

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function shiftFor(hour: number) {
  if (hour >= 7 && hour < 15) return 'Day shift';
  if (hour >= 15 && hour < 22) return 'Late shift';
  return 'Night shift';
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  HOME_ADMIN: 'Registered Manager',
  STAFF: 'Support Staff',
};

export default function StaffWorkspace({ user, session }: StaffWorkspaceProps) {
  const [panel, setPanel] = useState<PanelId>('overview');
  const [navOpen, setNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const [summary, setSummary] = useState<StaffSummary | null>(null);
  const [attention, setAttention] = useState<AttentionRow[]>([]);
  const [overdue, setOverdue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const role: string = user?.role || 'STAFF';
  const roleLabel = ROLE_LABEL[role] || 'Staff';
  const displayName: string =
    user?.displayName || user?.name || 'Colleague';
  const firstName = displayName.split(' ')[0];
  const homeLabel: string =
    role === 'SUPER_ADMIN' ? 'All homes' : user?.careHomeName || 'Your home';

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch('/api/admin?type=alerts');
      if (!res.ok) throw new Error('failed');
      const json = await res.json();
      const data = json?.data;
      if (data?.summary) {
        setSummary({
          red: data.summary.red ?? 0,
          amber: data.summary.amber ?? 0,
          green: data.summary.green ?? 0,
          total: data.summary.total ?? 0,
        });
      }
      setAttention(Array.isArray(data?.shiftSummary?.needsAttention) ? data.shiftSummary.needsAttention.slice(0, 5) : []);
      setOverdue(data?.shiftSummary?.overdueCount ?? 0);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const selectPanel = useCallback((id: PanelId) => {
    setPanel(id);
    setNavOpen(false);
  }, []);

  const dateLine = useMemo(() => {
    if (!now) return '';
    return now.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London',
    });
  }, [now]);

  const timeLine = useMemo(() => {
    if (!now) return '';
    return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
  }, [now]);

  const hour = now ? now.getHours() : 9;

  // ─── Young person view is full-screen, with a persistent staff banner ───
  if (panel === 'yp-view') {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="sticky top-0 z-[60] bg-slate-900 border-b border-slate-700 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Eye className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Young person view</p>
                <p className="text-xs text-slate-400 leading-tight truncate">
                  Preview only, you are signed in as staff
                </p>
              </div>
            </div>
            <button
              onClick={() => setPanel('overview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit preview
            </button>
          </div>
        </div>
        <YoungPersonExperience user={user} session={session} initialSection="main-menu" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* ─── Sidebar (desktop) ─── */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-200 flex-shrink-0">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-white rounded-lg p-1">
              <OKAYiTLogo width={26} height={26} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">OKAYiT</p>
              <p className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold">Staff Workspace</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = panel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectPanel(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                  <span className={`block text-[11px] leading-tight mt-0.5 ${active ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {item.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <div className="px-3 pb-3">
            <p className="text-sm font-semibold text-white leading-tight truncate">{displayName}</p>
            <p className="text-[11px] text-indigo-400 font-medium">{roleLabel}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{homeLabel}</p>
          </div>
          <button
            onClick={() => secureLogout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Mobile top bar ─── */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-white rounded-lg p-1">
            <OKAYiTLogo width={22} height={22} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight truncate">Staff Workspace</p>
            <p className="text-[11px] text-indigo-400 font-medium truncate">{roleLabel}</p>
          </div>
        </div>
        <button
          onClick={() => setNavOpen(v => !v)}
          className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
        >
          {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden sticky top-[60px] z-40 bg-slate-800 overflow-hidden"
          >
            <div className="p-3 space-y-1">
              {NAV.map(item => {
                const Icon = item.icon;
                const active = panel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectPanel(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${
                      active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => secureLogout()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700 text-sm font-medium"
              >
                <LogOut className="w-[18px] h-[18px]" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main content ─── */}
      <main className="flex-1 min-w-0">
        {panel === 'overview' && (
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
            {/* Header strip */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {mounted ? `${greetingFor(hour)}, ${firstName}` : `Welcome, ${firstName}`}
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {mounted ? dateLine : 'Loading shift details'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {mounted ? `${shiftFor(hour)} · ${timeLine}` : ', '}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700">{homeLabel}</span>
                </div>
              </div>
            </div>

            {/* RAG tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { key: 'red', label: 'Needs support', value: summary?.red, icon: AlertCircle, ring: 'border-red-200', chip: 'bg-red-50 text-red-700', iconColor: 'text-red-600' },
                { key: 'amber', label: 'Monitor', value: summary?.amber, icon: AlertTriangle, ring: 'border-amber-200', chip: 'bg-amber-50 text-amber-700', iconColor: 'text-amber-600' },
                { key: 'green', label: 'Doing well', value: summary?.green, icon: CheckCircle, ring: 'border-green-200', chip: 'bg-green-50 text-green-700', iconColor: 'text-green-600' },
                { key: 'overdue', label: 'Check-in overdue', value: overdue, icon: Clock, ring: 'border-slate-200', chip: 'bg-slate-100 text-slate-700', iconColor: 'text-slate-500' },
              ].map(tile => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.key}
                    onClick={() => selectPanel('wellbeing')}
                    className={`text-left bg-white rounded-xl border ${tile.ring} p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded ${tile.chip}`}>
                        <Icon className={`w-3.5 h-3.5 ${tile.iconColor}`} />
                        {tile.label}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 tabular-nums">
                      {loading ? <span className="text-slate-300">, </span> : (tile.value ?? 0)}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Needs attention */}
            <div className="bg-white rounded-xl border border-slate-200 mb-6">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Needs attention this shift</h2>
                </div>
                <button
                  onClick={loadSummary}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-400">Loading…</div>
                ) : loadError ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-slate-500">Could not load live data just now.</p>
                    <button onClick={loadSummary} className="text-sm font-semibold text-indigo-600 hover:underline mt-1">Try again</button>
                  </div>
                ) : attention.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">Nothing outstanding</p>
                    <p className="text-xs text-slate-500 mt-0.5">No open alerts need action right now.</p>
                  </div>
                ) : (
                  attention.map(row => {
                    const isRed = (row.alertLevel || '').toUpperCase() === 'RED';
                    return (
                      <button
                        key={row.alertId}
                        onClick={() => selectPanel('wellbeing')}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                      >
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isRed ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{row.displayName || 'Young person'}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {row.home} · {row.mood} · {row.minutesSince} min ago
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0 ${isRed ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                          {row.status || row.alertLevel}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Jump-off cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {NAV.filter(n => n.id !== 'overview').map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectPanel(item.id)}
                    className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-indigo-200 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                      <Icon className="w-[18px] h-[18px] text-indigo-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-2.5">
                      Open <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 mt-6 leading-relaxed">
              Wellbeing information is shared by young people with consent. Handle it in line with your
              safeguarding policy and record any action you take.
            </p>
          </div>
        )}

        {panel === 'wellbeing' && (
          <div className="bg-white min-h-screen">
            <AdminDashboard onBack={() => selectPanel('overview')} />
          </div>
        )}

        {panel === 'toolkit' && (
          <div className="bg-white min-h-screen">
            <KeyWorkerResources onBack={() => selectPanel('overview')} />
          </div>
        )}

        {panel === 'guide-links' && (
          <div className="bg-white min-h-screen">
            <GuideLinksManager user={user} onBack={() => selectPanel('overview')} />
          </div>
        )}
      </main>
    </div>
  );
}
