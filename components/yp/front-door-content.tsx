'use client';

// Native front-door content: a short welcome guide and a first day/week/month
// timeline. Uses only the home's own documented details — nothing invented.
import React from 'react';
import { BackBar } from './yp-primitives';
import { getHomeContext } from '@/lib/home-contexts';

interface Props { onBack: () => void; accent: string; tint: string; homeId?: string | null; homeName: string; }

export function WelcomeGuide({ onBack, accent, tint, homeId, homeName }: Props) {
  const ctx = homeId ? getHomeContext(homeId) : undefined;
  return (
    <div className="min-h-screen" style={{ background: '#F7F6F3' }}>
      <div className="px-5 pt-4 pb-12 max-w-md mx-auto">
        <BackBar label="Front door" onBack={onBack} accent={accent} />
        <h1 className="mt-3 text-[24px]" style={{ fontFamily: 'var(--yp-display)', color: '#23252B' }}>Your welcome guide</h1>
        <p className="mt-1 text-[16px]" style={{ color: '#5B5F6B' }}>A few short bits about {homeName || 'your home'}.</p>

        {ctx && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl p-5" style={{ background: tint }}>
              <h2 className="font-semibold text-[17px]" style={{ color: '#23252B' }}>Where you are</h2>
              <p className="mt-1 text-[16px]" style={{ color: '#23252B' }}>{ctx.description}</p>
              <p className="mt-1 text-[14px]" style={{ color: '#5B5F6B' }}>{ctx.location}</p>
            </div>
            {ctx.welcomeVideoUrl && ctx.welcomeVideoUrl.includes('embed') && (
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#E5E2DB' }}>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={ctx.welcomeVideoUrl}
                    title={`Welcome to ${homeName}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {[
            { h: 'This space is yours', b: 'What you write and save here is private to you on this device.' },
            { h: 'Ask any time', b: 'There is always an adult on shift. No question is too small.' },
            { h: 'Go at your own pace', b: 'Nothing here is a test. Look around when you feel like it.' },
          ].map((c) => (
            <div key={c.h} className="rounded-2xl p-4 border" style={{ borderColor: '#E5E2DB', background: '#FFFFFF' }}>
              <h3 className="font-semibold text-[16px]" style={{ color: '#23252B' }}>{c.h}</h3>
              <p className="mt-0.5 text-[15px]" style={{ color: '#5B5F6B' }}>{c.b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WhatNext({ onBack, accent, tint, homeName }: Props) {
  const blocks = [
    { when: 'Your first day', points: ['Someone will show you around and where things are.', 'You will get your own room and a chance to settle.', 'You do not have to talk about anything you are not ready to.'] },
    { when: 'Your first week', points: ['You will meet the people who work here.', 'You will learn how days usually go, meals, school, free time.', 'You can ask for anything you are unsure about.'] },
    { when: 'Your first month', points: ['You will have a plan that is about you and your future.', 'You will get to say what matters to you.', 'Things will start to feel more familiar.'] },
  ];
  return (
    <div className="min-h-screen" style={{ background: '#F7F6F3' }}>
      <div className="px-5 pt-4 pb-12 max-w-md mx-auto">
        <BackBar label="Front door" onBack={onBack} accent={accent} />
        <h1 className="mt-3 text-[24px]" style={{ fontFamily: 'var(--yp-display)', color: '#23252B' }}>What happens next</h1>
        <p className="mt-1 text-[16px]" style={{ color: '#5B5F6B' }}>A gentle idea of how things go at {homeName || 'your home'}.</p>
        <div className="mt-5 space-y-4">
          {blocks.map((blk) => (
            <div key={blk.when} className="rounded-2xl p-5 border" style={{ borderColor: '#E5E2DB', background: '#FFFFFF' }}>
              <h2 className="font-semibold text-[17px]" style={{ color: accent }}>{blk.when}</h2>
              <ul className="mt-2 space-y-2">
                {blk.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[16px]" style={{ color: '#23252B' }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
