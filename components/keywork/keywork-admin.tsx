'use client';

// Staff and admin view for the Staying Safe Online session.
// Three parts:
//  1. The helpline verification register, with clear flags for
//     routes that are not verified or need re-checking.
//  2. Recent sessions (what was completed, paused or exited).
//  3. Safeguarding flags raised, with acknowledge and resolve.

import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck, ShieldAlert, ShieldQuestion, Phone, Globe,
  Clock, CheckCircle2, AlertTriangle, RefreshCw, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHelpline {
  id: string; name: string; what: string; phone: string | null; web: string | null;
  hours: string; ageEligibility: string; contactMethods: string;
  verifiedBy: string; verifiedOn: string | null; reviewEveryDays: number;
  state: 'verified' | 'not-verified' | 'stale';
}
interface AdminSession {
  id: string; track: string; careHome: string; keyWorkerName: string;
  startedAt: string; sectionsCompleted: string[]; paused: boolean;
  exited: boolean; completedAt: string | null; planSaved: boolean; flagRaised: boolean;
}
interface AdminFlag {
  id: string; track: string; careHome: string; keyWorkerName: string;
  scenarioTitle: string; recipient: string; emailSent: boolean;
  status: string; acknowledgedAt: string | null; acknowledgedBy: string | null;
  outcome: string | null; createdAt: string;
}

function fmt(d: string | null) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London',
    });
  } catch { return d; }
}

function HelplineState({ state }: { state: AdminHelpline['state'] }) {
  if (state === 'verified') {
    return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800"><ShieldCheck className="h-3.5 w-3.5" /> Verified</span>;
  }
  if (state === 'stale') {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"><ShieldQuestion className="h-3.5 w-3.5" /> Needs re-checking</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800"><ShieldAlert className="h-3.5 w-3.5" /> Not verified</span>;
}

export default function KeyworkAdmin() {
  const [loading, setLoading] = useState(true);
  const [helplines, setHelplines] = useState<AdminHelpline[]>([]);
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [flags, setFlags] = useState<AdminFlag[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/keywork/admin');
      const data = await res.json();
      setHelplines(data.helplines || []);
      setSessions(data.sessions || []);
      setFlags(data.flags || []);
    } catch {
      // leave empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateFlag = async (id: string, status: string) => {
    setBusyId(id);
    await fetch('/api/keywork/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
    await load();
    setBusyId(null);
  };

  const notVerifiedCount = helplines.filter((h) => h.state !== 'verified').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Helpline register */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Helpline and reporting register</h3>
          <Button variant="outline" size="sm" onClick={load} className="rounded-lg">
            <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
          </Button>
        </div>
        {notVerifiedCount > 0 && (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{notVerifiedCount} route(s) still need checking before release. Set who checked each one and the date in the session config file.</span>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {helplines.map((h) => (
            <div key={h.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-bold text-gray-900">{h.name}</h4>
                <HelplineState state={h.state} />
              </div>
              <p className="mt-1 text-sm text-gray-600">{h.what}</p>
              <dl className="mt-2 space-y-0.5 text-xs text-gray-600">
                {h.phone && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {h.phone}</div>}
                {h.web && <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> <a href={h.web} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline">Website</a></div>}
                <div><span className="font-semibold">When: </span>{h.hours}</div>
                <div><span className="font-semibold">Who for: </span>{h.ageEligibility}</div>
                <div><span className="font-semibold">How: </span>{h.contactMethods}</div>
              </dl>
              <div className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-500">
                <div><span className="font-semibold">Checked by: </span>{h.verifiedBy}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {h.verifiedOn ? `Verified ${fmt(h.verifiedOn)}` : 'Not yet verified'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safeguarding flags */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Safeguarding flags</h3>
        {flags.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">No flags raised.</p>
        ) : (
          <div className="space-y-3">
            {flags.map((f) => (
              <div key={f.id} className={`rounded-xl border p-4 shadow-sm ${f.status === 'RESOLVED' ? 'border-gray-200 bg-white' : 'border-rose-200 bg-rose-50'}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900">{f.scenarioTitle}</p>
                    <p className="text-sm text-gray-600">{f.careHome} &bull; Track {f.track} &bull; {f.keyWorkerName}</p>
                    <p className="text-xs text-gray-500">Raised {fmt(f.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${f.status === 'OPEN' ? 'bg-rose-200 text-rose-900' : f.status === 'ACKNOWLEDGED' ? 'bg-amber-200 text-amber-900' : 'bg-green-200 text-green-900'}`}>{f.status}</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Alert email: {f.emailSent ? <span className="text-green-700">sent to {f.recipient}</span> : <span className="text-rose-700">not confirmed, follow up in person</span>}
                </p>
                {f.acknowledgedBy && (
                  <p className="mt-1 text-xs text-gray-500">Actioned by {f.acknowledgedBy} at {fmt(f.acknowledgedAt)}</p>
                )}
                <div className="mt-3 flex gap-2">
                  {f.status === 'OPEN' && (
                    <Button size="sm" disabled={busyId === f.id} onClick={() => updateFlag(f.id, 'ACKNOWLEDGED')} className="rounded-lg bg-amber-600 hover:bg-amber-700">
                      {busyId === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Acknowledge'}
                    </Button>
                  )}
                  {f.status !== 'RESOLVED' && (
                    <Button size="sm" disabled={busyId === f.id} onClick={() => updateFlag(f.id, 'RESOLVED')} className="rounded-lg bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="mr-1.5 h-4 w-4" /> Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent sessions */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Recent sessions</h3>
        {sessions.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">No sessions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">Started</th>
                  <th className="px-3 py-2">Key worker</th>
                  <th className="px-3 py-2">Track</th>
                  <th className="px-3 py-2">Sections done</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2 text-gray-700">{fmt(s.startedAt)}</td>
                    <td className="px-3 py-2 text-gray-700">{s.keyWorkerName}</td>
                    <td className="px-3 py-2 text-gray-700">{s.track}</td>
                    <td className="px-3 py-2 text-gray-700">{Array.isArray(s.sectionsCompleted) ? s.sectionsCompleted.length : 0}</td>
                    <td className="px-3 py-2">
                      {s.completedAt ? <span className="text-green-700">Completed</span> : s.exited ? <span className="text-gray-500">Stopped</span> : <span className="text-blue-700">In progress</span>}
                      {s.flagRaised && <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-800">Flag</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500">This view records sections completed only. It never records which options a young person tapped.</p>
      </section>
    </div>
  );
}
