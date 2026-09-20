'use client';

// Support: who and what can help me right now.
// Faces first (where the data allows), then verified helplines.
import React, { useCallback, useEffect, useState } from 'react';
import { Phone, LifeBuoy } from 'lucide-react';
import { HELPLINES } from './yp-config';
import { EmptyState, ErrorState, SkeletonCard } from './yp-primitives';

interface StaffPerson {
  id: string; name: string; role: string; shift?: string; photo?: string; description?: string;
}
interface SupportScreenProps {
  homeId?: string | null;
  homeName: string;
  accent: string;
  tint: string;
  onNeedHelp: () => void;
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function SupportScreen({ homeId, homeName, accent, onNeedHelp }: SupportScreenProps) {
  const [people, setPeople] = useState<StaffPerson[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const q = homeId ? `?home=${encodeURIComponent(homeId)}` : '';
      const res = await fetch(`/api/staff${q}`);
      if (!res.ok) throw new Error('bad');
      const data = await res.json();
      const list: StaffPerson[] = Array.isArray(data) ? data : (data.staff || data.data || []);
      setPeople(list);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [homeId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="px-5 pt-6 pb-10 max-w-md mx-auto">
      <h1 className="text-[26px] tracking-tight" style={{ fontFamily: 'var(--yp-display)', color: 'var(--yp-ink)' }}>
        Who is here
      </h1>
      <p className="mt-1 text-[16px]" style={{ color: 'var(--yp-ink-soft)' }}>
        The people at {homeName || 'your home'}, and lines you can call any time.
      </p>

      {/* People */}
      <div className="mt-6 space-y-3">
        {loading && <><SkeletonCard h={76} /><SkeletonCard h={76} /></>}
        {!loading && error && <ErrorState onRetry={load} />}
        {!loading && !error && people && people.length === 0 && (
          <EmptyState title="No one listed yet" hint="Your team will appear here soon. An adult on shift can always help now." />
        )}
        {!loading && !error && people && people.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl p-3 yp-card">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-semibold shrink-0 yp-tint2"
              style={{ color: accent }}
              aria-hidden="true"
            >
              {p.photo && p.photo.length <= 3 ? p.photo : initials(p.name)}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[16px] truncate" style={{ color: 'var(--yp-ink)' }}>{p.name}</p>
              <p className="text-[14px] truncate" style={{ color: 'var(--yp-ink-soft)' }}>{p.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Help lines */}
      <h2 className="mt-9 text-[18px] font-semibold" style={{ color: 'var(--yp-ink)' }}>Lines you can call</h2>
      <p className="mt-1 text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>Free and private. You will not get in trouble for calling.</p>
      <div className="mt-3 space-y-2.5">
        {HELPLINES.map((l) => (
          <a key={l.name} href={l.href} className="flex items-center gap-3 min-h-[56px] px-4 rounded-2xl yp-card">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full shrink-0 yp-tint2" style={{ color: accent }}>
              <Phone className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>{l.name}</span>
              <span className="block text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>{l.number} · {l.line}</span>
            </span>
          </a>
        ))}
      </div>

      <button
        onClick={onNeedHelp}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 min-h-[52px] rounded-2xl font-semibold text-white yp-card-press"
        style={{ background: accent }}
      >
        <LifeBuoy className="w-5 h-5" aria-hidden="true" /> Get help now
      </button>
    </div>
  );
}
