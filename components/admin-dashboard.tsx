'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { secureLogout } from '@/lib/secure-logout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Heart, TrendingUp, Clock, Home,
  LogIn, LogOut, BarChart3, Smile, Frown, Meh,
  ChevronLeft, AlertCircle, CheckCircle, AlertTriangle,
  KeyRound, Copy, Plus, Loader2, ClipboardCheck,
  Download, FileText, X, ChevronRight, Activity,
  Pencil, Trash2, Save, Settings, MapPin, Phone, Mail, Camera,
  Building2, UserPlus, ToggleLeft, ToggleRight, Eye, EyeOff, Sparkles, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import SafeguardingAlertCard from '@/components/safeguarding-alert-card';

// === Types ===
interface AdminUser { id: string; name: string; email: string; role: string; home: string; }
interface WellbeingCheckin { id: string; anonymousId: string; displayName: string | null; home: string; mood: string; moodLevel: number; note: string | null; createdAt: string; }
interface ProgressEntry { id: string; anonymousId: string; displayName: string | null; home: string; progressType: string; progressData: string; createdAt: string; }
interface DashboardData { totalCheckins: number; recentCheckins: WellbeingCheckin[]; progressEntries: ProgressEntry[]; moodStats: { mood: string; _count: { mood: number }; _avg: { moodLevel: number | null } }[]; admin: { name: string; role: string; home: string }; }
interface AlertActionData { id: string; status: string; alertLevel: string; acknowledgedAt: string | null; acknowledgedBy: string | null; escalatedAt: string | null; escalatedReason: string | null; autoEscalated: boolean; resolvedAt: string | null; resolvedBy: string | null; outcome: string | null; actions: Array<{ action: string; note: string | null; actorName: string; actorId: string; actorRole: string; timestamp: string }>; createdAt: string; }
interface YPStatus { anonymousId: string; displayName: string | null; home: string; mood: string; moodLevel: number; note: string | null; createdAt: string; rag: 'RED' | 'AMBER' | 'GREEN'; alertAction: AlertActionData | null; isOverdue: boolean; minutesSinceCheckin: number; }
interface ShiftAttention { alertId: string; alertLevel: string; status: string; displayName: string; home: string; moodLevel: number; mood: string; checkinAt: string; minutesSince: number; autoEscalated: boolean; }
interface ShiftSummary { totalActive: number; openRed: number; openAmber: number; overdueCount: number; escalatedCount: number; needsAttention: ShiftAttention[]; }
interface AlertsData { summary: { red: number; amber: number; green: number; total: number }; ypStatuses: YPStatus[]; recentRed: WellbeingCheckin[]; shiftSummary: ShiftSummary; }
interface ProfileData { anonymousId: string; displayName: string; home: string; totalCheckins: number; avgMood: number | null; latestMood: WellbeingCheckin | null; moodTimeline: { date: string; mood: string; moodLevel: number; note: string | null }[]; recentNotes: WellbeingCheckin[]; progress: ProgressEntry[]; }
interface ReportData { period: { days: number; from: string; to: string }; summary: { totalCheckins: number; avgMood: number; uniqueYP: number }; distribution: Record<string, number>; dailyStats: { date: string; avgMood: number; count: number; red: number; amber: number; green: number }[]; csvRows: Record<string, string | number>[]; }
interface YPPattern { anonymousId: string; name: string; home: string; totalCheckins: number; avgMood7d: number | null; avgMood30d: number; trend: 'declining' | 'improving' | 'stable'; riskScore: number; redCount: number; latestMood: number | null; dayOfWeekAvg?: Record<string, number | null>; timeOfDayAvg?: Record<string, number | null>; lowestDay?: string | null; daysSinceLastCheckin?: number | null; isDisengaged?: boolean; avgGapDays?: number | null; predictiveNote?: string | null; }
interface SuccessMetrics { totalAlerts: number; resolved: number; resolutionRate: number; open: number; escalated: number; autoEscalated: number; avgResponseMin: number | null; medianResponseMin: number | null; avgResolutionMin: number | null; red: { total: number; avgResponseMin: number | null; within15min: number; complianceRate: number }; amber: { total: number; avgResponseMin: number | null; within24h: number; complianceRate: number }; }
interface MetricsData { period: { days: number; from: string; to: string }; successMetrics: SuccessMetrics; patterns: YPPattern[]; atRiskCount: number; disengagedCount?: number; disengagedYPs?: { anonymousId: string; name: string; home: string; daysSince: number | null }[]; }

// === Helpers ===
const ragConfig = {
  RED: { bg: 'bg-red-100 border-red-300', text: 'text-red-800', badge: 'bg-red-600 text-white', icon: AlertCircle, label: 'Needs Support' },
  AMBER: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-800', badge: 'bg-amber-500 text-white', icon: AlertTriangle, label: 'Monitor' },
  GREEN: { bg: 'bg-green-100 border-green-300', text: 'text-green-800', badge: 'bg-green-600 text-white', icon: CheckCircle, label: 'Doing Well' },
};

function getMoodIcon(moodLevel: number) {
  if (moodLevel <= 3) return <Frown className="w-5 h-5 text-red-500" />;
  if (moodLevel <= 5) return <Meh className="w-5 h-5 text-amber-500" />;
  return <Smile className="w-5 h-5 text-green-500" />;
}

function getMoodColor(moodLevel: number) {
  if (moodLevel <= 3) return 'bg-red-100 border-red-300 text-red-800';
  if (moodLevel <= 5) return 'bg-amber-100 border-amber-300 text-amber-800';
  return 'bg-green-100 border-green-300 text-green-800';
}

