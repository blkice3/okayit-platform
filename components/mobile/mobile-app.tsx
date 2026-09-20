
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download,
  WifiOff,
  Home,
  ArrowLeft,
  Menu,
  MoreVertical,
  RefreshCw
} from 'lucide-react';

// Components
import MobileNavigation from './mobile-navigation';
import MobileQRScanner from './mobile-qr-scanner';
import ComprehensiveMainMenu from '../comprehensive-main-menu';
import EnhancedWelcomeGuide from '../enhanced-welcome-guide';
import MeetTheTeam from '../meet-the-team';
import { StaffAdminPanel } from '../staff-admin-panel';
import UnderstandingTheSystem from '../understanding-the-system';
import EnhancedHouseLayout from '../enhanced-house-layout';
import InteractiveTourSimple from '../interactive-tour-simple';
import InteractiveTourSimulation from '../interactive-tour-simulation';
import EnhancedFamilyGaming from '../enhanced-family-gaming';
import PositiveRelationships from '../positive-relationships';
import EnhancedStoryExperienceV2 from '../enhanced-story-experience-v2';
import ReflectionToolkit from '../reflection-toolkit';
import EnhancedSupportResources from '../enhanced-support-resources';
import KeyWorkerResources from '../keyworker-resources';
import AchievementCertificates from '../achievement-certificates';
import DailyWellbeingCheckIn from '../daily-wellbeing-checkin';
import EnhancedResourcesLibrary from '../enhanced-resources-library';
import ProgressDashboard from '../progress-dashboard-new';
import FeedbackSystem from '../feedback-system';
import AccessibilitySettingsPanel from '../accessibility-settings-panel';
import GuidedWelcome, { JOURNEY_STEPS } from '../guided-welcome';
import WelcomeJourney from '../welcome-journey';
import OKAYiTLogo from '../okayit-logo';
import MyPrivateJournal from '../my-private-journal';
import MyImportantInfo from '../my-important-info';
import IdentityProfile from '../identity-profile';
import MoodTrends from '../mood-trends';
import DataBackup from '../data-backup';
import MySafetyPlan from '../my-safety-plan';
import WhatHappensNext from '../what-happens-next';
import CareStandards from '../care-standards';
import YPResources from '../yp-resources';
import CalmCorner from '../calm-corner';
import CareQuests from '../care-quests';
import AdminDashboard from '../admin-dashboard';
import MobileHomeScreen from './mobile-home-screen';

// Utils
import { device, hapticFeedback, installApp, TouchGestureManager } from '@/lib/mobile-utils';
import { offlineStorage, preloadEssentialContent } from '@/lib/offline-storage';
import { okayitTheme, combineThemeClasses, tikTokTransitions } from '@/lib/okayit-theme';
import { HomeContext, HOME_CONTEXTS, getHomeContext } from '@/lib/home-contexts';
import { secureLogout } from '@/lib/secure-logout';
import { Clock, LogOut, Shield as ShieldIcon } from 'lucide-react';

interface MobileAppProps {
  initialSection?: string;
  user?: any;
  session?: any;
}

interface AppState {
  currentSection: string;
  isOnline: boolean;
  isInstallable: boolean;
  isLoading: boolean;
  error: string | null;
  notifications: number;
  currentHome: HomeContext;
  showQRScanner: boolean;
  swipeDirection: 'left' | 'right' | null;
}

