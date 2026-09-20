'use client';

import React, { useState } from 'react';
import {
  AlertCircle, AlertTriangle, CheckCircle, Clock,
  ChevronRight, ChevronDown, Home, Shield,
  UserCheck, Phone, ArrowUpCircle, FileText, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AlertActionData {
  id: string; status: string; alertLevel: string;
  acknowledgedAt: string | null; acknowledgedBy: string | null;
  escalatedAt: string | null; escalatedReason: string | null; autoEscalated: boolean;
  resolvedAt: string | null; resolvedBy: string | null; outcome: string | null;
  actions: Array<{ action: string; note: string | null; actorName: string; actorId: string; actorRole: string; timestamp: string }>;
  createdAt: string;
}

interface YPStatus {
  anonymousId: string; displayName: string | null; home: string;
  mood: string; moodLevel: number; note: string | null;
  createdAt: string; rag: 'RED' | 'AMBER' | 'GREEN';
  alertAction: AlertActionData | null; isOverdue: boolean; minutesSinceCheckin: number;
}

interface Props {
  yp: YPStatus;
  onViewProfile: () => void;
  onActionComplete: () => void;
  authToken?: string | null;
}

const ragConfig = {
  RED: { bg: 'bg-red-50 border-red-300', text: 'text-red-800', badge: 'bg-red-600 text-white', icon: AlertCircle, label: 'Needs Support' },
  AMBER: { bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800', badge: 'bg-amber-500 text-white', icon: AlertTriangle, label: 'Monitor' },
  GREEN: { bg: 'bg-green-50 border-green-300', text: 'text-green-800', badge: 'bg-green-600 text-white', icon: CheckCircle, label: 'Doing Well' },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  OPEN: { label: 'Open', color: 'bg-red-100 text-red-800 border-red-300', icon: AlertCircle },
  ACKNOWLEDGED: { label: 'Acknowledged', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: UserCheck },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Clock },
  ESCALATED: { label: 'Escalated', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: ArrowUpCircle },
  RESOLVED: { label: 'Resolved', color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
};

function formatTimeAgo(minutes: number): string {
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h ago`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function SafeguardingAlertCard({ yp, onViewProfile, onActionComplete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [resolveNote, setResolveNote] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showResolveForm, setShowResolveForm] = useState(false);

  const cfg = ragConfig[yp.rag];
  const Icon = cfg.icon;
  const alert = yp.alertAction;
  const status = alert ? (statusConfig[alert.status] || statusConfig.OPEN) : null;
  const hasAlert = yp.rag !== 'GREEN' && alert;

  async function performAction(action: string, note?: string) {
    if (!alert) return;
    setActionLoading(action);
    try {
      const res = await fetch('/api/alert-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: alert.id, action, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Action failed');
        return;
      }
      const labels: Record<string, string> = {
        acknowledge: 'Alert acknowledged',
        spoke_with_yp: 'Logged: Spoke with young person',
        escalated_to_manager: 'Escalated to manager',
        referred_social_worker: 'Referred to social worker',
        resolve: 'Alert resolved',
      };
      toast.success(labels[action] || 'Action recorded');
      setShowResolveForm(false);
      setResolveNote('');
      onActionComplete();
    } catch {
      toast.error('Network error, please try again');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className={`rounded-xl border-2 transition-all ${
      yp.isOverdue ? 'border-red-500 shadow-lg shadow-red-200 ring-2 ring-red-400 ring-offset-1' :
      yp.rag === 'RED' ? 'border-red-300' :
      yp.rag === 'AMBER' ? 'border-amber-300' : 'border-green-200'
    } ${cfg.bg}`}>
      {/* Header Row */}
      <button
        onClick={() => yp.rag !== 'GREEN' ? setExpanded(!expanded) : onViewProfile()}
        className="w-full text-left p-4 group"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={`w-5 h-5 flex-shrink-0 ${cfg.text}`} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-black text-lg ${cfg.text} truncate`}>{yp.displayName || 'Anonymous'}</p>
                {yp.isOverdue && (
                  <Badge className="bg-red-600 text-white text-[10px] font-bold animate-pulse">⏰ OVERDUE</Badge>
                )}
                {alert?.autoEscalated && (
                  <Badge className="bg-purple-600 text-white text-[10px]">AUTO-ESCALATED</Badge>
                )}
              </div>
              <p className="text-sm opacity-70">
                {yp.mood} ({yp.moodLevel}/10) · {formatTimeAgo(yp.minutesSinceCheckin)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={`${cfg.badge} font-bold`}>{yp.rag}</Badge>
            {status && (
              <Badge className={`${status.color} border font-bold text-xs`}>{status.label}</Badge>
            )}
            <Badge variant="outline" className="font-bold text-xs hidden sm:flex">
              <Home className="w-3 h-3 mr-1" />{yp.home}
            </Badge>
            {yp.rag !== 'GREEN' ? (
              expanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />
            ) : (
              <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            )}
          </div>
        </div>
        {yp.note && yp.rag === 'RED' && (
          <p className="mt-2 p-2 bg-white/60 rounded-lg text-sm">&ldquo;{yp.note}&rdquo;</p>
        )}
      </button>

      {/* Expanded Action Panel — only for RED/AMBER */}
      {expanded && hasAlert && (
        <div className="px-4 pb-4 space-y-4 border-t border-black/10">
          {/* ── Staff Action Buttons ── */}
          {alert.status !== 'RESOLVED' && (
            <div className="pt-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Staff Actions</p>
              <div className="flex flex-wrap gap-2">
                {(alert.status === 'OPEN' || alert.status === 'ESCALATED') && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    disabled={actionLoading !== null}
                    onClick={(e) => { e.stopPropagation(); performAction('acknowledge'); }}
                  >
                    {actionLoading === 'acknowledge' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <UserCheck className="w-4 h-4 mr-1" />}
                    Acknowledge
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 font-bold"
                  disabled={actionLoading !== null}
                  onClick={(e) => { e.stopPropagation(); performAction('spoke_with_yp'); }}
                >
                  {actionLoading === 'spoke_with_yp' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Phone className="w-4 h-4 mr-1" />}
                  Spoke with YP
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 font-bold"
                  disabled={actionLoading !== null}
                  onClick={(e) => { e.stopPropagation(); performAction('escalated_to_manager'); }}
                >
                  {actionLoading === 'escalated_to_manager' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <ArrowUpCircle className="w-4 h-4 mr-1" />}
                  Escalate to Manager
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-400 text-green-700 hover:bg-green-50 font-bold"
                  disabled={actionLoading !== null}
                  onClick={(e) => { e.stopPropagation(); setShowResolveForm(!showResolveForm); }}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Resolve
                </Button>
              </div>
            </div>
          )}

          {/* ── Resolve Form ── */}
          {showResolveForm && alert.status !== 'RESOLVED' && (
            <div className="p-3 bg-white rounded-lg border border-green-200 space-y-2" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold text-gray-700">Outcome Notes (required)</p>
              <textarea
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                placeholder="Describe the outcome and resolution..."
                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-400 min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  disabled={resolveNote.trim().length < 5 || actionLoading !== null}
                  onClick={() => performAction('resolve', resolveNote)}
                >
                  {actionLoading === 'resolve' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                  Confirm Resolution
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowResolveForm(false); setResolveNote(''); }}>
                  Cancel
                </Button>
              </div>
              {resolveNote.trim().length > 0 && resolveNote.trim().length < 5 && (
                <p className="text-xs text-red-500">Minimum 5 characters required</p>
              )}
            </div>
          )}

          {/* ── Resolved Outcome ── */}
          {alert.status === 'RESOLVED' && alert.outcome && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Resolution Outcome</p>
              <p className="text-sm text-gray-700">{alert.outcome}</p>
              <p className="text-xs text-gray-500 mt-1">
                Resolved by {alert.resolvedBy} · {alert.resolvedAt ? formatDateTime(alert.resolvedAt) : ''}
              </p>
            </div>
          )}

          {/* ── Action History (immutable audit trail) ── */}
          {alert.actions && alert.actions.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Action History</p>
              <div className="space-y-1">
                {alert.actions.map((a, i) => {
                  const labels: Record<string, string> = {
                    acknowledge: '✅ Acknowledged',
                    spoke_with_yp: '📞 Spoke with young person',
                    escalated_to_manager: '⬆️ Escalated to manager',
                    referred_social_worker: '👤 Referred to social worker',
                    resolve: '✔️ Resolved',
                    auto_escalated: '🚨 Auto-escalated',
                  };
                  return (
                    <div key={i} className="flex items-start gap-2 p-2 bg-white/70 rounded text-xs">
                      <Shield className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="font-bold">{labels[a.action] || a.action}</span>
                        <span className="text-gray-500"> by {a.actorName} ({a.actorRole})</span>
                        {a.note && <p className="text-gray-600 mt-0.5">{a.note}</p>}
                        <p className="text-gray-400">{formatDateTime(a.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* View Profile link */}
          <button
            onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
            className="text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            View full wellbeing profile <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
