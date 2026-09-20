'use client';

// Manager controls for personalised guide links (containment fix OK-14).
// Staff issue a single use, short lived link for a young person. The raw
// link is shown exactly once and cannot be recovered. Staff can revoke a
// single link or every outstanding link for the home in one action.

import React, { useState, useEffect, useCallback } from 'react';
import {
  Link2, ShieldCheck, Copy, Check, AlertTriangle, RefreshCw,
  Trash2, Loader2, ArrowLeft, Clock, KeyRound, Ban, Info
} from 'lucide-react';

interface Props {
  user?: any;
  onBack?: () => void;
}

type LinkRow = {
  id: string;
  last4: string;
  childPreferredName: string;
  childRoom: string | null;
  keyWorkerName: string | null;
  expiresAt: string;
  useLimit: number;
  useCount: number;
  firstUsedAt: string | null;
  lastUsedAt: string | null;
  revoked: boolean;
  createdAt: string;
  status: 'active' | 'used' | 'expired' | 'revoked';
};

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  used: 'bg-slate-100 text-slate-600 border-slate-200',
  expired: 'bg-amber-100 text-amber-700 border-amber-200',
  revoked: 'bg-rose-100 text-rose-700 border-rose-200',
};

function fmt(d: string | null): string {
  if (!d) return 'Not yet';
  try {
    return new Date(d).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return 'Unknown';
  }
}