export default function MobileApp({ initialSection = 'welcome', user, session }: MobileAppProps) {
  // Skip induction for returning users
  const computedInitial = (() => {
    if (initialSection !== 'welcome') return initialSection;
    if (typeof window !== 'undefined') {
      try { if (localStorage.getItem('okayit_induction_done') === 'true') return 'home-screen'; } catch {}
    }
    return 'welcome';
  })();
  const [state, setState] = useState<AppState>({
    currentSection: computedInitial,
    isOnline: navigator.onLine,
    isInstallable: false,
    isLoading: true,
    error: null,
    notifications: 0,
    currentHome: (user?.careHomeId ? getHomeContext(user.careHomeId) : null) || HOME_CONTEXTS[0],
    showQRScanner: false,
    swipeDirection: null
  });

  const isPending = user?.status === 'PENDING';
  const [lastMenuTab, setLastMenuTab] = useState(0);
  const [showMobileAccessibility, setShowMobileAccessibility] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);
  const gestureManagerRef = useRef<TouchGestureManager | null>(null);

  useEffect(() => {
    initializeMobileApp();
    setupGestureHandling();
    setupNetworkHandling();
    setupInstallPrompt();
    
    return () => {
      if (gestureManagerRef.current) {
        // Cleanup gesture manager
      }
    };
  }, []);

  const initializeMobileApp = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Initialize offline storage
      await offlineStorage.initialize();
      
      // Preload essential content
      await preloadEssentialContent();
      
      // Check for cached user progress
      if (user?.id) {
        const progress = await offlineStorage.getUserProgress(user.id);
        if (progress) {
          console.log('Loaded user progress:', progress);
        }
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        notifications: Math.floor(Math.random() * 3) // Simulate notifications
      }));
    } catch (error) {
      console.error('Failed to initialize mobile app:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to initialize app' 
      }));
    }
  };

  const setupGestureHandling = () => {
    if (!appRef.current || !device.isMobile()) return;

    gestureManagerRef.current = new TouchGestureManager(appRef.current);
    
    appRef.current.addEventListener('swipeleft', () => {
      handleSwipeNavigation('left');
    });
    
    appRef.current.addEventListener('swiperight', () => {
      handleSwipeNavigation('right');
    });
    
    appRef.current.addEventListener('swipeup', () => {
      handleSwipeUp();
    });
    
    appRef.current.addEventListener('swipedown', () => {
      handleSwipeDown();
    });
  };

  const setupNetworkHandling = () => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      hapticFeedback.notification('success');
      syncOfflineData();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      hapticFeedback.notification('warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  const setupInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      // @ts-ignore
      window.deferredPrompt = e;
      setState(prev => ({ ...prev, isInstallable: true }));
    });
  };

  const syncOfflineData = async () => {
    if (!state.isOnline) return;

    try {
      const pendingData = await offlineStorage.getPendingSync();
      console.log(`Syncing ${pendingData.length} items...`);
      
      for (const item of pendingData) {
        // Simulate API sync
        await new Promise(resolve => setTimeout(resolve, 100));
        await offlineStorage.markAsSynced(item.id);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleSwipeNavigation = (direction: 'left' | 'right') => {
    setState(prev => ({ ...prev, swipeDirection: direction }));
    hapticFeedback.selection();

    const sections = ['main-menu', 'house-tour', 'welcome-guide', 'family-gaming', 'reflective-stories'];
    const currentIndex = sections.indexOf(state.currentSection);

    if (direction === 'left' && currentIndex < sections.length - 1) {
      handleSectionChange(sections[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      handleSectionChange(sections[currentIndex - 1]);
    }

    setTimeout(() => {
      setState(prev => ({ ...prev, swipeDirection: null }));
    }, 300);
  };

  const handleSwipeUp = () => {
    // Open quick actions or settings
    hapticFeedback.impact('light');
  };

  const handleSwipeDown = () => {
    // Refresh or pull to refresh
    handleRefresh();
  };

  const handleSectionChange = (section: string) => {
    setState(prev => ({ ...prev, currentSection: section }));
    hapticFeedback.selection();
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    
    // Save user navigation for analytics
    if (user?.id) {
      offlineStorage.saveSetting('lastSection', section);
    }
  };

  const handleQRDetected = (data: string) => {
    hapticFeedback.notification('success');
    
    // Handle QR code data
    if (data.includes('room-')) {
      handleSectionChange('house-tour');
      // Additional room-specific logic
    } else {
      console.log('QR Data:', data);
    }
    
    setState(prev => ({ ...prev, showQRScanner: false }));
  };

  const handleInstallApp = async () => {
    if (!state.isInstallable) return;
    
    hapticFeedback.impact('medium');
    const installed = await installApp.prompt();
    
    if (installed) {
      setState(prev => ({ ...prev, isInstallable: false }));
      hapticFeedback.notification('success');
    }
  };

  const handleRefresh = () => {
    hapticFeedback.impact('light');
    setState(prev => ({ ...prev, isLoading: true }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoading: false }));
      hapticFeedback.notification('success');
    }, 1000);
  };

  const handleBackToMenu = () => {
    handleSectionChange('home-screen');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleHomeChange = (homeId: string) => {
    const newHome = getHomeContext(homeId);
    if (newHome) {
      setState(prev => ({ ...prev, currentHome: newHome }));
      hapticFeedback.selection();
    }
  };

  // Journey progress for mobile
  const [journeyProgress, setJourneyProgress] = React.useState<Record<string, boolean>>({});
  
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('okayit-journey-progress');
      if (saved) setJourneyProgress(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const markStepVisited = React.useCallback((stepId: string) => {
    const journeyMapping: Record<string, string> = {
      'welcome-guide': 'welcome-guide', 'house-tour': 'welcome-guide', 'virtual-tour': 'welcome-guide',
      'meet-team': 'meet-team', 'keyworker-resources': 'meet-team',
      'family-gaming': 'explore-more', 'reflective-stories': 'explore-more', 'reflection-toolkit': 'explore-more',
      'digital-resources': 'daily-life', 'understanding-system': 'understanding-system',
      'support-center': 'support-center', 'personal-wellbeing': 'personal-wellbeing',
      'daily-life': 'daily-life', 'explore-more': 'explore-more',
    };
    const journeyStepId = journeyMapping[stepId] || stepId;
    setJourneyProgress(prev => {
      const updated = { ...prev, [journeyStepId]: true };
      try { localStorage.setItem('okayit-journey-progress', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
  }, []);

  const handleSectionChangeTracked = (section: string) => {
    handleSectionChange(section);
    markStepVisited(section);
  };

  const getNextJourneyStep = () => {
    for (const step of JOURNEY_STEPS) {
      if (!journeyProgress[step.id]) return step.id;
    }
    return 'main-menu';
  };

  // Pending approval screen — intro/tutorial only
  const renderPendingContent = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 pt-16 pb-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Pending Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-lg text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to OKAYiT!</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Your account is awaiting approval from an administrator. 
              While you wait, feel free to explore the introduction below to learn about OKAYiT.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                ✨ This usually takes up to 24 hours. If you need access urgently, speak to your care home manager.
              </p>
            </div>
          </motion.div>

          {/* Welcome Guide — the only section pending users can access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-purple-200 p-6 shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">About OKAYiT</h3>
                <p className="text-xs text-gray-500">Learn what OKAYiT can do for you</p>
              </div>
            </div>
            <EnhancedWelcomeGuide
              onBack={() => {}}
              currentHome={state.currentHome}
            />
          </motion.div>

          {/* Sign Out Button */}
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
  };

  const renderCurrentSection = () => {
    const sectionProps = {
      user,
      session,
      currentHome: state.currentHome,
      onBackToMenu: handleBackToMenu,
      onHomeChange: handleHomeChange
    };

    const sections: Record<string, React.ReactElement> = {
      'home-screen': (
        <MobileHomeScreen
          user={user}
          currentHome={state.currentHome}
          onSectionChange={handleSectionChangeTracked}
          onHomeChange={handleHomeChange}
        />
      ),
      'welcome': (
        <WelcomeJourney
          currentHome={state.currentHome}
          onComplete={() => handleSectionChange('home-screen')}
          onSkipToExplore={() => handleSectionChange('home-screen')}
          onAskQuestion={() => handleSectionChangeTracked('support-center')}
        />
      ),
      'main-menu': (
        <ComprehensiveMainMenu
          onMenuSelect={handleSectionChangeTracked}
          {...sectionProps}
          onBackToWelcome={() => handleSectionChange('welcome')}
          defaultTab={lastMenuTab}
          onTabChange={setLastMenuTab}
          onAccessibilityOpen={() => setShowMobileAccessibility(true)}
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
          currentHome={state.currentHome}
        />
      ),
      'meet-team': (
        <MeetTheTeam
          onBack={handleBackToMenu}
          currentHome={state.currentHome.id}
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
      'staff-admin': (
        <StaffAdminPanel
          onBack={handleBackToMenu}
        />
      ),
      'content-management': (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Button onClick={handleBackToMenu} variant="outline" className="font-bold">
                ← Back
              </Button>
            </div>
            <Card className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Content</h1>
              <p className="text-lg text-gray-900 mb-6">Resource Manager</p>
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                  <h3 className="text-lg font-bold text-gray-900">📖 Stories</h3>
                  <p className="text-sm text-gray-600 mt-1">Reflective stories and experiences</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <h3 className="text-lg font-bold text-gray-900">📚 Resources</h3>
                  <p className="text-sm text-gray-600 mt-1">Guides and materials</p>
                </Card>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-gray-800 font-medium">Content editing is managed by the admin team. Contact your manager to request changes.</p>
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
      'qr-scanner': (
        <MobileQRScanner
          isOpen={state.showQRScanner}
          onClose={() => setState(prev => ({ ...prev, showQRScanner: false }))}
          onQRDetected={handleQRDetected}
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
      'personal-wellbeing': (
        <DailyWellbeingCheckIn
          onBack={handleBackToMenu}
          user={user}
          onNavigateToSupport={() => setState(s => ({ ...s, currentSection: 'support-center' }))}
          onNavigateToResources={() => setState(s => ({ ...s, currentSection: 'digital-resources' }))}
          onNavigateToReflection={() => setState(s => ({ ...s, currentSection: 'reflection-toolkit' }))}
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

    return sections[state.currentSection as keyof typeof sections] || sections['main-menu'];
  };

  if (state.isLoading) {
    return (
      <div className={combineThemeClasses("min-h-screen flex items-center justify-center", okayitTheme.backgrounds.page)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <RefreshCw className="w-full h-full text-indigo-600" />
          </motion.div>
          <h2 className={combineThemeClasses("text-xl font-bold mb-2", okayitTheme.text.primary)}>
            Loading Your Experience...
          </h2>
          <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
            Setting up offline features
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={appRef}
      className={combineThemeClasses("min-h-screen relative", okayitTheme.backgrounds.page)}
    >
      {/* Safe area spacer for PWA */}
      <div className="pt-safe-top" />

      {/* Install App Banner */}
      <AnimatePresence>
        {state.isInstallable && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className={combineThemeClasses(
              "fixed top-16 left-4 right-4 z-40 p-4 rounded-xl",
              okayitTheme.backgrounds.card,
              "shadow-lg border"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={combineThemeClasses("font-semibold", okayitTheme.text.primary)}>
                  Install App
                </h3>
                <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
                  Get the full experience offline
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleInstallApp}
                className={okayitTheme.interactive.button}
              >
                <Download className="w-4 h-4 mr-1" />
                Install
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with gentle fade transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="relative z-0 pb-24"
        >
          {isPending ? renderPendingContent() : renderCurrentSection()}
        </motion.div>
      </AnimatePresence>

      {/* Mobile Navigation — hidden during welcome induction AND for pending users */}
      {!isPending && state.currentSection !== 'welcome' && (
        <MobileNavigation
          activeSection={state.currentSection}
          onSectionChange={handleSectionChange}
          notifications={state.notifications}
          user={user}
        />
      )}

      {/* QR Scanner */}
      {state.currentSection === 'qr-scanner' && (
        <MobileQRScanner
          isOpen={true}
          onClose={() => handleSectionChange('main-menu')}
          onQRDetected={handleQRDetected}
        />
      )}

      {/* Offline Indicator */}
      <AnimatePresence>
        {!state.isOnline && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={combineThemeClasses(
              "fixed bottom-24 left-4 right-4 p-3 rounded-lg z-40",
              okayitTheme.status.warning
            )}
          >
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">
                You're offline - Some features may be limited
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className={combineThemeClasses(
              "fixed top-20 right-4 p-3 rounded-lg z-40 max-w-xs",
              okayitTheme.status.error
            )}
          >
            <p className="text-sm font-medium">{state.error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="mt-2"
            >
              Dismiss
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Accessibility Settings Panel */}
      <AccessibilitySettingsPanel 
        isOpen={showMobileAccessibility}
        onClose={() => setShowMobileAccessibility(false)}
      />
    </div>
  );
}
