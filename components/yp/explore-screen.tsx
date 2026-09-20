'use client';

// Explore: the house. Doors, not a list. Real room photos. Search lives here only.
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ChevronRight, X } from 'lucide-react';
import { ROOMS, type Room, type Skin } from './yp-config';
import { BackBar, EmptyState } from './yp-primitives';

interface ExploreScreenProps {
  accent: string;
  tint: string;
  homeName: string;
  skin: Skin;
  onOpenContent: (key: string) => void;
}

export default function ExploreScreen({ accent, homeName, onOpenContent }: ExploreScreenProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const out: { roomLabel: string; key: string; label: string; line: string }[] = [];
    ROOMS.forEach((r) => r.items.forEach((it) => {
      if (it.label.toLowerCase().includes(q) || it.line.toLowerCase().includes(q) || r.label.toLowerCase().includes(q)) {
        out.push({ roomLabel: r.label, key: it.key, label: it.label, line: it.line });
      }
    }));
    return out;
  }, [query]);

  // --- Room detail --------------------------------------------------------
  if (room) {
    const Icon = room.Icon;
    return (
      <div className="px-5 pt-4 pb-10 max-w-md mx-auto">
        <BackBar label="The house" onBack={() => setRoom(null)} accent={accent} />
        <div className="mt-3 relative rounded-[26px] overflow-hidden yp-elev">
          <div className="relative aspect-[16/9]">
            <Image src={room.photo} alt={`${room.label} at ${homeName}`} fill className="object-cover" sizes="(max-width:480px) 100vw, 480px" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.05))' }} />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" aria-hidden="true" />
                <h1 className="text-[24px] font-semibold tracking-tight">{room.label}</h1>
              </div>
              <p className="text-[14px] opacity-90">{room.line}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {room.items.map((it) => (
            <button key={it.key} onClick={() => onOpenContent(it.key)}
              className="w-full flex items-center justify-between gap-3 min-h-[64px] px-4 rounded-2xl yp-card yp-card-press text-left">
              <span className="min-w-0">
                <span className="block font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>{it.label}</span>
                <span className="block text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>{it.line}</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- House map ----------------------------------------------------------
  return (
    <div className="px-5 pt-6 pb-10 max-w-md mx-auto">
      <h1 className="text-[26px] tracking-tight" style={{ fontFamily: 'var(--yp-display)', color: 'var(--yp-ink)' }}>Explore</h1>
      <p className="mt-1 text-[16px]" style={{ color: 'var(--yp-ink-soft)' }}>Tap a door to go in.</p>

      {/* Search — lives here only */}
      <div className="mt-4 relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--yp-ink-soft)' }} aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Look for something"
          aria-label="Search the house"
          className="w-full min-h-[50px] pl-10 pr-10 rounded-2xl text-[16px] outline-none yp-card"
          style={{ color: 'var(--yp-ink)' }}
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-2" style={{ color: 'var(--yp-ink-soft)' }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {results ? (
        <div className="mt-5 space-y-3">
          {results.length === 0 ? (
            <EmptyState title="Nothing matched" hint="Try another word, or tap a door below to look around." />
          ) : results.map((r) => (
            <button key={r.key} onClick={() => onOpenContent(r.key)}
              className="w-full flex items-center justify-between gap-3 min-h-[64px] px-4 rounded-2xl yp-card yp-card-press text-left">
              <span className="min-w-0">
                <span className="block font-semibold text-[16px]" style={{ color: 'var(--yp-ink)' }}>{r.label}</span>
                <span className="block text-[14px]" style={{ color: 'var(--yp-ink-soft)' }}>{r.roomLabel} · {r.line}</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {ROOMS.map((r, i) => {
            const Icon = r.Icon;
            return (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => setRoom(r)}
                className="relative rounded-[22px] overflow-hidden text-left min-h-[140px] yp-card yp-card-press"
              >
                <div className="relative h-24">
                  <Image src={r.photo} alt="" fill className="object-cover" sizes="200px" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
                </div>
                <div className="p-3" style={{ background: 'var(--yp-surface)' }}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" style={{ color: accent }} aria-hidden="true" />
                    <span className="font-semibold text-[15px]" style={{ color: 'var(--yp-ink)' }}>{r.label}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-snug" style={{ color: 'var(--yp-ink-soft)' }}>{r.line}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