export default function GuideLinksManager({ user, onBack }: Props) {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Issue form
  const [preferredName, setPreferredName] = useState('');
  const [room, setRoom] = useState('');
  const [keyWorker, setKeyWorker] = useState('');
  const [expiryDays, setExpiryDays] = useState(1);
  const [useLimit, setUseLimit] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [formError, setFormError] = useState('');

  // One time reveal
  const [issuedUrl, setIssuedUrl] = useState<string | null>(null);
  const [issuedLast4, setIssuedLast4] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Revoke all
  const [confirmAll, setConfirmAll] = useState(false);
  const [revokingAll, setRevokingAll] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch('/api/guide-links', { cache: 'no-store' });
      if (!res.ok) throw new Error('load failed');
      const data = await res.json();
      setLinks(data.links || []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function uploadPhotoIfAny(): Promise<string | null> {
    if (!photoFile) return null;
    // Request a private presigned URL, then upload straight to storage.
    const presign = await fetch('/api/guide-links/photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: photoFile.name, contentType: photoFile.type }),
    });
    if (!presign.ok) throw new Error('Could not prepare the photo upload');
    const { uploadUrl, cloud_storage_path } = await presign.json();
    const put = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': photoFile.type },
      body: photoFile,
    });
    if (!put.ok) throw new Error('The photo upload did not complete');
    return cloud_storage_path as string;
  }

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setIssuedUrl(null);
    if (!preferredName.trim()) {
      setFormError('Please enter the preferred name.');
      return;
    }
    setIssuing(true);
    try {
      let photoStoragePath: string | null = null;
      try {
        photoStoragePath = await uploadPhotoIfAny();
      } catch (err: any) {
        setFormError(err?.message || 'The photo could not be uploaded.');
        setIssuing(false);
        return;
      }
      const res = await fetch('/api/guide-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childPreferredName: preferredName.trim(),
          childRoom: room.trim() || null,
          keyWorkerName: keyWorker.trim() || null,
          photoStoragePath,
          expiryDays,
          useLimit,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error || 'The link could not be created.');
      }
      const data = await res.json();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setIssuedUrl(`${origin}/g/${data.rawToken}`);
      setIssuedLast4(data.last4 || '');
      setCopied(false);
      // Reset the form for the next link.
      setPreferredName('');
      setRoom('');
      setKeyWorker('');
      setExpiryDays(1);
      setUseLimit(1);
      setPhotoFile(null);
      await load();
    } catch (err: any) {
      setFormError(err?.message || 'Something went wrong.');
    } finally {
      setIssuing(false);
    }
  }

  async function copyUrl() {
    if (!issuedUrl) return;
    try {
      await navigator.clipboard.writeText(issuedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setNotice('Copy failed. Please select the link and copy it manually.');
    }
  }

  async function revokeOne(id: string) {
    setBusyId(id);
    setNotice('');
    try {
      const res = await fetch('/api/guide-links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke', id }),
      });
      if (!res.ok) throw new Error('revoke failed');
      await load();
      setNotice('The link was revoked. Any open session has ended.');
    } catch {
      setNotice('That link could not be revoked. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function revokeAll() {
    setRevokingAll(true);
    setNotice('');
    try {
      const res = await fetch('/api/guide-links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke_all' }),
      });
      if (!res.ok) throw new Error('revoke all failed');
      const data = await res.json();
      await load();
      setConfirmAll(false);
      setNotice(`${data.revoked || 0} link(s) revoked. All open sessions have ended.`);
    } catch {
      setNotice('The links could not be revoked. Please try again.');
    } finally {
      setRevokingAll(false);
    }
  }

  const outstanding = links.filter((l) => l.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to overview
          </button>
        )}

        <div className="flex items-start gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center shrink-0">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-slate-900">
              Personalised guide links
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Create a private link to a young person's welcome guide. Each link is single use by
              default and expires on its own. The link is shown once and cannot be recovered, so
              share it straight away.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 mb-8">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            A young person's details are never on a public page. The public house tour carries no
            personal information.
          </span>
        </div>

        {/* Issue form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-purple-600" /> Issue a new link
          </h2>
          <form onSubmit={handleIssue} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preferred name <span className="text-rose-500">*</span>
              </label>
              <input
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="The name the young person likes to be called"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Room (optional)</label>
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="For example, Room 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key worker (optional)</label>
              <input
                value={keyWorker}
                onChange={(e) => setKeyWorker(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Name of their key worker"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expires after (days)</label>
              <input
                type="number" min={1} max={30}
                value={expiryDays}
                onChange={(e) => setExpiryDays(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of uses</label>
              <input
                type="number" min={1} max={10}
                value={useLimit}
                onChange={(e) => setUseLimit(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Photograph (optional)</label>
              <input
                type="file" accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-100 file:px-3 file:py-2 file:text-purple-700 file:font-medium"
              />
              <p className="text-xs text-slate-500 mt-1">
                A photo is stored privately and only ever shown inside the guide through a link that
                expires with the session.
              </p>
            </div>

            {formError && (
              <div className="sm:col-span-2 flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {formError}
              </div>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={issuing}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 text-sm disabled:opacity-60"
              >
                {issuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                {issuing ? 'Creating link' : 'Create link'}
              </button>
            </div>
          </form>

          {/* One time reveal */}
          {issuedUrl && (
            <div className="mt-5 rounded-2xl border-2 border-purple-300 bg-purple-50 p-4">
              <div className="flex items-center gap-2 text-purple-800 font-semibold mb-2">
                <ShieldCheck className="w-5 h-5" /> Link ready (ending {issuedLast4})
              </div>
              <p className="text-sm text-purple-900 mb-3">
                Copy this link now and share it with the young person. It will not be shown again and
                cannot be recovered. If it is lost, revoke it and create a new one.
              </p>
              <div className="flex items-stretch gap-2">
                <input
                  readOnly
                  value={issuedUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 rounded-xl border border-purple-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800"
                />
                <button
                  onClick={copyUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notice */}
        {notice && (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Info className="w-4 h-4 text-purple-600 shrink-0" /> {notice}
          </div>
        )}

        {/* List + revoke all */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Links for this home
            </h2>
            <button
              onClick={load}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Revoke all control */}
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 mb-5">
            <div className="flex items-start gap-3">
              <Ban className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-800">Revoke every link for this home</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  This ends every outstanding link and closes any open session immediately. Use it if
                  a link may have been shared too widely. There are {outstanding} active link(s).
                </p>
                {!confirmAll ? (
                  <button
                    onClick={() => setConfirmAll(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-sm font-medium"
                  >
                    <Ban className="w-4 h-4" /> Revoke all links
                  </button>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={revokeAll}
                      disabled={revokingAll}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
                    >
                      {revokingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                      Yes, revoke all
                    </button>
                    <button
                      onClick={() => setConfirmAll(false)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 py-10 justify-center">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading links
            </div>
          ) : loadError ? (
            <div className="text-sm text-rose-600 py-6 text-center">
              The links could not be loaded. Please refresh.
            </div>
          ) : links.length === 0 ? (
            <div className="text-sm text-slate-500 py-10 text-center">
              No links yet. Create one above.
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 p-3 sm:p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-900">{l.childPreferredName}</span>
                      <span className="text-xs text-slate-400">ending {l.last4}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[l.status]}`}
                      >
                        {l.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-x-4 gap-y-1 flex-wrap">
                      {l.childRoom && <span>Room: {l.childRoom}</span>}
                      {l.keyWorkerName && <span>Key worker: {l.keyWorkerName}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Expires {fmt(l.expiresAt)}
                      </span>
                      <span>Uses: {l.useCount}/{l.useLimit}</span>
                    </div>
                  </div>
                  {!l.revoked && l.status !== 'revoked' ? (
                    <button
                      onClick={() => revokeOne(l.id)}
                      disabled={busyId === l.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 px-3 py-1.5 text-sm font-medium disabled:opacity-60 shrink-0"
                    >
                      {busyId === l.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Revoke
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 shrink-0">Revoked</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
