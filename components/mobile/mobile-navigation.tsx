'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Heart, BookOpen, Shield, LayoutGrid, X,
  QrCode, Users, Gamepad2, Lightbulb, Trophy,
  Target, MessageCircle, Award, Network, Library,
  AudioLines, Video, Settings, Sparkles, FileText,
  TrendingUp, HardDrive, Clock, ChevronRight, Star, Wind
} from 'lucide-react';
import { hapticFeedback } from '@/lib/mobile-utils';
import ThemeToggle from '@/components/theme-toggle';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  notifications?: number;
  user?: any;
}

export default function MobileNavigation({ activeSection, onSectionChange, notifications = 0, user }: MobileNavigationProps) {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = React.useRef(0);
  const hideTimer = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Show nav when scrolling up, at top, or when menu is open
      if (delta < -5 || currentY < 50 || showFullMenu) {
        setNavVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        // Auto-hide after 3 seconds of no scroll
        hideTimer.current = setTimeout(() => {
          if (window.scrollY > 100 && !showFullMenu) setNavVisible(false);
        }, 3000);
      }
      // Hide nav when scrolling down
      else if (delta > 10 && currentY > 100) {
        setNavVisible(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showFullMenu]);

  const navTabs = [
    { id: 'home', section: 'home-screen', icon: Home, label: 'Home' },
    { id: 'checkin', section: 'personal-wellbeing', icon: Heart, label: 'Check-in' },
    { id: 'journal', section: 'my-journal', icon: BookOpen, label: 'Journal' },
    { id: 'support', section: 'support-center', icon: Shield, label: 'Support' },
    { id: 'menu', section: 'menu', icon: LayoutGrid, label: 'Menu' },
  ];

  const menuCategories = [
    {
      title: 'Getting Started',
      items: [
        { id: 'house-tour', label: 'Home Tour', icon: QrCode, color: 'bg-purple-500' },
        { id: 'welcome-guide', label: 'Welcome Guide', icon: BookOpen, color: 'bg-blue-500' },
        { id: 'meet-team', label: 'Meet the Team', icon: Users, color: 'bg-cyan-500' },
        { id: 'understanding-system', label: 'Your Rights', icon: Shield, color: 'bg-indigo-500' },
        { id: 'care-standards', label: '9 Standards', icon: Award, color: 'bg-green-500' },
        { id: 'what-happens-next', label: 'What Happens Next', icon: Clock, color: 'bg-teal-500' },
      ]
    },
    {
      title: 'Explore & Learn',
      items: [
        { id: 'positive-relationships', label: 'Relationships', icon: Heart, color: 'bg-orange-500' },
        { id: 'family-gaming', label: 'Games & Fun', icon: Gamepad2, color: 'bg-rose-500' },
        { id: 'reflective-stories', label: 'Real Stories', icon: AudioLines, color: 'bg-pink-500' },
        { id: 'reflection-toolkit', label: 'Reflection Space', icon: Lightbulb, color: 'bg-amber-500' },
        { id: 'digital-resources', label: 'Useful Guides', icon: Library, color: 'bg-blue-500' },
        { id: 'yp-resources', label: 'Your Resources', icon: Sparkles, color: 'bg-pink-500' },
        { id: 'virtual-tour', label: '360° Tour', icon: Video, color: 'bg-indigo-500' },
      ]
    },
    {
      title: 'Wellbeing & Support',
      items: [
        { id: 'personal-wellbeing', label: 'How Am I Feeling?', icon: Heart, color: 'bg-green-500' },
        { id: 'calm-corner', label: 'Calm Corner', icon: Wind, color: 'bg-sky-500' },
        { id: 'keyworker-resources', label: 'Your Key Worker', icon: Users, color: 'bg-purple-500' },
        { id: 'safety-plan', label: 'My Safety Plan', icon: Shield, color: 'bg-red-500' },
        { id: 'feedback', label: 'Your Feedback', icon: MessageCircle, color: 'bg-green-500' },
      ]
    },
    {
      title: 'My Stuff',
      items: [
        { id: 'identity-profile', label: 'About Me', icon: Sparkles, color: 'bg-pink-500' },
        { id: 'my-info', label: 'My Important Info', icon: Users, color: 'bg-blue-500' },
        { id: 'mood-trends', label: 'My Wellbeing Story', icon: TrendingUp, color: 'bg-green-500' },
        { id: 'progress', label: 'My Progress', icon: Target, color: 'bg-purple-500' },
        { id: 'achievements', label: 'Certificates', icon: Trophy, color: 'bg-amber-500' },
        { id: 'data-backup', label: 'Backup Data', icon: HardDrive, color: 'bg-gray-500' },
      ]
    },
  ];

  // Add admin items
  if (user?.isAdmin || user?.role === 'SUPER_ADMIN' || user?.role === 'HOME_ADMIN' || user?.role === 'STAFF') {
    menuCategories.push({
      title: 'Staff Area',
      items: [
        { id: 'admin-dashboard', label: 'Dashboard', icon: Settings, color: 'bg-purple-600' },
        { id: 'staff-admin', label: 'Staff Admin', icon: Settings, color: 'bg-indigo-600' },
      ]
    });
  }

  const handleNavClick = (tab: typeof navTabs[0]) => {
    hapticFeedback.selection();
    if (tab.id === 'menu') {
      setShowFullMenu(true);
    } else {
      onSectionChange(tab.section);
    }
  };

  const handleMenuItemClick = (sectionId: string) => {
    hapticFeedback.selection();
    onSectionChange(sectionId);
    setShowFullMenu(false);
  };

  const isActive = (tab: typeof navTabs[0]) => {
    if (tab.id === 'home') return activeSection === 'home-screen' || activeSection === 'main-menu';
    if (tab.id === 'menu') return showFullMenu;
    return activeSection === tab.section;
  };

  return (
    <>
      {/* Full Menu Overlay */}
      <AnimatePresence>
        {showFullMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white border-t border-gray-200 shadow-2xl"
            >
              <div className="p-5">
                {/* Handle bar */}
                <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-black text-gray-900">All Features</h2>
                  <button
                    onClick={() => setShowFullMenu(false)}
                    aria-label="Close menu"
                    className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Menu Categories */}
                {menuCategories.map((cat) => (
                  <div key={cat.title} className="mb-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{cat.title}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const active = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.id)}
                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all ${
                              active
                                ? 'bg-purple-100 ring-1 ring-purple-300'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-md`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Settings row */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => handleMenuItemClick('accessibility-settings')}
                    className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">Easier to Read</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                  </button>
                  <ThemeToggle />
                </div>
                <div className="mb-20" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar — auto-hides on scroll */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom transition-transform duration-300 ${
          navVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around px-2 py-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab);
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNavClick(tab)}
                  aria-label={tab.label}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex flex-col items-center justify-center py-2 px-3 min-h-[44px] rounded-xl transition-all min-w-0 flex-1 ${
                    active ? 'text-purple-700' : 'text-gray-500'
                  }`}
                >
                  <div className={`relative p-1.5 rounded-xl transition-all ${
                    active ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : ''
                  }`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span className={`text-[10px] font-bold mt-1 ${
                    active ? 'text-purple-700' : 'text-gray-500'
                  }`}>
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
