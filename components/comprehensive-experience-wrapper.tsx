
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Maximize2, Sparkles, Camera, Accessibility, Home, FileText, Target, Shield, Award, ChevronLeft, Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import comprehensive components
import ComprehensiveMainMenu from './comprehensive-main-menu';
import GuidedWelcome, { JOURNEY_STEPS } from './guided-welcome';
import WelcomeJourney from './welcome-journey';
import EnhancedWelcomeGuide from './enhanced-welcome-guide';
import MeetTheTeam from './meet-the-team';
// Staff admin panel uses separate /api/admin endpoint
// import { StaffAdminPanel } from './staff-admin-panel';
import UnderstandingTheSystem from './understanding-the-system';
import InteractiveTourSimple from './interactive-tour-simple';
import InteractiveTourSimulation from './interactive-tour-simulation';
import EnhancedFamilyGaming from './enhanced-family-gaming';
import PositiveRelationships from './positive-relationships';
import EnhancedStoryExperienceV2 from './enhanced-story-experience-v2';
import ReflectionToolkit from './reflection-toolkit';
import EnhancedSupportResources from './enhanced-support-resources';
import KeyWorkerResources from './keyworker-resources';
import AchievementCertificates from './achievement-certificates';
import DailyWellbeingCheckIn from './daily-wellbeing-checkin';
import EnhancedResourcesLibrary from './enhanced-resources-library';
import ProgressDashboard from './progress-dashboard-new';
import FeedbackSystem from './feedback-system';
import SavedWorkManager from './saved-work-manager';
import OKAYiTLogo from './okayit-logo';
import QRCodeScanner from './qr-code-scanner';
import AccessibilitySettingsPanel from './accessibility-settings-panel';
import { GDPRFooterBadge } from './gdpr-compliance-banner';
import AdminDashboard from './admin-dashboard';
import MyPrivateJournal from './my-private-journal';
import MyImportantInfo from './my-important-info';
import IdentityProfile from './identity-profile';
import MoodTrends from './mood-trends';
import DataBackup from './data-backup';
import MySafetyPlan from './my-safety-plan';
import WhatHappensNext from './what-happens-next';
import CareStandards from './care-standards';
import YPResources from './yp-resources';
import CalmCorner from './calm-corner';
import CareQuests from './care-quests';

// Utils
import { okayitTheme, combineThemeClasses, tikTokTransitions } from '@/lib/okayit-theme';
import { HomeContext, HOME_CONTEXTS, getHomeContext } from '@/lib/home-contexts';
import { offlineStorage } from '@/lib/offline-storage';
import { secureLogout } from '@/lib/secure-logout';

interface ComprehensiveExperienceWrapperProps {
  user?: any;
  session?: any;
  initialSection?: string;
}