function getRag(moodLevel: number): 'RED' | 'AMBER' | 'GREEN' {
  if (moodLevel <= 3) return 'RED';
  if (moodLevel <= 5) return 'AMBER';
  return 'GREEN';
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// === Sub-components ===

// --- Mood Timeline Chart (CSS-only bar chart) ---
function MoodTimelineChart({ data }: { data: { date: string; moodLevel: number; mood: string }[] }) {
  if (data.length === 0) return <p className="text-gray-500 text-center py-8">No check-in data yet</p>;
  const maxBars = 30;
  const chartData = data.slice(-maxBars);
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-40 px-2">
        {chartData.map((d, i) => {
          const height = (d.moodLevel / 10) * 100;
          const color = d.moodLevel <= 3 ? 'bg-red-500' : d.moodLevel <= 5 ? 'bg-amber-400' : 'bg-green-500';
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                {formatShortDate(d.date)}: {d.moodLevel}/10
              </div>
              <div className={`w-full rounded-t-sm ${color} transition-all`} style={{ height: `${height}%`, minHeight: 4 }} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 px-2">
        <span>{formatShortDate(chartData[0]?.date)}</span>
        <span>{formatShortDate(chartData[chartData.length - 1]?.date)}</span>
      </div>
      <div className="flex justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-sm" /> 1-3 Low</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 rounded-sm" /> 4-5 Okay</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-sm" /> 6-10 Good</span>
      </div>
    </div>
  );
}

// --- Individual YP Profile Panel ---
function YPProfilePanel({ anonymousId, onClose }: { anonymousId: string; onClose: () => void }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin?type=profile&anonymousId=${encodeURIComponent(anonymousId)}`);
        if (res.ok) {
          const d = await res.json();
          setProfile(d.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [anonymousId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
        <div className="w-full max-w-md bg-white h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const rag = profile.latestMood ? getRag(profile.latestMood.moodLevel) : 'GREEN';
  const cfg = ragConfig[rag];
  const RagIcon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 ${cfg.bg} border-b-2`}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 transition">
              <X className="w-5 h-5" />
            </button>
            <Badge className={`${cfg.badge} font-bold`}>
              <RagIcon className="w-3.5 h-3.5 mr-1" />
              {cfg.label}
            </Badge>
          </div>
          <h2 className={`text-2xl font-black ${cfg.text}`}>{profile.displayName}</h2>
          <p className="text-sm opacity-70">{profile.home} &middot; {profile.totalCheckins} check-ins</p>
          {profile.avgMood !== null && (
            <p className="text-sm font-bold mt-1">Average mood: {profile.avgMood}/10</p>
          )}
        </div>

        {/* Mood Timeline */}
        <div className="p-5 border-b">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Mood Timeline
          </h3>
          <MoodTimelineChart data={profile.moodTimeline} />
        </div>

        {/* Latest Check-in */}
        {profile.latestMood && (
          <div className="p-5 border-b">
            <h3 className="font-bold text-gray-800 mb-3">Latest Check-in</h3>
            <div className={`p-4 rounded-xl border-2 ${getMoodColor(profile.latestMood.moodLevel)}`}>
              <div className="flex items-center gap-2">
                {getMoodIcon(profile.latestMood.moodLevel)}
                <span className="font-bold">{profile.latestMood.mood} ({profile.latestMood.moodLevel}/10)</span>
              </div>
              <p className="text-xs opacity-70 mt-1">{formatDate(profile.latestMood.createdAt)}</p>
              {profile.latestMood.note && (
                <p className="mt-2 p-2 bg-white/50 rounded-lg text-sm">"{profile.latestMood.note}"</p>
              )}
            </div>
          </div>
        )}

        {/* Recent Notes */}
        {profile.recentNotes.length > 0 && (
          <div className="p-5 border-b">
            <h3 className="font-bold text-gray-800 mb-3">Recent Notes Shared</h3>
            <div className="space-y-2">
              {profile.recentNotes.map((n) => (
                <div key={n.id} className="p-3 rounded-lg bg-gray-50 border">
                  <p className="text-sm">"{n.note}"</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)} &middot; {n.mood} ({n.moodLevel}/10)</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {profile.progress.length > 0 && (
          <div className="p-5">
            <h3 className="font-bold text-gray-800 mb-3">Shared Progress</h3>
            <div className="space-y-2">
              {profile.progress.map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <Badge className="bg-green-600 text-white text-xs">{p.progressType}</Badge>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(p.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// === Main Dashboard ===
export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const { data: session } = useSession();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reportDays, setReportDays] = useState(30);
  const [metricsDays, setMetricsDays] = useState(30);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedYP, setSelectedYP] = useState<string | null>(null);

  // Invite code state
  const [inviteDisplayName, setInviteDisplayName] = useState('');
  const [inviteGrantedBy, setInviteGrantedBy] = useState('');
  const [inviteGrantedByRole, setInviteGrantedByRole] = useState('care_home_manager');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [codeCopied, setCopied] = useState(false);

  // Staff management
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('STAFF');
  const [staffLoading, setStaffLoading] = useState(false);
  const [selectedCareHomeId, setSelectedCareHomeId] = useState('');
  const [careHomes, setCareHomes] = useState<any[]>([]);

  // Approvals
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);

  // Staff profiles (display profiles for young people, NOT login accounts)
  const [staffProfiles, setStaffProfiles] = useState<any[]>([]);
  const [editingStaffProfile, setEditingStaffProfile] = useState<any | null>(null);
  const [staffProfileForm, setStaffProfileForm] = useState<any>({});
  const [staffProfileLoading, setStaffProfileLoading] = useState(false);
  const [showAddStaffProfile, setShowAddStaffProfile] = useState(false);

  // Care home management
  const [careHomesFull, setCareHomesFull] = useState<any[]>([]);
  const [editingHome, setEditingHome] = useState<string | null>(null);
  const [homeForm, setHomeForm] = useState<any>({});
  const [homeLoading, setHomeLoading] = useState(false);

  // Tour room editing
  const [editingTourHome, setEditingTourHome] = useState<string | null>(null);
  const [tourRoomsForm, setTourRoomsForm] = useState<any[]>([]);
  const [tourLoading, setTourLoading] = useState(false);

  // Manage tab sub-section
  const [manageSection, setManageSection] = useState<'profiles' | 'homes' | 'tour'>('profiles');

  // Auth
  const isLoggedIn = session?.user && ['SUPER_ADMIN', 'HOME_ADMIN', 'STAFF'].includes(session.user.role);
  const admin: AdminUser | null = isLoggedIn
    ? { id: session!.user.id, name: session!.user.displayName, email: session!.user.email || '', role: session!.user.role, home: session!.user.careHomeName || 'all' }
    : null;
  const isHomeAdmin = isLoggedIn && ['SUPER_ADMIN', 'HOME_ADMIN'].includes(session!.user.role);
  const isSuperAdmin = isLoggedIn && session!.user.role === 'SUPER_ADMIN';

  // Fetch functions
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?type=dashboard');
      if (res.ok) { const d = await res.json(); setDashboardData(d.data); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin?type=alerts');
      if (res.ok) { const d = await res.json(); setAlertsData(d.data); }
    } catch (e) { console.error(e); }
  }, []);

  const fetchReport = useCallback(async (days: number) => {
    try {
      const res = await fetch(`/api/admin?type=report&days=${days}`);
      if (res.ok) { const d = await res.json(); setReportData(d.data); }
    } catch (e) { console.error(e); }
  }, []);

  const fetchMetrics = useCallback(async (days: number) => {
    try {
      const res = await fetch(`/api/admin?type=metrics&days=${days}`);
      if (res.ok) { const d = await res.json(); setMetricsData(d.data); }
    } catch (e) { console.error(e); }
  }, []);

  const downloadCompliancePDF = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/compliance-report?days=${reportDays}&format=pdf`);
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OKAYiT_Compliance_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Compliance report downloaded');
    } catch {
      toast.error('Failed to generate compliance report');
    } finally {
      setPdfLoading(false);
    }
  };

  const fetchInviteCodes = async () => {
    try { const res = await fetch('/api/invite-codes'); if (res.ok) { const d = await res.json(); setInviteCodes(d.data || []); } } catch {}
  };
  const fetchStaffUsers = async () => {
    try { const res = await fetch('/api/users'); if (res.ok) { const d = await res.json(); setStaffUsers(d.data || []); } } catch {}
  };
  const fetchCareHomes = async () => {
    try {
      const res = await fetch('/api/care-homes');
      if (res.ok) {
        const d = await res.json();
        setCareHomes(d.data || []);
        if (session?.user?.careHomeId) setSelectedCareHomeId(session.user.careHomeId);
        else if (d.data?.length > 0) setSelectedCareHomeId(d.data[0].id);
      }
    } catch {}
  };
  const fetchPendingApprovals = async () => {
    try { const res = await fetch('/api/user-approvals'); if (res.ok) { const d = await res.json(); setPendingApprovals(d.data || []); } } catch {}
  };
  const fetchStaffProfiles = async () => {
    try {
      const res = await fetch('/api/staff?includeInactive=true');
      if (res.ok) { const d = await res.json(); setStaffProfiles(d); }
    } catch {}
  };
  const fetchCareHomesFull = async () => {
    try {
      const res = await fetch('/api/care-homes?full=true');
      if (res.ok) { const d = await res.json(); setCareHomesFull(d.data || []); }
    } catch {}
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
      fetchAlerts();
      fetchInviteCodes();
      if (isHomeAdmin) { fetchStaffUsers(); fetchCareHomes(); fetchStaffProfiles(); fetchCareHomesFull(); }
      if (isSuperAdmin) fetchPendingApprovals();
    }
  }, [isLoggedIn, isHomeAdmin, isSuperAdmin, fetchDashboardData, fetchAlerts]);

  // Fetch report when tab changes or days change
  useEffect(() => {
    if (activeTab === 'reports' && isLoggedIn) fetchReport(reportDays);
  }, [activeTab, reportDays, isLoggedIn, fetchReport]);

  // Fetch metrics when insights tab is active
  useEffect(() => {
    if (activeTab === 'insights' && isLoggedIn) fetchMetrics(metricsDays);
  }, [activeTab, metricsDays, isLoggedIn, fetchMetrics]);

  // Handlers
  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteDisplayName || !inviteGrantedBy) return;
    setInviteLoading(true);
    setGeneratedCode(null);
    try {
      let careHomeId = session?.user?.careHomeId || '';
      if (!careHomeId) {
        const hr = await fetch('/api/care-homes');
        if (hr.ok) { const hd = await hr.json(); careHomeId = hd.data?.[0]?.id || ''; }
      }
      if (!careHomeId) { toast.error('Could not determine care home'); return; }
      const res = await fetch('/api/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: inviteDisplayName, careHomeId, grantedBy: inviteGrantedBy, grantedByRole: inviteGrantedByRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setGeneratedCode(data.inviteCode); toast.success('Invite code created!'); fetchInviteCodes(); }
      else toast.error(data.error || 'Failed to create invite code');
    } catch { toast.error('Failed to create invite code'); } finally { setInviteLoading(false); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); toast.success('Code copied!'); setTimeout(() => setCopied(false), 2000); });
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail || !newStaffPassword || !selectedCareHomeId) return;
    setStaffLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: newStaffName, email: newStaffEmail.toLowerCase().trim(), password: newStaffPassword, role: newStaffRole, careHomeId: selectedCareHomeId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || `Staff account created!`);
        setNewStaffName(''); setNewStaffEmail(''); setNewStaffPassword('');
        fetchStaffUsers(); if (isSuperAdmin) fetchPendingApprovals();
      } else toast.error(data.error || 'Failed to create staff account');
    } catch { toast.error('Failed to create staff account'); } finally { setStaffLoading(false); }
  };

  const handleApproval = async (userId: string, action: 'approve' | 'reject') => {
    setApprovalLoading(userId);
    try {
      const res = await fetch('/api/user-approvals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, action }) });
      const data = await res.json();
      if (res.ok && data.success) { toast.success(data.message); fetchPendingApprovals(); fetchStaffUsers(); }
      else toast.error(data.error || 'Action failed');
    } catch { toast.error('Failed to process approval'); } finally { setApprovalLoading(null); }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`⚠️ Permanently delete ${userName}?\n\nThis will remove the account entirely and allow them to re-register with the same email.\n\nThis action cannot be undone.`)) return;
    setApprovalLoading(userId);
    try {
      const res = await fetch('/api/user-approvals', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
      const data = await res.json();
      if (res.ok && data.success) { toast.success(data.message); fetchPendingApprovals(); fetchStaffUsers(); }
      else toast.error(data.error || 'Failed to delete user');
    } catch { toast.error('Failed to delete user'); } finally { setApprovalLoading(null); }
  };

  // === Staff Profile Handlers ===
  const initStaffProfileForm = (profile?: any) => {
    if (profile) {
      setStaffProfileForm({ ...profile, interests: (profile.interests || []).join(', ') });
      setEditingStaffProfile(profile.id);
    } else {
      setStaffProfileForm({ name: '', role: '', shift: 'day', home: admin?.home === 'all' ? 'claudius' : admin?.home || '', photo: '', description: '', interests: '', funFact: '', favoriteQuote: '', whenToTalkTo: '', contact: '', color: 'from-purple-500 to-pink-500' });
      setShowAddStaffProfile(true);
      setEditingStaffProfile(null);
    }
  };

  const handleSaveStaffProfile = async () => {
    if (!staffProfileForm.name || !staffProfileForm.role || !staffProfileForm.home) { toast.error('Name, role, and home are required'); return; }
    setStaffProfileLoading(true);
    try {
      const payload = {
        ...staffProfileForm,
        interests: typeof staffProfileForm.interests === 'string' ? staffProfileForm.interests.split(',').map((i: string) => i.trim()).filter(Boolean) : staffProfileForm.interests || [],
      };
      const isEdit = !!editingStaffProfile;
      const res = await fetch('/api/staff', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editingStaffProfile, ...payload } : payload),
      });
      if (res.ok) {
        toast.success(isEdit ? 'Staff profile updated!' : 'Staff profile created!');
        setEditingStaffProfile(null); setShowAddStaffProfile(false); setStaffProfileForm({});
        fetchStaffProfiles();
      } else { const d = await res.json(); toast.error(d.error || 'Failed to save'); }
    } catch { toast.error('Failed to save staff profile'); } finally { setStaffProfileLoading(false); }
  };

  const handleToggleStaffActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/staff', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isActive: !currentActive }) });
      if (res.ok) { toast.success(currentActive ? 'Staff profile deactivated' : 'Staff profile reactivated'); fetchStaffProfiles(); }
      else toast.error('Failed to update');
    } catch { toast.error('Failed to update'); }
  };

  const handleDeleteStaffProfile = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}'s profile? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/staff?id=${id}&hard=true`, { method: 'DELETE' });
      if (res.ok) { toast.success('Profile deleted'); fetchStaffProfiles(); }
      else toast.error('Failed to delete');
    } catch { toast.error('Failed to delete'); }
  };

  // === Care Home Handlers ===
  const startEditHome = (home: any) => {
    setEditingHome(home.id);
    setHomeForm({ displayName: home.displayName || '', description: home.description || '', address: home.address || '', phone: home.phone || '', email: home.email || '', brandColor: home.brandColor || '' });
  };

  const handleSaveHome = async () => {
    if (!editingHome) return;
    setHomeLoading(true);
    try {
      const res = await fetch('/api/care-homes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingHome, ...homeForm }) });
      if (res.ok) { toast.success('Care home updated!'); setEditingHome(null); fetchCareHomesFull(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed to save'); }
    } catch { toast.error('Failed to save care home'); } finally { setHomeLoading(false); }
  };

  // === Tour Room Handlers ===
  const DEFAULT_ROOMS = [
    { id: 'bedroom', name: 'Bedroom', description: 'Your private space to relax and make your own', features: ['Private personal space', 'Comfortable bed and furniture', 'Storage for your belongings', 'Space to decorate as you like'], imagePath: '' },
    { id: 'lounge', name: 'Lounge', description: 'Comfortable communal space for relaxation and socializing', features: ['Comfortable seating', 'TV and entertainment', 'Space to socialize', 'Quiet areas available'], imagePath: '' },
    { id: 'games-room', name: 'Games Room', description: 'Fun space with games and activities for everyone', features: ['Gaming consoles', 'Board games', 'Pool table', 'Activity space'], imagePath: '' },
    { id: 'kitchen', name: 'Kitchen', description: 'Learn to cook and share meals together', features: ['Full cooking facilities', 'Learn life skills', 'Meal preparation', 'Dining area'], imagePath: '' },
    { id: 'garden', name: 'Garden', description: 'Outdoor space for fresh air and activities', features: ['Outdoor activities', 'Safe play area', 'Fresh air', 'Gardening opportunities'], imagePath: '' },
  ];

  const startEditTour = (home: any) => {
    setEditingTourHome(home.id);
    const existingRooms = Array.isArray(home.tourRooms) ? home.tourRooms : DEFAULT_ROOMS;
    setTourRoomsForm(existingRooms.map((r: any) => ({ ...r, features: Array.isArray(r.features) ? r.features.join(', ') : r.features || '' })));
  };

  const handleSaveTour = async () => {
    if (!editingTourHome) return;
    setTourLoading(true);
    try {
      const rooms = tourRoomsForm.map((r: any) => ({ ...r, features: typeof r.features === 'string' ? r.features.split(',').map((f: string) => f.trim()).filter(Boolean) : r.features || [] }));
      const res = await fetch('/api/care-homes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingTourHome, tourRooms: rooms }) });
      if (res.ok) { toast.success('Tour information saved!'); setEditingTourHome(null); fetchCareHomesFull(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed to save'); }
    } catch { toast.error('Failed to save tour data'); } finally { setTourLoading(false); }
  };

  const addTourRoom = () => {
    setTourRoomsForm([...tourRoomsForm, { id: `room-${Date.now()}`, name: '', description: '', features: '', imagePath: '' }]);
  };

  const removeTourRoom = (index: number) => {
    setTourRoomsForm(tourRoomsForm.filter((_: any, i: number) => i !== index));
  };

  const updateTourRoom = (index: number, field: string, value: string) => {
    const updated = [...tourRoomsForm];
    updated[index] = { ...updated[index], [field]: value };
    setTourRoomsForm(updated);
  };

  // === Deactivate/Reactivate User Account ===
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, status: newStatus }) });
      const data = await res.json();
      if (res.ok && data.success) { toast.success(data.message || `Account ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'}`); fetchStaffUsers(); }
      else toast.error(data.error || 'Action failed');
    } catch { toast.error('Failed to update account'); }
  };

  const downloadCSV = () => {
    if (!reportData?.csvRows?.length) return;
    const headers = ['date', 'time', 'displayName', 'home', 'mood', 'moodLevel', 'note', 'rag'];
    const csvContent = [headers.join(','), ...reportData.csvRows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `okayit-wellbeing-report-${reportDays}days-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success('CSV downloaded!');
  };

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="border border-white/30 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full w-fit mb-4">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-gray-900">Staff Dashboard</CardTitle>
              <p className="text-gray-600 font-semibold mt-2">Sign in to access wellbeing data and alerts</p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Button onClick={() => window.location.href = '/login'} className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg">
                <LogIn className="w-6 h-6 mr-2" /> Go to Login
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full h-12 font-bold border border-gray-300">
                <ChevronLeft className="w-5 h-5 mr-2" /> Back to App
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} className="bg-white text-purple-700 hover:bg-purple-100 font-bold px-5 py-2 rounded-xl shadow-lg">
              <ChevronLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            <div className="hidden md:flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-black">Staff Dashboard</h1>
                <p className="text-purple-200 text-sm font-semibold">Wellbeing & Safeguarding</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="font-bold">{admin?.name}</p>
              <p className="text-purple-200 text-sm">{admin?.role} · {admin?.home === 'all' ? 'All Homes' : admin?.home}</p>
            </div>
            <Button onClick={() => { secureLogout(); }} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold">
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && !dashboardData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Shield className="w-16 h-16 text-purple-600 animate-pulse" />
            <p className="mt-4 text-xl font-bold text-gray-700">Loading dashboard...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full md:w-full bg-white p-2 rounded-xl shadow-lg gap-1">
                <TabsTrigger value="overview" className="font-bold text-xs sm:text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4 mr-1" /> Overview
                </TabsTrigger>
                <TabsTrigger value="alerts" className="font-bold text-xs sm:text-sm data-[state=active]:bg-red-600 data-[state=active]:text-white relative">
                  <AlertCircle className="w-4 h-4 mr-1" /> Alerts
                  {alertsData && alertsData.summary.red > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {alertsData.ypStatuses.filter(s => s.rag === 'RED').length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="wellbeing" className="font-bold text-xs sm:text-sm data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                  <Heart className="w-4 h-4 mr-1" /> Wellbeing
                </TabsTrigger>
                <TabsTrigger value="reports" className="font-bold text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <FileText className="w-4 h-4 mr-1" /> Reports
                </TabsTrigger>
                <TabsTrigger value="insights" className="font-bold text-xs sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Activity className="w-4 h-4 mr-1" /> Insights
                </TabsTrigger>
                {isLoggedIn && (
                  <TabsTrigger value="invites" className="font-bold text-xs sm:text-sm data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                    <KeyRound className="w-4 h-4 mr-1" /> Invites
                  </TabsTrigger>
                )}
                {isHomeAdmin && (
                  <TabsTrigger value="staff" className="font-bold text-xs sm:text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                    <Users className="w-4 h-4 mr-1" /> Staff
                  </TabsTrigger>
                )}
                {isHomeAdmin && (
                  <TabsTrigger value="manage" className="font-bold text-xs sm:text-sm data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                    <Settings className="w-4 h-4 mr-1" /> Manage
                  </TabsTrigger>
                )}
                {isSuperAdmin && (
                  <TabsTrigger value="approvals" className="font-bold text-xs sm:text-sm data-[state=active]:bg-red-600 data-[state=active]:text-white relative">
                    <ClipboardCheck className="w-4 h-4 mr-1" /> Approvals
                    {pendingApprovals.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingApprovals.length}</span>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* ============ OVERVIEW ============ */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-600 rounded-xl"><Heart className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="text-gray-600 font-bold text-sm">Check-ins</p>
                        <p className="text-3xl font-black text-purple-800">{dashboardData?.totalCheckins || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-600 rounded-xl"><AlertCircle className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="text-gray-600 font-bold text-sm">RED Alerts</p>
                        <p className="text-3xl font-black text-red-800">{alertsData?.ypStatuses.filter(s => s.rag === 'RED').length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500 rounded-xl"><AlertTriangle className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="text-gray-600 font-bold text-sm">AMBER</p>
                        <p className="text-3xl font-black text-amber-800">{alertsData?.ypStatuses.filter(s => s.rag === 'AMBER').length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-600 rounded-xl"><Smile className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="text-gray-600 font-bold text-sm">GREEN</p>
                        <p className="text-3xl font-black text-green-800">{alertsData?.ypStatuses.filter(s => s.rag === 'GREEN').length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="border border-gray-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-amber-800 text-sm font-semibold">
                    <strong>Privacy:</strong> Only data young people have explicitly chosen to share is displayed. All sharing is consent-based.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ ALERTS (RAG) — Safeguarding Resolution System ============ */}
            <TabsContent value="alerts" className="space-y-6">
              {/* ── Shift Summary Banner ── */}
              {alertsData?.shiftSummary && alertsData.shiftSummary.totalActive > 0 && (
                <Card className={`border-2 ${alertsData.shiftSummary.overdueCount > 0 ? 'border-red-500 bg-red-50 animate-pulse' : alertsData.shiftSummary.totalActive > 0 ? 'border-amber-400 bg-amber-50' : 'border-green-300 bg-green-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className={`w-7 h-7 ${alertsData.shiftSummary.overdueCount > 0 ? 'text-red-600' : 'text-amber-600'}`} />
                      <div>
                        <h3 className="font-black text-lg text-gray-900">
                          {alertsData.shiftSummary.overdueCount > 0
                            ? `🚨 ${alertsData.shiftSummary.overdueCount} OVERDUE, Immediate Action Required`
                            : `⚠️ ${alertsData.shiftSummary.totalActive} alert${alertsData.shiftSummary.totalActive !== 1 ? 's' : ''} need attention`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {alertsData.shiftSummary.openRed > 0 && <span className="text-red-700 font-bold mr-3">🔴 {alertsData.shiftSummary.openRed} RED</span>}
                          {alertsData.shiftSummary.openAmber > 0 && <span className="text-amber-700 font-bold mr-3">🟡 {alertsData.shiftSummary.openAmber} AMBER</span>}
                          {alertsData.shiftSummary.escalatedCount > 0 && <span className="text-purple-700 font-bold">⬆️ {alertsData.shiftSummary.escalatedCount} escalated</span>}
                        </p>
                      </div>
                    </div>
                    {alertsData.shiftSummary.needsAttention.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {alertsData.shiftSummary.needsAttention.slice(0, 5).map((a) => (
                          <div key={a.alertId} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${a.alertLevel === 'RED' ? 'bg-red-100' : 'bg-amber-100'}`}>
                            <span className="font-bold">{a.alertLevel === 'RED' ? '🔴' : '🟡'}</span>
                            <span className="font-bold">{a.displayName}</span>
                            <span className="opacity-70">({a.home})</span>
                            <span className="ml-auto text-xs font-bold opacity-70">{a.minutesSince < 60 ? `${a.minutesSince}m ago` : `${Math.round(a.minutesSince / 60)}h ago`}</span>
                            {a.autoEscalated && <Badge className="bg-purple-600 text-white text-[10px]">AUTO-ESCALATED</Badge>}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* RAG Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                {(['RED', 'AMBER', 'GREEN'] as const).map((level) => {
                  const cfg = ragConfig[level];
                  const Icon = cfg.icon;
                  const count = alertsData?.ypStatuses.filter(s => s.rag === level).length || 0;
                  return (
                    <Card key={level} className={`border-2 ${cfg.bg}`}>
                      <CardContent className="p-4 text-center">
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${cfg.text}`} />
                        <p className={`text-3xl font-black ${cfg.text}`}>{count}</p>
                        <p className={`text-sm font-bold ${cfg.text} opacity-80`}>{cfg.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Individual YP Status List with Action Panels */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-gray-800 flex items-center gap-2">
                    <Shield className="w-6 h-6" /> Safeguarding Alerts, Resolution Tracker
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Every RED/AMBER alert must be acknowledged and resolved. Actions are logged immutably.
                  </p>
                </CardHeader>
                <CardContent>
                  {alertsData?.ypStatuses && alertsData.ypStatuses.length > 0 ? (
                    <div className="space-y-4">
                      {alertsData.ypStatuses.map((yp) => (
                        <SafeguardingAlertCard
                          key={yp.anonymousId}
                          yp={yp}
                          onViewProfile={() => setSelectedYP(yp.anonymousId)}
                          onActionComplete={() => fetchAlerts()}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-gray-600">All clear</p>
                      <p className="text-gray-500">No shared wellbeing data in the last 30 days</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ WELLBEING ============ */}
            <TabsContent value="wellbeing" className="space-y-6">
              <Card className="border border-pink-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-pink-800 flex items-center gap-2">
                    <Heart className="w-7 h-7" /> Recent Wellbeing Check-ins
                  </CardTitle>
                  <p className="text-sm text-gray-500">Tap a name to view their full wellbeing profile and mood timeline.</p>
                </CardHeader>
                <CardContent>
                  {dashboardData?.recentCheckins && dashboardData.recentCheckins.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentCheckins.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedYP(c.anonymousId)}
                          className={`w-full text-left p-4 rounded-xl border-2 ${getMoodColor(c.moodLevel)} hover:shadow-md transition-all group`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {getMoodIcon(c.moodLevel)}
                              <div>
                                <p className="font-black text-lg">{c.displayName || 'Anonymous'}</p>
                                <p className="text-sm opacity-80">Mood: {c.mood} ({c.moodLevel}/10)</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-2">
                              <div>
                                <Badge variant="outline" className="font-bold"><Home className="w-3 h-3 mr-1" />{c.home}</Badge>
                                <p className="text-xs mt-1 opacity-70"><Clock className="w-3 h-3 inline mr-1" />{formatDate(c.createdAt)}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            </div>
                          </div>
                          {c.note && <p className="mt-2 p-2 bg-white/50 rounded-lg text-sm">"{c.note}"</p>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-gray-600">No shared check-ins yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ REPORTS ============ */}
            <TabsContent value="reports" className="space-y-6">
              {/* Period Selector + Export */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  {[7, 14, 30, 90].map((d) => (
                    <Button
                      key={d}
                      variant={reportDays === d ? 'default' : 'outline'}
                      size="sm"
                      className={reportDays === d ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold' : 'font-bold'}
                      onClick={() => setReportDays(d)}
                    >
                      {d} days
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm" className="font-bold" onClick={downloadCSV} disabled={!reportData?.csvRows?.length}>
                    <Download className="w-4 h-4 mr-1" /> CSV
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold" onClick={downloadCompliancePDF} disabled={pdfLoading}>
                    {pdfLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Shield className="w-4 h-4 mr-1" />}
                    Ofsted Report
                  </Button>
                </div>
              </div>

              {reportData ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border border-blue-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-600 text-sm font-bold">Total Check-ins</p>
                        <p className="text-3xl font-black text-blue-800">{reportData.summary.totalCheckins}</p>
                      </CardContent>
                    </Card>
                    <Card className="border border-purple-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-600 text-sm font-bold">Avg Mood</p>
                        <p className="text-3xl font-black text-purple-800">{reportData.summary.avgMood}/10</p>
                      </CardContent>
                    </Card>
                    <Card className="border border-green-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-600 text-sm font-bold">Young People</p>
                        <p className="text-3xl font-black text-green-800">{reportData.summary.uniqueYP}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mood Distribution */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-black text-gray-800">Mood Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(reportData.distribution).map(([mood, count]) => {
                          const total = reportData.summary.totalCheckins || 1;
                          const pct = Math.round((count / total) * 100);
                          const colors: Record<string, string> = { amazing: 'bg-green-500', good: 'bg-green-400', okay: 'bg-amber-400', struggling: 'bg-orange-500', 'really-low': 'bg-red-500' };
                          const emoji: Record<string, string> = { amazing: '😄', good: '🙂', okay: '😐', struggling: '😔', 'really-low': '😢' };
                          return (
                            <div key={mood} className="flex items-center gap-3">
                              <span className="w-8 text-center text-lg">{emoji[mood] || '●'}</span>
                              <span className="w-24 text-sm font-bold capitalize text-gray-700">{mood.replace('-', ' ')}</span>
                              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                <div className={`h-full rounded-full ${colors[mood] || 'bg-gray-400'} transition-all`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-16 text-right text-sm font-bold text-gray-600">{count} ({pct}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daily Mood Chart */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-black text-gray-800">Daily Average Mood</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MoodTimelineChart data={reportData.dailyStats.map(d => ({ date: d.date, moodLevel: d.avgMood, mood: '' }))} />
                    </CardContent>
                  </Card>

                  {/* RAG Breakdown Over Time */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-black text-gray-800">Daily RAG Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-3 font-bold text-gray-700">Date</th>
                              <th className="text-center py-2 px-3 font-bold text-red-700">🔴 Red</th>
                              <th className="text-center py-2 px-3 font-bold text-amber-700">🟠 Amber</th>
                              <th className="text-center py-2 px-3 font-bold text-green-700">🟢 Green</th>
                              <th className="text-center py-2 px-3 font-bold text-gray-700">Total</th>
                              <th className="text-center py-2 px-3 font-bold text-gray-700">Avg</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.dailyStats.slice(-14).reverse().map((d) => (
                              <tr key={d.date} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-semibold">{formatShortDate(d.date)}</td>
                                <td className="text-center py-2 px-3"><span className={d.red > 0 ? 'bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold' : 'text-gray-300'}>{d.red}</span></td>
                                <td className="text-center py-2 px-3"><span className={d.amber > 0 ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold' : 'text-gray-300'}>{d.amber}</span></td>
                                <td className="text-center py-2 px-3"><span className={d.green > 0 ? 'bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold' : 'text-gray-300'}>{d.green}</span></td>
                                <td className="text-center py-2 px-3 font-bold">{d.count}</td>
                                <td className="text-center py-2 px-3 font-bold">{d.avgMood}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="ml-3 font-bold text-gray-600">Loading report data...</p>
                </div>
              )}
            </TabsContent>

            {/* ============ INSIGHTS (Phase B) ============ */}
            <TabsContent value="insights" className="space-y-6">
              {/* Period selector */}
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-bold text-gray-500">Analysis period:</p>
                <div className="flex gap-2">
                  {[7, 14, 30, 90].map((d) => (
                    <Button key={d} variant={metricsDays === d ? 'default' : 'outline'} size="sm"
                      className={metricsDays === d ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold' : 'font-bold'}
                      onClick={() => setMetricsDays(d)}>{d}d</Button>
                  ))}
                </div>
              </div>

              {metricsData ? (
                <>
                  {/* ── Success Metrics ── */}
                  <Card className="border border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-xl font-black text-emerald-800 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" /> Staff Performance Metrics
                      </CardTitle>
                      <p className="text-sm text-gray-500">How quickly and effectively the team responds to safeguarding alerts</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl text-center border border-blue-200">
                          <p className="text-xs font-bold text-blue-600 uppercase">Total Alerts</p>
                          <p className="text-2xl font-black text-blue-800">{metricsData.successMetrics.totalAlerts}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl text-center border border-green-200">
                          <p className="text-xs font-bold text-green-600 uppercase">Resolved</p>
                          <p className="text-2xl font-black text-green-800">{metricsData.successMetrics.resolutionRate}%</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl text-center border border-purple-200">
                          <p className="text-xs font-bold text-purple-600 uppercase">Avg Response</p>
                          <p className="text-2xl font-black text-purple-800">{metricsData.successMetrics.avgResponseMin ?? ', '}<span className="text-sm">min</span></p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl text-center border border-amber-200">
                          <p className="text-xs font-bold text-amber-600 uppercase">Avg Resolution</p>
                          <p className="text-2xl font-black text-amber-800">{metricsData.successMetrics.avgResolutionMin ?? ', '}<span className="text-sm">min</span></p>
                        </div>
                      </div>

                      {/* RED/AMBER compliance */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="font-bold text-red-800">RED Alert Performance (15-min target)</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-gray-600">Total:</span> <strong>{metricsData.successMetrics.red.total}</strong></div>
                            <div><span className="text-gray-600">Within 15min:</span> <strong>{metricsData.successMetrics.red.within15min}</strong></div>
                            <div><span className="text-gray-600">Avg response:</span> <strong>{metricsData.successMetrics.red.avgResponseMin ?? ', '}min</strong></div>
                            <div><span className="text-gray-600">Compliance:</span> <strong className={metricsData.successMetrics.red.complianceRate >= 80 ? 'text-green-700' : 'text-red-700'}>{metricsData.successMetrics.red.complianceRate}%</strong></div>
                          </div>
                          {/* Compliance bar */}
                          <div className="mt-2 h-3 bg-red-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${metricsData.successMetrics.red.complianceRate >= 80 ? 'bg-green-500' : metricsData.successMetrics.red.complianceRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${metricsData.successMetrics.red.complianceRate}%` }} />
                          </div>
                        </div>
                        <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <p className="font-bold text-amber-800">AMBER Alert Performance (24h target)</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-gray-600">Total:</span> <strong>{metricsData.successMetrics.amber.total}</strong></div>
                            <div><span className="text-gray-600">Within 24h:</span> <strong>{metricsData.successMetrics.amber.within24h}</strong></div>
                            <div><span className="text-gray-600">Avg response:</span> <strong>{metricsData.successMetrics.amber.avgResponseMin ?? ', '}min</strong></div>
                            <div><span className="text-gray-600">Compliance:</span> <strong className={metricsData.successMetrics.amber.complianceRate >= 80 ? 'text-green-700' : 'text-red-700'}>{metricsData.successMetrics.amber.complianceRate}%</strong></div>
                          </div>
                          <div className="mt-2 h-3 bg-amber-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${metricsData.successMetrics.amber.complianceRate >= 80 ? 'bg-green-500' : metricsData.successMetrics.amber.complianceRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${metricsData.successMetrics.amber.complianceRate}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Extra stats */}
                      <div className="flex flex-wrap gap-3 text-sm">
                        <Badge variant="outline" className="font-bold">Open: {metricsData.successMetrics.open}</Badge>
                        <Badge variant="outline" className="font-bold">Escalated: {metricsData.successMetrics.escalated}</Badge>
                        <Badge variant="outline" className="font-bold">Auto-Escalated: {metricsData.successMetrics.autoEscalated}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Disengagement Alert ── */}
                  {(metricsData.disengagedCount ?? 0) > 0 && (
                    <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-black text-orange-800 flex items-center gap-2">
                          <Clock className="w-5 h-5" /> Silent Disengagement Alert
                        </CardTitle>
                        <p className="text-sm text-orange-700">Young people who haven&apos;t checked in for 3+ days. This may indicate withdrawal, distress, or need for proactive outreach.</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {metricsData.disengagedYPs?.map((yp) => (
                            <button key={yp.anonymousId} onClick={() => setSelectedYP(yp.anonymousId)}
                              className="w-full text-left p-3 rounded-xl border-2 border-orange-300 bg-white hover:shadow-md transition-all flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-lg">⚠️</div>
                                <div>
                                  <p className="font-bold text-gray-800">{yp.name}</p>
                                  <p className="text-xs text-gray-500">{yp.home}</p>
                                </div>
                              </div>
                              <Badge className="bg-orange-600 text-white font-bold">{yp.daysSince} days silent</Badge>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* ── Pattern Detection (Enhanced with Predictions) ── */}
                  <Card className="border border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-xl font-black text-purple-800 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6" /> Risk Prediction Engine
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Young people ranked by risk score (0-10). Factors: latest mood, 7-day trend, RED count, disengagement, day-of-week patterns.
                        {metricsData.atRiskCount > 0 && (
                          <span className="ml-2 text-red-600 font-bold">{metricsData.atRiskCount} at elevated risk</span>
                        )}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {metricsData.patterns.length > 0 ? (
                        <div className="space-y-2">
                          {metricsData.patterns.map((yp) => {
                            const riskColor = yp.riskScore >= 7 ? 'border-red-400 bg-red-50' : yp.riskScore >= 4 ? 'border-amber-300 bg-amber-50' : 'border-green-200 bg-green-50';
                            const trendIcon = yp.trend === 'declining' ? '📉' : yp.trend === 'improving' ? '📈' : '➡️';
                            const trendColor = yp.trend === 'declining' ? 'text-red-700' : yp.trend === 'improving' ? 'text-green-700' : 'text-gray-600';
                            return (
                              <button key={yp.anonymousId} onClick={() => setSelectedYP(yp.anonymousId)}
                                className={`w-full text-left p-3 rounded-xl border-2 ${riskColor} hover:shadow-md transition-all group`}>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${yp.riskScore >= 7 ? 'bg-red-200 text-red-800' : yp.riskScore >= 4 ? 'bg-amber-200 text-amber-800' : 'bg-green-200 text-green-800'}`}>
                                      {yp.riskScore}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-gray-800 truncate">{yp.name}</p>
                                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                        <p className="text-xs text-gray-500">{yp.home} · {yp.totalCheckins} check-ins · {yp.redCount} RED</p>
                                        {yp.isDisengaged && <Badge className="text-[10px] px-1.5 py-0 bg-orange-500 text-white font-bold">{yp.daysSinceLastCheckin}d silent</Badge>}
                                        {yp.lowestDay && <span className="text-[10px] text-purple-600 font-semibold">Low: {yp.lowestDay}s</span>}
                                      </div>
                                      {yp.predictiveNote && (
                                        <p className="text-xs font-semibold text-violet-700 mt-0.5 flex items-center gap-1">
                                          <Sparkles className="w-3 h-3 flex-shrink-0" /> {yp.predictiveNote}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="text-right hidden sm:block">
                                      <p className="text-xs text-gray-500">7d avg</p>
                                      <p className="font-bold text-sm">{yp.avgMood7d ?? ', '}/10</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                      <p className="text-xs text-gray-500">30d avg</p>
                                      <p className="font-bold text-sm">{yp.avgMood30d}/10</p>
                                    </div>
                                    <span className={`text-sm font-bold ${trendColor}`}>{trendIcon} {yp.trend}</span>
                                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                          <p className="font-bold text-gray-600">No patterns detected</p>
                          <p className="text-gray-500 text-sm">More check-in data is needed for pattern analysis</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="ml-3 font-bold text-gray-600">Analysing patterns...</p>
                </div>
              )}
            </TabsContent>

            {/* ============ INVITES ============ */}
            {isLoggedIn && (
              <TabsContent value="invites" className="space-y-6">
                <Card className="border border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-amber-800 flex items-center gap-2">
                      <Plus className="w-7 h-7" /> Create Invite Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateInvite} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inviteDisplayName" className="text-base font-bold text-gray-800">Young Person&apos;s First Name</Label>
                          <Input id="inviteDisplayName" value={inviteDisplayName} onChange={(e) => setInviteDisplayName(e.target.value)} placeholder="e.g. Alex" className="h-12 text-lg border border-gray-300" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inviteGrantedBy" className="text-base font-bold text-gray-800">Your Name (Staff)</Label>
                          <Input id="inviteGrantedBy" value={inviteGrantedBy} onChange={(e) => setInviteGrantedBy(e.target.value)} placeholder="e.g. Sarah Thompson" className="h-12 text-lg border border-gray-300" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inviteRole" className="text-base font-bold text-gray-800">Your Role</Label>
                        <select id="inviteRole" value={inviteGrantedByRole} onChange={(e) => setInviteGrantedByRole(e.target.value)} className="w-full h-12 text-lg border border-gray-300 rounded-md px-3">
                          <option value="care_home_manager">Care Home Manager</option>
                          <option value="key_worker">Key Worker</option>
                          <option value="support_worker">Support Worker</option>
                          <option value="social_worker">Social Worker</option>
                        </select>
                      </div>
                      <Button type="submit" disabled={inviteLoading} className="h-12 px-8 text-lg font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                        {inviteLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating...</> : <><KeyRound className="w-5 h-5 mr-2" /> Generate Invite Code</>}
                      </Button>
                    </form>
                    {generatedCode && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-green-50 border-2 border-green-300 rounded-xl">
                        <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-6 h-6 text-green-600" /><p className="text-lg font-bold text-green-800">Invite Code Created!</p></div>
                        <div className="flex items-center gap-3 mt-3">
                          <code className="text-3xl font-black tracking-widest text-green-900 bg-white px-4 py-2 rounded-lg border border-green-200">{generatedCode}</code>
                          <Button onClick={() => copyCode(generatedCode)} variant="outline" className="h-12 font-bold border-green-300">
                            {codeCopied ? <ClipboardCheck className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                          </Button>
                        </div>
                        <p className="text-sm text-green-700 mt-2 font-semibold">Give this code to the young person. It can only be used once and expires in 30 days.</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border border-amber-200">
                  <CardHeader><CardTitle className="text-xl font-black text-amber-800 flex items-center gap-2"><ClipboardCheck className="w-6 h-6" /> Existing Invite Codes</CardTitle></CardHeader>
                  <CardContent>
                    {inviteCodes.length > 0 ? (
                      <div className="space-y-3">
                        {inviteCodes.map((ic: any) => (
                          <div key={ic.id} className={`p-4 rounded-xl border-2 flex items-center justify-between ${ic.used ? 'bg-gray-50 border-gray-200' : ic.expired ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div><p className="font-black text-lg">{ic.displayName}</p><code className="text-sm font-mono bg-white px-2 py-1 rounded border">{ic.code}</code><p className="text-xs text-gray-500 mt-1">Created by {ic.createdBy} · {ic.careHome}</p></div>
                            <div className="text-right">
                              {ic.used ? <Badge className="bg-gray-500 text-white font-bold">Used</Badge> : ic.expired ? <Badge className="bg-red-500 text-white font-bold">Expired</Badge> : <Badge className="bg-green-500 text-white font-bold">Active</Badge>}
                              <p className="text-xs text-gray-500 mt-1">Expires: {new Date(ic.expiresAt).toLocaleDateString('en-GB')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8"><KeyRound className="w-12 h-12 text-amber-300 mx-auto mb-3" /><p className="text-lg font-bold text-gray-600">No invite codes yet</p></div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ============ STAFF (Login Accounts) ============ */}
            {isHomeAdmin && (
              <TabsContent value="staff" className="space-y-6">
                <Card className="border border-indigo-200">
                  <CardHeader><CardTitle className="text-2xl font-black text-indigo-800 flex items-center gap-2"><UserPlus className="w-7 h-7" /> Create Staff Account</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateStaff} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-base font-bold text-gray-800">Full Name</Label><Input value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="e.g. Sarah Thompson" className="h-12 text-lg border border-gray-300" required /></div>
                        <div className="space-y-2"><Label className="text-base font-bold text-gray-800">Email</Label><Input type="email" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} placeholder="e.g. sarah@example.com" className="h-12 text-lg border border-gray-300" required /></div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label className="text-base font-bold text-gray-800">Password</Label><Input type="password" value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} placeholder="Min 8 characters" className="h-12 text-lg border border-gray-300" required minLength={8} /></div>
                        <div className="space-y-2">
                          <Label className="text-base font-bold text-gray-800">Role</Label>
                          <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="w-full h-12 text-lg border border-gray-300 rounded-md px-3">
                            <option value="STAFF">Staff</option>
                            {isSuperAdmin && <option value="HOME_ADMIN">Home Admin</option>}
                          </select>
                        </div>
                        {isSuperAdmin && (
                          <div className="space-y-2">
                            <Label className="text-base font-bold text-gray-800">Care Home</Label>
                            <select value={selectedCareHomeId} onChange={(e) => setSelectedCareHomeId(e.target.value)} className="w-full h-12 text-lg border border-gray-300 rounded-md px-3">
                              {careHomes.map((h: any) => <option key={h.id} value={h.id}>{h.displayName}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                      <Button type="submit" disabled={staffLoading} className="h-12 px-8 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                        {staffLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating...</> : <><Users className="w-5 h-5 mr-2" /> Create Staff Account</>}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                <Card className="border border-indigo-200">
                  <CardHeader><CardTitle className="text-xl font-black text-indigo-800 flex items-center gap-2"><Users className="w-6 h-6" /> Staff &amp; Admins ({staffUsers.filter((u: any) => u.role !== 'YOUNG_PERSON').length})</CardTitle></CardHeader>
                  <CardContent>
                    {staffUsers.filter((u: any) => u.role !== 'YOUNG_PERSON').length > 0 ? (
                      <div className="space-y-3">
                        {staffUsers.filter((u: any) => u.role !== 'YOUNG_PERSON').map((user: any) => (
                          <div key={user.id} className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${user.status === 'ACTIVE' ? 'border-indigo-100 bg-indigo-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                            <div>
                              <p className="font-black text-lg">{user.displayName}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500 mt-1">{user.careHome?.displayName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right space-y-1">
                                <Badge className={user.role === 'SUPER_ADMIN' ? 'bg-red-500 text-white font-bold' : user.role === 'HOME_ADMIN' ? 'bg-purple-500 text-white font-bold' : 'bg-blue-500 text-white font-bold'}>
                                  {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'HOME_ADMIN' ? 'Home Admin' : 'Staff'}
                                </Badge>
                                <Badge variant="outline" className={user.status === 'ACTIVE' ? 'border-green-300 text-green-700 font-bold' : user.status === 'SUSPENDED' ? 'border-red-300 text-red-600 font-bold' : 'border-gray-300 text-gray-500 font-bold'}>{user.status}</Badge>
                              </div>
                              {user.role !== 'SUPER_ADMIN' && isHomeAdmin && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className={user.status === 'ACTIVE' ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'}
                                    onClick={() => handleToggleUserStatus(user.id, user.status)}
                                  >
                                    {user.status === 'ACTIVE' ? <><EyeOff className="w-4 h-4 mr-1" /> Suspend</> : <><Eye className="w-4 h-4 mr-1" /> Activate</>}
                                  </Button>
                                  {isSuperAdmin && (
                                    <Button size="sm" variant="outline" className="border-red-400 text-red-800 hover:bg-red-100" onClick={() => handleDeleteUser(user.id, user.displayName)} title="Permanently delete">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8"><Users className="w-12 h-12 text-indigo-300 mx-auto mb-3" /><p className="text-lg font-bold text-gray-600">No staff accounts yet</p></div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ============ MANAGE (Staff Profiles, Homes, Tour) ============ */}
            {isHomeAdmin && (
              <TabsContent value="manage" className="space-y-6">
                {/* Sub-navigation */}
                <div className="flex gap-2 flex-wrap">
                  {([
                    { key: 'profiles' as const, label: 'Staff Profiles', icon: Users, desc: 'Visible to young people' },
                    { key: 'homes' as const, label: 'Care Homes', icon: Building2, desc: 'Details & contact info' },
                    { key: 'tour' as const, label: 'House Tour', icon: MapPin, desc: 'Rooms & photos' },
                  ]).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setManageSection(s.key)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${manageSection === s.key ? 'bg-teal-600 text-white border-teal-600 shadow-lg' : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'}`}
                    >
                      <s.icon className="w-4 h-4" />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* ---- Staff Profiles ---- */}
                {manageSection === 'profiles' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-teal-800">Staff Display Profiles ({staffProfiles.length})</h3>
                      <Button onClick={() => initStaffProfileForm()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                        <Plus className="w-4 h-4 mr-1" /> Add Profile
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">These profiles are displayed to young people in the &quot;Meet the Team&quot; section. They are separate from login accounts.</p>

                    {/* Add/Edit Form */}
                    {(showAddStaffProfile || editingStaffProfile) && (
                      <Card className="border-2 border-teal-300 shadow-lg">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-black text-teal-800">{editingStaffProfile ? 'Edit Profile' : 'New Staff Profile'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-1.5"><Label className="font-bold text-gray-700">Name *</Label><Input value={staffProfileForm.name || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, name: e.target.value })} placeholder="e.g. Sarah" className="border border-gray-300" /></div>
                            <div className="space-y-1.5"><Label className="font-bold text-gray-700">Role *</Label><Input value={staffProfileForm.role || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, role: e.target.value })} placeholder="e.g. Support Worker" className="border border-gray-300" /></div>
                            <div className="space-y-1.5">
                              <Label className="font-bold text-gray-700">Home *</Label>
                              <select value={staffProfileForm.home || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, home: e.target.value })} className="w-full h-10 border border-gray-300 rounded-md px-3">
                                <option value="claudius">Claudius</option>
                                <option value="winchester">Winchester</option>
                                <option value="kingsnorth">Kingsnorth</option>
                                <option value="all">All Homes</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <Label className="font-bold text-gray-700">Shift</Label>
                              <select value={staffProfileForm.shift || 'day'} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, shift: e.target.value })} className="w-full h-10 border border-gray-300 rounded-md px-3">
                                <option value="day">Day</option>
                                <option value="night">Night</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                            <div className="space-y-1.5"><Label className="font-bold text-gray-700">Photo (emoji)</Label><Input value={staffProfileForm.photo || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, photo: e.target.value })} placeholder="e.g. 👩‍💼" className="border border-gray-300" /></div>
                            <div className="space-y-1.5"><Label className="font-bold text-gray-700">Fun Fact</Label><Input value={staffProfileForm.funFact || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, funFact: e.target.value })} placeholder="e.g. Loves baking" className="border border-gray-300" /></div>
                          </div>
                          <div className="space-y-1.5"><Label className="font-bold text-gray-700">Description</Label><textarea value={staffProfileForm.description || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, description: e.target.value })} placeholder="Brief bio about this staff member..." className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
                          <div className="space-y-1.5"><Label className="font-bold text-gray-700">Interests (comma-separated)</Label><Input value={staffProfileForm.interests || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, interests: e.target.value })} placeholder="e.g. Football, Music, Cooking" className="border border-gray-300" /></div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="font-bold text-gray-700">When to Talk To</Label><Input value={staffProfileForm.whenToTalkTo || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, whenToTalkTo: e.target.value })} placeholder="e.g. When you need help with school" className="border border-gray-300" /></div>
                            <div className="space-y-1.5"><Label className="font-bold text-gray-700">Favourite Quote</Label><Input value={staffProfileForm.favoriteQuote || ''} onChange={(e) => setStaffProfileForm({ ...staffProfileForm, favoriteQuote: e.target.value })} placeholder="e.g. Every day is a new chance" className="border border-gray-300" /></div>
                          </div>
                          <div className="flex gap-3">
                            <Button onClick={handleSaveStaffProfile} disabled={staffProfileLoading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                              {staffProfileLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save Profile
                            </Button>
                            <Button variant="outline" onClick={() => { setEditingStaffProfile(null); setShowAddStaffProfile(false); setStaffProfileForm({}); }} className="font-bold">Cancel</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Profile List */}
                    <div className="space-y-3">
                      {staffProfiles.map((sp: any) => (
                        <Card key={sp.id} className={`border ${sp.isActive ? 'border-teal-200' : 'border-gray-200 opacity-60'}`}>
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold shrink-0">
                                  {sp.photo || sp.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                  <p className="font-black text-lg">{sp.name}</p>
                                  <p className="text-sm text-gray-600">{sp.role} · {sp.shift} shift</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">{sp.home === 'all' ? 'All Homes' : sp.home}</Badge>
                                    {!sp.isActive && <Badge className="bg-gray-400 text-white text-xs">Inactive</Badge>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Button size="sm" variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50" onClick={() => initStaffProfileForm(sp)}>
                                  <Pencil className="w-4 h-4 mr-1" /> Edit
                                </Button>
                                <Button size="sm" variant="outline" className={sp.isActive ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'} onClick={() => handleToggleStaffActive(sp.id, sp.isActive)}>
                                  {sp.isActive ? <><EyeOff className="w-4 h-4 mr-1" /> Hide</> : <><Eye className="w-4 h-4 mr-1" /> Show</>}
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleDeleteStaffProfile(sp.id, sp.name)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {staffProfiles.length === 0 && (
                        <div className="text-center py-12"><Users className="w-12 h-12 text-teal-300 mx-auto mb-3" /><p className="text-lg font-bold text-gray-600">No staff profiles yet</p><p className="text-gray-500">Add profiles that young people will see in &quot;Meet the Team&quot;</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* ---- Care Homes ---- */}
                {manageSection === 'homes' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-teal-800">Care Home Details</h3>
                    <p className="text-sm text-gray-500">Update contact details and descriptions for each care home.</p>

                    {careHomesFull.map((home: any) => (
                      <Card key={home.id} className="border border-teal-200">
                        <CardContent className="p-5">
                          {editingHome === home.id ? (
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="font-bold text-gray-700">Display Name</Label><Input value={homeForm.displayName || ''} onChange={(e) => setHomeForm({ ...homeForm, displayName: e.target.value })} className="border border-gray-300" /></div>
                                <div className="space-y-1.5"><Label className="font-bold text-gray-700">Email</Label><Input type="email" value={homeForm.email || ''} onChange={(e) => setHomeForm({ ...homeForm, email: e.target.value })} placeholder="contact@example.com" className="border border-gray-300" /></div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="font-bold text-gray-700">Phone</Label><Input value={homeForm.phone || ''} onChange={(e) => setHomeForm({ ...homeForm, phone: e.target.value })} placeholder="01234 567890" className="border border-gray-300" /></div>
                                <div className="space-y-1.5"><Label className="font-bold text-gray-700">Address</Label><Input value={homeForm.address || ''} onChange={(e) => setHomeForm({ ...homeForm, address: e.target.value })} placeholder="123 Care Street, London" className="border border-gray-300" /></div>
                              </div>
                              <div className="space-y-1.5"><Label className="font-bold text-gray-700">Description</Label><textarea value={homeForm.description || ''} onChange={(e) => setHomeForm({ ...homeForm, description: e.target.value })} placeholder="About this care home..." className="w-full h-24 border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
                              <div className="space-y-1.5">
                                <Label className="font-bold text-gray-700 flex items-center gap-2">
                                  <Palette className="w-4 h-4" /> Brand Colour
                                </Label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="color"
                                    value={homeForm.brandColor || '#7c3aed'}
                                    onChange={(e) => setHomeForm({ ...homeForm, brandColor: e.target.value })}
                                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                  />
                                  <Input
                                    value={homeForm.brandColor || ''}
                                    onChange={(e) => setHomeForm({ ...homeForm, brandColor: e.target.value })}
                                    placeholder="#7c3aed"
                                    className="border border-gray-300 w-36 font-mono text-sm"
                                  />
                                  {homeForm.brandColor && (
                                    <button onClick={() => setHomeForm({ ...homeForm, brandColor: '' })} className="text-xs text-gray-500 hover:text-red-600 font-bold">
                                      Reset
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400">Custom colour for this home&apos;s branding. Leave empty for default OKAYiT purple.</p>
                              </div>
                              <div className="flex gap-3">
                                <Button onClick={handleSaveHome} disabled={homeLoading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                                  {homeLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save Changes
                                </Button>
                                <Button variant="outline" onClick={() => setEditingHome(null)} className="font-bold">Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {home.brandColor && (
                                    <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: home.brandColor }} />
                                  )}
                                  <h4 className="text-xl font-black text-gray-900">{home.displayName}</h4>
                                </div>
                                {home.description && <p className="text-sm text-gray-600">{home.description}</p>}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  {home.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {home.address}</span>}
                                  {home.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {home.phone}</span>}
                                  {home.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {home.email}</span>}
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{home._count?.staff || 0} staff profiles</Badge>
                                  <Badge variant="outline" className="text-xs">{home._count?.users || 0} user accounts</Badge>
                                  {home.brandColor && <Badge variant="outline" className="text-xs font-mono">{home.brandColor}</Badge>}
                                </div>
                              </div>
                              <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50 font-bold shrink-0" onClick={() => startEditHome(home)}>
                                <Pencil className="w-4 h-4 mr-1" /> Edit Details
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* ---- House Tour ---- */}
                {manageSection === 'tour' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-teal-800">House Tour Rooms</h3>
                    <p className="text-sm text-gray-500">Customise the virtual tour rooms, descriptions, and features for each care home.</p>

                    {careHomesFull.map((home: any) => (
                      <Card key={home.id} className="border border-teal-200">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-black text-gray-900">{home.displayName}</h4>
                            {editingTourHome === home.id ? (
                              <div className="flex gap-2">
                                <Button onClick={handleSaveTour} disabled={tourLoading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold" size="sm">
                                  {tourLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save Tour
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setEditingTourHome(null)} className="font-bold">Cancel</Button>
                              </div>
                            ) : (
                              <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50 font-bold" size="sm" onClick={() => startEditTour(home)}>
                                <Pencil className="w-4 h-4 mr-1" /> Edit Tour
                              </Button>
                            )}
                          </div>

                          {editingTourHome === home.id ? (
                            <div className="space-y-4">
                              {tourRoomsForm.map((room: any, idx: number) => (
                                <div key={room.id || idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-700">Room {idx + 1}</span>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeTourRoom(idx)}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-600">Room Name</Label><Input value={room.name || ''} onChange={(e) => updateTourRoom(idx, 'name', e.target.value)} placeholder="e.g. Bedroom" className="border border-gray-300" /></div>
                                    <div className="space-y-1">
                                      <Label className="text-xs font-bold text-gray-600">Room Photo</Label>
                                      <div className="flex gap-2 items-center">
                                        <Input value={room.imagePath || ''} onChange={(e) => updateTourRoom(idx, 'imagePath', e.target.value)} placeholder="Photo URL or upload below" className="border border-gray-300 flex-1 text-xs" />
                                        <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 text-xs font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex-shrink-0">
                                          <Camera className="w-4 h-4" /> Upload
                                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return; }
                                            toast.loading('Uploading photo...', { id: `upload-${idx}` });
                                            try {
                                              const res = await fetch('/api/upload/presigned', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: file.name, contentType: file.type }) });
                                              const data = await res.json();
                                              if (!res.ok) throw new Error(data.error);
                                              // Check signed headers to determine if Content-Disposition header is needed
                                              const url = new URL(data.uploadUrl);
                                              const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders') || '';
                                              const uploadHeaders: Record<string, string> = { 'Content-Type': file.type };
                                              if (signedHeaders.includes('content-disposition')) { uploadHeaders['Content-Disposition'] = 'attachment'; }
                                              const uploadRes = await fetch(data.uploadUrl, { method: 'PUT', headers: uploadHeaders, body: file });
                                              if (!uploadRes.ok) throw new Error('Upload failed');
                                              // Build public URL from S3 bucket
                                              const publicUrl = ['https:/', url.hostname, data.cloud_storage_path].join('/');
                                              updateTourRoom(idx, 'imagePath', publicUrl);
                                              toast.success('Photo uploaded!', { id: `upload-${idx}` });
                                            } catch (err: any) { toast.error(err.message || 'Upload failed', { id: `upload-${idx}` }); }
                                            e.target.value = '';
                                          }} />
                                        </label>
                                      </div>
                                      {room.imagePath && (
                                        <div className="mt-2 relative w-20 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                          <img src={room.imagePath} alt={room.name || 'Room'} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-1"><Label className="text-xs font-bold text-gray-600">Description</Label><Input value={room.description || ''} onChange={(e) => updateTourRoom(idx, 'description', e.target.value)} placeholder="About this room..." className="border border-gray-300" /></div>
                                  <div className="space-y-1"><Label className="text-xs font-bold text-gray-600">Features (comma-separated)</Label><Input value={room.features || ''} onChange={(e) => updateTourRoom(idx, 'features', e.target.value)} placeholder="e.g. Private space, Comfortable bed, Storage" className="border border-gray-300" /></div>
                                </div>
                              ))}
                              <Button variant="outline" className="w-full border-dashed border-teal-300 text-teal-600 hover:bg-teal-50 font-bold" onClick={addTourRoom}>
                                <Plus className="w-4 h-4 mr-1" /> Add Room
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {(Array.isArray(home.tourRooms) && home.tourRooms.length > 0 ? home.tourRooms : DEFAULT_ROOMS).map((room: any, idx: number) => (
                                <div key={room.id || idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                                  <p className="font-bold text-sm text-gray-800">{room.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{Array.isArray(room.features) ? room.features.length : 0} features</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* ============ APPROVALS ============ */}
            {isSuperAdmin && (
              <TabsContent value="approvals" className="space-y-6">
                <Card className="border-2 border-red-200 shadow-lg">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center gap-2 text-red-800"><ClipboardCheck className="w-5 h-5" /> Pending Registrations ({pendingApprovals.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {pendingApprovals.length > 0 ? (
                      <div className="space-y-3">
                        {pendingApprovals.map((user: any) => (
                          <div key={user.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <p className="font-bold text-gray-800">{user.displayName}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                  <Badge variant="outline" className="text-xs">{user.role}</Badge>
                                  {user.careHome && <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">{user.careHome.displayName}</Badge>}
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={approvalLoading === user.id} onClick={() => handleApproval(user.id, 'approve')}>
                                  {approvalLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" /> Approve</>}
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" disabled={approvalLoading === user.id} onClick={() => handleApproval(user.id, 'reject')}>Reject</Button>
                                <Button size="sm" variant="outline" className="border-red-400 text-red-800 hover:bg-red-100" disabled={approvalLoading === user.id} onClick={() => handleDeleteUser(user.id, user.displayName)} title="Permanently delete, allows re-registration">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8"><CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" /><p className="text-lg font-bold text-gray-600">All clear!</p><p className="text-gray-500">No pending registrations</p></div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>

      {/* YP Profile Slide-over */}
      <AnimatePresence>
        {selectedYP && <YPProfilePanel anonymousId={selectedYP} onClose={() => setSelectedYP(null)} />}
      </AnimatePresence>
    </div>
  );
}
