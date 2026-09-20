'use client';

// ---------------------------------------------------------------------------
// OKAYiT — Young Person Experience v2 : the shell (premium redesign).
// Four tabs, each one job. A calm Help everywhere. Two skins, chosen once.
// Light and dark. No messaging, no AI chat, no streaks, no scores.
// ---------------------------------------------------------------------------
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Compass, HeartHandshake, User, Loader2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { getAccent, type Skin, type TabId } from './yp-config';
import { getHomeContext, type HomeContext } from '@/lib/home-contexts';
import StartScreen from './start-screen';
import ExploreScreen from './explore-screen';
import SupportScreen from './support-screen';
import MyStuffScreen from './mystuff-screen';
import { HelpButton, HelpSheet, ProtectiveRoute } from './help-fab';

// --- Content registry (lazy) -----------------------------------------------
const WelcomeJourney = dynamic(() => import('../welcome-journey'), { ssr: false, loading: () => <ContentLoading /> });
const EmotionalCheckIn = dynamic(() => import('../emotional-check-in'), { ssr: false, loading: () => <ContentLoading /> });
const StoryV2 = dynamic(() => import('../enhanced-story-experience-v2'), { ssr: false, loading: () => <ContentLoading /> });
const DigitalResources = dynamic(() => import('../digital-resources-library'), { ssr: false, loading: () => <ContentLoading /> });
const IdentityProfile = dynamic(() => import('../identity-profile'), { ssr: false, loading: () => <ContentLoading /> });
const PositiveRelationships = dynamic(() => import('../positive-relationships'), { ssr: false, loading: () => <ContentLoading /> });
const CareStandards = dynamic(() => import('../care-standards'), { ssr: false, loading: () => <ContentLoading /> });
const CalmCorner = dynamic(() => import('../calm-corner'), { ssr: false, loading: () => <ContentLoading /> });
const MyJournal = dynamic(() => import('../my-private-journal'), { ssr: false, loading: () => <ContentLoading /> });
const MySafetyPlan = dynamic(() => import('../my-safety-plan'), { ssr: false, loading: () => <ContentLoading /> });
const MoodTrends = dynamic(() => import('../mood-trends'), { ssr: false, loading: () => <ContentLoading /> });
const AccessibilityPanel = dynamic(() => import('../accessibility-settings-panel'), { ssr: false, loading: () => <ContentLoading /> });
const WelcomeGuideSimple = dynamic(() => import('./front-door-content').then((m) => m.WelcomeGuide), { ssr: false, loading: () => <ContentLoading /> });
const WhatNextSimple = dynamic(() => import('./front-door-content').then((m) => m.WhatNext), { ssr: false, loading: () => <ContentLoading /> });
// Restored full-feature pages
const EnhancedWelcomeGuide = dynamic(() => import('../enhanced-welcome-guide'), { ssr: false, loading: () => <ContentLoading /> });
const WhatHappensNext = dynamic(() => import('../what-happens-next'), { ssr: false, loading: () => <ContentLoading /> });
const MeetTheTeam = dynamic(() => import('../meet-the-team'), { ssr: false, loading: () => <ContentLoading /> });
const UnderstandingTheSystem = dynamic(() => import('../understanding-the-system'), { ssr: false, loading: () => <ContentLoading /> });
const CareQuests = dynamic(() => import('../care-quests'), { ssr: false, loading: () => <ContentLoading /> });
const EnhancedFamilyGaming = dynamic(() => import('../enhanced-family-gaming'), { ssr: false, loading: () => <ContentLoading /> });
const ReflectionToolkit = dynamic(() => import('../reflection-toolkit'), { ssr: false, loading: () => <ContentLoading /> });
const EnhancedResourcesLibrary = dynamic(() => import('../enhanced-resources-library'), { ssr: false, loading: () => <ContentLoading /> });
const YPResources = dynamic(() => import('../yp-resources'), { ssr: false, loading: () => <ContentLoading /> });
const KeyWorkerResources = dynamic(() => import('../keyworker-resources'), { ssr: false, loading: () => <ContentLoading /> });
const DailyWellbeingCheckIn = dynamic(() => import('../daily-wellbeing-checkin'), { ssr: false, loading: () => <ContentLoading /> });
const MyImportantInfo = dynamic(() => import('../my-important-info'), { ssr: false, loading: () => <ContentLoading /> });
const AchievementCertificates = dynamic(() => import('../achievement-certificates'), { ssr: false, loading: () => <ContentLoading /> });
const FeedbackSystem = dynamic(() => import('../feedback-system'), { ssr: false, loading: () => <ContentLoading /> });
const QRCodeScanner = dynamic(() => import('../qr-code-scanner'), { ssr: false, loading: () => <ContentLoading /> });

function ContentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--yp-ground)' }}>
      <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--yp-ink-soft)' }} aria-label="Loading" />
    </div>
  );
}

interface YpExperienceProps { user: any; session?: any; }

// Content keys that keep their own immersive/full-bleed design (no unified ground override)
const THEME_EXEMPT = new Set<string>(['story', 'welcome-guide', 'house-tour']);

const TABS: { id: TabId; label: string; Icon: any }[] = [
  { id: 'start', label: 'Home', Icon: House },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'support', label: 'Support', Icon: HeartHandshake },
  { id: 'mystuff', label: 'My stuff', Icon: User },
];

function ThemeToggle({ mounted }: { mounted: boolean }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full yp-card-press"
      style={{ background: 'var(--yp-surface-2)', color: 'var(--yp-ink)' }}
    >
      {mounted ? (isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <span className="w-5 h-5" />}
    </button>
  );
}

export default function YpExperience({ user }: YpExperienceProps) {
  const homeId: string | null = user?.careHomeId || null;
  const homeNameRaw: string = user?.careHomeName || '';
  const acc = useMemo(() => getAccent(homeId), [homeId]);
  const homeName = homeNameRaw || acc.name;
  const homeCtx: HomeContext = useMemo(() => (
    (homeId ? getHomeContext(homeId) : undefined) || {
      id: 'okayit', name: homeName, fullName: homeName,
      description: '', location: '', welcomeVideoUrl: '',
      theme: { primary: acc.accent, secondary: acc.tint, gradient: '' },
    }
  ), [homeId, homeName, acc.accent, acc.tint]);

  const [mounted, setMounted] = useState(false);
  const [skin, setSkin] = useState<Skin | null>(null);
  const [tab, setTab] = useState<TabId>('start');
  const [content, setContent] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [protectiveOpen, setProtectiveOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem('okayit_skin');
      if (s === 'younger' || s === 'older') setSkin(s);
    } catch { /* ignore */ }
  }, []);

  const chooseSkin = useCallback((s: Skin) => {
    setSkin(s);
    try { localStorage.setItem('okayit_skin', s); } catch { /* ignore */ }
  }, []);

  const openContent = useCallback((key: string) => { setContent(key); window.scrollTo(0, 0); }, []);
  const closeContent = useCallback(() => setContent(null), []);
  const switchTab = useCallback((t: TabId) => { setContent(null); setTab(t); window.scrollTo(0, 0); }, []);
  const needHelp = useCallback(() => setHelpOpen(true), []);

  const effSkin: Skin = skin ?? 'older';

  const renderContent = () => {
    switch (content) {
      case 'welcome-tour': return <WelcomeJourney currentHome={homeCtx} onComplete={closeContent} onSkipToExplore={() => { closeContent(); switchTab('explore'); }} onAskQuestion={() => { closeContent(); switchTab('support'); }} />;
      case 'welcome-guide': return <EnhancedWelcomeGuide onBack={closeContent} currentHome={homeCtx} />;
      case 'welcome-guide-simple': return <WelcomeGuideSimple onBack={closeContent} accent={acc.accent} tint={acc.tint} homeId={homeId} homeName={homeName} />;
      case 'house-tour': return <QRCodeScanner isOpen onClose={closeContent} onQRDetected={() => { closeContent(); switchTab('explore'); }} />;
      case 'meet-team': return <MeetTheTeam onBack={closeContent} currentHome={homeId || homeName} />;
      case 'what-next': return <WhatHappensNext onBack={closeContent} />;
      case 'what-next-simple': return <WhatNextSimple onBack={closeContent} accent={acc.accent} tint={acc.tint} homeId={homeId} homeName={homeName} />;
      case 'reflect': return <EmotionalCheckIn onComplete={closeContent} />;
      case 'reflection': return <ReflectionToolkit onBack={closeContent} />;
      case 'story': return <StoryV2 onBack={closeContent} />;
      case 'games': return <EnhancedFamilyGaming onBack={closeContent} user={user} />;
      case 'lifeskills': return <DigitalResources onBack={closeContent} />;
      case 'resources': return <EnhancedResourcesLibrary onBack={closeContent} />;
      case 'yp-resources': return <YPResources onBack={closeContent} onNavigateToSection={(k: string) => openContent(k)} />;
      case 'quests': return <CareQuests onBack={closeContent} user={user} />;
      case 'aboutme': return <IdentityProfile onBack={closeContent} />;
      case 'people': return <PositiveRelationships onBack={closeContent} user={user} />;
      case 'your-rights': return <UnderstandingTheSystem onBack={closeContent} />;
      case 'care-standards': return <CareStandards onBack={closeContent} />;
      case 'rights': return <CareStandards onBack={closeContent} />;
      case 'keyworker': return <KeyWorkerResources onBack={closeContent} />;
      case 'wellbeing': return <DailyWellbeingCheckIn onBack={closeContent} user={user} onNavigateToSupport={() => switchTab('support')} onNavigateToResources={() => openContent('resources')} onNavigateToReflection={() => openContent('reflection')} />;
      case 'calm': return <CalmCorner onBack={closeContent} />;
      case 'feedback': return <FeedbackSystem onBack={closeContent} />;
      case 'journal': return <MyJournal onBack={closeContent} />;
      case 'safety': return <MySafetyPlan onBack={closeContent} />;
      case 'my-info': return <MyImportantInfo onBack={closeContent} />;
      case 'certificates': return <AchievementCertificates onBack={closeContent} user={user} />;
      case 'mood-story': return <MoodTrends onBack={closeContent} />;
      case 'accessibility': return (
        <div className="min-h-screen" style={{ background: 'var(--yp-ground)' }}>
          <AccessibilityPanel inline isOpen onClose={closeContent} />
        </div>
      );
      default: return null;
    }
  };

  const screen = () => {
    switch (tab) {
      case 'start': return <StartScreen user={user} accent={acc.accent} homeName={homeName} homeId={homeId} skin={effSkin} onSwitchTab={switchTab} onOpenContent={openContent} onNeedHelp={needHelp} />;
      case 'explore': return <ExploreScreen accent={acc.accent} tint={acc.tint} homeName={homeName} skin={effSkin} onOpenContent={openContent} />;
      case 'support': return <SupportScreen homeId={homeId} homeName={homeName} accent={acc.accent} tint={acc.tint} onNeedHelp={needHelp} />;
      case 'mystuff': return <MyStuffScreen accent={acc.accent} tint={acc.tint} homeName={homeName} skin={effSkin} onSetSkin={chooseSkin} onOpenContent={openContent} onSwitchTab={switchTab} />;
      default: return null;
    }
  };

  const wrapperStyle = {
    background: 'var(--yp-ground)',
    '--yp-display': 'var(--font-fraunces), Georgia, serif',
    '--accent': acc.accent,
  } as React.CSSProperties;

  const younger = effSkin === 'younger';

  return (
    <div className={`yp-root ${younger ? 'yp-skin-younger' : 'yp-skin-older'}`} style={wrapperStyle}>
      <div className="min-h-screen" style={{ background: 'var(--yp-ground)', color: 'var(--yp-ink)' }}>
        {/* Header — home name left, one gentle control (light/dark) right */}
        <header className="sticky top-0 z-40 px-5 h-16 flex items-center justify-between"
          style={{ background: 'var(--yp-glass)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid var(--yp-line)' }}>
          <span className="text-[19px] tracking-tight" style={{ fontFamily: 'var(--yp-display)', color: acc.accent }}>{homeName}</span>
          <ThemeToggle mounted={mounted} />
        </header>

        {/* Active screen */}
        <main className="pb-32">{screen()}</main>

        {/* Persistent calm Help */}
        {!content && !protectiveOpen && <HelpButton onOpen={needHelp} accent={acc.accent} />}
        <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} homeName={homeName}
          onProtective={() => { setHelpOpen(false); setProtectiveOpen(true); }} />
        <ProtectiveRoute open={protectiveOpen} onClose={() => setProtectiveOpen(false)} homeName={homeName} />

        {/* Floating premium bottom navigation */}
        <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-3" aria-label="Main">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1 rounded-[24px] p-1.5"
            style={{ background: 'var(--yp-glass)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid var(--yp-line)', boxShadow: 'var(--yp-shadow-md)' }}>
            {TABS.map((t) => {
              const active = tab === t.id && !content;
              const Icon = t.Icon;
              return (
                <button key={t.id}
                  onClick={() => switchTab(t.id)}
                  aria-label={t.label}
                  aria-current={active ? 'page' : undefined}
                  className="relative flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-[18px] yp-card-press"
                  style={{ color: active ? acc.accent : 'var(--yp-ink-soft)', background: active ? 'color-mix(in srgb, var(--accent) 12%, var(--yp-surface))' : 'transparent' }}>
                  <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
                  <span className="text-[11px] font-semibold tracking-tight">{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Full-screen content overlay */}
        <AnimatePresence>
          {content && (
            <motion.div
              className={`${THEME_EXEMPT.has(content as string) ? '' : 'yp-legacy'} fixed inset-0 z-[9990] overflow-y-auto`}
              style={{ background: 'var(--yp-ground)', color: 'var(--yp-ink)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* First-run skin chooser — asked once */}
        <AnimatePresence>
          {mounted && skin === null && (
            <motion.div className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
              <motion.div role="dialog" aria-label="Choose how OKAYiT looks"
                className="relative w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] p-6 yp-elev"
                style={{ background: 'var(--yp-surface)' }}
                initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}>
                <h2 className="text-[24px] tracking-tight" style={{ fontFamily: 'var(--yp-display)', color: 'var(--yp-ink)' }}>Welcome to OKAYiT</h2>
                <p className="mt-1 text-[16px]" style={{ color: 'var(--yp-ink-soft)' }}>
                  Pick the feel that suits you best. You can change this any time in My stuff.
                </p>
                <div className="mt-5 space-y-3">
                  <button onClick={() => chooseSkin('younger')}
                    className="w-full text-left rounded-2xl p-5 yp-card yp-card-press">
                    <span className="block font-semibold text-[17px]" style={{ color: 'var(--yp-ink)' }}>Bigger and friendlier</span>
                    <span className="block text-[14px] mt-0.5" style={{ color: 'var(--yp-ink-soft)' }}>Larger text and warmer touches</span>
                  </button>
                  <button onClick={() => chooseSkin('older')}
                    className="w-full text-left rounded-2xl p-5 yp-card yp-card-press">
                    <span className="block font-semibold text-[17px]" style={{ color: 'var(--yp-ink)' }}>Calm and simple</span>
                    <span className="block text-[14px] mt-0.5" style={{ color: 'var(--yp-ink-soft)' }}>Quieter, cleaner and more direct</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