export default function ComprehensiveExperienceWrapper({ user, session, initialSection = 'welcome' }: ComprehensiveExperienceWrapperProps) {
  // Skip induction for returning users
  const computedInitial = (() => {
    if (initialSection !== 'welcome') return initialSection;
    if (typeof window !== 'undefined') {
      try { if (localStorage.getItem('okayit_induction_done') === 'true') return 'main-menu'; } catch {}
    }
    return 'welcome';
  })();
  const isPending = user?.status === 'PENDING';
  const [currentSection, setCurrentSection] = useState(computedInitial);
  const [currentHome, setCurrentHome] = useState<HomeContext>(HOME_CONTEXTS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [lastMenuTab, setLastMenuTab] = useState(0);
  const [userName, setUserName] = useState<string>(() => {
    // Prefer session displayName
    if (session?.user?.displayName) return session.user.displayName;
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;
    return 'Guest';
  });
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState<Record<string, boolean>>({});

  // Keep userName in sync with session/user prop
  useEffect(() => {
    const name = session?.user?.displayName || user?.displayName || user?.name;
    if (name) setUserName(name);
  }, [session?.user?.displayName, user?.displayName, user?.name]);

  // Load user data and journey progress
  useEffect(() => {
    const loadUserData = async () => {
      // Only use offline storage as fallback if no session name
      if (session?.user?.displayName || user?.displayName) return;
      try {
        const registration = await offlineStorage.getSetting('user_registration');
        if (registration && registration.firstName) {
          setUserName(registration.firstName);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();

    // Load journey progress from localStorage
    try {
      const saved = localStorage.getItem('okayit-journey-progress');
      if (saved) {
        setJourneyProgress(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // White-label: apply brandColor from DB for current care home
  useEffect(() => {
    const applyBrandColor = async () => {
      try {
        const res = await fetch('/api/care-homes?public=true');
        if (!res.ok) return;
        const { data: homes } = await res.json();
        const match = homes?.find((h: any) => h.name === currentHome.id);
        if (match?.brandColor) {
          document.documentElement.style.setProperty('--brand-color', match.brandColor);
          document.documentElement.style.setProperty('--brand-color-light', match.brandColor + '18');
        } else {
          document.documentElement.style.removeProperty('--brand-color');
          document.documentElement.style.removeProperty('--brand-color-light');
        }
      } catch { /* ignore */ }
    };
    applyBrandColor();
    return () => {
      document.documentElement.style.removeProperty('--brand-color');
      document.documentElement.style.removeProperty('--brand-color-light');
    };
  }, [currentHome.id]);

  // Track journey step visits
  const markStepVisited = useCallback((stepId: string) => {
    // Map section IDs to journey step IDs
    const journeyMapping: Record<string, string> = {
      'welcome-guide': 'welcome-guide',
      'house-tour': 'welcome-guide',
      'virtual-tour': 'welcome-guide',
      'meet-team': 'meet-team',
      'keyworker-resources': 'meet-team',
      'family-gaming': 'explore-more',
      'positive-relationships': 'explore-more',
      'reflective-stories': 'explore-more',
      'reflection-toolkit': 'explore-more',
      'digital-resources': 'daily-life',
      'understanding-system': 'understanding-system',
      'support-center': 'support-center',
      'personal-wellbeing': 'personal-wellbeing',
      'daily-life': 'daily-life',
      'explore-more': 'explore-more',
    };
    const journeyStepId = journeyMapping[stepId] || stepId;
    setJourneyProgress(prev => {
      const updated = { ...prev, [journeyStepId]: true };
      try { localStorage.setItem('okayit-journey-progress', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
  }, []);

  // Auto-hide header on scroll — reveal on hover at top edge
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Hide header while scrolling
      setIsHeaderVisible(false);
    };

    // Reveal header/nav when mouse near top/bottom edge (desktop)
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 20) {
        setIsHeaderVisible(true);
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => setIsHeaderVisible(false), 4000);
      }
      if (e.clientY > window.innerHeight - 10) {
        setIsBottomNavVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimeout);
    };
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC key to go back to main menu
      if (e.key === 'Escape' && currentSection !== 'main-menu') {
        handleBackToMenu();
      }
      // H key to toggle header
      if (e.key === 'h' || e.key === 'H') {
        setIsHeaderVisible(prev => !prev);
      }
      // F key for fullscreen
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection]);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    // Track journey progress when navigating to a section
    markStepVisited(section);
  };

  const handleBackToMenu = () => {
    setCurrentSection('main-menu');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleBackToWelcome = () => {
    setCurrentSection('welcome');
  };

  // Find next incomplete journey step for "Continue where you left off"
  const getNextJourneyStep = () => {
    for (const step of JOURNEY_STEPS) {
      if (!journeyProgress[step.id]) {
        return step.id;
      }
    }
    return 'main-menu'; // All done, go to full menu
  };

  const handleHomeChange = (homeId: string) => {
    const newHome = getHomeContext(homeId);
    if (newHome) {
      setCurrentHome(newHome);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderCurrentSection = () => {
    const sectionProps = {
      user,
      session,
      currentHome,
      onBackToMenu: handleBackToMenu,
      onHomeChange: handleHomeChange
    };

    const sections: Record<string, React.ReactElement> = {
      'welcome': (
        <WelcomeJourney
          currentHome={currentHome}
          onComplete={() => setCurrentSection('main-menu')}
          onSkipToExplore={() => setCurrentSection('main-menu')}
          onAskQuestion={() => handleSectionChange('support-center')}
        />
      ),
      'main-menu': (
        <ComprehensiveMainMenu
          onMenuSelect={handleSectionChange}
          {...sectionProps}
          userName={userName}
          onBackToWelcome={handleBackToWelcome}
          defaultTab={lastMenuTab}
          onTabChange={setLastMenuTab}
          onAccessibilityOpen={() => setShowAccessibility(true)}
        />
      ),
      'house-tour': (
        <InteractiveTourSimple
          onBack={handleBackToMenu}
        />
      ),
      'virtual-tour': (
        <InteractiveTourSimulation
          onBack={handleBackToMenu}
        />
      ),
      'welcome-guide': (
        <EnhancedWelcomeGuide
          onBack={handleBackToMenu}
          currentHome={currentHome}
        />
      ),
      'meet-team': (
        <MeetTheTeam
          onBack={handleBackToMenu}
          currentHome={currentHome.id}
        />
      ),
      'understanding-system': (
        <UnderstandingTheSystem
          onBack={handleBackToMenu}
        />
      ),
      'admin-dashboard': (
        <AdminDashboard onBack={handleBackToMenu} />
      ),
      'accessibility-settings': (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button onClick={handleBackToMenu} variant="outline" size="lg" className="font-bold">
                ← Back to Menu
              </Button>
            </div>
            <AccessibilitySettingsPanel isOpen={true} onClose={handleBackToMenu} inline={true} />
          </div>
        </div>
      ),
      'content-management': (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button onClick={handleBackToMenu} variant="outline" size="lg" className="font-bold">
                ← Back to Menu
              </Button>
            </div>
            <Card className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">📝 Content Manager</h1>
              <p className="text-sm text-gray-600 mb-6">Platform resources and materials</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">📖 Stories Library</h3>
                  <p className="text-xs text-gray-600">Reflective stories and experiences</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">📚 Resource Library</h3>
                  <p className="text-xs text-gray-600">Guides and downloadable materials</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">🏠 House Guides</h3>
                  <p className="text-xs text-gray-600">Welcome guides and tours</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">📞 Support Resources</h3>
                  <p className="text-xs text-gray-600">Helplines and support contacts</p>
                </Card>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-gray-800 font-medium">Content editing is managed by the admin team. Contact your manager to request changes to platform content.</p>
              </div>
            </Card>
          </div>
        </div>
      ),
      'family-gaming': (
        <EnhancedFamilyGaming
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'positive-relationships': (
        <PositiveRelationships
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'reflective-stories': (
        <EnhancedStoryExperienceV2
          onBack={handleBackToMenu}
        />
      ),
      'reflection-toolkit': (
        <ReflectionToolkit
          onBack={handleBackToMenu}
        />
      ),
      'support-center': (
        <EnhancedSupportResources
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'keyworker-resources': (
        <KeyWorkerResources
          onBack={handleBackToMenu}
        />
      ),
      'digital-resources': (
        <EnhancedResourcesLibrary
          onBack={handleBackToMenu}
        />
      ),
      'personal-wellbeing': (
        <DailyWellbeingCheckIn
          onBack={handleBackToMenu}
          user={user}
          onNavigateToSupport={() => setCurrentSection('support-center')}
          onNavigateToResources={() => setCurrentSection('digital-resources')}
          onNavigateToReflection={() => setCurrentSection('reflection-toolkit')}
        />
      ),
      'certificates': (
        <AchievementCertificates
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'achievements': (
        <AchievementCertificates
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'progress': (
        <ProgressDashboard
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'feedback': (
        <FeedbackSystem
          onBack={handleBackToMenu}
        />
      ),
      'saved-work': (
        <SavedWorkManager
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'my-journal': (
        <MyPrivateJournal onBack={handleBackToMenu} />
      ),
      'my-info': (
        <MyImportantInfo onBack={handleBackToMenu} />
      ),
      'identity-profile': (
        <IdentityProfile onBack={handleBackToMenu} />
      ),
      'mood-trends': (
        <MoodTrends onBack={handleBackToMenu} />
      ),
      'data-backup': (
        <DataBackup onBack={handleBackToMenu} />
      ),
      'safety-plan': (
        <MySafetyPlan onBack={handleBackToMenu} />
      ),
      'what-happens-next': (
        <WhatHappensNext onBack={handleBackToMenu} />
      ),
      'care-standards': (
        <CareStandards onBack={handleBackToMenu} />
      ),
      'yp-resources': (
        <YPResources onBack={handleBackToMenu} />
      ),
      'calm-corner': (
        <CalmCorner onBack={handleBackToMenu} />
      ),
      'care-quests': (
        <CareQuests onBack={handleBackToMenu} user={user} />
      )
    };

    return sections[currentSection] || sections['main-menu'];
  };

  // ── Pending Approval Screen (desktop) ──
  if (isPending) {
    return (
      <div className={combineThemeClasses("min-h-screen relative", okayitTheme.backgrounds.page)}>
        <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
          {/* Pending Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-amber-200 p-8 shadow-lg text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-5">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to OKAYiT!</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-5">
              Your account is awaiting approval from an administrator. 
              While you wait, feel free to explore the introduction below to learn about OKAYiT.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-amber-800">
                ✨ This usually takes up to 24 hours. If you need access urgently, speak to your care home manager.
              </p>
            </div>
          </motion.div>

          {/* Welcome Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-purple-200 p-8 shadow-md"
          >
            <EnhancedWelcomeGuide
              onBack={() => {}}
              currentHome={currentHome}
            />
          </motion.div>

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={() => secureLogout()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={combineThemeClasses("min-h-screen relative", okayitTheme.backgrounds.page)}>
      {/* Floating buttons removed for cleaner interface */}

      {/* Compact Header Bar - Auto-hides on scroll */}
      <AnimatePresence>
        {isHeaderVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={combineThemeClasses(
              "sticky top-0 z-40 border-b shadow-sm",
              okayitTheme.backgrounds.glass,
              "border-white/30 dark:border-purple-200/30"
            )}
            onMouseEnter={() => setIsHeaderVisible(true)}
          >
            <div className="max-w-7xl mx-auto px-4 py-1.5">
              <div className="flex items-center justify-between">
                {/* Left: Logo and Home Name */}
                <div className="flex items-center space-x-3">
                  <OKAYiTLogo width={36} height={36} />
                  <div>
                    <h1 className={combineThemeClasses("text-sm font-bold leading-tight", okayitTheme.text.primary)}>
                      {currentHome.fullName}
                    </h1>
                    <p className={combineThemeClasses("text-xs", okayitTheme.text.secondary)}>
                      Hello, {userName}! 👋
                    </p>
                  </div>
                </div>
                
                {/* Right: Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="h-8 px-3 text-xs"
                  >
                    <Maximize2 className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsHeaderVisible(false)}
                    className="h-8 px-3 text-xs"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with gentle fade transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="relative"
        >
          {renderCurrentSection()}
        </motion.div>
      </AnimatePresence>

      {/* QR Scanner removed - users can access from bottom navigation */}

      {/* QR Code Scanner Modal */}
      <QRCodeScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onQRDetected={(data) => {
          console.log('QR Code detected:', data);
          // Handle QR code data - navigate to appropriate section
          if (data.includes('house-tour') || data.includes('room')) {
            setCurrentSection('house-tour');
          }
          setIsQRScannerOpen(false);
        }}
      />

      {/* Enhanced Bottom Navigation Menu - Fully hidden by default, reveal on hover at bottom edge */}
      {currentSection !== 'main-menu' && currentSection !== 'welcome' && (
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: isBottomNavVisible ? 0 : 200 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t-4 border-purple-400 shadow-lg bg-white pb-safe"
          onMouseEnter={() => setIsBottomNavVisible(true)}
          onMouseLeave={() => setIsBottomNavVisible(false)}
          onTouchStart={() => setIsBottomNavVisible(v => !v)}
        >
          <div className="max-w-7xl mx-auto px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              {/* Prominent Back Button */}
              <Button
                onClick={handleBackToMenu}
                className="flex items-center gap-2 h-14 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-xl shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>Back to Menu</span>
              </Button>
              
              {/* Quick Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection('progress')}
                  className="flex-col h-14 px-4 border border-blue-300 hover:bg-blue-50 rounded-xl"
                >
                  <Target className="w-5 h-5 mb-1 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">Progress</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection('support-center')}
                  className="flex-col h-14 px-4 border border-green-300 hover:bg-green-50 rounded-xl"
                >
                  <Shield className="w-5 h-5 mb-1 text-green-600" />
                  <span className="text-xs font-bold text-green-700">Help</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection('certificates')}
                  className="flex-col h-14 px-4 border border-orange-300 hover:bg-orange-50 rounded-xl"
                >
                  <Award className="w-5 h-5 mb-1 text-orange-600" />
                  <span className="text-xs font-bold text-orange-700">Awards</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer - Only show on main menu or welcome */}
      {(currentSection === 'main-menu' || currentSection === 'welcome') && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={combineThemeClasses(
            "mt-12 border-t py-6",
            okayitTheme.backgrounds.glass,
            "border-white/30 dark:border-purple-200/30"
          )}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              {/* Privacy badge */}
              <GDPRFooterBadge />
              
              <p className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
                © {new Date().getFullYear()} OKAYiT Interactive Experience Platform
              </p>
              <p className={combineThemeClasses("text-xs", okayitTheme.text.muted)}>
                Your Privacy Matters • We Only Store What You Choose to Share
              </p>
              <a
                href="/login"
                className="text-xs text-gray-400 hover:text-purple-600 transition-colors mt-2"
              >
                Staff Login
              </a>
            </div>
          </div>
        </motion.footer>
      )}

      {/* Global Accessibility Settings Panel - Controlled */}
      <AccessibilitySettingsPanel 
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </div>
  );
}
