'use client';

// Shared, calm UI states used across every screen so lists never dead-end.
import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export function BackBar({ label, onBack, accent }: { label: string; onBack: () => void; accent: string }) {
  return (
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 min-h-[48px] px-1 text-[15px] font-semibold"
      style={{ color: accent }}
    >
      <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-12 px-6">
      <p className="text-[17px] font-semibold" style={{ color: 'var(--yp-ink)' }}>{title}</p>
      <p className="mt-1 text-[15px]" style={{ color: 'var(--yp-ink-soft)' }}>{hint}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <p className="text-[17px] font-semibold" style={{ color: 'var(--yp-ink)' }}>That did not load</p>
      <p className="mt-1 text-[15px]" style={{ color: 'var(--yp-ink-soft)' }}>Check your connection and try once more.</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 min-h-[48px] px-5 rounded-xl font-semibold yp-card-press"
          style={{ background: 'var(--yp-ink)', color: 'var(--yp-surface)' }}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> Try again
        </button>
      ) : null}
    </div>
  );
}

export function SkeletonCard({ h = 96 }: { h?: number }) {
  return (
    <div
      className="rounded-2xl animate-pulse"
      style={{ height: h, background: 'var(--yp-surface-2)' }}
      aria-hidden="true"
    />
  );
}
