
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, Tablet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { device, hapticFeedback } from '@/lib/mobile-utils';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

// Dynamic imports for better performance
const MobileApp = dynamic(() => import('./mobile/mobile-app'), {
  loading: () => <MobileAppSkeleton />,
  ssr: false
});

const ComprehensiveExperience = dynamic(() => import('./comprehensive-experience-wrapper'), {
  loading: () => <DesktopAppSkeleton />,
  ssr: false
});

const StaffWorkspace = dynamic(() => import('./staff/staff-workspace'), {
  loading: () => <DesktopAppSkeleton />,
  ssr: false
});

// New young person experience (v2) — four tabs, calm Help, two skins.
const YpExperience = dynamic(() => import('./yp/yp-experience'), {
  loading: () => <MobileAppSkeleton />,
  ssr: false
});

// Roles that get the professional staff workspace instead of the young person journey
const STAFF_ROLES = ['SUPER_ADMIN', 'HOME_ADMIN', 'STAFF'];

interface AdaptiveAppInterfaceProps {
  user?: any;
  session?: any;
  initialSection?: string;
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  isTouchDevice: boolean;
  isPWA: boolean;
  isStandalone: boolean;
  screenWidth: number;
  screenHeight: number;
}

export default function AdaptiveAppInterface({ user, session, initialSection }: AdaptiveAppInterfaceProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [forceInterface, setForceInterface] = useState<'mobile' | 'desktop' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    detectDevice();
    const params = new URLSearchParams(window.location.search);
    if (params.get('source') === 'pwa' || params.get('source') === 'shortcut') {
      setForceInterface('mobile');
    }
  }, []);

  const detectDevice = () => {
    if (typeof window === 'undefined') return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const isStandalone = device.isStandalone();

    let deviceType: 'mobile' | 'tablet' | 'desktop';
    
    if (device.isMobile() || screenWidth < 768) {
      deviceType = 'mobile';
    } else if (screenWidth >= 768 && screenWidth < 1024) {
      deviceType = 'tablet';
    } else {
      deviceType = 'desktop';
    }

    const info: DeviceInfo = {
      type: deviceType,
      isTouchDevice,
      isPWA,
      isStandalone,
      screenWidth,
      screenHeight
    };

    setDeviceInfo(info);
    setIsLoading(false);
    
    console.log('Device detected:', info);
  };

  const shouldUseMobileInterface = () => {
    if (forceInterface === 'mobile') return true;
    if (forceInterface === 'desktop') return false;
    if (!deviceInfo) return false;

    // Use mobile interface for:
    // - Mobile devices
    // - PWA/Standalone mode
    // - Touch devices with small screens
    // - Tablets in portrait mode
    return (
      deviceInfo.type === 'mobile' ||
      deviceInfo.isPWA ||
      deviceInfo.isStandalone ||
      (deviceInfo.isTouchDevice && deviceInfo.screenWidth < 1024) ||
      (deviceInfo.type === 'tablet' && deviceInfo.screenHeight > deviceInfo.screenWidth)
    );
  };

  const handleInterfaceSwitch = (interfaceType: 'mobile' | 'desktop') => {
    hapticFeedback.impact('medium');
    setForceInterface(interfaceType);
    
    // Save preference
    localStorage.setItem('preferredInterface', interfaceType);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Staff, managers and admins get a distinct professional workspace.
  // They never see the young person induction, quests or getting-started prompts.
  const isStaff = STAFF_ROLES.includes(String(user?.role || '').toUpperCase());
  if (isStaff) {
    return <StaffWorkspace user={user} session={session} />;
  }

  // Everyone else (young people and guests) gets the redesigned experience.
  return <YpExperience user={user} session={session} />;
}

// Interface Switcher Component
interface InterfaceSwitcherProps {
  currentInterface: 'mobile' | 'desktop';
  onSwitch: (interfaceType: 'mobile' | 'desktop') => void;
  deviceInfo: DeviceInfo;
}

function InterfaceSwitcher({ currentInterface, onSwitch, deviceInfo }: InterfaceSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <Card className="overflow-hidden bg-white border border-indigo-200 shadow-lg">
        <CardContent className="p-2">
          <div className="flex items-center space-x-2">
            {!isExpanded ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="flex items-center space-x-2 text-slate-800 hover:text-slate-900 hover:bg-indigo-50"
              >
                {currentInterface === 'mobile' ? (
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Monitor className="w-4 h-4 text-indigo-600" />
                )}
                <span className="text-sm font-medium text-slate-800">
                  {currentInterface === 'mobile' ? 'Mobile' : 'Desktop'}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600" />
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant={currentInterface === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onSwitch('mobile');
                    setIsExpanded(false);
                  }}
                  className="flex items-center space-x-1"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs">Mobile</span>
                  {deviceInfo.isTouchDevice && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      Touch
                    </Badge>
                  )}
                </Button>
                
                <Button
                  variant={currentInterface === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onSwitch('desktop');
                    setIsExpanded(false);
                  }}
                  className="flex items-center space-x-1"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-xs">Full Platform</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400"
                >
                  ×
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Loading Skeletons
function LoadingSkeleton() {
  return (
    <div className={combineThemeClasses("min-h-screen flex items-center justify-center", okayitTheme.backgrounds.page)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 mx-auto border border-indigo-600 border-t-transparent rounded-full"
        />
        <p className={combineThemeClasses("text-lg font-semibold", okayitTheme.text.primary)}>
          Optimizing Your Experience...
        </p>
        <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
          Detecting your device capabilities
        </p>
      </motion.div>
    </div>
  );
}

function MobileAppSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="h-16 bg-white/50 border-b mb-6"></div>
        
        {/* Content skeletons */}
        <div className="px-4 space-y-4">
          <div className="h-32 bg-white/50 rounded-2xl"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-white/50 rounded-xl"></div>
            <div className="h-24 bg-white/50 rounded-xl"></div>
          </div>
          <div className="h-40 bg-white/50 rounded-2xl"></div>
        </div>
        
        {/* Bottom nav skeleton */}
        <div className="fixed bottom-4 left-4 right-4">
          <div className="h-16 bg-white/80 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

function DesktopAppSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="animate-pulse">
        <div className="h-20 bg-white/50 border-b mb-8"></div>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-3 gap-8">
          <div className="h-64 bg-white/50 rounded-2xl"></div>
          <div className="h-64 bg-white/50 rounded-2xl"></div>
          <div className="h-64 bg-white/50 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
