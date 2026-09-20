
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import existing desktop components
import EnhancedMainMenu from './enhanced-main-menu';
import EnhancedWelcomeGuide from './enhanced-welcome-guide';
import EnhancedHouseLayout from './enhanced-house-layout';
import FamilyGaming from './family-gaming';
import EnhancedStoryExperienceV2 from './enhanced-story-experience-v2';

// Utils
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { HomeContext, HOME_CONTEXTS, getHomeContext } from '@/lib/home-contexts';

interface DesktopAppWrapperProps {
  user?: any;
  session?: any;
  initialSection?: string;
}

export default function DesktopAppWrapper({ user, session, initialSection = 'main-menu' }: DesktopAppWrapperProps) {
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [currentHome, setCurrentHome] = useState<HomeContext>(HOME_CONTEXTS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const handleBackToMenu = () => {
    setCurrentSection('main-menu');
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

    const sections = {
      'main-menu': (
        <EnhancedMainMenu
          onMenuSelect={handleSectionChange}
          {...sectionProps}
        />
      ),
      'house-tour': (
        <EnhancedHouseLayout
          completedLocations={[]}
          onLocationSelect={(locationId: string) => {
            console.log('Location selected:', locationId);
          }}
          onBackToMenu={handleBackToMenu}
          currentSession={session}
        />
      ),
      'welcome-guide': (
        <EnhancedWelcomeGuide
          onBack={handleBackToMenu}
          currentHome={currentHome}
        />
      ),
      'family-gaming': (
        <FamilyGaming
          onBack={handleBackToMenu}
          user={user}
        />
      ),
      'reflective-stories': (
        <EnhancedStoryExperienceV2
          onBack={handleBackToMenu}
        />
      )
    };

    return sections[currentSection as keyof typeof sections] || sections['main-menu'];
  };

  return (
    <div className={combineThemeClasses("min-h-screen relative", okayitTheme.backgrounds.page)}>
      {/* Desktop Header Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={combineThemeClasses(
          "sticky top-0 z-50 border-b shadow-sm",
          okayitTheme.backgrounds.glass,
          "border-white/30 dark:border-purple-200/30"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Monitor className="w-6 h-6 text-indigo-600" />
              <div>
                <h1 className={combineThemeClasses("text-xl font-bold", okayitTheme.text.primary)}>
                  QR House Tour - Desktop Experience
                </h1>
                <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
                  Full-featured care home interactive platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="flex items-center space-x-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Desktop Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-6 py-4"
      >
        <Card className={combineThemeClasses("mb-6", okayitTheme.backgrounds.card)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={combineThemeClasses("text-sm font-semibold", okayitTheme.text.primary)}>
                    Desktop Mode Active
                  </span>
                </div>
                <div className="text-sm text-gray-900">|</div>
                <span className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
                  Enhanced navigation • Multi-window support • Keyboard shortcuts
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {renderCurrentSection()}
      </motion.div>

      {/* Desktop Footer */}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
                © {new Date().getFullYear()} OKAYiT - Interactive Care Home Experience
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-900">
                Desktop Version • Keyboard: ESC to return to menu
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
